import { Check, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { InlineEditTrigger } from './InlineEditTrigger'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { type ContactAddress } from '@/types/models'

interface ContactAddressInlineEditProps {
  address: ContactAddress
  onUpdate: (address: ContactAddress) => void
  onDelete: () => void
  children: React.ReactNode
}

interface AddressFormProps {
  type: string
  setType: (v: string) => void
  street: string
  setStreet: (v: string) => void
  streetExtended: string
  setStreetExtended: (v: string) => void
  city: string
  setCity: (v: string) => void
  region: string
  setRegion: (v: string) => void
  postalCode: string
  setPostalCode: (v: string) => void
  country: string
  setCountry: (v: string) => void
  isExistent: boolean
  onDelete: () => void
  onCancel: () => void
  onSave: () => void
}

function AddressForm({
  type,
  setType,
  street,
  setStreet,
  streetExtended,
  setStreetExtended,
  city,
  setCity,
  region,
  setRegion,
  postalCode,
  setPostalCode,
  country,
  setCountry,
  isExistent,
  onDelete,
  onCancel,
  onSave,
}: AddressFormProps) {
  const { t } = useTranslation()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleDeleteConfirm = () => {
    onDelete()
    setIsDeleteDialogOpen(false)
  }

  return (
    <div className="flex w-80 flex-col gap-3">
      <div className="space-y-2">
        <Input
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder={t('contacts.addressTypePlaceholder')}
          className="h-8"
          aria-label={t('contacts.addressType')}
        />
        <Input
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          placeholder={t('contacts.addressStreet')}
          className="h-8"
          aria-label={t('contacts.addressStreet')}
        />
        <Input
          value={streetExtended}
          onChange={(e) => setStreetExtended(e.target.value)}
          placeholder={t('contacts.addressStreetExtended')}
          className="h-8"
          aria-label={t('contacts.addressStreetExtended')}
        />
        <div className="grid grid-cols-2 gap-2">
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={t('contacts.addressCity')}
            className="h-8"
            aria-label={t('contacts.addressCity')}
          />
          <Input
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder={t('contacts.addressRegion')}
            className="h-8"
            aria-label={t('contacts.addressRegion')}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder={t('contacts.addressPostalCode')}
            className="h-8"
            aria-label={t('contacts.addressPostalCode')}
          />
          <Input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder={t('contacts.addressCountry')}
            className="h-8"
            aria-label={t('contacts.addressCountry')}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 border-t pt-2">
        {isExistent ? (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        ) : null}
        <Button size="sm" variant="ghost" onClick={onCancel} className="h-8 text-gray-500">
          <X className="mr-1 h-4 w-4" />
          {t('common.cancel')}
        </Button>
        <Button
          size="sm"
          onClick={onSave}
          className="h-8 bg-green-600 text-white hover:bg-green-700"
        >
          <Check className="mr-1 h-4 w-4" />
          {t('common.save')}
        </Button>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('contacts.delete')}</DialogTitle>
            <DialogDescription>{t('contacts.deleteConfirm')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              {t('contacts.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function ContactAddressInlineEdit({
  address,
  onUpdate,
  onDelete,
  children,
}: ContactAddressInlineEditProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [type, setType] = useState(address.type ?? '')
  const [street, setStreet] = useState(address.street ?? '')
  const [streetExtended, setStreetExtended] = useState(address.streetExtended ?? '')
  const [city, setCity] = useState(address.city ?? '')
  const [region, setRegion] = useState(address.region ?? '')
  const [postalCode, setPostalCode] = useState(address.postalCode ?? '')
  const [country, setCountry] = useState(address.country ?? '')

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setType(address.type ?? '')
      setStreet(address.street ?? '')
      setStreetExtended(address.streetExtended ?? '')
      setCity(address.city ?? '')
      setRegion(address.region ?? '')
      setPostalCode(address.postalCode ?? '')
      setCountry(address.country ?? '')
    }
    setOpen(isOpen)
  }

  const handleSave = () => {
    onUpdate({
      ...address,
      type,
      street,
      streetExtended,
      city,
      region,
      postalCode,
      country,
    })
    setOpen(false)
  }

  const hasAddress = !!(street || city || country)

  return (
    <InlineEditTrigger
      isExistent={hasAddress}
      label={t('contacts.address')}
      open={open}
      onOpenChange={handleOpenChange}
      popoverContent={
        <AddressForm
          type={type}
          setType={setType}
          street={street}
          setStreet={setStreet}
          streetExtended={streetExtended}
          setStreetExtended={setStreetExtended}
          city={city}
          setCity={setCity}
          region={region}
          setRegion={setRegion}
          postalCode={postalCode}
          setPostalCode={setPostalCode}
          country={country}
          setCountry={setCountry}
          isExistent={!!address['@id']}
          onDelete={onDelete}
          onCancel={() => setOpen(false)}
          onSave={handleSave}
        />
      }
      className="h-auto w-full p-0"
    >
      {children}
    </InlineEditTrigger>
  )
}
