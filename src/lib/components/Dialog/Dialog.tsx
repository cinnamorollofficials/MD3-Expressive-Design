import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import styles from './Dialog.module.css';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  icon?: string;
  children?: ReactNode;
  actions?: ReactNode;
  fullscreen?: boolean;
}

export function Dialog({ open, onClose, title, icon, children, actions, fullscreen }: DialogProps) {
  const trapRef = useFocusTrap<HTMLDivElement>(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const body = (
    <div className={styles.scrim} onClick={onClose}>
      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        className={cn(styles.dialog, fullscreen && styles.fullscreen)}
        onClick={(e) => e.stopPropagation()}
      >
        {fullscreen ? (
          <>
            <div className={styles.fullscreenHeader}>
              <IconButton icon="close" label="Close" onClick={onClose} />
              <div className={styles.title}>{title}</div>
              {actions}
            </div>
            <div className={styles.fullscreenBody}>{children}</div>
          </>
        ) : (
          <>
            {icon && <div className={styles.icon}><Icon name={icon} size={24} /></div>}
            {title && <div className={cn(styles.title, icon && styles.iconTitle)}>{title}</div>}
            <div className={styles.content}>{children}</div>
            {actions && <div className={styles.actions}>{actions}</div>}
          </>
        )}
      </div>
    </div>
  );

  return createPortal(body, document.body);
}
