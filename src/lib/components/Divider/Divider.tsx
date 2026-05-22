import { cn } from '../../utils/cn';
import styles from './Divider.module.css';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  inset?: boolean;
  className?: string;
}

export function Divider({ orientation = 'horizontal', inset, className }: DividerProps) {
  return (
    <hr
      role="separator"
      aria-orientation={orientation}
      className={cn(styles.divider, styles[orientation], inset && styles.inset, className)}
    />
  );
}
