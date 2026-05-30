import { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import styles from './TopAppBar.module.css';

export type TopAppBarVariant = 'small' | 'center' | 'medium' | 'large';

export interface TopAppBarProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  variant?: TopAppBarVariant;
  title: ReactNode;
  start?: ReactNode;
  end?: ReactNode;
  scrolled?: boolean;
}


export function TopAppBar({ variant = 'small', title, start, end, scrolled, className, style, ...rest }: TopAppBarProps) {
  const headerClass = cn(styles.bar, styles[variant], scrolled && styles.scrolled, className);

  if (variant === 'medium' || variant === 'large') {
    return (
      <header
        className={headerClass}
        style={style}
        data-md3-component="top-app-bar"
        {...rest}
      >
        <div className={styles.topRow}>
          {start && <div className={styles.start}>{start}</div>}
          <div style={{ flex: 1 }} />
          {end && <div className={styles.end}>{end}</div>}
        </div>
        <div className={styles.title}>{title}</div>
      </header>
    );
  }
  return (
    <header
      className={headerClass}
      style={style}
      data-md3-component="top-app-bar"
      {...rest}
    >
      {start && <div className={styles.start}>{start}</div>}
      <div className={styles.title}>{title}</div>
      {end && <div className={styles.end}>{end}</div>}
    </header>
  );
}

