import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { cn } from '../../utils/cn';
import { NetworkNode, NetworkLink } from '../ForceDirectedGraph';
import styles from './DisjointForceDirectedGraph.module.css';

export interface DisjointForceDirectedGraphProps {
  /** Array of node objects */
  nodes: NetworkNode[];
  /** Array of link objects connecting nodes (contains disjoint components) */
  links: NetworkLink[];
  /** Chart height in pixels. Width is responsive. */
  height?: number;
  /** Radius of nodes in pixels (or function based on node datum) */
  nodeRadius?: number | ((node: NetworkNode) => number);
  /** Target distance between linked nodes */
  linkDistance?: number;
  /** Electrostatic charge strength (negative value repels) */
  chargeStrength?: number;
  /** Gravity strength towards canvas center */
  centerStrength?: number;
  /** Collision radius buffer around nodes */
  collideRadius?: number;
  /** Color palette for groups (uses MD3 tokens by default) */
  colors?: string[];
  /** Show node text labels directly on graph */
  showLabels?: boolean;
  /** Show group legend below graph */
  showLegend?: boolean;
  /** Enable dragging nodes */
  draggable?: boolean;
  /** Enable zooming and panning */
  zoomable?: boolean;
  /** Enable interactive hover effects and tooltips */
  interactive?: boolean;
  /** Main chart title */
  title?: string;
  /** Subtitle text below title */
  subtitle?: string;
  /** Callback triggered when a node is clicked */
  onNodeClick?: (node: NetworkNode) => void;
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
  'var(--md-sys-color-error, #B3261E)',
];

export function DisjointForceDirectedGraph({
  nodes = [],
  links = [],
  height = 520,
  nodeRadius = 6,
  linkDistance = 35,
  chargeStrength = -35,
  centerStrength = 0.018,
  collideRadius = 3,
  colors = DEFAULT_COLORS,
  showLabels = false,
  showLegend = true,
  draggable = true,
  zoomable = true,
  interactive = true,
  title,
  subtitle,
  onNodeClick,
  className,
}: DisjointForceDirectedGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomGroupRef = useRef<SVGGElement>(null);

  const [containerWidth, setContainerWidth] = useState(640);
  const [, setTick] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<NetworkNode | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [selectedGroups, setSelectedGroups] = useState<Set<string | number>>(new Set());

  const simulationRef = useRef<d3.Simulation<NetworkNode, NetworkLink> | null>(null);
  const simNodesRef = useRef<NetworkNode[]>([]);
  const simLinksRef = useRef<NetworkLink[]>([]);

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

  // Compute unique groups
  const groups = useMemo(() => {
    const set = new Set<string | number>();
    nodes.forEach((n) => {
      if (n.group !== undefined && n.group !== null) {
        set.add(n.group);
      }
    });
    return Array.from(set).sort();
  }, [nodes]);

  // Color accessor
  const getNodeColor = useCallback(
    (node: NetworkNode) => {
      if (node.color) return node.color;
      if (node.group !== undefined && node.group !== null) {
        const index = groups.indexOf(node.group);
        if (index >= 0) return colors[index % colors.length];
      }
      return colors[0];
    },
    [colors, groups]
  );

  // Radius accessor
  const getRadius = useCallback(
    (node: NetworkNode) => {
      if (typeof nodeRadius === 'function') return nodeRadius(node);
      if (node.val) return Math.max(3, Math.min(18, Math.sqrt(node.val) * 2.5));
      return nodeRadius;
    },
    [nodeRadius]
  );

  // Initialize Disjoint D3 Force Simulation
  useEffect(() => {
    if (containerWidth <= 0 || height <= 0 || nodes.length === 0) return;

    const simNodes: NetworkNode[] = nodes.map((n) => ({ ...n }));
    const simLinks: NetworkLink[] = links.map((l) => ({
      ...l,
      source: typeof l.source === 'object' ? (l.source as NetworkNode).id : l.source,
      target: typeof l.target === 'object' ? (l.target as NetworkNode).id : l.target,
    }));

    simNodesRef.current = simNodes;
    simLinksRef.current = simLinks;

    // Disjoint simulation setup: Uses forceX and forceY towards center instead of forceCenter
    const simulation = d3
      .forceSimulation<NetworkNode, NetworkLink>(simNodes)
      .force(
        'link',
        d3
          .forceLink<NetworkNode, NetworkLink>(simLinks)
          .id((d) => d.id)
          .distance((d) => (d.value ? linkDistance * (1 / Math.sqrt(d.value)) : linkDistance))
          .strength(1)
      )
      .force('charge', d3.forceManyBody().strength(chargeStrength))
      .force('x', d3.forceX(containerWidth / 2).strength(centerStrength))
      .force('y', d3.forceY(height / 2).strength(centerStrength))
      .force(
        'collide',
        d3
          .forceCollide<NetworkNode>()
          .radius((d) => getRadius(d) + collideRadius)
          .iterations(2)
      );

    simulation.on('tick', () => {
      setTick((t) => t + 1);
    });

    simulationRef.current = simulation;

    return () => {
      simulation.stop();
    };
  }, [nodes, links, containerWidth, height, linkDistance, chargeStrength, centerStrength, collideRadius, getRadius]);

  // Drag behavior
  useEffect(() => {
    if (!draggable || !simulationRef.current || !zoomGroupRef.current) return;

    const simulation = simulationRef.current;
    const gSelection = d3.select(zoomGroupRef.current);

    const dragBehavior = d3
      .drag<SVGGElement, NetworkNode>()
      .subject((event) => {
        const [mx, my] = d3.pointer(event, zoomGroupRef.current);
        const found = simulation.find(mx, my, 25);
        return found || { x: event.x, y: event.y };
      })
      .on('start', (event) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      })
      .on('drag', (event) => {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      })
      .on('end', (event) => {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      });

    gSelection.selectAll<SVGGElement, NetworkNode>('.node-group').call(dragBehavior);
  }, [draggable]);

  // Zoom behavior
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  useEffect(() => {
    if (!zoomable || !svgRef.current) return;

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 6])
      .on('zoom', (event) => {
        if (zoomGroupRef.current) {
          d3.select(zoomGroupRef.current).attr('transform', event.transform);
        }
      });

    zoomBehaviorRef.current = zoom;
    d3.select(svgRef.current).call(zoom);

    d3.select(svgRef.current).on('dblclick.zoom', () => {
      if (svgRef.current && zoomBehaviorRef.current) {
        d3.select(svgRef.current)
          .transition()
          .duration(500)
          .call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
      }
    });
  }, [zoomable]);

  const handleZoomIn = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 1.3);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 0.7);
    }
  };

  const handleResetZoom = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(400).call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
    }
  };

  const handleRestartSim = () => {
    if (simulationRef.current) {
      simulationRef.current.alpha(1).restart();
    }
  };

  // Connected neighbors set for hovered node
  const connectedNodeIds = useMemo(() => {
    if (!hoveredNode) return null;
    const set = new Set<string | number>();
    set.add(hoveredNode.id);
    simLinksRef.current.forEach((l) => {
      const sourceId = typeof l.source === 'object' ? (l.source as NetworkNode).id : l.source;
      const targetId = typeof l.target === 'object' ? (l.target as NetworkNode).id : l.target;
      if (sourceId === hoveredNode.id) set.add(targetId);
      if (targetId === hoveredNode.id) set.add(sourceId);
    });
    return set;
  }, [hoveredNode]);

  const toggleGroupFilter = (grp: string | number) => {
    setSelectedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(grp)) next.delete(grp);
      else next.add(grp);
      return next;
    });
  };

  const getNodeDegree = (nodeId: string | number) => {
    return simLinksRef.current.filter((l) => {
      const sId = typeof l.source === 'object' ? (l.source as NetworkNode).id : l.source;
      const tId = typeof l.target === 'object' ? (l.target as NetworkNode).id : l.target;
      return sId === nodeId || tId === nodeId;
    }).length;
  };

  return (
    <div className={cn(styles.root, className)} ref={containerRef} data-md3-component="disjoint-force-directed-graph">
      {(title || subtitle || zoomable) && (
        <div className={styles.header}>
          <div className={styles.headerText}>
            {title && <h4 className={styles.title}>{title}</h4>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>

          <div className={styles.controls}>
            {zoomable && (
              <>
                <button
                  type="button"
                  className={styles.controlBtn}
                  onClick={handleZoomIn}
                  title="Zoom In"
                  aria-label="Zoom In"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={styles.controlBtn}
                  onClick={handleZoomOut}
                  title="Zoom Out"
                  aria-label="Zoom Out"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13H5v-2h14v2z" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={styles.controlBtn}
                  onClick={handleResetZoom}
                  title="Reset View"
                  aria-label="Reset View"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
                  </svg>
                </button>
              </>
            )}
            <button
              type="button"
              className={styles.controlBtn}
              onClick={handleRestartSim}
              title="Re-layout Simulation"
              aria-label="Re-layout Simulation"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
              </svg>
            </button>
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
      >
        <svg ref={svgRef} className={styles.svg} width={containerWidth} height={height}>
          <g ref={zoomGroupRef}>
            {/* Links */}
            <g className="links-layer">
              {simLinksRef.current.map((link, idx) => {
                const sourceNode = link.source as NetworkNode;
                const targetNode = link.target as NetworkNode;

                if (
                  sourceNode.x === undefined ||
                  sourceNode.y === undefined ||
                  targetNode.x === undefined ||
                  targetNode.y === undefined
                ) {
                  return null;
                }

                const isDimmed =
                  (selectedGroups.size > 0 &&
                    (!selectedGroups.has(sourceNode.group!) || !selectedGroups.has(targetNode.group!))) ||
                  (connectedNodeIds &&
                    (!connectedNodeIds.has(sourceNode.id) || !connectedNodeIds.has(targetNode.id)));

                const isHighlighted =
                  connectedNodeIds &&
                  connectedNodeIds.has(sourceNode.id) &&
                  connectedNodeIds.has(targetNode.id);

                return (
                  <line
                    key={idx}
                    className={cn(
                      styles.link,
                      isDimmed && styles.linkDimmed,
                      isHighlighted && styles.linkHighlighted
                    )}
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    strokeWidth={link.value ? Math.max(1, Math.min(5, Math.sqrt(link.value))) : 1.2}
                  />
                );
              })}
            </g>

            {/* Nodes */}
            <g className="nodes-layer">
              {simNodesRef.current.map((node) => {
                if (node.x === undefined || node.y === undefined) return null;

                const r = getRadius(node);
                const color = getNodeColor(node);
                const isGroupFiltered = selectedGroups.size > 0 && !selectedGroups.has(node.group!);
                const isConnected = connectedNodeIds ? connectedNodeIds.has(node.id) : true;
                const isDimmed = isGroupFiltered || !isConnected;
                const isHighlighted = hoveredNode?.id === node.id || (connectedNodeIds && connectedNodeIds.has(node.id));

                return (
                  <g
                    key={node.id}
                    className={cn('node-group', styles.nodeGroup)}
                    transform={`translate(${node.x}, ${node.y})`}
                    onMouseEnter={() => interactive && setHoveredNode(node)}
                    onMouseLeave={() => interactive && setHoveredNode(null)}
                    onClick={() => onNodeClick?.(node)}
                  >
                    <circle
                      className={cn(
                        styles.nodeCircle,
                        isDimmed && styles.nodeDimmed,
                        isHighlighted && styles.nodeHighlighted
                      )}
                      r={r}
                      fill={color}
                    />

                    {showLabels && (
                      <text
                        className={cn(styles.nodeLabel, isDimmed && styles.nodeDimmed)}
                        x={r + 3}
                        y={3}
                        opacity={hoveredNode || selectedGroups.size > 0 ? (isHighlighted ? 1 : 0.2) : 0.8}
                      >
                        {node.label || String(node.id)}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </g>
        </svg>

        {/* Hover Tooltip */}
        {interactive && hoveredNode && mousePos && (
          <div
            className={styles.tooltip}
            style={{
              left: Math.min(containerWidth - 100, Math.max(100, mousePos.x)),
              top: mousePos.y,
            }}
          >
            <span className={styles.tooltipTitle}>{hoveredNode.label || String(hoveredNode.id)}</span>
            {hoveredNode.group !== undefined && (
              <div className={styles.tooltipRow}>
                <span>Group:</span>
                <span className={styles.tooltipValue}>{String(hoveredNode.group)}</span>
              </div>
            )}
            <div className={styles.tooltipRow}>
              <span>Connections:</span>
              <span className={styles.tooltipValue}>{getNodeDegree(hoveredNode.id)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      {showLegend && groups.length > 0 && (
        <div className={styles.legend}>
          {groups.map((grp) => {
            const index = groups.indexOf(grp);
            const color = colors[index % colors.length];
            const isSelected = selectedGroups.has(grp);

            return (
              <div
                key={grp}
                className={cn(
                  styles.legendItem,
                  selectedGroups.size > 0 && !isSelected && styles.legendItemDimmed
                )}
                onClick={() => toggleGroupFilter(grp)}
              >
                <div className={styles.legendDot} style={{ backgroundColor: color }} />
                <span>Group {String(grp)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
