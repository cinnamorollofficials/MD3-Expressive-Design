import { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import styles from './Badge.module.css';

export interface BadgeProps {
  count?: number | string;
  dot?: boolean;
  max?: number;
  children: ReactNode;
}

export function Badge({ count, dot, max = 99, children }: BadgeProps) {
  const isDot = dot || count === undefined;
  const display =
    typeof count === 'number' ? (count > max ? `${max}+` : count) : count;
  return (
    <span className={styles.root}>
      {children}
      <span className={cn(styles.badge, isDot && styles.small, typeof count === 'number' && count > 9 && styles.large)}>
        {!isDot && display}
      </span>
    </span>
  );
}
