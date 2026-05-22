import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { TextField, type TextFieldVariant } from '../TextField';
import { Icon } from '../Icon';
import selectStyles from '../Select/Select.module.css';

export interface ComboboxOption<T extends string = string> {
  value: T;
  label: string;
  icon?: string;
}

export interface ComboboxProps<T extends string = string> {
  options: ComboboxOption<T>[];
  value?: T;
  onChange?: (v: T | undefined) => void;
  label?: string;
  variant?: TextFieldVariant;
  placeholder?: string;
  /** Restricts input to listed options. */
  strict?: boolean;
  helperText?: string;
  error?: boolean;
  leadingIcon?: string;
  className?: string;
}

export function Combobox<T extends string = string>({
  options, value, onChange, label, variant, placeholder, strict = true,
  helperText, error, leadingIcon, className,
}: ComboboxProps<T>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const selected = options.find(o => o.value === value);
  const [query, setQuery] = useState(selected?.label ?? '');

  useEffect(() => { setQuery(selected?.label ?? ''); }, [selected?.label]);

  const filtered = useMemo(
    () => options.filter(o => o.label.toLowerCase().includes(query.toLowerCase())),
    [options, query],
  );
  const activeOption = filtered[active];
  const optionId = (optionValue: string) => `${listboxId}-option-${optionValue}`;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        if (strict && !options.some(o => o.label === query)) setQuery(selected?.label ?? '');
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open, strict, options, query, selected?.label]);

  const choose = (o: ComboboxOption<T>) => {
    onChange?.(o.value);
    setQuery(o.label);
    setOpen(false);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive(a => Math.min(Math.max(0, filtered.length - 1), a + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(0, a - 1)); }
    else if (e.key === 'Enter')   { e.preventDefault(); if (filtered[active]) choose(filtered[active]); }
    else if (e.key === 'Escape')  { setOpen(false); }
  };

  return (
    <div ref={rootRef} className={cn(selectStyles.root, className)} style={{ width: 240 }}>
      <div onKeyDown={onKey}>
        <TextField
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={open && filtered.length > 0 ? listboxId : undefined}
          aria-activedescendant={open && activeOption ? optionId(activeOption.value) : undefined}
          aria-haspopup="listbox"
          label={label}
          variant={variant}
          value={query}
          placeholder={placeholder}
          helperText={helperText}
          error={error}
          leadingIcon={leadingIcon}
          trailingIcon={open ? 'arrow_drop_up' : 'arrow_drop_down'}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); setActive(0); if (!strict) onChange?.(undefined); }}
          onFocus={() => setOpen(true)}
        />
      </div>
      {open && filtered.length > 0 && (
        <ul id={listboxId} role="listbox" className={selectStyles.menu}>
          {filtered.map((o, i) => (
            <li key={o.value}>
              <button
                id={optionId(o.value)}
                role="option"
                aria-selected={value === o.value}
                className={cn(
                  selectStyles.option,
                  value === o.value && selectStyles.selected,
                  i === active && selectStyles.active,
                )}
                onClick={() => choose(o)}
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
