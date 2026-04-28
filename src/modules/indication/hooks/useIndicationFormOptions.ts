import { useState, useEffect } from 'react'
import { fetchCityOptions, fetchOrganizationOptions } from '../services/indication.service'
import type { SelectOption } from '@/shared/types/common.type'

export function useIndicationFormOptions() {
  const [cities, setCities] = useState<SelectOption[]>([])
  const [organizations, setOrganizations] = useState<SelectOption[]>([])
  const [isLoadingOptions, setIsLoadingOptions] = useState(true)
  const [optionsError, setOptionsError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    Promise.all([fetchCityOptions(controller.signal), fetchOrganizationOptions(controller.signal)])
      .then(([cityList, orgList]) => {
        setCities(cityList)
        setOrganizations(orgList)
        setIsLoadingOptions(false)
      })
      .catch((e) => {
        if (e instanceof Error && e.message !== 'canceled') {
          setOptionsError(e.message)
          setIsLoadingOptions(false)
        }
      })

    return () => controller.abort()
  }, [])

  return { cities, organizations, isLoadingOptions, optionsError }
}
