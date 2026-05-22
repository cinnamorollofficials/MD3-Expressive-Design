# @hadi_gunawan/md3-expressive-ds

A React + TypeScript component library inspired by Google's **Material Design 3 Expressive** direction: dynamic color, expressive motion, flexible shapes, and adaptive component patterns for modern product UIs.

The package includes 40+ components, six preset themes (Purple / Ocean / Forest, light + dark), and a CSS custom property token system.

## Install

```bash
npm install @hadi_gunawan/md3-expressive-ds
```

Peer dependencies: `react@^18.3.1 || ^19` and `react-dom@^18.3.1 || ^19`.

## Usage

Import the bundled stylesheet once at your app root:

```tsx
import '@hadi_gunawan/md3-expressive-ds/style.css';

import { Button, Card, CardContent, CardTitle, useTheme } from '@hadi_gunawan/md3-expressive-ds';

export function Demo() {
  useTheme(); // applies data-theme and data-mode on <html>

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

## Required Icon Font

Components that render icons expect Google's Material Symbols Rounded font to be available. Add this to your HTML shell or self-host the font in your app:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
  rel="stylesheet"
/>
```

## Theming

Use the built-in themes with attributes on the root element:

```html
<html data-theme="ocean" data-mode="dark">
```

Themes: `purple` (default), `ocean`, `forest`, `custom`.
Modes: `light`, `dark`.

The stylesheet exposes Material-style CSS variables such as:

```css
--md-sys-color-primary
--md-sys-color-on-primary
--md-sys-color-surface-container
--md-sys-shape-corner-lg
--md-sys-motion-duration-medium2
--md-sys-typescale-body-medium
```

`useTheme().setSeedColor('#6750a4')` generates a custom HSL-based palette and writes CSS variables to `<html>`. This is intentionally lightweight; if you need exact Android dynamic color parity, wire your palette through Material Color Utilities and set the same CSS variables.

## SSR Notes

`useTheme` is safe to import during SSR, but it applies attributes and local storage only in the browser. In Next.js/Remix, call it from a client component or set `data-theme` and `data-mode` in your document shell to avoid a flash before hydration.

## What's Inside

- **Buttons & actions**: Button, IconButton, FAB, FABMenu, SplitButton, SegmentedButton
- **Containment**: Card, Chip, Banner, Divider, Accordion
- **Selection**: Checkbox, Radio, Switch, Slider, Rating
- **Input**: TextField, Search, Select, Combobox, NumberInput, DatePicker, TimePicker
- **Navigation**: TopAppBar, Toolbar, Tabs, NavigationBar, NavigationRail, NavigationDrawer, Breadcrumbs, Pagination, Stepper
- **Communication**: Snackbar, Dialog, BottomSheet, SideSheet, Tooltip, Menu, Badge, ProgressIndicator, LoadingIndicator, EmptyState
- **Content**: List, Avatar, AvatarGroup, Skeleton, Carousel, DataTable, Timeline, Tree, Icon

Hooks: `useTheme`, `useRipple`, `useFocusTrap`.
Utility: `cn`.

## Quality Checks

```bash
npm run typecheck
npm run audit:docs
npm test
npm run build:lib
```

`audit:docs` verifies that every demo component has explicit documentation metadata.

## License

MIT (c) hadi_gunawan
