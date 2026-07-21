import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { cn } from '../../utils/cn';
import styles from './HierarchicalEdgeBundling.module.css';

export interface EdgeBundlingItem {
  name: string;
  imports?: string[];
  [key: string]: any;
}

export interface HierarchicalEdgeBundlingProps {
  /** Array of hierarchical items with dot-separated names and import lists */
  data: EdgeBundlingItem[];
  /** Chart height / width outer diameter in pixels */
  height?: number;
  /** Bundling tension parameter beta in [0, 1] (default 0.85) */
  beta?: number;
  /** Show node text labels around circle perimeter */
  showLabels?: boolean;
  /** Enable hover highlight and tooltips */
  interactive?: boolean;
  /** Main chart title */
  title?: string;
  /** Subtitle description */
  subtitle?: string;
  /** Callback triggered when a node is clicked */
  onNodeClick?: (node: EdgeBundlingItem) => void;
  /** Additional CSS class name */
  className?: string;
}

// Builds a hierarchy root from dot-notated item names (e.g., "flare.analytics.cluster")
function buildHierarchy(data: EdgeBundlingItem[]) {
  const map = new Map<string, any>();

  function find(name: string, itemData?: EdgeBundlingItem) {
    let node = map.get(name);
    if (!node) {
      const parts = name.split('.');
      const parentName = parts.slice(0, -1).join('.');
      const shortName = parts[parts.length - 1];
      node = { name, shortName, children: [], itemData };
      if (parentName) {
        const parent = find(parentName);
        parent.children.push(node);
      }
      map.set(name, node);
    } else if (itemData) {
      node.itemData = itemData;
    }
    return node;
  }

  data.forEach((d) => find(d.name, d));
  const rootNode = map.get('') || map.get('flare') || Array.from(map.values())[0];
  return rootNode;
}

export function HierarchicalEdgeBundling({
  data = [],
  height = 760,
  beta: initialBeta = 0.85,
  showLabels = true,
  interactive = true,
  title,
  subtitle,
  onNodeClick,
  className,
}: HierarchicalEdgeBundlingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(760);
  const [currentBeta, setCurrentBeta] = useState(initialBeta);

  const [hoveredNode, setHoveredNode] = useState<any | null>(null);
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

  // Compute Layout, Leaves, and Bundled Links
  const radius = Math.min(containerWidth, height) / 2 - 140;

  const { leaves, links, lineRadial } = useMemo(() => {
    if (data.length === 0 || radius <= 0) {
      return { leaves: [], links: [], lineRadial: null };
    }

    const rawHierarchy = buildHierarchy(data);
    const root = d3.hierarchy(rawHierarchy);

    const cluster = d3.cluster<any>().size([360, radius]);
    cluster(root);

    const leafNodes = root.leaves();
    const leafMap = new Map<string, any>();
    leafNodes.forEach((leaf: any) => {
      leafMap.set(leaf.data.name, leaf);
    });

    const bundledLinks: any[] = [];
    leafNodes.forEach((source: any) => {
      const imports = source.data.itemData?.imports || [];
      imports.forEach((targetName: string) => {
        const target = leafMap.get(targetName);
        if (target) {
          bundledLinks.push({
            source,
            target,
            path: source.path(target),
          });
        }
      });
    });

    const lineGen = d3
      .lineRadial<any>()
      .curve(d3.curveBundle.beta(currentBeta))
      .angle((d: any) => (d.x * Math.PI) / 180)
      .radius((d: any) => d.y);

    return { leaves: leafNodes, links: bundledLinks, lineRadial: lineGen };
  }, [data, radius, currentBeta]);

  // Compute incoming and outgoing connections for hovered node
  const activeConnections = useMemo(() => {
    if (!hoveredNode) return null;
    const incomingSources = new Set<any>();
    const outgoingTargets = new Set<any>();
    const incomingLinks = new Set<any>();
    const outgoingLinks = new Set<any>();

    links.forEach((l) => {
      if (l.target.data.name === hoveredNode.data.name) {
        incomingLinks.add(l);
        incomingSources.add(l.source.data.name);
      }
      if (l.source.data.name === hoveredNode.data.name) {
        outgoingLinks.add(l);
        outgoingTargets.add(l.target.data.name);
      }
    });

    return { incomingSources, outgoingTargets, incomingLinks, outgoingLinks };
  }, [hoveredNode, links]);

  const centerPos = { x: containerWidth / 2, y: height / 2 };

  return (
    <div
      className={cn(styles.root, className)}
      ref={containerRef}
      data-md3-component="hierarchical-edge-bundling"
    >
      {(title || subtitle) && (
        <div className={styles.header}>
          <div className={styles.headerText}>
            {title && <h4 className={styles.title}>{title}</h4>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>

          <div className={styles.controls}>
            <label className={styles.controlSliderLabel}>
              Tension (&beta;): {currentBeta.toFixed(2)}
              <input
                type="range"
                className={styles.controlSlider}
                min="0"
                max="1"
                step="0.05"
                value={currentBeta}
                onChange={(e) => setCurrentBeta(parseFloat(e.target.value))}
              />
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
      >
        <svg className={styles.svg} width={containerWidth} height={height}>
          {lineRadial && leaves.length > 0 && (
            <g transform={`translate(${centerPos.x}, ${centerPos.y})`}>
              {/* Links Layer */}
              <g className="links-layer">
                {links.map((link, idx) => {
                  const d = lineRadial(link.path);
                  if (!d) return null;

                  const isIncoming = activeConnections && activeConnections.incomingLinks.has(link);
                  const isOutgoing = activeConnections && activeConnections.outgoingLinks.has(link);
                  const isDimmed =
                    activeConnections && !isIncoming && !isOutgoing;

                  return (
                    <path
                      key={idx}
                      className={cn(
                        styles.linkPath,
                        isIncoming && styles.linkIncoming,
                        isOutgoing && styles.linkOutgoing,
                        isDimmed && styles.linkDimmed
                      )}
                      d={d}
                    />
                  );
                })}
              </g>

              {/* Leaf Nodes Layer */}
              <g className="nodes-layer">
                {leaves.map((node: any, idx: number) => {
                  const isHovered = hoveredNode?.data.name === node.data.name;
                  const isSource = activeConnections && activeConnections.outgoingTargets.has(node.data.name);
                  const isTarget = activeConnections && activeConnections.incomingSources.has(node.data.name);

                  const isDimmed =
                    activeConnections && !isHovered && !isSource && !isTarget;

                  const angle = node.x;
                  const isRightHalf = angle < 180;
                  const rot = angle - 90;

                  return (
                    <g
                      key={idx}
                      className={cn(styles.nodeGroup)}
                      transform={`rotate(${rot}) translate(${radius + 8}, 0)`}
                      onMouseEnter={() => interactive && setHoveredNode(node)}
                      onMouseLeave={() => interactive && setHoveredNode(null)}
                      onClick={() => onNodeClick?.(node.data.itemData)}
                    >
                      {showLabels && (
                        <text
                          className={cn(
                            styles.nodeText,
                            isHovered && styles.nodeHovered,
                            isSource && styles.nodeSource,
                            isTarget && styles.nodeTarget,
                            isDimmed && styles.nodeDimmed
                          )}
                          dx={isRightHalf ? 6 : -6}
                          dy="0.31em"
                          textAnchor={isRightHalf ? 'start' : 'end'}
                          transform={isRightHalf ? undefined : 'rotate(180)'}
                        >
                          {node.data.shortName || node.data.name}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            </g>
          )}
        </svg>

        {/* Hover Tooltip */}
        {interactive && hoveredNode && mousePos && (
          <div
            className={styles.tooltip}
            style={{
              left: Math.min(containerWidth - 140, Math.max(140, mousePos.x)),
              top: mousePos.y,
            }}
          >
            <span className={styles.tooltipTitle}>{hoveredNode.data.name}</span>
            <div className={styles.tooltipRow}>
              <span>Depends on (Outgoing):</span>
              <span className={styles.tooltipValue} style={{ color: 'var(--md-sys-color-primary)' }}>
                {activeConnections?.outgoingTargets.size || 0}
              </span>
            </div>
            <div className={styles.tooltipRow}>
              <span>Used by (Incoming):</span>
              <span className={styles.tooltipValue} style={{ color: 'var(--md-sys-color-tertiary)' }}>
                {activeConnections?.incomingSources.size || 0}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
