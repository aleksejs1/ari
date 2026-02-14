import { Link } from 'react-router-dom'
import { type LucideIcon } from 'lucide-react'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface SidebarNavItemProps {
  to: string
  icon: LucideIcon
  label: string
  onClick?: () => void
  variant?: 'default' | 'danger'
  collapsed?: boolean
}

export function SidebarNavItem({
  to,
  icon: Icon,
  label,
  onClick,
  variant = 'default',
  collapsed = false,
}: SidebarNavItemProps) {
  const baseClasses = 'flex items-center rounded-lg transition-colors'

  const variantClasses = {
    default: 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700',
    danger: 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20',
  }

  const sizeClasses = collapsed ? 'justify-center px-2 py-2' : 'gap-2 px-4 py-2'

  const link = (
    <Link
      to={to}
      onClick={onClick}
      className={cn(baseClasses, variantClasses[variant], sizeClasses)}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!collapsed && <span>{label}</span>}
    </Link>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    )
  }

  return link
}
