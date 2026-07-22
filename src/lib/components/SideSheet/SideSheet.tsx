import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import styles from './SideSheet.module.css';

export interface SideSheetProps {
  open: boolean;
  onClose: () => void;
  side?: 'left' | 'right';
  children?: ReactNode;
  closeOnScrim?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  size?: 'standard' | 'wide';
}

export function SideSheet({
  open,
  onClose,
  side = 'right',
  children,
  closeOnScrim = true,
  ariaLabel,
  ariaDescribedBy,
  size = 'standard',
}: SideSheetProps) {
  const trap = useFocusTrap<HTMLDivElement>(open);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    const previousOverflow = document.body.style.overflow;
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <>
      <div className={styles.scrim} onClick={closeOnScrim ? onClose : undefined} />
      <div
        ref={trap}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        className={cn(styles.sheet, styles[side], size === 'wide' && styles.wide)}
      >
        {children}
      </div>
    </>,
    document.body,
  );
}
