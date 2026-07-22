import { useEffect, useState, useRef, useMemo } from 'react';
import { Icon } from '../../lib/components/Icon';
import { cn } from '../../lib/utils/cn';
import styles from './CommandPalette.module.css';

interface CommandItem {
  id: string;
  category: 'Components' | 'Guides & Styles' | 'Examples';
  label: string;
  desc: string;
  icon: string;
  hash: string;
}

const SEARCH_ITEMS: CommandItem[] = [
  // Guides
  { id: 'quick-start', category: 'Guides & Styles', label: 'Quick start', desc: 'Build your first MD3 Expressive interface', icon: 'rocket_launch', hash: 'quick-start' },
  { id: 'installation', category: 'Guides & Styles', label: 'Installation & Setup', desc: 'Get started importing the library', icon: 'download', hash: 'installation' },
  { id: 'tokens', category: 'Guides & Styles', label: 'Design Tokens', desc: 'Shapes, elevations, and outline tokens list', icon: 'style', hash: 'tokens' },
  { id: 'colors', category: 'Guides & Styles', label: 'Theme & Colors', desc: 'MD3 core palette and live contrast checking', icon: 'palette', hash: 'colors' },
  { id: 'typography', category: 'Guides & Styles', label: 'Typography Showcase', desc: 'Type scaling values and size displays', icon: 'text_fields', hash: 'typography' },
  { id: 'motion', category: 'Guides & Styles', label: 'Motion & Transition', desc: 'Token durations, easings and play physics', icon: 'motion_photos_on', hash: 'motion' },
  { id: 'icons', category: 'Guides & Styles', label: 'Icon Gallery', desc: 'Searchable Material icons cheat sheet', icon: 'emoji_symbols', hash: 'icons' },
  { id: 'changelog', category: 'Guides & Styles', label: 'Changelog', desc: 'Full version history tracker', icon: 'history', hash: 'changelog' },

  // Examples
  { id: 'shop-dashboard', category: 'Examples', label: 'Shop Dashboard', desc: 'Premium responsive e-commerce dashboard', icon: 'storefront', hash: 'shop-dashboard' },
  { id: 'company-profile', category: 'Examples', label: 'Company Profile', desc: 'Enterprise website landing layout', icon: 'business', hash: 'company-profile' },

  // Components
  { id: 'button', category: 'Components', label: 'Button', desc: 'Common actions, sizes, and outlines', icon: 'smart_button', hash: 'button' },
  { id: 'icon-button', category: 'Components', label: 'IconButton', desc: 'Compact icon actions & toggles', icon: 'favorite', hash: 'icon-button' },
  { id: 'fab', category: 'Components', label: 'FAB (Floating Action Button)', desc: 'Primary screen action FABs', icon: 'add', hash: 'fab' },
  { id: 'fab-menu', category: 'Components', label: 'FABMenu', desc: 'Spring animated staggered fan menu', icon: 'call_split', hash: 'fab-menu' },
  { id: 'split-button', category: 'Components', label: 'SplitButton', desc: 'Primary action + list dropdown', icon: 'call_split', hash: 'split-button' },
  { id: 'segmented-button', category: 'Components', label: 'SegmentedButton', desc: 'Tabbed selection buttons cluster', icon: 'view_week', hash: 'segmented-button' },
  { id: 'card', category: 'Components', label: 'Card', desc: 'Subject wrappers with actions', icon: 'view_quilt', hash: 'card' },
  { id: 'dialog', category: 'Components', label: 'Dialog', desc: 'Critical focus-trapped alerts', icon: 'view_quilt', hash: 'dialog' },
  { id: 'bottom-sheet', category: 'Components', label: 'BottomSheet', desc: 'Anchored bottom layouts', icon: 'layers', hash: 'bottom-sheet' },
  { id: 'side-sheet', category: 'Components', label: 'SideSheet', desc: 'Collapsible side content overlays', icon: 'view_sidebar', hash: 'side-sheet' },
  { id: 'snackbar', category: 'Components', label: 'Snackbar', desc: 'Temporary action banners', icon: 'sms', hash: 'snackbar' },
  { id: 'tooltip', category: 'Components', label: 'Tooltip', desc: 'Hover context overlays', icon: 'info', hash: 'tooltip' },
  { id: 'menu', category: 'Components', label: 'Menu', desc: 'Floating item options list', icon: 'folder_open', hash: 'menu' },
  { id: 'checkbox', category: 'Components', label: 'Checkbox', desc: 'Multi selection list choices', icon: 'check_box', hash: 'checkbox' },
  { id: 'radio', category: 'Components', label: 'Radio Button', desc: 'Single list selection toggles', icon: 'radio_button_checked', hash: 'radio' },
  { id: 'switch', category: 'Components', label: 'Switch', desc: 'Binary setting toggle state', icon: 'toggle_on', hash: 'switch' },
  { id: 'chip', category: 'Components', label: 'Chip', desc: 'Small action, select, and input pills', icon: 'tag', hash: 'chip' },
  { id: 'text-field', category: 'Components', label: 'TextField', desc: 'Input text controls with styles', icon: 'edit_note', hash: 'text-field' },
  { id: 'search', category: 'Components', label: 'Search Input', desc: 'Search fields with actions', icon: 'search', hash: 'search' },
  { id: 'slider', category: 'Components', label: 'Slider', desc: 'Numeric range drag sliders', icon: 'tune', hash: 'slider' },
  { id: 'select', category: 'Components', label: 'Select Dropdown', desc: 'Standard item select inputs', icon: 'arrow_drop_down_circle', hash: 'select' },
  { id: 'combobox', category: 'Components', label: 'Combobox', desc: 'Searchable auto-completion text input', icon: 'unfold_more', hash: 'combobox' },
  { id: 'number-input', category: 'Components', label: 'NumberInput', desc: 'Counter controls with step buttons', icon: 'add_circle', hash: 'number-input' },
  { id: 'rating', category: 'Components', label: 'Rating Stars', desc: 'Star selector ratings', icon: 'star', hash: 'rating' },
  { id: 'date-picker', category: 'Components', label: 'DatePicker', desc: 'Visual calendar pickers', icon: 'calendar_month', hash: 'date-picker' },
  { id: 'time-picker', category: 'Components', label: 'TimePicker', desc: 'Visual dial clocks', icon: 'schedule', hash: 'time-picker' },
  { id: 'top-app-bar', category: 'Components', label: 'TopAppBar', desc: 'Screen header controls', icon: 'view_headline', hash: 'top-app-bar' },
  { id: 'navigation-bar', category: 'Components', label: 'NavigationBar', desc: 'App footer icon menu', icon: 'grid_view', hash: 'navigation-bar' },
  { id: 'navigation-rail', category: 'Components', label: 'NavigationRail', desc: 'Sidebar vertical icon rail', icon: 'view_headline', hash: 'navigation-rail' },
  { id: 'navigation-drawer', category: 'Components', label: 'NavigationDrawer', desc: 'Full vertical navigation list drawers', icon: 'menu', hash: 'navigation-drawer' },
  { id: 'tabs', category: 'Components', label: 'Tabs Layout', desc: 'Section switchers tab clusters', icon: 'tab', hash: 'tabs' },
  { id: 'toolbar', category: 'Components', label: 'Toolbar', desc: 'Expressive pill-shaped controls', icon: 'toolbar', hash: 'toolbar' },
  { id: 'badge', category: 'Components', label: 'Badge Notification', desc: 'Floating dot and numeric counters', icon: 'notifications', hash: 'badge' },
  { id: 'progress-indicator', category: 'Components', label: 'ProgressIndicator', desc: 'Linear and circular tracking bars', icon: 'hourglass_empty', hash: 'progress-indicator' },
  { id: 'loading-indicator', category: 'Components', label: 'Loading Blob', desc: 'Organic shape-shifting morph loader', icon: 'blur_on', hash: 'loading-indicator' },
  { id: 'banner', category: 'Components', label: 'Banner Alert', desc: 'Header message strips', icon: 'warning', hash: 'banner' },
  { id: 'avatar', category: 'Components', label: 'Avatar Profile', desc: 'Initials & image profile icons', icon: 'account_circle', hash: 'avatar' },
  { id: 'breadcrumbs', category: 'Components', label: 'Breadcrumbs', desc: 'Page route links guides', icon: 'chevron_right', hash: 'breadcrumbs' },
  { id: 'stepper', category: 'Components', label: 'Stepper Forms', desc: 'Multi-step process guides', icon: 'linear_scale', hash: 'stepper' },
  { id: 'pagination', category: 'Components', label: 'Pagination', desc: 'Data split page navigation links', icon: 'last_page', hash: 'pagination' },
  { id: 'skeleton', category: 'Components', label: 'Skeleton Loader', desc: 'Placeholder cards loading structure', icon: 'dashboard', hash: 'skeleton' },
  { id: 'empty-state', category: 'Components', label: 'EmptyState', desc: 'Zero visual state templates', icon: 'inbox', hash: 'empty-state' },
  { id: 'data-table', category: 'Components', label: 'DataTable', desc: 'Grid records table matrices', icon: 'table_view', hash: 'data-table' },
  { id: 'timeline', category: 'Components', label: 'Timeline Tracker', desc: 'Chronological event nodes', icon: 'timeline', hash: 'timeline' },
  { id: 'accordion', category: 'Components', label: 'Accordion Cards', desc: 'Vertical collapsible text cards', icon: 'expand_more', hash: 'accordion' },
  { id: 'tree', category: 'Components', label: 'Tree List', desc: 'Hierarchical file tree systems', icon: 'account_tree', hash: 'tree' },
  { id: 'list', category: 'Components', label: 'List Rows', desc: 'Stacked grid components rows', icon: 'list', hash: 'list' },
  { id: 'divider', category: 'Components', label: 'Divider Strip', desc: 'Row spacing separator lines', icon: 'remove', hash: 'divider' },
  { id: 'carousel', category: 'Components', label: 'Carousel Slider', desc: 'Morph-animating image scroll boxes', icon: 'photo_library', hash: 'carousel' },
];

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (hash: string) => void;
}

export function CommandPalette({ open, onClose, onNavigate }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setSearch('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Handle global keybindings
  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % filteredItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[activeIndex]) {
          handleSelect(filteredItems[activeIndex].hash);
        }
      }
    };

    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, [open, activeIndex, search]);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return SEARCH_ITEMS;
    const query = search.toLowerCase();
    return SEARCH_ITEMS.filter(
      item =>
        item.label.toLowerCase().includes(query) ||
        item.desc.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    );
  }, [search]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector(`.${styles.activeItem}`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex]);

  if (!open) return null;

  const handleSelect = (hash: string) => {
    onNavigate(hash);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.paletteCard} onClick={e => e.stopPropagation()}>
        <header className={styles.searchHeader}>
          <Icon name="search" size={22} className={styles.searchIcon} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search commands, tokens, guidelines..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setActiveIndex(0);
            }}
            className={styles.searchInput}
          />
          <kbd className={styles.escKey}>ESC</kbd>
        </header>

        <div className={styles.resultsList} ref={listRef}>
          {filteredItems.length > 0 ? (
            (() => {
              // Grouped rendering
              const categories: Record<string, CommandItem[]> = {};
              filteredItems.forEach(item => {
                if (!categories[item.category]) categories[item.category] = [];
                categories[item.category].push(item);
              });

              let globalIdx = 0;

              return Object.entries(categories).map(([catName, items]) => (
                <div key={catName} className={styles.catGroup}>
                  <div className={styles.catLabel}>{catName}</div>
                  {items.map(item => {
                    const itemGlobalIdx = globalIdx++;
                    const isActive = itemGlobalIdx === activeIndex;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={cn(styles.paletteItem, isActive && styles.activeItem)}
                        onClick={() => handleSelect(item.hash)}
                        onMouseEnter={() => setActiveIndex(itemGlobalIdx)}
                      >
                        <Icon name={item.icon} size={20} className={styles.itemIcon} />
                        <div style={{ flex: 1, textAlign: 'left' }}>
                          <div className={styles.itemLabel}>{item.label}</div>
                          <div className={styles.itemDesc}>{item.desc}</div>
                        </div>
                        <Icon name="subdirectory_arrow_left" size={14} className={styles.enterIcon} />
                      </button>
                    );
                  })}
                </div>
              ));
            })()
          ) : (
            <div className={styles.emptyState}>
              <Icon name="sentiment_dissatisfied" size={32} />
              <div>No results matched your search query.</div>
            </div>
          )}
        </div>

        <footer className={styles.footerHints}>
          <span><kbd className={styles.hintKey}>↑↓</kbd> Navigate</span>
          <span><kbd className={styles.hintKey}>↵</kbd> Select</span>
          <span><kbd className={styles.hintKey}>esc</kbd> Dismiss</span>
        </footer>
      </div>
    </div>
  );
}
