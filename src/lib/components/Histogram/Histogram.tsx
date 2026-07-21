import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { cn } from '../../utils/cn';
import styles from './Histogram.module.css';

export interface HistogramProps {
  /** Raw numeric values array */
  data: number[];
  /** Number of bins (default: auto via Sturges rule) */
  bins?: number;
  /** Chart height in pixels */
  height?: number;
  /** Fill color for bars */
  color?: string;
  /** Show interactive hover tooltip */
  interactive?: boolean;
  /** Show Y axis title */
  xAxisTitle?: string;
  /** Show X axis title */
  yAxisTitle?: string;
  /** Main chart title */
  title?: string;
  /** Subtitle description */
  subtitle?: string;
  /** Whether to show the bin count slider control */
  showControls?: boolean;
  /** Minimum bin count */
  minBins?: number;
  /** Maximum bin count */
  maxBins?: number;
  /** Custom X-axis value formatter */
  xFormatter?: (val: number) => string;
  /** Custom Y-axis count formatter */
  yFormatter?: (val: number) => string;
  /** Callback when a bar is clicked */
  onBarClick?: (bin: { x0: number; x1: number; count: number }) => void;
  /** Additional CSS class name */
  className?: string;
}

export function Histogram({
  data = [],
  bins: binsProp,
  height = 500,
  color = 'var(--md-sys-color-primary)',
  interactive = true,
  xAxisTitle,
  yAxisTitle,
  title,
  subtitle,
  showControls = true,
  minBins = 5,
  maxBins = 100,
  xFormatter,
  yFormatter,
  onBarClick,
  className,
}: HistogramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(700);

  const defaultBins = useMemo(() => {
    if (binsProp !== undefined) return binsProp;
    // Sturges' formula: k = ceil(log2(n)) + 1
    if (data.length === 0) return 20;
    return Math.max(minBins, Math.min(maxBins, Math.ceil(Math.log2(data.length)) + 1));
  }, [binsProp, data.length, minBins, maxBins]);

  const [currentBins, setCurrentBins] = useState(defaultBins);

  // Keep in sync if prop changes
  useEffect(() => {
    setCurrentBins(defaultBins);
  }, [defaultBins]);

  const [hoveredBin, setHoveredBin] = useState<any | null>(null);
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

  // Compute bin thresholds
  const binsData = useMemo(() => {
    const valid = data.filter((v) => typeof v === 'number' && isFinite(v));
    if (valid.length === 0) return [];

    const extent = d3.extent(valid) as [number, number];
    const thresholds = d3.range(
      extent[0],
      extent[1],
      (extent[1] - extent[0]) / currentBins
    );

    const histogram = d3
      .bin()
      .domain(extent)
      .thresholds(thresholds);

    return histogram(valid);
  }, [data, currentBins]);

  const margin = { top: 30, right: 24, bottom: 58, left: 58 };
  const innerWidth = Math.max(100, containerWidth - margin.left - margin.right);
  const innerHeight = Math.max(100, height - margin.top - margin.bottom);

  // X scale — continuous domain from first bin start to last bin end
  const xScale = useMemo(() => {
    if (binsData.length === 0) return null;
    const x0 = binsData[0].x0 ?? 0;
    const x1 = binsData[binsData.length - 1].x1 ?? 1;
    return d3
      .scaleLinear()
      .domain([x0, x1])
      .range([margin.left, margin.left + innerWidth]);
  }, [binsData, margin.left, innerWidth]);

  // Y scale — frequency count
  const yScale = useMemo(() => {
    if (binsData.length === 0) return null;
    const maxCount = d3.max(binsData, (d) => d.length) ?? 0;
    return d3
      .scaleLinear()
      .domain([0, maxCount * 1.08])
      .range([height - margin.bottom, margin.top]);
  }, [binsData, height, margin.bottom, margin.top]);

  const xTicks = useMemo(() => {
    if (!xScale) return [];
    return xScale.ticks(Math.min(10, currentBins));
  }, [xScale, currentBins]);

  const yTicks = useMemo(() => {
    if (!yScale) return [];
    return yScale.ticks(6);
  }, [yScale]);

  const fmtX = useCallback(
    (v: number) => (xFormatter ? xFormatter(v) : d3.format(',.2~f')(v)),
    [xFormatter]
  );
  const fmtY = useCallback(
    (v: number) => (yFormatter ? yFormatter(v) : d3.format(',')(v)),
    [yFormatter]
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
    <div className={cn(styles.root, className)} ref={containerRef} data-md3-component="histogram">
      {/* Header */}
      {(title || subtitle) && (
        <div className={styles.header}>
          <div className={styles.headerText}>
            {title && <h4 className={styles.title}>{title}</h4>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>
      )}

      {/* Bins Slider Control */}
      {showControls && (
        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Bins:</span>
            <input
              type="number"
              className={styles.numberInput}
              min={minBins}
              max={maxBins}
              value={currentBins}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                if (!isNaN(v) && v >= minBins && v <= maxBins) setCurrentBins(v);
              }}
            />
            <input
              type="range"
              className={styles.slider}
              min={minBins}
              max={maxBins}
              step={1}
              value={currentBins}
              onChange={(e) => setCurrentBins(parseInt(e.target.value, 10))}
            />
          </div>
        </div>
      )}

      {/* Chart */}
      <div
        className={styles.chartContainer}
        style={{ height }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setHoveredBin(null);
          setMousePos(null);
        }}
      >
        <svg className={styles.svg} width={containerWidth} height={height}>
          {xScale && yScale && (
            <>
              {/* Y Grid + Labels */}
              <g className="y-axis-layer">
                {yTicks.map((tick, idx) => {
                  const y = yScale(tick);
                  return (
                    <g key={idx}>
                      <line
                        className={styles.gridLine}
                        x1={margin.left}
                        y1={y}
                        x2={margin.left + innerWidth}
                        y2={y}
                      />
                      <text
                        className={styles.axisText}
                        x={margin.left - 8}
                        y={y}
                        dy="0.32em"
                        textAnchor="end"
                      >
                        {fmtY(tick)}
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* X Tick Labels */}
              <g className="x-axis-layer">
                {xTicks.map((tick, idx) => {
                  const x = xScale(tick);
                  return (
                    <text
                      key={idx}
                      className={styles.axisText}
                      x={x}
                      y={height - margin.bottom + 18}
                      textAnchor="middle"
                    >
                      {fmtX(tick)}
                    </text>
                  );
                })}
              </g>

              {/* X Axis Baseline */}
              <line
                x1={margin.left}
                y1={height - margin.bottom}
                x2={margin.left + innerWidth}
                y2={height - margin.bottom}
                stroke="var(--md-sys-color-outline-variant)"
                strokeWidth={1}
              />

              {/* X Axis Title */}
              {xAxisTitle && (
                <text
                  className={styles.axisTitleText}
                  x={margin.left + innerWidth / 2}
                  y={height - 8}
                  textAnchor="middle"
                >
                  {xAxisTitle} →
                </text>
              )}

              {/* Y Axis Title */}
              {yAxisTitle && (
                <text
                  className={styles.axisTitleText}
                  x={0}
                  y={0}
                  transform={`translate(14, ${margin.top + innerHeight / 2}) rotate(-90)`}
                  textAnchor="middle"
                >
                  ↑ {yAxisTitle}
                </text>
              )}

              {/* Histogram Bars */}
              <g className="bars-layer">
                {binsData.map((bin, idx) => {
                  const x0 = bin.x0 ?? 0;
                  const x1 = bin.x1 ?? 0;
                  const bx = xScale(x0);
                  const bw = Math.max(0, xScale(x1) - xScale(x0) - 1);
                  const by = yScale(bin.length);
                  const bh = Math.max(0, (height - margin.bottom) - by);
                  const isHovered = hoveredBin === bin;

                  return (
                    <rect
                      key={idx}
                      className={cn(styles.barRect, hoveredBin && !isHovered && styles.barDimmed)}
                      x={bx}
                      y={by}
                      width={bw}
                      height={bh}
                      rx={2}
                      fill={color}
                      opacity={isHovered ? 1 : 0.82}
                      onMouseEnter={() => interactive && setHoveredBin(bin)}
                      onMouseLeave={() => interactive && setHoveredBin(null)}
                      onClick={() =>
                        onBarClick?.({ x0, x1: bin.x1 ?? 0, count: bin.length })
                      }
                    />
                  );
                })}
              </g>
            </>
          )}
        </svg>

        {/* Tooltip */}
        {interactive && hoveredBin && mousePos && (
          <div
            className={styles.tooltip}
            style={{
              left: Math.min(containerWidth - 160, Math.max(160, mousePos.x)),
              top: Math.max(40, mousePos.y - 12),
            }}
          >
            <div className={styles.tooltipTitle}>
              Range: [{fmtX(hoveredBin.x0 ?? 0)}, {fmtX(hoveredBin.x1 ?? 0)})
            </div>
            <div className={styles.tooltipRow}>
              <span>Frequency (Count):</span>
              <span className={styles.tooltipValue}>{fmtY(hoveredBin.length)}</span>
            </div>
            {data.length > 0 && (
              <div className={styles.tooltipRow}>
                <span>Relative Frequency:</span>
                <span className={styles.tooltipValue}>
                  {((hoveredBin.length / data.length) * 100).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
