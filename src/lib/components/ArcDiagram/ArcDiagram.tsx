import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { NetworkNode, NetworkLink } from '../ForceDirectedGraph';
import styles from './ArcDiagram.module.css';

export interface ArcDiagramProps {
  /** Array of node objects */
  nodes: NetworkNode[];
  /** Array of link objects connecting nodes */
  links: NetworkLink[];
  /** Layout orientation: vertical (node list on left, arcs on right) or horizontal */
  orientation?: 'vertical' | 'horizontal';
  /** Node ordering strategy */
  order?: 'group' | 'name' | 'id' | 'none';
  /** Chart height in pixels */
  height?: number;
  /** Radius of node circles (number or accessor function) */
  nodeRadius?: number | ((node: NetworkNode) => number);
  /** Palette of colors for node groups */
  colors?: string[];
  /** Show node text labels */
  showLabels?: boolean;
  /** Show group legend below chart */
  showLegend?: boolean;
  /** Enable hover highlight and tooltips */
  interactive?: boolean;
  /** Main chart title */
  title?: string;
  /** Subtitle description */
  subtitle?: string;
  /** Callback triggered when a node is clicked */
  onNodeClick?: (node: NetworkNode) => void;
  /** Additional CSS class name */
  className?: string;
}

const DEFAULT_COLORS = [
  '#E65100', // Orange (Group 1 - Les Misérables Myriel/Bishop)
  '#43A047', // Green (Group 2 - Valjean)
  '#E53935', // Red (Group 3 - Fantine/Tholomyes)
  '#8E24AA', // Purple (Group 4 - Thenardier/Javert)
  '#6D4C41', // Brown (Group 5 - Cosette/Gillenormand)
  '#C0CA33', // Lime/Yellow (Group 6 - Enjolras/ABC Society)
  '#00ACC1', // Cyan (Group 7 - Miscellaneous)
  '#3949AB', // Indigo
  '#D81B60', // Pink
  '#546E7A', // Blue Grey
];

export function ArcDiagram({
  nodes = [],
  links = [],
  orientation = 'vertical',
  order = 'group',
  height = 800,
  nodeRadius = 4,
  colors = DEFAULT_COLORS,
  showLabels = true,
  showLegend = true,
  interactive = true,
  title,
  subtitle,
  onNodeClick,
  className,
}: ArcDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(700);

  const [currentOrder, setCurrentOrder] = useState<'group' | 'name' | 'id' | 'none'>(order);
  const [hoveredNode, setHoveredNode] = useState<NetworkNode | null>(null);
  const [hoveredLink, setHoveredLink] = useState<NetworkLink | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [selectedGroups, setSelectedGroups] = useState<Set<string | number>>(new Set());

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
    return Array.from(set).sort((a, b) => String(a).localeCompare(String(b)));
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
      return nodeRadius;
    },
    [nodeRadius]
  );

  // Sorted nodes according to selected ordering
  const sortedNodes = useMemo(() => {
    const list = [...nodes];
    if (currentOrder === 'group') {
      list.sort((a, b) => {
        const gA = a.group !== undefined ? String(a.group) : '';
        const gB = b.group !== undefined ? String(b.group) : '';
        if (gA !== gB) return gA.localeCompare(gB);
        const nameA = a.label || String(a.id);
        const nameB = b.label || String(b.id);
        return nameA.localeCompare(nameB);
      });
    } else if (currentOrder === 'name') {
      list.sort((a, b) => (a.label || String(a.id)).localeCompare(b.label || String(b.id)));
    } else if (currentOrder === 'id') {
      list.sort((a, b) => String(a.id).localeCompare(String(b.id)));
    }
    return list;
  }, [nodes, currentOrder]);

  // Nodes position scale
  const isVertical = orientation === 'vertical';
  const labelMargin = isVertical ? 150 : 40;
  const margin = isVertical
    ? { top: 30, right: 30, bottom: 30, left: labelMargin }
    : { top: 180, right: 40, bottom: 60, left: 40 };

  const innerWidth = Math.max(100, containerWidth - margin.left - margin.right);
  const innerHeight = Math.max(100, height - margin.top - margin.bottom);

  const nodePosMap = useMemo(() => {
    const map = new Map<string | number, number>();
    const count = sortedNodes.length;
    if (count === 0) return map;

    const rangeMax = isVertical ? innerHeight : innerWidth;
    const step = count > 1 ? rangeMax / (count - 1) : 0;

    sortedNodes.forEach((node, i) => {
      map.set(node.id, (isVertical ? margin.top : margin.left) + i * step);
    });
    return map;
  }, [sortedNodes, isVertical, innerWidth, innerHeight, margin]);

  // Connected node ids map for hovered node
  const connectedNodeIds = useMemo(() => {
    if (!hoveredNode) return null;
    const set = new Set<string | number>();
    set.add(hoveredNode.id);
    links.forEach((l) => {
      const sId = typeof l.source === 'object' ? (l.source as NetworkNode).id : l.source;
      const tId = typeof l.target === 'object' ? (l.target as NetworkNode).id : l.target;
      if (sId === hoveredNode.id) set.add(tId);
      if (tId === hoveredNode.id) set.add(sId);
    });
    return set;
  }, [hoveredNode, links]);

  // Node degree counter
  const getNodeDegree = (nodeId: string | number) => {
    return links.filter((l) => {
      const sId = typeof l.source === 'object' ? (l.source as NetworkNode).id : l.source;
      const tId = typeof l.target === 'object' ? (l.target as NetworkNode).id : l.target;
      return sId === nodeId || tId === nodeId;
    }).length;
  };

  const toggleGroupFilter = (grp: string | number) => {
    setSelectedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(grp)) next.delete(grp);
      else next.add(grp);
      return next;
    });
  };

  return (
    <div className={cn(styles.root, className)} ref={containerRef} data-md3-component="arc-diagram">
      {(title || subtitle) && (
        <div className={styles.header}>
          <div className={styles.headerText}>
            {title && <h4 className={styles.title}>{title}</h4>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>

          <div className={styles.controls}>
            <label style={{ fontSize: 12, color: 'var(--md-sys-color-on-surface-variant)' }}>
              Sort Order:{' '}
              <select
                className={styles.controlSelect}
                value={currentOrder}
                onChange={(e) => setCurrentOrder(e.target.value as any)}
              >
                <option value="group">By Group & Name</option>
                <option value="name">By Name (Alphabetical)</option>
                <option value="id">By ID</option>
                <option value="none">Original Order</option>
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
        <svg className={styles.svg} width={containerWidth} height={height}>
          {/* Arcs Layer */}
          <g className="arcs-layer">
            {links.map((link, idx) => {
              const sId = typeof link.source === 'object' ? (link.source as NetworkNode).id : link.source;
              const tId = typeof link.target === 'object' ? (link.target as NetworkNode).id : link.target;

              const pos1 = nodePosMap.get(sId);
              const pos2 = nodePosMap.get(tId);

              if (pos1 === undefined || pos2 === undefined) return null;

              const sourceNode = nodes.find((n) => n.id === sId);
              const targetNode = nodes.find((n) => n.id === tId);

              const strokeColor = sourceNode ? getNodeColor(sourceNode) : 'var(--md-sys-color-outline)';

              const isGroupFiltered =
                selectedGroups.size > 0 &&
                (!sourceNode || !selectedGroups.has(sourceNode.group!)) &&
                (!targetNode || !selectedGroups.has(targetNode.group!));

              const isHoverConnected =
                (connectedNodeIds && (connectedNodeIds.has(sId) && connectedNodeIds.has(tId))) ||
                (hoveredLink &&
                  ((hoveredLink.source === sId && hoveredLink.target === tId) ||
                    (hoveredLink.source === tId && hoveredLink.target === sId)));

              const isDimmed = isGroupFiltered || (connectedNodeIds && !isHoverConnected);

              if (isVertical) {
                const y1 = pos1;
                const y2 = pos2;
                const r = Math.abs(y2 - y1) / 2;
                const x0 = margin.left;
                // Semicircular arc to the right of the vertical node list
                const pathD = `M ${x0},${y1} A ${r},${r} 0 0,${y1 < y2 ? 1 : 0} ${x0},${y2}`;

                return (
                  <path
                    key={idx}
                    className={cn(
                      styles.arcPath,
                      isDimmed && styles.arcDimmed,
                      isHoverConnected && styles.arcHighlighted
                    )}
                    d={pathD}
                    style={{ stroke: isHoverConnected ? strokeColor : undefined }}
                    onMouseEnter={() => interactive && setHoveredLink(link)}
                    onMouseLeave={() => interactive && setHoveredLink(null)}
                  />
                );
              } else {
                const x1 = pos1;
                const x2 = pos2;
                const r = Math.abs(x2 - x1) / 2;
                const y0 = height - margin.bottom;
                // Semicircular arc above horizontal node line
                const pathD = `M ${x1},${y0} A ${r},${r} 0 0,1 ${x2},${y0}`;

                return (
                  <path
                    key={idx}
                    className={cn(
                      styles.arcPath,
                      isDimmed && styles.arcDimmed,
                      isHoverConnected && styles.arcHighlighted
                    )}
                    d={pathD}
                    style={{ stroke: isHoverConnected ? strokeColor : undefined }}
                    onMouseEnter={() => interactive && setHoveredLink(link)}
                    onMouseLeave={() => interactive && setHoveredLink(null)}
                  />
                );
              }
            })}
          </g>

          {/* Nodes Layer */}
          <g className="nodes-layer">
            {sortedNodes.map((node) => {
              const pos = nodePosMap.get(node.id);
              if (pos === undefined) return null;

              const r = getRadius(node);
              const color = getNodeColor(node);
              const isGroupFiltered = selectedGroups.size > 0 && !selectedGroups.has(node.group!);
              const isConnected = connectedNodeIds ? connectedNodeIds.has(node.id) : true;
              const isDimmed = isGroupFiltered || !isConnected;
              const isHighlighted = hoveredNode?.id === node.id || (connectedNodeIds && connectedNodeIds.has(node.id));

              if (isVertical) {
                const cx = margin.left;
                const cy = pos;

                return (
                  <g
                    key={node.id}
                    className={cn(styles.nodeGroup)}
                    transform={`translate(${cx}, ${cy})`}
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
                        x={-r - 8}
                        y={4}
                        textAnchor="end"
                        style={{ fill: color }}
                      >
                        {node.label || String(node.id)}
                      </text>
                    )}
                  </g>
                );
              } else {
                const cx = pos;
                const cy = height - margin.bottom;

                return (
                  <g
                    key={node.id}
                    className={cn(styles.nodeGroup)}
                    transform={`translate(${cx}, ${cy})`}
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
                        x={0}
                        y={r + 14}
                        textAnchor="end"
                        transform={`rotate(-45, 0, ${r + 14})`}
                        style={{ fill: color }}
                      >
                        {node.label || String(node.id)}
                      </text>
                    )}
                  </g>
                );
              }
            })}
          </g>
        </svg>

        {/* Hover Tooltip */}
        {interactive && (hoveredNode || hoveredLink) && mousePos && (
          <div
            className={styles.tooltip}
            style={{
              left: Math.min(containerWidth - 100, Math.max(100, mousePos.x)),
              top: mousePos.y,
            }}
          >
            {hoveredNode && (
              <>
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
              </>
            )}

            {hoveredLink && !hoveredNode && (
              <>
                <span className={styles.tooltipTitle}>Relationship Arc</span>
                <div className={styles.tooltipRow}>
                  <span>Source:</span>
                  <span className={styles.tooltipValue}>{String(hoveredLink.source)}</span>
                </div>
                <div className={styles.tooltipRow}>
                  <span>Target:</span>
                  <span className={styles.tooltipValue}>{String(hoveredLink.target)}</span>
                </div>
                {hoveredLink.value !== undefined && (
                  <div className={styles.tooltipRow}>
                    <span>Weight:</span>
                    <span className={styles.tooltipValue}>{hoveredLink.value}</span>
                  </div>
                )}
              </>
            )}
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
