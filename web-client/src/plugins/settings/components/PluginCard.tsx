import { useTranslation } from 'react-i18next'
import { ArrowDownToLine, CheckCircle2, Package, RefreshCw } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import type { RegistryPlugin } from '../types/marketplace'

interface PluginCardProps {
  plugin: RegistryPlugin
  onSelect: (plugin: RegistryPlugin) => void
}

function PluginStatusBadge({ plugin }: { plugin: RegistryPlugin }) {
  const { t } = useTranslation()

  if (plugin.installed && plugin.updateAvailable) {
    return (
      <Badge variant="default" className="shrink-0 bg-blue-600 text-xs">
        <RefreshCw className="mr-1 h-3 w-3" />
        {t('marketplace.update')}
      </Badge>
    )
  }

  if (plugin.installed) {
    return (
      <Badge variant="secondary" className="shrink-0 text-xs">
        <CheckCircle2 className="mr-1 h-3 w-3" />
        {t('marketplace.installed')}
      </Badge>
    )
  }

  return null
}

export function PluginCard({ plugin, onSelect }: PluginCardProps) {
  const { t } = useTranslation()

  return (
    <button
      type="button"
      className="flex w-full cursor-pointer flex-col rounded-lg border bg-card p-4 text-left text-card-foreground shadow-sm transition-colors hover:bg-accent/50"
      onClick={() => onSelect(plugin)}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
          <Package className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="truncate font-semibold">{plugin.name}</h4>
            <PluginStatusBadge plugin={plugin} />
          </div>
          <p className="text-xs text-muted-foreground">
            {t('marketplace.by', { author: plugin.author })}
          </p>
        </div>
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{plugin.description}</p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1">
          {(plugin.tags || []).slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        {!plugin.installed && (
          <Button
            size="sm"
            variant="outline"
            className="shrink-0"
            onClick={(e) => {
              e.stopPropagation()
              onSelect(plugin)
            }}
          >
            <ArrowDownToLine className="mr-1 h-3 w-3" />
            {t('marketplace.install')}
          </Button>
        )}
      </div>
      {!plugin.compatible && (
        <Badge variant="destructive" className="mt-2 text-xs">
          {t('marketplace.incompatible')}
        </Badge>
      )}
    </button>
  )
}
