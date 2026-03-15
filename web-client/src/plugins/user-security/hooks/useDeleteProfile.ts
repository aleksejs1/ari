import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'

import { storage, STORAGE_KEYS } from '@/lib/storage'

import { deleteProfile } from '../api/deleteProfile'

export const useDeleteProfile = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: deleteProfile,
    onSuccess: async () => {
      storage.remove(STORAGE_KEYS.TOKEN)
      await navigate('/login')
    },
  })
}
