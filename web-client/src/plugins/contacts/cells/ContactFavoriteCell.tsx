import { useCallback } from 'react'
import { Star } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { type Contact } from '@/types/models'

import { useContactFavorite } from '@/plugins/contacts/hooks/useContactFavorite'

interface ContactFavoriteCellProps {
  contact: Contact
}

export function ContactFavoriteCell({ contact }: ContactFavoriteCellProps) {
  const { toggleFavorite, isContactFavorite } = useContactFavorite()

  const onToggleFavorite = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation()
      await toggleFavorite(contact)
    },
    [toggleFavorite, contact],
  )

  const isFavorite = isContactFavorite(contact)

  return (
    <div className="flex items-center justify-center">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 p-0 hover:bg-transparent"
        onClick={onToggleFavorite}
      >
        <Star
          className={`h-4 w-4 cursor-pointer transition-transform hover:scale-110 ${
            isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
          }`}
        />
        <span className="sr-only">Toggle Favorite</span>
      </Button>
    </div>
  )
}
