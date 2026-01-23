import { useFormContext } from 'react-hook-form'

import { AvatarUpload } from '../../components/AvatarUpload'
import { useUploadContactAvatar } from '../../useContacts'

import { type ContactFormValues } from '@/types/models'

export function AvatarSection() {
  const { watch } = useFormContext<ContactFormValues>()
  const contactId = watch('@id')
  const contactNames = watch('contactNames')
  const avatar = watch('avatar')
  const firstNames = contactNames?.[0]
  const displayName = firstNames?.given || firstNames?.family

  const { mutateAsync: uploadAvatar } = useUploadContactAvatar()

  const handleUpload = async (file: File) => {
    if (contactId) {
      await uploadAvatar({ id: contactId, file })
    }
  }

  return (
    <div className="flex justify-center">
      <AvatarUpload
        currentAvatar={avatar as any}
        displayName={displayName}
        contactId={contactId}
        disabled={!contactId}
        onUpload={handleUpload}
      />
    </div>
  )
}
