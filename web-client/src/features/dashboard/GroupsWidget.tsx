import { Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { useGroups } from '../groups/useGroups'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function GroupsWidget() {
  const { t } = useTranslation()
  const { data: groups, isLoading } = useGroups()

  if (isLoading || !groups || groups.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="h-5 w-5 text-blue-500" />
          {t('app.navigation.groups')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {groups
            .filter((group) => (group.contactsCount ?? 0) > 0)
            .map((group) => (
              <Link key={group['@id']} to={`/contacts?group=${encodeURIComponent(group['@id'])}`}>
                <Badge variant="secondary" className="cursor-pointer hover:opacity-80">
                  {group.name} <span className="ml-1 opacity-60">({group.contactsCount})</span>
                </Badge>
              </Link>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}
