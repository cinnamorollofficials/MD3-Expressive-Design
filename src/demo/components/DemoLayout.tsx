import { ReactNode, Fragment, useState, useMemo } from 'react';
import { cn } from '../../lib/utils/cn';
import { Icon } from '../../lib/components/Icon';
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
}

export function DemoLayout({
  current,
  activeGroup,
  activeComponent,
  onNavigate,
  groups,
  children,
}: DemoLayoutProps) {
  const [search, setSearch] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    // Keep active group expanded by default
    return { [activeGroup]: true };
  });

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  // Filter groups and components based on search query
  const filteredGroups = useMemo(() => {
    if (!search.trim()) return groups;
    const query = search.toLowerCase();

    return groups
      .map(group => {
        // Match group name itself or search its child components
        const matchesGroup = group.label.toLowerCase().includes(query);
        const filteredComponents = group.components.filter(c =>
          c.label.toLowerCase().includes(query)
        );

        if (matchesGroup || filteredComponents.length > 0) {
          return {
            ...group,
            // If the group header matches but children don't, we show all children.
            // Otherwise, we show only matching children.
            components: matchesGroup ? group.components : filteredComponents,
          };
        }
        return null;
      })
      .filter((g): g is GroupDef => g !== null);
  }, [groups, search]);

  // Determine if a group should be open (either user toggled open, or we have a search query filtering it)
  const isGroupOpen = (groupId: string) => {
    if (search.trim()) return true; // auto-expand during search
    return expandedGroups[groupId] ?? (activeGroup === groupId);
  };

  return (
    <div className={styles.root}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>MD3 Expressive</div>
        <div className={styles.brandSub}>React + TypeScript design system</div>

        {/* Search input */}
        <div className={styles.searchContainer}>
          <Icon name="search" size={20} className={styles.searchIcon} />
          <input
            type="search"
            placeholder="Search components..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.scrollableNav}>
          {/* Getting Started Section */}
          {(!search.trim() || 'overview'.includes(search.toLowerCase())) && (
            <>
              <div className={styles.sectionLabel}>Getting started</div>
              <button
                type="button"
                className={cn(styles.navItem, current === 'overview' && styles.selected)}
                onClick={() => onNavigate('overview')}
              >
                <Icon name="dashboard" size={20} filled={current === 'overview'} />
                Overview
              </button>
            </>
          )}

          {/* Components Section */}
          {filteredGroups.length > 0 && (
            <>
              <div className={styles.sectionLabel}>Components</div>
              {filteredGroups.map(group => {
                const isOpen = isGroupOpen(group.id);
                const isGroupActive = activeGroup === group.id;

                return (
                  <div key={group.id} className={styles.groupContainer}>
                    <button
                      type="button"
                      className={cn(
                        styles.groupHeader,
                        isGroupActive && !activeComponent && styles.groupHeaderActive
                      )}
                      onClick={() => {
                        // Click group header navigates to the group landing page (shows all components in group)
                        onNavigate(group.id);
                        if (!search.trim()) {
                          toggleGroup(group.id);
                        }
                      }}
                    >
                      <Icon name={group.icon} size={20} filled={isGroupActive} />
                      <span style={{ flex: 1 }}>{group.label}</span>
                      {!search.trim() && (
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
                              {comp.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}

          {/* Examples Section */}
          {(!search.trim() ||
            'shop dashboard'.includes(search.toLowerCase()) ||
            'company profile'.includes(search.toLowerCase())) && (
            <>
              <div className={styles.sectionLabel}>Examples</div>
              {(!search.trim() || 'shop dashboard'.includes(search.toLowerCase())) && (
                <button
                  type="button"
                  className={cn(styles.navItem, current === 'shop-dashboard' && styles.selected)}
                  onClick={() => onNavigate('shop-dashboard')}
                >
                  <Icon name="storefront" size={20} filled={current === 'shop-dashboard'} />
                  Shop Dashboard
                </button>
              )}
              {(!search.trim() || 'company profile'.includes(search.toLowerCase())) && (
                <button
                  type="button"
                  className={cn(styles.navItem, current === 'company-profile' && styles.selected)}
                  onClick={() => onNavigate('company-profile')}
                >
                  <Icon name="business" size={20} filled={current === 'company-profile'} />
                  Company Profile
                </button>
              )}
            </>
          )}
        </div>

        <div className={styles.themeBar}>
          <ThemeSwitcher />
        </div>
      </aside>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
