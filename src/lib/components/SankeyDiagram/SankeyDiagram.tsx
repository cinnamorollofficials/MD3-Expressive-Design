import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import {
  sankey as d3Sankey,
  sankeyLinkHorizontal,
  sankeyLeft,
  sankeyRight,
  sankeyCenter,
  sankeyJustify,
} from 'd3-sankey';
import { cn } from '../../utils/cn';
import styles from './SankeyDiagram.module.css';

export interface SankeyNodeData {
  id?: string | number;
  name: string;
  category?: string;
  color?: string;
  [key: string]: any;
}

export interface SankeyLinkData {
  source: string | number;
  target: string | number;
  value: number;
  color?: string;
  [key: string]: any;
}

export interface SankeyDiagramProps {
  /** Array of node objects */
  nodes: SankeyNodeData[];
  /** Array of link flow objects connecting nodes */
  links: SankeyLinkData[];
  /** Chart height in pixels. Width is responsive. */
  height?: number;
  /** Width of node rectangles in pixels */
  nodeWidth?: number;
  /** Vertical padding between node rectangles */
  nodePadding?: number;
  /** Node alignment mode */
  nodeAlign?: 'justify' | 'left' | 'right' | 'center';
  /** Color mode for link flow ribbons */
  linkColorMode?: 'gradient' | 'source' | 'target' | 'static';
  /** Color palette for nodes */
  colors?: string[];
  /** Show text labels on nodes */
  showLabels?: boolean;
  /** Enable vertical node dragging */
  draggable?: boolean;
  /** Enable hover tooltips and flow highlighting */
  interactive?: boolean;
  /** Main chart title */
  title?: string;
  /** Subtitle description */
  subtitle?: string;
  /** Custom value formatter */
  valueFormatter?: (val: number) => string;
  /** Callback triggered when a node is clicked */
  onNodeClick?: (node: any) => void;
  /** Callback triggered when a link ribbon is clicked */
  onLinkClick?: (link: any) => void;
  /** Additional CSS class name */
  className?: string;
}

const DEFAULT_COLORS = [
  'var(--md-sys-color-primary, #6750A4)',
  'var(--md-sys-color-tertiary, #7D5260)',
  'var(--md-sys-color-secondary, #625B71)',
  '#006A6A',
  '#835400',
  '#4A6267',
  '#705D00',
  '#3B6470',
  '#824D68',
  '#2E7D32',
  '#EF6C00',
  '#0277BD',
  '#C2185B',
  '#616161',
];

export function SankeyDiagram({
  nodes = [],
  links = [],
  height = 540,
  nodeWidth = 16,
  nodePadding = 12,
  nodeAlign = 'justify',
  linkColorMode = 'gradient',
  colors = DEFAULT_COLORS,
  showLabels = true,
  draggable = true,
  interactive = true,
  title,
  subtitle,
  valueFormatter,
  onNodeClick,
  onLinkClick,
  className,
}: SankeyDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [containerWidth, setContainerWidth] = useState(700);
  const [currentAlign, setCurrentAlign] = useState<'justify' | 'left' | 'right' | 'center'>(nodeAlign);

  const [hoveredNode, setHoveredNode] = useState<any | null>(null);
  const [hoveredLink, setHoveredLink] = useState<any | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [draggedY, setDraggedY] = useState<Record<string | number, number>>({});

  // Observe width
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

  const margin = { top: 20, right: 120, bottom: 20, left: 120 };
  const innerWidth = Math.max(100, containerWidth - margin.left - margin.right);
  const innerHeight = Math.max(100, height - margin.top - margin.bottom);

  // Map nodes to ensure index matching
  const preparedNodes = useMemo(() => {
    return nodes.map((n, i) => ({
      ...n,
      index: i,
      id: n.id !== undefined ? n.id : n.name || i,
    }));
  }, [nodes]);

  const preparedLinks = useMemo(() => {
    const nodeMap = new Map<string | number, number>();
    preparedNodes.forEach((n, i) => {
      nodeMap.set(i, i);
      if (n.id !== undefined) nodeMap.set(n.id, i);
      if (n.name) nodeMap.set(n.name, i);
    });

    return links.map((l) => {
      const sIndex = typeof l.source === 'number' && l.source < preparedNodes.length ? l.source : nodeMap.get(l.source);
      const tIndex = typeof l.target === 'number' && l.target < preparedNodes.length ? l.target : nodeMap.get(l.target);
      return {
        ...l,
        source: sIndex !== undefined ? sIndex : 0,
        target: tIndex !== undefined ? tIndex : 0,
        value: Number(l.value) || 1,
      };
    });
  }, [links, preparedNodes]);

  // Compute Sankey Layout using d3-sankey
  const layout = useMemo(() => {
    if (containerWidth <= 0 || height <= 0 || preparedNodes.length === 0) return null;

    const sankeyGenerator = d3Sankey<any, any>()
      .nodeWidth(nodeWidth)
      .nodePadding(nodePadding)
      .extent([
        [margin.left, margin.top],
        [containerWidth - margin.right, height - margin.bottom],
      ]);

    if (currentAlign === 'left') sankeyGenerator.nodeAlign(sankeyLeft);
    else if (currentAlign === 'right') sankeyGenerator.nodeAlign(sankeyRight);
    else if (currentAlign === 'center') sankeyGenerator.nodeAlign(sankeyCenter);
    else sankeyGenerator.nodeAlign(sankeyJustify);

    const graphNodes = preparedNodes.map((d) => ({ ...d }));
    const graphLinks = preparedLinks.map((d) => ({ ...d }));

    try {
      const result = sankeyGenerator({
        nodes: graphNodes,
        links: graphLinks,
      });

      // Apply drag overrides if present
      result.nodes.forEach((n: any) => {
        if (draggedY[n.id] !== undefined) {
          const dy = draggedY[n.id] - n.y0;
          n.y0 += dy;
          n.y1 += dy;
        }
      });

      return result;
    } catch (e) {
      console.warn('Sankey calculation warning:', e);
      return null;
    }
  }, [
    containerWidth,
    height,
    nodeWidth,
    nodePadding,
    currentAlign,
    preparedNodes,
    preparedLinks,
    draggedY,
    margin.left,
    margin.top,
    margin.right,
    margin.bottom,
  ]);

  // Color mapper for nodes
  const getNodeColor = useCallback(
    (node: any) => {
      if (node.color) return node.color;
      const index = layout ? layout.nodes.findIndex((n: any) => n.id === node.id) : 0;
      return colors[index % colors.length];
    },
    [colors, layout]
  );

  // Link Ribbon Path Generator
  const pathGenerator = useMemo(() => sankeyLinkHorizontal(), []);

  // Format value
  const formatVal = (val: number) => (valueFormatter ? valueFormatter(val) : String(val));

  // Connected elements sets for hover highlight
  const hoverState = useMemo(() => {
    if (hoveredNode) {
      const connectedLinks = new Set<any>();
      const connectedNodes = new Set<any>();
      connectedNodes.add(hoveredNode.id);

      if (layout) {
        layout.links.forEach((l: any) => {
          if (l.source.id === hoveredNode.id || l.target.id === hoveredNode.id) {
            connectedLinks.add(l);
            connectedNodes.add(l.source.id);
            connectedNodes.add(l.target.id);
          }
        });
      }
      return { connectedNodes, connectedLinks };
    }

    if (hoveredLink) {
      const connectedLinks = new Set<any>([hoveredLink]);
      const connectedNodes = new Set<any>([hoveredLink.source.id, hoveredLink.target.id]);
      return { connectedNodes, connectedLinks };
    }

    return null;
  }, [hoveredNode, hoveredLink, layout]);

  // Setup D3 Drag for Node Rectangles
  useEffect(() => {
    if (!draggable || !svgRef.current || !layout) return;

    const dragBehavior = d3
      .drag<SVGGElement, any>()
      .subject((event, d) => ({ y: d.y0 }))
      .on('drag', (event, d) => {
        const h = d.y1 - d.y0;
        const newY0 = Math.max(margin.top, Math.min(height - margin.bottom - h, event.y));
        setDraggedY((prev) => ({ ...prev, [d.id]: newY0 }));
      });

    d3.select(svgRef.current).selectAll<SVGGElement, any>('.node-group').call(dragBehavior);
  }, [draggable, layout, height, margin.top, margin.bottom]);

  return (
    <div className={cn(styles.root, className)} ref={containerRef} data-md3-component="sankey-diagram">
      {(title || subtitle) && (
        <div className={styles.header}>
          <div className={styles.headerText}>
            {title && <h4 className={styles.title}>{title}</h4>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>

          <div className={styles.controls}>
            <label style={{ fontSize: 12, color: 'var(--md-sys-color-on-surface-variant)' }}>
              Align:{' '}
              <select
                className={styles.controlSelect}
                value={currentAlign}
                onChange={(e) => setCurrentAlign(e.target.value as any)}
              >
                <option value="justify">Justify</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
                <option value="center">Center</option>
              </select>
            </label>
          </div>
        </div>
      )}

      <div
        className={styles.chartContainer}
        style={{ height }}
        onMouseMove={(e) => {
          if (!containerRef.current) return;
          const rect = containerRef.current.getBoundingClientRect();
          setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }}
        onMouseLeave={() => {
          setHoveredNode(null);
          setHoveredLink(null);
          setMousePos(null);
        }}

      >
        <svg ref={svgRef} className={styles.svg} width={containerWidth} height={height}>
          {/* Defs for Linear Gradients */}
          <defs>
            {layout &&
              layout.links.map((link: any, idx: number) => {
                const sColor = getNodeColor(link.source);
                const tColor = getNodeColor(link.target);
                return (
                  <linearGradient
                    key={`sankey-grad-${idx}`}
                    id={`sankey-grad-${idx}`}
                    gradientUnits="userSpaceOnUse"
                    x1={link.source.x1}
                    x2={link.target.x0}
                  >
                    <stop offset="0%" stopColor={sColor} />
                    <stop offset="100%" stopColor={tColor} />
                  </linearGradient>
                );
              })}
          </defs>

          {layout && (
            <>
              {/* Links Flow Layer */}
              <g className="links-layer">
                {layout.links.map((link: any, idx: number) => {
                  const d = pathGenerator(link);
                  if (!d) return null;

                  const sColor = getNodeColor(link.source);
                  const tColor = getNodeColor(link.target);

                  const strokeColor =
                    linkColorMode === 'gradient'
                      ? `url(#sankey-grad-${idx})`
                      : linkColorMode === 'source'
                      ? sColor
                      : linkColorMode === 'target'
                      ? tColor
                      : 'var(--md-sys-color-outline)';

                  const isDimmed = hoverState && !hoverState.connectedLinks.has(link);
                  const isHighlighted = hoverState && hoverState.connectedLinks.has(link);

                  return (
                    <path
                      key={idx}
                      className={cn(
                        styles.linkRibbon,
                        isDimmed && styles.linkDimmed,
                        isHighlighted && styles.linkHighlighted
                      )}
                      d={d}
                      stroke={strokeColor}
                      strokeWidth={Math.max(1, link.width)}
                      onMouseEnter={() => interactive && setHoveredLink(link)}
                      onMouseLeave={() => interactive && setHoveredLink(null)}
                      onClick={() => onLinkClick?.(link)}
                    />
                  );
                })}
              </g>

              {/* Nodes Layer */}
              <g className="nodes-layer">
                {layout.nodes.map((node: any) => {
                  const color = getNodeColor(node);
                  const isDimmed = hoverState && !hoverState.connectedNodes.has(node.id);
                  const isHighlighted = hoverState && hoverState.connectedNodes.has(node.id);
                  const isRightEdge = node.x0 > containerWidth / 2;

                  return (
                    <g
                      key={node.id}
                      className={cn('node-group', styles.nodeGroup)}
                      onMouseEnter={() => interactive && setHoveredNode(node)}
                      onMouseLeave={() => interactive && setHoveredNode(null)}
                      onClick={() => onNodeClick?.(node)}
                    >
                      <rect
                        className={cn(
                          styles.nodeRect,
                          isDimmed && styles.nodeDimmed,
                          isHighlighted && styles.nodeHighlighted
                        )}
                        x={node.x0}
                        y={node.y0}
                        width={Math.max(1, node.x1 - node.x0)}
                        height={Math.max(1, node.y1 - node.y0)}
                        fill={color}
                      />

                      {showLabels && (
                        <text
                          className={cn(styles.nodeLabel, isDimmed && styles.nodeDimmed)}
                          x={isRightEdge ? node.x0 - 8 : node.x1 + 8}
                          y={(node.y0 + node.y1) / 2}
                          dy="0.35em"
                          textAnchor={isRightEdge ? 'end' : 'start'}
                        >
                          {node.name}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            </>
          )}
        </svg>

        {/* Hover Tooltip */}
        {interactive && (hoveredNode || hoveredLink) && mousePos && (
          <div
            className={styles.tooltip}
            style={{
              left: Math.min(containerWidth - 120, Math.max(120, mousePos.x)),
              top: mousePos.y,
            }}
          >
            {hoveredNode && (
              <>
                <span className={styles.tooltipTitle}>{hoveredNode.name}</span>
                {hoveredNode.category && (
                  <div className={styles.tooltipRow}>
                    <span>Category:</span>
                    <span className={styles.tooltipValue}>{hoveredNode.category}</span>
                  </div>
                )}
                <div className={styles.tooltipRow}>
                  <span>Total Flow:</span>
                  <span className={styles.tooltipValue}>{formatVal(hoveredNode.value)}</span>
                </div>
              </>
            )}

            {hoveredLink && !hoveredNode && (
              <>
                <span className={styles.tooltipTitle}>
                  {hoveredLink.source.name} → {hoveredLink.target.name}
                </span>
                <div className={styles.tooltipRow}>
                  <span>Flow Volume:</span>
                  <span className={styles.tooltipValue}>{formatVal(hoveredLink.value)}</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
