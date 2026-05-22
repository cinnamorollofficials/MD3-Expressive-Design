import { Fragment, CSSProperties } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../Icon';
import styles from './Stepper.module.css';

export interface Step {
  label: string;
  optional?: string;
}

export interface StepperProps {
  steps: Step[];
  current: number;
  onChange?: (i: number) => void;
  /** Linear steppers block forward jumps past the current step. */
  linear?: boolean;
  className?: string;
}

export function Stepper({ steps, current, onChange, linear = true, className }: StepperProps) {
  return (
    <ol className={cn(styles.root, className)}>
      {steps.map((s, i) => {
        const completed = i < current;
        const isCurrent = i === current;
        const canJump = !!onChange && (!linear || i <= current);
        return (
          <Fragment key={i}>
            <li>
              <button
                type="button"
                className={cn(styles.step, isCurrent && styles.current, completed && styles.completed)}
                disabled={!canJump}
                onClick={() => canJump && onChange?.(i)}
              >
                <span className={styles.dot}>
                  {completed ? <Icon name="check" size={16} weight={700} /> : i + 1}
                </span>
                <span style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                  <span className={styles.label}>{s.label}</span>
                  {s.optional && <span className={styles.optional}>{s.optional}</span>}
                </span>
              </button>
            </li>
            {i < steps.length - 1 && (
              <span
                className={styles.connector}
                style={{ '--md-fill': i < current ? 1 : 0 } as CSSProperties}
              />
            )}
          </Fragment>
        );
      })}
    </ol>
  );
}
