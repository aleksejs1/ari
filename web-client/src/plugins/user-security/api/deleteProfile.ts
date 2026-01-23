import { api } from '@/lib/axios'

export const deleteProfile = async () => {
  return api.delete('/profile')
}
