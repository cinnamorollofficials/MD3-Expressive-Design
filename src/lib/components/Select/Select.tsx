import { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { TextField, type TextFieldVariant } from '../TextField';
import { Icon } from '../Icon';
import styles from './Select.module.css';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  icon?: string;
  disabled?: boolean;
}

export interface SelectProps<T extends string = string> {
  options: SelectOption<T>[];
  value?: T;
  onChange?: (v: T) => void;
  label?: string;
  variant?: TextFieldVariant;
  placeholder?: string;
  disabled?: boolean;
  helperText?: string;
  error?: boolean;
  leadingIcon?: string;
  className?: string;
}

export function Select<T extends string = string>({
  options, value, onChange, label, variant, placeholder,
  disabled, helperText, error, leadingIcon, className,
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find(o => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const onKey = (e: React.KeyboardEvent) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault(); setOpen(true);
      setActive(Math.max(0, options.findIndex(o => o.value === value)));
    } else if (open) {
      if (e.key === 'Escape') { e.preventDefault(); setOpen(false); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(options.length - 1, a + 1)); }
      else if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(a => Math.max(0, a - 1)); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        const opt = options[active];
        if (opt && !opt.disabled) { onChange?.(opt.value); setOpen(false); }
      }
    }
  };

  return (
    <div ref={rootRef} className={cn(styles.root, className)}>
      <div
        className={styles.trigger}
        onClick={() => !disabled && setOpen(o => !o)}
        onKeyDown={onKey}
      >
        <TextField
          label={label}
          variant={variant}
          value={selected?.label ?? ''}
          placeholder={placeholder}
          readOnly
          disabled={disabled}
          helperText={helperText}
          error={error}
          leadingIcon={leadingIcon}
          trailingIcon={open ? 'arrow_drop_up' : 'arrow_drop_down'}
        />
      </div>
      {open && (
        <ul role="listbox" className={styles.menu}>
          {options.map((o, i) => (
            <li key={o.value}>
              <button
                role="option"
                aria-selected={value === o.value}
                disabled={o.disabled}
                className={cn(
                  styles.option,
                  value === o.value && styles.selected,
                  i === active && styles.active,
                )}
                onClick={() => { onChange?.(o.value); setOpen(false); }}
                onMouseEnter={() => setActive(i)}
              >
                {o.icon && <Icon name={o.icon} size={20} />}
                <span style={{ flex: 1 }}>{o.label}</span>
                {value === o.value && <Icon name="check" size={20} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
