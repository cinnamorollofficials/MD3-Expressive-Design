import { useEffect, useId, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../Icon';
import styles from './SplitButton.module.css';

export interface SplitButtonOption {
  label: string;
  onClick?: () => void;
}

export interface SplitButtonProps {
  label: string;
  startIcon?: string;
  onClick?: () => void;
  options: SplitButtonOption[];
}

/** Expressive Split Button — a primary action with a paired dropdown trigger. */
export function SplitButton({ label, startIcon, onClick, options }: SplitButtonProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const focusMenuItem = (index: number) => {
    const buttons = menuRef.current?.querySelectorAll<HTMLButtonElement>('button');
    if (!buttons?.length) return;
    buttons[Math.min(index, buttons.length - 1)]?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowDown') { e.preventDefault(); focusMenuItem(0); }
      if (e.key === 'ArrowUp') { e.preventDefault(); focusMenuItem(Number.MAX_SAFE_INTEGER); }
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn(styles.root, open && styles.open)}>
      <button type="button" className={styles.lead} onClick={onClick}>
        {startIcon && <Icon name={startIcon} size={20} />}
        {label}
      </button>
      <button
        type="button"
        className={styles.trail}
        aria-label="More options"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen(o => !o)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setOpen(true);
            requestAnimationFrame(() => focusMenuItem(0));
          }
        }}
      >
        <Icon name={open ? 'arrow_drop_up' : 'arrow_drop_down'} size={20} />
      </button>
      {open && (
        <div id={menuId} ref={menuRef} role="menu" className={styles.menu}>
          {options.map((o, i) => (
            <button
              key={i}
              role="menuitem"
              type="button"
              className={styles.menuItem}
              onKeyDown={(e) => {
                const buttons = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? []);
                const index = buttons.indexOf(e.currentTarget);
                if (e.key === 'ArrowDown') { e.preventDefault(); buttons[Math.min(buttons.length - 1, index + 1)]?.focus(); }
                if (e.key === 'ArrowUp') { e.preventDefault(); buttons[Math.max(0, index - 1)]?.focus(); }
                if (e.key === 'Home') { e.preventDefault(); buttons[0]?.focus(); }
                if (e.key === 'End') { e.preventDefault(); buttons[buttons.length - 1]?.focus(); }
              }}
              onClick={() => { o.onClick?.(); setOpen(false); }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
