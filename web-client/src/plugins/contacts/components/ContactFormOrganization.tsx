import { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DateInput } from '@/components/ui/DateInput'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { type ContactFormValues } from '@/types/models'

import { CollapsibleSection } from './CollapsibleSection'
import { TypeAutocomplete } from './TypeAutocomplete'

export function ContactFormOrganization() {
  const { t } = useTranslation('contacts')
  const { control } = useFormContext<ContactFormValues>()
  const [isOpen, setIsOpen] = useState(false)

  const {
    fields: organizationFields,
    append: appendOrganization,
    remove: removeOrganization,
  } = useFieldArray({
    control,
    name: 'contactOrganizations',
  })

  return (
    <CollapsibleSection
      title={t('organizations')}
      open={isOpen}
      onOpenChange={setIsOpen}
      action={
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            appendOrganization({
              name: '',
              title: '',
              department: '',
              type: 'Work',
              jobDescription: '',
              startDate: '',
              endDate: '',
            })
            setIsOpen(true)
          }}
        >
          <Plus className="mr-1 h-4 w-4" /> {t('addOrganization')}
        </Button>
      }
    >
      <div className="space-y-4">
        {organizationFields.map((field, index) => (
          <div key={field.id} className="rounded-md border border-gray-100 p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-gray-400">
                {t('organizationType')}:{' '}
                {control._formValues.contactOrganizations?.[index]?.type || ''}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeOrganization(index)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={control}
                name={`contactOrganizations.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TypeAutocomplete
                        field="organizationNames"
                        placeholder={t('organizationName')}
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`contactOrganizations.${index}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TypeAutocomplete
                        field="organizationTitles"
                        placeholder={t('organizationTitle')}
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`contactOrganizations.${index}.department`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TypeAutocomplete
                        field="organizationDepartments"
                        placeholder={t('organizationDepartment')}
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`contactOrganizations.${index}.type`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TypeAutocomplete
                        field="organizationTypes"
                        placeholder={t('organizationTypePlaceholder')}
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`contactOrganizations.${index}.startDate`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <DateInput
                        placeholder={t('organizationStartDate')}
                        {...field}
                        value={field.value ? String(field.value).split('T')[0] : ''}
                        onChange={(date) => field.onChange(date)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`contactOrganizations.${index}.endDate`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <DateInput
                        placeholder={t('organizationEndDate')}
                        {...field}
                        value={field.value ? String(field.value).split('T')[0] : ''}
                        onChange={(date) => field.onChange(date)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="sm:col-span-2">
                <FormField
                  control={control}
                  name={`contactOrganizations.${index}.jobDescription`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder={t('organizationDescription')}
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  )
}
