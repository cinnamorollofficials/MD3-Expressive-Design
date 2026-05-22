import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../Icon';
import styles from './IconButton.module.css';

export type IconButtonVariant = 'standard' | 'filled' | 'tonal' | 'outlined';
export type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: string;
  selectedIcon?: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  toggle?: boolean;
  selected?: boolean;
  label: string;
}

const sizeClass: Record<IconButtonSize, string | undefined> = {
  xs: styles.sizeXs, sm: undefined, md: styles.sizeMd, lg: styles.sizeLg,
};
const iconPx: Record<IconButtonSize, number> = { xs: 20, sm: 24, md: 32, lg: 40 };

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, selectedIcon, variant = 'standard', size = 'sm', toggle, selected, label, className, onClick, ...rest },
  ref,
) {
  const isOn = !!(toggle && selected);
  const displayIcon = isOn && selectedIcon ? selectedIcon : icon;
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      aria-pressed={toggle ? !!selected : undefined}
      className={cn(styles.btn, styles[variant], sizeClass[size], isOn && styles.toggleOn, className)}
      onClick={onClick}
      {...rest}
    >
      <Icon name={displayIcon} size={iconPx[size]} filled={isOn} />
    </button>
  );
});
