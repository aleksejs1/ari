import { DropdownMenuLabel } from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/useAuth'

export function UserIdentitySection() {
  const { user } = useAuth()

  return (
    <DropdownMenuLabel className="font-normal" asChild>
      <div className="flex flex-col space-y-1 p-4 md:p-2">
        <p className="text-base font-medium leading-none md:text-sm">{user?.uuid || 'User'}</p>
      </div>
    </DropdownMenuLabel>
  )
}
