import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Pencil } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

interface DetailFieldProps {
  label: string
  value: ReactNode
}

function DetailField({ label, value }: DetailFieldProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
      <span className="text-sm text-foreground">{value ?? '—'}</span>
    </div>
  )
}

interface DetailContainerProps {
  title: string
  children: ReactNode
  onEdit?: () => void
}

export function DetailContainer({ title, children, onEdit }: DetailContainerProps) {
  const { t } = useTranslation()

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm">
      {/* Container Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {onEdit && (
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Pencil className="w-3.5 h-3.5 mr-1.5" />
            {t('common.edit')}
          </Button>
        )}
      </div>
      {/* Container Body */}
      <div className="px-6 py-4">{children}</div>
    </div>
  )
}

export { DetailField }
