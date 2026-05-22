import { CSSProperties } from 'react';
import { cn } from '../../utils/cn';

export interface IconProps {
  /** Material Symbols name, e.g. "favorite", "search", "home" */
  name: string;
  size?: number;
  filled?: boolean;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  grade?: -25 | 0 | 200;
  className?: string;
  style?: CSSProperties;
  'aria-hidden'?: boolean;
}

export function Icon({
  name,
  size = 24,
  filled = false,
  weight = 400,
  grade = 0,
  className,
  style,
  'aria-hidden': ariaHidden = true,
}: IconProps) {
  return (
    <span
      className={cn('material-symbols-rounded', className)}
      aria-hidden={ariaHidden}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${size}`,
        ...style,
      }}
    >
      {name}
    </span>
  );
}
