import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Markdown from 'react-markdown'
import {
  ArrowDownToLine,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Package,
  RefreshCw,
  Search,
  Trash2,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

import {
  useInstallPlugin,
  useMarketplaceRegistry,
  usePluginReadme,
  useUninstallPlugin,
  useUpdatePlugin,
} from '../hooks/useMarketplace'
import type { RegistryPlugin } from '../types/marketplace'

import { PluginCard } from './PluginCard'

interface MarketplaceBrowserProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function useMarketplaceBrowserState(onOpenChange: (open: boolean) => void) {
  const [search, setSearch] = useState('')
  const [selectedPlugin, setSelectedPlugin] = useState<RegistryPlugin | null>(null)
  const [confirmUninstall, setConfirmUninstall] = useState(false)

  const handleSelect = useCallback((plugin: RegistryPlugin) => {
    setSelectedPlugin(plugin)
    setConfirmUninstall(false)
  }, [])

  const handleBack = useCallback(() => {
    setSelectedPlugin(null)
    setConfirmUninstall(false)
  }, [])

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setSelectedPlugin(null)
        setSearch('')
        setConfirmUninstall(false)
      }
      onOpenChange(nextOpen)
    },
    [onOpenChange],
  )

  return {
    search,
    setSearch,
    selectedPlugin,
    confirmUninstall,
    setConfirmUninstall,
    handleSelect,
    handleBack,
    handleOpenChange,
  }
}

function filterPlugins(plugins: RegistryPlugin[] | undefined, search: string): RegistryPlugin[] {
  if (!plugins) {
    return []
  }
  if (!search.trim()) {
    return plugins
  }
  const query = search.toLowerCase()
  return plugins.filter(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.tags.some((tag) => tag.toLowerCase().includes(query)),
  )
}

function BrowserDialogHeader({
  selectedPlugin,
  onBack,
}: {
  selectedPlugin: RegistryPlugin | null
  onBack: () => void
}) {
  const { t } = useTranslation()

  return (
    <DialogHeader>
      <DialogTitle>
        {selectedPlugin ? (
          <button
            type="button"
            className="flex items-center gap-2 text-sm font-normal text-muted-foreground hover:text-foreground"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
            {t('marketplace.back')}
          </button>
        ) : (
          t('marketplace.title')
        )}
      </DialogTitle>
      <DialogDescription className="sr-only">
        {selectedPlugin ? selectedPlugin.name : t('marketplace.search')}
      </DialogDescription>
    </DialogHeader>
  )
}

export function MarketplaceBrowser({ open, onOpenChange }: MarketplaceBrowserProps) {
  const state = useMarketplaceBrowserState(onOpenChange)

  const { data: registry, isLoading: registryLoading } = useMarketplaceRegistry()
  const { data: readme, isLoading: readmeLoading } = usePluginReadme(
    state.selectedPlugin?.id ?? null,
  )

  const installPlugin = useInstallPlugin()
  const updatePlugin = useUpdatePlugin()
  const uninstallPlugin = useUninstallPlugin()

  const filteredPlugins = useMemo(
    () => filterPlugins(registry?.plugins, state.search),
    [registry?.plugins, state.search],
  )

  const handleUninstall = useCallback(() => {
    if (!state.selectedPlugin) {
      return
    }
    if (!state.confirmUninstall) {
      state.setConfirmUninstall(true)
      return
    }
    uninstallPlugin.mutate(state.selectedPlugin.id, {
      onSuccess: () => state.setConfirmUninstall(false),
    })
  }, [state, uninstallPlugin])

  return (
    <Dialog open={open} onOpenChange={state.handleOpenChange}>
      <DialogContent className="flex max-h-[80vh] flex-col sm:max-w-2xl">
        <BrowserDialogHeader selectedPlugin={state.selectedPlugin} onBack={state.handleBack} />

        {state.selectedPlugin ? (
          <PluginDetailView
            plugin={state.selectedPlugin}
            readme={readme?.content}
            readmeLoading={readmeLoading}
            confirmUninstall={state.confirmUninstall}
            onInstall={() => installPlugin.mutate(state.selectedPlugin!.id)}
            onUpdate={() => updatePlugin.mutate(state.selectedPlugin!.id)}
            onUninstall={handleUninstall}
            onCancelUninstall={() => state.setConfirmUninstall(false)}
            installPending={installPlugin.isPending}
            updatePending={updatePlugin.isPending}
            uninstallPending={uninstallPlugin.isPending}
          />
        ) : (
          <PluginGridView
            search={state.search}
            onSearchChange={state.setSearch}
            plugins={filteredPlugins}
            loading={registryLoading}
            hasPlugins={(registry?.plugins?.length ?? 0) > 0}
            onSelect={state.handleSelect}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

interface PluginGridViewProps {
  search: string
  onSearchChange: (value: string) => void
  plugins: RegistryPlugin[]
  loading: boolean
  hasPlugins: boolean
  onSelect: (plugin: RegistryPlugin) => void
}

function PluginGridContent({
  plugins,
  loading,
  hasPlugins,
  onSelect,
}: Omit<PluginGridViewProps, 'search' | 'onSearchChange'>) {
  const { t } = useTranslation()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (plugins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Package className="mb-2 h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {hasPlugins ? t('marketplace.noResults') : t('marketplace.noPlugins')}
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {plugins.map((plugin) => (
        <PluginCard key={plugin.id} plugin={plugin} onSelect={onSelect} />
      ))}
    </div>
  )
}

function PluginGridView({
  search,
  onSearchChange,
  plugins,
  loading,
  hasPlugins,
  onSelect,
}: PluginGridViewProps) {
  const { t } = useTranslation()

  return (
    <>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t('marketplace.search')}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <PluginGridContent
          plugins={plugins}
          loading={loading}
          hasPlugins={hasPlugins}
          onSelect={onSelect}
        />
      </div>
    </>
  )
}

interface PluginDetailViewProps {
  plugin: RegistryPlugin
  readme?: string
  readmeLoading: boolean
  confirmUninstall: boolean
  onInstall: () => void
  onUpdate: () => void
  onUninstall: () => void
  onCancelUninstall: () => void
  installPending: boolean
  updatePending: boolean
  uninstallPending: boolean
}

function PluginVersionInfo({ plugin }: { plugin: RegistryPlugin }) {
  const { t } = useTranslation()

  return (
    <div className="mt-1 flex flex-wrap items-center gap-2">
      {plugin.latestVersion !== undefined && (
        <Badge variant="outline" className="text-xs">
          {t('marketplace.version', { version: plugin.latestVersion })}
        </Badge>
      )}
      {plugin.compatible ? (
        <Badge variant="secondary" className="text-xs">
          {t('marketplace.compatible')}
        </Badge>
      ) : (
        <Badge variant="destructive" className="text-xs">
          {t('marketplace.incompatible')}
        </Badge>
      )}
      {plugin.installed ? (
        <Badge variant="secondary" className="text-xs">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          {t('marketplace.installed')}
          {plugin.installedVersion !== undefined &&
            ` (${t('marketplace.version', { version: plugin.installedVersion })})`}
        </Badge>
      ) : null}
    </div>
  )
}

function InstallButton({
  plugin,
  onInstall,
  installPending,
}: {
  plugin: RegistryPlugin
  onInstall: () => void
  installPending: boolean
}) {
  const { t } = useTranslation()

  if (plugin.installed) {
    return null
  }

  return (
    <Button size="sm" onClick={onInstall} disabled={installPending || !plugin.compatible}>
      {installPending ? (
        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
      ) : (
        <ArrowDownToLine className="mr-1 h-4 w-4" />
      )}
      {installPending ? t('marketplace.installing') : t('marketplace.install')}
    </Button>
  )
}

function UpdateButton({
  plugin,
  onUpdate,
  updatePending,
}: {
  plugin: RegistryPlugin
  onUpdate: () => void
  updatePending: boolean
}) {
  const { t } = useTranslation()

  if (!plugin.installed || !plugin.updateAvailable) {
    return null
  }

  return (
    <Button size="sm" onClick={onUpdate} disabled={updatePending}>
      {updatePending ? (
        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
      ) : (
        <RefreshCw className="mr-1 h-4 w-4" />
      )}
      {updatePending ? t('marketplace.updating') : t('marketplace.update')}
    </Button>
  )
}

function UninstallSection({
  plugin,
  confirmUninstall,
  onUninstall,
  onCancelUninstall,
  uninstallPending,
}: {
  plugin: RegistryPlugin
  confirmUninstall: boolean
  onUninstall: () => void
  onCancelUninstall: () => void
  uninstallPending: boolean
}) {
  const { t } = useTranslation()

  if (!plugin.installed) {
    return null
  }

  if (confirmUninstall) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/5 px-3 py-2">
        <p className="text-sm text-destructive">{t('marketplace.uninstallConfirm')}</p>
        <Button size="sm" variant="destructive" onClick={onUninstall} disabled={uninstallPending}>
          {uninstallPending ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null}
          {uninstallPending ? t('marketplace.uninstalling') : t('marketplace.uninstall')}
        </Button>
        <Button size="sm" variant="outline" onClick={onCancelUninstall}>
          {t('common.cancel')}
        </Button>
      </div>
    )
  }

  return (
    <Button size="sm" variant="destructive" onClick={onUninstall} disabled={uninstallPending}>
      <Trash2 className="mr-1 h-4 w-4" />
      {t('marketplace.uninstall')}
    </Button>
  )
}

function PluginActions({
  plugin,
  confirmUninstall,
  onInstall,
  onUpdate,
  onUninstall,
  onCancelUninstall,
  installPending,
  updatePending,
  uninstallPending,
}: Omit<PluginDetailViewProps, 'readme' | 'readmeLoading'>) {
  return (
    <div className="flex flex-wrap gap-2">
      <InstallButton plugin={plugin} onInstall={onInstall} installPending={installPending} />
      <UpdateButton plugin={plugin} onUpdate={onUpdate} updatePending={updatePending} />
      <UninstallSection
        plugin={plugin}
        confirmUninstall={confirmUninstall}
        onUninstall={onUninstall}
        onCancelUninstall={onCancelUninstall}
        uninstallPending={uninstallPending}
      />
    </div>
  )
}

function ReadmeContent({ readme, readmeLoading }: { readme?: string; readmeLoading: boolean }) {
  const { t } = useTranslation()

  if (readmeLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">{t('marketplace.readmeLoading')}</span>
      </div>
    )
  }

  if (readme) {
    return (
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <Markdown>{readme}</Markdown>
      </div>
    )
  }

  return <p className="text-sm text-muted-foreground">{t('marketplace.readmeError')}</p>
}

function PluginDetailView({
  plugin,
  readme,
  readmeLoading,
  confirmUninstall,
  onInstall,
  onUpdate,
  onUninstall,
  onCancelUninstall,
  installPending,
  updatePending,
  uninstallPending,
}: PluginDetailViewProps) {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-muted">
          <Package className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold">{plugin.name}</h3>
          <p className="text-sm text-muted-foreground">
            {t('marketplace.by', { author: plugin.author })}
          </p>
          <PluginVersionInfo plugin={plugin} />
        </div>
      </div>

      <PluginActions
        plugin={plugin}
        confirmUninstall={confirmUninstall}
        onInstall={onInstall}
        onUpdate={onUpdate}
        onUninstall={onUninstall}
        onCancelUninstall={onCancelUninstall}
        installPending={installPending}
        updatePending={updatePending}
        uninstallPending={uninstallPending}
      />

      <div className="min-h-0 flex-1 overflow-y-auto rounded-md border p-4">
        <ReadmeContent readme={readme} readmeLoading={readmeLoading} />
      </div>
    </div>
  )
}
