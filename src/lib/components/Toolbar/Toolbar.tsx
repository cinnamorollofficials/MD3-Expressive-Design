import { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import styles from './Toolbar.module.css';

export interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  vibrant?: boolean;
  docked?: boolean;
}

/** Expressive Toolbar — a pill-shaped floating action cluster. */
export function Toolbar({ children, vibrant, docked, className, style, ...rest }: ToolbarProps) {
  return (
    <div
      role="toolbar"
      className={cn(styles.bar, vibrant && styles.vibrant, docked && styles.docked, className)}
      style={style}
      data-md3-component="toolbar"
      {...rest}
    >
      {children}
    </div>
  );
}

