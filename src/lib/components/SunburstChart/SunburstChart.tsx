import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { cn } from '../../utils/cn';
import styles from './SunburstChart.module.css';

export interface SunburstNode {
  name: string;
  value?: number;
  category?: string;
  color?: string;
  children?: SunburstNode[];
  [key: string]: any;
}

export interface SunburstChartProps {
  /** Hierarchical root data object */
  data: SunburstNode;
  /** Outer radius of sunburst in pixels (default 420) */
  radius?: number;
  /** Chart height in pixels (default 850) */
  height?: number;
  /** Main chart title */
  title?: string;
  /** Subtitle description */
  subtitle?: string;
  /** Custom value formatter */
  valueFormatter?: (val: number) => string;
  /** Whether interactive hover tooltips and arc highlights are enabled */
  interactive?: boolean;
  /** Callback when a sunburst arc is clicked */
  onNodeClick?: (node: d3.HierarchyRectangularNode<SunburstNode>) => void;
  /** Additional CSS class name */
  className?: string;
}

export function SunburstChart({
  data,
  height = 880,
  title,
  subtitle,
  valueFormatter,
  interactive = true,
  onNodeClick,
  className,
}: SunburstChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(850);

  // Zoomed node state (default top root)
  const [focusNode, setFocusNode] =
    useState<d3.HierarchyRectangularNode<SunburstNode> | null>(null);
  const [hoveredNode, setHoveredNode] =
    useState<d3.HierarchyRectangularNode<SunburstNode> | null>(null);
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

  const size = Math.min(containerWidth, height);
  const maxRadius = Math.max(100, size / 2 - 40);

  // Compute D3 Partition Hierarchy
  const { rootPartition, arcGenerator, colorScale } = useMemo(() => {
    if (!data) return { rootPartition: null, arcGenerator: null, colorScale: d3.scaleOrdinal<string, string>() };

    const hierarchy = d3
      .hierarchy<SunburstNode>(data)
      .sum((d) => (d.children ? 0 : d.value || 1))
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    // Construct D3 Partition Layout generator (angle 0 to 2*PI, radius 0 to maxRadius)
    const partitionLayout = d3
      .partition<SunburstNode>()
      .size([2 * Math.PI, maxRadius]);

    const root = partitionLayout(hierarchy) as d3.HierarchyRectangularNode<SunburstNode>;

    // Color scale per category / top-level branch
    const topCats = (data.children || []).map((c) => c.category || c.name);
    const scale = d3
      .scaleOrdinal<string, string>()
      .domain(topCats)
      .range(d3.schemeTableau10);

    // Arc Path Generator
    const arcGen = d3
      .arc<any, d3.HierarchyRectangularNode<SunburstNode>>()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(maxRadius / 2)
      .innerRadius((d) => d.y0)
      .outerRadius((d) => Math.max(d.y0, d.y1 - 1));

    return { rootPartition: root, arcGenerator: arcGen, colorScale: scale };
  }, [data, maxRadius]);

  // Sync focusNode default to rootPartition
  useEffect(() => {
    if (rootPartition) setFocusNode(rootPartition);
  }, [rootPartition]);

  // Color calculation for nodes
  const getNodeColor = useCallback(
    (node: d3.HierarchyRectangularNode<SunburstNode>): string => {
      if (node.depth === 0) return 'var(--md-sys-color-surface-container-high, #E5E5E5)';
      if (node.data.color) return node.data.color;

      const topCategory = node.ancestors().find((n) => n.depth === 1);
      const catName = topCategory?.data.category || topCategory?.data.name || node.data.name;
      const baseColor = colorScale(catName);

      // Lighten slightly based on depth
      const hsl = d3.hsl(baseColor);
      hsl.l = Math.min(0.85, hsl.l + (node.depth - 1) * 0.06);
      return String(hsl);
    },

    [colorScale]
  );

  const getNodePath = useCallback(
    (node: d3.HierarchyRectangularNode<SunburstNode>): string => {
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

  // All descendant nodes excluding the root itself
  const allArcs = useMemo(() => {
    if (!rootPartition) return [];
    return rootPartition.descendants().filter((d) => d.depth > 0);
  }, [rootPartition]);

  return (
    <div className={cn(styles.root, className)} ref={containerRef} data-md3-component="sunburst-chart">
      {/* Header */}
      {(title || subtitle) && (
        <div className={styles.header}>
          <div className={styles.headerText}>
            {title && <h4 className={styles.title}>{title}</h4>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>
      )}

      {/* Main Sunburst SVG Canvas */}
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
          {rootPartition && (
            <g transform={`translate(${containerWidth / 2}, ${height / 2})`}>
              {/* Concentric Arc Partition Slices Layer */}
              <g className="arcs-layer">
                {allArcs.map((node, idx) => {
                  const pathD = arcGenerator ? arcGenerator(node) : null;
                  if (!pathD) return null;

                  const isHovered = hoveredNode === node;
                  const isAncestor = hoveredNode
                    ? hoveredNode.ancestors().includes(node)
                    : false;

                  const fillColor = getNodeColor(node);

                  // Calculate radial text transformation
                  const angleMid = (node.x0 + node.x1) / 2;
                  const angleDeg = (angleMid * 180) / Math.PI - 90;
                  const radiusMid = (node.y0 + node.y1) / 2;
                  const isFlipped = angleMid > Math.PI;

                  // Label display criteria: sufficient arc angle & radial width
                  const angleSpan = node.x1 - node.x0;
                  const radialSpan = node.y1 - node.y0;
                  const showLabel = angleSpan > 0.05 && radialSpan > 14;

                  return (
                    <g key={idx}>
                      <path
                        className={cn(
                          styles.arcPath,
                          hoveredNode && !isHovered && !isAncestor && styles.arcDimmed
                        )}
                        d={pathD}
                        fill={fillColor}
                        onMouseEnter={() => interactive && setHoveredNode(node)}
                        onMouseLeave={() => interactive && setHoveredNode(null)}
                        onClick={() => {
                          setFocusNode(node);
                          onNodeClick?.(node);
                        }}
                      />

                      {showLabel && (
                        <text
                          className={styles.arcText}
                          transform={`rotate(${angleDeg}) translate(${radiusMid},0) rotate(${isFlipped ? 180 : 0})`}
                        >
                          {node.data.name}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>

              {/* Center Circle (Zoom Reset Button) */}
              <circle
                className={styles.centerCircle}
                r={rootPartition.y1 || 40}
                onClick={() => setFocusNode(rootPartition)}
              />
              <text className={styles.centerText} y={4}>
                {focusNode && focusNode !== rootPartition ? focusNode.data.name : rootPartition.data.name}
              </text>
            </g>
          )}
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
            <div className={styles.tooltipTitle}>{getNodePath(hoveredNode)}</div>
            <div className={styles.tooltipRow}>
              <span>Value:</span>
              <span className={styles.tooltipValue}>{fmtVal(hoveredNode.value || 0)}</span>
            </div>
            <div className={styles.tooltipRow}>
              <span>Depth:</span>
              <span className={styles.tooltipValue}>{hoveredNode.depth}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
