import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Loader2, Monitor, Smartphone, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getHydraMember, type HydraCollection } from '@/lib/api/hydra'
import { api } from '@/lib/axios'
import { queryKeys } from '@/lib/queryKeys'
import type { ActiveSession } from '@/types/auth'

export default function SessionsPage() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [sessionToDelete, setSessionToDelete] = useState<ActiveSession | null>(null)

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: queryKeys.activeSessions,
    queryFn: async () => {
      const { data } = await api.get<HydraCollection<ActiveSession>>('/active_sessions')
      return getHydraMember(data)
    },
  })

  const { mutate: deleteSession, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string | number) => {
      await api.delete(`/active_sessions/${id}`)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.activeSessions })
      setSessionToDelete(null)
    },
  })

  // Helper to guess icon/device
  const getDeviceIcon = (userAgent: string) => {
    if (/mobile/i.test(userAgent)) {
      return <Smartphone className="h-5 w-5" />
    }
    return <Monitor className="h-5 w-5" />
  }

  return (
    <div className="container mx-auto max-w-4xl py-6">
      <h1 className="mb-6 text-3xl font-bold">{t('sessions.title', 'Sessions')}</h1>
      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4" data-testid="sessions-list">
          {sessions.map((session) => (
            <Card key={session.id} className={session.isCurrent ? 'border-blue-500' : ''}>
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-800">
                    {getDeviceIcon(session.userAgent)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{session.ip}</p>
                      {session.isCurrent ? (
                        <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
                          {t('sessions.current', 'Current session')}
                        </Badge>
                      ) : null}
                    </div>
                    <p className="text-sm text-gray-500">
                      {session.userAgent}
                      <span className="mx-1">•</span>
                      {format(new Date(session.createdAt), 'PPpp')}
                    </p>
                  </div>
                </div>
                {!session.isCurrent && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                    onClick={() => setSessionToDelete(session)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
          {sessions.length === 0 && (
            <p className="text-center text-gray-500">
              {t('sessions.empty', 'No active sessions found')}
            </p>
          )}
        </div>
      )}

      <Dialog open={!!sessionToDelete} onOpenChange={(open) => !open && setSessionToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('sessions.terminateTitle', 'Terminate Session?')}</DialogTitle>
            <DialogDescription>
              {t(
                'sessions.terminateDescription',
                'Are you sure you want to terminate this session? The user will be logged out on that device.',
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSessionToDelete(null)}
              disabled={isDeleting}
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={() => sessionToDelete && deleteSession(sessionToDelete.id)}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {t('common.delete', 'Delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
