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

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [isDemoLoading, setIsDemoLoading] = useState(false)
  const { t } = useTranslation()

  const formSchema = z.object({
    username: z.string().min(1, t('auth.usernameRequired')),
    password: z.string().min(1, t('auth.passwordRequired')),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await api.post<LoginResponse>('/login_check', {
        username: values.username,
        password: values.password,
      })
      login(response.data.token, response.data.refresh_token)
      await navigate('/')
    } catch (err: unknown) {
      console.error(err)
      setError(t('auth.invalidCredentials'))
    }
  }

  async function onDemoLogin() {
    setIsDemoLoading(true)
    setError(null)
    try {
      const response = await api.post<{ username: string }>('/demo-account', {})
      const { username } = response.data

      const loginResponse = await api.post<LoginResponse>('/login_check', {
        username,
        // eslint-disable-next-line sonarjs/no-hardcoded-passwords
        password: 'demo',
      })
      login(loginResponse.data.token, loginResponse.data.refresh_token)
      await navigate('/')
    } catch (err: unknown) {
      console.error(err)
      setError(t('auth.invalidCredentials'))
    } finally {
      setIsDemoLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="absolute right-4 top-4">
        <LanguageSwitcher />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('auth.login')}</CardTitle>
          <CardDescription>{t('auth.loginDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.username')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('auth.username')}
                        data-testid="login-username"
                        {...field}
                      />
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
                      <Input type="password" data-testid="login-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error ? (
                <div className="text-sm text-red-500" data-testid="login-error">
                  {error}
                </div>
              ) : null}
              <Button
                type="submit"
                className="w-full"
                disabled={isDemoLoading}
                data-testid="login-submit"
              >
                {t('auth.signIn')}
              </Button>
            </form>
          </Form>
          <div className="mt-4 flex flex-col gap-2">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground dark:bg-gray-800">
                  {t('auth.demo')}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={onDemoLogin}
              disabled={isDemoLoading || form.formState.isSubmitting}
            >
              {isDemoLoading ? t('auth.creatingDemoAccount') : t('auth.demo')}
            </Button>
            <p className="text-center text-xs text-muted-foreground">{t('auth.demoDescription')}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="text-blue-500 hover:underline">
              {t('auth.register')}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
