import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { cn } from '../../utils/cn';
import styles from './BoxPlot.module.css';

export interface BoxPlotGroupData {
  group: string | number;
  values?: number[];
  min?: number;
  q1?: number;
  median?: number;
  q3?: number;
  max?: number;
  outliers?: number[];
  [key: string]: any;
}

export interface BoxPlotProps {
  /** Array of group dataset (raw values array or 5-number summary) */
  data: BoxPlotGroupData[];
  /** Chart height in pixels */
  height?: number;
  /** Fill color for box rectangles */
  boxColor?: string;
  /** Stroke color for median lines */
  medianColor?: string;
  /** Show outlier data points as translucent jittered dots */
  showOutliers?: boolean;
  /** Enable hover tooltips with 5-number summary statistics */
  interactive?: boolean;
  /** Main chart title */
  title?: string;
  /** Subtitle description */
  subtitle?: string;
  /** Custom value formatter */
  valueFormatter?: (val: number) => string;
  /** Callback when a box plot is clicked */
  onBoxClick?: (group: BoxPlotGroupData) => void;
  /** Additional CSS class name */
  className?: string;
}

export function BoxPlot({
  data = [],
  height = 540,
  boxColor = 'var(--md-sys-color-surface-container-high, #E6E1E5)',
  medianColor = 'var(--md-sys-color-on-surface, #1D1B20)',
  showOutliers = true,
  interactive = true,
  title,
  subtitle,
  valueFormatter,
  onBoxClick,
  className,
}: BoxPlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(700);

  const [hoveredStats, setHoveredStats] = useState<any | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Observe width
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

  // Compute 5-number summary stats (Min, Q1, Median, Q3, Max, Outliers) per group
  const groupStats = useMemo(() => {
    return data.map((item) => {
      if (
        typeof item.q1 === 'number' &&
        typeof item.median === 'number' &&
        typeof item.q3 === 'number'
      ) {
        return {
          group: String(item.group),
          min: item.min ?? item.q1,
          q1: item.q1,
          median: item.median,
          q3: item.q3,
          max: item.max ?? item.q3,
          outliers: item.outliers || [],
          rawData: item,
        };
      }

      const rawValues = (item.values || []).filter((v) => typeof v === 'number' && !isNaN(v));
      if (rawValues.length === 0) {
        return {
          group: String(item.group),
          min: 0,
          q1: 0,
          median: 0,
          q3: 0,
          max: 0,
          outliers: [],
          rawData: item,
        };
      }

      const sorted = [...rawValues].sort(d3.ascending);
      const q1 = d3.quantile(sorted, 0.25) || 0;
      const median = d3.quantile(sorted, 0.5) || 0;
      const q3 = d3.quantile(sorted, 0.75) || 0;
      const iqr = q3 - q1;

      const lowerBound = q1 - 1.5 * iqr;
      const upperBound = q3 + 1.5 * iqr;

      const nonOutliers = sorted.filter((v) => v >= lowerBound && v <= upperBound);
      const outliers = sorted.filter((v) => v < lowerBound || v > upperBound);

      const min = nonOutliers.length > 0 ? nonOutliers[0] : q1;
      const max = nonOutliers.length > 0 ? nonOutliers[nonOutliers.length - 1] : q3;

      return {
        group: String(item.group),
        min,
        q1,
        median,
        q3,
        max,
        outliers,
        rawData: item,
      };
    });
  }, [data]);

  // Dimensions
  const margin = { top: 25, right: 30, bottom: 45, left: 55 };

  // X Band Scale
  const xScale = useMemo(() => {
    const groups = groupStats.map((d) => d.group);
    return d3
      .scaleBand()
      .domain(groups)
      .range([margin.left, containerWidth - margin.right])
      .padding(0.35);
  }, [groupStats, margin.left, margin.right, containerWidth]);

  // Y Linear Scale
  const yScale = useMemo(() => {
    if (groupStats.length === 0) return null;
    let minVal = d3.min(groupStats, (d) => Math.min(d.min, ...(d.outliers.length > 0 ? d.outliers : [d.min]))) || 0;
    let maxVal = d3.max(groupStats, (d) => Math.max(d.max, ...(d.outliers.length > 0 ? d.outliers : [d.max]))) || 100;
    if (minVal > 0) minVal = 0; // standard zero baseline unless all values negative

    return d3
      .scaleLinear()
      .domain([minVal, maxVal * 1.05])
      .range([height - margin.bottom, margin.top]);
  }, [groupStats, height, margin.bottom, margin.top]);

  // Y Axis Ticks
  const yTicks = useMemo(() => {
    if (!yScale) return [];
    return yScale.ticks(6);
  }, [yScale]);

  // Formatter
  const formatValStr = (val: number) => (valueFormatter ? valueFormatter(val) : val >= 1000 ? `${(val / 1000).toFixed(0)}k` : String(val.toFixed(1)));

  // Mouse hover handler
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!interactive || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    },
    [interactive]
  );

  return (
    <div className={cn(styles.root, className)} ref={containerRef} data-md3-component="box-plot">
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
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredStats(null)}
      >
        <svg className={styles.svg} width={containerWidth} height={height}>
          {xScale && yScale && (
            <>
              {/* Horizontal Y Gridlines & Axis Labels */}
              <g className="y-axis-layer">
                {yTicks.map((tickVal, idx) => {
                  const y = yScale(tickVal);
                  return (
                    <g key={idx}>
                      <line className={styles.gridLine} x1={margin.left} y1={y} x2={containerWidth - margin.right} y2={y} />
                      <text className={styles.axisText} x={margin.left - 8} y={y} dy="0.32em" textAnchor="end">
                        {formatValStr(tickVal)}
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* Horizontal X Axis Labels */}
              <g className="x-axis-layer">
                {groupStats.map((d, idx) => {
                  const x = (xScale(d.group) || 0) + xScale.bandwidth() / 2;
                  return (
                    <text
                      key={idx}
                      className={styles.axisText}
                      x={x}
                      y={height - margin.bottom + 18}
                      textAnchor="middle"
                    >
                      {d.group}
                    </text>
                  );
                })}
              </g>

              {/* Boxes, Whiskers & Outliers Layer */}
              <g className="boxes-layer">
                {groupStats.map((d, idx) => {
                  const boxX = xScale(d.group) || 0;
                  const boxWidth = xScale.bandwidth();
                  const xCenter = boxX + boxWidth / 2;

                  const yMin = yScale(d.min);
                  const yQ1 = yScale(d.q1);
                  const yMedian = yScale(d.median);
                  const yQ3 = yScale(d.q3);
                  const yMax = yScale(d.max);

                  const boxHeight = Math.abs(yQ1 - yQ3);
                  const capWidth = Math.max(6, boxWidth * 0.4);

                  return (
                    <g
                      key={idx}
                      className={styles.boxGroup}
                      onMouseEnter={() => interactive && setHoveredStats(d)}
                      onMouseLeave={() => interactive && setHoveredStats(null)}
                      onClick={() => onBoxClick?.(d.rawData)}
                    >

                      {/* Vertical Whisker Line (Min to Max) */}
                      <line
                        className={styles.whiskerLine}
                        x1={xCenter}
                        y1={yMin}
                        x2={xCenter}
                        y2={yMax}
                      />

                      {/* Top Whisker Cap */}
                      <line
                        className={styles.whiskerCap}
                        x1={xCenter - capWidth / 2}
                        y1={yMax}
                        x2={xCenter + capWidth / 2}
                        y2={yMax}
                      />

                      {/* Bottom Whisker Cap */}
                      <line
                        className={styles.whiskerCap}
                        x1={xCenter - capWidth / 2}
                        y1={yMin}
                        x2={xCenter + capWidth / 2}
                        y2={yMin}
                      />

                      {/* Box Rect (Q1 to Q3) */}
                      <rect
                        className={styles.boxRect}
                        x={boxX}
                        y={Math.min(yQ1, yQ3)}
                        width={boxWidth}
                        height={Math.max(1, boxHeight)}
                        fill={boxColor}
                      />

                      {/* Median Horizontal Line */}
                      <line
                        className={styles.medianLine}
                        x1={boxX}
                        y1={yMedian}
                        x2={boxX + boxWidth}
                        y2={yMedian}
                        stroke={medianColor}
                      />

                      {/* Outlier Dots */}
                      {showOutliers &&
                        d.outliers.map((outlierVal, oIdx) => {
                          // Simple deterministic pseudo-jitter
                          const jitter = (Math.sin(oIdx * 12.3) * (boxWidth * 0.3));
                          return (
                            <circle
                              key={oIdx}
                              className={styles.outlierCircle}
                              cx={xCenter + jitter}
                              cy={yScale(outlierVal)}
                              r={2.5}
                            />
                          );
                        })}
                    </g>
                  );
                })}
              </g>
            </>
          )}
        </svg>

        {/* Hover Tooltip */}
        {interactive && hoveredStats && mousePos && (
          <div
            className={styles.tooltip}
            style={{
              left: Math.min(containerWidth - 140, Math.max(140, mousePos.x)),
              top: mousePos.y,
            }}
          >
            <div className={styles.tooltipTitle}>Group: {hoveredStats.group}</div>
            <div className={styles.tooltipRow}>
              <span>Max (Upper Whisker):</span>
              <span className={styles.tooltipValue}>{formatValStr(hoveredStats.max)}</span>
            </div>
            <div className={styles.tooltipRow}>
              <span>Q3 (75th Percentile):</span>
              <span className={styles.tooltipValue}>{formatValStr(hoveredStats.q3)}</span>
            </div>
            <div className={styles.tooltipRow}>
              <span style={{ fontWeight: 700 }}>Median (50th):</span>
              <span className={styles.tooltipValue} style={{ fontWeight: 700 }}>{formatValStr(hoveredStats.median)}</span>
            </div>
            <div className={styles.tooltipRow}>
              <span>Q1 (25th Percentile):</span>
              <span className={styles.tooltipValue}>{formatValStr(hoveredStats.q1)}</span>
            </div>
            <div className={styles.tooltipRow}>
              <span>Min (Lower Whisker):</span>
              <span className={styles.tooltipValue}>{formatValStr(hoveredStats.min)}</span>
            </div>
            {hoveredStats.outliers.length > 0 && (
              <div className={styles.tooltipRow} style={{ color: 'var(--md-sys-color-error)' }}>
                <span>Outliers Count:</span>
                <span className={styles.tooltipValue}>{hoveredStats.outliers.length}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
