import { CSSProperties } from 'react';
import { cn } from '../../utils/cn';
import styles from './Skeleton.module.css';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: CSSProperties;
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  className,
  style,
}: SkeletonProps) {
  const dims: CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };
  return (
    <span
      className={cn(styles.root, styles[variant], className)}
      style={{ ...dims, ...style }}
      aria-hidden="true"
    />
  );
}
