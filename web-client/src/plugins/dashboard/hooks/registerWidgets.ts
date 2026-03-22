import { withPluginErrorBoundary } from '@/lib/core/PluginErrorBoundary'
import { widgetRegistry } from '@/lib/widgets/WidgetRegistry'

import ContactsQuotaWidget from '../widgets/ContactsQuotaWidget'
import GroupsWidget from '../widgets/GroupsWidget'
import StatsWidget from '../widgets/StatsWidget'
import UpcomingAnniversariesWidget from '../widgets/UpcomingAnniversariesWidget'

export function registerDashboardWidgets() {
  widgetRegistry.register({
    id: 'contacts-quota',
    title: 'Contact Usage',
    description: 'dashboard.widget.contactsQuota.description',
    component: withPluginErrorBoundary(ContactsQuotaWidget, 'dashboard'),
    defaultDimensions: { w: 6, h: 2 },
  })
  widgetRegistry.register({
    id: 'stats',
    title: 'Stats',
    description: 'dashboard.widget.stats.description',
    component: withPluginErrorBoundary(StatsWidget, 'dashboard'),
    defaultDimensions: { w: 12, h: 2 },
  })

  widgetRegistry.register({
    id: 'groups',
    title: 'Groups',
    description: 'dashboard.widget.groups.description',
    component: withPluginErrorBoundary(GroupsWidget, 'dashboard'),
    defaultDimensions: { w: 5, h: 4 },
  })

  widgetRegistry.register({
    id: 'upcoming-anniversaries',
    title: 'Upcoming Anniversaries',
    description: 'dashboard.widget.upcomingAnniversaries.description',
    component: withPluginErrorBoundary(UpcomingAnniversariesWidget, 'dashboard'),
    defaultDimensions: { w: 5, h: 4 },
  })
}
