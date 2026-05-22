import { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../Icon';
import styles from './Timeline.module.css';

export type TimelineTone = 'neutral' | 'primary' | 'success' | 'warning' | 'error';

export interface TimelineItem {
  id?: string | number;
  /** Icon shown inside the marker. If omitted, renders a dot. */
  icon?: string;
  tone?: TimelineTone;
  title?: ReactNode;
  /** Body content — strings render as a single paragraph; otherwise rendered as-is. */
  content?: ReactNode;
  /** Short trailing meta, typically a relative time. */
  meta?: ReactNode;
}

export interface TimelineProps {
  items: TimelineItem[];
  /** `'left'` is conventional; `'alternating'` zigzags for storyboards. */
  align?: 'left' | 'alternating';
  className?: string;
}

/**
 * Material 3 — vertical Timeline for activity / status feeds. The connector
 * line is drawn between marker centers; markers are 24px to align with the
 * icon optical size used elsewhere in the system.
 */
export function Timeline({ items, align = 'left', className }: TimelineProps) {
  return (
    <ol className={cn(styles.root, align === 'alternating' && styles.alt, className)}>
      {items.map((item, i) => {
        const tone = item.tone ?? 'neutral';
        const side = align === 'alternating' && i % 2 === 1 ? 'right' : 'left';
        return (
          <li key={item.id ?? i} className={cn(styles.item, styles[`side_${side}`])}>
            <div className={styles.rail}>
              <span className={cn(styles.marker, styles[`tone_${tone}`])} aria-hidden="true">
                {item.icon ? <Icon name={item.icon} size={16} /> : <span className={styles.dot} />}
              </span>
              {i < items.length - 1 && <span className={styles.connector} />}
            </div>
            <div className={styles.body}>
              <div className={styles.head}>
                {item.title && <div className={styles.title}>{item.title}</div>}
                {item.meta && <div className={styles.meta}>{item.meta}</div>}
              </div>
              {item.content && <div className={styles.content}>{item.content}</div>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
