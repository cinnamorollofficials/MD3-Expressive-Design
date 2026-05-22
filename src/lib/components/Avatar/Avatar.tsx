import { Children, ReactNode, isValidElement, cloneElement } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../Icon';
import styles from './Avatar.module.css';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square' | 'rounded';
export type AvatarTone = 1 | 2 | 3 | 4;

export interface AvatarProps {
  src?: string;
  alt?: string;
  /** Falls back to initials when no src or src fails. */
  name?: string;
  icon?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  /** Color tone for the initials background. 1=primary, 2=secondary, 3=tertiary, 4=error. */
  tone?: AvatarTone;
  className?: string;
}

const initials = (name: string) =>
  name.split(' ').filter(Boolean).map(p => p[0]).slice(0, 2).join('').toUpperCase();

const shapeClass: Record<AvatarShape, string | undefined> = {
  circle: undefined, square: styles.square, rounded: styles.rounded,
};

export function Avatar({ src, alt, name, icon, size = 'md', shape = 'circle', tone = 1, className }: AvatarProps) {
  const toneCls = (styles as any)[`tone${tone}`];
  return (
    <span
      className={cn(styles.avatar, styles[size], shapeClass[shape], toneCls, className)}
      role="img"
      aria-label={alt || name}
    >
      {src ? <img src={src} alt={alt ?? name ?? ''} /> :
        icon ? <Icon name={icon} size={size === 'xs' ? 14 : size === 'sm' ? 16 : size === 'lg' ? 28 : size === 'xl' ? 40 : 20} /> :
        name ? initials(name) : null}
    </span>
  );
}

export interface AvatarGroupProps {
  max?: number;
  size?: AvatarSize;
  children: ReactNode;
}

export function AvatarGroup({ max = 4, size = 'md', children }: AvatarGroupProps) {
  const arr = Children.toArray(children).filter(isValidElement);
  const shown = arr.slice(0, max);
  const overflow = arr.length - shown.length;
  return (
    <span className={styles.group}>
      {shown.map((child, i) =>
        isValidElement<AvatarProps>(child)
          ? cloneElement(child, { size, key: i })
          : child,
      )}
      {overflow > 0 && (
        <span
          className={cn(styles.avatar, styles[size], styles.overflow)}
          role="img"
          aria-label={`${overflow} more`}
        >+{overflow}</span>
      )}
    </span>
  );
}
