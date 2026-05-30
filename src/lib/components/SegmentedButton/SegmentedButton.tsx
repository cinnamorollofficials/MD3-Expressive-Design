import { cn } from '../../utils/cn';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';
import styles from './SegmentedButton.module.css';

export interface SegmentedOption<T extends string = string> {
  value: T;
  label?: string; // Diubah ke opsional
  icon?: string;
  tooltip?: string; // Tambahkan dukungan tooltip
}

export interface SegmentedButtonProps<T extends string = string> {
  options: SegmentedOption<T>[];
  value: T | T[];
  onChange: (value: T | T[]) => void;
  multiple?: boolean;
}

export function SegmentedButton<T extends string = string>({
  options, value, onChange, multiple = false,
}: SegmentedButtonProps<T>) {
  const isSelected = (v: T) => Array.isArray(value) ? value.includes(v) : value === v;
  const handle = (v: T) => {
    if (multiple) {
      const cur = Array.isArray(value) ? value : [value];
      onChange(cur.includes(v) ? (cur.filter(x => x !== v) as T[]) : ([...cur, v] as T[]));
    } else {
      onChange(v);
    }
  };
  return (
    <div
      role={multiple ? 'group' : 'radiogroup'}
      className={styles.group}
      data-md3-component="segmented-button"
    >
      {options.map(o => {
        const buttonSelected = isSelected(o.value);
        const hasLabel = !!o.label;
        const buttonElement = (
          <button
            key={o.value}
            type="button"
            role={multiple ? 'button' : 'radio'}
            aria-checked={buttonSelected}
            aria-pressed={multiple ? buttonSelected : undefined}
            data-md3-component="segmented-button-item"
            className={cn(
              styles.seg,
              buttonSelected && styles.selected,
              !hasLabel && styles.iconOnly
            )}
            onClick={() => handle(o.value)}
          >
            {buttonSelected ? <Icon name="check" size={18} /> : o.icon && <Icon name={o.icon} size={18} />}
            {o.label}
          </button>
        );

        if (o.tooltip) {
          return (
            <Tooltip key={o.value} label={o.tooltip} placement="auto">
              {buttonElement}
            </Tooltip>
          );
        }

        return buttonElement;
      })}
    </div>
  );
}

