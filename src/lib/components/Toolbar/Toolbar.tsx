import { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import styles from './Toolbar.module.css';

export interface ToolbarProps {
  children: ReactNode;
  vibrant?: boolean;
  docked?: boolean;
  className?: string;
}

/** Expressive Toolbar — a pill-shaped floating action cluster. */
export function Toolbar({ children, vibrant, docked, className }: ToolbarProps) {
  return (
    <div role="toolbar" className={cn(styles.bar, vibrant && styles.vibrant, docked && styles.docked, className)}>
      {children}
    </div>
  );
}
