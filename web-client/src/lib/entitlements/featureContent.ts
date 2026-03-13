export interface FeatureContent {
  title: string
  description: string
  upgradeHint: string
}

const featureContent: Record<string, FeatureContent> = {
  contacts: {
    title: 'Contact Limit Reached',
    description: 'You have reached the maximum number of contacts for your plan.',
    upgradeHint: 'Upgrade your plan to add more contacts.',
  },
  google_import: {
    title: 'Google Import Unavailable',
    description: 'Importing contacts from Google is not available on your current plan.',
    upgradeHint: 'Upgrade your plan to enable Google Contacts import.',
  },
  ai_suggestions: {
    title: 'AI Name Suggestions Unavailable',
    description: 'AI-powered transliteration suggestions are not available on your current plan.',
    upgradeHint: 'Upgrade your plan to enable AI name suggestions.',
  },
  notifications: {
    title: 'Notification Channels Unavailable',
    description: 'Custom notification channels are not available on your current plan.',
    upgradeHint: 'Upgrade your plan to enable custom notification channels.',
  },
}

const fallbackContent: FeatureContent = {
  title: 'Feature Unavailable',
  description: 'This feature is not available on your current plan.',
  upgradeHint: 'Upgrade your plan to access this feature.',
}

export function getFeatureContent(feature: string): FeatureContent {
  return featureContent[feature] ?? fallbackContent
}
