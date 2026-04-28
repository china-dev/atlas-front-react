import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type { UpdateIndicationSchemaValues } from '../schemas/indication.schema'
import type { ApiIndicationDetail } from '../types/indication.type'
import { toast } from '@/shared/components/ui/toast/use-toast'
import { updateIndication } from '../services/indication.service'

export function useIndicationEdit(onSuccess?: () => void) {
  const { t } = useTranslation()
  const [isFormOpened, setIsFormOpened] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editTarget, setEditTarget] = useState<ApiIndicationDetail | null>(null)

  const openForm = useCallback((indication: ApiIndicationDetail) => {
    setEditTarget(indication)
    setIsFormOpened(true)
  }, [])

  const closeForm = useCallback(() => {
    setIsFormOpened(false)
    // editTarget is kept until the next openForm call so the Radix exit
    // animation can finish before the dialog is removed from the tree.
  }, [])

  const handleSubmit = useCallback(
    async (values: UpdateIndicationSchemaValues) => {
      if (!editTarget) return
      setIsSubmitting(true)
      try {
        await updateIndication(editTarget.id, values)
        toast({
          title: t('common.success'),
          description: t('common.updateMessage'),
          variant: 'success',
        })
        closeForm()
        onSuccess?.()
      } catch {
        toast({
          title: t('common.error'),
          description: t('common.errorMessage'),
          variant: 'destructive',
        })
      } finally {
        setIsSubmitting(false)
      }
    },
    [editTarget, closeForm, onSuccess, t]
  )

  return { isFormOpened, isSubmitting, editTarget, openForm, closeForm, handleSubmit }
}
