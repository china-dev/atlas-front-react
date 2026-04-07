import { useState, useEffect, useRef, useCallback } from 'react';

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface FetchResponse<T> {
  data: T[];
  meta: PaginationState;
}

export interface UseListingOptions<T> {
  fetcher: (filterQuery: string) => Promise<FetchResponse<T>>;
  initialPage?: number;
  itemsPerPage?: number;
  enablePagination?: boolean;
}

export function useListing<T>(options: UseListingOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: options.initialPage || 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: options.itemsPerPage || 10
  });

  const searchRef = useRef(searchQuery);
  searchRef.current = searchQuery;

  const load = useCallback(
    async (page: number, search: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const filterObj = {
          search: search || undefined,
          ...(options.enablePagination !== false && {
            page,
            limit: options.itemsPerPage || 10
          })
        };
        const response = await options.fetcher(JSON.stringify(filterObj));
        setData(response.data);
        if (options.enablePagination !== false) setPagination(response.meta);
      } catch (err) {
        setError((err as Error).message || 'Erro ao carregar os dados.');
      } finally {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options.fetcher, options.enablePagination, options.itemsPerPage]
  );

  // initial load
  useEffect(() => {
    load(pagination.currentPage, searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // reload on page change
  useEffect(() => {
    load(pagination.currentPage, searchRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.currentPage]);

  // reload on search change (reset to page 1)
  const prevSearch = useRef(searchQuery);
  useEffect(() => {
    if (prevSearch.current === searchQuery) return;
    prevSearch.current = searchQuery;
    setPagination(p => ({ ...p, currentPage: 1 }));
    load(1, searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const setPage = (page: number) => setPagination(p => ({ ...p, currentPage: page }));
  const reload = () => load(pagination.currentPage, searchRef.current);

  return { data, isLoading, error, searchQuery, setSearchQuery, pagination, setPage, reload };
}
