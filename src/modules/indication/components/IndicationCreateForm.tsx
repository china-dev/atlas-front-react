import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { createIndicationSchema, type CreateIndicationSchemaValues } from '../schemas/indication.schema';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

interface IndicationCreateFormProps {
  id: string;
  isSubmitting: boolean;
  onSubmit: (values: CreateIndicationSchemaValues) => void;
}

export function IndicationCreateForm({ id, isSubmitting, onSubmit }: IndicationCreateFormProps) {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm<CreateIndicationSchemaValues>({
    resolver: zodResolver(createIndicationSchema)
  });

  return (
    <form id={id} className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="indication_name">
          {t('indicationListing.create.form.name.label')}
        </Label>
        <Input
          id="indication_name"
          placeholder={t('indicationListing.create.form.name.placeholder')}
          disabled={isSubmitting}
          {...register('indication_name')}
        />
        {errors.indication_name && (
          <p className="text-sm text-destructive">{errors.indication_name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="organization_name">
          {t('indicationListing.create.form.organization.label')}
        </Label>
        <Input
          id="organization_name"
          placeholder={t('indicationListing.create.form.organization.placeholder')}
          disabled={isSubmitting}
          {...register('organization_name')}
        />
        {errors.organization_name && (
          <p className="text-sm text-destructive">{errors.organization_name.message}</p>
        )}
      </div>
    </form>
  );
}
