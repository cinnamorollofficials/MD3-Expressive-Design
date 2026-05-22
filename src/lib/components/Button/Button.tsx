import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../Icon';
import styles from './Button.module.css';

export type ButtonVariant = 'filled' | 'tonal' | 'elevated' | 'outlined' | 'text';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Material Symbols icon name */
  startIcon?: string;
  endIcon?: string;
}

const sizeClass: Record<ButtonSize, string> = {
  xs: styles.sizeXs, sm: styles.sizeSm, md: styles.sizeMd, lg: styles.sizeLg, xl: styles.sizeXl,
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'filled', size = 'sm', startIcon, endIcon, className, children, ...rest },
  ref,
) {
  const iconSize = size === 'xs' ? 18 : size === 'lg' ? 28 : size === 'xl' ? 32 : 20;
  return (
    <button
      ref={ref}
      className={cn(styles.btn, styles[variant], sizeClass[size], className)}
      {...rest}
    >
      {startIcon && <Icon name={startIcon} size={iconSize} className={styles.iconStart} />}
      {children}
      {endIcon && <Icon name={endIcon} size={iconSize} className={styles.iconEnd} />}
    </button>
  );
});
