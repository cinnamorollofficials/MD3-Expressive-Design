import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import { Icon } from '../Icon';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import styles from './NavigationDrawer.module.css';

export interface DrawerItem<T extends string = string> {
  value: T;
  label: string;
  icon: string;
  badge?: string | number;
}

export interface DrawerSection<T extends string = string> {
  title?: string;
  items: DrawerItem<T>[];
}

interface BaseProps<T extends string = string> {
  sections: DrawerSection<T>[];
  value: T;
  onChange: (v: T) => void;
  header?: ReactNode;
}

export interface NavigationDrawerProps<T extends string = string> extends BaseProps<T> {
  modal?: boolean;
  open?: boolean;
  onClose?: () => void;
}

export function NavigationDrawer<T extends string = string>({
  sections, value, onChange, header, modal, open, onClose,
}: NavigationDrawerProps<T>) {
  const trap = useFocusTrap<HTMLElement>(!!(modal && open));
  useEffect(() => {
    if (!modal || !open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [modal, open, onClose]);

  const inner = (
    <nav ref={trap as React.RefObject<HTMLElement>} className={cn(styles.drawer, modal && styles.modal)}>
      {header}
      {sections.map((s, i) => (
        <div key={i}>
          {s.title && <div className={styles.section}>{s.title}</div>}
          {s.items.map(it => {
            const selected = it.value === value;
            return (
              <button
                key={it.value}
                type="button"
                className={cn(styles.item, selected && styles.selected)}
                onClick={() => onChange(it.value)}
              >
                <Icon name={it.icon} filled={selected} size={24} />
                <span>{it.label}</span>
                {it.badge != null && <span className={styles.badge}>{it.badge}</span>}
              </button>
            );
          })}
        </div>
      ))}
    </nav>
  );

  if (!modal) return inner;
  if (!open) return null;
  return createPortal(
    <>
      <div className={styles.scrim} onClick={onClose} />
      {inner}
    </>,
    document.body,
  );
}
