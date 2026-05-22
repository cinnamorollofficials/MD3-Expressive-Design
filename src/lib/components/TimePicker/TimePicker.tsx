import { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { TextField } from '../TextField';
import styles from './TimePicker.module.css';

export interface TimeValue { hour: number; minute: number; }

export interface TimePickerProps {
  value?: TimeValue;
  onChange?: (t: TimeValue) => void;
  label?: string;
  /** 12 or 24 hour. */
  format?: 12 | 24;
}

const pad = (n: number) => String(n).padStart(2, '0');

export function TimePicker({ value, onChange, label = 'Time', format = 12 }: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const initial = value ?? { hour: 12, minute: 0 };

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const setHour = (h: number) => onChange?.({ ...initial, hour: Math.max(0, Math.min(format === 12 ? 12 : 23, h)) });
  const setMin = (m: number) => onChange?.({ ...initial, minute: Math.max(0, Math.min(59, m)) });
  const period = initial.hour >= 12 ? 'PM' : 'AM';
  const togglePeriod = (p: 'AM' | 'PM') => {
    if (format !== 12) return;
    const h = initial.hour % 12;
    onChange?.({ ...initial, hour: p === 'PM' ? h + 12 : h });
  };

  const display = value ? `${pad(format === 12 ? ((value.hour % 12) || 12) : value.hour)}:${pad(value.minute)}${format === 12 ? ' ' + period : ''}` : '';

  return (
    <div ref={rootRef} className={styles.root}>
      <TextField label={label} value={display} readOnly trailingIcon="schedule" onFocus={() => setOpen(true)} />
      {open && (
        <div className={styles.popup}>
          <input
            type="number"
            className={cn(styles.unit, styles.active)}
            value={format === 12 ? ((initial.hour % 12) || 12) : initial.hour}
            onChange={(e) => {
              const h = Number(e.target.value);
              setHour(format === 12 ? (period === 'PM' ? (h % 12) + 12 : (h % 12)) : h);
            }}
          />
          <span className={styles.sep}>:</span>
          <input
            type="number"
            className={styles.unit}
            value={initial.minute}
            onChange={(e) => setMin(Number(e.target.value))}
          />
          {format === 12 && (
            <div className={styles.period}>
              <button type="button" className={cn(styles.periodBtn, period === 'AM' && styles.active)} onClick={() => togglePeriod('AM')}>AM</button>
              <button type="button" className={cn(styles.periodBtn, period === 'PM' && styles.active)} onClick={() => togglePeriod('PM')}>PM</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
