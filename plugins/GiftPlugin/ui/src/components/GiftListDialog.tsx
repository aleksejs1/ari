import { AxiosError, Icons, useForm, useTranslation,z, zodResolver } from '@ari/plugin-sdk'
import { Alert, AlertDescription, AlertTitle, Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Textarea } from '@ari/plugin-sdk'
import { useEffect, useState } from 'react'

import { useCreateGiftList, useUpdateGiftList } from '../hooks/useGiftLists'
import type { GiftList } from '../types'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  eventDate: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface GiftListDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  listToEdit?: GiftList
}

export function GiftListDialog({ open, onOpenChange, listToEdit }: GiftListDialogProps) {
  const { t } = useTranslation('gift-plugin')
  const createMutation = useCreateGiftList()
  const updateMutation = useUpdateGiftList()

  const [error, setError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      eventDate: '',
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        name: listToEdit?.name || '',
        description: listToEdit?.description || '',
        eventDate: listToEdit?.eventDate
          ? new Date(listToEdit.eventDate).toISOString().split('T')[0]
          : '',
      })
    }
  }, [open, listToEdit, form])

  const onSubmit = async (values: FormValues) => {
    try {
      if (listToEdit) {
        await updateMutation.mutateAsync({ id: listToEdit.id, ...values })
      } else {
        await createMutation.mutateAsync(values)
      }
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to save gift list', error)
      if (error instanceof AxiosError) {
        const data = error.response?.data
        if (data && typeof data === 'object') {
          // Handle "hydra" error format or standard format
          const description = data.description || data.detail || data['hydra:description']
          if (description) {
            setError(description)
            return
          }
        }
      }
      setError(t('error.generic', 'An error occurred while saving.'))
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  let submitLabel = t('common.create', 'Create')
  if (isPending) {
    submitLabel = t('common.saving', 'Saving...')
  } else if (listToEdit) {
    submitLabel = t('common.save', 'Save')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {listToEdit
              ? t('dialog.editTitle', 'Edit Gift List')
              : t('dialog.createTitle', 'Create Gift List')}
          </DialogTitle>
          <DialogDescription>
            {listToEdit
              ? t('dialog.editDescription', 'Update the details of your gift list.')
              : t('dialog.createDescription', 'Fill in the details to create a new gift list.')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error ? (
              <Alert variant="destructive">
                <Icons.AlertCircle className="h-4 w-4" />
                <AlertTitle>{t('common.error', 'Error')}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('fields.name', 'Name')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('fields.description', 'Description')}</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="eventDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('fields.eventDate', 'Event Date')}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button type="submit" disabled={isPending}>
                {submitLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
