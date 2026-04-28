import { useTranslation } from 'react-i18next'
import { DetailContainer } from '@/shared/components/base/DetailContainer'
import type { IndicationApiResponse } from '../types/indication.type'

// [RELATIONAL_CONTAINER] — Mídia associada à indicação
interface Props {
  data: Pick<IndicationApiResponse, 'image_url'>
  onEdit?: () => void
}

export function IndicationMediaContainer({ data, onEdit }: Props) {
  const { t } = useTranslation()

  return (
    <DetailContainer title={t('indicationDetail.sections.media')} onEdit={onEdit}>
      {data.image_url ? (
        <img
          src={data.image_url}
          alt={t('indicationDetail.fields.image')}
          className="h-48 w-full object-contain rounded-md border border-border bg-muted"
        />
      ) : (
        <div className="h-48 flex items-center justify-center bg-muted rounded-md border border-border">
          <span className="text-sm text-muted-foreground">
            {t('indicationDetail.fields.image')} —
          </span>
        </div>
      )}
    </DetailContainer>
  )
}
