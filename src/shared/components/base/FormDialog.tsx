import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogClose
} from '@/shared/components/ui/dialog';

interface FormDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  isLoading: boolean;
  title: string;
  description?: string;
  formId: string;
  children: React.ReactNode;
}

export function FormDialog({
  open,
  onOpenChange,
  isLoading,
  title,
  description,
  formId,
  children
}: FormDialogProps) {
  const { t } = useTranslation();

  const handleOpenChange = (value: boolean) => {
    if (isLoading) return;
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {children}

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isLoading}>
              {t('common.cancel')}
            </Button>
          </DialogClose>
          <Button form={formId} type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('common.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
