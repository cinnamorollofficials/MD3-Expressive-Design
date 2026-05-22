# @hadi_gunawan/md3-expressive-ds

A React + TypeScript component library implementing Google's **Material Design 3 Expressive** specification.

~50 components, six preset themes (Purple / Ocean / Forest, light + dark), and the full MD3 token system as CSS custom properties.

## Install

```bash
npm install @hadi_gunawan/md3-expressive-ds
```

Peer dependencies: `react@^18.3.1 || ^19` and `react-dom@^18.3.1 || ^19`.

## Usage

```tsx
// Import the stylesheet ONCE at your app root. It carries the design tokens
// (--md-sys-color-*, --md-sys-shape-*, --md-sys-motion-*, etc.), the six
// built-in themes, typography, and a CSS reset.
import '@hadi_gunawan/md3-expressive-ds/style.css';

import { Button, Card, CardContent, CardTitle, useTheme } from '@hadi_gunawan/md3-expressive-ds';

export function Demo() {
  useTheme(); // applies data-theme / data-mode on <html> from localStorage
  return (
    <Card variant="filled">
      <CardContent>
        <CardTitle>Hello MD3</CardTitle>
        <Button variant="filled">Get started</Button>
      </CardContent>
    </Card>
  );
}
```

To pick a theme manually instead of using the `useTheme` hook, set the data attributes yourself:

```html
<html data-theme="ocean" data-mode="dark">
```

Themes: `purple` (default) · `ocean` · `forest`. Modes: `light` · `dark`.

## What's inside

About 50 components grouped by MD3 category:

- **Buttons & actions** — Button, IconButton, FAB, FABMenu, SplitButton, SegmentedButton
- **Containment** — Card, Chip, Banner, Divider, Accordion
- **Selection** — Checkbox, Radio, Switch, Slider, Rating
- **Input** — TextField, Search, Select, Combobox, NumberInput, DatePicker, TimePicker
- **Navigation** — TopAppBar, Toolbar, Tabs, NavigationBar, NavigationRail, NavigationDrawer, Breadcrumbs, Pagination, Stepper
- **Communication** — Snackbar, Dialog, BottomSheet, SideSheet, Tooltip, Menu, Badge, ProgressIndicator, LoadingIndicator (Expressive shape-morph), EmptyState
- **Content** — List, Avatar, AvatarGroup, Skeleton, Carousel, DataTable, Timeline, Tree, Icon

Hooks: `useTheme`, `useRipple`, `useFocusTrap`. Utility: `cn`.

## License

MIT © hadi_gunawan
