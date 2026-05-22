import { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import styles from './Banner.module.css';

export type BannerVariant = 'info' | 'success' | 'warning' | 'error';

export interface BannerProps {
  /** Visual tone. Drives icon defaults and color tokens. */
  variant?: BannerVariant;
  /** Title/headline. Falls through to children if omitted. */
  title?: ReactNode;
  /** Supporting body content. */
  children?: ReactNode;
  /** Override the leading icon. Pass `null` to hide it. */
  icon?: string | null;
  /** One or two action buttons rendered on the trailing edge. */
  actions?: ReactNode;
  /** Show an `x` close button. Triggered on click. */
  onDismiss?: () => void;
  className?: string;
}

const DEFAULT_ICONS: Record<BannerVariant, string> = {
  info: 'info',
  success: 'check_circle',
  warning: 'warning',
  error: 'error',
};

/**
 * Material 3 Banner — a prominent inline message anchored to the top of a
 * surface. Use sparingly for app-wide status that needs acknowledgement;
 * prefer Snackbar for transient feedback.
 */
export function Banner({
  variant = 'info',
  title,
  children,
  icon,
  actions,
  onDismiss,
  className,
}: BannerProps) {
  const iconName = icon === null ? null : (icon ?? DEFAULT_ICONS[variant]);
  return (
    <div
      role={variant === 'error' || variant === 'warning' ? 'alert' : 'status'}
      className={cn(styles.root, styles[variant], className)}
    >
      {iconName && (
        <span className={styles.icon} aria-hidden="true">
          <Icon name={iconName} size={24} />
        </span>
      )}
      <div className={styles.content}>
        {title && <div className={styles.title}>{title}</div>}
        {children && <div className={styles.body}>{children}</div>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
      {onDismiss && (
        <IconButton
          icon="close"
          label="Dismiss"
          onClick={onDismiss}
          variant="standard"
          className={styles.dismiss}
        />
      )}
    </div>
  );
}
