import { useEffect, useId, useRef, useState } from 'react';
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
  const listboxId = useId();
  const selected = options.find(o => o.value === value);
  const activeOption = active >= 0 ? options[active] : undefined;

  const optionId = (optionValue: string) => `${listboxId}-option-${optionValue}`;
  const firstEnabledIndex = () => Math.max(0, options.findIndex(o => !o.disabled));

  const choose = (opt: SelectOption<T> | undefined) => {
    if (!opt || opt.disabled) return;
    onChange?.(opt.value);
    setOpen(false);
  };

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
      const selectedIndex = options.findIndex(o => o.value === value && !o.disabled);
      setActive(selectedIndex >= 0 ? selectedIndex : firstEnabledIndex());
    } else if (open) {
      if (e.key === 'Escape') { e.preventDefault(); setOpen(false); }
      else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive(a => {
          for (let i = Math.min(options.length - 1, a + 1); i < options.length; i += 1) {
            if (!options[i].disabled) return i;
          }
          return a;
        });
      }
      else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive(a => {
          for (let i = Math.max(0, a - 1); i >= 0; i -= 1) {
            if (!options[i].disabled) return i;
          }
          return a;
        });
      }
      else if (e.key === 'Enter') {
        e.preventDefault();
        choose(options[active]);
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
          role="combobox"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-activedescendant={open && activeOption ? optionId(activeOption.value) : undefined}
          aria-haspopup="listbox"
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
        <ul id={listboxId} role="listbox" className={styles.menu}>
          {options.map((o, i) => (
            <li key={o.value}>
              <button
                id={optionId(o.value)}
                role="option"
                aria-selected={value === o.value}
                disabled={o.disabled}
                className={cn(
                  styles.option,
                  value === o.value && styles.selected,
                  i === active && styles.active,
                )}
                onClick={() => choose(o)}
                onMouseEnter={() => { if (!o.disabled) setActive(i); }}
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
