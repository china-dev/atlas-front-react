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
