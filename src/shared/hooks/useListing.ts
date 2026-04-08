import { useState, useEffect, useRef, useCallback } from 'react'

export interface PaginationState {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export interface FetchResponse<T> {
  data: T[]
  meta: PaginationState
}

export interface ListingFilter {
  search?: string
  page?: number
  limit?: number
}

export interface UseListingOptions<T> {
  fetcher: (filter: ListingFilter) => Promise<FetchResponse<T>>
  initialPage?: number
  itemsPerPage?: number
  enablePagination?: boolean
}

export function useListing<T>(options: UseListingOptions<T>) {
  const [data, setData] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: options.initialPage || 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: options.itemsPerPage || 10,
  })

  const searchRef = useRef(searchQuery)
  searchRef.current = searchQuery

  const fetcherRef = useRef(options.fetcher)
  fetcherRef.current = options.fetcher

  const enablePaginationRef = useRef(options.enablePagination)
  enablePaginationRef.current = options.enablePagination

  const itemsPerPageRef = useRef(options.itemsPerPage)
  itemsPerPageRef.current = options.itemsPerPage

  const load = useCallback(async (page: number, search: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const filterObj: ListingFilter = {
        search: search || undefined,
        ...(enablePaginationRef.current !== false && {
          page,
          limit: itemsPerPageRef.current || 10,
        }),
      }
      const response = await fetcherRef.current(filterObj)
      setData(response.data)
      if (enablePaginationRef.current !== false) setPagination(response.meta)
    } catch (err) {
      setError((err as Error).message || 'Erro ao carregar os dados.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // initial load — intentionally runs once on mount
  useEffect(() => {
    load(pagination.currentPage, searchQuery)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // reload on page change
  useEffect(() => {
    load(pagination.currentPage, searchRef.current)
  }, [load, pagination.currentPage])

  // reload on search change (reset to page 1)
  const prevSearch = useRef(searchQuery)
  useEffect(() => {
    if (prevSearch.current === searchQuery) return
    prevSearch.current = searchQuery
    setPagination((p) => ({ ...p, currentPage: 1 }))
    load(1, searchQuery)
  }, [load, searchQuery])

  const setPage = (page: number) => setPagination((p) => ({ ...p, currentPage: page }))
  const reload = () => load(pagination.currentPage, searchRef.current)

  return { data, isLoading, error, searchQuery, setSearchQuery, pagination, setPage, reload }
}
