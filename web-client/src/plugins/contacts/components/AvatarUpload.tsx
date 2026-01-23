import * as React from 'react'
import { AlertCircle, Camera, Check, CircleUser, Loader2 } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { ContactAvatar } from '@/types/models'

import { getContactAvatarUrl } from '../contactUtils'

interface AvatarUploadProps {
  currentAvatar?: ContactAvatar | null
  contactId?: string
  displayName?: string
  className?: string
  onUpload?: (file: File) => Promise<void>
  disabled?: boolean
}

export function AvatarUpload({
  currentAvatar,
  displayName,
  className,
  onUpload,
  disabled,
}: AvatarUploadProps) {
  const {
    status,
    fileInputRef,
    imageUrl,
    fullSizeImageUrl,
    handleFileChange,
    triggerUpload,
    handleKeyDown,
  } = useAvatarUpload(currentAvatar, onUpload, disabled)

  return (
    <div className={cn('group relative', className)}>
      <AvatarWrapper
        disabled={disabled}
        status={status}
        onUpload={onUpload}
        handleKeyDown={handleKeyDown}
        triggerUpload={triggerUpload}
      >
        <AvatarDisplay
          imageUrl={imageUrl}
          fullSizeImageUrl={fullSizeImageUrl}
          displayName={displayName}
          canPreview={!onUpload}
        />
      </AvatarWrapper>

      <UploadControls
        disabled={disabled}
        canUpload={!!onUpload}
        status={status}
        onTrigger={triggerUpload}
        onKeyDown={handleKeyDown}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || status === 'uploading'}
        data-testid="avatar-file-input"
      />
    </div>
  )
}

function AvatarWrapper({
  children,
  disabled,
  status,
  onUpload,
  handleKeyDown,
  triggerUpload,
}: {
  children: React.ReactNode
  disabled?: boolean
  status: string
  onUpload?: (file: File) => Promise<void>
  handleKeyDown: (e: React.KeyboardEvent) => void
  triggerUpload: () => void
}) {
  const commonClasses = cn(
    'relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 bg-secondary text-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    !disabled && !!onUpload && 'cursor-pointer group-hover:border-primary',
    status === 'error' ? 'border-destructive' : 'border-transparent',
    status === 'success' ? 'border-green-500' : '',
  )

  if (onUpload) {
    return (
      <button
        type="button"
        disabled={disabled || status === 'uploading'}
        onKeyDown={handleKeyDown}
        className={commonClasses}
        onClick={triggerUpload}
      >
        {status === 'uploading' && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        {children}
      </button>
    )
  }

  return <div className={commonClasses}>{children}</div>
}

function useAvatarUpload(
  currentAvatar: ContactAvatar | null | undefined,
  onUpload: AvatarUploadProps['onUpload'],
  disabled: AvatarUploadProps['disabled'],
) {
  const [status, setStatus] = React.useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (status === 'success' || status === 'error') {
      const timer = setTimeout(() => setStatus('idle'), 3000)
      return () => clearTimeout(timer)
    }
  }, [status])

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !onUpload) {
      return
    }
    if (!file.type.startsWith('image/')) {
      setStatus('error')
      return
    }
    try {
      setStatus('uploading')
      await onUpload(file)
      setStatus('success')
    } catch (error) {
      console.error('Avatar upload failed:', error)
      setStatus('error')
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const triggerUpload = () => {
    if (!disabled && status !== 'uploading' && onUpload) {
      fileInputRef.current?.click()
    }
  }

  const imageUrl = React.useMemo(() => getContactAvatarUrl(currentAvatar), [currentAvatar])
  const fullSizeImageUrl = React.useMemo(
    () => getContactAvatarUrl(currentAvatar, true),
    [currentAvatar],
  )

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      triggerUpload()
    }
  }

  return {
    status,
    fileInputRef,
    imageUrl,
    fullSizeImageUrl,
    handleFileChange,
    triggerUpload,
    handleKeyDown,
  }
}

interface AvatarDisplayProps {
  imageUrl: string | null
  fullSizeImageUrl: string | null
  displayName?: string
  canPreview: boolean
}

function AvatarDisplay({
  imageUrl,
  fullSizeImageUrl,
  displayName,
  canPreview,
}: AvatarDisplayProps) {
  if (!imageUrl) {
    return <CircleUser className="h-10 w-10" />
  }

  if (canPreview) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <div className="relative h-full w-full cursor-pointer">
            <img
              src={imageUrl}
              alt={displayName || 'Avatar'}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-[10px] font-medium text-white shadow-sm">
                {displayName ? 'View' : ''}
              </span>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-3xl border-none bg-transparent p-0 shadow-none">
          <DialogHeader className="sr-only">
            <DialogTitle>{displayName || 'Avatar'}</DialogTitle>
          </DialogHeader>
          <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg">
            <img
              src={fullSizeImageUrl || imageUrl}
              alt={displayName || 'Avatar'}
              className="max-h-[80vh] max-w-full object-contain shadow-2xl"
            />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return <img src={imageUrl} alt={displayName || 'Avatar'} className="h-full w-full object-cover" />
}

interface UploadControlsProps {
  disabled?: boolean
  canUpload: boolean
  status: 'idle' | 'uploading' | 'success' | 'error'
  onTrigger: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

function UploadControls({
  disabled,
  canUpload,
  status,
  onTrigger,
  onKeyDown,
}: UploadControlsProps) {
  if (disabled || !canUpload) {
    return null
  }

  if (status === 'idle') {
    return (
      <button
        type="button"
        onKeyDown={onKeyDown}
        className="absolute bottom-0 right-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-sm transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group-hover:opacity-100"
        onClick={onTrigger}
      >
        <Camera className="h-3 w-3" />
      </button>
    )
  }

  const statusConfig = {
    success: { bg: 'bg-green-500', icon: Check },
    error: { bg: 'bg-destructive', icon: AlertCircle },
    uploading: null,
  }

  const config = statusConfig[status as keyof typeof statusConfig]
  if (!config) {
    return null
  }

  const { bg, icon: Icon } = config
  return (
    <div
      className={cn(
        'absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full text-white shadow-sm',
        bg,
      )}
    >
      <Icon className="h-3 w-3" />
    </div>
  )
}
