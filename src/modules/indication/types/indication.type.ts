export interface ApiIndicationDetail {
  id: number
  ip: string | null
  name: string
  city_id: number
  organization_id: number
  grant_date: string
  created_at: string
  updated_at: string
  city: {
    id: number
    name: string
    state: {
      id: number
      name: string
      uf: string
    }
  }
  organization: {
    id: number
    name: string
  }
}

export interface UpdateIndicationPayload {
  name: string
  ip?: string
  city_id: number
  organization_id: number
  grant_date: string
}

export interface IndicationApiResponse {
  id: number
  ip?: string
  internal_uuid: string
  indication_name: string
  image_url: string
  registration_code: string
  organization_name: string
  location: {
    city: string
    state: string
    country: string
    zip_code: string
    coordinates: { lat: number; lng: number }
  }
  created_at: string
  concession_date: string
  is_active: boolean
  audit_logs: string[]
}

export interface IndicationRow {
  id: number
  ip: string
  name: string
  cityId: number
  organizationId: number
  concessionDate: string
  createdAt: string
}
