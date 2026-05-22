import { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import styles from './Tooltip.module.css';

export interface TooltipProps {
  label: ReactNode;
  /** When provided alongside `label`, renders a Rich tooltip with a title row. */
  title?: string;
  rich?: boolean;
  children: ReactNode;
}

export function Tooltip({ label, title, rich, children }: TooltipProps) {
  return (
    <span className={styles.root}>
      {children}
      <span role="tooltip" className={cn(styles.tip, (rich || title) && styles.rich)}>
        {title && <div className={styles.title}>{title}</div>}
        {label}
      </span>
    </span>
  );
}
