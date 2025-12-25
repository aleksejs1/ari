import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface ContactsHeaderProps {
  onCreate: () => void
}

export function ContactsHeader({ onCreate }: ContactsHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Contacts</h2>
        <p className="text-muted-foreground">Manage your contacts list.</p>
      </div>
      <Button onClick={onCreate}>
        <Plus className="w-4 h-4 mr-2" />
        Add Contact
      </Button>
    </div>
  )
}
