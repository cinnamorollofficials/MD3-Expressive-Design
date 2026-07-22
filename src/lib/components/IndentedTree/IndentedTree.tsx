import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { cn } from '../../utils/cn';
import styles from './IndentedTree.module.css';

export interface IndentedTreeNode {
  name: string;
  value?: number;
  count?: number;
  children?: IndentedTreeNode[];
  [key: string]: any;
}

export interface IndentedTreeProps {
  /** Hierarchical root data object */
  data: IndentedTreeNode;
  /** Pixel indentation per tree depth level (default 24) */
  indentStep?: number;
  /** Pixel height per row (default 24) */
  rowHeight?: number;
  /** Main chart title */
  title?: string;
  /** Subtitle description */
  subtitle?: string;
  /** Column header 1 label (default 'Size') */
  col1Label?: string;
  /** Column header 2 label (default 'Count') */
  col2Label?: string;
  /** Custom value (Size) formatter */
  valueFormatter?: (val: number) => string;
  /** Custom count formatter */
  countFormatter?: (val?: number) => string;
  /** Initial max depth to expand (nodes deeper start collapsed) */
  initialExpandDepth?: number;
  /** Whether interactive hover tooltips and node expand/collapse are enabled */
  interactive?: boolean;
  /** Callback when a tree node is clicked */
  onNodeClick?: (node: d3.HierarchyNode<IndentedTreeNode>) => void;
  /** Additional CSS class name */
  className?: string;
}

interface RenderNode {
  node: d3.HierarchyNode<IndentedTreeNode>;
  index: number;
  x: number;
  y: number;
  isParent: boolean;
  isCollapsed: boolean;
  value: number;
  leafCount: number;
}

export function IndentedTree({
  data,
  indentStep = 24,
  rowHeight = 24,
  title,
  subtitle,
  col1Label = 'Size',
  col2Label = 'Count',
  valueFormatter,
  countFormatter,
  initialExpandDepth = 3,
  interactive = true,
  onNodeClick,
  className,
}: IndentedTreeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(700);

  // Set of collapsed node IDs (using node unique path or name)
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());
  const [hoveredNode, setHoveredNode] = useState<RenderNode | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Observe container width
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries.length > 0) {
        const { width } = entries[0].contentRect;
        if (width > 0) setContainerWidth(width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Compute D3 Hierarchy & calculate values / leaf counts
  const rootHierarchy = useMemo(() => {
    if (!data) return null;
    const root = d3.hierarchy<IndentedTreeNode>(data);

    // Calculate sum of values and count of leaves
    root.sum((d) => (d.children ? 0 : d.value || 1));
    root.each((node) => {
      const leaves = node.leaves();
      (node as any).leafCount = node.children ? leaves.length : undefined;
    });

    return root;
  }, [data]);

  // Unique identifier for a node
  const getNodeKey = useCallback((node: d3.HierarchyNode<IndentedTreeNode>): string => {
    return node
      .ancestors()
      .map((n) => n.data.name)
      .reverse()
      .join('.');
  }, []);

  // Set initial collapsed state for nodes deeper than initialExpandDepth
  useEffect(() => {
    if (!rootHierarchy) return;
    const initialCollapsed = new Set<string>();
    rootHierarchy.each((node) => {
      if (node.depth >= initialExpandDepth && node.children && node.children.length > 0) {
        initialCollapsed.add(getNodeKey(node));
      }
    });
    setCollapsedNodes(initialCollapsed);
  }, [rootHierarchy, initialExpandDepth, getNodeKey]);

  // Toggle node collapse / expand
  const toggleCollapse = useCallback(
    (node: d3.HierarchyNode<IndentedTreeNode>) => {
      if (!node.children || node.children.length === 0) return;
      const key = getNodeKey(node);
      setCollapsedNodes((prev) => {
        const next = new Set(prev);
        if (next.has(key)) {
          next.delete(key);
        } else {
          next.add(key);
        }
        return next;
      });
    },
    [getNodeKey]
  );

  // Traverse tree to get visible node rows & connector lines
  const { visibleNodes, links, totalHeight } = useMemo(() => {
    if (!rootHierarchy) return { visibleNodes: [], links: [], totalHeight: 0 };

    const visible: RenderNode[] = [];
    const linkLines: { id: string; d: string }[] = [];
    let currentIndex = 0;

    const parentPosMap = new Map<string, { x: number; y: number }>();

    function traverse(node: d3.HierarchyNode<IndentedTreeNode>) {
      const key = getNodeKey(node);
      const isParent = Boolean(node.children && node.children.length > 0);
      const isCollapsed = collapsedNodes.has(key);

      const x = 16 + node.depth * indentStep;
      const y = 28 + currentIndex * rowHeight; // Header offset + row height

      const renderNodeItem: RenderNode = {
        node,
        index: currentIndex,
        x,
        y,
        isParent,
        isCollapsed,
        value: node.value || 0,
        leafCount: (node as any).leafCount,
      };

      visible.push(renderNodeItem);
      parentPosMap.set(key, { x, y });

      // Draw orthogonal connector lines to parent
      if (node.parent) {
        const parentKey = getNodeKey(node.parent);
        const parentPos = parentPosMap.get(parentKey);
        if (parentPos) {
          // Vertical line down from parent dot to node's y-level, then horizontal line to node dot
          const lineD = `M ${parentPos.x} ${parentPos.y} V ${y} H ${x}`;
          linkLines.push({ id: `${parentKey}->${key}`, d: lineD });
        }
      }

      currentIndex++;

      // If parent and not collapsed, recursively traverse children
      if (isParent && !isCollapsed && node.children) {
        node.children.forEach((child) => traverse(child));
      }
    }

    traverse(rootHierarchy);

    const calculatedHeight = 40 + currentIndex * rowHeight;
    return { visibleNodes: visible, links: linkLines, totalHeight: calculatedHeight };
  }, [rootHierarchy, collapsedNodes, getNodeKey, indentStep, rowHeight]);

  const fmtVal = useCallback(
    (v: number) => (valueFormatter ? valueFormatter(v) : d3.format(',.0f')(v)),
    [valueFormatter]
  );
  const fmtCnt = useCallback(
    (v?: number) => (v === undefined ? '-' : countFormatter ? countFormatter(v) : d3.format(',.0f')(v)),
    [countFormatter]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!interactive || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    },
    [interactive]
  );

  // Column X Positions (Right Aligned matching reference image)
  const colSizeX = Math.max(300, containerWidth - 170);
  const colCountX = Math.max(400, containerWidth - 60);

  return (
    <div className={cn(styles.root, className)} ref={containerRef} data-md3-component="indented-tree">
      {/* Header */}
      {(title || subtitle) && (
        <div className={styles.header}>
          <div className={styles.headerText}>
            {title && <h4 className={styles.title}>{title}</h4>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>
      )}

      {/* Chart Canvas */}
      <div
        className={styles.chartContainer}
        style={{ minHeight: totalHeight }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setHoveredNode(null);
          setMousePos(null);
        }}
      >
        <svg className={styles.svg} width={containerWidth} height={totalHeight}>
          {/* Table Headers (Size, Count) */}
          <text className={styles.columnHeader} x={colSizeX} y={16} textAnchor="end">
            {col1Label}
          </text>
          <text className={styles.columnHeader} x={colCountX} y={16} textAnchor="end">
            {col2Label}
          </text>

          {/* Orthogonal Connecting Link Lines */}
          <g className="links-layer">
            {links.map((link) => (
              <path key={link.id} className={styles.linkLine} d={link.d} />
            ))}
          </g>

          {/* Visible Tree Node Rows */}
          <g className="nodes-layer">
            {visibleNodes.map((item) => {
              const { node, x, y, isParent, value, leafCount } = item;

              return (
                <g
                  key={getNodeKey(node)}
                  className={styles.nodeRow}
                  transform={`translate(0, 0)`}
                  onMouseEnter={() => interactive && setHoveredNode(item)}
                  onMouseLeave={() => interactive && setHoveredNode(null)}
                  onClick={() => {
                    if (interactive && isParent) toggleCollapse(node);
                    onNodeClick?.(node);
                  }}
                >
                  {/* Row Hover Background Rect */}
                  <rect
                    className={styles.rowBg}
                    x={0}
                    y={y - rowHeight / 2}
                    width={containerWidth}
                    height={rowHeight}
                  />

                  {/* Bullet Dot */}
                  <circle
                    className={isParent ? styles.parentDot : styles.leafDot}
                    cx={x}
                    cy={y}
                    r={isParent ? 4 : 3}
                  />

                  {/* Node Name Label */}
                  <text
                    className={cn(styles.nodeText, isParent && styles.parentText)}
                    x={x + 10}
                    y={y + 4}
                  >
                    {node.data.name}
                  </text>

                  {/* Column 1: Size (Right Aligned) */}
                  <text
                    className={cn(styles.colText, isParent && styles.parentColText)}
                    x={colSizeX}
                    y={y + 4}
                    textAnchor="end"
                  >
                    {fmtVal(value)}
                  </text>

                  {/* Column 2: Count (Right Aligned or '-' Dash) */}
                  <text
                    className={cn(
                      styles.colText,
                      isParent && styles.parentColText,
                      leafCount === undefined && styles.emptyDash
                    )}
                    x={colCountX}
                    y={y + 4}
                    textAnchor="end"
                  >
                    {fmtCnt(leafCount)}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Hover Tooltip */}
        {interactive && hoveredNode && mousePos && (
          <div
            className={styles.tooltip}
            style={{
              left: Math.min(containerWidth - 160, Math.max(160, mousePos.x)),
              top: Math.max(48, mousePos.y - 12),
            }}
          >
            <div className={styles.tooltipTitle}>{getNodeKey(hoveredNode.node)}</div>
            <div className={styles.tooltipRow}>
              <span>{col1Label}:</span>
              <span className={styles.tooltipValue}>{fmtVal(hoveredNode.value)}</span>
            </div>
            {hoveredNode.isParent && (
              <div className={styles.tooltipRow}>
                <span>{col2Label}:</span>
                <span className={styles.tooltipValue}>{fmtCnt(hoveredNode.leafCount)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
