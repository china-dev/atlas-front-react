import { z } from 'zod'
import type { TFunction } from 'i18next'

export function createIndicationSchema(t: TFunction) {
  return z.object({
    name: z.string().min(3, t('indicationListing.create.form.errors.name')),
    ip: z.enum(['IP', 'DO']),
    city_id: z.string().min(1, t('indicationListing.create.form.errors.city')),
    organization_id: z.string().min(1, t('indicationListing.create.form.errors.organization')),
    grant_date: z.string().min(1, t('indicationListing.create.form.errors.grantDate')),
  })
}

export function updateIndicationSchema(t: TFunction) {
  return createIndicationSchema(t)
}

export type CreateIndicationSchemaValues = z.infer<ReturnType<typeof createIndicationSchema>>
export type UpdateIndicationSchemaValues = z.infer<ReturnType<typeof updateIndicationSchema>>
