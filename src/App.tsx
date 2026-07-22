import { lazy, Suspense, useEffect, useState } from 'react';
import { DemoLayout } from './demo/components/DemoLayout';
import { OverviewPage } from './demo/pages/OverviewPage';
const ButtonsPage = lazy(() => import('./demo/pages/ButtonsPage').then(module => ({ default: module.ButtonsPage })));
const ContainmentPage = lazy(() => import('./demo/pages/ContainmentPage').then(module => ({ default: module.ContainmentPage })));
const SelectionPage = lazy(() => import('./demo/pages/SelectionPage').then(module => ({ default: module.SelectionPage })));
const InputPage = lazy(() => import('./demo/pages/InputPage').then(module => ({ default: module.InputPage })));
const NavigationPage = lazy(() => import('./demo/pages/NavigationPage').then(module => ({ default: module.NavigationPage })));
const CommunicationPage = lazy(() => import('./demo/pages/CommunicationPage').then(module => ({ default: module.CommunicationPage })));
const ContentPage = lazy(() => import('./demo/pages/ContentPage').then(module => ({ default: module.ContentPage })));
import { ShopDashboardPage } from './demo/examples/ShopDashboardPage';
import { CompanyProfilePage } from './demo/examples/CompanyProfilePage';
const IndonesiaLaborMapPage = lazy(() => import('./demo/examples/IndonesiaLaborMapPage').then(module => ({ default: module.IndonesiaLaborMapPage })));
const TradingUiPage = lazy(() => import('./demo/examples/TradingUiPage').then(module => ({ default: module.TradingUiPage })));
import { useTheme } from './lib/hooks/useTheme';

// Import new guide pages
import { InstallationPage } from './demo/pages/InstallationPage';
import { QuickStartPage } from './demo/pages/QuickStartPage';
import { ColorsPage } from './demo/pages/ColorsPage';
import { TypographyPage } from './demo/pages/TypographyPage';
import { MotionPage } from './demo/pages/MotionPage';
import { IconsPage } from './demo/pages/IconsPage';
import { DesignTokensPage } from './demo/pages/DesignTokensPage';
import { ChangelogPage } from './demo/pages/ChangelogPage';
const ChartsPage = lazy(() => import('./demo/pages/ChartsPage').then(module => ({ default: module.ChartsPage })));
const BarChartsPage = lazy(() => import('./demo/pages/BarChartsPage').then(module => ({ default: module.BarChartsPage })));
const NetworksPage = lazy(() => import('./demo/pages/NetworksPage').then(module => ({ default: module.NetworksPage })));
const AnalysisPage = lazy(() => import('./demo/pages/AnalysisPage').then(module => ({ default: module.AnalysisPage })));
const MapsPage = lazy(() => import('./demo/pages/MapsPage').then(module => ({ default: module.MapsPage })));
const HierarchiesPage = lazy(() => import('./demo/pages/HierarchiesPage').then(module => ({ default: module.HierarchiesPage })));





// Import new shell components
import { ComponentDocViewer } from './demo/components/ComponentDocViewer';
import { CommandPalette } from './demo/components/CommandPalette';

export interface ComponentDef {
  id: string;
  label: string;
  status?: 'stable' | 'beta' | 'experimental';
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
      { id: 'button', label: 'Button', status: 'stable' },
      { id: 'icon-button', label: 'IconButton', status: 'stable' },
      { id: 'fab', label: 'FAB', status: 'stable' },
      { id: 'fab-menu', label: 'FABMenu', status: 'stable' },
      { id: 'split-button', label: 'SplitButton', status: 'stable' },
      { id: 'segmented-button', label: 'SegmentedButton', status: 'stable' },
    ],
  },
  {
    id: 'containment',
    label: 'Containment',
    icon: 'view_quilt',
    components: [
      { id: 'card', label: 'Card', status: 'stable' },
      { id: 'dialog', label: 'Dialog', status: 'stable' },
      { id: 'bottom-sheet', label: 'BottomSheet', status: 'stable' },
      { id: 'side-sheet', label: 'SideSheet', status: 'stable' },
      { id: 'snackbar', label: 'Snackbar', status: 'stable' },
      { id: 'tooltip', label: 'Tooltip', status: 'stable' },
      { id: 'menu', label: 'Menu', status: 'stable' },
    ],
  },
  {
    id: 'selection',
    label: 'Selection',
    icon: 'check_box',
    components: [
      { id: 'checkbox', label: 'Checkbox', status: 'stable' },
      { id: 'radio', label: 'Radio', status: 'stable' },
      { id: 'switch', label: 'Switch', status: 'stable' },
      { id: 'chip', label: 'Chip', status: 'stable' },
    ],
  },
  {
    id: 'input',
    label: 'Inputs',
    icon: 'edit_note',
    components: [
      { id: 'text-field', label: 'TextField', status: 'stable' },
      { id: 'search', label: 'Search', status: 'stable' },
      { id: 'slider', label: 'Slider', status: 'stable' },
      { id: 'select', label: 'Select', status: 'stable' },
      { id: 'combobox', label: 'Combobox', status: 'stable' },
      { id: 'number-input', label: 'NumberInput', status: 'stable' },
      { id: 'rating', label: 'Rating', status: 'stable' },
      { id: 'date-picker', label: 'DatePicker', status: 'stable' },
      { id: 'time-picker', label: 'TimePicker', status: 'stable' },
    ],
  },
  {
    id: 'navigation',
    label: 'Navigation',
    icon: 'menu',
    components: [
      { id: 'top-app-bar', label: 'TopAppBar', status: 'stable' },
      { id: 'navigation-bar', label: 'NavigationBar', status: 'stable' },
      { id: 'navigation-rail', label: 'NavigationRail', status: 'stable' },
      { id: 'navigation-drawer', label: 'NavigationDrawer', status: 'stable' },
      { id: 'tabs', label: 'Tabs', status: 'stable' },
      { id: 'toolbar', label: 'Toolbar', status: 'stable' },
    ],
  },
  {
    id: 'communication',
    label: 'Communication',
    icon: 'notifications',
    components: [
      { id: 'badge', label: 'Badge', status: 'stable' },
      { id: 'progress-indicator', label: 'ProgressIndicator', status: 'stable' },
      { id: 'loading-indicator', label: 'LoadingIndicator', status: 'stable' },
      { id: 'banner', label: 'Banner', status: 'stable' },
    ],
  },
  {
    id: 'content',
    label: 'Content',
    icon: 'view_list',
    components: [
      { id: 'avatar', label: 'Avatar', status: 'stable' },
      { id: 'breadcrumbs', label: 'Breadcrumbs', status: 'stable' },
      { id: 'stepper', label: 'Stepper', status: 'stable' },
      { id: 'pagination', label: 'Pagination', status: 'stable' },
      { id: 'skeleton', label: 'Skeleton', status: 'stable' },
      { id: 'empty-state', label: 'EmptyState', status: 'stable' },
      { id: 'data-table', label: 'DataTable', status: 'stable' },
      { id: 'timeline', label: 'Timeline', status: 'stable' },
      { id: 'accordion', label: 'Accordion', status: 'stable' },
      { id: 'tree', label: 'Tree', status: 'stable' },
      { id: 'list', label: 'List', status: 'stable' },
      { id: 'divider', label: 'Divider', status: 'stable' },
      { id: 'carousel', label: 'Carousel', status: 'stable' },
    ],
  },
  {
    id: 'charts',
    label: 'Charts',
    icon: 'show_chart',
    components: [
      { id: 'area-chart', label: 'Area Chart', status: 'beta' },
      { id: 'area-chart-missing', label: 'Area Chart with Missing Data', status: 'beta' },
      { id: 'stacked-area-chart', label: 'Stacked Area Chart', status: 'beta' },
      { id: 'normalized-stacked-area-chart', label: 'Normalized Stacked Area Chart', status: 'beta' },
      { id: 'streamgraph', label: 'Streamgraph', status: 'beta' },
      { id: 'difference-chart', label: 'Difference Chart', status: 'beta' },
      { id: 'calendar-chart', label: 'Calendar View', status: 'beta' },
    ],
  },
  {
    id: 'bar-charts',
    label: 'Bar Charts',
    icon: 'bar_chart',
    components: [
      { id: 'bar-chart', label: 'Bar Chart', status: 'beta' },
      { id: 'horizontal-bar-chart', label: 'Horizontal Bar Chart', status: 'beta' },
      { id: 'diverging-bar-chart', label: 'Diverging Bar Chart', status: 'beta' },
      { id: 'stacked-bar-chart', label: 'Stacked Bar Chart', status: 'beta' },
      { id: 'normalized-stacked-bar-chart', label: 'Normalized Stacked Bar Chart', status: 'beta' },
      { id: 'timeline-chart', label: 'World History Timeline', status: 'beta' },
    ],
  },
  {
    id: 'networks',
    label: 'Networks',
    icon: 'hub',
    components: [
      { id: 'force-directed-graph', label: 'Force-Directed Graph', status: 'beta' },
      { id: 'disjoint-force-directed-graph', label: 'Disjoint Force-Directed Graph', status: 'beta' },
      { id: 'mobile-patent-suits', label: 'Mobile Patent Suits', status: 'beta' },
      { id: 'arc-diagram', label: 'Arc Diagram', status: 'beta' },
      { id: 'sankey-diagram', label: 'Sankey Diagram', status: 'beta' },
      { id: 'chord-diagram', label: 'Chord Diagram', status: 'beta' },
      { id: 'hierarchical-edge-bundling', label: 'Hierarchical Edge Bundling', status: 'beta' },
    ],
  },
  {
    id: 'analysis',
    label: 'Analysis',
    icon: 'analytics',
    components: [
      { id: 'candlestick-chart', label: 'Candlestick Chart', status: 'beta' },
      { id: 'moving-average', label: 'Moving Average', status: 'beta' },
      { id: 'bollinger-bands', label: 'Bollinger Bands', status: 'beta' },
      { id: 'box-plot', label: 'Box Plot', status: 'beta' },
      { id: 'histogram', label: 'Histogram', status: 'beta' },
      { id: 'kernel-density-estimation', label: 'Kernel Density Estimation', status: 'beta' },
      { id: 'hexbin-chart', label: 'Hexbin Chart', status: 'beta' },
      { id: 'qq-plot', label: 'Q-Q Plot', status: 'beta' },
    ],
  },
  {
    id: 'maps',
    label: 'Maps',
    icon: 'map',
    components: [
      { id: 'choropleth', label: 'Choropleth Map', status: 'beta' },
      { id: 'world-choropleth', label: 'World Choropleth', status: 'beta' },
      { id: 'bivariate-choropleth', label: 'Bivariate Choropleth', status: 'beta' },
    ],
  },
  {
    id: 'hierarchies',
    label: 'Hierarchies',
    icon: 'account_tree',
    components: [
      { id: 'treemap', label: 'Treemap', status: 'beta' },
      { id: 'indented-tree', label: 'Indented Tree', status: 'beta' },
      { id: 'tidy-tree', label: 'Tidy Tree', status: 'beta' },
      { id: 'radial-tree', label: 'Radial Tidy Tree', status: 'beta' },
      { id: 'sunburst-chart', label: 'Sunburst Diagram', status: 'beta' },
      { id: 'tangled-tree', label: 'Tangled Tree', status: 'beta' },
    ],
  },
];











const getPageAndComponent = (hash: string) => {
  const extraPages = [
    'overview', 'quick-start', 'installation', 'tokens', 'typography', 'colors',
    'motion', 'icons', 'changelog', 'shop-dashboard',
    'company-profile', 'indonesia-labor-map', 'trading-ui'
  ];

  if (extraPages.includes(hash)) {
    return { page: hash, activeComponent: undefined };
  }
  for (const group of COMPONENT_GROUPS) {
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
  const [commandOpen, setCommandOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onLocationChange = () => {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 200); // skeleton fake speed
      setCurrentHash(window.location.hash.replace(/^#/, '') || 'overview');
      return () => clearTimeout(timer);
    };
    window.addEventListener('hashchange', onLocationChange);
    window.addEventListener('popstate', onLocationChange);
    return () => {
      window.removeEventListener('hashchange', onLocationChange);
      window.removeEventListener('popstate', onLocationChange);
    };
  }, []);

  // listen to Ctrl+K key shortcut
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, []);

  const navigate = (id: string) => {
    if (id === 'overview') {
      if (window.location.hash) {
        window.history.pushState(null, '', `${window.location.pathname}${window.location.search}`);
      }
      setCurrentHash('overview');
    } else {
      window.location.hash = id;
      setCurrentHash(id);
    }
    // Automatically scroll to top on navigate
    window.scrollTo({ top: 0 });
  };

  const { page, activeComponent } = getPageAndComponent(currentHash);

  let content;
  switch (page) {
    // Categories pages
    case 'buttons': content = <ButtonsPage activeComponent={activeComponent} />; break;
    case 'containment': content = <ContainmentPage activeComponent={activeComponent} />; break;
    case 'selection': content = <SelectionPage activeComponent={activeComponent} />; break;
    case 'input': content = <InputPage activeComponent={activeComponent} />; break;
    case 'navigation': content = <NavigationPage activeComponent={activeComponent} />; break;
    case 'communication': content = <CommunicationPage activeComponent={activeComponent} />; break;
    case 'content': content = <ContentPage activeComponent={activeComponent} />; break;
    case 'charts': content = <ChartsPage activeComponent={activeComponent} />; break;
    case 'bar-charts': content = <BarChartsPage activeComponent={activeComponent} />; break;
    case 'networks': content = <NetworksPage activeComponent={activeComponent} />; break;
    case 'analysis': content = <AnalysisPage activeComponent={activeComponent} />; break;
    case 'maps': content = <MapsPage activeComponent={activeComponent} />; break;
    case 'hierarchies': content = <HierarchiesPage activeComponent={activeComponent} />; break;



    // Custom docs pages
    case 'quick-start': content = <QuickStartPage />; break;
    case 'installation': content = <InstallationPage />; break;
    case 'colors': content = <ColorsPage />; break;
    case 'typography': content = <TypographyPage />; break;
    case 'motion': content = <MotionPage />; break;
    case 'icons': content = <IconsPage />; break;
    case 'tokens': content = <DesignTokensPage />; break;
    case 'changelog': content = <ChangelogPage />; break;

    // Examples
    case 'shop-dashboard': content = <ShopDashboardPage />; break;
    case 'company-profile': content = <CompanyProfilePage />; break;
    case 'indonesia-labor-map': content = <IndonesiaLaborMapPage />; break;
    case 'trading-ui': content = <TradingUiPage />; break;
    default: content = <OverviewPage groups={COMPONENT_GROUPS} />;
  }

  // Wrap detailed per-component page with playground layout
  if (activeComponent) {
    content = <ComponentDocViewer id={activeComponent}>{content}</ComponentDocViewer>;
  }

  return (
    <div style={{ position: 'relative' }}>
      <DemoLayout
        current={currentHash}
        activeGroup={page}
        activeComponent={activeComponent}
        onNavigate={navigate}
        groups={COMPONENT_GROUPS}
        onSearchClick={() => setCommandOpen(true)}
      >
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Skeleton Loading Card */}
            <div style={{
              height: 48,
              width: '40%',
              borderRadius: 8,
              background: 'var(--md-sys-color-surface-container-high)',
              animation: 'pulse 1.5s infinite ease-in-out'
            }} />
            <div style={{
              height: 180,
              width: '100%',
              borderRadius: 16,
              background: 'var(--md-sys-color-surface-container-high)',
              animation: 'pulse 1.5s infinite ease-in-out'
            }} />
            <div style={{
              height: 32,
              width: '65%',
              borderRadius: 8,
              background: 'var(--md-sys-color-surface-container-high)',
              animation: 'pulse 1.5s infinite ease-in-out'
            }} />
            <div style={{
              height: 300,
              width: '100%',
              borderRadius: 16,
              background: 'var(--md-sys-color-surface-container-high)',
              animation: 'pulse 1.5s infinite ease-in-out'
            }} />
          </div>
        ) : (
          <Suspense fallback={
            <div style={{ display: 'grid', gap: 16 }}>
              <div style={{ height: 44, width: '38%', borderRadius: 12, background: 'var(--md-sys-color-surface-container-high)' }} />
              <div style={{ height: 240, borderRadius: 24, background: 'var(--md-sys-color-surface-container-low)' }} />
            </div>
          }>
            {content}
          </Suspense>
        )}
      </DemoLayout>

      {/* Global search overlay command palette */}
      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        onNavigate={navigate}
      />

      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 0.9; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

