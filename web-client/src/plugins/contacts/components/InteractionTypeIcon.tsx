import type { LucideProps } from 'lucide-react'
import { Mail, MessageSquare, Phone, Users } from 'lucide-react'

const ICONS: Record<string, React.ComponentType<LucideProps>> = {
  call: Phone,
  email: Mail,
  meeting: Users,
  other: MessageSquare,
}

interface InteractionTypeIconProps extends LucideProps {
  type: string
}

export function InteractionTypeIcon({ type, ...props }: InteractionTypeIconProps) {
  const Icon = ICONS[type] ?? MessageSquare
  return <Icon {...props} />
}
