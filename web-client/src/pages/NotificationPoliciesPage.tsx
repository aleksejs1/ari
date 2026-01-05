import { useTranslation } from 'react-i18next'

import NotificationPoliciesList from '@/features/notification-policies/components/NotificationPoliciesList'

export default function NotificationPoliciesPage() {
  // Hooks must be called even if unused to follow rules, or just remove if I don't need translations here.
  // Actually, if I don't use t, I might not need useTranslation at all?
  // But wait, maybe the app requires it for hydration/context?
  // Safe bet:
  useTranslation()
  // Or just remove it if possible. The component just renders a child.

  return (
    <div className="space-y-6">
      {/* If PageHeader exists, use it. Otherwise just use List which has its own header */}
      <NotificationPoliciesList />
    </div>
  )
}
