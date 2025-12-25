import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { useForm, useFieldArray } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  // FormLabel, // Unused
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { contactSchema, type ContactFormValues } from '@/types/models'

interface ContactFormProps {
  defaultValues?: ContactFormValues
  onSubmit: (data: ContactFormValues) => void
  isSubmitting?: boolean
}

export function ContactForm({ defaultValues, onSubmit, isSubmitting }: ContactFormProps) {
  const form = useForm<ContactFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(contactSchema) as any, // Cast to any to avoid strict type mismatch with field arrays/dates
    defaultValues: defaultValues || {
      contactNames: [{ given: '', family: '' }],
      contactDates: [],
    },
  })

  // Names Field Array
  const {
    fields: nameFields,
    append: appendName,
    remove: removeName,
  } = useFieldArray({
    control: form.control,
    name: 'contactNames',
  })

  // Dates Field Array
  const {
    fields: dateFields,
    append: appendDate,
    remove: removeDate,
  } = useFieldArray({
    control: form.control,
    name: 'contactDates',
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Names Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Names</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendName({ given: '', family: '' })}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Name
            </Button>
          </div>
          <div className="space-y-2">
            {nameFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                <FormField
                  control={form.control}
                  name={`contactNames.${index}.given`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="Given Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`contactNames.${index}.family`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="Family Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeName(index)}
                  disabled={nameFields.length === 1}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Dates Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Important Dates</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendDate({ text: 'Birthday', date: new Date().toISOString() })}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Date
            </Button>
          </div>
          <div className="space-y-2">
            {dateFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                <FormField
                  control={form.control}
                  name={`contactDates.${index}.text`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="Label (e.g. Birthday)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`contactDates.${index}.date`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        {/* Simple text input for date for now, could be DatePicker */}
                        <Input
                          type="date"
                          {...field}
                          value={field.value ? field.value.split('T')[0] : ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeDate(index)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
            {dateFields.length === 0 && (
              <p className="text-sm text-gray-500 italic">No dates added.</p>
            )}
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Saving...' : 'Save Contact'}
        </Button>
      </form>
    </Form>
  )
}
