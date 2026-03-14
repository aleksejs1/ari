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
    component: ContactsQuotaWidget,
    defaultDimensions: { w: 6, h: 2 },
  })
  widgetRegistry.register({
    id: 'stats',
    title: 'Stats',
    description: 'dashboard.widget.stats.description',
    component: StatsWidget,
    defaultDimensions: { w: 12, h: 2 },
  })

  widgetRegistry.register({
    id: 'groups',
    title: 'Groups',
    description: 'dashboard.widget.groups.description',
    component: GroupsWidget,
    defaultDimensions: { w: 5, h: 4 },
  })

  widgetRegistry.register({
    id: 'upcoming-anniversaries',
    title: 'Upcoming Anniversaries',
    description: 'dashboard.widget.upcomingAnniversaries.description',
    component: UpcomingAnniversariesWidget,
    defaultDimensions: { w: 5, h: 4 },
  })
}
