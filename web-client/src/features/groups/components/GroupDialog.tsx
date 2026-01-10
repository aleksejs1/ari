import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { useCreateGroup, useUpdateGroup } from '../useGroups'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { type Group } from '@/types/models'

const groupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  color: z.string().optional(),
})

type GroupFormValues = z.infer<typeof groupSchema>

interface GroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  group?: Group | null
}

interface GroupFormContentProps {
  group?: Group | null
  onOpenChange: (open: boolean) => void
}

function GroupFormContent({ group, onOpenChange }: GroupFormContentProps) {
  const { t } = useTranslation()
  const createMutation = useCreateGroup() as any
  const updateMutation = useUpdateGroup() as any

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema) as any,
    defaultValues: {
      name: group?.name || '',
      color: group?.color || '',
    },
    values: {
      name: group?.name || '',
      color: group?.color || '',
    },
  }) as any

  const onSubmit = async (data: GroupFormValues) => {
    try {
      if (group && group.id) {
        await updateMutation.mutateAsync({ id: group.id, data })
      } else if (!group) {
        await createMutation.mutateAsync(data)
      }
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error('Failed to save group', error)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  const getButtonLabel = () => {
    if (isLoading) {
      return t('common.saving', 'Saving...')
    }
    if (group) {
      return t('common.save', 'Save')
    }
    return t('common.create', 'Create')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('groups.fields.name', 'Name')}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('groups.fields.color', 'Color')}</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input type="color" className="h-10 w-20 p-1" {...field} />
                </FormControl>
                <FormControl>
                  <Input placeholder="#000000" {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {getButtonLabel()}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

export function GroupDialog({ open, onOpenChange, group }: GroupDialogProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {group ? t('groups.editGroup', 'Edit Group') : t('groups.createGroup', 'Create Group')}
          </DialogTitle>
        </DialogHeader>
        <GroupFormContent group={group} onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  )
}
