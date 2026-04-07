import { httpRequest } from '@/core/http/request.helper';
import type { FetchResponse } from '@/shared/hooks/useListing';
import type { IndicationRow } from '../types/indication.type';

interface ApiIndication {
  id: number;
  name: string;
  city_id: number;
  organization_id: number;
  grant_date: string;
  created_at: string;
  updated_at: string;
}

interface ApiPagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

interface ApiIndicationListResponse {
  data: ApiIndication[];
  pagination: ApiPagination;
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('pt-BR');
}

export async function fetchIndications(filterString: string): Promise<FetchResponse<IndicationRow>> {
  const { search, page, limit } = JSON.parse(filterString) as {
    search?: string;
    page?: number;
    limit?: number;
  };

  const response = await httpRequest<ApiIndicationListResponse>(
    'GET',
    '/geographical-indications',
    undefined,
    { params: { page, per_page: limit, search } }
  );

  const rows: IndicationRow[] = response.data.map((item) => ({
    id: item.id,
    name: item.name,
    img: '',
    registrationNumber: '',
    organization: '',
    address: { city: '', state: '' },
    createdAt: formatDate(item.created_at),
    concessionDate: item.grant_date,
  }));

  return {
    data: rows,
    meta: {
      currentPage: response.pagination.current_page,
      totalPages: response.pagination.last_page,
      totalItems: response.pagination.total,
      itemsPerPage: response.pagination.per_page,
    },
  };
}

export async function deleteIndication(id: number): Promise<void> {
  await httpRequest('DELETE', '/geographical-indications/' + id);
}
