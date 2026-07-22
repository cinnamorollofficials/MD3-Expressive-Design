import { ReactNode, useMemo, useState, useCallback, useRef, Fragment } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../Icon';
import { Checkbox } from '../Checkbox';
import { Pagination } from '../Pagination';
import { Button } from '../Button';
import styles from './DataTable.module.css';

export type SortDirection = 'asc' | 'desc';
export type DataTableVariant = 'flat' | 'outlined' | 'striped' | 'flush';
export type DataTableDensity = 'comfortable' | 'medium' | 'compact';

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
  /** Pin column to left or right when horizontal scrolling occurs. */
  pinned?: 'left' | 'right';
  /** Allow inline editing for cells in this column. */
  editable?: boolean;
}

export interface DataTableBulkAction {
  id: string;
  label: string;
  icon?: string;
  tone?: 'primary' | 'danger' | 'neutral';
  onClick: (selectedKeys: Set<string | number>) => void;
}

export interface DataTablePaginationProps {
  page: number;
  pageSize: number;
  totalRows?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

export interface ExpandableRowProps<T> {
  renderDetail: (row: T, index: number) => ReactNode;
  expandedRowKeys?: Set<string | number>;
  onExpandedRowKeysChange?: (next: Set<string | number>) => void;
  /** If true, only one row can be expanded at a time. */
  accordion?: boolean;
}

export interface DataTableDateRangeFilter {
  columnId: string;
  startDate?: Date | null;
  endDate?: Date | null;
  onStartDateChange?: (d: Date | null) => void;
  onEndDateChange?: (d: Date | null) => void;
  dateValue?: (row: any) => Date | null | undefined;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  /** Stable row key. Defaults to the row index. */
  rowKey?: (row: T, index: number) => string | number;

  /** Visual variant. Defaults to 'flat'. */
  variant?: DataTableVariant;
  /** Compact, medium, or comfortable row height. Defaults to 'medium'. */
  density?: DataTableDensity;

  /** Sort state. When omitted, the table sorts internally. */
  sort?: { columnId: string; direction: SortDirection } | null;
  onSortChange?: (sort: { columnId: string; direction: SortDirection } | null) => void;

  /** Set of selected row keys. When set, a leading checkbox column appears. */
  selected?: Set<string | number>;
  onSelectedChange?: (next: Set<string | number>) => void;

  /** Bulk action buttons shown when rows are selected. */
  bulkActions?: DataTableBulkAction[];

  /** Expandable master-detail rows config. */
  expandableRow?: ExpandableRowProps<T>;

  /** Enable Tree mode for hierarchical rows (reads `children?: T[]` on row items). */
  treeMode?: boolean;

  /** Search & filter configuration. */
  searchable?: boolean | {
    query?: string;
    onQueryChange?: (q: string) => void;
    placeholder?: string;
    title?: ReactNode;
  };

  /** Date range filter config. */
  dateRangeFilter?: DataTableDateRangeFilter;

  /** Built-in pagination controls. */
  pagination?: DataTablePaginationProps;

  /** Inline cell edit callback. */
  onCellEdit?: (row: T, columnId: string, newValue: any) => void;

  /** Enable column resizing. */
  resizableColumns?: boolean;

  /** Compact row height (legacy shortcut for density="compact"). */
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
  const v = (row as Record<string, unknown>)[col.id];
  if (v == null) return null;
  if (v instanceof Date) return v.toLocaleDateString();
  return String(v);
}

function compare(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true });
}

interface TreeFlatItem<T> {
  row: T;
  depth: number;
  key: string | number;
  hasChildren: boolean;
  path: string;
}

export function DataTable<T>({
  columns: initialColumns,
  rows,
  rowKey,
  variant = 'flat',
  density: densityProp,
  sort,
  onSortChange,
  selected,
  onSelectedChange,
  bulkActions,
  expandableRow,
  treeMode,
  searchable,
  dateRangeFilter,
  pagination,
  onCellEdit,
  resizableColumns,
  dense,
  stickyHeader,
  emptyState,
  className,
  ariaLabel,
}: DataTableProps<T>) {
  const density: DataTableDensity = densityProp ?? (dense ? 'compact' : 'medium');

  // Internal Search State
  const [internalSearch, setInternalSearch] = useState('');
  const isControlledSearch = typeof searchable === 'object' && searchable.query !== undefined;
  const searchQuery = isControlledSearch
    ? (searchable as { query?: string }).query ?? ''
    : (typeof searchable === 'object' ? (searchable.query ?? internalSearch) : internalSearch);

  const handleSearchChange = (q: string) => {
    if (typeof searchable === 'object' && searchable.onQueryChange) {
      searchable.onQueryChange(q);
    } else {
      setInternalSearch(q);
    }
  };

  // Internal Expand State for Master-Detail Rows
  const [internalExpanded, setInternalExpanded] = useState<Set<string | number>>(new Set());
  const isControlledExpanded = expandableRow?.expandedRowKeys !== undefined;
  const activeExpanded = isControlledExpanded ? expandableRow.expandedRowKeys! : internalExpanded;

  const toggleExpand = useCallback((key: string | number) => {
    let next: Set<string | number>;
    if (expandableRow?.accordion) {
      next = activeExpanded.has(key) ? new Set() : new Set([key]);
    } else {
      next = new Set(activeExpanded);
      if (next.has(key)) next.delete(key);
      else next.add(key);
    }
    if (isControlledExpanded) expandableRow?.onExpandedRowKeysChange?.(next);
    else setInternalExpanded(next);
  }, [expandableRow, activeExpanded, isControlledExpanded]);

  // Tree Mode Expand State
  const [treeExpanded, setTreeExpanded] = useState<Set<string | number>>(new Set());
  const toggleTreeExpand = (key: string | number) => {
    setTreeExpanded(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // Controlled/Uncontrolled Sorting
  const isControlledSort = sort !== undefined && onSortChange !== undefined;
  const [internalSort, setInternalSort] = useState<typeof sort>(sort ?? null);
  const activeSort = isControlledSort ? sort : internalSort;

  const setSort = (next: typeof sort) => {
    if (isControlledSort) onSortChange?.(next ?? null);
    else setInternalSort(next ?? null);
  };

  // Column Resizing state
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const resizingCol = useRef<{ id: string; startX: number; startWidth: number } | null>(null);

  const handleResizeStart = (e: React.MouseEvent, colId: string, currentWidth: number) => {
    e.preventDefault();
    e.stopPropagation();
    resizingCol.current = { id: colId, startX: e.clientX, startWidth: currentWidth };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!resizingCol.current) return;
      const diff = moveEvent.clientX - resizingCol.current.startX;
      const nextWidth = Math.max(60, resizingCol.current.startWidth + diff);
      setColumnWidths(prev => ({ ...prev, [resizingCol.current!.id]: nextWidth }));
    };

    const handleMouseUp = () => {
      resizingCol.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Filter rows based on search query and date range
  const filteredRows = useMemo(() => {
    let result = rows;

    if (dateRangeFilter && (dateRangeFilter.startDate || dateRangeFilter.endDate)) {
      const { columnId, startDate, endDate, dateValue } = dateRangeFilter;
      result = result.filter(r => {
        let d: Date | null | undefined = null;
        if (dateValue) {
          d = dateValue(r);
        } else {
          const val = (r as Record<string, unknown>)[columnId];
          if (val instanceof Date) d = val;
          else if (typeof val === 'string' || typeof val === 'number') d = new Date(val);
        }
        if (!d || isNaN(d.getTime())) return false;

        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (d.getTime() < start.getTime()) return false;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (d.getTime() > end.getTime()) return false;
        }
        return true;
      });
    }

    if (!searchQuery.trim()) return result;
    const q = searchQuery.toLowerCase();
    return result.filter(r => {
      return Object.values(r as Record<string, unknown>).some(val => {
        if (val == null) return false;
        return String(val).toLowerCase().includes(q);
      });
    });
  }, [rows, searchQuery, dateRangeFilter]);

  // Client-side Sort
  const sortedRows = useMemo(() => {
    if (!activeSort) return filteredRows;
    const col = initialColumns.find(c => c.id === activeSort.columnId);
    if (!col?.sortValue) return filteredRows;
    const mul = activeSort.direction === 'asc' ? 1 : -1;
    return [...filteredRows].sort((a, b) => mul * compare(col.sortValue!(a), col.sortValue!(b)));
  }, [filteredRows, initialColumns, activeSort]);

  // Tree Mode Flattening
  const flatTreeRows = useMemo(() => {
    if (!treeMode) return [];
    const result: TreeFlatItem<T>[] = [];
    const flatten = (items: T[], depth: number, parentPath: string) => {
      items.forEach((item, index) => {
        const k = rowKey ? rowKey(item, index) : `${parentPath}-${index}`;
        const children = (item as Record<string, unknown>).children as T[] | undefined;
        const hasChildren = Array.isArray(children) && children.length > 0;
        result.push({ row: item, depth, key: k, hasChildren, path: String(k) });
        if (hasChildren && treeExpanded.has(k)) {
          flatten(children!, depth + 1, String(k));
        }
      });
    };
    flatten(sortedRows, 0, 'root');
    return result;
  }, [sortedRows, treeMode, treeExpanded, rowKey]);

  // Client-side Pagination slicing
  const displayedRows = useMemo(() => {
    if (!pagination || pagination.totalRows !== undefined) return sortedRows;
    const start = (pagination.page - 1) * pagination.pageSize;
    return sortedRows.slice(start, start + pagination.pageSize);
  }, [sortedRows, pagination]);

  const allKeys = useMemo(() => {
    if (treeMode) return flatTreeRows.map(item => item.key);
    return displayedRows.map((r, i) => (rowKey ? rowKey(r, i) : i));
  }, [displayedRows, flatTreeRows, treeMode, rowKey]);

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

  // Inline Cell Edit state
  const [editingCell, setEditingCell] = useState<{ key: string | number; colId: string; value: string } | null>(null);

  const startCellEdit = (key: string | number, colId: string, initialValue: any) => {
    if (!onCellEdit) return;
    setEditingCell({ key, colId, value: String(initialValue ?? '') });
  };

  const commitCellEdit = (row: T, colId: string) => {
    if (editingCell && onCellEdit) {
      onCellEdit(row, colId, editingCell.value);
    }
    setEditingCell(null);
  };

  // Calculate sticky offset for pinned columns
  const getPinnedStyle = (col: DataTableColumn<T>, colIndex: number) => {
    if (!col.pinned) return {};
    if (col.pinned === 'left') {
      let offset = selected ? 44 : 0;
      if (expandableRow) offset += 36;
      for (let i = 0; i < colIndex; i++) {
        if (initialColumns[i].pinned === 'left') {
          const w = columnWidths[initialColumns[i].id] || parseInt(initialColumns[i].width || '120', 10);
          offset += w;
        }
      }
      return { left: `${offset}px` };
    }
    return { right: '0px' };
  };

  const totalColsSpan = initialColumns.length + (selected ? 1 : 0) + (expandableRow ? 1 : 0);
  const totalRowsCount = pagination?.totalRows ?? filteredRows.length;
  const pageCount = pagination ? Math.ceil(totalRowsCount / pagination.pageSize) : 0;

  return (
    <div
      className={cn(
        styles.wrapContainer,
        styles[variant],
        styles[density],
        className
      )}
    >
      {/* Top Search & Date Toolbar */}
      {(searchable || dateRangeFilter) && (
        <div className={styles.topToolbar}>
          <div className={styles.toolbarTitle}>
            {typeof searchable === 'object' && searchable.title ? searchable.title : 'Table Records'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            {dateRangeFilter && (
              <div className={styles.dateFilterGroup}>
                <div className={styles.dateInputWrap}>
                  <Icon name="calendar_today" size={16} />
                  <span>From:</span>
                  <input
                    type="date"
                    className={styles.dateInputNative}
                    value={dateRangeFilter.startDate ? dateRangeFilter.startDate.toISOString().split('T')[0] : ''}
                    onChange={e => dateRangeFilter.onStartDateChange?.(e.target.value ? new Date(e.target.value) : null)}
                  />
                </div>
                <div className={styles.dateInputWrap}>
                  <span>To:</span>
                  <input
                    type="date"
                    className={styles.dateInputNative}
                    value={dateRangeFilter.endDate ? dateRangeFilter.endDate.toISOString().split('T')[0] : ''}
                    onChange={e => dateRangeFilter.onEndDateChange?.(e.target.value ? new Date(e.target.value) : null)}
                  />
                </div>
                {(dateRangeFilter.startDate || dateRangeFilter.endDate) && (
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={() => {
                      dateRangeFilter.onStartDateChange?.(null);
                      dateRangeFilter.onEndDateChange?.(null);
                    }}
                    title="Reset date range filter"
                  >
                    <Icon name="restart_alt" size={16} />
                  </button>
                )}
              </div>
            )}

            {searchable && (
              <div className={styles.searchWrap}>
                <Icon name="search" size={18} />
                <input
                  type="text"
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={e => handleSearchChange(e.target.value)}
                  placeholder={typeof searchable === 'object' && searchable.placeholder ? searchable.placeholder : 'Search...'}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={() => handleSearchChange('')}
                    aria-label="Clear search"
                  >
                    <Icon name="close" size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Bulk Actions Bar */}
      {selected && selected.size > 0 && bulkActions && bulkActions.length > 0 && (
        <div className={styles.bulkBar}>
          <div>
            <strong>{selected.size}</strong> {selected.size === 1 ? 'item selected' : 'items selected'}
          </div>
          <div className={styles.bulkActionsGroup}>
            {bulkActions.map(action => (
              <Button
                key={action.id}
                variant={action.tone === 'danger' ? 'tonal' : 'outlined'}
                size="sm"
                onClick={() => action.onClick(selected)}
              >
                {action.icon && <Icon name={action.icon} size={16} />}
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Main Table Scroll Wrap */}
      <div className={cn(styles.tableWrap, stickyHeader && styles.stickyHeader)}>
        <table className={styles.table} aria-label={ariaLabel}>
          <thead>
            <tr>
              {expandableRow && (
                <th className={cn(styles.th, styles.expandCell)} />
              )}
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
              {initialColumns.map((col, colIdx) => {
                const isSorted = activeSort?.columnId === col.id;
                const dir = isSorted ? activeSort!.direction : undefined;
                const ariaSort = isSorted
                  ? dir === 'asc' ? 'ascending' : 'descending'
                  : col.sortable ? 'none' : undefined;
                const widthStyle = columnWidths[col.id]
                  ? `${columnWidths[col.id]}px`
                  : col.width;
                const pinnedStyle = getPinnedStyle(col, colIdx);

                return (
                  <th
                    key={col.id}
                    scope="col"
                    aria-sort={ariaSort}
                    style={{
                      width: widthStyle,
                      textAlign: col.numeric ? 'right' : col.align,
                      ...pinnedStyle,
                    }}
                    className={cn(
                      styles.th,
                      col.numeric && styles.numeric,
                      col.pinned === 'left' && styles.pinnedLeft,
                      col.pinned === 'right' && styles.pinnedRight
                    )}
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

                    {/* Column Resizer Handle */}
                    {resizableColumns && (
                      <div
                        className={styles.resizer}
                        onMouseDown={e => handleResizeStart(e, col.id, columnWidths[col.id] || 120)}
                      />
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {(treeMode ? flatTreeRows.length === 0 : displayedRows.length === 0) ? (
              <tr>
                <td colSpan={totalColsSpan} className={styles.empty}>
                  {emptyState ?? 'No data available'}
                </td>
              </tr>
            ) : treeMode ? (
              /* Render Tree Rows */
              flatTreeRows.map(treeItem => {
                const { row, depth, key, hasChildren } = treeItem;
                const isSelected = !!selected?.has(key);
                const isExpanded = treeExpanded.has(key);

                return (
                  <tr
                    key={key}
                    className={cn(isSelected && styles.rowSelected)}
                    aria-selected={selected ? isSelected : undefined}
                  >
                    {expandableRow && <td className={styles.td} />}
                    {selected && (
                      <td className={cn(styles.td, styles.checkCell)}>
                        <Checkbox
                          aria-label={`Select row`}
                          checked={isSelected}
                          onChange={() => toggleRow(key)}
                        />
                      </td>
                    )}
                    {initialColumns.map((col, colIdx) => {
                      const isFirstCol = colIdx === 0;
                      const val = col.cell ? col.cell(row, 0) : defaultCell(row, col);
                      const pinnedStyle = getPinnedStyle(col, colIdx);

                      return (
                        <td
                          key={col.id}
                          className={cn(
                            styles.td,
                            col.numeric && styles.numeric,
                            col.pinned === 'left' && styles.pinnedLeft,
                            col.pinned === 'right' && styles.pinnedRight
                          )}
                          style={{
                            textAlign: col.numeric ? 'right' : col.align,
                            ...pinnedStyle,
                          }}
                        >
                          {isFirstCol ? (
                            <div className={styles.treeIndentCell}>
                              <span style={{ paddingLeft: `${depth * 18}px` }} />
                              {hasChildren ? (
                                <button
                                  type="button"
                                  className={cn(styles.iconBtn, isExpanded && styles.expandedIcon)}
                                  onClick={() => toggleTreeExpand(key)}
                                >
                                  <Icon name="chevron_right" size={16} />
                                </button>
                              ) : (
                                <span className={styles.treeSpacer} />
                              )}
                              <span>{val}</span>
                            </div>
                          ) : (
                            val
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              /* Standard & Expandable Rows */
              displayedRows.map((row, i) => {
                const key = allKeys[i];
                const isSelected = !!selected?.has(key);
                const isRowExpanded = activeExpanded.has(key);

                return (
                  <Fragment key={key}>
                    <tr
                      className={cn(isSelected && styles.rowSelected)}
                      aria-selected={selected ? isSelected : undefined}
                    >
                      {expandableRow && (
                        <td className={cn(styles.td, styles.expandCell)}>
                          <button
                            type="button"
                            className={cn(styles.iconBtn, isRowExpanded && styles.expandedIcon)}
                            onClick={() => toggleExpand(key)}
                            aria-label={isRowExpanded ? 'Collapse detail' : 'Expand detail'}
                          >
                            <Icon name="chevron_right" size={18} />
                          </button>
                        </td>
                      )}
                      {selected && (
                        <td className={cn(styles.td, styles.checkCell)}>
                          <Checkbox
                            aria-label={`Select row ${i + 1}`}
                            checked={isSelected}
                            onChange={() => toggleRow(key)}
                          />
                        </td>
                      )}
                      {initialColumns.map((col, colIdx) => {
                        const isEditing = editingCell?.key === key && editingCell?.colId === col.id;
                        const rawVal = (row as Record<string, unknown>)[col.id];
                        const cellVal = col.cell ? col.cell(row, i) : defaultCell(row, col);
                        const pinnedStyle = getPinnedStyle(col, colIdx);
                        const widthStyle = columnWidths[col.id]
                          ? `${columnWidths[col.id]}px`
                          : col.width;

                        return (
                          <td
                            key={col.id}
                            className={cn(
                              styles.td,
                              col.numeric && styles.numeric,
                              col.pinned === 'left' && styles.pinnedLeft,
                              col.pinned === 'right' && styles.pinnedRight,
                              col.editable && styles.editableCell
                            )}
                            style={{
                              width: widthStyle,
                              textAlign: col.numeric ? 'right' : col.align,
                              ...pinnedStyle,
                            }}
                            onDoubleClick={() => col.editable && startCellEdit(key, col.id, rawVal)}
                          >
                            {isEditing ? (
                              <input
                                type="text"
                                className={styles.editInput}
                                value={editingCell.value}
                                onChange={e => setEditingCell({ ...editingCell, value: e.target.value })}
                                onBlur={() => commitCellEdit(row, col.id)}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') commitCellEdit(row, col.id);
                                  if (e.key === 'Escape') setEditingCell(null);
                                }}
                                autoFocus
                              />
                            ) : (
                              cellVal
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Expanded Detail Row */}
                    {expandableRow && isRowExpanded && (
                      <tr className={styles.detailRow}>
                        <td colSpan={totalColsSpan}>
                          {expandableRow.renderDetail(row, i)}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Built-in Pagination Footer */}
      {pagination && (
        <div className={styles.paginationBar}>
          <div className={styles.paginationInfo}>
            <span>
              Showing {displayedRows.length > 0 ? (pagination.page - 1) * pagination.pageSize + 1 : 0} –{' '}
              {Math.min(pagination.page * pagination.pageSize, totalRowsCount)} of {totalRowsCount} items
            </span>
            {pagination.onPageSizeChange && (
              <label className={styles.pageSizeSelect}>
                Rows per page:
                <select
                  value={pagination.pageSize}
                  onChange={e => pagination.onPageSizeChange?.(Number(e.target.value))}
                >
                  {(pagination.pageSizeOptions ?? [5, 10, 20, 50]).map(sz => (
                    <option key={sz} value={sz}>
                      {sz}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
          {pageCount > 1 && (
            <Pagination
              page={pagination.page}
              pageCount={pageCount}
              onChange={pagination.onPageChange}
            />
          )}
        </div>
      )}
    </div>
  );
}


