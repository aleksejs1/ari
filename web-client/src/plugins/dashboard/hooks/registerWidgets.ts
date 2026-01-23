import { widgetRegistry } from '@/lib/widgets/WidgetRegistry'

import GroupsWidget from '../widgets/GroupsWidget'
import StatsWidget from '../widgets/StatsWidget'
import UpcomingAnniversariesWidget from '../widgets/UpcomingAnniversariesWidget'

export function registerDashboardWidgets() {
  widgetRegistry.register({
    id: 'stats',
    title: 'Stats',
    component: StatsWidget,
    defaultDimensions: { w: 12, h: 2 },
  })

  widgetRegistry.register({
    id: 'groups',
    title: 'Groups',
    component: GroupsWidget,
    defaultDimensions: { w: 12, h: 2 }, // Full width
  })

  widgetRegistry.register({
    id: 'upcoming-anniversaries',
    title: 'Upcoming Anniversaries',
    component: UpcomingAnniversariesWidget,
    defaultDimensions: { w: 5, h: 4 }, // ~40% width
  })
}
