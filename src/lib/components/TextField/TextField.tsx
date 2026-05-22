import { InputHTMLAttributes, forwardRef, useId, useState } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../Icon';
import styles from './TextField.module.css';

export type TextFieldVariant = 'filled' | 'outlined';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  variant?: TextFieldVariant;
  leadingIcon?: string;
  trailingIcon?: string;
  helperText?: string;
  error?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, variant = 'outlined', leadingIcon, trailingIcon, helperText, error, className, value, defaultValue, onFocus, onBlur, id, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id || autoId;
  const [focused, setFocused] = useState(false);
  const [internal, setInternal] = useState(defaultValue ?? '');
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;
  const floated = focused || (current != null && String(current).length > 0) || !!rest.placeholder;

  return (
    <div className={cn(styles.root, className)}>
      <div className={cn(styles.field, styles[variant], focused && styles.focused, error && styles.error)}>
        {leadingIcon && <span className={styles.leading}><Icon name={leadingIcon} size={24} /></span>}
        <input
          ref={ref}
          id={inputId}
          className={styles.input}
          value={isControlled ? value : undefined}
          defaultValue={isControlled ? undefined : defaultValue}
          onChange={(e) => { if (!isControlled) setInternal(e.target.value); rest.onChange?.(e); }}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); onBlur?.(e); }}
          {...rest}
        />
        {label && (
          <label htmlFor={inputId} className={cn(styles.label, floated && styles.floated)}>
            {label}
          </label>
        )}
        {trailingIcon && <span className={styles.trailing}><Icon name={trailingIcon} size={24} /></span>}
      </div>
      {helperText && <div className={cn(styles.helper, error && styles.error)}>{helperText}</div>}
    </div>
  );
});
