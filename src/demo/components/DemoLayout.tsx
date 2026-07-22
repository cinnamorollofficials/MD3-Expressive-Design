import { ReactNode, Fragment, useState, useMemo, useEffect } from 'react';
import { cn } from '../../lib/utils/cn';
import { Icon } from '../../lib/components/Icon';
import { Menu } from '../../lib/components/Menu';
import { ThemeSwitcher } from './ThemeSwitcher';
import styles from './DemoLayout.module.css';
import { type GroupDef } from '../../App';

export interface DemoLayoutProps {
  current: string;
  activeGroup: string;
  activeComponent?: string;
  onNavigate: (id: string) => void;
  groups: GroupDef[];
  children: ReactNode;
  onSearchClick: () => void;
}

function ProjectLogo({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
    >
      <rect width="100" height="100" rx="30" fill="currentColor" />
      <path d="M30 30H70V70H30Z" fill="var(--md-sys-color-on-primary)" opacity="0.25" />
      <circle cx="50" cy="50" r="22" fill="var(--md-sys-color-on-primary)" />
    </svg>
  );
}

export function DemoLayout({
  current,
  activeGroup,
  activeComponent,
  onNavigate,
  groups,
  children,
  onSearchClick,
}: DemoLayoutProps) {
  // Sidebar Width resizing
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('md3_docs_sidebar_width');
    return saved ? parseInt(saved) : 280;
  });
  const [isResizing, setIsResizing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('md3_docs_sidebar_collapsed') === 'true';
  });
  const [showDevBanner, setShowDevBanner] = useState(() => {
    return localStorage.getItem('md3_docs_dev_banner_dismissed') !== 'true';
  });
  const [closedGroups, setClosedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupId: string) => {
    setClosedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const handleDismissDevBanner = () => {
    setShowDevBanner(false);
    localStorage.setItem('md3_docs_dev_banner_dismissed', 'true');
  };

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isResizing) return;
    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(180, Math.min(480, e.clientX));
      setSidebarWidth(newWidth);
      localStorage.setItem('md3_docs_sidebar_width', newWidth.toString());
    };
    const handleMouseUp = () => {
      setIsResizing(false);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Persist collapse state
  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('md3_docs_sidebar_collapsed', String(next));
      return next;
    });
  };

  const isExamplesActive = ['shop-dashboard', 'company-profile', 'indonesia-labor-map'].includes(activeGroup);
  const isDocsActive = !isExamplesActive;
  const isHome = current === 'overview';
  const hasSidebar = !isHome && !isExamplesActive;

  return (
    <div
      className={cn(styles.root, isCollapsed && styles.collapsedRoot, !hasSidebar && styles.homeRoot)}
      style={{
        gridTemplateColumns: hasSidebar ? (isCollapsed ? '72px 1fr' : `${sidebarWidth}px 1fr`) : '1fr'
      }}
    >
      {/* Sidebar container */}
      {hasSidebar && <aside className={cn(styles.sidebar, isCollapsed && styles.sidebarCollapsed)}>
        {!isCollapsed ? (
          <>
            <button type="button" className={styles.brandRow} onClick={() => onNavigate('overview')} aria-label="Go to home">
              <ProjectLogo size={24} className={styles.brandLogo} />
              <div className={styles.brand}>MD3 Expressive</div>
            </button>
          </>
        ) : (
          <button type="button" className={styles.brandCollapsed} title="Go to home" onClick={() => onNavigate('overview')} aria-label="Go to home">
            <ProjectLogo size={28} className={styles.collapsedLogo} />
          </button>
        )}

        <div className={styles.scrollableNav}>
          {
            <>
              {/* Getting Started Section */}
              <div className={styles.sectionLabel}>
                {!isCollapsed ? 'Getting started' : <div className={styles.collapsedDivider} />}
              </div>
              <button
                type="button"
                className={cn(styles.navItem, current === 'quick-start' && styles.selected)}
                onClick={() => onNavigate('quick-start')}
                title="Quick start"
              >
                <Icon name="rocket_launch" size={20} filled={current === 'quick-start'} />
                {!isCollapsed && 'Quick start'}
              </button>

              <button
                type="button"
                className={cn(styles.navItem, current === 'installation' && styles.selected)}
                onClick={() => onNavigate('installation')}
                title="Installation"
              >
                <Icon name="download" size={20} filled={current === 'installation'} />
                {!isCollapsed && 'Installation'}
              </button>

              {/* Design & Styling reference pages */}
              <div className={styles.sectionLabel}>
                {!isCollapsed ? 'Styles & Tokens' : <div className={styles.collapsedDivider} />}
              </div>

              <button
                type="button"
                className={cn(styles.navItem, current === 'colors' && styles.selected)}
                onClick={() => onNavigate('colors')}
                title="Theme & Colors"
              >
                <Icon name="palette" size={20} filled={current === 'colors'} />
                {!isCollapsed && 'Theme & Colors'}
              </button>

              <button
                type="button"
                className={cn(styles.navItem, current === 'typography' && styles.selected)}
                onClick={() => onNavigate('typography')}
                title="Typography Scale"
              >
                <Icon name="text_fields" size={20} filled={current === 'typography'} />
                {!isCollapsed && 'Typography Scale'}
              </button>

              <button
                type="button"
                className={cn(styles.navItem, current === 'motion' && styles.selected)}
                onClick={() => onNavigate('motion')}
                title="Motion & Transitions"
              >
                <Icon name="motion_photos_on" size={20} filled={current === 'motion'} />
                {!isCollapsed && 'Motion & Transitions'}
              </button>

              <button
                type="button"
                className={cn(styles.navItem, current === 'icons' && styles.selected)}
                onClick={() => onNavigate('icons')}
                title="Icon Gallery"
              >
                <Icon name="emoji_symbols" size={20} filled={current === 'icons'} />
                {!isCollapsed && 'Icon Gallery'}
              </button>

              <button
                type="button"
                className={cn(styles.navItem, current === 'tokens' && styles.selected)}
                onClick={() => onNavigate('tokens')}
                title="Design Tokens"
              >
                <Icon name="style" size={20} filled={current === 'tokens'} />
                {!isCollapsed && 'Design Tokens'}
              </button>

              {/* Components Section */}
              <div className={styles.sectionLabel}>
                {!isCollapsed ? 'Components' : <div className={styles.collapsedDivider} />}
              </div>

              {groups.map(group => {
                const isOpen = !isCollapsed && !closedGroups[group.id];
                const isGroupActive = activeGroup === group.id;

                return (
                  <div key={group.id} className={styles.groupContainer}>
                    <button
                      type="button"
                      className={cn(
                        styles.groupHeader,
                        isGroupActive && styles.groupHeaderActive
                      )}
                      onClick={() => {
                        if (isCollapsed) {
                          toggleCollapse();
                          setClosedGroups(prev => ({ ...prev, [group.id]: false }));
                        } else {
                          toggleGroup(group.id);
                        }
                      }}
                      title={group.label}
                    >
                      <Icon name={group.icon} size={20} filled={isGroupActive} />
                      {!isCollapsed && <span style={{ flex: 1 }}>{group.label}</span>}
                      {!isCollapsed && (
                        <Icon
                          name={isOpen ? 'expand_less' : 'expand_more'}
                          size={18}
                          className={styles.chevron}
                        />
                      )}
                    </button>

                    {isOpen && (
                      <div className={styles.subGroup}>
                        {group.components.map(comp => {
                          const isSelected = current === comp.id;
                          return (
                            <button
                              key={comp.id}
                              type="button"
                              className={cn(styles.subNavItem, isSelected && styles.subSelected)}
                              onClick={() => onNavigate(comp.id)}
                            >
                              <span style={{ flex: 1 }}>{comp.label}</span>
                              {comp.status && comp.status !== 'stable' && (
                                <span className={cn(styles.miniBadge, styles[comp.status])}>
                                  {comp.status[0]}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Resources */}
              <div className={styles.sectionLabel}>
                {!isCollapsed ? 'Resources' : <div className={styles.collapsedDivider} />}
              </div>

              <button
                type="button"
                className={cn(styles.navItem, current === 'changelog' && styles.selected)}
                onClick={() => onNavigate('changelog')}
                title="Changelog"
              >
                <Icon name="history" size={20} filled={current === 'changelog'} />
                {!isCollapsed && 'Changelog'}
              </button>
            </>
          }
        </div>

        {/* Sidebar resize handler strip */}
        {!isCollapsed && (
          <div
            className={cn(styles.resizeHandle, isResizing && styles.resizeHandleActive)}
            onMouseDown={startResizing}
          />
        )}
      </aside>}

      <div className={styles.mainArea}>
        {/* Top Header navbar */}
        <header className={cn(styles.header, isHome && styles.homeHeader)}>
          {!hasSidebar ? (
            <button type="button" className={styles.homeBrand} onClick={() => onNavigate('overview')}>
              <ProjectLogo size={30} className={styles.brandLogo} />
              <span>MD3 Expressive</span>
            </button>
          ) : <button
            type="button"
            className={styles.collapseToggleBtn}
            onClick={toggleCollapse}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <Icon name={isCollapsed ? "menu" : "menu_open"} size={22} />
          </button>}

          {/* Header content navigation tabs */}
          <div className={styles.headerNav}>
            <button
              type="button"
              className={cn(styles.headerTab, isDocsActive && styles.headerTabActive)}
              onClick={() => onNavigate('quick-start')}
            >
              Docs
            </button>
            <Menu
              align="left"
              trigger={(props) => (
                <button
                  {...props}
                  type="button"
                  className={cn(styles.headerTab, styles.examplesTrigger, isExamplesActive && styles.headerTabActive)}
                >
                  Examples
                  <Icon name="arrow_drop_down" size={20} />
                </button>
              )}
              items={[
                { label: 'ACME Store', icon: 'storefront', onClick: () => onNavigate('shop-dashboard') },
                { label: 'Company Profile', icon: 'business', onClick: () => onNavigate('company-profile') },
                { label: 'Indonesia Labor Map', icon: 'map', onClick: () => onNavigate('indonesia-labor-map') },
              ]}
            />
          </div>

          <div style={{ flex: 1 }} />

          {/* Header Action Items (Right Aligned) */}
          <div className={styles.headerActions}>
            {isDocsActive && (
              <button
                type="button"
                className={styles.searchButton}
                onClick={onSearchClick}
                title="Search (Ctrl+K)"
                aria-label="Open search"
              >
                <Icon name="search" size={22} />
              </button>
            )}

            {/* GitHub link icon */}
            <a
              href="https://github.com/cinnamorollofficials/MD3-Expressive-Design"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.githubLink}
              title="View on GitHub"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </a>

            {/* Dark/light and seed theme color switches */}
            <ThemeSwitcher />
          </div>
        </header>

        {showDevBanner && (
          <div className={styles.devBanner}>
            <div className={styles.devBannerContent}>
              <Icon name="construction" size={20} className={styles.devBannerIcon} />
              <span className={styles.devBannerText}>
                <strong>Under Development:</strong> This project is currently in active development. The UI components, design tokens, and APIs are subject to change.
              </span>
            </div>
            <button
              type="button"
              className={styles.devBannerCloseBtn}
              onClick={handleDismissDevBanner}
              title="Dismiss warning notification"
            >
              <Icon name="close" size={18} />
            </button>
          </div>
        )}

        <main
          className={cn(
            styles.content,
            isHome && styles.homeContent,
            isExamplesActive && styles.examplesContent,
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

