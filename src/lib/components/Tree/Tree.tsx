import { ReactNode, useCallback, useMemo, useState } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../Icon';
import styles from './Tree.module.css';

export interface TreeNode {
  id: string;
  label: ReactNode;
  icon?: string;
  /** Children. Leaves omit this. */
  children?: TreeNode[];
  /** Disabled nodes can't be selected; their children remain navigable. */
  disabled?: boolean;
}

export interface TreeProps {
  nodes: TreeNode[];

  /** Expanded node ids. Uncontrolled when omitted. */
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (ids: string[]) => void;

  /** Selected node id. Uncontrolled when omitted. */
  selected?: string | null;
  defaultSelected?: string | null;
  onSelect?: (id: string, node: TreeNode) => void;

  /** Show a leading icon for branches (folder by default). */
  branchIcon?: string;
  /** Show a leading icon for leaves. */
  leafIcon?: string;

  className?: string;
  /** Accessible name announced as the tree's label. */
  ariaLabel?: string;
}

/**
 * Material 3 Tree — disclosure-style hierarchical list. Uses the
 * `tree` / `treeitem` / `group` ARIA roles so assistive tech sees the
 * structure, with click-and-keyboard expansion via the chevron.
 */
export function Tree({
  nodes,
  expanded,
  defaultExpanded,
  onExpandedChange,
  selected,
  defaultSelected = null,
  onSelect,
  branchIcon = 'folder',
  leafIcon,
  className,
  ariaLabel,
}: TreeProps) {
  const controlledExpanded = expanded !== undefined;
  const [internalExpanded, setInternalExpanded] = useState<string[]>(defaultExpanded ?? []);
  const activeExpanded = controlledExpanded ? expanded! : internalExpanded;

  const controlledSelected = selected !== undefined;
  const [internalSelected, setInternalSelected] = useState<string | null>(defaultSelected);
  const activeSelected = controlledSelected ? selected ?? null : internalSelected;

  const setExpanded = useCallback(
    (next: string[]) => {
      if (!controlledExpanded) setInternalExpanded(next);
      onExpandedChange?.(next);
    },
    [controlledExpanded, onExpandedChange],
  );

  const toggle = (id: string) => {
    setExpanded(
      activeExpanded.includes(id)
        ? activeExpanded.filter(x => x !== id)
        : [...activeExpanded, id],
    );
  };

  const select = (node: TreeNode) => {
    if (node.disabled) return;
    if (!controlledSelected) setInternalSelected(node.id);
    onSelect?.(node.id, node);
  };

  const renderNode = (node: TreeNode, depth: number): ReactNode => {
    const isBranch = !!node.children?.length;
    const isOpen = isBranch && activeExpanded.includes(node.id);
    const isSelected = activeSelected === node.id;
    const icon = node.icon ?? (isBranch ? branchIcon : leafIcon);
    return (
      <li
        key={node.id}
        role="treeitem"
        aria-expanded={isBranch ? isOpen : undefined}
        aria-selected={isSelected}
        aria-disabled={node.disabled || undefined}
      >
        <div
          className={cn(
            styles.row,
            isSelected && styles.selected,
            node.disabled && styles.disabled,
          )}
          style={{ paddingLeft: 8 + depth * 16 }}
          onClick={() => select(node)}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              select(node);
            } else if (isBranch && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
              const open = e.key === 'ArrowRight';
              if (open !== isOpen) toggle(node.id);
            }
          }}
          tabIndex={node.disabled ? -1 : 0}
          role="presentation"
        >
          {isBranch ? (
            <button
              type="button"
              className={cn(styles.toggle, isOpen && styles.toggleOpen)}
              onClick={e => {
                e.stopPropagation();
                toggle(node.id);
              }}
              aria-label={isOpen ? 'Collapse' : 'Expand'}
              tabIndex={-1}
            >
              <Icon name="chevron_right" size={18} />
            </button>
          ) : (
            <span className={styles.toggleSpacer} aria-hidden="true" />
          )}
          {icon && (
            <span className={styles.icon} aria-hidden="true">
              <Icon name={icon} size={18} />
            </span>
          )}
          <span className={styles.label}>{node.label}</span>
        </div>
        {isBranch && isOpen && (
          <ul role="group" className={styles.group}>
            {node.children!.map(child => renderNode(child, depth + 1))}
          </ul>
        )}
      </li>
    );
  };

  const rendered = useMemo(() => nodes.map(n => renderNode(n, 0)), [
    nodes, activeExpanded, activeSelected,
  ]);

  return (
    <ul role="tree" aria-label={ariaLabel} className={cn(styles.root, className)}>
      {rendered}
    </ul>
  );
}
