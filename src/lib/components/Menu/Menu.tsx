import type { KeyboardEventHandler, ReactNode } from 'react';
import { useEffect, useId, useRef, useState, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';
import styles from './Menu.module.css';

export interface MenuItem {
  label?: ReactNode; // Diubah ke ReactNode agar fleksibel
  icon?: string;
  trailingIcon?: string;
  onClick?: () => void;
  disabled?: boolean;
  divider?: boolean;
}

export interface MenuProps {
  trigger: (props: {
    onClick: () => void;
    onKeyDown: KeyboardEventHandler;
    'aria-expanded': boolean;
    'aria-haspopup': 'menu';
    'aria-controls'?: string;
  }) => ReactNode;
  items: MenuItem[];
  align?: 'left' | 'right' | 'auto';
  usePortal?: boolean;
}

export function Menu({ trigger, items, align = 'auto', usePortal = true }: MenuProps) {
  const [open, setOpen] = useState(false);
  const [computedAlign, setComputedAlign] = useState<'left' | 'right'>('left');
  const [portalStyle, setPortalStyle] = useState<React.CSSProperties>({});
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  
  const focusItem = (index: number) => {
    const buttons = menuRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
    if (!buttons?.length) return;
    buttons[Math.min(index, buttons.length - 1)]?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        // Jika menggunakan portal, pastikan klik di dalam portal menu juga tidak menutup menu
        if (usePortal && menuRef.current && menuRef.current.contains(e.target as Node)) {
          return;
        }
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowDown') { e.preventDefault(); focusItem(0); }
      if (e.key === 'ArrowUp') { e.preventDefault(); focusItem(Number.MAX_SAFE_INTEGER); }
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, usePortal]);

  // Kalkulasi alignment dan posisi portal
  useLayoutEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      if (rootRef.current) {
        const triggerRect = rootRef.current.getBoundingClientRect();
        let menuWidth = 180; // default min-width
        if (menuRef.current) {
          menuWidth = menuRef.current.offsetWidth;
        }

        let finalAlign: 'left' | 'right' = align === 'right' ? 'right' : 'left';
        if (align === 'auto') {
          if (triggerRect.left + menuWidth > window.innerWidth) {
            finalAlign = 'right';
          } else {
            finalAlign = 'left';
          }
        }
        setComputedAlign(finalAlign);

        if (usePortal) {
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
          let top = triggerRect.bottom + scrollTop + 4;
          let left = triggerRect.left + scrollLeft;

          if (finalAlign === 'right') {
            left = triggerRect.right + scrollLeft - menuWidth;
          }

          // Bound within viewport horizontally with a safe margin
          const margin = 12;
          const minLeft = scrollLeft + margin;
          const maxLeft = scrollLeft + window.innerWidth - menuWidth - margin;
          left = Math.max(minLeft, Math.min(maxLeft, left));

          setPortalStyle({
            position: 'absolute',
            top: `${top}px`,
            left: `${left}px`,
            transformOrigin: finalAlign === 'right' ? 'top right' : 'top left',
          });
        }
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, align, usePortal]);

  const handleTriggerKeyDown: KeyboardEventHandler = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => focusItem(0));
    }
  };

  const triggerProps = {
    onClick: () => setOpen(o => !o),
    onKeyDown: handleTriggerKeyDown,
    'aria-expanded': open,
    'aria-haspopup': 'menu' as const,
    'aria-controls': open ? menuId : undefined,
  };

  const menuElement = (
    <div
      id={menuId}
      ref={menuRef}
      role="menu"
      data-md3-component="menu"
      className={cn(
        styles.menu,
        usePortal && styles.portalMenu,
        computedAlign === 'right' && styles.menuAlignRight,
        computedAlign === 'left' && styles.menuAlignLeft
      )}
      style={usePortal ? portalStyle : undefined}
    >
      {items.map((it, i) =>
        it.divider ? (
          typeof it.label === 'string' && it.label ? (
            <div key={i} className={styles.dividerWrapper}>
              <div className={styles.dividerLabel}>{it.label}</div>
              <div className={styles.divider} role="separator" />
            </div>
          ) : (
            <div key={i} className={styles.divider} role="separator" />
          )
        ) : (
          <button
            key={i}
            role="menuitem"
            type="button"
            disabled={it.disabled}
            className={styles.item}
            onKeyDown={(e) => {
              const buttons = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? []);
              const index = buttons.indexOf(e.currentTarget);
              if (e.key === 'ArrowDown') { e.preventDefault(); buttons[Math.min(buttons.length - 1, index + 1)]?.focus(); }
              if (e.key === 'ArrowUp') { e.preventDefault(); buttons[Math.max(0, index - 1)]?.focus(); }
              if (e.key === 'Home') { e.preventDefault(); buttons[0]?.focus(); }
              if (e.key === 'End') { e.preventDefault(); buttons[buttons.length - 1]?.focus(); }
            }}
            onClick={() => { it.onClick?.(); setOpen(false); }}
          >
            {it.icon && <Icon name={it.icon} size={20} />}
            <span style={{ flex: 1 }}>{it.label}</span>
            {it.trailingIcon && <Icon name={it.trailingIcon} size={20} />}
          </button>
        )
      )}
    </div>
  );

  return (
    <div ref={rootRef} className={styles.root} data-md3-component="menu-wrapper">
      {trigger(triggerProps)}
      {open && (usePortal ? createPortal(menuElement, document.body) : menuElement)}
    </div>
  );
}

