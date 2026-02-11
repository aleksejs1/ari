# Widget Cookbook: How to Create a New Widget

This guide explains how to add a new widget to the dashboard in 5 minutes.

## Checklist
1. [ ] Create the Widget Component
2. [ ] Register the Widget
3. [ ] Add Translations

---

## 1. Create the Widget Component
Create a new file in your plugin directory (e.g., `src/plugins/my-feature/widgets/MyNewWidget.tsx`).
Ensure it handles its own data fetching (e.g., via `useQuery`).

**Boilerplate:**

```tsx
import { Star } from 'lucide-react' // Choose an icon
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function MyNewWidget() {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Star className="h-5 w-5 text-yellow-500" />
          <span>{t('myWidget.title')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Widget content goes here.</p>
      </CardContent>
    </Card>
  )
}
```

## 2. Register the Widget
In your plugin's `register()` method or `registerWidgets.ts`, register the widget with a `description` field for the toggle panel:

```typescript
widgetRegistry.register({
  id: 'my-new-widget',
  title: 'myWidget.title',
  description: 'myWidget.description',  // Shown in the Customize panel
  component: MyNewWidget,
  defaultDimensions: { w: 6, h: 4 },
})
```

The `defaultDimensions.w` value determines the default zone placement when a user has no saved dashboard settings:
- `w >= 12` → Full-width zone
- `w > 6` → Left/main column
- `w <= 6` → Right/sidebar column

The widget will automatically appear in:
- The **Customize** panel (toggle visibility)
- The **default zone** based on its width
- The **edit mode** for drag-and-drop reordering

## 3. Add Translations
Add translation keys for the widget title and description:

```json
{
  "myWidget": {
    "title": "My Widget",
    "description": "Brief description for the customize panel"
  }
}
```

## How It Works

Once registered, the widget integrates with the customizable dashboard automatically:
- **Toggle**: Users can show/hide it via the Customize (gear icon) panel.
- **Reorder**: In edit mode (Reorder button), users can drag widgets within a zone.
- **Move**: In edit mode, users can drag widgets between zones (e.g., from left column to right column).
- **Layout**: When the user switches layout presets, widgets are redistributed into the new zones based on their `defaultDimensions.w`.

No additional configuration is needed — the `useDashboardSettings` hook handles merging newly registered widgets into the user's saved layout.

## Troubleshooting
- **Widget not showing?** Check that `widgetRegistry.register()` is called during your plugin's `register()` phase.
- **Widget not in toggle panel?** Ensure you provided a `description` field in the registration.
- **Widget disappears after layout switch?** Ensure your widget is registered before `useDashboardSettings` runs. Plugin registration happens at app bootstrap, so this should be automatic.
