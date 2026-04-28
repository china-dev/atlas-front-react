import { useTranslation } from 'react-i18next'
import { DetailContainer, DetailField } from '@/shared/components/base/DetailContainer'
import type { ApiIndicationDetail } from '../types/indication.type'

interface Props {
  data: ApiIndicationDetail
  onEdit?: () => void
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR')
}

export function IndicationMainContainer({ data, onEdit }: Props) {
  const { t } = useTranslation()

  return (
    <DetailContainer title={t('indicationDetail.sections.main')} onEdit={onEdit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DetailField label={t('indicationDetail.fields.id')} value={data.id} />
        <DetailField label={t('indicationDetail.fields.name')} value={data.name} />
        <DetailField label={t('indicationDetail.fields.ip')} value={data.ip ?? '—'} />
        <DetailField
          label={t('indicationDetail.fields.grantDate')}
          value={formatDate(data.grant_date)}
        />
      </div>
    </DetailContainer>
  )
}
