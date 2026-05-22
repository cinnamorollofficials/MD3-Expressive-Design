import { useEffect, useState } from 'react';
import { DemoLayout } from './demo/components/DemoLayout';
import { OverviewPage } from './demo/pages/OverviewPage';
import { ButtonsPage } from './demo/pages/ButtonsPage';
import { ContainmentPage } from './demo/pages/ContainmentPage';
import { SelectionPage } from './demo/pages/SelectionPage';
import { InputPage } from './demo/pages/InputPage';
import { NavigationPage } from './demo/pages/NavigationPage';
import { CommunicationPage } from './demo/pages/CommunicationPage';
import { ContentPage } from './demo/pages/ContentPage';
import { ShopDashboardPage } from './demo/examples/ShopDashboardPage';
import { CompanyProfilePage } from './demo/examples/CompanyProfilePage';
import { ExamplesPage } from './demo/pages/ExamplesPage';
import { useTheme } from './lib/hooks/useTheme';

export interface ComponentDef {
  id: string;
  label: string;
}

export interface GroupDef {
  id: string;
  label: string;
  icon: string;
  components: ComponentDef[];
}

export const COMPONENT_GROUPS: GroupDef[] = [
  {
    id: 'buttons',
    label: 'Buttons',
    icon: 'smart_button',
    components: [
      { id: 'button', label: 'Button' },
      { id: 'icon-button', label: 'IconButton' },
      { id: 'fab', label: 'FAB' },
      { id: 'fab-menu', label: 'FABMenu' },
      { id: 'split-button', label: 'SplitButton' },
      { id: 'segmented-button', label: 'SegmentedButton' },
    ],
  },
  {
    id: 'containment',
    label: 'Containment',
    icon: 'view_quilt',
    components: [
      { id: 'card', label: 'Card' },
      { id: 'dialog', label: 'Dialog' },
      { id: 'bottom-sheet', label: 'BottomSheet' },
      { id: 'side-sheet', label: 'SideSheet' },
      { id: 'snackbar', label: 'Snackbar' },
      { id: 'tooltip', label: 'Tooltip' },
      { id: 'menu', label: 'Menu' },
    ],
  },
  {
    id: 'selection',
    label: 'Selection',
    icon: 'check_box',
    components: [
      { id: 'checkbox', label: 'Checkbox' },
      { id: 'radio', label: 'Radio' },
      { id: 'switch', label: 'Switch' },
      { id: 'chip', label: 'Chip' },
    ],
  },
  {
    id: 'input',
    label: 'Inputs',
    icon: 'edit_note',
    components: [
      { id: 'text-field', label: 'TextField' },
      { id: 'search', label: 'Search' },
      { id: 'slider', label: 'Slider' },
      { id: 'select', label: 'Select' },
      { id: 'combobox', label: 'Combobox' },
      { id: 'number-input', label: 'NumberInput' },
      { id: 'rating', label: 'Rating' },
      { id: 'date-picker', label: 'DatePicker' },
      { id: 'time-picker', label: 'TimePicker' },
    ],
  },
  {
    id: 'navigation',
    label: 'Navigation',
    icon: 'menu',
    components: [
      { id: 'top-app-bar', label: 'TopAppBar' },
      { id: 'navigation-bar', label: 'NavigationBar' },
      { id: 'navigation-rail', label: 'NavigationRail' },
      { id: 'navigation-drawer', label: 'NavigationDrawer' },
      { id: 'tabs', label: 'Tabs' },
      { id: 'toolbar', label: 'Toolbar' },
    ],
  },
  {
    id: 'communication',
    label: 'Communication',
    icon: 'notifications',
    components: [
      { id: 'badge', label: 'Badge' },
      { id: 'progress-indicator', label: 'ProgressIndicator' },
      { id: 'loading-indicator', label: 'LoadingIndicator' },
      { id: 'banner', label: 'Banner' },
    ],
  },
  {
    id: 'content',
    label: 'Content',
    icon: 'view_list',
    components: [
      { id: 'avatar', label: 'Avatar' },
      { id: 'breadcrumbs', label: 'Breadcrumbs' },
      { id: 'stepper', label: 'Stepper' },
      { id: 'pagination', label: 'Pagination' },
      { id: 'skeleton', label: 'Skeleton' },
      { id: 'empty-state', label: 'EmptyState' },
      { id: 'data-table', label: 'DataTable' },
      { id: 'timeline', label: 'Timeline' },
      { id: 'accordion', label: 'Accordion' },
      { id: 'tree', label: 'Tree' },
      { id: 'list', label: 'List' },
      { id: 'divider', label: 'Divider' },
      { id: 'carousel', label: 'Carousel' },
    ],
  },
];

const getPageAndComponent = (hash: string) => {
  if (hash === 'overview' || hash === 'examples' || hash === 'shop-dashboard' || hash === 'company-profile') {
    return { page: hash, activeComponent: undefined };
  }
  for (const group of COMPONENT_GROUPS) {
    if (group.id === hash) {
      return { page: group.id, activeComponent: undefined };
    }
    const found = group.components.find(c => c.id === hash);
    if (found) {
      return { page: group.id, activeComponent: found.id };
    }
  }
  return { page: 'overview', activeComponent: undefined };
};

export function App() {
  useTheme(); // ensures data-theme/data-mode are applied
  const [currentHash, setCurrentHash] = useState<string>(() => window.location.hash.replace(/^#/, '') || 'overview');

  useEffect(() => {
    const onHash = () => setCurrentHash(window.location.hash.replace(/^#/, '') || 'overview');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = (id: string) => {
    window.location.hash = id;
    setCurrentHash(id);
  };

  const { page, activeComponent } = getPageAndComponent(currentHash);

  let content;
  switch (page) {
    case 'buttons': content = <ButtonsPage activeComponent={activeComponent} />; break;
    case 'containment': content = <ContainmentPage activeComponent={activeComponent} />; break;
    case 'selection': content = <SelectionPage activeComponent={activeComponent} />; break;
    case 'input': content = <InputPage activeComponent={activeComponent} />; break;
    case 'navigation': content = <NavigationPage activeComponent={activeComponent} />; break;
    case 'communication': content = <CommunicationPage activeComponent={activeComponent} />; break;
    case 'content': content = <ContentPage activeComponent={activeComponent} />; break;
    case 'examples': content = <ExamplesPage onNavigate={navigate} />; break;
    case 'shop-dashboard': content = <ShopDashboardPage />; break;
    case 'company-profile': content = <CompanyProfilePage />; break;
    default: content = <OverviewPage />;
  }

  return (
    <DemoLayout
      current={currentHash}
      activeGroup={page}
      activeComponent={activeComponent}
      onNavigate={navigate}
      groups={COMPONENT_GROUPS}
    >
      {content}
    </DemoLayout>
  );
}
