import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/axios'
import { type LoginResponse } from '@/types/auth'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()

  const formSchema = z
    .object({
      uuid: z.string().min(1, t('auth.uuidRequired')),
      password: z.string().min(6, t('auth.passwordMinLength')),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('auth.passwordsMatch'),
      path: ['confirmPassword'],
    })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      uuid: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // 1. Create User
      await api.post('/users', {
        uuid: values.uuid,
        plainPassword: values.password,
      })

      // 2. Login (get token)
      // Login check uses 'username', which maps to our 'uuid'
      const response = await api.post<LoginResponse>(
        '/login_check',
        { username: values.uuid, password: values.password },
        { _skipAuthRefresh: true } as object,
      )
      login(response.data.token, response.data.refresh_token)
      await navigate('/')
    } catch (err: unknown) {
      console.error(err)
      setError(t('auth.registrationFailed'))
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="absolute right-4 top-4">
        <LanguageSwitcher />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('auth.register')}</CardTitle>
          <CardDescription>{t('auth.registerDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="uuid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.uuid')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('auth.uuid')} data-testid="register-uuid" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.password')}</FormLabel>
                    <FormControl>
                      <Input type="password" data-testid="register-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.confirmPassword')}</FormLabel>
                    <FormControl>
                      <Input type="password" data-testid="register-confirm-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error ? (
                <div className="text-sm text-red-500" data-testid="register-error">
                  {error}
                </div>
              ) : null}
              <Button type="submit" className="w-full" data-testid="register-submit">
                {t('auth.signUp')}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            {t('auth.haveAccount')}{' '}
            <Link to="/login" className="text-blue-500 hover:underline">
              {t('auth.signIn')}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
