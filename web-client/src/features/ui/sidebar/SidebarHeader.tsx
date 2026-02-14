import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

interface SidebarHeaderProps {
  onNavigate?: () => void
  collapsed?: boolean
}

export function SidebarHeader({ onNavigate, collapsed = false }: SidebarHeaderProps) {
  const { t } = useTranslation()

  return (
    <div className={collapsed ? 'p-4 text-center' : 'p-6'}>
      <Link to="/" onClick={onNavigate}>
        <h1
          className="bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text font-bold text-transparent"
          style={{ fontSize: collapsed ? '1.25rem' : '1.5rem' }}
        >
          {collapsed ? 'a' : t('app.title')}
        </h1>
      </Link>
    </div>
  )
}
