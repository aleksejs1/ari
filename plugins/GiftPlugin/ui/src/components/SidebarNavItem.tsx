import { Link } from 'react-router-dom'

import { cn } from '../lib/utils'

interface SidebarNavItemProps {
    to: string
    icon: React.ComponentType<{ className?: string }>
    label: string
    onClick?: () => void
    variant?: 'default' | 'danger'
}

export function SidebarNavItem({
    to,
    icon: Icon,
    label,
    onClick,
    variant = 'default',
}: SidebarNavItemProps) {
    const baseClasses = 'flex items-center gap-2 rounded-lg px-4 py-2 transition-colors'

    const variantClasses = {
        default: 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700',
        danger: 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20',
    }

    return (
        <Link to={to} onClick={onClick} className={cn(baseClasses, variantClasses[variant])}>
            <Icon className="h-5 w-5" />
            <span>{label}</span>
        </Link>
    )
}
