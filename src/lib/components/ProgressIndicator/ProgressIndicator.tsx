import { cn } from '../../utils/cn';
import styles from './ProgressIndicator.module.css';

export interface ProgressIndicatorProps {
  variant?: 'linear' | 'circular';
  value?: number;
  wavy?: boolean;
  size?: number;
}

function wavePath(width: number, amplitude: number, wavelength: number, phase = 0) {
  const points: string[] = [`M 0 ${amplitude}`];
  for (let x = 0; x <= width; x += wavelength / 2) {
    const y = amplitude + amplitude * Math.sin((x / wavelength) * Math.PI * 2 + phase);
    points.push(`L ${x} ${y}`);
  }
  return points.join(' ');
}

export function ProgressIndicator({ variant = 'linear', value, wavy, size = 48 }: ProgressIndicatorProps) {
  const indeterminate = value === undefined;

  if (variant === 'linear') {
    if (wavy) {
      const W = 240, A = 4, WL = 24;
      const phase = (Date.now() / 200) % (Math.PI * 2);
      const trackPath = wavePath(W, A, WL, phase);
      const fillW = indeterminate ? W : Math.max(0, Math.min(100, value)) * W / 100;
      return (
        <svg className={cn(styles.linear, styles.wavy)} viewBox={`0 0 ${W} ${A * 2}`} preserveAspectRatio="none">
          <path className={styles.wavyTrack} d={trackPath} />
          <path className={styles.wavyFill} d={trackPath} strokeDasharray={`${fillW} ${W * 2}`} />
        </svg>
      );
    }
    return (
      <div
        className={cn(styles.linear, indeterminate && styles.linearIndeterminate)}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {!indeterminate && <div className={styles.linearFill} style={{ width: `${value}%` }} />}
      </div>
    );
  }

  // circular
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  return (
    <span
      className={cn(styles.circular, indeterminate && styles.circularIndeterminate)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : value}
    >
      <svg className={styles.circularSvg} viewBox={`0 0 ${size} ${size}`}>
        <circle className={styles.circularTrack} cx={size / 2} cy={size / 2} r={r} />
        <circle
          className={styles.circularFill}
          cx={size / 2} cy={size / 2} r={r}
          strokeDasharray={c}
          strokeDashoffset={indeterminate ? 0 : c - (Math.max(0, Math.min(100, value!)) / 100) * c}
        />
      </svg>
    </span>
  );
}
