import { useState } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../Icon';
import styles from './NumberInput.module.css';

export interface NumberInputProps {
  value?: number;
  defaultValue?: number;
  onChange?: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  disabled?: boolean;
  className?: string;
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export function NumberInput({
  value, defaultValue = 0, onChange,
  min = -Infinity, max = Infinity, step = 1,
  label, disabled, className,
}: NumberInputProps) {
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value! : internal;

  const set = (v: number) => {
    const next = clamp(v, min, max);
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  return (
    <div className={cn(styles.root, className)}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.steppers}>
        <button
          type="button"
          className={styles.btn}
          disabled={disabled || current <= min}
          onClick={() => set(current - step)}
          aria-label="Decrement"
        >
          <Icon name="remove" size={20} />
        </button>
        <input
          type="number"
          className={styles.value}
          value={Number.isNaN(current) ? '' : current}
          min={min === -Infinity ? undefined : min}
          max={max === Infinity ? undefined : max}
          step={step}
          disabled={disabled}
          onChange={(e) => {
            const n = Number(e.target.value);
            set(Number.isFinite(n) ? n : 0);
          }}
        />
        <button
          type="button"
          className={styles.btn}
          disabled={disabled || current >= max}
          onClick={() => set(current + step)}
          aria-label="Increment"
        >
          <Icon name="add" size={20} />
        </button>
      </div>
    </div>
  );
}
