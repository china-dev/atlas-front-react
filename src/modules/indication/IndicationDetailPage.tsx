import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/components/ui/button'
import { Spinner } from '@/shared/components/ui/spinner'
import { useBreadcrumbStore } from '@/core/store/breadcrumb.store'
import { FormDialog } from '@/shared/components/base/FormDialog'
import { IndicationMainContainer } from './containers/IndicationMainContainer'
import { IndicationLocationContainer } from './containers/IndicationLocationContainer'
import { IndicationOrganizationContainer } from './containers/IndicationOrganizationContainer'
import { IndicationAuditContainer } from './containers/IndicationAuditContainer'
import { IndicationEditForm } from './components/IndicationEditForm'
import { useIndicationDetail } from './hooks/useIndicationDetail'
import { useIndicationEdit } from './hooks/useIndicationEdit'

export default function IndicationDetailPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const { data, isLoading, error, reload } = useIndicationDetail(Number(id))
  const { isFormOpened, isSubmitting, editTarget, openForm, closeForm, handleSubmit } =
    useIndicationEdit(reload)

  const setTitle = useBreadcrumbStore((s) => s.setTitle)
  const clearTitle = useBreadcrumbStore((s) => s.clearTitle)

  useEffect(() => {
    if (data) setTitle(data.name)
    return () => clearTitle()
  }, [data, setTitle, clearTitle])

  const handleEdit = () => {
    if (data) openForm(data)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <span className="text-sm text-destructive">{error ?? t('common.errorMessage')}</span>
        <Button variant="ghost" size="sm" onClick={() => navigate('/indicacao-geografica')}>
          {t('indicationDetail.backToList')}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <IndicationMainContainer data={data} onEdit={handleEdit} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IndicationLocationContainer data={data} />
        <IndicationOrganizationContainer data={data} />
      </div>

      <IndicationAuditContainer data={data} />

      <FormDialog
        open={isFormOpened}
        onOpenChange={closeForm}
        isLoading={isSubmitting}
        title={t('indicationListing.edit.title')}
        description={t('indicationListing.edit.description')}
        formId="edit-indication-form"
      >
        {editTarget && (
          <IndicationEditForm
            id="edit-indication-form"
            isSubmitting={isSubmitting}
            initialData={editTarget}
            onSubmit={handleSubmit}
          />
        )}
      </FormDialog>
    </div>
  )
}
