import { useEffect, useId, useRef, useState, useLayoutEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import { useDensity, type ComponentDensity } from '../../hooks/useDensity';
import { TextField, type TextFieldVariant } from '../TextField';
import { Icon } from '../Icon';
import styles from './Select.module.css';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  icon?: string;
  disabled?: boolean;
}

export interface BaseSelectProps<T extends string = string> {
  options: SelectOption<T>[];
  label?: string;
  variant?: TextFieldVariant;
  placeholder?: string;
  disabled?: boolean;
  helperText?: string;
  error?: boolean;
  leadingIcon?: string;
  className?: string;
  minWidth?: string | number;
  width?: string | number;
  size?: 'small' | 'medium' | 'large';
  usePortal?: boolean;
  density?: ComponentDensity;
  searchable?: boolean;
  searchPlaceholder?: string;
}

export interface SingleSelectProps<T extends string = string> extends BaseSelectProps<T> {
  multiple?: false;
  value?: T;
  onChange?: (v: T) => void;
}

export interface MultiSelectProps<T extends string = string> extends BaseSelectProps<T> {
  multiple: true;
  value?: T[];
  onChange?: (v: T[]) => void;
}

export type SelectProps<T extends string = string> = SingleSelectProps<T> | MultiSelectProps<T>;

export function Select<T extends string = string>(props: SelectProps<T>) {
  const {
    options, value, label, variant, placeholder,
    disabled, helperText, error, leadingIcon, className,
    minWidth, width, size = 'large', usePortal = true, density: densityProp,
    searchable, searchPlaceholder,
  } = props;

  const multiple = props.multiple === true;
  const density = useDensity(densityProp);

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [searchQuery, setSearchQuery] = useState('');
  const [portalStyle, setPortalStyle] = useState<React.CSSProperties>({});
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase();
    return options.filter(o => o.label.toLowerCase().includes(q) || String(o.value).toLowerCase().includes(q));
  }, [options, searchable, searchQuery]);

  const isOptionSelected = (optVal: T) => {
    if (multiple) {
      return Array.isArray(value) && value.includes(optVal);
    }
    return value === optVal;
  };

  const getDisplayValue = () => {
    if (multiple) {
      const selectedList = options.filter(o => Array.isArray(value) && value.includes(o.value));
      if (selectedList.length === 0) return '';
      return selectedList.map(o => o.label).join(', ');
    }
    const selected = options.find(o => o.value === value);
    return selected?.label ?? '';
  };

  const activeOption = active >= 0 ? filteredOptions[active] : undefined;

  const optionId = (optionValue: string) => `${listboxId}-option-${optionValue}`;
  const firstEnabledIndex = () => Math.max(0, filteredOptions.findIndex(o => !o.disabled));

  const choose = (opt: SelectOption<T> | undefined) => {
    if (!opt || opt.disabled) return;
    if (multiple) {
      const currentArray = (Array.isArray(value) ? value : []) as T[];
      const isSel = currentArray.includes(opt.value);
      const next = isSel ? currentArray.filter(v => v !== opt.value) : [...currentArray, opt.value];
      (props.onChange as ((v: T[]) => void) | undefined)?.(next);
    } else {
      (props.onChange as ((v: T) => void) | undefined)?.(opt.value);
      setOpen(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setSearchQuery('');
      return;
    }
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        if (usePortal && menuRef.current && menuRef.current.contains(e.target as Node)) {
          return;
        }
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open, usePortal]);

  useLayoutEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      if (rootRef.current) {
        const triggerRect = rootRef.current.getBoundingClientRect();
        if (usePortal) {
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
          const top = triggerRect.bottom + scrollTop + 4;
          const left = triggerRect.left + scrollLeft;
          const widthVal = triggerRect.width;

          setPortalStyle({
            position: 'absolute',
            top: `${top}px`,
            left: `${left}px`,
            minWidth: `${widthVal}px`,
            zIndex: 1000,
          });
        }
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, usePortal]);

  const onKey = (e: React.KeyboardEvent) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault(); setOpen(true);
      const selectedIndex = filteredOptions.findIndex(o => isOptionSelected(o.value) && !o.disabled);
      setActive(selectedIndex >= 0 ? selectedIndex : firstEnabledIndex());
    } else if (open) {
      if (e.key === 'Escape') { e.preventDefault(); setOpen(false); }
      else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive(a => {
          for (let i = Math.min(filteredOptions.length - 1, a + 1); i < filteredOptions.length; i += 1) {
            if (!filteredOptions[i].disabled) return i;
          }
          return a;
        });
      }
      else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive(a => {
          for (let i = Math.max(0, a - 1); i >= 0; i -= 1) {
            if (!filteredOptions[i].disabled) return i;
          }
          return a;
        });
      }
      else if (e.key === 'Enter') {
        e.preventDefault();
        choose(filteredOptions[active]);
      }
    }
  };

  const containerStyle: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    minWidth: typeof minWidth === 'number' ? `${minWidth}px` : minWidth,
  };

  const menuElement = (
    <div
      id={listboxId}
      ref={menuRef}
      role="listbox"
      aria-multiselectable={multiple}
      className={cn(styles.menu, usePortal && styles.portalMenu, size && styles[size])}
      style={usePortal ? portalStyle : undefined}
    >
      {searchable && (
        <div className={styles.searchHeader} onClick={e => e.stopPropagation()}>
          <Icon name="search" size={18} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder={searchPlaceholder ?? 'Search options...'}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.stopPropagation()}
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              className={styles.clearSearchBtn}
              onClick={e => { e.stopPropagation(); setSearchQuery(''); }}
            >
              <Icon name="close" size={16} />
            </button>
          )}
        </div>
      )}
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {filteredOptions.length === 0 ? (
          <div className={styles.emptyState}>No options found</div>
        ) : (
          filteredOptions.map((o, i) => {
            const isSel = isOptionSelected(o.value);
            return (
              <li key={o.value}>
                <button
                  id={optionId(o.value)}
                  role="option"
                  aria-selected={isSel}
                  disabled={o.disabled}
                  className={cn(
                    styles.option,
                    isSel && styles.selected,
                    i === active && styles.active,
                    size && styles[size],
                  )}
                  onClick={() => choose(o)}
                  onMouseEnter={() => { if (!o.disabled) setActive(i); }}
                >
                  {multiple && (
                    <Icon
                      name={isSel ? 'check_box' : 'check_box_outline_blank'}
                      size={size === 'small' ? 16 : 20}
                      className={isSel ? styles.checkboxActive : styles.checkboxInactive}
                    />
                  )}
                  {o.icon && <Icon name={o.icon} size={size === 'small' ? 16 : 20} />}
                  <span style={{ flex: 1 }}>{o.label}</span>
                  {!multiple && isSel && <Icon name="check" size={size === 'small' ? 16 : 20} />}
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );

  return (
    <div
      ref={rootRef}
      className={cn(styles.root, className)}
      style={containerStyle}
      data-md3-component="select"
    >
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
          value={getDisplayValue()}
          placeholder={placeholder}
          readOnly
          disabled={disabled}
          helperText={helperText}
          error={error}
          leadingIcon={leadingIcon}
          trailingIcon={open ? 'arrow_drop_up' : 'arrow_drop_down'}
          size={size}
          density={density}
        />
      </div>
      {open && (usePortal ? createPortal(menuElement, document.body) : menuElement)}
    </div>
  );
}
