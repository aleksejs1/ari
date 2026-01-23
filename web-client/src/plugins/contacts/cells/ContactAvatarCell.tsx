import { CircleUser } from 'lucide-react'

import { type Contact } from '@/types/models'

import { getContactAvatarUrl } from '../contactUtils'

interface ContactAvatarCellProps {
  contact: Contact
}

export function ContactAvatarCell({ contact }: ContactAvatarCellProps) {
  const imageUrl = getContactAvatarUrl(contact.avatar)

  return (
    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-secondary text-muted-foreground">
      {imageUrl ? (
        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <CircleUser className="h-5 w-5" />
      )}
    </div>
  )
}
