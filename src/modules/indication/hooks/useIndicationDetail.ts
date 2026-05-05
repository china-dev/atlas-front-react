import { useState, useEffect, useRef, useCallback } from 'react'
import type { ApiIndicationDetail } from '../types/indication.type'
import { fetchIndicationById } from '../services/indication.service'

export function useIndicationDetail(id: number) {
  const [data, setData] = useState<ApiIndicationDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const abortRef = useRef<AbortController | null>(null)

  const load = useCallback(async () => {
    if (!Number.isInteger(id) || id <= 0) {
      setIsLoading(false)
      setError('invalid_id')
      return
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setIsLoading(true)
    setError(null)
    try {
      const raw = await fetchIndicationById(id, controller.signal)
      if (!controller.signal.aborted) {
        setData(raw)
      }
    } catch (e) {
      if (!controller.signal.aborted) {
        console.error('[useIndicationDetail]', e)
        setError('fetch_failed')
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false)
      }
    }
  }, [id])

  useEffect(() => {
    load()
    return () => abortRef.current?.abort()
  }, [load])

  return { data, isLoading, error, reload: load }
}
