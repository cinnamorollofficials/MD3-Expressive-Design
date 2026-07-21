import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { cn } from '../../utils/cn';
import styles from './ChordDiagram.module.css';

export interface ChordNode {
  name: string;
  color?: string;
  [key: string]: any;
}

export interface ChordLink {
  source: string | number;
  target: string | number;
  value: number;
  [key: string]: any;
}

export interface ChordDiagramProps {
  /** Square matrix matrix[i][j] representing flow from node i to node j */
  matrix?: number[][];
  /** Array of node names / objects (used with matrix or links) */
  nodes?: ChordNode[] | string[];
  /** Array of link objects (alternative to matrix) */
  links?: ChordLink[];
  /** Chart height / outer width in pixels */
  height?: number;
  /** Angle gap between outer arcs in radians (default 0.04) */
  padAngle?: number;
  /** Palette of colors for node groups */
  colors?: string[];
  /** Show node group text labels around circle perimeter */
  showLabels?: boolean;
  /** Show tick marks and percentage/value labels on outer arcs */
  showTicks?: boolean;
  /** Show group legend below diagram */
  showLegend?: boolean;
  /** Enable hover highlight and tooltips */
  interactive?: boolean;
  /** Ribbon color strategy: 'source' | 'target' | 'gradient' */
  ribbonColorMode?: 'source' | 'target' | 'gradient';
  /** Main chart title */
  title?: string;
  /** Subtitle description */
  subtitle?: string;
  /** Custom value formatter */
  valueFormatter?: (val: number) => string;
  /** Callback triggered when a group arc is clicked */
  onGroupClick?: (groupIndex: number, node: ChordNode) => void;
  /** Callback triggered when a ribbon is clicked */
  onRibbonClick?: (chord: any) => void;
  /** Additional CSS class name */
  className?: string;
}

const DEFAULT_COLORS = [
  '#C2C2C2', // Light Grey (Apple in reference image)
  '#8BC34A', // Lime (HTC)
  '#E53935', // Red (Huawei)
  '#E91E63', // Pink/Magenta (LG)
  '#03A9F4', // Light Blue (Nokia)
  '#3F51B5', // Indigo/Blue (Samsung)
  '#004D40', // Dark Green (Sony)
  '#757575', // Dark Grey (Other)
  '#FF9800', // Orange
  '#9C27B0', // Purple
];

export function ChordDiagram({
  matrix: inputMatrix,
  nodes: inputNodes = [],
  links = [],
  height = 680,
  padAngle = 0.04,
  colors = DEFAULT_COLORS,
  showLabels = true,
  showTicks = true,
  showLegend = true,
  interactive = true,
  ribbonColorMode = 'gradient',
  title,
  subtitle,
  valueFormatter,
  onGroupClick,
  onRibbonClick,
  className,
}: ChordDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(680);

  const [hoveredGroup, setHoveredGroup] = useState<number | null>(null);
  const [hoveredChord, setHoveredChord] = useState<any | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [selectedGroups, setSelectedGroups] = useState<Set<number>>(new Set());

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

  // Format node names
  const nodeObjects: ChordNode[] = useMemo(() => {
    return inputNodes.map((n) => (typeof n === 'string' ? { name: n } : n));
  }, [inputNodes]);

  // Compute final square matrix
  const { matrix, nodeLabels } = useMemo(() => {
    if (inputMatrix && inputMatrix.length > 0) {
      const labels = nodeObjects.map((n, i) => n.name || `Node ${i + 1}`);
      return { matrix: inputMatrix, nodeLabels: labels };
    }

    if (nodeObjects.length > 0 && links.length > 0) {
      const n = nodeObjects.length;
      const mat = Array.from({ length: n }, () => Array(n).fill(0));
      const nameMap = new Map<string, number>();
      nodeObjects.forEach((node, i) => {
        if (node.name) nameMap.set(node.name, i);
      });

      links.forEach((l) => {
        const s = typeof l.source === 'number' ? l.source : nameMap.get(String(l.source));
        const t = typeof l.target === 'number' ? l.target : nameMap.get(String(l.target));
        if (s !== undefined && t !== undefined && s < n && t < n) {
          mat[s][t] += Number(l.value) || 0;
        }
      });

      const labels = nodeObjects.map((node, i) => node.name || `Node ${i + 1}`);
      return { matrix: mat, nodeLabels: labels };
    }

    // Default sample matrix if none provided
    const sampleMat = [
      [11975, 5871, 8916, 2868],
      [1951, 10048, 2060, 6171],
      [8010, 16145, 8090, 8045],
      [1013, 990, 940, 6907],
    ];
    const sampleLabels = ['Group A', 'Group B', 'Group C', 'Group D'];
    return { matrix: sampleMat, nodeLabels: sampleLabels };
  }, [inputMatrix, nodeObjects, links]);

  // Compute D3 Chord Layout
  const outerRadius = Math.min(containerWidth, height) * 0.4 - 40;
  const innerRadius = Math.max(10, outerRadius - 20);

  const chordsData = useMemo(() => {
    if (outerRadius <= 0 || matrix.length === 0) return null;

    const chordGenerator = d3
      .chord()
      .padAngle(padAngle)
      .sortSubgroups(d3.descending);

    try {
      const chords = chordGenerator(matrix);
      return chords;
    } catch (e) {
      console.warn('Chord calculation warning:', e);
      return null;
    }
  }, [matrix, padAngle, outerRadius]);

  // Arc path generator for outer group arcs
  const arcGenerator = useMemo(() => {
    return d3
      .arc<any>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius) as (d: any) => string | null;
  }, [innerRadius, outerRadius]);

  // Ribbon path generator for inner flow connections
  const ribbonGenerator = useMemo(() => {
    return d3
      .ribbon<any, any>()
      .radius(innerRadius) as (d: any) => string | null;
  }, [innerRadius]);


  // Color accessor
  const getGroupColor = useCallback(
    (index: number) => {
      const nObj = nodeObjects[index];
      if (nObj && nObj.color) return nObj.color;
      return colors[index % colors.length];
    },
    [nodeObjects, colors]
  );

  // Format value helper
  const formatVal = (val: number) => (valueFormatter ? valueFormatter(val) : String(val));

  // Connected chords set for hover isolation
  const activeHoverState = useMemo(() => {
    if (hoveredGroup !== null) {
      const connectedChords = new Set<any>();
      const connectedGroups = new Set<number>([hoveredGroup]);

      if (chordsData) {
        chordsData.forEach((c) => {
          if (c.source.index === hoveredGroup || c.target.index === hoveredGroup) {
            connectedChords.add(c);
            connectedGroups.add(c.source.index);
            connectedGroups.add(c.target.index);
          }
        });
      }
      return { connectedGroups, connectedChords };
    }

    if (hoveredChord !== null) {
      const connectedChords = new Set<any>([hoveredChord]);
      const connectedGroups = new Set<number>([hoveredChord.source.index, hoveredChord.target.index]);
      return { connectedGroups, connectedChords };
    }

    return null;
  }, [hoveredGroup, hoveredChord, chordsData]);

  const toggleGroupFilter = (idx: number) => {
    setSelectedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const centerPos = { x: containerWidth / 2, y: height / 2 };

  return (
    <div className={cn(styles.root, className)} ref={containerRef} data-md3-component="chord-diagram">
      {(title || subtitle) && (
        <div className={styles.header}>
          <div className={styles.headerText}>
            {title && <h4 className={styles.title}>{title}</h4>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
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
          setHoveredGroup(null);
          setHoveredChord(null);
          setMousePos(null);
        }}

      >
        <svg className={styles.svg} width={containerWidth} height={height}>
          {chordsData && (
            <g transform={`translate(${centerPos.x}, ${centerPos.y})`}>
              {/* Defs for Linear Gradients */}
              <defs>
                {chordsData.map((chord: any, idx: number) => {
                  const sColor = getGroupColor(chord.source.index);
                  const tColor = getGroupColor(chord.target.index);
                  const gradId = `chord-grad-${idx}`;
                  return (
                    <linearGradient key={gradId} id={gradId} gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor={sColor} />
                      <stop offset="100%" stopColor={tColor} />
                    </linearGradient>
                  );
                })}
              </defs>

              {/* Inner Ribbons Layer */}
              <g className="ribbons-layer">
                {chordsData.map((chord: any, idx: number) => {
                  const d = ribbonGenerator(chord);
                  if (!d) return null;

                  const sIdx = chord.source.index;
                  const tIdx = chord.target.index;
                  const sColor = getGroupColor(sIdx);
                  const tColor = getGroupColor(tIdx);

                  const fillStyle =
                    ribbonColorMode === 'gradient'
                      ? `url(#chord-grad-${idx})`
                      : ribbonColorMode === 'source'
                      ? sColor
                      : tColor;

                  const isGroupFiltered =
                    selectedGroups.size > 0 && !selectedGroups.has(sIdx) && !selectedGroups.has(tIdx);
                  const isDimmed = isGroupFiltered || (activeHoverState && !activeHoverState.connectedChords.has(chord));
                  const isHighlighted = activeHoverState && activeHoverState.connectedChords.has(chord);

                  return (
                    <path
                      key={idx}
                      className={cn(
                        styles.ribbon,
                        isDimmed && styles.ribbonDimmed,
                        isHighlighted && styles.ribbonHighlighted
                      )}
                      d={d}
                      fill={fillStyle}
                      onMouseEnter={() => interactive && setHoveredChord(chord)}
                      onMouseLeave={() => interactive && setHoveredChord(null)}
                      onClick={() => onRibbonClick?.(chord)}
                    />
                  );
                })}
              </g>

              {/* Outer Group Arcs Layer */}
              <g className="groups-layer">
                {chordsData.groups.map((group: any) => {
                  const idx = group.index;
                  const color = getGroupColor(idx);
                  const arcD = arcGenerator(group);

                  const isFiltered = selectedGroups.size > 0 && !selectedGroups.has(idx);
                  const isDimmed = isFiltered || (activeHoverState && !activeHoverState.connectedGroups.has(idx));
                  const isHighlighted = activeHoverState && activeHoverState.connectedGroups.has(idx);

                  // Ticks computation with percentage number indicators
                  const ticks = [];
                  if (showTicks && group.value > 0) {
                    const totalMatrixSum = d3.sum(chordsData.groups, (d: any) => d.value) || 1;
                    const numTicks = 5;
                    const step = group.value / numTicks;
                    const k = (group.endAngle - group.startAngle) / group.value;

                    for (let i = 0; i <= numTicks; i++) {
                      const v = i * step;
                      const a = group.startAngle + v * k;
                      const pct = Math.round((v / totalMatrixSum) * 100);

                      ticks.push({
                        value: v,
                        angle: a,
                        label: `${pct}%`,
                        tx: outerRadius * Math.sin(a),
                        ty: -outerRadius * Math.cos(a),
                      });
                    }
                  }

                  // Group text label position (pushed slightly further out)
                  const angle = (group.startAngle + group.endAngle) / 2;
                  const labelRadius = outerRadius + (showTicks ? 32 : 16);
                  const lx = labelRadius * Math.sin(angle);
                  const ly = -labelRadius * Math.cos(angle);
                  const isRightHalf = angle < Math.PI;

                  return (
                    <g key={idx}>
                      <path
                        className={cn(
                          styles.groupArc,
                          isDimmed && styles.groupDimmed,
                          isHighlighted && styles.groupHighlighted
                        )}
                        d={arcD || ''}
                        fill={color}
                        onMouseEnter={() => interactive && setHoveredGroup(idx)}
                        onMouseLeave={() => interactive && setHoveredGroup(null)}
                        onClick={() => onGroupClick?.(idx, nodeObjects[idx])}
                      />

                      {/* Ticks with percentage number indicators */}
                      {showTicks &&
                        ticks.map((t, tIdx) => {
                          const isFarHalf = t.angle > Math.PI;
                          const rot = (t.angle * 180) / Math.PI - 90;
                          const textRot = isFarHalf ? rot + 180 : rot;

                          return (
                            <g
                              key={tIdx}
                              transform={`translate(${t.tx}, ${t.ty}) rotate(${textRot})`}
                            >
                              <line
                                className={styles.tickLine}
                                x1={0}
                                y1={0}
                                x2={isFarHalf ? -4 : 4}
                                y2={0}
                              />
                              <text
                                className={cn(styles.tickText, isDimmed && styles.groupDimmed)}
                                x={isFarHalf ? -6 : 6}
                                y={3}
                                textAnchor={isFarHalf ? 'end' : 'start'}
                              >
                                {t.label}
                              </text>
                            </g>
                          );
                        })}

                      {/* Outer Text Label */}
                      {showLabels && nodeLabels[idx] && (
                        <text
                          className={cn(styles.groupText, isDimmed && styles.groupDimmed)}
                          x={lx}
                          y={ly}
                          dy="0.35em"
                          textAnchor={isRightHalf ? 'start' : 'end'}
                          transform={`rotate(${((angle * 180) / Math.PI - 90)}, ${lx}, ${ly})`}
                        >
                          {nodeLabels[idx]} ↓
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
        {interactive && (hoveredGroup !== null || hoveredChord !== null) && mousePos && (
          <div
            className={styles.tooltip}
            style={{
              left: Math.min(containerWidth - 120, Math.max(120, mousePos.x)),
              top: mousePos.y,
            }}
          >
            {hoveredGroup !== null && chordsData && (
              <>
                <span className={styles.tooltipTitle}>{nodeLabels[hoveredGroup]}</span>
                <div className={styles.tooltipRow}>
                  <span>Total Volume:</span>
                  <span className={styles.tooltipValue}>
                    {formatVal(chordsData.groups[hoveredGroup].value)}
                  </span>
                </div>
              </>
            )}

            {hoveredChord !== null && hoveredGroup === null && (
              <>
                <span className={styles.tooltipTitle}>
                  {nodeLabels[hoveredChord.source.index]} ↔ {nodeLabels[hoveredChord.target.index]}
                </span>
                <div className={styles.tooltipRow}>
                  <span>{nodeLabels[hoveredChord.source.index]} Flow:</span>
                  <span className={styles.tooltipValue}>{formatVal(hoveredChord.source.value)}</span>
                </div>
                <div className={styles.tooltipRow}>
                  <span>{nodeLabels[hoveredChord.target.index]} Flow:</span>
                  <span className={styles.tooltipValue}>{formatVal(hoveredChord.target.value)}</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Group Legend */}
      {showLegend && nodeLabels.length > 0 && (
        <div className={styles.legend}>
          {nodeLabels.map((label, idx) => {
            const color = getGroupColor(idx);
            const isSelected = selectedGroups.has(idx);

            return (
              <div
                key={idx}
                className={cn(
                  styles.legendItem,
                  selectedGroups.size > 0 && !isSelected && styles.legendItemDimmed
                )}
                onClick={() => toggleGroupFilter(idx)}
              >
                <div className={styles.legendDot} style={{ backgroundColor: color }} />
                <span>{label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
