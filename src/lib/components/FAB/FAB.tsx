import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../Icon';
import styles from './FAB.module.css';

export type FABSize = 'sm' | 'md' | 'lg';
export type FABColor = 'primary' | 'secondary' | 'tertiary' | 'surface';

export interface FABProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  /** when present, FAB becomes Extended */
  label?: string;
  size?: FABSize;
  color?: FABColor;
}

const sizeClass: Record<FABSize, string> = { sm: styles.sizeSm, md: styles.sizeMd, lg: styles.sizeLg };
const iconPx: Record<FABSize, number> = { sm: 24, md: 24, lg: 36 };

export const FAB = forwardRef<HTMLButtonElement, FABProps>(function FAB(
  { icon, label, size = 'md', color = 'primary', className, ...rest },
  ref,
) {
  const extended = !!label;
  return (
    <button
      ref={ref}
      type="button"
      aria-label={extended ? undefined : icon}
      className={cn(styles.fab, styles[color], extended ? styles.extended : sizeClass[size], className)}
      {...rest}
    >
      <Icon name={icon} size={iconPx[size]} />
      {extended && <span className={styles.label}>{label}</span>}
    </button>
  );
});
