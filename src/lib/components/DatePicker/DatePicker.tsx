import { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { TextField } from '../TextField';
import { Icon } from '../Icon';
import styles from './DatePicker.module.css';

export interface DatePickerProps {
  value?: Date;
  onChange?: (d: Date) => void;
  label?: string;
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function DatePicker({ value, onChange, label = 'Date' }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(value ?? new Date());
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const firstOfMonth = new Date(view.getFullYear(), view.getMonth(), 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const cells: { date: Date; outside: boolean }[] = [];
  for (let i = 0; i < startWeekday; i++) {
    const d = new Date(view.getFullYear(), view.getMonth(), -startWeekday + i + 1);
    cells.push({ date: d, outside: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(view.getFullYear(), view.getMonth(), d), outside: false });
  }
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1].date;
    cells.push({ date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1), outside: true });
  }

  const display = value ? value.toLocaleDateString() : '';
  const today = new Date();

  return (
    <div ref={rootRef} className={styles.root}>
      <TextField
        label={label}
        value={display}
        readOnly
        trailingIcon="calendar_today"
        onFocus={() => setOpen(true)}
      />
      {open && (
        <div className={styles.popup}>
          <div className={styles.header}>
            <div className={styles.title}>{MONTHS[view.getMonth()]} {view.getFullYear()}</div>
            <div className={styles.nav}>
              <button type="button" className={styles.navBtn} onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}>
                <Icon name="chevron_left" size={24} />
              </button>
              <button type="button" className={styles.navBtn} onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}>
                <Icon name="chevron_right" size={24} />
              </button>
            </div>
          </div>
          <div className={styles.weekdays}>
            {WEEKDAYS.map((w, i) => <div key={i} className={styles.weekday}>{w}</div>)}
          </div>
          <div className={styles.days}>
            {cells.map(({ date, outside }, i) => (
              <button
                key={i}
                type="button"
                className={cn(styles.day, outside && styles.outside, sameDay(date, today) && styles.today, value && sameDay(date, value) && styles.selected)}
                onClick={() => { onChange?.(date); setOpen(false); }}
              >
                {date.getDate()}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
