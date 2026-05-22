import { useState } from 'react';
import {
  NavigationBar, NavigationRail, NavigationDrawer, TopAppBar, Toolbar, Tabs,
  IconButton, FAB,
} from '../../lib';
import { DemoSection, PageTitle } from '../components/DemoSection';

export function NavigationPage({ activeComponent }: { activeComponent?: string }) {
  const [tab, setTab] = useState<'home' | 'search' | 'library' | 'profile'>('home');
  const [tab2, setTab2] = useState<'a' | 'b' | 'c'>('a');
  const [drawer, setDrawer] = useState('inbox');

  const navItems = [
    { value: 'home', label: 'Home', icon: 'home' },
    { value: 'search', label: 'Search', icon: 'search' },
    { value: 'library', label: 'Library', icon: 'video_library' },
    { value: 'profile', label: 'Profile', icon: 'person' },
  ] as const;

  const showAll = !activeComponent;

  return (
    <>
      <PageTitle title="Navigation" subtitle="Top bars, bottom navigation, rails, drawers, toolbars, and tabs." />

      {(showAll || activeComponent === 'top-app-bar') && (
        <DemoSection
          title="Top App Bar"
          code={`<TopAppBar variant="small" title="Inbox"
  start={<IconButton icon="menu" label="Menu" />}
  end={<><IconButton icon="search" label="Search"/><IconButton icon="more_vert" label="More"/></>} />`}
        >
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <TopAppBar
              variant="small"
              title="Inbox"
              start={<IconButton icon="menu" label="Menu" />}
              end={<><IconButton icon="search" label="Search" /><IconButton icon="more_vert" label="More" /></>}
            />
            <TopAppBar
              variant="center"
              title="Page title"
              start={<IconButton icon="arrow_back" label="Back" />}
              end={<IconButton icon="favorite" label="Favorite" />}
            />
            <TopAppBar
              variant="large"
              title="Settings"
              start={<IconButton icon="arrow_back" label="Back" />}
              end={<IconButton icon="more_vert" label="More" />}
            />
          </div>
        </DemoSection>
      )}

      {(showAll || activeComponent === 'navigation-bar') && (
        <DemoSection
          title="Navigation Bar"
          code={`<NavigationBar items={items} value={v} onChange={setV} />`}
        >
          <div style={{ width: 480 }}>
            <NavigationBar items={navItems as any} value={tab} onChange={(v) => setTab(v as any)} />
          </div>
        </DemoSection>
      )}

      {(showAll || activeComponent === 'navigation-rail') && (
        <DemoSection
          title="Navigation Rail"
          code={`<NavigationRail items={items} value={v} onChange={setV} fab={<FAB icon="edit" />} />`}
        >
          <NavigationRail
            items={navItems as any}
            value={tab}
            onChange={(v) => setTab(v as any)}
            fab={<FAB icon="edit" size="md" />}
          />
        </DemoSection>
      )}

      {(showAll || activeComponent === 'navigation-drawer') && (
        <DemoSection
          title="Navigation Drawer"
          code={`<NavigationDrawer sections={...} value={v} onChange={setV} />`}
        >
          <NavigationDrawer
            value={drawer}
            onChange={setDrawer}
            sections={[
              { title: 'Mail', items: [
                { value: 'inbox', label: 'Inbox', icon: 'inbox', badge: 24 },
                { value: 'starred', label: 'Starred', icon: 'star' },
                { value: 'sent', label: 'Sent', icon: 'send' },
                { value: 'drafts', label: 'Drafts', icon: 'drafts' },
              ]},
              { title: 'Labels', items: [
                { value: 'family', label: 'Family', icon: 'label' },
                { value: 'work', label: 'Work', icon: 'label' },
              ]},
            ]}
          />
        </DemoSection>
      )}

      {(showAll || activeComponent === 'tabs') && (
        <DemoSection
          title="Tabs"
          code={`<Tabs items={items} value={v} onChange={setV} />`}
        >
          <div style={{ width: '100%' }}>
            <Tabs
              items={[
                { value: 'a', label: 'Overview', icon: 'dashboard' },
                { value: 'b', label: 'Activity', icon: 'history' },
                { value: 'c', label: 'Settings', icon: 'settings' },
              ]}
              value={tab2}
              onChange={(v) => setTab2(v as any)}
            />
          </div>
        </DemoSection>
      )}

      {(showAll || activeComponent === 'toolbar') && (
        <DemoSection
          title="Toolbar (Expressive)"
          description="A floating pill-shaped action cluster, new in MD3 Expressive."
          code={`<Toolbar>
  <IconButton icon="format_bold" label="Bold" />
  <IconButton icon="format_italic" label="Italic" />
  <IconButton icon="format_underlined" label="Underline" />
</Toolbar>`}
        >
          <Toolbar>
            <IconButton icon="format_bold" label="Bold" />
            <IconButton icon="format_italic" label="Italic" />
            <IconButton icon="format_underlined" label="Underline" />
            <IconButton icon="format_color_text" label="Color" />
          </Toolbar>
          <div style={{ height: 12 }}></div>
          <Toolbar vibrant>
            <IconButton icon="undo" label="Undo" />
            <IconButton icon="redo" label="Redo" />
            <IconButton icon="delete" label="Delete" />
          </Toolbar>
        </DemoSection>
      )}
    </>
  );
}
