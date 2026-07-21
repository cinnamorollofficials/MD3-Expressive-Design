import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { cn } from '../../utils/cn';
import styles from './TidyTree.module.css';

export interface TidyTreeNode {
  name: string;
  value?: number;
  children?: TidyTreeNode[];
  [key: string]: any;
}

export interface TidyTreeProps {
  /** Hierarchical root data object */
  data: TidyTreeNode;
  /** Layout orientation: 'horizontal' (left-to-right) | 'vertical' (top-to-bottom) */
  orientation?: 'horizontal' | 'vertical';
  /** Chart height in pixels (default 900) */
  height?: number;
  /** Main chart title */
  title?: string;
  /** Subtitle description */
  subtitle?: string;
  /** Custom value formatter */
  valueFormatter?: (val: number) => string;
  /** Whether interactive hover tooltips and branch highlights are enabled */
  interactive?: boolean;
  /** Callback when a tree node is clicked */
  onNodeClick?: (node: d3.HierarchyPointNode<TidyTreeNode>) => void;
  /** Additional CSS class name */
  className?: string;
}

export function TidyTree({
  data,
  orientation = 'horizontal',
  height = 950,
  title,
  subtitle,
  valueFormatter,
  interactive = true,
  onNodeClick,
  className,
}: TidyTreeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(900);

  const [hoveredNode, setHoveredNode] = useState<d3.HierarchyPointNode<TidyTreeNode> | null>(null);
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

  const isHorizontal = orientation === 'horizontal';
  const margin = { top: 24, right: 140, bottom: 24, left: 60 };
  const innerWidth = Math.max(100, containerWidth - margin.left - margin.right);
  const innerHeight = Math.max(100, height - margin.top - margin.bottom);

  // Compute D3 Hierarchy & Tidy Tree Layout
  const { rootNode, nodes, links, linkPathGen } = useMemo(() => {
    if (!data) return { rootNode: null, nodes: [], links: [], linkPathGen: null };

    const root = d3.hierarchy<TidyTreeNode>(data);

    // Construct D3 Tidy Tree generator
    const treeLayout = d3
      .tree<TidyTreeNode>()
      .size(isHorizontal ? [innerHeight, innerWidth] : [innerWidth, innerHeight])
      .separation((a, b) => (a.parent === b.parent ? 1 : 1.2));

    treeLayout(root);

    const nodeList = root.descendants() as d3.HierarchyPointNode<TidyTreeNode>[];
    const linkList = root.links() as d3.HierarchyPointLink<TidyTreeNode>[];

    // Link generator (curved cubic bezier)
    let pathGen: any;
    if (isHorizontal) {
      pathGen = d3
        .linkHorizontal<any, d3.HierarchyPointNode<TidyTreeNode>>()
        .x((d) => d.y)
        .y((d) => d.x);
    } else {
      pathGen = d3
        .linkVertical<any, d3.HierarchyPointNode<TidyTreeNode>>()
        .x((d) => d.x)
        .y((d) => d.y);
    }

    return { rootNode: root, nodes: nodeList, links: linkList, linkPathGen: pathGen };
  }, [data, isHorizontal, innerWidth, innerHeight]);

  // Set of ancestor node keys & link IDs for highlighted branch
  const highlightedBranch = useMemo(() => {
    if (!hoveredNode) return { nodeKeys: new Set<string>(), linkKeys: new Set<string>() };

    const nodeKeys = new Set<string>();
    const linkKeys = new Set<string>();

    const ancestors = hoveredNode.ancestors();
    ancestors.forEach((node) => {
      nodeKeys.add(node.data.name + '-' + node.depth);
      if (node.parent) {
        linkKeys.add(`${node.parent.data.name}->${node.data.name}`);
      }
    });

    return { nodeKeys, linkKeys };
  }, [hoveredNode]);

  const getNodePath = useCallback((node: d3.HierarchyPointNode<TidyTreeNode>): string => {
    return node
      .ancestors()
      .map((n) => n.data.name)
      .reverse()
      .join('.');
  }, []);

  const fmtVal = useCallback(
    (v?: number) => (v === undefined ? '-' : valueFormatter ? valueFormatter(v) : d3.format(',.0f')(v)),
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

  return (
    <div className={cn(styles.root, className)} ref={containerRef} data-md3-component="tidy-tree">
      {/* Header */}
      {(title || subtitle) && (
        <div className={styles.header}>
          <div className={styles.headerText}>
            {title && <h4 className={styles.title}>{title}</h4>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>
      )}

      {/* Main Tree Canvas */}
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
              {/* Curved Branch Link Lines Layer */}
              <g className="links-layer">
                {links.map((link, idx) => {
                  const linkKey = `${link.source.data.name}->${link.target.data.name}`;
                  const isHighlighted = highlightedBranch.linkKeys.has(linkKey);

                  return (
                    <path
                      key={linkKey || idx}
                      className={cn(
                        styles.linkPath,
                        isHighlighted && styles.linkHighlighted,
                        hoveredNode && !isHighlighted && styles.linkDimmed
                      )}
                      d={linkPathGen(link) || ''}
                    />
                  );
                })}
              </g>

              {/* Node Dots & Text Labels Layer */}
              <g className="nodes-layer">
                {nodes.map((node, idx) => {
                  const key = node.data.name + '-' + node.depth;
                  const isParent = Boolean(node.children && node.children.length > 0);
                  const isHovered = hoveredNode === node;
                  const isHighlighted = highlightedBranch.nodeKeys.has(key);

                  // Calculate SVG position
                  const posX = isHorizontal ? node.y : node.x;
                  const posY = isHorizontal ? node.x : node.y;

                  // Label anchoring: internal nodes on left, leaf nodes on right
                  const textAnchor = isHorizontal
                    ? isParent
                      ? 'end'
                      : 'start'
                    : 'middle';
                  const textDx = isHorizontal ? (isParent ? -8 : 8) : 0;
                  const textDy = isHorizontal ? 4 : isParent ? -10 : 16;

                  return (
                    <g
                      key={key || idx}
                      className={cn(styles.nodeGroup, hoveredNode && !isHighlighted && styles.nodeDimmed)}
                      transform={`translate(${posX}, ${posY})`}
                      onMouseEnter={() => interactive && setHoveredNode(node)}
                      onMouseLeave={() => interactive && setHoveredNode(null)}
                      onClick={() => onNodeClick?.(node)}
                    >
                      {/* Node Bullet Circle */}
                      <circle
                        className={cn(
                          styles.nodeDot,
                          isParent ? styles.nodeDotInternal : styles.nodeDotLeaf,
                          isHovered && styles.nodeDotHovered
                        )}
                        r={isParent ? 3.5 : 2.5}
                      />

                      {/* Node Label Text */}
                      <text
                        className={cn(styles.nodeText, isParent && styles.nodeTextInternal)}
                        x={textDx}
                        y={textDy}
                        textAnchor={textAnchor}
                      >
                        {node.data.name}
                      </text>
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
              left: Math.min(containerWidth - 160, Math.max(160, mousePos.x)),
              top: Math.max(48, mousePos.y - 12),
            }}
          >
            <div className={styles.tooltipTitle}>{getNodePath(hoveredNode)}</div>
            {hoveredNode.data.value !== undefined && (
              <div className={styles.tooltipRow}>
                <span>Value:</span>
                <span className={styles.tooltipValue}>{fmtVal(hoveredNode.data.value)}</span>
              </div>
            )}
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
