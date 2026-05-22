import { ReactNode, useEffect, useRef, useState } from 'react';
import { Icon } from '../Icon';
import styles from './Menu.module.css';

export interface MenuItem {
  label: string;
  icon?: string;
  trailingIcon?: string;
  onClick?: () => void;
  disabled?: boolean;
  divider?: boolean;
}

export interface MenuProps {
  trigger: (props: { onClick: () => void; 'aria-expanded': boolean }) => ReactNode;
  items: MenuItem[];
}

export function Menu({ trigger, items }: MenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={styles.root}>
      {trigger({ onClick: () => setOpen(o => !o), 'aria-expanded': open })}
      {open && (
        <div role="menu" className={styles.menu}>
          {items.map((it, i) =>
            it.divider ? (
              <div key={i} className={styles.divider} role="separator" />
            ) : (
              <button
                key={i}
                role="menuitem"
                type="button"
                disabled={it.disabled}
                className={styles.item}
                onClick={() => { it.onClick?.(); setOpen(false); }}
              >
                {it.icon && <Icon name={it.icon} size={20} />}
                <span style={{ flex: 1 }}>{it.label}</span>
                {it.trailingIcon && <Icon name={it.trailingIcon} size={20} />}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
