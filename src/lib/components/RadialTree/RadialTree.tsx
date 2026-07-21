import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { cn } from '../../utils/cn';
import styles from './RadialTree.module.css';

export interface RadialTreeNode {
  name: string;
  value?: number;
  children?: RadialTreeNode[];
  [key: string]: any;
}

export interface RadialTreeProps {
  /** Hierarchical root data object */
  data: RadialTreeNode;
  /** Chart height in pixels (default 920) */
  height?: number;
  /** Main chart title */
  title?: string;
  /** Subtitle description */
  subtitle?: string;
  /** Custom value formatter */
  valueFormatter?: (val: number) => string;
  /** Whether interactive hover tooltips and radial branch highlights are enabled */
  interactive?: boolean;
  /** Callback when a tree node is clicked */
  onNodeClick?: (node: d3.HierarchyPointNode<RadialTreeNode>) => void;
  /** Additional CSS class name */
  className?: string;
}

export function RadialTree({
  data,
  height = 920,
  title,
  subtitle,
  valueFormatter,
  interactive = true,
  onNodeClick,
  className,
}: RadialTreeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(900);

  const [hoveredNode, setHoveredNode] = useState<d3.HierarchyPointNode<RadialTreeNode> | null>(null);
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
  const outerRadius = Math.max(100, size / 2 - 110);

  // Compute D3 Hierarchy & Radial Tree Layout
  const { rootNode, nodes, links, linkPathGen } = useMemo(() => {
    if (!data) return { rootNode: null, nodes: [], links: [], linkPathGen: null };

    const root = d3.hierarchy<RadialTreeNode>(data);

    // Construct D3 Radial Tree generator (angle: 0 to 2*PI, radius: 0 to outerRadius)
    const treeLayout = d3
      .tree<RadialTreeNode>()
      .size([2 * Math.PI, outerRadius])
      .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);

    treeLayout(root);

    const nodeList = root.descendants() as d3.HierarchyPointNode<RadialTreeNode>[];
    const linkList = root.links() as d3.HierarchyPointLink<RadialTreeNode>[];

    // Radial Link Path Generator
    const pathGen = d3
      .linkRadial<any, d3.HierarchyPointNode<RadialTreeNode>>()
      .angle((d) => d.x)
      .radius((d) => d.y);

    return { rootNode: root, nodes: nodeList, links: linkList, linkPathGen: pathGen };
  }, [data, outerRadius]);

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

  const getNodePath = useCallback((node: d3.HierarchyPointNode<RadialTreeNode>): string => {
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
    <div className={cn(styles.root, className)} ref={containerRef} data-md3-component="radial-tree">
      {/* Header */}
      {(title || subtitle) && (
        <div className={styles.header}>
          <div className={styles.headerText}>
            {title && <h4 className={styles.title}>{title}</h4>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>
      )}

      {/* Main Radial Tree SVG Canvas */}
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
            <g transform={`translate(${containerWidth / 2}, ${height / 2})`}>
              {/* Radial Curved Branch Link Lines Layer */}
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

              {/* Radial Nodes & Labels Layer */}
              <g className="nodes-layer">
                {nodes.map((node, idx) => {
                  const key = node.data.name + '-' + node.depth;
                  const isParent = Boolean(node.children && node.children.length > 0);
                  const isHovered = hoveredNode === node;
                  const isHighlighted = highlightedBranch.nodeKeys.has(key);

                  const angleDeg = (node.x * 180) / Math.PI - 90;
                  const isFlipped = node.x >= Math.PI;

                  // Label anchoring & flip transformation
                  const labelTransform = `rotate(${angleDeg}) translate(${node.y}, 0) rotate(${isFlipped ? 180 : 0})`;
                  const textAnchor = isParent ? (isFlipped ? 'start' : 'end') : (isFlipped ? 'end' : 'start');
                  const textDx = isParent ? (isFlipped ? 6 : -6) : (isFlipped ? -6 : 6);

                  return (
                    <g
                      key={key || idx}
                      className={cn(styles.nodeGroup, hoveredNode && !isHighlighted && styles.nodeDimmed)}
                      transform={labelTransform}
                      onMouseEnter={() => interactive && setHoveredNode(node)}
                      onMouseLeave={() => interactive && setHoveredNode(null)}
                      onClick={() => onNodeClick?.(node)}
                    >
                      {/* Radial Bullet Circle */}
                      <circle
                        className={cn(
                          styles.nodeDot,
                          isParent ? styles.nodeDotInternal : styles.nodeDotLeaf,
                          isHovered && styles.nodeDotHovered
                        )}
                        r={isParent ? 3.5 : 2.5}
                      />

                      {/* Radial Node Label Text */}
                      <text
                        className={cn(styles.nodeText, isParent && styles.nodeTextInternal)}
                        dx={textDx}
                        dy="0.31em"
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
