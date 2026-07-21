import { useMemo, useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
import { cn } from '../../utils/cn';
import styles from './BarChart.module.css';

export interface BarChartProps {
  /** Array of data objects to render */
  data: any[];
  /** Key of the category/label value in each data object (used for X axis) */
  xKey: string;
  /** Key of the numeric value to use for bar height (Y axis) */
  yKey: string;
  /** Chart height in pixels. Width is responsive. */
  height?: number;
  /** Padding around the chart inside the SVG */
  margin?: { top: number; right: number; bottom: number; left: number };
  /** Show horizontal grid lines */
  showGrid?: boolean;
  /** Show X and Y axes */
  showAxes?: boolean;
  /** Corner radius on bars */
  barRadius?: number;
  /** Padding ratio between bars (0 = no gap, 1 = all gap) */
  barPadding?: number;
  /** Fill color of the bars */
  color?: string;
  /** Enable tooltip on hover */
  interactive?: boolean;
  /** Main chart title */
  title?: string;
  /** Subtitle below the title */
  subtitle?: string;
  /** Custom formatter for Y-axis tick labels */
  yFormatter?: (val: any) => string;
  /** Custom formatter for X-axis tick labels */
  xFormatter?: (val: any) => string;
  /** Additional CSS class name */
  className?: string;
}

export function BarChart({
  data = [],
  xKey,
  yKey,
  height = 320,
  margin = { top: 24, right: 16, bottom: 40, left: 52 },
  showGrid = true,
  showAxes = true,
  barRadius = 3,
  barPadding = 0.15,
  color = 'var(--md-sys-color-primary, #5985ab)',
  interactive = true,
  title,
  subtitle,
  yFormatter,
  xFormatter,
  className,
}: BarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(500);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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

  // Scales
  const { xScale, yScale } = useMemo(() => {
    const xScale = d3.scaleBand()
      .domain(data.map(d => String(d[xKey])))
      .range([0, innerWidth])
      .padding(barPadding);

    const yMax = d3.max(data, d => Number(d[yKey]) || 0) || 0;
    const yScale = d3.scaleLinear()
      .domain([0, yMax * 1.05])
      .range([innerHeight, 0])
      .nice();

    return { xScale, yScale };
  }, [data, xKey, yKey, innerWidth, innerHeight, barPadding]);

  // Y axis ticks
  const yTicks = useMemo(() => {
    return yScale.ticks(6).map(val => ({
      pos: yScale(val),
      label: yFormatter ? yFormatter(val) : String(val),
    }));
  }, [yScale, yFormatter]);

  // X axis labels (skip labels if too many bars)
  const xTicks = useMemo(() => {
    const domain = xScale.domain();
    const bandwidth = xScale.bandwidth();
    const skipFactor = bandwidth < 20 ? Math.ceil(20 / bandwidth) : 1;
    return domain
      .map((d, i) => (i % skipFactor === 0 ? { key: d, pos: (xScale(d) ?? 0) + bandwidth / 2 } : null))
      .filter(Boolean) as { key: string; pos: number }[];
  }, [xScale]);

  // Hover tooltip details
  const tooltip = useMemo(() => {
    if (hoveredIndex === null) return null;
    const d = data[hoveredIndex];
    const label = xFormatter ? xFormatter(d[xKey]) : String(d[xKey]);
    const value = yFormatter ? yFormatter(Number(d[yKey])) : String(Number(d[yKey]));
    const x = (xScale(String(d[xKey])) ?? 0) + xScale.bandwidth() / 2;
    const y = yScale(Number(d[yKey]) || 0);
    return { label, value, x, y };
  }, [hoveredIndex, data, xKey, yKey, xScale, yScale, xFormatter, yFormatter]);

  return (
    <div
      className={cn(styles.root, className)}
      ref={containerRef}
      data-md3-component="bar-chart"
    >
      {(title || subtitle) && (
        <div className={styles.header}>
          {title && <h4 className={styles.title}>{title}</h4>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}

      <div className={styles.chartContainer} style={{ height }}>
        {innerWidth > 0 && (
          <svg
            className={styles.svg}
            width={containerWidth}
            height={height}
            viewBox={`0 0 ${containerWidth} ${height}`}
          >
            <g transform={`translate(${margin.left}, ${margin.top})`}>

              {/* Grid lines */}
              {showGrid && yTicks.map((tick, i) => (
                <line
                  key={i}
                  className={styles.gridLine}
                  x1={0}
                  y1={tick.pos}
                  x2={innerWidth}
                  y2={tick.pos}
                />
              ))}

              {/* Bars */}
              {data.map((d, i) => {
                const xVal = String(d[xKey]);
                const yVal = Number(d[yKey]) || 0;
                const x = xScale(xVal) ?? 0;
                const barW = xScale.bandwidth();
                const barH = innerHeight - yScale(yVal);
                const r = Math.min(barRadius, barW / 2, barH);

                // Rounded top-only path using top-left, top-right radius
                const barPath = barH <= 0 ? '' :
                  `M ${x},${innerHeight}
                   L ${x},${yScale(yVal) + r}
                   Q ${x},${yScale(yVal)} ${x + r},${yScale(yVal)}
                   L ${x + barW - r},${yScale(yVal)}
                   Q ${x + barW},${yScale(yVal)} ${x + barW},${yScale(yVal) + r}
                   L ${x + barW},${innerHeight}
                   Z`;

                return (
                  <path
                    key={i}
                    className={styles.bar}
                    d={barPath}
                    fill={color}
                    opacity={hoveredIndex !== null && hoveredIndex !== i ? 0.55 : 1}
                    onMouseEnter={() => interactive && setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                );
              })}

              {/* Y Axis */}
              {showAxes && (
                <g className={styles.axis}>
                  <line
                    className={styles.axisLine}
                    x1={0} y1={0} x2={0} y2={innerHeight}
                  />
                  {yTicks.map((tick, i) => (
                    <g key={i} transform={`translate(0, ${tick.pos})`}>
                      <line className={styles.axisTickLine} x1={-5} y1={0} x2={0} y2={0} />
                      <text
                        className={styles.axisText}
                        x={-10}
                        dy="0.32em"
                        textAnchor="end"
                      >
                        {tick.label}
                      </text>
                    </g>
                  ))}
                </g>
              )}

              {/* X Axis */}
              {showAxes && (
                <g className={styles.axis} transform={`translate(0, ${innerHeight})`}>
                  <line
                    className={styles.axisLine}
                    x1={0} y1={0} x2={innerWidth} y2={0}
                  />
                  {xTicks.map((tick, i) => (
                    <g key={i} transform={`translate(${tick.pos}, 0)`}>
                      <line className={styles.axisTickLine} x1={0} y1={0} x2={0} y2={5} />
                      <text
                        className={styles.axisText}
                        y={18}
                        textAnchor="middle"
                      >
                        {xFormatter ? xFormatter(tick.key) : tick.key}
                      </text>
                    </g>
                  ))}
                </g>
              )}
            </g>
          </svg>
        )}

        {/* Tooltip */}
        {interactive && tooltip && (
          <div
            className={styles.tooltip}
            style={{
              left: tooltip.x + margin.left,
              top: tooltip.y + margin.top,
            }}
          >
            <span className={styles.tooltipLabel}>{tooltip.label}</span>
            <span className={styles.tooltipValue}>{tooltip.value}</span>
          </div>
        )}
      </div>
    </div>
  );
}
