import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
import api from './api'

interface ErrorResponse {
  message: string
}

export async function httpRequest<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await api.request<T>({ method, url, data, ...config })
    return response.data
  } catch (e) {
    if (axios.isAxiosError<ErrorResponse>(e)) {
      throw new Error(
        e.response?.data?.message ||
          e.message ||
          'Ocorreu um erro inesperado na comunicação com o servidor.'
      )
    }
    throw new Error('Ocorreu um erro inesperado na comunicação com o servidor.')
  }
}
