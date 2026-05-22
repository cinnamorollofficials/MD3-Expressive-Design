import { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../Icon';
import type { NavItem } from '../NavigationBar/NavigationBar';
import styles from './NavigationRail.module.css';

export interface NavigationRailProps<T extends string = string> {
  items: NavItem<T>[];
  value: T;
  onChange: (v: T) => void;
  fab?: ReactNode;
}

export function NavigationRail<T extends string = string>({ items, value, onChange, fab }: NavigationRailProps<T>) {
  return (
    <nav className={styles.rail} role="tablist">
      {fab && <div className={styles.fab}>{fab}</div>}
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
