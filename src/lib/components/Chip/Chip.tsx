import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../Icon';
import styles from './Chip.module.css';

export type ChipKind = 'assist' | 'filter' | 'input' | 'suggestion';

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'kind'> {
  label: string;
  kind?: ChipKind;
  icon?: string;
  selected?: boolean;
  elevated?: boolean;
  onClose?: () => void;
}

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { label, kind = 'assist', icon, selected, elevated, onClose, className, ...rest },
  ref,
) {
  const showCheck = kind === 'filter' && selected;
  return (
    <button
      ref={ref}
      type="button"
      role={kind === 'filter' || kind === 'input' ? 'checkbox' : 'button'}
      aria-checked={kind === 'filter' || kind === 'input' ? !!selected : undefined}
      className={cn(styles.chip, selected && styles.selected, elevated && styles.elevated, styles[kind], className)}
      {...rest}
    >
      {showCheck && <Icon name="check" size={18} />}
      {!showCheck && icon && <Icon name={icon} size={18} />}
      {label}
      {kind === 'input' && onClose && (
        <span
          className={styles.trailingClose}
          role="button"
          aria-label="Remove"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
        >
          <Icon name="close" size={18} />
        </span>
      )}
    </button>
  );
});
