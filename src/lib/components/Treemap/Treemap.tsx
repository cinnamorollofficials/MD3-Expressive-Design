import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { cn } from '../../utils/cn';
import styles from './Treemap.module.css';

export interface TreemapNode {
  name: string;
  value?: number;
  category?: string;
  children?: TreemapNode[];
  color?: string;
  [key: string]: any;
}

export type TreemapTilingMethod =
  | 'squarify'
  | 'binary'
  | 'dice'
  | 'slice'
  | 'sliceDice'
  | 'resquarify';

export interface TreemapProps {
  /** Hierarchical root data object */
  data: TreemapNode;
  /** Tiling layout algorithm: 'squarify' | 'binary' | 'dice' | 'slice' | 'sliceDice' | 'resquarify' */
  tilingMethod?: TreemapTilingMethod;
  /** Inner padding between treemap rectangles in pixels (default 2) */
  paddingInner?: number;
  /** Outer padding around parent treemap containers (default 2) */
  paddingOuter?: number;
  /** Chart height in pixels (default 580) */
  height?: number;
  /** Whether to render tiling method select control dropdown */
  showControls?: boolean;
  /** Whether to render top category legend items */
  showLegend?: boolean;
  /** Main chart title */
  title?: string;
  /** Subtitle description */
  subtitle?: string;
  /** Custom value formatter */
  valueFormatter?: (val: number) => string;
  /** Whether interactive hover tooltips and highlights are enabled */
  interactive?: boolean;
  /** Callback when a treemap leaf node is clicked */
  onNodeClick?: (node: d3.HierarchyRectangularNode<TreemapNode>) => void;
  /** Additional CSS class name */
  className?: string;
}

export function Treemap({
  data,
  tilingMethod: tilingMethodProp = 'binary',
  paddingInner = 2,
  paddingOuter = 2,
  height = 580,
  showControls = true,
  showLegend = true,
  title,
  subtitle,
  valueFormatter,
  interactive = true,
  onNodeClick,
  className,
}: TreemapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const [tilingMethod, setTilingMethod] = useState<TreemapTilingMethod>(tilingMethodProp);

  const [hoveredNode, setHoveredNode] =
    useState<d3.HierarchyRectangularNode<TreemapNode> | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Sync tilingMethod prop
  useEffect(() => {
    if (tilingMethodProp !== undefined) setTilingMethod(tilingMethodProp);
  }, [tilingMethodProp]);

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

  // Map tiling method string to D3 tile function
  const getTileFunction = useCallback((method: TreemapTilingMethod) => {
    switch (method) {
      case 'binary':
        return d3.treemapBinary;
      case 'dice':
        return d3.treemapDice;
      case 'slice':
        return d3.treemapSlice;
      case 'sliceDice':
        return d3.treemapSliceDice;
      case 'resquarify':
        return d3.treemapResquarify;
      case 'squarify':
      default:
        return d3.treemapSquarify;
    }
  }, []);

  const margin = { top: 12, right: 12, bottom: 12, left: 12 };
  const innerWidth = Math.max(100, containerWidth - margin.left - margin.right);
  const innerHeight = Math.max(100, height - margin.top - margin.bottom);

  // Derive categories and category color scale
  const { categories, colorScale } = useMemo(() => {
    if (!data || !data.children)
      return { categories: [], colorScale: d3.scaleOrdinal<string, string>() };

    const cats = data.children.map((c) => c.category || c.name);
    const scale = d3
      .scaleOrdinal<string, string>()
      .domain(cats)
      .range(d3.schemeTableau10);

    return { categories: cats, colorScale: scale };
  }, [data]);

  // Compute D3 Hierarchy & Treemap layout
  const { rootNode, leaves } = useMemo(() => {
    if (!data) return { rootNode: null, leaves: [] };

    // Build hierarchy and sum node values
    const hierarchy = d3
      .hierarchy<TreemapNode>(data)
      .sum((d) => (d.children ? 0 : d.value || 1))
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    // Construct treemap layout generator
    const treemapLayout = d3
      .treemap<TreemapNode>()
      .tile(getTileFunction(tilingMethod))
      .size([innerWidth, innerHeight])
      .paddingInner(paddingInner)
      .paddingOuter(paddingOuter);

    const root = treemapLayout(hierarchy);
    const leafNodes = root.leaves() as d3.HierarchyRectangularNode<TreemapNode>[];

    return { rootNode: root, leaves: leafNodes };
  }, [data, tilingMethod, getTileFunction, innerWidth, innerHeight, paddingInner, paddingOuter]);

  // Helper to determine node color
  const getNodeColor = useCallback(
    (node: d3.HierarchyRectangularNode<TreemapNode>): string => {
      if (node.data.color) return node.data.color;
      // Get category from top-level parent under root
      const categoryNode = node.ancestors().find((n) => n.depth === 1);
      const catName = categoryNode?.data.category || categoryNode?.data.name || node.data.name;
      return colorScale(catName);
    },
    [colorScale]
  );

  // Helper to get full ancestor path for tooltip
  const getNodePath = useCallback(
    (node: d3.HierarchyRectangularNode<TreemapNode>): string => {
      return node
        .ancestors()
        .map((n) => n.data.name)
        .reverse()
        .join('.');
    },
    []
  );

  const fmtVal = useCallback(
    (v: number) => (valueFormatter ? valueFormatter(v) : d3.format(',.0f')(v)),
    [valueFormatter]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!interactive || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    },
    [interactive]
  );

  const tilingOptions: { value: TreemapTilingMethod; label: string }[] = [
    { value: 'binary', label: 'binary' },
    { value: 'squarify', label: 'squarify' },
    { value: 'dice', label: 'dice' },
    { value: 'slice', label: 'slice' },
    { value: 'sliceDice', label: 'sliceDice' },
    { value: 'resquarify', label: 'resquarify' },
  ];

  return (
    <div className={cn(styles.root, className)} ref={containerRef} data-md3-component="treemap">
      {/* Header */}
      {(title || subtitle) && (
        <div className={styles.header}>
          <div className={styles.headerText}>
            {title && <h4 className={styles.title}>{title}</h4>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>
      )}

      {/* Controls Bar (Tiling Method Dropdown matching D3 reference image) */}
      {showControls && (
        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Tiling method:</span>
            <select
              className={styles.select}
              value={tilingMethod}
              onChange={(e) => setTilingMethod(e.target.value as TreemapTilingMethod)}
            >
              {tilingOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Category Legend Swatches */}
      {showLegend && categories.length > 0 && (
        <div className={styles.legend}>
          {categories.map((cat) => (
            <div key={cat} className={styles.legendItem}>
              <div
                className={styles.legendSwatch}
                style={{ backgroundColor: colorScale(cat) }}
              />
              <span>{cat}</span>
            </div>
          ))}
        </div>
      )}

      {/* Main Treemap SVG Container */}
      <div
        className={styles.chartContainer}
        style={{ height }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setHoveredNode(null);
          setMousePos(null);
        }}
      >
        <svg className={styles.svg} width={containerWidth} height={height}>
          {rootNode && (
            <g transform={`translate(${margin.left}, ${margin.top})`}>
              {leaves.map((leaf, idx) => {
                const w = Math.max(0, leaf.x1 - leaf.x0);
                const h = Math.max(0, leaf.y1 - leaf.y0);
                const isHovered = hoveredNode === leaf;
                const fillColor = getNodeColor(leaf);

                // Determine if box is big enough for label text
                const showLabel = w > 36 && h > 18;
                const showValue = w > 48 && h > 30;

                return (
                  <g
                    key={idx}
                    transform={`translate(${leaf.x0}, ${leaf.y0})`}
                    onMouseEnter={() => interactive && setHoveredNode(leaf)}
                    onMouseLeave={() => interactive && setHoveredNode(null)}
                    onClick={() => onNodeClick?.(leaf)}
                  >
                    <rect
                      className={cn(
                        styles.nodeRect,
                        hoveredNode && !isHovered && styles.nodeDimmed
                      )}
                      width={w}
                      height={h}
                      fill={fillColor}
                    />

                    {showLabel && (
                      <text
                        className={styles.nodeLabelText}
                        x={4}
                        y={13}
                        clipPath={`rect(0px, ${w - 4}px, ${h - 2}px, 0px)`}
                      >
                        {leaf.data.name}
                      </text>
                    )}

                    {showValue && (
                      <text
                        className={styles.nodeValueText}
                        x={4}
                        y={25}
                        clipPath={`rect(0px, ${w - 4}px, ${h - 2}px, 0px)`}
                      >
                        {fmtVal(leaf.value || 0)}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          )}
        </svg>

        {/* Hover Tooltip (Matching D3 reference popup style) */}
        {interactive && hoveredNode && mousePos && (
          <div
            className={styles.tooltip}
            style={{
              left: Math.min(containerWidth - 170, Math.max(170, mousePos.x)),
              top: Math.max(48, mousePos.y - 12),
            }}
          >
            <div className={styles.tooltipPath}>{getNodePath(hoveredNode)}</div>
            <div className={styles.tooltipValue}>{fmtVal(hoveredNode.value || 0)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
