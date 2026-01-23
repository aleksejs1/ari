import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'

import { deleteProfile } from '../api/deleteProfile'

export const useDeleteProfile = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: deleteProfile,
    onSuccess: async () => {
      localStorage.removeItem('token')
      await navigate('/login')
    },
  })
}
