import { useTranslation } from 'react-i18next'
import { DetailContainer, DetailField } from '@/shared/components/base/DetailContainer'
import type { ApiIndicationDetail } from '../types/indication.type'

interface Props {
  data: ApiIndicationDetail
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR')
}

export function IndicationAuditContainer({ data }: Props) {
  const { t } = useTranslation()

  return (
    <DetailContainer title={t('indicationDetail.sections.audit')}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DetailField
          label={t('indicationDetail.fields.grantDate')}
          value={formatDate(data.grant_date)}
        />
        <DetailField
          label={t('indicationDetail.fields.createdAt')}
          value={formatDate(data.created_at)}
        />
        <DetailField
          label={t('indicationDetail.fields.updatedAt')}
          value={formatDate(data.updated_at)}
        />
      </div>
    </DetailContainer>
  )
}
