import { ReactNode, useMemo, useState } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../Icon';
import { Checkbox } from '../Checkbox';
import styles from './DataTable.module.css';

export type SortDirection = 'asc' | 'desc';

export interface DataTableColumn<T> {
  /** Stable column id. Used for sort state and React keys. */
  id: string;
  /** Header label. */
  header: ReactNode;
  /** Render a cell. Defaults to indexing the row by `id` when typed loosely. */
  cell?: (row: T, rowIndex: number) => ReactNode;
  /** Accessor for client-side sorting. Required when `sortable` is true. */
  sortValue?: (row: T) => string | number | Date | null | undefined;
  sortable?: boolean;
  align?: 'left' | 'right' | 'center';
  /** CSS width (e.g. '120px' or '20%'). */
  width?: string;
  /** Numeric columns: right-align + tabular numerals. */
  numeric?: boolean;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  /** Stable row key. Defaults to the row index. */
  rowKey?: (row: T, index: number) => string | number;

  /** Sort state. When omitted, the table sorts internally. */
  sort?: { columnId: string; direction: SortDirection } | null;
  onSortChange?: (sort: { columnId: string; direction: SortDirection } | null) => void;

  /** Set of selected row keys. When set, a leading checkbox column appears. */
  selected?: Set<string | number>;
  onSelectedChange?: (next: Set<string | number>) => void;

  /** Compact row height. */
  dense?: boolean;
  /** Sticky header — caller must constrain height for it to engage. */
  stickyHeader?: boolean;
  /** Rendered when `rows` is empty. */
  emptyState?: ReactNode;
  className?: string;
  /** Accessible name for the table. */
  ariaLabel?: string;
}

function defaultCell<T>(row: T, col: DataTableColumn<T>): ReactNode {
  // When no cell renderer is given, look the column id up on the row.
  const v = (row as Record<string, unknown>)[col.id];
  if (v == null) return null;
  if (v instanceof Date) return v.toLocaleDateString();
  return v as ReactNode;
}

function compare(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true });
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  sort,
  onSortChange,
  selected,
  onSelectedChange,
  dense,
  stickyHeader,
  emptyState,
  className,
  ariaLabel,
}: DataTableProps<T>) {
  // Controlled if both `sort` and `onSortChange` are supplied, otherwise we
  // hold sort entirely internally so the caller can just pass `columns` and
  // `rows` and get a working sortable table.
  const isControlledSort = sort !== undefined && onSortChange !== undefined;
  const [internalSort, setInternalSort] = useState<typeof sort>(sort ?? null);
  const activeSort = isControlledSort ? sort : internalSort;

  const setSort = (next: typeof sort) => {
    if (isControlledSort) onSortChange?.(next ?? null);
    else setInternalSort(next ?? null);
  };

  const sortedRows = useMemo(() => {
    if (!activeSort) return rows;
    const col = columns.find(c => c.id === activeSort.columnId);
    if (!col?.sortValue) return rows;
    const mul = activeSort.direction === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => mul * compare(col.sortValue!(a), col.sortValue!(b)));
  }, [rows, columns, activeSort]);

  const allKeys = useMemo(
    () => sortedRows.map((r, i) => (rowKey ? rowKey(r, i) : i)),
    [sortedRows, rowKey],
  );
  const allSelected = !!selected && allKeys.length > 0 && allKeys.every(k => selected.has(k));
  const someSelected = !!selected && !allSelected && allKeys.some(k => selected.has(k));

  const toggleAll = () => {
    if (!onSelectedChange || !selected) return;
    const next = new Set(selected);
    if (allSelected) allKeys.forEach(k => next.delete(k));
    else allKeys.forEach(k => next.add(k));
    onSelectedChange(next);
  };

  const toggleRow = (key: string | number) => {
    if (!onSelectedChange || !selected) return;
    const next = new Set(selected);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onSelectedChange(next);
  };

  const handleHeaderClick = (col: DataTableColumn<T>) => {
    if (!col.sortable || !col.sortValue) return;
    if (!activeSort || activeSort.columnId !== col.id) {
      setSort({ columnId: col.id, direction: 'asc' });
    } else if (activeSort.direction === 'asc') {
      setSort({ columnId: col.id, direction: 'desc' });
    } else {
      setSort(null);
    }
  };

  return (
    <div className={cn(styles.wrap, stickyHeader && styles.sticky, className)}>
      <table
        className={cn(styles.table, dense && styles.dense)}
        aria-label={ariaLabel}
      >
        <thead>
          <tr>
            {selected && (
              <th className={cn(styles.th, styles.checkCell)}>
                <Checkbox
                  aria-label={allSelected ? 'Deselect all rows' : 'Select all rows'}
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={toggleAll}
                />
              </th>
            )}
            {columns.map(col => {
              const isSorted = activeSort?.columnId === col.id;
              const dir = isSorted ? activeSort!.direction : undefined;
              const ariaSort = isSorted
                ? dir === 'asc' ? 'ascending' : 'descending'
                : col.sortable ? 'none' : undefined;
              return (
                <th
                  key={col.id}
                  scope="col"
                  aria-sort={ariaSort}
                  style={{ width: col.width, textAlign: col.numeric ? 'right' : col.align }}
                  className={cn(styles.th, col.numeric && styles.numeric)}
                >
                  {col.sortable && col.sortValue ? (
                    <button
                      type="button"
                      className={styles.sortBtn}
                      onClick={() => handleHeaderClick(col)}
                    >
                      <span>{col.header}</span>
                      <span className={cn(styles.sortIcon, isSorted && styles.sortIconActive)}>
                        <Icon
                          name={dir === 'desc' ? 'arrow_downward' : 'arrow_upward'}
                          size={16}
                        />
                      </span>
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedRows.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selected ? 1 : 0)} className={styles.empty}>
                {emptyState ?? 'No data'}
              </td>
            </tr>
          ) : (
            sortedRows.map((row, i) => {
              const key = allKeys[i];
              const isSelected = !!selected?.has(key);
              return (
                <tr
                  key={key}
                  className={cn(isSelected && styles.rowSelected)}
                  aria-selected={selected ? isSelected : undefined}
                >
                  {selected && (
                    <td className={cn(styles.td, styles.checkCell)}>
                      <Checkbox
                        aria-label={`Select row ${i + 1}`}
                        checked={isSelected}
                        onChange={() => toggleRow(key)}
                      />
                    </td>
                  )}
                  {columns.map(col => (
                    <td
                      key={col.id}
                      className={cn(styles.td, col.numeric && styles.numeric)}
                      style={{ textAlign: col.numeric ? 'right' : col.align }}
                    >
                      {col.cell ? col.cell(row, i) : defaultCell(row, col)}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

