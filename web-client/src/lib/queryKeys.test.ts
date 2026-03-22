import { describe, expect, it } from 'vitest'

import { queryKeys } from './queryKeys'

describe('queryKeys', () => {
  describe('contacts', () => {
    it('all returns stable array', () => {
      expect(queryKeys.contacts.all).toEqual(['contacts'])
    })

    it('list returns unique key per page/filters/sort', () => {
      const a = queryKeys.contacts.list(1, { search: 'foo' }, { id: 'name', desc: false })
      const b = queryKeys.contacts.list(2, { search: 'foo' }, { id: 'name', desc: false })
      expect(a).not.toEqual(b)
      expect(a).toEqual(['contacts', 1, { search: 'foo' }, { id: 'name', desc: false }])
    })

    it('detail encodes id as string', () => {
      expect(queryKeys.contacts.detail(42)).toEqual(['contacts', '42'])
      expect(queryKeys.contacts.detail('abc')).toEqual(['contacts', 'abc'])
    })

    it('similar returns correct tuple', () => {
      expect(queryKeys.contacts.similar('1')).toEqual(['contacts', '1', 'similar'])
    })

    it('timeline returns correct tuple', () => {
      expect(queryKeys.contacts.timeline(5)).toEqual(['contacts', '5', 'timeline'])
    })

    it('snapshot returns correct 4-element tuple', () => {
      expect(queryKeys.contacts.snapshot(1, 2)).toEqual(['contacts', '1', 'snapshot', '2'])
    })

    it('playbook returns correct tuple', () => {
      expect(queryKeys.contacts.playbook(7)).toEqual(['contacts', '7', 'playbook'])
    })

    it('reciprocity returns correct tuple', () => {
      expect(queryKeys.contacts.reciprocity('abc')).toEqual(['contacts', 'abc', 'reciprocity'])
    })

    it('tasks returns correct tuple', () => {
      expect(queryKeys.contacts.tasks(3)).toEqual(['contacts', '3', 'tasks'])
    })

    it('needsAttention returns correct tuple', () => {
      expect(queryKeys.contacts.needsAttention(10)).toEqual(['contacts', 'needsAttention', 10])
    })

    it('needsAttentionPaged returns correct tuple', () => {
      expect(queryKeys.contacts.needsAttentionPaged(2)).toEqual([
        'contacts',
        'needsAttention',
        'paged',
        2,
      ])
    })

    it('displayOptions is a stable constant', () => {
      expect(queryKeys.contacts.displayOptions).toEqual(['contacts', 'display-options'])
    })

    it('autocomplete is a stable constant', () => {
      expect(queryKeys.contacts.autocomplete).toEqual(['contacts', 'autocomplete'])
    })
  })

  describe('groups', () => {
    it('all is stable', () => {
      expect(queryKeys.groups.all).toEqual(['groups'])
    })

    it('list accepts arbitrary params object', () => {
      const params = { search: 'x', page: 1 }
      expect(queryKeys.groups.list(params)).toEqual(['groups', params])
    })
  })

  describe('notifications', () => {
    it('all is stable', () => {
      expect(queryKeys.notifications.all).toEqual(['notifications'])
    })

    it('list encodes page', () => {
      expect(queryKeys.notifications.list(3)).toEqual(['notifications', 3])
    })

    it('unreadCount is stable', () => {
      expect(queryKeys.notifications.unreadCount).toEqual(['notifications', 'unread-count'])
    })

    it('seasonalCheckin is stable', () => {
      expect(queryKeys.notifications.seasonalCheckin).toEqual(['notifications', 'seasonal-checkin'])
    })
  })

  describe('aiSuggestions', () => {
    it('byEntity encodes entity type and id', () => {
      expect(queryKeys.aiSuggestions.byEntity('contact', 5)).toEqual([
        'ai_suggestions',
        'contact',
        5,
      ])
    })

    it('stats is stable', () => {
      expect(queryKeys.aiSuggestions.stats).toEqual(['ai_suggestion_stats'])
    })
  })

  describe('playbookTemplates', () => {
    it('is stable', () => {
      expect(queryKeys.playbookTemplates).toEqual(['playbook_templates'])
    })
  })

  describe('systemSettings', () => {
    it('encodes key', () => {
      expect(queryKeys.systemSettings('registration')).toEqual(['system-settings', 'registration'])
    })
  })

  describe('marketplace', () => {
    it('registry is stable', () => {
      expect(queryKeys.marketplace.registry).toEqual(['marketplace', 'registry'])
    })

    it('readme includes pluginId', () => {
      expect(queryKeys.marketplace.readme('contacts-v2')).toEqual([
        'marketplace',
        'readme',
        'contacts-v2',
      ])
    })
  })
})
