import api from './api';
import type { AxiosRequestConfig, AxiosError } from 'axios';

interface ErrorResponse {
  message: string;
}

export async function httpRequest<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await api.request<T>({ method, url, data, ...config });
    return response.data;
  } catch (e) {
    const error = e as AxiosError<ErrorResponse>;
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        'Ocorreu um erro inesperado na comunicação com o servidor.'
    );
  }
}
