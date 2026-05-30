import { InputHTMLAttributes, MutableRefObject, forwardRef, useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../Icon';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, indeterminate, className, disabled, checked, ...rest },
  ref,
) {
  const innerRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = !!indeterminate;
  }, [indeterminate]);

  const setRef = (el: HTMLInputElement | null) => {
    innerRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) (ref as MutableRefObject<HTMLInputElement | null>).current = el;
  };

  return (
    <label
      className={cn(styles.root, disabled && styles.disabled, !label && styles.iconOnly, className)}
      data-md3-component="checkbox"
    >
      <input
        ref={setRef}
        type="checkbox"
        className={styles.input}
        disabled={disabled}
        checked={checked}
        {...rest}
      />
      <span className={cn(styles.box, checked && styles.checked, indeterminate && styles.indeterminate)}>
        {indeterminate ? (
          <Icon name="remove" size={14} className={styles.check} />
        ) : checked ? (
          <Icon name="check" size={14} className={styles.check} weight={700} />
        ) : null}
      </span>
      {label && <span className={styles.labelText}>{label}</span>}
    </label>
  );
});

