import { z } from 'zod'
import type { TFunction } from 'i18next'

export function createIndicationSchema(t: TFunction) {
  return z.object({
    indication_name: z.string().min(3, t('indicationListing.create.form.errors.name')),
    organization_name: z.string().min(2, t('indicationListing.create.form.errors.organization')),
  })
}

export type CreateIndicationSchemaValues = z.infer<ReturnType<typeof createIndicationSchema>>
