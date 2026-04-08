import { httpRequest } from '@/core/http/request.helper'
import type { FetchResponse, ListingFilter } from '@/shared/hooks/useListing'
import type { IndicationRow } from '../types/indication.type'

interface ApiIndication {
  id: number
  ip: string
  name: string
  city_id: number
  organization_id: number
  grant_date: string
  created_at: string
  updated_at: string
}

interface ApiPagination {
  total: number
  per_page: number
  current_page: number
  last_page: number
  from: number
  to: number
}

interface ApiIndicationListResponse {
  data: ApiIndication[]
  pagination: ApiPagination
}

function formatDate(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleDateString('pt-BR')
}

export async function fetchIndications(
  filter: ListingFilter
): Promise<FetchResponse<IndicationRow>> {
  const { search, page, limit } = filter

  const response = await httpRequest<ApiIndicationListResponse>(
    'GET',
    '/geographical-indications',
    undefined,
    { params: { page, per_page: limit, search } }
  )

  const rows: IndicationRow[] = response.data.map((item) => ({
    id: item.id,
    ip: item.ip,
    name: item.name,
    cityId: item.city_id,
    organizationId: item.organization_id,
    concessionDate: item.grant_date,
    createdAt: formatDate(item.created_at),
  }))

  return {
    data: rows,
    meta: {
      currentPage: response.pagination.current_page,
      totalPages: response.pagination.last_page,
      totalItems: response.pagination.total,
      itemsPerPage: response.pagination.per_page,
    },
  }
}

export async function deleteIndication(id: number): Promise<void> {
  await httpRequest('DELETE', '/geographical-indications/' + id)
}

export interface CreateIndicationPayload {
  indication_name: string
  organization_name: string
}

export async function createIndication(payload: CreateIndicationPayload): Promise<void> {
  await httpRequest('POST', '/geographical-indications', payload)
}
