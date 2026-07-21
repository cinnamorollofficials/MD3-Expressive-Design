import { useMemo, useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
import { cn } from '../../utils/cn';
import styles from './HorizontalBarChart.module.css';

export interface HorizontalBarChartProps {
  /** Array of data objects to render */
  data: any[];
  /** Key of the category/label value in each data object (used for Y axis) */
  yKey: string;
  /** Key of the numeric value for bar width (X axis) */
  xKey: string;
  /** Chart height in pixels. Width is responsive. */
  height?: number;
  /** Padding around the chart inside the SVG */
  margin?: { top: number; right: number; bottom: number; left: number };
  /** Show vertical grid lines */
  showGrid?: boolean;
  /** Show X and Y axes */
  showAxes?: boolean;
  /** Corner radius on the right end of bars */
  barRadius?: number;
  /** Padding ratio between bars (0 = no gap, 1 = all gap) */
  barPadding?: number;
  /** Fill color of the bars */
  color?: string;
  /** Show numeric value label at the end of each bar */
  showValueLabels?: boolean;
  /** Enable tooltip on hover */
  interactive?: boolean;
  /** Main chart title */
  title?: string;
  /** Subtitle below the title */
  subtitle?: string;
  /** Custom formatter for X-axis tick and tooltip values */
  xFormatter?: (val: number) => string;
  /** Custom formatter for Y-axis tick (category) labels */
  yFormatter?: (val: string) => string;
  /** Additional CSS class name */
  className?: string;
}

export function HorizontalBarChart({
  data = [],
  yKey,
  xKey,
  height = 400,
  margin,
  showGrid = true,
  showAxes = true,
  barRadius = 3,
  barPadding = 0.2,
  color = 'var(--md-sys-color-primary, #5985ab)',
  showValueLabels = true,
  interactive = true,
  title,
  subtitle,
  xFormatter,
  yFormatter,
  className,
}: HorizontalBarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(500);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Auto-compute left margin based on longest label
  const autoLeftMargin = useMemo(() => {
    const maxLen = Math.max(...data.map(d => String(d[yKey]).length));
    return Math.max(60, maxLen * 7 + 12);
  }, [data, yKey]);

  const resolvedMargin = margin ?? { top: 16, right: showValueLabels ? 56 : 24, bottom: 40, left: autoLeftMargin };

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

  const innerWidth = Math.max(0, containerWidth - resolvedMargin.left - resolvedMargin.right);
  const innerHeight = Math.max(0, height - resolvedMargin.top - resolvedMargin.bottom);

  // Scales
  const { xScale, yScale } = useMemo(() => {
    const xMax = d3.max(data, d => Number(d[xKey]) || 0) || 0;
    const xScale = d3.scaleLinear()
      .domain([0, xMax * 1.05])
      .range([0, innerWidth])
      .nice();

    const yScale = d3.scaleBand()
      .domain(data.map(d => String(d[yKey])))
      .range([0, innerHeight])
      .padding(barPadding);

    return { xScale, yScale };
  }, [data, xKey, yKey, innerWidth, innerHeight, barPadding]);

  // X axis ticks
  const xTicks = useMemo(() => {
    return xScale.ticks(6).map(val => ({
      pos: xScale(val),
      label: xFormatter ? xFormatter(val) : String(val),
    }));
  }, [xScale, xFormatter]);

  // Tooltip details
  const tooltip = useMemo(() => {
    if (hoveredIndex === null) return null;
    const d = data[hoveredIndex];
    const label = yFormatter ? yFormatter(String(d[yKey])) : String(d[yKey]);
    const value = xFormatter ? xFormatter(Number(d[xKey])) : String(Number(d[xKey]));
    const barW = xScale(Number(d[xKey]) || 0);
    const barMidY = (yScale(String(d[yKey])) ?? 0) + yScale.bandwidth() / 2;
    return { label, value, x: barW / 2, y: barMidY };
  }, [hoveredIndex, data, xKey, yKey, xScale, yScale, xFormatter, yFormatter]);

  return (
    <div
      className={cn(styles.root, className)}
      ref={containerRef}
      data-md3-component="horizontal-bar-chart"
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
            <g transform={`translate(${resolvedMargin.left}, ${resolvedMargin.top})`}>

              {/* Vertical grid lines */}
              {showGrid && xTicks.map((tick, i) => (
                <line
                  key={i}
                  className={styles.gridLine}
                  x1={tick.pos}
                  y1={0}
                  x2={tick.pos}
                  y2={innerHeight}
                />
              ))}

              {/* Bars */}
              {data.map((d, i) => {
                const yVal = String(d[yKey]);
                const xVal = Number(d[xKey]) || 0;
                const y = yScale(yVal) ?? 0;
                const barH = yScale.bandwidth();
                const barW = xScale(xVal);
                const r = Math.min(barRadius, barH / 2, barW);

                // Rounded right-only bar path
                const barPath = barW <= 0 ? '' :
                  `M 0,${y}
                   L ${barW - r},${y}
                   Q ${barW},${y} ${barW},${y + r}
                   L ${barW},${y + barH - r}
                   Q ${barW},${y + barH} ${barW - r},${y + barH}
                   L 0,${y + barH}
                   Z`;

                const valueLabel = xFormatter ? xFormatter(xVal) : String(xVal);

                return (
                  <g key={i}>
                    <path
                      className={styles.bar}
                      d={barPath}
                      fill={color}
                      opacity={hoveredIndex !== null && hoveredIndex !== i ? 0.55 : 1}
                      onMouseEnter={() => interactive && setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    />
                    {showValueLabels && barW > 0 && (
                      <text
                        className={styles.valueLabel}
                        x={barW + 6}
                        y={y + barH / 2}
                        dy="0.35em"
                      >
                        {valueLabel}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Y Axis (category labels) */}
              {showAxes && (
                <g className={styles.axis}>
                  <line
                    className={styles.axisLine}
                    x1={0} y1={0} x2={0} y2={innerHeight}
                  />
                  {data.map((d, i) => {
                    const yVal = String(d[yKey]);
                    const y = (yScale(yVal) ?? 0) + yScale.bandwidth() / 2;
                    const label = yFormatter ? yFormatter(yVal) : yVal;
                    return (
                      <g key={i} transform={`translate(0, ${y})`}>
                        <line className={styles.axisTickLine} x1={-5} y1={0} x2={0} y2={0} />
                        <text
                          className={styles.axisText}
                          x={-10}
                          dy="0.35em"
                          textAnchor="end"
                        >
                          {label}
                        </text>
                      </g>
                    );
                  })}
                </g>
              )}

              {/* X Axis (value ticks at bottom) */}
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
                        {tick.label}
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
              left: tooltip.x + resolvedMargin.left,
              top: tooltip.y + resolvedMargin.top,
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
