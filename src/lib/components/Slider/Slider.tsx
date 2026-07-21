import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { cn } from '../../utils/cn';
import styles from './Slider.module.css';

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  { min = 0, max = 100, step = 1, value, defaultValue, onChange, showValue = true, className, ...rest },
  ref,
) {
  const [internal, setInternal] = useState<number>(Number(defaultValue ?? min));
  const [dragging, setDragging] = useState(false);
  const isControlled = value !== undefined;
  const current = isControlled ? Number(value) : internal;
  const pct = ((current - min) / (max - min)) * 100;

  return (
    <div
      className={cn(styles.root, dragging && styles.dragging, className)}
      onPointerDown={() => setDragging(true)}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
    >
      <input
        ref={ref}
        type="range"
        className={styles.input}
        min={min} max={max} step={step}
        value={isControlled ? value : internal}
        onChange={(e) => {
          if (!isControlled) setInternal(Number(e.target.value));
          onChange?.(e);
        }}
        {...rest}
      />
      <div className={styles.track}>
        <div className={styles.trackFill} style={{ width: `calc(${pct}% - 3px)` }} />
        <div className={styles.trackRest} style={{ width: `calc(${100 - pct}% - 3px)` }} />
      </div>
      <div className={styles.handle} style={{ left: `${pct}%` }}>
        {showValue && <div className={styles.value}>{current}</div>}
      </div>
    </div>
  );
});
