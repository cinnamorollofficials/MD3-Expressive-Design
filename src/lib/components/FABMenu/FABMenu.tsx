import { useState } from 'react';
import { cn } from '../../utils/cn';
import { FAB } from '../FAB';
import styles from './FABMenu.module.css';

export interface FABMenuItem {
  icon: string;
  label: string;
  onClick?: () => void;
}

export interface FABMenuProps {
  icon?: string;
  closeIcon?: string;
  label?: string;
  items: FABMenuItem[];
}

/** Expressive FAB Menu — pressing the FAB fans out a staggered list of mini-FABs with labels. */
export function FABMenu({ icon = 'add', closeIcon = 'close', label, items }: FABMenuProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn(styles.root, open && styles.open)}>
      <div className={styles.items} aria-hidden={!open}>
        {items.map((it, i) => (
          <div key={i} className={styles.item}>
            <span className={styles.label}>{it.label}</span>
            <FAB
              size="sm"
              color="surface"
              icon={it.icon}
              tabIndex={open ? 0 : -1}
              onClick={() => { it.onClick?.(); setOpen(false); }}
            />
          </div>
        ))}
      </div>
      <FAB
        icon={open ? closeIcon : icon}
        label={label}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      />
    </div>
  );
}
