import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { httpRequest } from '@/core/http/request.helper'
import { toast } from '@/shared/components/ui/toast/use-toast'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { useThemeStore } from '@/core/store/theme.store'
import logoLight from '@/assets/img/geral/logo.png'
import logoDark from '@/assets/img/geral/logo-dark.png'

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Campo obrigatório'),
})

type LoginSchemaValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { theme } = useThemeStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (values: LoginSchemaValues) => {
    try {
      // TODO: endpoint não implementado no backend — será funcional quando POST /auth/login existir
      const response = await httpRequest<{ token: string }>('POST', '/auth/login', {
        email: values.email,
        password: values.password,
      })
      localStorage.setItem('atlas-token', response.token)
      navigate('/')
    } catch {
      toast({
        title: t('common.error'),
        description: 'Não foi possível realizar o login. Verifique suas credenciais.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm p-8 bg-card border border-border rounded-lg shadow-sm space-y-6">
        <div className="flex justify-center">
          <img
            src={theme === 'dark' ? logoDark : logoLight}
            alt="Atlas Territorial do Turismo"
            className="h-auto w-full max-w-[180px]"
          />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              disabled={isSubmitting}
              {...register('email')}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              disabled={isSubmitting}
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Entrar
          </Button>
        </form>
      </div>
    </div>
  )
}
