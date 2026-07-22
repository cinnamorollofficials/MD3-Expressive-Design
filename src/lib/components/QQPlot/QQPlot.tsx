import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { cn } from '../../utils/cn';
import styles from './QQPlot.module.css';

// ---------------------------------------------------------------------------
// Acklam's algorithm for Inverse Standard Normal Cumulative Distribution Function
// ---------------------------------------------------------------------------
function poly(coeffs: number[], x: number): number {
  return coeffs.reduce((acc, c) => acc * x + c, 0);
}

function inverseNormalCDF(p: number): number {
  if (p <= 0) return -3.89;
  if (p >= 1) return 3.89;

  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.383577518672690e2, -3.066479806614716e1, 2.506628277459239];
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1, 1.0];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416, 1.0];

  const pLow = 0.02425;
  const pHigh = 1 - pLow;

  if (p < pLow) {
    const q = Math.sqrt(-2 * Math.log(p));
    return poly(c, q) / poly(d, q);
  }
  if (p <= pHigh) {
    const q = p - 0.5;
    const r = q * q;
    return (poly(a, r) * q) / poly(b, r);
  }
  const q = Math.sqrt(-2 * Math.log(1 - p));
  return -poly(c, q) / poly(d, q);
}



export interface QQPoint {
  xQuantile: number;
  yQuantile: number;
  percentile: number;
}

export interface QQPlotProps {
  /** First sample dataset (X axis for two-sample, Y axis for normal) */
  data: number[];
  /** Second sample dataset for two-sample Q-Q plot (renders X vs Y empirical quantiles) */
  sample2?: number[];
  /** Plot mode: 'two-sample' (Batch 1 vs Batch 2) or 'normal' (Sample vs Theoretical Normal) */
  mode?: 'two-sample' | 'normal';
  /** Number of quantiles to evaluate for two-sample comparison (default 100) */
  numQuantiles?: number;
  /** Chart height in pixels */
  height?: number;
  /** Primary point circle stroke color */
  pointColor?: string;
  /** Circle radius of quantile points */
  pointRadius?: number;
  /** Reference line color */
  refLineColor?: string;
  /** Label for X axis (e.g. 'Batch 2' or 'Theoretical Quantiles') */
  xLabel?: string;
  /** Label for Y axis (e.g. 'Batch 1' or 'Sample Quantiles') */
  yLabel?: string;
  /** Main chart title */
  title?: string;
  /** Subtitle description */
  subtitle?: string;
  /** Custom value formatter */
  valueFormatter?: (val: number) => string;
  /** Whether interactive hover tooltips are enabled */
  interactive?: boolean;
  /** Callback when a quantile point is clicked */
  onPointClick?: (pt: QQPoint) => void;
  /** Additional CSS class name */
  className?: string;
}

export function QQPlot({
  data = [],
  sample2 = [],
  mode: initialMode = 'two-sample',
  numQuantiles = 120,
  height = 540,
  pointColor = 'var(--md-sys-color-primary, #1976D2)',
  pointRadius = 4,
  refLineColor = 'var(--md-sys-color-outline, #C0C0C0)',
  xLabel = 'Batch 2',
  yLabel = 'Batch 1',
  title,
  subtitle,
  valueFormatter,
  interactive = true,
  onPointClick,
  className,
}: QQPlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(700);
  const [currentMode, setCurrentMode] = useState<'two-sample' | 'normal'>(
    sample2 && sample2.length > 0 ? initialMode : 'normal'
  );

  const [hoveredPoint, setHoveredPoint] = useState<QQPoint | null>(null);
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

  const margin = { top: 35, right: 35, bottom: 55, left: 65 };
  const innerWidth = Math.max(100, containerWidth - margin.left - margin.right);

  // Prepare clean sorted arrays
  const cleanData1 = useMemo(
    () => [...data].filter((v) => typeof v === 'number' && !isNaN(v)).sort(d3.ascending),
    [data]
  );
  const cleanData2 = useMemo(
    () => [...sample2].filter((v) => typeof v === 'number' && !isNaN(v)).sort(d3.ascending),
    [sample2]
  );

  // Calculate Q-Q quantiles
  const qqPoints = useMemo<QQPoint[]>(() => {
    if (cleanData1.length === 0) return [];

    if (currentMode === 'two-sample' && cleanData2.length > 0) {
      // Two-Sample Q-Q: evaluate percentiles p from 0.01 to 0.99
      const points: QQPoint[] = [];
      const n = Math.max(20, numQuantiles);
      for (let i = 1; i <= n; i++) {
        const p = i / (n + 1);
        const q1 = d3.quantile(cleanData1, p) ?? 0; // Y axis (Batch 1)
        const q2 = d3.quantile(cleanData2, p) ?? 0; // X axis (Batch 2)
        points.push({
          xQuantile: q2,
          yQuantile: q1,
          percentile: p,
        });
      }
      return points;
    } else {
      // Normal Q-Q: Sample quantiles (Y axis) vs Theoretical Normal Quantiles (X axis)
      const n = cleanData1.length;
      const mean = d3.mean(cleanData1) ?? 0;
      const std = d3.deviation(cleanData1) ?? 1;

      return cleanData1.map((val, idx) => {
        // Blom's plotting position: (i - 3/8) / (n + 1/4)
        const p = (idx + 1 - 0.375) / (n + 0.25);
        const theoreticalZ = inverseNormalCDF(p);
        const theoreticalScaled = mean + theoreticalZ * std;

        return {
          xQuantile: theoreticalScaled,
          yQuantile: val,
          percentile: p,
        };
      });
    }
  }, [cleanData1, cleanData2, currentMode, numQuantiles]);

  // Compute scale domains with padding
  const { xDomain, yDomain } = useMemo(() => {
    if (qqPoints.length === 0) return { xDomain: [0, 100], yDomain: [0, 100] };

    const xVals = qqPoints.map((d) => d.xQuantile);
    const yVals = qqPoints.map((d) => d.yQuantile);

    const xMin = d3.min(xVals) ?? 0;
    const xMax = d3.max(xVals) ?? 100;
    const yMin = d3.min(yVals) ?? 0;
    const yMax = d3.max(yVals) ?? 100;

    // Use unified min/max for square aspect ratio alignment if bounds are close
    const minAll = Math.min(xMin, yMin);
    const maxAll = Math.max(xMax, yMax);
    const pad = (maxAll - minAll) * 0.08 || 1;

    return {
      xDomain: [minAll - pad, maxAll + pad],
      yDomain: [minAll - pad, maxAll + pad],
    };
  }, [qqPoints]);

  const xScale = useMemo(() => {
    return d3.scaleLinear().domain(xDomain).range([margin.left, margin.left + innerWidth]);
  }, [xDomain, margin.left, innerWidth]);

  const yScale = useMemo(() => {
    return d3.scaleLinear().domain(yDomain).range([height - margin.bottom, margin.top]);
  }, [yDomain, height, margin.bottom, margin.top]);

  // Q-Q Reference Line (passes through Q25 and Q75)
  const refLinePoints = useMemo(() => {
    if (qqPoints.length < 2) return null;

    // Estimate line through 25th and 75th percentiles
    const p25 = qqPoints.find((d) => d.percentile >= 0.25) || qqPoints[0];
    const p75 = qqPoints.find((d) => d.percentile >= 0.75) || qqPoints[qqPoints.length - 1];

    const dx = p75.xQuantile - p25.xQuantile;
    const dy = p75.yQuantile - p25.yQuantile;

    const slope = dx !== 0 ? dy / dx : 1;
    const intercept = p25.yQuantile - slope * p25.xQuantile;

    const x1 = xDomain[0];
    const y1 = slope * x1 + intercept;

    const x2 = xDomain[1];
    const y2 = slope * x2 + intercept;

    return { x1, y1, x2, y2 };
  }, [qqPoints, xDomain]);

  const fmtVal = useCallback(
    (v: number) => (valueFormatter ? valueFormatter(v) : d3.format(',.1f')(v)),
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

  const xTicks = useMemo(() => xScale.ticks(8), [xScale]);
  const yTicks = useMemo(() => yScale.ticks(8), [yScale]);

  return (
    <div className={cn(styles.root, className)} ref={containerRef} data-md3-component="qq-plot">
      {/* Header */}
      {(title || subtitle) && (
        <div className={styles.header}>
          <div className={styles.headerText}>
            {title && <h4 className={styles.title}>{title}</h4>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>
      )}

      {/* Mode Selector */}
      {cleanData2.length > 0 && (
        <div className={styles.controls}>
          <button
            className={cn(styles.toggleButton, currentMode === 'two-sample' && styles.toggleActive)}
            onClick={() => setCurrentMode('two-sample')}
          >
            Two-Sample Q-Q (Batch 1 vs Batch 2)
          </button>
          <button
            className={cn(styles.toggleButton, currentMode === 'normal' && styles.toggleActive)}
            onClick={() => setCurrentMode('normal')}
          >
            Normal Q-Q (Batch 1 vs Theoretical)
          </button>
        </div>
      )}

      {/* Chart Canvas */}
      <div
        className={styles.chartContainer}
        style={{ height }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setHoveredPoint(null);
          setMousePos(null);
        }}
      >
        <svg className={styles.svg} width={containerWidth} height={height}>
          {/* Y Axis Grid & Tick Labels */}
          <g className="y-axis-layer">
            {yTicks.map((tickVal, idx) => {
              const y = yScale(tickVal);
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
                    {fmtVal(tickVal)}
                  </text>
                </g>
              );
            })}
          </g>

          {/* X Axis Grid & Tick Labels */}
          <g className="x-axis-layer">
            {xTicks.map((tickVal, idx) => {
              const x = xScale(tickVal);
              return (
                <g key={idx}>
                  <line
                    className={styles.gridLine}
                    x1={x}
                    y1={margin.top}
                    x2={x}
                    y2={height - margin.bottom}
                  />
                  <text
                    className={styles.axisText}
                    x={x}
                    y={height - margin.bottom + 18}
                    textAnchor="middle"
                  >
                    {fmtVal(tickVal)}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Corner Labels (Matching Reference Image) */}
          <text className={styles.cornerLabel} x={margin.left} y={margin.top - 10} textAnchor="start">
            {currentMode === 'two-sample' ? yLabel : 'Sample Quantiles'}
          </text>
          <text
            className={styles.cornerLabel}
            x={margin.left + innerWidth}
            y={height - margin.bottom + 36}
            textAnchor="end"
          >
            {currentMode === 'two-sample' ? xLabel : 'Theoretical Quantiles'}
          </text>

          {/* Diagonal Reference Line */}
          {refLinePoints && (
            <line
              className={styles.refLine}
              x1={xScale(refLinePoints.x1)}
              y1={yScale(refLinePoints.y1)}
              x2={xScale(refLinePoints.x2)}
              y2={yScale(refLinePoints.y2)}
              stroke={refLineColor}
            />
          )}

          {/* Quantile Points */}
          <g className="points-layer">
            {qqPoints.map((pt, idx) => {
              const cx = xScale(pt.xQuantile);
              const cy = yScale(pt.yQuantile);
              const isHovered = hoveredPoint === pt;

              return (
                <circle
                  key={idx}
                  className={cn(styles.qqPoint, hoveredPoint && !isHovered && styles.qqPointDimmed)}
                  cx={cx}
                  cy={cy}
                  r={isHovered ? pointRadius + 2.5 : pointRadius}
                  stroke={pointColor}
                  onMouseEnter={() => interactive && setHoveredPoint(pt)}
                  onMouseLeave={() => interactive && setHoveredPoint(null)}
                  onClick={() => onPointClick?.(pt)}
                />
              );
            })}
          </g>
        </svg>

        {/* Hover Tooltip */}
        {interactive && hoveredPoint && mousePos && (
          <div
            className={styles.tooltip}
            style={{
              left: Math.min(containerWidth - 160, Math.max(160, mousePos.x)),
              top: Math.max(48, mousePos.y - 12),
            }}
          >
            <div className={styles.tooltipTitle}>
              Percentile: {(hoveredPoint.percentile * 100).toFixed(1)}%
            </div>
            <div className={styles.tooltipRow}>
              <span>{currentMode === 'two-sample' ? xLabel : 'Theoretical Quantile'}:</span>
              <span className={styles.tooltipValue}>{fmtVal(hoveredPoint.xQuantile)}</span>
            </div>
            <div className={styles.tooltipRow}>
              <span>{currentMode === 'two-sample' ? yLabel : 'Sample Quantile'}:</span>
              <span className={styles.tooltipValue}>{fmtVal(hoveredPoint.yQuantile)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
