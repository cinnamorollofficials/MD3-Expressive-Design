import { cn } from '../../utils/cn';
import { Icon } from '../Icon';
import styles from './Pagination.module.css';

export interface PaginationProps {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  /** Pages shown on either side of current before collapsing to ellipsis. */
  siblings?: number;
}

/** Build the page list with ellipsis: [1, …, p-1, p, p+1, …, n] */
function buildRange(page: number, count: number, siblings: number): Array<number | 'ellipsis'> {
  const total = siblings * 2 + 5;
  if (count <= total) return Array.from({ length: count }, (_, i) => i + 1);

  const leftSibling = Math.max(page - siblings, 2);
  const rightSibling = Math.min(page + siblings, count - 1);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < count - 1;

  const out: Array<number | 'ellipsis'> = [1];
  if (showLeftEllipsis) out.push('ellipsis');
  for (let i = leftSibling; i <= rightSibling; i++) out.push(i);
  if (showRightEllipsis) out.push('ellipsis');
  out.push(count);
  return out;
}

export function Pagination({ page, pageCount, onChange, siblings = 1 }: PaginationProps) {
  const range = buildRange(page, pageCount, siblings);
  return (
    <nav className={styles.root} aria-label="Pagination">
      <button
        type="button"
        className={styles.page}
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label="Previous"
      >
        <Icon name="chevron_left" size={20} />
      </button>
      {range.map((p, i) =>
        p === 'ellipsis' ? (
          <span key={`e${i}`} className={styles.ellipsis}>…</span>
        ) : (
          <button
            key={p}
            type="button"
            aria-current={page === p ? 'page' : undefined}
            className={cn(styles.page, page === p && styles.current)}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ),
      )}
      <button
        type="button"
        className={styles.page}
        disabled={page >= pageCount}
        onClick={() => onChange(page + 1)}
        aria-label="Next"
      >
        <Icon name="chevron_right" size={20} />
      </button>
    </nav>
  );
}
