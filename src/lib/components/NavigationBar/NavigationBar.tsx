import { cn } from '../../utils/cn';
import { Icon } from '../Icon';
import styles from './NavigationBar.module.css';

export interface NavItem<T extends string = string> {
  value: T;
  label: string;
  icon: string;
  selectedIcon?: string;
}

export interface NavigationBarProps<T extends string = string> {
  items: NavItem<T>[];
  value: T;
  onChange: (v: T) => void;
}

export function NavigationBar<T extends string = string>({ items, value, onChange }: NavigationBarProps<T>) {
  return (
    <nav className={styles.bar} role="tablist">
      {items.map(it => {
        const selected = it.value === value;
        return (
          <button
            key={it.value}
            type="button"
            role="tab"
            aria-selected={selected}
            className={cn(styles.item, selected && styles.selected)}
            onClick={() => onChange(it.value)}
          >
            <span className={styles.indicator}>
              <Icon name={selected ? (it.selectedIcon ?? it.icon) : it.icon} filled={selected} size={24} />
            </span>
            <span className={styles.label}>{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
