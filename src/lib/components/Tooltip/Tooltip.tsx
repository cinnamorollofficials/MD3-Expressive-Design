import { ReactNode, useState, useRef, useLayoutEffect } from 'react';
import { cn } from '../../utils/cn';
import styles from './Tooltip.module.css';

export interface TooltipProps {
  label: ReactNode;
  /** When provided alongside `label`, renders a Rich tooltip with a title row. */
  title?: string;
  rich?: boolean;
  children: ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
}

export function Tooltip({ label, title, rich, children, placement = 'top' }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [computedPlacement, setComputedPlacement] = useState<'top' | 'bottom' | 'left' | 'right'>('top');
  const rootRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (!visible) return;
    
    if (placement === 'auto') {
      if (rootRef.current) {
        const rect = rootRef.current.getBoundingClientRect();
        // Jika sisa ruang atas kurang dari 48px, flip ke bottom
        if (rect.top < 48) {
          setComputedPlacement('bottom');
        } else {
          setComputedPlacement('top');
        }
      }
    } else {
      setComputedPlacement(placement);
    }
  }, [visible, placement]);

  const placementClass = {
    top: styles.tooltipTop,
    bottom: styles.tooltipBottom,
    left: styles.tooltipLeft,
    right: styles.tooltipRight,
  }[computedPlacement];

  return (
    <span
      ref={rootRef}
      className={cn(styles.root, visible && styles.visible)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      data-md3-component="tooltip"
    >
      {children}
      <span
        role="tooltip"
        className={cn(
          styles.tip,
          placementClass,
          (rich || title) && styles.rich,
          visible && styles.show
        )}
      >
        {title && <div className={styles.title}>{title}</div>}
        {label}
      </span>
    </span>
  );
}

