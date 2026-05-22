import { ReactNode, useCallback, useId, useState } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../Icon';
import styles from './Accordion.module.css';

export interface AccordionItem {
  id: string;
  title: ReactNode;
  /** Optional supporting line beside the title. */
  supporting?: ReactNode;
  /** Optional leading icon name. */
  icon?: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** When true, only one panel may be open at a time. */
  single?: boolean;
  /** Initially expanded item ids (uncontrolled). */
  defaultExpanded?: string[];
  /** Controlled expanded set. Pair with `onExpandedChange`. */
  expanded?: string[];
  onExpandedChange?: (next: string[]) => void;
  /** Subtle variant drops the surface tint and borders. */
  variant?: 'filled' | 'plain';
  className?: string;
}

/**
 * Material 3 Accordion — collapsible disclosure list. Behaves as a tree of
 * `<button>` headers with `aria-expanded` and `aria-controls` so screen
 * readers announce state changes.
 */
export function Accordion({
  items,
  single,
  defaultExpanded,
  expanded,
  onExpandedChange,
  variant = 'filled',
  className,
}: AccordionProps) {
  const isControlled = expanded !== undefined;
  const [internal, setInternal] = useState<string[]>(() => defaultExpanded ?? []);
  const active = isControlled ? expanded! : internal;

  const setActive = useCallback(
    (next: string[]) => {
      if (isControlled) onExpandedChange?.(next);
      else {
        setInternal(next);
        onExpandedChange?.(next);
      }
    },
    [isControlled, onExpandedChange],
  );

  const toggle = (id: string) => {
    const isOpen = active.includes(id);
    if (single) {
      setActive(isOpen ? [] : [id]);
    } else {
      setActive(isOpen ? active.filter(x => x !== id) : [...active, id]);
    }
  };

  const groupId = useId();

  return (
    <div className={cn(styles.root, styles[variant], className)}>
      {items.map(item => {
        const isOpen = active.includes(item.id);
        const headerId = `${groupId}-h-${item.id}`;
        const panelId = `${groupId}-p-${item.id}`;
        return (
          <div key={item.id} className={cn(styles.item, isOpen && styles.open)}>
            <h3 className={styles.headingReset}>
              <button
                id={headerId}
                type="button"
                className={styles.header}
                aria-expanded={isOpen}
                aria-controls={panelId}
                aria-disabled={item.disabled || undefined}
                disabled={item.disabled}
                onClick={() => !item.disabled && toggle(item.id)}
              >
                {item.icon && (
                  <span className={styles.leading} aria-hidden="true">
                    <Icon name={item.icon} size={20} />
                  </span>
                )}
                <span className={styles.titleWrap}>
                  <span className={styles.title}>{item.title}</span>
                  {item.supporting && <span className={styles.supporting}>{item.supporting}</span>}
                </span>
                <span className={cn(styles.chevron, isOpen && styles.chevronOpen)} aria-hidden="true">
                  <Icon name="expand_more" size={20} />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              hidden={!isOpen}
              className={styles.panel}
            >
              <div className={styles.panelInner}>{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
