import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useActivatePlugin, useDeactivatePlugin, useUserPlugins } from '@/hooks/useUserPlugins'

export const AvailablePluginsList = () => {
  const { t } = useTranslation()
  const { data: plugins, isLoading, error } = useUserPlugins()
  const activateMutation = useActivatePlugin()
  const deactivateMutation = useDeactivatePlugin()

  if (isLoading) {
    return <div className="p-4 text-center">{t('plugins.loading')}</div>
  }

  if (error) {
    return <div className="p-4 text-destructive">{t('plugins.error')}</div>
  }

  if (!plugins?.length) {
    return <div className="p-4 text-muted-foreground">{t('plugins.noPlugins')}</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{t('plugins.available')}</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('plugins.plugin')}</TableHead>
              <TableHead>{t('plugins.version')}</TableHead>
              <TableHead>{t('plugins.status')}</TableHead>
              <TableHead className="text-right">{t('plugins.action')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plugins.map((plugin) => (
              <TableRow key={plugin.pluginId}>
                <TableCell>
                  <div className="font-medium">{plugin.title || plugin.name}</div>
                  <div className="text-sm text-muted-foreground">{plugin.description}</div>
                </TableCell>
                <TableCell>{plugin.version}</TableCell>
                <TableCell>
                  {plugin.enabled ? (
                    <Badge variant="default" className="bg-green-600">
                      {t('plugins.active')}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">{t('plugins.inactive')}</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {plugin.enabled ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deactivateMutation.mutate(plugin.pluginId)}
                      disabled={deactivateMutation.isLoading}
                    >
                      {deactivateMutation.isLoading
                        ? t('plugins.deactivating')
                        : t('plugins.deactivate')}
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => activateMutation.mutate(plugin.pluginId)}
                      disabled={activateMutation.isLoading}
                    >
                      {activateMutation.isLoading ? t('plugins.activating') : t('plugins.activate')}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
