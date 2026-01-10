import { useMutation } from '@tanstack/react-query'

// import { changePassword } from '../api/changePassword' -> actually keep changePassword import
import { changePassword } from '../api/changePassword'

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) => {
      return changePassword(data)
    },
  })
}
