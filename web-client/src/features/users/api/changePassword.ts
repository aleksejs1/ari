import { api } from '@/lib/axios'

interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}

export const changePassword = async (data: ChangePasswordPayload) => {
  return api.put(`/profile/change-password`, data)
}
