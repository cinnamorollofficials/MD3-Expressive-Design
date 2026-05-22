import { ReactNode, useEffect, useId } from 'react';
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
  closeOnScrim?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

export function Dialog({
  open,
  onClose,
  title,
  icon,
  children,
  actions,
  fullscreen,
  closeOnScrim = true,
  ariaLabel,
  ariaDescribedBy,
}: DialogProps) {
  const trapRef = useFocusTrap<HTMLDivElement>(open);
  const titleId = useId();

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

  const body = (
    <div className={styles.scrim} onClick={closeOnScrim ? onClose : undefined}>
      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-label={!title ? ariaLabel : undefined}
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={ariaDescribedBy}
        className={cn(styles.dialog, fullscreen && styles.fullscreen)}
        onClick={(e) => e.stopPropagation()}
      >
        {fullscreen ? (
          <>
            <div className={styles.fullscreenHeader}>
              <IconButton icon="close" label="Close" onClick={onClose} />
              <div id={titleId} className={styles.title}>{title}</div>
              {actions}
            </div>
            <div className={styles.fullscreenBody}>{children}</div>
          </>
        ) : (
          <>
            {icon && <div className={styles.icon}><Icon name={icon} size={24} /></div>}
            {title && <div id={titleId} className={cn(styles.title, icon && styles.iconTitle)}>{title}</div>}
            <div className={styles.content}>{children}</div>
            {actions && <div className={styles.actions}>{actions}</div>}
          </>
        )}
      </div>
    </div>
  );

  return createPortal(body, document.body);
}
