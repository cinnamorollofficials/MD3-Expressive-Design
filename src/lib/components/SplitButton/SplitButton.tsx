import { useEffect, useRef, useState } from 'react';
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

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
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
        onClick={() => setOpen(o => !o)}
      >
        <Icon name={open ? 'arrow_drop_up' : 'arrow_drop_down'} size={20} />
      </button>
      {open && (
        <div role="menu" className={styles.menu}>
          {options.map((o, i) => (
            <button
              key={i}
              role="menuitem"
              type="button"
              className={styles.menuItem}
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
