import { Icons, Router, useTranslation } from '@ari/plugin-sdk'

const { Link } = Router

export function GiftTopMenuItem({ onNavigate }: { onNavigate?: () => void }) {
    const { t } = useTranslation('gift-plugin')

    const baseClasses = "flex items-center gap-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground rounded-md"
    const mobileClasses = "px-2 py-1 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
    const desktopClasses = "hidden md:flex h-9 px-4 py-2"

    if (onNavigate) {
        return (
            <Link
                to="/gift-lists"
                onClick={onNavigate}
                className={`${baseClasses} ${mobileClasses}`}
            >
                <Icons.Gift className="h-5 w-5" />
                <span>{t('sidebar', 'Gifts')}</span>
            </Link>
        )
    }

    return (
        <Link to="/gift-lists" className={`${baseClasses} ${desktopClasses}`}>
            <div className={`p-2 rounded-md hover:bg-muted`}>
                <Icons.Gift className="h-4 w-4" />
            </div>
            <span>{t('sidebar', 'Gifts')}</span>
        </Link>
    )
}
