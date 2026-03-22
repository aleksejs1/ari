import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { FeatureGate } from '@/lib/entitlements'

import type { CreateStep } from '../components/ApiKeyDialogs'
import { CreateDialog, DeleteDialog, EditDialog } from '../components/ApiKeyDialogs'
import { KeyListContent } from '../components/ApiKeyList'
import type { AppTypeConfig } from '../constants'
import type { ApiKey } from '../hooks/useApiKeys'
import { useApiKeys } from '../hooks/useApiKeys'

export default function IntegrationsPage() {
  const { t } = useTranslation()

  const [page, setPage] = useState(1)
  const [createStep, setCreateStep] = useState<CreateStep>(null)
  const [selectedAppType, setSelectedAppType] = useState<AppTypeConfig | null>(null)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyScopes, setNewKeyScopes] = useState<string[]>([])
  const [createdToken, setCreatedToken] = useState<string | null>(null)
  const [createdAppType, setCreatedAppType] = useState<string>('')
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null)
  const [editName, setEditName] = useState('')
  const [editScopes, setEditScopes] = useState<string[]>([])
  const [deletingKey, setDeletingKey] = useState<ApiKey | null>(null)

  const {
    keys,
    totalPages,
    isLoading,
    isPlaceholderData,
    createMutation,
    updateMutation,
    deleteMutation,
  } = useApiKeys(page)

  const openCreate = () => {
    setSelectedAppType(null)
    setNewKeyName('')
    setNewKeyScopes([])
    setCreatedToken(null)
    setCreateStep('choose')
  }

  const handleSelectAppType = (appType: AppTypeConfig) => {
    setSelectedAppType(appType)
    setNewKeyName(appType.defaultName)
    setNewKeyScopes(appType.defaultScopes)
    setCreateStep('configure')
  }

  const handleCreate = () => {
    if (!newKeyName.trim() || !selectedAppType || createMutation.isPending) {
      return
    }
    // Capture before mutation — selectedAppType may change if user hits Back during inflight request
    const appTypeId = selectedAppType.id
    createMutation.mutate(
      { name: newKeyName.trim(), scopes: newKeyScopes, appType: appTypeId },
      {
        onSuccess: (result) => {
          setCreatedToken(result.token)
          setCreatedAppType(appTypeId)
          setCreateStep('token')
        },
      },
    )
  }

  const handleCreateClose = () => {
    setCreateStep(null)
    setCreatedToken(null)
    setCreatedAppType('')
  }

  const openEdit = (key: ApiKey) => {
    setEditingKey(key)
    setEditName(key.name)
    setEditScopes(key.scopes)
  }

  const handleSaveEdit = () => {
    if (!editingKey || !editName.trim() || updateMutation.isPending) {
      return
    }
    updateMutation.mutate(
      { id: editingKey.id, name: editName.trim(), scopes: editScopes },
      { onSuccess: () => setEditingKey(null) },
    )
  }

  const handleConfirmDelete = () => {
    if (!deletingKey || deleteMutation.isPending) {
      return
    }
    deleteMutation.mutate(deletingKey.id, { onSuccess: () => setDeletingKey(null) })
  }

  return (
    <FeatureGate
      feature="api_keys"
      denied={
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-800">
          {t('integrations.deniedMessage')}
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('integrations.title')}</h1>
            <p className="mt-1 text-sm text-gray-500">{t('integrations.description')}</p>
          </div>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            {t('integrations.connect')}
          </Button>
        </div>

        <KeyListContent
          keys={keys}
          isLoading={isLoading}
          isPlaceholderData={isPlaceholderData}
          page={page}
          totalPages={totalPages}
          onEdit={openEdit}
          onRevoke={setDeletingKey}
          onPageChange={setPage}
        />
      </div>

      <CreateDialog
        createStep={createStep}
        selectedAppType={selectedAppType}
        newKeyName={newKeyName}
        newKeyScopes={newKeyScopes}
        createdToken={createdToken}
        createdAppType={createdAppType}
        isPending={createMutation.isPending}
        onSelectAppType={handleSelectAppType}
        onNameChange={setNewKeyName}
        onScopesChange={setNewKeyScopes}
        onCreate={handleCreate}
        onClose={handleCreateClose}
        onBack={() => setCreateStep('choose')}
      />

      <EditDialog
        editingKey={editingKey}
        editName={editName}
        editScopes={editScopes}
        isPending={updateMutation.isPending}
        onNameChange={setEditName}
        onScopesChange={setEditScopes}
        onSave={handleSaveEdit}
        onClose={() => setEditingKey(null)}
      />

      <DeleteDialog
        deletingKey={deletingKey}
        isPending={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeletingKey(null)}
      />
    </FeatureGate>
  )
}
