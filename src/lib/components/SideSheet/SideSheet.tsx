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
}

export function SideSheet({ open, onClose, side = 'right', children }: SideSheetProps) {
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
      <div ref={trap} role="dialog" aria-modal="true" className={cn(styles.sheet, styles[side])}>
        {children}
      </div>
    </>,
    document.body,
  );
}
