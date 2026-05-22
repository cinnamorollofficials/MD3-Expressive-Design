import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import styles from './BottomSheet.module.css';

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
  closeOnScrim?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

export function BottomSheet({
  open,
  onClose,
  children,
  closeOnScrim = true,
  ariaLabel,
  ariaDescribedBy,
}: BottomSheetProps) {
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
        className={styles.sheet}
      >
        <div className={styles.handle} />
        {children}
      </div>
    </>,
    document.body,
  );
}
