import { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import styles from './Badge.module.css';

export interface BadgeProps {
  count?: number | string;
  dot?: boolean;
  max?: number;
  children: ReactNode;
  ariaLabel?: string;
}

export function Badge({ count, dot, max = 99, children, ariaLabel }: BadgeProps) {
  const isDot = dot || count === undefined;
  const display =
    typeof count === 'number' ? (count > max ? `${max}+` : count) : count;
  const label = ariaLabel ?? (isDot ? 'Notification' : `${display} notifications`);
  return (
    <span className={styles.root}>
      {children}
      <span
        className={cn(styles.badge, isDot && styles.small, typeof count === 'number' && count > 9 && styles.large)}
        aria-label={label}
      >
        {!isDot && display}
      </span>
    </span>
  );
}
