import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import styles from './BottomSheet.module.css';

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
}

export function BottomSheet({ open, onClose, children }: BottomSheetProps) {
  const trap = useFocusTrap<HTMLDivElement>(open);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <>
      <div className={styles.scrim} onClick={onClose} />
      <div ref={trap} role="dialog" aria-modal="true" className={styles.sheet}>
        <div className={styles.handle} />
        {children}
      </div>
    </>,
    document.body,
  );
}
