import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import styles from './Switch.module.css';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, className, checked, disabled, ...rest },
  ref,
) {
  return (
    <label className={cn(styles.root, disabled && styles.disabled, className)}>
      <input ref={ref} type="checkbox" role="switch" className={styles.input} checked={checked} disabled={disabled} {...rest} />
      <span className={cn(styles.track, checked && styles.checked)}>
        <span className={styles.thumb} />
      </span>
      {label}
    </label>
  );
});
