import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import styles from './Radio.module.css';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, className, checked, disabled, ...rest },
  ref,
) {
  return (
    <label className={cn(styles.root, disabled && styles.disabled, className)}>
      <input ref={ref} type="radio" className={styles.input} checked={checked} disabled={disabled} {...rest} />
      <span className={cn(styles.dot, checked && styles.checked)} />
      {label}
    </label>
  );
});
