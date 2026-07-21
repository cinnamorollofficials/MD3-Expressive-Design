import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { cn } from '../../utils/cn';
import styles from './TangledTree.module.css';

export interface TangledTreeNode {
  id: string;
  name: string;
  parents?: string[]; // Parent node IDs (supports multi-parent DAG relationships)
  level?: number;     // Generation column level
  color?: string;     // Custom branch color
  [key: string]: any;
}

export interface TangledTreeProps {
  /** Array of nodes with multi-parent relationships */
  nodes: TangledTreeNode[];
  /** Column width spacing in pixels (default 200) */
  columnWidth?: number;
  /** Row height spacing in pixels (default 28) */
  rowHeight?: number;
  /** Chart height in pixels (default 900) */
  height?: number;
  /** Main chart title */
  title?: string;
  /** Subtitle description */
  subtitle?: string;
  /** Whether interactive hover tooltips and path highlights are enabled */
  interactive?: boolean;
  /** Callback when a node is clicked */
  onNodeClick?: (node: TangledTreeNode) => void;
  /** Additional CSS class name */
  className?: string;
}

interface LayoutNode {
  data: TangledTreeNode;
  id: string;
  name: string;
  level: number;
  x: number;
  y: number;
  parents: string[];
  color: string;
}

interface LayoutLink {
  id: string;
  source: LayoutNode;
  target: LayoutNode;
  pathD: string;
  color: string;
}

// Vibrant palette for branch connectors matching reference image
const BRANCH_PALETTE = [
  '#e06666', // Coral Red
  '#f6b26b', // Soft Orange
  '#ffd966', // Amber Gold
  '#93c47d', // Emerald Green
  '#76a5af', // Teal Cyan
  '#6fa8dc', // Sky Blue
  '#8e7cc3', // Deep Purple
  '#c27ba0', // Magenta Pink
  '#674ea7', // Indigo
  '#a64d79', // Rose Violet
];

export function TangledTree({
  nodes: rawNodes = [],
  columnWidth = 200,
  rowHeight = 28,
  height = 920,
  title,
  subtitle,
  interactive = true,
  onNodeClick,
  className,
}: TangledTreeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1000);

  const [hoveredNode, setHoveredNode] = useState<LayoutNode | null>(null);
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

  // Compute Layout Positions (Levels, X & Y coordinates, Bundled Curved Step Paths)
  const { layoutNodes, layoutLinks, totalWidth, totalHeight } = useMemo(() => {
    if (!rawNodes || rawNodes.length === 0)
      return { layoutNodes: [], layoutLinks: [], totalWidth: 800, totalHeight: 600 };

    const nodeMap = new Map<string, TangledTreeNode>();
    rawNodes.forEach((n) => nodeMap.set(n.id, n));

    // Calculate level (depth) for each node via DAG topological sort
    const nodeLevels = new Map<string, number>();

    function getLevel(id: string, visited = new Set<string>()): number {
      if (nodeLevels.has(id)) return nodeLevels.get(id)!;
      if (visited.has(id)) return 0; // Prevent cycle loops
      visited.add(id);

      const n = nodeMap.get(id);
      if (!n || !n.parents || n.parents.length === 0) {
        nodeLevels.set(id, n?.level ?? 0);
        return n?.level ?? 0;
      }

      let maxParentLevel = 0;
      n.parents.forEach((pId) => {
        maxParentLevel = Math.max(maxParentLevel, getLevel(pId, new Set(visited)));
      });

      const lvl = n.level !== undefined ? n.level : maxParentLevel + 1;
      nodeLevels.set(id, lvl);
      return lvl;
    }

    rawNodes.forEach((n) => getLevel(n.id));

    // Group nodes by level
    const levelGroups = new Map<number, TangledTreeNode[]>();
    rawNodes.forEach((n) => {
      const lvl = nodeLevels.get(n.id) || 0;
      if (!levelGroups.has(lvl)) levelGroups.set(lvl, []);
      levelGroups.get(lvl)!.push(n);
    });

    const sortedLevels = Array.from(levelGroups.keys()).sort((a, b) => a - b);

    // Color assignment map per parent node
    const parentColorMap = new Map<string, string>();
    let colorIdx = 0;
    rawNodes.forEach((n) => {
      const col = n.color || BRANCH_PALETTE[colorIdx % BRANCH_PALETTE.length];
      parentColorMap.set(n.id, col);
      colorIdx++;
    });

    // Calculate X and Y coordinates for each node
    const margin = { top: 32, right: 160, bottom: 32, left: 60 };
    const layoutNodeMap = new Map<string, LayoutNode>();
    const layoutNodesList: LayoutNode[] = [];

    let currentGlobalY = margin.top;

    sortedLevels.forEach((lvl) => {
      const group = levelGroups.get(lvl) || [];
      const x = margin.left + lvl * columnWidth;

      group.forEach((nodeItem) => {
        const layoutItem: LayoutNode = {
          data: nodeItem,
          id: nodeItem.id,
          name: nodeItem.name,
          level: lvl,
          x,
          y: currentGlobalY,
          parents: nodeItem.parents || [],
          color: parentColorMap.get(nodeItem.id) || '#76a5af',
        };
        layoutNodeMap.set(nodeItem.id, layoutItem);
        layoutNodesList.push(layoutItem);

        currentGlobalY += rowHeight;
      });

      currentGlobalY += 12; // Level gap spacing
    });

    // Generate bundled smooth step connector paths
    const linksList: LayoutLink[] = [];

    layoutNodesList.forEach((targetNode) => {
      targetNode.parents.forEach((parentId) => {
        const sourceNode = layoutNodeMap.get(parentId);
        if (!sourceNode) return;

        const x1 = sourceNode.x;
        const y1 = sourceNode.y;
        const x2 = targetNode.x;
        const y2 = targetNode.y;

        // Channel offset for bundling lines neatly between levels
        const midX = x1 + (x2 - x1) * 0.62;
        const r = Math.min(12, Math.abs(y2 - y1) / 2);

        let pathD = '';
        if (Math.abs(y2 - y1) < 2) {
          // Straight horizontal line
          pathD = `M ${x1} ${y1} H ${x2}`;
        } else if (y2 > y1) {
          // Curved step down-right
          pathD = `M ${x1} ${y1} H ${midX - r} Q ${midX} ${y1} ${midX} ${y1 + r} V ${y2 - r} Q ${midX} ${y2} ${midX + r} ${y2} H ${x2}`;
        } else {
          // Curved step up-right
          pathD = `M ${x1} ${y1} H ${midX - r} Q ${midX} ${y1} ${midX} ${y1 - r} V ${y2 + r} Q ${midX} ${y2} ${midX + r} ${y2} H ${x2}`;
        }

        linksList.push({
          id: `${sourceNode.id}->${targetNode.id}`,
          source: sourceNode,
          target: targetNode,
          pathD,
          color: sourceNode.color,
        });
      });
    });

    const maxLvl = sortedLevels[sortedLevels.length - 1] || 0;
    const calcWidth = margin.left + (maxLvl + 1) * columnWidth + margin.right;

    return {
      layoutNodes: layoutNodesList,
      layoutLinks: linksList,
      totalWidth: Math.max(containerWidth, calcWidth),
      totalHeight: Math.max(height, currentGlobalY + margin.bottom),
    };
  }, [rawNodes, columnWidth, rowHeight, containerWidth, height]);

  // Set of connected node IDs and link IDs for hover highlight
  const highlightedBranch = useMemo(() => {
    if (!hoveredNode) return { nodeIds: new Set<string>(), linkIds: new Set<string>() };

    const nodeIds = new Set<string>([hoveredNode.id]);
    const linkIds = new Set<string>();

    // Highlight all upstream parents
    const queue = [hoveredNode.id];
    const visited = new Set<string>([hoveredNode.id]);

    while (queue.length > 0) {
      const currId = queue.shift()!;
      layoutLinks.forEach((link) => {
        if (link.target.id === currId) {
          linkIds.add(link.id);
          nodeIds.add(link.source.id);
          if (!visited.has(link.source.id)) {
            visited.add(link.source.id);
            queue.push(link.source.id);
          }
        }
      });
    }

    // Highlight all downstream children
    const childQueue = [hoveredNode.id];
    const childVisited = new Set<string>([hoveredNode.id]);

    while (childQueue.length > 0) {
      const currId = childQueue.shift()!;
      layoutLinks.forEach((link) => {
        if (link.source.id === currId) {
          linkIds.add(link.id);
          nodeIds.add(link.target.id);
          if (!childVisited.has(link.target.id)) {
            childVisited.add(link.target.id);
            childQueue.push(link.target.id);
          }
        }
      });
    }

    return { nodeIds, linkIds };
  }, [hoveredNode, layoutLinks]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!interactive || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    },
    [interactive]
  );

  return (
    <div className={cn(styles.root, className)} ref={containerRef} data-md3-component="tangled-tree">
      {/* Header */}
      {(title || subtitle) && (
        <div className={styles.header}>
          <div className={styles.headerText}>
            {title && <h4 className={styles.title}>{title}</h4>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>
      )}

      {/* Main Canvas Container */}
      <div
        className={styles.chartContainer}
        style={{ minHeight: totalHeight }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setHoveredNode(null);
          setMousePos(null);
        }}
      >
        <svg className={styles.svg} width={totalWidth} height={totalHeight}>
          {/* Bundled Curved Step Links Layer */}
          <g className="links-layer">
            {layoutLinks.map((link) => {
              const isHighlighted = highlightedBranch.linkIds.has(link.id);

              return (
                <path
                  key={link.id}
                  className={cn(
                    styles.linkPath,
                    isHighlighted && styles.linkHighlighted,
                    hoveredNode && !isHighlighted && styles.linkDimmed
                  )}
                  d={link.pathD}
                  stroke={link.color}
                />
              );
            })}
          </g>

          {/* Nodes Layer */}
          <g className="nodes-layer">
            {layoutNodes.map((node) => {
              const isHovered = hoveredNode === node;
              const isHighlighted = highlightedBranch.nodeIds.has(node.id);

              return (
                <g
                  key={node.id}
                  className={cn(styles.nodeGroup, hoveredNode && !isHighlighted && styles.nodeDimmed)}
                  transform={`translate(${node.x}, ${node.y})`}
                  onMouseEnter={() => interactive && setHoveredNode(node)}
                  onMouseLeave={() => interactive && setHoveredNode(null)}
                  onClick={() => onNodeClick?.(node.data)}
                >
                  {/* Node Bullet Circle */}
                  <circle
                    className={cn(styles.nodeDot, isHovered && styles.nodeDotHovered)}
                    r={4}
                  />

                  {/* Node Name Label */}
                  <text className={styles.nodeText} x={10} y={4}>
                    {node.name}
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
            <div className={styles.tooltipTitle}>{hoveredNode.name}</div>
            <div className={styles.tooltipRow}>
              <span>Generation Level:</span>
              <span className={styles.tooltipValue}>Level {hoveredNode.level}</span>
            </div>
            {hoveredNode.parents.length > 0 && (
              <div className={styles.tooltipRow}>
                <span>Parents:</span>
                <span className={styles.tooltipValue}>{hoveredNode.parents.join(', ')}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
