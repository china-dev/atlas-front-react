import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type { CreateIndicationSchemaValues } from '../schemas/indication.schema'
import { toast } from '@/shared/components/ui/toast/use-toast'

export function useIndicationCreate(onSuccess?: () => void) {
  const { t } = useTranslation()
  const [isFormOpened, setIsFormOpened] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const openForm = useCallback(() => setIsFormOpened(true), [])
  const closeForm = useCallback(() => setIsFormOpened(false), [])

  const handleSubmit = useCallback(
    async (values: CreateIndicationSchemaValues) => {
      setIsSubmitting(true)
      try {
        // Simulate API call with mock delay
        await new Promise((resolve) => setTimeout(resolve, 800))
        console.log('Creating indication:', values)
        toast({
          title: t('common.success'),
          description: t('common.updateMessage'),
          variant: 'success',
        })
        closeForm()
        onSuccess?.()
      } catch (error) {
        console.error('Erro ao criar indicação:', error)
        toast({
          title: t('common.error'),
          description: t('common.errorMessage'),
          variant: 'destructive',
        })
      } finally {
        setIsSubmitting(false)
      }
    },
    [closeForm, onSuccess, t]
  )

  return { isFormOpened, isSubmitting, openForm, closeForm, handleSubmit }
}
