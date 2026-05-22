import type { KeyboardEventHandler, ReactNode } from 'react';
import { useEffect, useId, useRef, useState } from 'react';
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
  trigger: (props: {
    onClick: () => void;
    onKeyDown: KeyboardEventHandler;
    'aria-expanded': boolean;
    'aria-haspopup': 'menu';
    'aria-controls'?: string;
  }) => ReactNode;
  items: MenuItem[];
}

export function Menu({ trigger, items }: MenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const focusItem = (index: number) => {
    const buttons = menuRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
    if (!buttons?.length) return;
    buttons[Math.min(index, buttons.length - 1)]?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowDown') { e.preventDefault(); focusItem(0); }
      if (e.key === 'ArrowUp') { e.preventDefault(); focusItem(Number.MAX_SAFE_INTEGER); }
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const handleTriggerKeyDown: KeyboardEventHandler = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => focusItem(0));
    }
  };

  const triggerProps = {
    onClick: () => setOpen(o => !o),
    onKeyDown: handleTriggerKeyDown,
    'aria-expanded': open,
    'aria-haspopup': 'menu' as const,
    'aria-controls': open ? menuId : undefined,
  };

  return (
    <div ref={rootRef} className={styles.root}>
      {trigger(triggerProps)}
      {open && (
        <div id={menuId} ref={menuRef} role="menu" className={styles.menu}>
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
                onKeyDown={(e) => {
                  const buttons = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? []);
                  const index = buttons.indexOf(e.currentTarget);
                  if (e.key === 'ArrowDown') { e.preventDefault(); buttons[Math.min(buttons.length - 1, index + 1)]?.focus(); }
                  if (e.key === 'ArrowUp') { e.preventDefault(); buttons[Math.max(0, index - 1)]?.focus(); }
                  if (e.key === 'Home') { e.preventDefault(); buttons[0]?.focus(); }
                  if (e.key === 'End') { e.preventDefault(); buttons[buttons.length - 1]?.focus(); }
                }}
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
