import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { cn } from '../../utils/cn';
import { NetworkNode } from '../ForceDirectedGraph';
import styles from './DirectedForceGraph.module.css';

export interface DirectedLink extends d3.SimulationLinkDatum<NetworkNode> {
  source: string | number | NetworkNode;
  target: string | number | NetworkNode;
  type?: 'suit' | 'licensing' | 'resolved' | string;
  value?: number;
  [key: string]: any;
}

export interface DirectedForceGraphProps {
  /** Array of node objects */
  nodes: NetworkNode[];
  /** Array of directed link objects (with type property for arrow styling) */
  links: DirectedLink[];
  /** Chart height in pixels. Width is responsive. */
  height?: number;
  /** Node radius in pixels */
  nodeRadius?: number | ((node: NetworkNode) => number);
  /** Target link distance */
  linkDistance?: number;
  /** Electrostatic charge strength (repulsion) */
  chargeStrength?: number;
  /** Collision radius buffer */
  collideRadius?: number;
  /** Custom mapping of link types to colors */
  typeColors?: Record<string, string>;
  /** Show node text labels */
  showLabels?: boolean;
  /** Show link types legend */
  showLegend?: boolean;
  /** Enable dragging nodes */
  draggable?: boolean;
  /** Enable zooming and panning */
  zoomable?: boolean;
  /** Enable hover highlighting and tooltip */
  interactive?: boolean;
  /** Main title */
  title?: string;
  /** Subtitle description */
  subtitle?: string;
  /** Callback triggered when a node is clicked */
  onNodeClick?: (node: NetworkNode) => void;
  /** Additional CSS class name */
  className?: string;
}

const DEFAULT_TYPE_COLORS: Record<string, string> = {
  suit: '#2E7D32',      // Green suit
  licensing: '#EF6C00', // Orange licensing
  resolved: '#0277BD',  // Blue resolved
};

export function DirectedForceGraph({
  nodes = [],
  links = [],
  height = 540,
  nodeRadius = 5,
  linkDistance = 90,
  chargeStrength = -300,
  collideRadius = 6,
  typeColors = DEFAULT_TYPE_COLORS,
  showLabels = true,
  showLegend = true,
  draggable = true,
  zoomable = true,
  interactive = true,
  title,
  subtitle,
  onNodeClick,
  className,
}: DirectedForceGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomGroupRef = useRef<SVGGElement>(null);

  const [containerWidth, setContainerWidth] = useState(640);
  const [, setTick] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<NetworkNode | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());

  const simulationRef = useRef<d3.Simulation<NetworkNode, DirectedLink> | null>(null);
  const simNodesRef = useRef<NetworkNode[]>([]);
  const simLinksRef = useRef<DirectedLink[]>([]);

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

  // Extract unique link types
  const linkTypes = useMemo(() => {
    const set = new Set<string>();
    links.forEach((l) => {
      if (l.type) set.add(l.type);
    });
    return Array.from(set);
  }, [links]);

  // Radius accessor
  const getRadius = useCallback(
    (node: NetworkNode) => {
      if (typeof nodeRadius === 'function') return nodeRadius(node);
      return nodeRadius;
    },
    [nodeRadius]
  );

  // D3 Force Simulation setup
  useEffect(() => {
    if (containerWidth <= 0 || height <= 0 || nodes.length === 0) return;

    const simNodes: NetworkNode[] = nodes.map((n) => ({ ...n }));
    const simLinks: DirectedLink[] = links.map((l) => ({
      ...l,
      source: typeof l.source === 'object' ? (l.source as NetworkNode).id : l.source,
      target: typeof l.target === 'object' ? (l.target as NetworkNode).id : l.target,
    }));

    simNodesRef.current = simNodes;
    simLinksRef.current = simLinks;

    const simulation = d3
      .forceSimulation<NetworkNode, DirectedLink>(simNodes)
      .force(
        'link',
        d3
          .forceLink<NetworkNode, DirectedLink>(simLinks)
          .id((d) => d.id)
          .distance(linkDistance)
          .strength(0.8)
      )
      .force('charge', d3.forceManyBody().strength(chargeStrength))
      .force('x', d3.forceX(containerWidth / 2).strength(0.03))
      .force('y', d3.forceY(height / 2).strength(0.03))
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
  }, [nodes, links, containerWidth, height, linkDistance, chargeStrength, collideRadius, getRadius]);

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

  // Connected node ids map for hovered node
  const connectedNodeMap = useMemo(() => {
    if (!hoveredNode) return null;
    const map = new Map<string | number, 'incoming' | 'outgoing' | 'both'>();
    map.set(hoveredNode.id, 'both');
    simLinksRef.current.forEach((l) => {
      const sId = typeof l.source === 'object' ? (l.source as NetworkNode).id : l.source;
      const tId = typeof l.target === 'object' ? (l.target as NetworkNode).id : l.target;
      if (sId === hoveredNode.id) map.set(tId, 'outgoing');
      if (tId === hoveredNode.id) map.set(sId, 'incoming');
    });
    return map;
  }, [hoveredNode]);

  const toggleTypeFilter = (type: string) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  // Node stats calculation
  const getNodeStats = (nodeId: string | number) => {
    let outgoing = 0;
    let incoming = 0;
    simLinksRef.current.forEach((l) => {
      const sId = typeof l.source === 'object' ? (l.source as NetworkNode).id : l.source;
      const tId = typeof l.target === 'object' ? (l.target as NetworkNode).id : l.target;
      if (sId === nodeId) outgoing++;
      if (tId === nodeId) incoming++;
    });
    return { outgoing, incoming };
  };

  return (
    <div className={cn(styles.root, className)} ref={containerRef} data-md3-component="directed-force-graph">
      {(title || subtitle || zoomable) && (
        <div className={styles.header}>
          <div className={styles.headerText}>
            {title && <h4 className={styles.title}>{title}</h4>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>

          <div className={styles.controls}>
            {zoomable && (
              <>
                <button type="button" className={styles.controlBtn} onClick={handleZoomIn} title="Zoom In" aria-label="Zoom In">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
                </button>
                <button type="button" className={styles.controlBtn} onClick={handleZoomOut} title="Zoom Out" aria-label="Zoom Out">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13H5v-2h14v2z" /></svg>
                </button>
                <button type="button" className={styles.controlBtn} onClick={handleResetZoom} title="Reset View" aria-label="Reset View">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" /></svg>
                </button>
              </>
            )}
            <button type="button" className={styles.controlBtn} onClick={handleRestartSim} title="Re-layout Simulation" aria-label="Re-layout Simulation">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" /></svg>
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
          {/* Arrowhead Markers Defs */}
          <defs>
            {Object.entries(typeColors).map(([t, color]) => (
              <marker
                key={t}
                id={`marker-${t}`}
                viewBox="0 -5 10 10"
                refX={16}
                refY={-1}
                markerWidth={6}
                markerHeight={6}
                orient="auto"
              >
                <path d="M0,-5L10,0L0,5" fill={color} />
              </marker>
            ))}
            <marker id="marker-default" viewBox="0 -5 10 10" refX={16} refY={-1} markerWidth={6} markerHeight={6} orient="auto">
              <path d="M0,-5L10,0L0,5" fill="var(--md-sys-color-on-surface-variant)" />
            </marker>
          </defs>

          <g ref={zoomGroupRef}>
            {/* Curved Path Links Layer */}
            <g className="links-layer">
              {simLinksRef.current.map((link, idx) => {
                const sNode = link.source as NetworkNode;
                const tNode = link.target as NetworkNode;

                if (sNode.x === undefined || sNode.y === undefined || tNode.x === undefined || tNode.y === undefined) return null;

                const dx = tNode.x - sNode.x;
                const dy = tNode.y - sNode.y;
                const dr = Math.sqrt(dx * dx + dy * dy);

                // Curved arc path matching D3 mobile patent suits reference
                const pathD = `M${sNode.x},${sNode.y}A${dr},${dr} 0 0,1 ${tNode.x},${tNode.y}`;
                const linkType = link.type || 'suit';

                const isTypeFiltered = selectedTypes.size > 0 && !selectedTypes.has(linkType);
                const isConnected = connectedNodeMap ? connectedNodeMap.has(sNode.id) && connectedNodeMap.has(tNode.id) : true;
                const isDimmed = isTypeFiltered || !isConnected;
                const isHighlighted = connectedNodeMap && connectedNodeMap.has(sNode.id) && connectedNodeMap.has(tNode.id);

                const typeClass =
                  linkType === 'suit'
                    ? styles.typeSuit
                    : linkType === 'licensing'
                    ? styles.typeLicensing
                    : linkType === 'resolved'
                    ? styles.typeResolved
                    : '';

                return (
                  <path
                    key={idx}
                    className={cn(
                      styles.linkPath,
                      typeClass,
                      isDimmed && styles.linkDimmed,
                      isHighlighted && styles.linkHighlighted
                    )}
                    d={pathD}
                    style={{ stroke: typeColors[linkType] }}
                    markerEnd={`url(#marker-${typeColors[linkType] ? linkType : 'default'})`}
                  />
                );
              })}
            </g>

            {/* Nodes Layer */}
            <g className="nodes-layer">
              {simNodesRef.current.map((node) => {
                if (node.x === undefined || node.y === undefined) return null;

                const r = getRadius(node);
                const isConnected = connectedNodeMap ? connectedNodeMap.has(node.id) : true;
                const isDimmed = !isConnected;
                const isHighlighted = hoveredNode?.id === node.id || isConnected;

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
                    />

                    {showLabels && (
                      <text
                        className={cn(styles.nodeLabel, isDimmed && styles.nodeDimmed)}
                        x={r + 4}
                        y={4}
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
            <div className={styles.tooltipRow}>
              <span>Suits Filed (Outgoing):</span>
              <span className={styles.tooltipValue}>{getNodeStats(hoveredNode.id).outgoing}</span>
            </div>
            <div className={styles.tooltipRow}>
              <span>Suited By (Incoming):</span>
              <span className={styles.tooltipValue}>{getNodeStats(hoveredNode.id).incoming}</span>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      {showLegend && linkTypes.length > 0 && (
        <div className={styles.legend}>
          {linkTypes.map((t) => {
            const color = typeColors[t] || 'var(--md-sys-color-primary)';
            const isSelected = selectedTypes.has(t);

            return (
              <div
                key={t}
                className={cn(
                  styles.legendItem,
                  selectedTypes.size > 0 && !isSelected && styles.legendItemDimmed
                )}
                onClick={() => toggleTypeFilter(t)}
              >
                <div className={styles.legendLine} style={{ backgroundColor: color }} />
                <span style={{ textTransform: 'capitalize' }}>{t}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
