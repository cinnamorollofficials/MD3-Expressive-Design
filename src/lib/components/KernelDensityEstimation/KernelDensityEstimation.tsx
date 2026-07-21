import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { cn } from '../../utils/cn';
import styles from './KernelDensityEstimation.module.css';

// ---------------------------------------------------------------------------
// Kernel function implementations
// ---------------------------------------------------------------------------
type KernelName = 'epanechnikov' | 'gaussian' | 'triangular' | 'uniform';

function kernelEpanechnikov(u: number): number {
  return Math.abs(u) <= 1 ? (0.75 * (1 - u * u)) : 0;
}

function kernelGaussian(u: number): number {
  return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * u * u);
}

function kernelTriangular(u: number): number {
  return Math.abs(u) <= 1 ? (1 - Math.abs(u)) : 0;
}

function kernelUniform(u: number): number {
  return Math.abs(u) <= 1 ? 0.5 : 0;
}

function getKernelFn(name: KernelName): (u: number) => number {
  switch (name) {
    case 'gaussian': return kernelGaussian;
    case 'triangular': return kernelTriangular;
    case 'uniform': return kernelUniform;
    default: return kernelEpanechnikov;
  }
}

/**
 * Evaluate the KDE at each point in `thresholds`.
 * Returns array of [x, density] pairs.
 */
function computeKDE(
  kernelFn: (u: number) => number,
  thresholds: number[],
  bandwidth: number,
  data: number[]
): [number, number][] {
  return thresholds.map((x) => {
    const density =
      data.reduce((sum, xi) => sum + kernelFn((x - xi) / bandwidth), 0) /
      (data.length * bandwidth);
    return [x, density];
  });
}

// ---------------------------------------------------------------------------
// Component props
// ---------------------------------------------------------------------------
export interface KernelDensityEstimationProps {
  /** Raw numeric values array */
  data: number[];
  /** Initial/controlled bandwidth (h) */
  bandwidth?: number;
  /** Minimum bandwidth for slider */
  minBandwidth?: number;
  /** Maximum bandwidth for slider */
  maxBandwidth?: number;
  /** Bandwidth slider step */
  bandwidthStep?: number;
  /** Kernel function to use */
  kernel?: KernelName;
  /** Number of evaluation thresholds for KDE curve smoothness */
  thresholds?: number;
  /** Whether to render the histogram bars underneath the KDE curve */
  showHistogram?: boolean;
  /** Number of histogram bins when showHistogram is true */
  histogramBins?: number;
  /** KDE curve stroke color */
  curveColor?: string;
  /** Histogram bar fill color */
  barColor?: string;
  /** Chart height in pixels */
  height?: number;
  /** Whether to show bandwidth slider */
  showControls?: boolean;
  /** Whether to show kernel selector */
  showKernelSelector?: boolean;
  /** Main chart title */
  title?: string;
  /** Subtitle description */
  subtitle?: string;
  /** X axis label */
  xAxisTitle?: string;
  /** Y axis label */
  yAxisTitle?: string;
  /** Custom X-axis value formatter */
  xFormatter?: (val: number) => string;
  /** Custom Y-axis density formatter */
  yFormatter?: (val: number) => string;
  /** Whether to show interactive tooltip and tracker */
  interactive?: boolean;
  /** Additional CSS class name */
  className?: string;
  /** Callback when bandwidth changes */
  onBandwidthChange?: (h: number) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function KernelDensityEstimation({
  data = [],
  bandwidth: bandwidthProp,
  minBandwidth = 0.5,
  maxBandwidth,
  bandwidthStep = 0.5,
  kernel: kernelProp = 'epanechnikov',
  thresholds: thresholdCount = 512,
  showHistogram = true,
  histogramBins,
  curveColor = 'var(--md-sys-color-on-surface)',
  barColor = 'var(--md-sys-color-surface-container-highest)',
  height = 500,
  showControls = true,
  showKernelSelector = true,
  title,
  subtitle,
  xAxisTitle,
  yAxisTitle,
  xFormatter,
  yFormatter,
  interactive = true,
  className,
  onBandwidthChange,
}: KernelDensityEstimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(700);

  // Observe container width
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver((entries) => {
      if (entries.length > 0) {
        const { width } = entries[0].contentRect;
        if (width > 0) setContainerWidth(width);
      }
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // Compute data extent once
  const validData = useMemo(
    () => data.filter((v) => typeof v === 'number' && isFinite(v)),
    [data]
  );
  const dataExtent = useMemo(
    () => d3.extent(validData) as [number, number],
    [validData]
  );

  // Default bandwidth: ~Silverman's rule
  const defaultBandwidth = useMemo(() => {
    if (validData.length < 2) return 1;
    const std = d3.deviation(validData) ?? 1;
    return parseFloat((1.06 * std * Math.pow(validData.length, -0.2)).toFixed(1));
  }, [validData]);

  const resolvedMax = maxBandwidth ?? Math.max(20, Math.round(defaultBandwidth * 8));

  const [bandwidth, setBandwidth] = useState(() => bandwidthProp ?? defaultBandwidth);
  const [currentKernel, setCurrentKernel] = useState<KernelName>(kernelProp);
  const [hoveredBin, setHoveredBin] = useState<any | null>(null);
  const [trackerX, setTrackerX] = useState<number | null>(null);
  const [trackerDensity, setTrackerDensity] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Sync external bandwidth prop
  useEffect(() => {
    if (bandwidthProp !== undefined) setBandwidth(bandwidthProp);
  }, [bandwidthProp]);

  // Margins
  const margin = { top: 30, right: 24, bottom: 58, left: 62 };
  const innerWidth = Math.max(100, containerWidth - margin.left - margin.right);
  const innerHeight = Math.max(100, height - margin.top - margin.bottom);

  // X scale
  const xScale = useMemo(() => {
    if (!dataExtent[0] && !dataExtent[1]) return null;
    const padding = (dataExtent[1] - dataExtent[0]) * 0.04;
    return d3
      .scaleLinear()
      .domain([dataExtent[0] - padding, dataExtent[1] + padding])
      .range([margin.left, margin.left + innerWidth]);
  }, [dataExtent, margin.left, innerWidth]);

  // KDE evaluation thresholds across X domain
  const evalThresholds = useMemo(() => {
    if (!xScale) return [];
    const [x0, x1] = xScale.domain();
    return d3.range(x0, x1, (x1 - x0) / thresholdCount);
  }, [xScale, thresholdCount]);

  // KDE density values
  const kdePairs = useMemo<[number, number][]>(() => {
    if (validData.length === 0 || evalThresholds.length === 0) return [];
    const kernelFn = getKernelFn(currentKernel);
    return computeKDE(kernelFn, evalThresholds, bandwidth, validData);
  }, [validData, evalThresholds, bandwidth, currentKernel]);

  // Histogram bins for the background bars
  const binsData = useMemo(() => {
    if (!showHistogram || validData.length === 0 || !xScale) return [];
    const numBins = histogramBins ?? Math.max(10, Math.ceil(Math.log2(validData.length)) + 5);
    const [x0, x1] = xScale.domain();
    const threshArray = d3.range(x0, x1, (x1 - x0) / numBins);
    return d3.bin().domain(xScale.domain() as [number, number]).thresholds(threshArray)(validData);
  }, [showHistogram, validData, xScale, histogramBins]);

  // Y scale — normalised so histogram bars and KDE curve share the same scale (density)
  const yScale = useMemo(() => {
    if (!xScale) return null;
    const maxDensity = d3.max(kdePairs, (d) => d[1]) ?? 0;

    // Also check histogram density (count / (n * binWidth))
    let maxHistDensity = 0;
    if (showHistogram && binsData.length > 0) {
      const n = validData.length;
      binsData.forEach((bin) => {
        const bw = (bin.x1 ?? 0) - (bin.x0 ?? 0);
        if (bw > 0) maxHistDensity = Math.max(maxHistDensity, bin.length / (n * bw));
      });
    }

    const yMax = Math.max(maxDensity, maxHistDensity) * 1.12;

    return d3
      .scaleLinear()
      .domain([0, yMax])
      .range([height - margin.bottom, margin.top]);
  }, [xScale, kdePairs, binsData, showHistogram, validData.length, height, margin.bottom, margin.top]);

  const xTicks = useMemo(() => xScale?.ticks(8) ?? [], [xScale]);
  const yTicks = useMemo(() => yScale?.ticks(6) ?? [], [yScale]);

  // KDE line generator
  const kdeLine = useMemo(() => {
    if (!xScale || !yScale) return null;
    return d3
      .line<[number, number]>()
      .x((d) => xScale(d[0]))
      .y((d) => yScale(d[1]))
      .curve(d3.curveCatmullRom.alpha(0.5));
  }, [xScale, yScale]);

  const kdePathD = useMemo(() => {
    if (!kdeLine || kdePairs.length === 0) return '';
    return kdeLine(kdePairs) ?? '';
  }, [kdeLine, kdePairs]);

  const fmtX = useCallback(
    (v: number) => (xFormatter ? xFormatter(v) : d3.format(',.4~g')(v)),
    [xFormatter]
  );
  const fmtY = useCallback(
    (v: number) => (yFormatter ? yFormatter(v) : `${(v * 100).toFixed(2)}%`),
    [yFormatter]
  );

  const handleBandwidthChange = useCallback(
    (val: number) => {
      setBandwidth(val);
      onBandwidthChange?.(val);
    },
    [onBandwidthChange]
  );

  // Mouse tracker along KDE curve
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!interactive || !containerRef.current || !xScale || !yScale) return;
      const rect = containerRef.current.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      setMousePos({ x: mx, y: my });

      // Invert X to data coordinate
      const dataX = xScale.invert(mx);
      // Find nearest KDE density value
      const kernelFn = getKernelFn(currentKernel);
      const density =
        validData.reduce((sum, xi) => sum + kernelFn((dataX - xi) / bandwidth), 0) /
        (validData.length * bandwidth);

      setTrackerX(mx);
      setTrackerDensity(density);
    },
    [interactive, xScale, yScale, validData, bandwidth, currentKernel]
  );

  const kernelOptions: KernelName[] = ['epanechnikov', 'gaussian', 'triangular', 'uniform'];

  return (
    <div
      className={cn(styles.root, className)}
      ref={containerRef}
      data-md3-component="kernel-density-estimation"
    >
      {/* Header */}
      {(title || subtitle) && (
        <div className={styles.header}>
          <div className={styles.headerText}>
            {title && <h4 className={styles.title}>{title}</h4>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>
      )}

      {/* Controls */}
      {showControls && (
        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Bandwidth (h):</span>
            <input
              type="number"
              className={styles.numberInput}
              min={minBandwidth}
              max={resolvedMax}
              step={bandwidthStep}
              value={bandwidth}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                if (!isNaN(v) && v >= minBandwidth && v <= resolvedMax)
                  handleBandwidthChange(v);
              }}
            />
            <input
              type="range"
              className={styles.slider}
              min={minBandwidth}
              max={resolvedMax}
              step={bandwidthStep}
              value={bandwidth}
              onChange={(e) => handleBandwidthChange(parseFloat(e.target.value))}
            />
          </div>

          {showKernelSelector && (
            <div className={styles.controlGroup}>
              <span className={styles.controlLabel}>Kernel:</span>
              {kernelOptions.map((k) => (
                <button
                  key={k}
                  onClick={() => setCurrentKernel(k)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 8,
                    border: '1px solid',
                    borderColor: currentKernel === k
                      ? 'var(--md-sys-color-primary)'
                      : 'var(--md-sys-color-outline-variant)',
                    background: currentKernel === k
                      ? 'var(--md-sys-color-primary-container)'
                      : 'transparent',
                    color: currentKernel === k
                      ? 'var(--md-sys-color-on-primary-container)'
                      : 'var(--md-sys-color-on-surface-variant)',
                    fontSize: 11,
                    fontWeight: currentKernel === k ? 700 : 500,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {k}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className={styles.legend}>
        {showHistogram && (
          <div className={styles.legendItem}>
            <div
              className={styles.legendSwatch}
              style={{ background: barColor === 'var(--md-sys-color-surface-container-highest)' ? 'rgba(127,127,127,0.35)' : barColor }}
            />
            <span>Histogram (density)</span>
          </div>
        )}
        <div className={styles.legendItem}>
          <div className={styles.legendLine} style={{ background: curveColor === 'var(--md-sys-color-on-surface)' ? 'currentColor' : curveColor }} />
          <span>KDE curve (h={bandwidth}, {currentKernel})</span>
        </div>
      </div>

      {/* Chart */}
      <div
        className={styles.chartContainer}
        style={{ height }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setHoveredBin(null);
          setTrackerX(null);
          setTrackerDensity(null);
          setMousePos(null);
        }}
      >
        <svg className={styles.svg} width={containerWidth} height={height}>
          {xScale && yScale && (
            <>
              {/* Y grid + labels */}
              <g>
                {yTicks.map((tick, i) => {
                  const y = yScale(tick);
                  return (
                    <g key={i}>
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

              {/* X tick labels */}
              <g>
                {xTicks.map((tick, i) => (
                  <text
                    key={i}
                    className={styles.axisText}
                    x={xScale(tick)}
                    y={height - margin.bottom + 18}
                    textAnchor="middle"
                  >
                    {fmtX(tick)}
                  </text>
                ))}
              </g>

              {/* Baseline */}
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

              {/* Histogram bars (density normalised) */}
              {showHistogram && binsData.map((bin, idx) => {
                const bx0 = bin.x0 ?? 0;
                const bx1 = bin.x1 ?? 0;
                const bw = Math.max(0, xScale(bx1) - xScale(bx0) - 0.5);
                const binWidth = bx1 - bx0;
                const density = binWidth > 0 ? bin.length / (validData.length * binWidth) : 0;
                const by = yScale(density);
                const bh = Math.max(0, (height - margin.bottom) - by);
                const isHov = hoveredBin === bin;

                return (
                  <rect
                    key={idx}
                    className={cn(styles.barRect, hoveredBin && !isHov && styles.barDimmed)}
                    x={xScale(bx0)}
                    y={by}
                    width={bw}
                    height={bh}
                    fill={barColor}
                    opacity={isHov ? 0.95 : 0.55}
                    onMouseEnter={() => interactive && setHoveredBin(bin)}
                    onMouseLeave={() => interactive && setHoveredBin(null)}
                  />
                );
              })}

              {/* KDE curve */}
              {kdePathD && (
                <path
                  className={styles.kdePath}
                  d={kdePathD}
                  stroke={curveColor}
                />
              )}

              {/* Tracker vertical line + KDE circle */}
              {interactive && trackerX !== null && trackerDensity !== null && yScale && (
                <>
                  <line
                    className={styles.trackerLine}
                    x1={trackerX}
                    y1={margin.top}
                    x2={trackerX}
                    y2={height - margin.bottom}
                  />
                  <circle
                    className={styles.trackerCircle}
                    cx={trackerX}
                    cy={yScale(trackerDensity)}
                    r={5}
                    stroke={curveColor}
                  />
                </>
              )}
            </>
          )}
        </svg>

        {/* Tooltip */}
        {interactive && mousePos && trackerX !== null && trackerDensity !== null && xScale && (
          <div
            className={styles.tooltip}
            style={{
              left: Math.min(containerWidth - 170, Math.max(170, mousePos.x)),
              top: Math.max(48, mousePos.y - 12),
            }}
          >
            {hoveredBin ? (
              <>
                <div className={styles.tooltipTitle}>
                  Bin [{fmtX(hoveredBin.x0 ?? 0)}, {fmtX(hoveredBin.x1 ?? 0)})
                </div>
                <div className={styles.tooltipRow}>
                  <span>Frequency:</span>
                  <span className={styles.tooltipValue}>{hoveredBin.length}</span>
                </div>
                <div className={styles.tooltipRow}>
                  <span>Relative:</span>
                  <span className={styles.tooltipValue}>
                    {((hoveredBin.length / validData.length) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className={styles.tooltipRow}>
                  <span>KDE Density:</span>
                  <span className={styles.tooltipValue}>{fmtY(trackerDensity)}</span>
                </div>
              </>
            ) : (
              <>
                <div className={styles.tooltipTitle}>
                  x = {fmtX(xScale.invert(trackerX))}
                </div>
                <div className={styles.tooltipRow}>
                  <span>KDE Density:</span>
                  <span className={styles.tooltipValue}>{fmtY(trackerDensity)}</span>
                </div>
                <div className={styles.tooltipRow}>
                  <span>Bandwidth (h):</span>
                  <span className={styles.tooltipValue}>{bandwidth}</span>
                </div>
                <div className={styles.tooltipRow}>
                  <span>Kernel:</span>
                  <span className={styles.tooltipValue} style={{ textTransform: 'capitalize' }}>
                    {currentKernel}
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
