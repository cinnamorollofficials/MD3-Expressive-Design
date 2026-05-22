import { useState } from 'react';
import { Icon } from '../../lib/components/Icon';
import styles from './CodeBlock.module.css';

/** Async-clipboard with a contenteditable fallback for non-secure contexts
 *  (e.g. http://192.168.x.x where `navigator.clipboard` is undefined). */
async function copyText(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the textarea fallback below */
  }
  if (typeof document === 'undefined') return false;
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  ta.style.pointerEvents = 'none';
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  document.body.removeChild(ta);
  return ok;
}

type Status = 'idle' | 'copied' | 'error';

export function CodeBlock({ code }: { code: string }) {
  const [status, setStatus] = useState<Status>('idle');

  const onCopy = async () => {
    const ok = await copyText(code);
    setStatus(ok ? 'copied' : 'error');
    window.setTimeout(() => setStatus('idle'), 1600);
  };

  const label = status === 'copied' ? 'Copied' : status === 'error' ? 'Failed' : 'Copy';
  const icon = status === 'copied' ? 'check' : status === 'error' ? 'error' : 'content_copy';

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={`${styles.copy} ${status === 'copied' ? styles.copied : ''} ${status === 'error' ? styles.error : ''}`}
        onClick={onCopy}
        aria-label="Copy code to clipboard"
        aria-live="polite"
      >
        <Icon name={icon} size={14} />
        {label}
      </button>
      <pre><code>{code}</code></pre>
    </div>
  );
}
