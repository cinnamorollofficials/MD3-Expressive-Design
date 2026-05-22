import { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../Icon';
import styles from './EmptyState.module.css';

export interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function EmptyState({ icon = 'inbox', title, description, actions, className }: EmptyStateProps) {
  return (
    <div className={cn(styles.root, className)} role="status">
      <div className={styles.iconWrap}>
        <Icon name={icon} size={36} weight={400} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.body}>{description}</p>}
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}
