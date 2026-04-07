import { z } from 'zod';

export const createIndicationSchema = z.object({
  indication_name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres.'),
  organization_name: z.string().min(2, 'A organização deve ter no mínimo 2 caracteres.')
});

export type CreateIndicationSchemaValues = z.infer<typeof createIndicationSchema>;
