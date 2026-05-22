import { useState } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../Icon';
import styles from './Rating.module.css';

export interface RatingProps {
  value: number;
  onChange?: (v: number) => void;
  max?: number;
  size?: number;
  /** Allow half-star resolution. */
  half?: boolean;
  readOnly?: boolean;
  showValue?: boolean;
  className?: string;
}

export function Rating({
  value, onChange, max = 5, size = 24, half, readOnly, showValue, className,
}: RatingProps) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;

  const onClick = (i: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (readOnly || !onChange) return;
    if (half) {
      const rect = e.currentTarget.getBoundingClientRect();
      const isHalf = e.clientX - rect.left < rect.width / 2;
      onChange(i + (isHalf ? 0.5 : 1));
    } else {
      onChange(i + 1);
    }
  };

  return (
    <span className={cn(styles.root, readOnly && styles.readonly, className)} role="img" aria-label={`${value} of ${max}`}>
      {Array.from({ length: max }, (_, i) => {
        const filled = display >= i + 1;
        const halfFilled = !filled && display >= i + 0.5;
        return (
          <button
            key={i}
            type="button"
            className={cn(styles.star, filled && styles.on)}
            onMouseEnter={() => !readOnly && setHover(i + 1)}
            onMouseLeave={() => setHover(null)}
            onClick={(e) => onClick(i, e)}
          >
            {halfFilled ? (
              <span className={styles.halfWrap}>
                <Icon name="star" size={size} />
                <span className={styles.halfClip}><Icon name="star" size={size} filled /></span>
              </span>
            ) : (
              <Icon name="star" size={size} filled={filled} />
            )}
          </button>
        );
      })}
      {showValue && <span className={styles.value}>{value.toFixed(half ? 1 : 0)}</span>}
    </span>
  );
}
