import { ReactNode, Fragment } from 'react';
import { cn } from '../../lib/utils/cn';
import { Icon } from '../../lib/components/Icon';
import { ThemeSwitcher } from './ThemeSwitcher';
import styles from './DemoLayout.module.css';

export interface PageDef {
  id: string;
  label: string;
  icon: string;
  /** Section header shown above this item. */
  section?: string;
}

export interface DemoLayoutProps {
  pages: PageDef[];
  current: string;
  onNavigate: (id: string) => void;
  children: ReactNode;
}

export function DemoLayout({ pages, current, onNavigate, children }: DemoLayoutProps) {
  return (
    <div className={styles.root}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>MD3 Expressive</div>
        <div className={styles.brandSub}>React + TypeScript design system</div>
        {pages.map(p => (
          <Fragment key={p.id}>
            {p.section && <div className={styles.sectionLabel}>{p.section}</div>}
            <button
              type="button"
              className={cn(styles.navItem, current === p.id && styles.selected)}
              onClick={() => onNavigate(p.id)}
            >
              <Icon name={p.icon} size={20} filled={current === p.id} />
              {p.label}
            </button>
          </Fragment>
        ))}
        <div className={styles.themeBar}>
          <ThemeSwitcher />
        </div>
      </aside>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
