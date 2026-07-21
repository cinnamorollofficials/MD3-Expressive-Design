import { useMemo, useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
import { cn } from '../../utils/cn';
import styles from './TimelineChart.module.css';

export interface TimelineChartProps {
  /** Array of timeline data objects */
  data: any[];
  /** Unique key/identifier for each timeline row */
  idKey: string;
  /** Key of the text label for the bar */
  labelKey: string;
  /** Key of the start year (negative for BC, positive for AD) */
  startKey: string;
  /** Key of the end year (negative for BC, positive for AD) */
  endKey: string;
  /** Key of the category/region for bar coloring */
  categoryKey?: string;
  /** List of hex colors for categorical mapping */
  colors?: string[];
  /** Height of the chart drawing area in pixels */
  height?: number;
  /** Padding around the chart inside the SVG */
  margin?: { top: number; right: number; bottom: number; left: number };
  /** Show vertical grid reference lines */
  showGrid?: boolean;
  /** Show the top year axis */
  showAxes?: boolean;
  /** Enable hover tooltips and interactive tracking line */
  interactive?: boolean;
  /** Main chart title */
  title?: string;
  /** Subtitle below the title */
  subtitle?: string;
  /** Additional CSS class name */
  className?: string;
}

const DEFAULT_COLORS = [
  '#4eb3a9', // teal
  '#f09438', // orange
  '#5985ab', // steel blue
  '#a37aa3', // purple
  '#e3be58', // yellow
  '#91735d', // greyish brown
  '#d65a60', // red-orange
  '#5aa663', // green
  '#4671a3', // royal blue
];

export function TimelineChart({
  data = [],
  idKey,
  labelKey,
  startKey,
  endKey,
  categoryKey,
  colors = DEFAULT_COLORS,
  height = 680,
  margin = { top: 40, right: 160, bottom: 20, left: 160 },
  showGrid = true,
  showAxes = true,
  interactive = true,
  title,
  subtitle,
  className,
}: TimelineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const [sortBy, setSortBy] = useState<'time' | 'duration' | 'name'>('time');
  const [hoveredRow, setHoveredRow] = useState<{
    id: string;
    label: string;
    start: number;
    end: number;
    category?: string;
    x: number;
    y: number;
  } | null>(null);

  // Responsive width via ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      if (width > 0) setContainerWidth(width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const innerWidth = Math.max(0, containerWidth - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);

  // Sort data dynamically
  const sortedData = useMemo(() => {
    const cloned = [...data];
    if (sortBy === 'time') {
      // Sort chronologically by start date
      return cloned.sort((a, b) => (Number(a[startKey]) || 0) - (Number(b[startKey]) || 0));
    } else if (sortBy === 'duration') {
      // Sort by duration descending (longest to shortest)
      return cloned.sort((a, b) => {
        const durA = (Number(a[endKey]) || 0) - (Number(a[startKey]) || 0);
        const durB = (Number(b[endKey]) || 0) - (Number(b[startKey]) || 0);
        return durB - durA;
      });
    } else if (sortBy === 'name') {
      // Sort alphabetically
      return cloned.sort((a, b) => String(a[labelKey]).localeCompare(String(b[labelKey])));
    }
    return cloned;
  }, [data, sortBy, startKey, endKey, labelKey]);

  // Color mapping scale
  const colorScale = useMemo(() => {
    if (!categoryKey) return () => 'var(--md-sys-color-primary, #4eb3a9)';
    const uniqueCategories = Array.from(new Set(data.map(d => String(d[categoryKey])).filter(Boolean)));
    return d3.scaleOrdinal<string>()
      .domain(uniqueCategories)
      .range(colors);
  }, [data, categoryKey, colors]);

  // Scales
  const { xScale, yScale } = useMemo(() => {
    const startMin = d3.min(data, d => Number(d[startKey]) || 0) || -3500;
    const endMax = d3.max(data, d => Number(d[endKey]) || 0) || 2000;

    const xScale = d3.scaleLinear()
      .domain([startMin - 100, endMax + 100])
      .range([0, innerWidth]);

    const yScale = d3.scaleBand()
      .domain(sortedData.map(d => String(d[idKey])))
      .range([0, innerHeight])
      .padding(0.3);

    return { xScale, yScale };
  }, [data, sortedData, startKey, endKey, idKey, innerWidth, innerHeight]);

  // Generate Year tick marks formatted as BC/AD
  const yearTicks = useMemo(() => {
    const domain = xScale.domain();
    const step = 500;
    const start = Math.ceil(domain[0] / step) * step;
    const end = Math.floor(domain[1] / step) * step;
    const ticks = [];
    for (let yr = start; yr <= end; yr += step) {
      // Skip year 0 formatting standard, mapping to BC/AD labels
      let label = '';
      if (yr < 0) {
        label = `${Math.abs(yr)}BC`;
      } else {
        label = `${yr}AD`;
      }
      ticks.push({ year: yr, pos: xScale(yr), label });
    }
    return ticks;
  }, [xScale]);

  // Year formatting helper for tooltips
  const formatYear = (yr: number) => {
    return yr < 0 ? `${Math.abs(yr)} BC` : `${yr} AD`;
  };

  return (
    <div
      className={cn(styles.root, className)}
      ref={containerRef}
      data-md3-component="timeline-chart"
    >
      <div className={styles.controlsHeader}>
        <div className={styles.header}>
          {title && <h4 className={styles.title}>{title}</h4>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>

        {/* Sorting Dropdown */}
        <div className={styles.sortControl}>
          <label htmlFor="timeline-sort">Sorted by</label>
          <select
            id="timeline-sort"
            className={styles.select}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="time">time</option>
            <option value="duration">duration</option>
            <option value="name">name</option>
          </select>
        </div>
      </div>

      <div className={styles.chartContainer} style={{ height }}>
        {innerWidth > 0 && (
          <svg
            className={styles.svg}
            width={containerWidth}
            height={height}
            viewBox={`0 0 ${containerWidth} ${height}`}
          >
            <g transform={`translate(${margin.left}, ${margin.top})`}>

              {/* Vertical timeline grid lines */}
              {showGrid && yearTicks.map((tick, i) => (
                <line
                  key={i}
                  className={styles.gridLine}
                  x1={tick.pos}
                  y1={0}
                  x2={tick.pos}
                  y2={innerHeight}
                />
              ))}

              {/* Timeline duration bars */}
              {sortedData.map((d) => {
                const id = String(d[idKey]);
                const label = String(d[labelKey]);
                const startVal = Number(d[startKey]) || 0;
                const endVal = Number(d[endKey]) || 0;

                const x1 = xScale(startVal);
                const x2 = xScale(endVal);
                const y = yScale(id) ?? 0;
                const barW = Math.max(3, x2 - x1);
                const barH = yScale.bandwidth();
                const color = categoryKey ? colorScale(String(d[categoryKey])) : 'var(--md-sys-color-primary)';

                // Smart text alignment (if bar starts after 35% of chart width, place label on left; otherwise right)
                const labelOnLeft = x1 > innerWidth * 0.35;
                const textX = labelOnLeft ? x1 - 8 : x2 + 8;
                const textAnchor = labelOnLeft ? 'end' : 'start';

                const handleMouseEnter = () => {
                  if (!interactive) return;
                  setHoveredRow({
                    id,
                    label,
                    start: startVal,
                    end: endVal,
                    category: categoryKey ? String(d[categoryKey]) : undefined,
                    x: (x1 + x2) / 2,
                    y: y + barH / 2,
                  });
                };

                return (
                  <g key={id}>
                    <rect
                      className={styles.bar}
                      x={x1}
                      y={y}
                      width={barW}
                      height={barH}
                      fill={color}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={() => setHoveredRow(null)}
                    />
                    <text
                      className={styles.barLabel}
                      x={textX}
                      y={y + barH / 2}
                      dy="0.35em"
                      textAnchor={textAnchor}
                    >
                      {label}
                    </text>
                  </g>
                );
              })}

              {/* Top Axis */}
              {showAxes && (
                <g className={styles.axis}>
                  <line
                    className={styles.axisLine}
                    x1={0}
                    y1={0}
                    x2={innerWidth}
                    y2={0}
                  />
                  {yearTicks.map((tick, i) => (
                    <g key={i} transform={`translate(${tick.pos}, 0)`}>
                      <line
                        className={styles.axisTickLine}
                        x1={0}
                        y1={0}
                        x2={0}
                        y2={-6}
                      />
                      <text
                        className={styles.axisText}
                        y={-14}
                        textAnchor="middle"
                      >
                        {tick.label}
                      </text>
                    </g>
                  ))}
                </g>
              )}

              {/* Red tracker line overlaying the hovered timeline point */}
              {interactive && hoveredRow && (
                <line
                  className={styles.trackerLine}
                  x1={hoveredRow.x}
                  y1={0}
                  x2={hoveredRow.x}
                  y2={innerHeight}
                />
              )}
            </g>
          </svg>
        )}

        {/* Hover Tooltip Details */}
        {interactive && hoveredRow && (
          <div
            className={styles.tooltip}
            style={{
              left: hoveredRow.x + margin.left,
              top: hoveredRow.y + margin.top,
              borderLeft: `4px solid ${hoveredRow.category ? colorScale(hoveredRow.category) : 'var(--md-sys-color-primary)'}`,
            }}
          >
            <span className={styles.tooltipTitle}>{hoveredRow.label}</span>
            {hoveredRow.category && (
              <span className={styles.tooltipSubtitle}>{hoveredRow.category}</span>
            )}
            <span className={styles.tooltipDates}>
              {formatYear(hoveredRow.start)} – {formatYear(hoveredRow.end)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
