import { useState, useEffect } from 'react'
import { fetchIndications } from '@/modules/indication/services/indication.service'

export interface DashboardStats {
  totalIndications: number
  recentIndications: string[]
  isLoading: boolean
  error: string | null
}

export function useDashboardStats(): DashboardStats {
  const [stats, setStats] = useState<DashboardStats>({
    totalIndications: 0,
    recentIndications: [],
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    const controller = new AbortController()

    fetchIndications({ page: 1, limit: 5, signal: controller.signal })
      .then((res) => {
        setStats({
          totalIndications: res.meta.totalItems,
          recentIndications: res.data.map((r) => r.name),
          isLoading: false,
          error: null,
        })
      })
      .catch((e) => {
        if (e instanceof Error && e.message !== 'canceled') {
          setStats((s) => ({ ...s, isLoading: false, error: 'Erro ao carregar dados.' }))
        }
      })

    return () => controller.abort()
  }, [])

  return stats
}
