import { cn } from '../../utils/cn';
import { Icon } from '../Icon';
import styles from './SegmentedButton.module.css';

export interface SegmentedOption<T extends string = string> {
  value: T;
  label: string;
  icon?: string;
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
    <div role={multiple ? 'group' : 'radiogroup'} className={styles.group}>
      {options.map(o => (
        <button
          key={o.value}
          type="button"
          role={multiple ? 'button' : 'radio'}
          aria-checked={isSelected(o.value)}
          aria-pressed={multiple ? isSelected(o.value) : undefined}
          className={cn(styles.seg, isSelected(o.value) && styles.selected)}
          onClick={() => handle(o.value)}
        >
          {isSelected(o.value) ? <Icon name="check" size={18} /> : o.icon && <Icon name={o.icon} size={18} />}
          {o.label}
        </button>
      ))}
    </div>
  );
}
