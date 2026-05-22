import { useLayoutEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../Icon';
import styles from './Tabs.module.css';

export interface TabItem<T extends string = string> {
  value: T;
  label: string;
  icon?: string;
}

export interface TabsProps<T extends string = string> {
  items: TabItem<T>[];
  value: T;
  onChange: (v: T) => void;
  variant?: 'primary' | 'secondary';
}

export function Tabs<T extends string = string>({ items, value, onChange, variant = 'primary' }: TabsProps<T>) {
  const barRef = useRef<HTMLDivElement>(null);
  const [ind, setInd] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const idx = items.findIndex(i => i.value === value);
    const tab = bar.querySelectorAll<HTMLButtonElement>(`.${styles.tab}`)[idx];
    if (tab) setInd({ left: tab.offsetLeft, width: tab.offsetWidth });
  }, [value, items]);

  return (
    <div ref={barRef} className={cn(styles.bar, variant === 'secondary' && styles.secondary)} role="tablist">
      {items.map(it => {
        const selected = it.value === value;
        return (
          <button
            key={it.value}
            type="button"
            role="tab"
            aria-selected={selected}
            className={cn(styles.tab, selected && styles.selected)}
            onClick={() => onChange(it.value)}
          >
            {it.icon && <Icon name={it.icon} size={20} filled={selected} />}
            {it.label}
          </button>
        );
      })}
      <div className={styles.indicator} style={{ left: ind.left, width: ind.width }} />
    </div>
  );
}
