import { useCallback, useRef } from 'react';

/**
 * MD3 state-layer ripple. Attach the returned ref to an element with
 * `position: relative` and `overflow: hidden`. On pointerdown a circular
 * ripple expands from the pointer; on pointerup/leave it fades out.
 */
export function useRipple<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);

  const onPointerDown = useCallback((e: React.PointerEvent<T>) => {
    const host = ref.current;
    if (!host) return;
    const rect = host.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      left: ${x}px; top: ${y}px;
      width: ${size}px; height: ${size}px;
      border-radius: 50%;
      background: currentColor;
      opacity: 0.12;
      transform: scale(0);
      pointer-events: none;
      transition: transform 450ms cubic-bezier(0.2, 0, 0, 1), opacity 300ms cubic-bezier(0.2, 0, 0, 1);
    `;
    host.appendChild(ripple);
    requestAnimationFrame(() => { ripple.style.transform = 'scale(1)'; });

    const cleanup = () => {
      ripple.style.opacity = '0';
      setTimeout(() => ripple.remove(), 300);
    };
    host.addEventListener('pointerup', cleanup, { once: true });
    host.addEventListener('pointerleave', cleanup, { once: true });
  }, []);

  return { ref, onPointerDown };
}
