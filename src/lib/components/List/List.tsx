import { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import styles from './List.module.css';

export interface ListItemProps {
  headline: ReactNode;
  supporting?: ReactNode;
  /** A 3-line list item uses this as a second supporting line. */
  overline?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  onClick?: () => void;
  as?: 'div' | 'button';
}

export const List = ({ children }: { children: ReactNode }) => (
  <div role="list" className={styles.list}>{children}</div>
);

export function ListItem({ headline, supporting, overline, leading, trailing, onClick, as }: ListItemProps) {
  const Tag: any = as ?? (onClick ? 'button' : 'div');
  const lines = (overline ? 1 : 0) + 1 + (supporting ? 1 : 0);
  return (
    <Tag
      role="listitem"
      className={cn(styles.item, lines === 2 && styles.twoLine, lines === 3 && styles.threeLine)}
      onClick={onClick}
      type={Tag === 'button' ? 'button' : undefined}
    >
      {leading && <span className={styles.leading}>{leading}</span>}
      <span className={styles.body}>
        {overline && <span className={styles.supporting}>{overline}</span>}
        <span className={styles.headline}>{headline}</span>
        {supporting && <span className={styles.supporting}>{supporting}</span>}
      </span>
      {trailing && <span className={styles.trailing}>{trailing}</span>}
    </Tag>
  );
}
