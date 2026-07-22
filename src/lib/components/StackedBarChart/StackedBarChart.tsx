import { useMemo, useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
import { cn } from '../../utils/cn';
import styles from './StackedBarChart.module.css';

export interface StackedBarChartProps {
  /** Array of data objects to render */
  data: any[];
  /** Key of the category/label value in each data object */
  categoryKey: string;
  /** Keys of the numeric fields to stack together */
  keys: string[];
  /** Stacks relative percentages totaling 100% */
  normalized?: boolean;
  /** Horizontal bar orientation (default: true) */
  horizontal?: boolean;
  /** Chart height in pixels */
  height?: number;
  /** Padding around the chart inside the SVG */
  margin?: { top: number; right: number; bottom: number; left: number };
  /** Show reference grid lines */
  showGrid?: boolean;
  /** Show category and value axes */
  showAxes?: boolean;
  /** List of colors to use for each stacked layer key */
  colors?: string[];
  /** Enable tooltips and hover events */
  interactive?: boolean;
  /** Main chart title */
  title?: string;
  /** Subtitle below the title */
  subtitle?: string;
  /** Custom formatter for value ticks / tooltips */
  valueFormatter?: (val: number) => string;
  /** Custom formatter for category axis labels */
  categoryFormatter?: (val: any) => string;
  /** Additional CSS class name */
  className?: string;
}

const DEFAULT_COLORS = [
  '#d65a60', // red-orange
  '#f09438', // orange
  '#e3be58', // yellow
  '#5aa663', // green
  '#4eb3a9', // teal
  '#5985ab', // steel blue
  '#4671a3', // royal blue
  '#a37aa3', // purple
  '#91735d', // greyish brown
];

export function StackedBarChart({
  data = [],
  categoryKey,
  keys = [],
  normalized = false,
  horizontal = true,
  height = 400,
  margin,
  showGrid = true,
  showAxes = true,
  colors = DEFAULT_COLORS,
  interactive = true,
  title,
  subtitle,
  valueFormatter,
  categoryFormatter,
  className,
}: StackedBarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(600);
  const [disabledKeys, setDisabledKeys] = useState<Record<string, boolean>>({});
  const [hoveredBar, setHoveredBar] = useState<{
    key: string;
    category: string;
    value: number;
    percent?: number;
    x: number;
    y: number;
  } | null>(null);

  // Toggle layer visibility in stack by legend click
  const toggleKey = (key: string) => {
    setDisabledKeys(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const activeKeys = useMemo(() => {
    return keys.filter(k => !disabledKeys[k]);
  }, [keys, disabledKeys]);

  // Auto margin left for horizontal mode to fit category labels
  const autoLeftMargin = useMemo(() => {
    if (!horizontal) return 56;
    const maxLen = Math.max(...data.map(d => String(d[categoryKey]).length), 0);
    return Math.max(64, maxLen * 7 + 12);
  }, [data, categoryKey, horizontal]);

  const resolvedMargin = margin ?? {
    top: 16,
    right: horizontal ? 32 : 16,
    bottom: 40,
    left: autoLeftMargin,
  };

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

  // Stack processing
  const { stackedData, valueScale, categoryScale } = useMemo(() => {
    let stackGenerator = d3.stack().keys(activeKeys);

    if (normalized) {
      stackGenerator = stackGenerator.offset(d3.stackOffsetExpand);
    }

    const stackedData = activeKeys.length > 0 ? stackGenerator(data) : [];

    // Value scale
    let valueMax = 1;
    if (!normalized && activeKeys.length > 0) {
      valueMax = d3.max(data, d => {
        return activeKeys.reduce((sum, key) => sum + (Number(d[key]) || 0), 0);
      }) || 1;
    }

    const valueScale = d3.scaleLinear()
      .domain([0, valueMax])
      .range(horizontal ? [0, innerWidth] : [innerHeight, 0])
      .nice();

    // Category scale
    const categoryScale = d3.scaleBand()
      .domain(data.map(d => String(d[categoryKey])))
      .range(horizontal ? [0, innerHeight] : [0, innerWidth])
      .padding(0.2);

    return { stackedData, valueScale, categoryScale };
  }, [data, categoryKey, activeKeys, normalized, horizontal, innerWidth, innerHeight]);

  // Color mapping
  const colorScale = useMemo(() => {
    return d3.scaleOrdinal<string>()
      .domain(keys)
      .range(colors);
  }, [keys, colors]);

  // Ticks list for grid and axes
  const ticks = useMemo(() => {
    if (normalized) {
      return [0, 0.2, 0.4, 0.6, 0.8, 1].map(val => ({
        pos: valueScale(val),
        label: valueFormatter ? valueFormatter(val * 100) : `${Math.round(val * 100)}%`,
      }));
    }
    return valueScale.ticks(6).map(val => ({
      pos: valueScale(val),
      label: valueFormatter ? valueFormatter(val) : String(val),
    }));
  }, [valueScale, normalized, valueFormatter]);

  // Category labels list
  const categoryLabels = useMemo(() => {
    return categoryScale.domain().map(d => ({
      key: d,
      pos: (categoryScale(d) ?? 0) + categoryScale.bandwidth() / 2,
    }));
  }, [categoryScale]);

  return (
    <div
      className={cn(styles.root, className)}
      ref={containerRef}
      data-md3-component="stacked-bar-chart"
    >
      {(title || subtitle) && (
        <div className={styles.header}>
          {title && <h4 className={styles.title}>{title}</h4>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}

      {/* Interactive Legend */}
      <div className={styles.legend}>
        {keys.map((key) => {
          const isDisabled = disabledKeys[key];
          return (
            <div
              key={key}
              className={cn(styles.legendItem, isDisabled && styles.legendItemDisabled)}
              onClick={() => toggleKey(key)}
            >
              <span className={styles.legendDot} style={{ background: colorScale(key) }} />
              {key}
            </div>
          );
        })}
      </div>

      <div className={styles.chartContainer} style={{ height }}>
        {innerWidth > 0 && (
          <svg
            className={styles.svg}
            width={containerWidth}
            height={height}
            viewBox={`0 0 ${containerWidth} ${height}`}
          >
            <g transform={`translate(${resolvedMargin.left}, ${resolvedMargin.top})`}>

              {/* Reference Grid lines */}
              {showGrid && ticks.map((tick, i) => (
                <line
                  key={i}
                  className={styles.gridLine}
                  x1={horizontal ? tick.pos : 0}
                  y1={horizontal ? 0 : tick.pos}
                  x2={horizontal ? tick.pos : innerWidth}
                  y2={horizontal ? innerHeight : tick.pos}
                />
              ))}

              {/* Stacked Bars rendering */}
              {stackedData.map((layer) => {
                const key = String(layer.key);
                const color = colorScale(key);

                return layer.map((d) => {
                  const categoryVal = String(d.data[categoryKey]);
                  const barStart = d[0];
                  const barEnd = d[1];
                  const rawVal = Number(d.data[key]) || 0;

                  // Positions mapping based on orientation
                  let x = 0;
                  let y = 0;
                  let w = 0;
                  let h = 0;

                  if (horizontal) {
                    y = categoryScale(categoryVal) ?? 0;
                    h = categoryScale.bandwidth();
                    x = valueScale(barStart);
                    w = Math.max(0, valueScale(barEnd) - x);
                  } else {
                    x = categoryScale(categoryVal) ?? 0;
                    w = categoryScale.bandwidth();
                    y = valueScale(barEnd);
                    h = Math.max(0, valueScale(barStart) - y);
                  }

                  if (w <= 0 || h <= 0) return null;

                  // Hover positioning for tooltip
                  const handleMouseEnter = () => {
                    if (!interactive) return;

                    let tipX = 0;
                    let tipY = 0;
                    if (horizontal) {
                      tipX = x + w / 2;
                      tipY = y + h / 2;
                    } else {
                      tipX = x + w / 2;
                      tipY = y + h / 2;
                    }

                    // Compute percentage contribution if normalized
                    let pct: number | undefined;
                    if (normalized) {
                      const total = keys.reduce((sum, k) => sum + (Number(d.data[k]) || 0), 0);
                      pct = total > 0 ? (rawVal / total) * 100 : 0;
                    }

                    setHoveredBar({
                      key,
                      category: categoryVal,
                      value: rawVal,
                      percent: pct,
                      x: tipX,
                      y: tipY,
                    });
                  };

                  return (
                    <rect
                      key={`${key}-${categoryVal}`}
                      className={styles.bar}
                      x={x}
                      y={y}
                      width={w}
                      height={h}
                      fill={color}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={() => setHoveredBar(null)}
                    />
                  );
                });
              })}

              {/* Value Axis line & ticks */}
              {showAxes && (
                <g className={styles.axis} transform={horizontal ? `translate(0, ${innerHeight})` : 'translate(0, 0)'}>
                  <line
                    className={styles.axisLine}
                    x1={0}
                    y1={0}
                    x2={horizontal ? innerWidth : 0}
                    y2={horizontal ? 0 : innerHeight}
                  />
                  {ticks.map((tick, i) => (
                    <g key={i} transform={horizontal ? `translate(${tick.pos}, 0)` : `translate(0, ${tick.pos})`}>
                      <line
                        className={styles.axisTickLine}
                        x1={horizontal ? 0 : -5}
                        y1={horizontal ? 0 : 0}
                        x2={horizontal ? 0 : 0}
                        y2={horizontal ? 5 : 0}
                      />
                      <text
                        className={styles.axisText}
                        x={horizontal ? 0 : -10}
                        y={horizontal ? 18 : 0}
                        dy={horizontal ? '0em' : '0.32em'}
                        textAnchor={horizontal ? 'middle' : 'end'}
                      >
                        {tick.label}
                      </text>
                    </g>
                  ))}
                </g>
              )}

              {/* Category Axis line & labels */}
              {showAxes && (
                <g className={styles.axis} transform={horizontal ? 'translate(0, 0)' : `translate(0, ${innerHeight})`}>
                  <line
                    className={styles.axisLine}
                    x1={0}
                    y1={0}
                    x2={horizontal ? 0 : innerWidth}
                    y2={horizontal ? innerHeight : 0}
                  />
                  {categoryLabels.map((label, i) => (
                    <g key={i} transform={horizontal ? `translate(0, ${label.pos})` : `translate(${label.pos}, 0)`}>
                      <line
                        className={styles.axisTickLine}
                        x1={horizontal ? -5 : 0}
                        y1={horizontal ? 0 : 0}
                        x2={horizontal ? 0 : 0}
                        y2={horizontal ? 0 : 5}
                      />
                      <text
                        className={styles.axisText}
                        x={horizontal ? -10 : 0}
                        y={horizontal ? 0 : 18}
                        dy={horizontal ? '0.32em' : '0em'}
                        textAnchor={horizontal ? 'end' : 'middle'}
                      >
                        {categoryFormatter ? categoryFormatter(label.key) : label.key}
                      </text>
                    </g>
                  ))}
                </g>
              )}
            </g>
          </svg>
        )}

        {/* Hover Tooltip */}
        {interactive && hoveredBar && (
          <div
            className={styles.tooltip}
            style={{
              left: hoveredBar.x + resolvedMargin.left,
              top: hoveredBar.y + resolvedMargin.top,
              borderTopColor: colorScale(hoveredBar.key),
              borderTopWidth: 3,
            }}
          >
            <span className={styles.tooltipLabel}>
              {categoryFormatter ? categoryFormatter(hoveredBar.category) : hoveredBar.category}
            </span>
            <div className={styles.tooltipRow}>
              <span className={styles.tooltipKey}>{hoveredBar.key}</span>
              <span className={styles.tooltipValue}>
                {hoveredBar.percent !== undefined
                  ? `${valueFormatter ? valueFormatter(hoveredBar.value) : hoveredBar.value.toLocaleString()} (${hoveredBar.percent.toFixed(1)}%)`
                  : (valueFormatter ? valueFormatter(hoveredBar.value) : hoveredBar.value.toLocaleString())
                }
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
