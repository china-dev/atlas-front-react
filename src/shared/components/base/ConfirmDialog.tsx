import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from '@/shared/components/ui/alert-dialog'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (value: boolean) => void
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  isLoading?: boolean
  onConfirm: () => void
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText,
  cancelText,
  confirmVariant = 'default',
  isLoading = false,
  onConfirm,
}: ConfirmDialogProps) {
  const { t } = useTranslation()

  const resolvedTitle = title ?? t('common.confirm.title')
  const resolvedDescription = description ?? t('common.confirm.description')
  const resolvedConfirmText = confirmText ?? t('common.confirm.confirmText')
  const resolvedCancelText = cancelText ?? t('common.cancel')

  const handleOpenChange = (value: boolean) => {
    if (isLoading) return
    onOpenChange(value)
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{resolvedTitle}</AlertDialogTitle>
          <AlertDialogDescription>{resolvedDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{resolvedCancelText}</AlertDialogCancel>
          <Button variant={confirmVariant} disabled={isLoading} onClick={onConfirm}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {resolvedConfirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
