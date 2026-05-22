import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Snackbar.module.css';

export interface SnackbarProps {
  open: boolean;
  message: ReactNode;
  action?: { label: string; onClick: () => void };
  duration?: number;
  onClose: () => void;
}

export function Snackbar({ open, message, action, duration = 4000, onClose }: SnackbarProps) {
  useEffect(() => {
    if (!open || duration <= 0) return;
    const t = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(t);
  }, [open, duration, onClose]);

  if (!open) return null;
  return createPortal(
    <div role="status" className={styles.snack}>
      <div className={styles.message}>{message}</div>
      {action && (
        <button type="button" className={styles.action} onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>,
    document.body,
  );
}
