import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Trash2, FileSearch, PlusCircle, Link } from 'lucide-react'
import { useIndications } from './hooks/useIndication'
import { useIndicationCreate } from './hooks/useIndicationCreate'
import { ListingTable } from '@/shared/components/base/ListingTable'
import { ConfirmDialog } from '@/shared/components/base/ConfirmDialog'
import { FormDialog } from '@/shared/components/base/FormDialog'
import { IndicationCreateForm } from './components/IndicationCreateForm'
import { Button } from '@/shared/components/ui/button'
import type { IndicationRow } from './types/indication.type'

export default function IndicationListingPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const {
    columns,
    data,
    isLoading,
    pagination,
    searchQuery,
    setSearchQuery,
    setPage,
    reload,
    isConfirmDialogOpen,
    setIsConfirmDialogOpen,
    isDeleting,
    promptDelete,
    executeDelete,
  } = useIndications()

  const { isFormOpened, isSubmitting, openForm, closeForm, handleSubmit } =
    useIndicationCreate(reload)

  const renderCell = useCallback(
    (columnId: string, row: IndicationRow) => {
      if (columnId === 'name') {
        return (
          <span
            className="inline-flex items-center gap-1.5 font-medium text-foreground hover:underline cursor-pointer"
            onClick={() => navigate(`/indicacao-geografica/${row.id}`)}
          >
            {row.name}
            <Link className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          </span>
        )
      }
      if (columnId === 'actions') {
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive"
              disabled={isLoading}
              onClick={() => promptDelete(row)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary"
              onClick={() => navigate(`/indicacao-geografica/${row.id}`)}
            >
              <FileSearch className="w-4 h-4" />
            </Button>
          </div>
        )
      }
      return null
    },
    [isLoading, navigate, promptDelete]
  )

  return (
    <div className="space-y-4">
      <ListingTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        enableSearch
        enablePagination
        pagination={pagination}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onPageChange={setPage}
        renderCell={renderCell}
        toolbarActions={
          <Button disabled={isLoading} onClick={openForm}>
            <PlusCircle className="w-4 h-4 mr-2" />
            {t('common.newRegister')}
          </Button>
        }
      />

      <ConfirmDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        title={t('common.delete.title')}
        description={t('common.delete.message')}
        confirmText={t('common.delete.confirm')}
        cancelText={t('common.delete.cancel')}
        confirmVariant="destructive"
        isLoading={isDeleting}
        onConfirm={executeDelete}
      />

      <FormDialog
        open={isFormOpened}
        onOpenChange={closeForm}
        isLoading={isSubmitting}
        title={t('indicationListing.create.title')}
        description={t('indicationListing.create.description')}
        formId="create-indication-form"
      >
        <IndicationCreateForm
          id="create-indication-form"
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      </FormDialog>
    </div>
  )
}
