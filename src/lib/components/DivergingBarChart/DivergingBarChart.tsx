import { useMemo, useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
import { cn } from '../../utils/cn';
import styles from './DivergingBarChart.module.css';

export interface DivergingBarChartProps {
  /** Array of data objects to render */
  data: any[];
  /** Key of the category/label value in each data object (Y axis) */
  yKey: string;
  /** Key of the numeric value — can be positive or negative (X axis) */
  xKey: string;
  /** Chart height in pixels. Width is responsive. */
  height?: number;
  /** Padding around the chart inside the SVG */
  margin?: { top: number; right: number; bottom: number; left: number };
  /** Show vertical grid lines */
  showGrid?: boolean;
  /** Show X and Y axes */
  showAxes?: boolean;
  /** Corner radius on the outer end of bars */
  barRadius?: number;
  /** Padding ratio between bars (0 = no gap, 1 = all gap) */
  barPadding?: number;
  /** Fill color for positive (right-extending) bars */
  positiveColor?: string;
  /** Fill color for negative (left-extending) bars */
  negativeColor?: string;
  /** Show numeric value label at the bar end */
  showValueLabels?: boolean;
  /** Enable hover tooltips */
  interactive?: boolean;
  /** Chart title */
  title?: string;
  /** Subtitle below the title */
  subtitle?: string;
  /** Legend labels for positive and negative [positive, negative] */
  legendLabels?: [string, string];
  /** Custom formatter for X-axis tick and tooltip values */
  xFormatter?: (val: number) => string;
  /** Additional CSS class name */
  className?: string;
}

const DEFAULT_POSITIVE_COLOR = '#4a90d9';
const DEFAULT_NEGATIVE_COLOR = '#e07050';

export function DivergingBarChart({
  data = [],
  yKey,
  xKey,
  height = 500,
  margin,
  showGrid = true,
  showAxes = true,
  barRadius = 3,
  barPadding = 0.15,
  positiveColor = DEFAULT_POSITIVE_COLOR,
  negativeColor = DEFAULT_NEGATIVE_COLOR,
  showValueLabels = true,
  interactive = true,
  title,
  subtitle,
  legendLabels,
  xFormatter,
  className,
}: DivergingBarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(600);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Auto left margin based on longest category label
  const autoLeftMargin = useMemo(() => {
    const maxLen = Math.max(...data.map(d => String(d[yKey]).length));
    return Math.max(80, maxLen * 7 + 16);
  }, [data, yKey]);

  // Right margin to fit value labels
  const autoRightMargin = showValueLabels ? 72 : 24;

  const resolvedMargin = margin ?? {
    top: 16,
    right: autoRightMargin,
    bottom: 40,
    left: autoLeftMargin,
  };

  // Responsive width
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

  // Scales — symmetric domain around 0
  const { xScale, yScale, xExtent } = useMemo(() => {
    const vals = data.map(d => Number(d[xKey]) || 0);
    const absMax = Math.max(...vals.map(Math.abs)) * 1.1;

    const xScale = d3.scaleLinear()
      .domain([-absMax, absMax])
      .range([0, innerWidth])
      .nice();

    const yScale = d3.scaleBand()
      .domain(data.map(d => String(d[yKey])))
      .range([0, innerHeight])
      .padding(barPadding);

    return { xScale, yScale, xExtent: absMax };
  }, [data, xKey, yKey, innerWidth, innerHeight, barPadding]);

  const zeroX = xScale(0);

  // X axis ticks (symmetric, skip 0 duplicate)
  const xTicks = useMemo(() => {
    return xScale.ticks(8).map(val => ({
      pos: xScale(val),
      label: xFormatter ? xFormatter(val) : (val >= 0 ? `+${val}` : String(val)),
    }));
  }, [xScale, xFormatter]);

  // Tooltip state
  const tooltip = useMemo(() => {
    if (hoveredIndex === null) return null;
    const d = data[hoveredIndex];
    const val = Number(d[xKey]) || 0;
    const label = String(d[yKey]);
    const formattedVal = xFormatter ? xFormatter(val) : (val >= 0 ? `+${val}` : String(val));
    const barEnd = xScale(val);
    const midY = (yScale(label) ?? 0) + yScale.bandwidth() / 2;
    // Tooltip appears above bar midpoint
    const tipX = (zeroX + barEnd) / 2;
    return { label, value: formattedVal, x: tipX, y: midY, positive: val >= 0 };
  }, [hoveredIndex, data, xKey, yKey, xScale, yScale, zeroX, xFormatter]);

  return (
    <div
      className={cn(styles.root, className)}
      ref={containerRef}
      data-md3-component="diverging-bar-chart"
    >
      {(title || subtitle) && (
        <div className={styles.header}>
          {title && <h4 className={styles.title}>{title}</h4>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}

      {legendLabels && (
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: negativeColor }} />
            {legendLabels[1]}
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: positiveColor }} />
            {legendLabels[0]}
          </div>
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
                const label = String(d[yKey]);
                const val = Number(d[xKey]) || 0;
                const y = yScale(label) ?? 0;
                const barH = yScale.bandwidth();
                const isPositive = val >= 0;

                const barStart = isPositive ? zeroX : xScale(val);
                const barEnd = isPositive ? xScale(val) : zeroX;
                const barW = Math.max(0, barEnd - barStart);
                const r = Math.min(barRadius, barH / 2, barW);

                // Rounded on the far end only
                const barPath = barW <= 0 ? '' : isPositive
                  // Positive: rounded on right end
                  ? `M ${barStart},${y}
                     L ${barEnd - r},${y}
                     Q ${barEnd},${y} ${barEnd},${y + r}
                     L ${barEnd},${y + barH - r}
                     Q ${barEnd},${y + barH} ${barEnd - r},${y + barH}
                     L ${barStart},${y + barH}
                     Z`
                  // Negative: rounded on left end
                  : `M ${barEnd},${y}
                     L ${barStart + r},${y}
                     Q ${barStart},${y} ${barStart},${y + r}
                     L ${barStart},${y + barH - r}
                     Q ${barStart},${y + barH} ${barStart + r},${y + barH}
                     L ${barEnd},${y + barH}
                     Z`;

                const formattedVal = xFormatter
                  ? xFormatter(val)
                  : (val >= 0 ? `+${val.toLocaleString()}` : val.toLocaleString());

                return (
                  <g
                    key={i}
                    onMouseEnter={() => interactive && setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <path
                      className={isPositive ? styles.barPositive : styles.barNegative}
                      d={barPath}
                      fill={isPositive ? positiveColor : negativeColor}
                      opacity={hoveredIndex !== null && hoveredIndex !== i ? 0.55 : 1}
                    />
                    {/* Category label centered on zero line */}
                    {showAxes && (
                      <text
                        className={styles.categoryLabel}
                        x={zeroX - 6}
                        y={y + barH / 2}
                        dy="0.35em"
                        textAnchor="end"
                      >
                        {label}
                      </text>
                    )}
                    {/* Value label at bar end */}
                    {showValueLabels && barW > 0 && (
                      <text
                        className={styles.valueLabel}
                        x={isPositive ? barEnd + 5 : barStart - 5}
                        y={y + barH / 2}
                        dy="0.35em"
                        textAnchor={isPositive ? 'start' : 'end'}
                      >
                        {formattedVal}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Zero line */}
              <line
                className={styles.zeroLine}
                x1={zeroX}
                y1={0}
                x2={zeroX}
                y2={innerHeight}
              />

              {/* X Axis ticks at bottom */}
              {showAxes && (
                <g transform={`translate(0, ${innerHeight})`}>
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
              borderTopColor: tooltip.positive ? positiveColor : negativeColor,
              borderTopWidth: 3,
            }}
          >
            <span className={styles.tooltipLabel}>{tooltip.label}</span>
            <span className={styles.tooltipValue} style={{ color: tooltip.positive ? positiveColor : negativeColor }}>
              {tooltip.value}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
