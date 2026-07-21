import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { cn } from '../../utils/cn';
import styles from './BollingerBandsChart.module.css';

export interface BollingerDataPoint {
  date: string | Date;
  value: number;
  [key: string]: any;
}

export interface BollingerBandsChartProps {
  /** Dataset array of daily price points ({ date, value }) */
  data: BollingerDataPoint[];
  /** Moving average window period N in days (default 20) */
  period?: number;
  /** Number of standard deviations multiplier K (default 2.0) */
  multiplier?: number;
  /** Chart height in pixels */
  height?: number;
  /** Upper band line color (default '#E53935' - Red) */
  upperColor?: string;
  /** Middle SMA band line color (default '#1E88E5' - Blue) */
  middleColor?: string;
  /** Lower band line color (default '#43A047' - Green) */
  lowerColor?: string;
  /** Raw price close line color (default '#757575' - Grey) */
  priceColor?: string;
  /** Shaded envelope area fill color */
  bandFillColor?: string;
  /** Show period N and K controls in top toolbar */
  showControls?: boolean;
  /** Enable hover crosshair and multi-line values tooltip */
  interactive?: boolean;
  /** Main chart title */
  title?: string;
  /** Subtitle description */
  subtitle?: string;
  /** Custom value formatter */
  valueFormatter?: (val: number) => string;
  /** Custom date formatter */
  dateFormatter?: (date: Date) => string;
  /** Callback when parameters change */
  onChangeParams?: (period: number, multiplier: number) => void;
  /** Additional CSS class name */
  className?: string;
}

export function BollingerBandsChart({
  data = [],
  period = 20,
  multiplier = 2.0,
  height = 520,
  upperColor = '#E53935',
  middleColor = '#1E88E5',
  lowerColor = '#43A047',
  priceColor = '#757575',
  bandFillColor = 'color-mix(in srgb, var(--md-sys-color-primary) 8%, transparent)',
  showControls = true,
  interactive = true,
  title,
  subtitle,
  valueFormatter,
  dateFormatter,
  onChangeParams,
  className,
}: BollingerBandsChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(700);

  const [currentPeriod, setCurrentPeriod] = useState(period);
  const [currentMultiplier, setCurrentMultiplier] = useState(multiplier);

  const [hoveredPoint, setHoveredPoint] = useState<any | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Sync props if updated
  useEffect(() => {
    setCurrentPeriod(period);
  }, [period]);

  useEffect(() => {
    setCurrentMultiplier(multiplier);
  }, [multiplier]);

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

  const handlePeriodChange = (val: number) => {
    const clamped = Math.max(2, Math.min(200, val));
    setCurrentPeriod(clamped);
    onChangeParams?.(clamped, currentMultiplier);
  };

  const handleMultiplierChange = (val: number) => {
    const clamped = Math.max(0.5, Math.min(5.0, val));
    setCurrentMultiplier(clamped);
    onChangeParams?.(currentPeriod, clamped);
  };

  // Compute Bollinger Bands (SMA, Standard Deviation, Upper, Lower)
  const processedData = useMemo(() => {
    if (data.length === 0) return [];

    const points = data.map((d) => ({
      date: d.date instanceof Date ? d.date : new Date(d.date),
      value: Number(d.value) || 0,
      raw: d,
    }));

    // Sort chronologically
    points.sort((a, b) => a.date.getTime() - b.date.getTime());

    const N = Math.max(1, currentPeriod);
    const K = currentMultiplier;

    return points.map((p, i) => {
      const start = Math.max(0, i - N + 1);
      const windowPoints = points.slice(start, i + 1);
      const count = windowPoints.length;

      // Simple Moving Average
      const sma = windowPoints.reduce((acc, curr) => acc + curr.value, 0) / count;

      // Rolling Standard Deviation
      const variance = windowPoints.reduce((acc, curr) => acc + Math.pow(curr.value - sma, 2), 0) / count;
      const stdDev = Math.sqrt(variance);

      // Upper and Lower Bands
      const upper = sma + K * stdDev;
      const lower = Math.max(0, sma - K * stdDev);

      return {
        ...p,
        sma,
        stdDev,
        upper,
        lower,
      };
    });
  }, [data, currentPeriod, currentMultiplier]);

  // Dimensions
  const margin = { top: 25, right: 35, bottom: 45, left: 55 };
  const innerWidth = Math.max(100, containerWidth - margin.left - margin.right);
  const innerHeight = Math.max(100, height - margin.top - margin.bottom);

  // Scales
  const xScale = useMemo(() => {
    if (processedData.length === 0) return null;
    const extent = d3.extent(processedData, (d) => d.date) as [Date, Date];
    return d3.scaleTime().domain(extent).range([margin.left, containerWidth - margin.right]);
  }, [processedData, margin.left, margin.right, containerWidth]);

  const yScale = useMemo(() => {
    if (processedData.length === 0) return null;
    const minVal = d3.min(processedData, (d) => Math.min(d.value, d.lower)) || 0;
    const maxVal = d3.max(processedData, (d) => Math.max(d.value, d.upper)) || 10;
    return d3
      .scaleLinear()
      .domain([minVal * 0.95, maxVal * 1.05])
      .range([height - margin.bottom, margin.top]);
  }, [processedData, height, margin.bottom, margin.top]);

  // Path Generators
  const bandAreaPath = useMemo(() => {
    if (!xScale || !yScale || processedData.length === 0) return '';
    const areaGen = d3
      .area<any>()
      .x((d) => xScale(d.date))
      .y0((d) => yScale(d.lower))
      .y1((d) => yScale(d.upper))
      .curve(d3.curveMonotoneX);
    return areaGen(processedData) || '';
  }, [xScale, yScale, processedData]);

  const upperLinePath = useMemo(() => {
    if (!xScale || !yScale || processedData.length === 0) return '';
    const lineGen = d3
      .line<any>()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.upper))
      .curve(d3.curveMonotoneX);
    return lineGen(processedData) || '';
  }, [xScale, yScale, processedData]);

  const middleLinePath = useMemo(() => {
    if (!xScale || !yScale || processedData.length === 0) return '';
    const lineGen = d3
      .line<any>()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.sma))
      .curve(d3.curveMonotoneX);
    return lineGen(processedData) || '';
  }, [xScale, yScale, processedData]);

  const lowerLinePath = useMemo(() => {
    if (!xScale || !yScale || processedData.length === 0) return '';
    const lineGen = d3
      .line<any>()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.lower))
      .curve(d3.curveMonotoneX);
    return lineGen(processedData) || '';
  }, [xScale, yScale, processedData]);

  const priceLinePath = useMemo(() => {
    if (!xScale || !yScale || processedData.length === 0) return '';
    const lineGen = d3
      .line<any>()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.value));
    return lineGen(processedData) || '';
  }, [xScale, yScale, processedData]);

  // Axis Ticks
  const xTicks = useMemo(() => {
    if (!xScale) return [];
    return xScale.ticks(Math.max(4, Math.floor(innerWidth / 90)));
  }, [xScale, innerWidth]);

  const yTicks = useMemo(() => {
    if (!yScale) return [];
    return yScale.ticks(6);
  }, [yScale]);

  // Formatters
  const formatValueStr = (val: number) => (valueFormatter ? valueFormatter(val) : `$${val.toFixed(2)}`);
  const formatDateStr = (date: Date) =>
    dateFormatter ? dateFormatter(date) : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

  // Mouse hover lookup
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!interactive || !xScale || processedData.length === 0 || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      setMousePos({ x: mouseX, y: mouseY });

      const dateAtMouse = xScale.invert(mouseX);
      const bisect = d3.bisector((d: any) => d.date).center;
      const idx = bisect(processedData, dateAtMouse);
      const point = processedData[idx];

      if (point) {
        setHoveredPoint(point);
      }
    },
    [interactive, xScale, processedData]
  );

  return (
    <div className={cn(styles.root, className)} ref={containerRef} data-md3-component="bollinger-bands-chart">
      {(title || subtitle || showControls) && (
        <div className={styles.header}>
          <div className={styles.headerText}>
            {title && <h4 className={styles.title}>{title}</h4>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>

          {showControls && (
            <div className={styles.controls}>
              <div className={styles.controlGroup}>
                <span className={styles.controlLabel}>Period (N):</span>
                <input
                  type="number"
                  className={styles.numberInput}
                  value={currentPeriod}
                  min={2}
                  max={200}
                  onChange={(e) => handlePeriodChange(parseInt(e.target.value) || 20)}
                />
              </div>

              <div className={styles.controlGroup}>
                <span className={styles.controlLabel}>Std Dev (K):</span>
                <input
                  type="number"
                  className={styles.numberInput}
                  style={{ width: 55 }}
                  step="0.1"
                  value={currentMultiplier}
                  min={0.5}
                  max={5.0}
                  onChange={(e) => handleMultiplierChange(parseFloat(e.target.value) || 2.0)}
                />
              </div>
            </div>
          )}
        </div>
      )}

      <div
        className={styles.chartContainer}
        style={{ height }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredPoint(null)}
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
                        {formatValueStr(tickVal)}
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* Horizontal X Axis Labels */}
              <g className="x-axis-layer">
                {xTicks.map((tickDate, idx) => {
                  const x = xScale(tickDate);
                  return (
                    <text
                      key={idx}
                      className={styles.axisText}
                      x={x}
                      y={height - margin.bottom + 20}
                      textAnchor="middle"
                    >
                      {tickDate.toLocaleDateString(undefined, { month: 'short', year: '2-digit' })}
                    </text>
                  );
                })}
              </g>

              {/* Shaded Band Envelope Fill */}
              <path className={styles.bandArea} d={bandAreaPath} fill={bandFillColor} />

              {/* Lower Band Line (Green) */}
              <path className={styles.lowerLine} d={lowerLinePath} stroke={lowerColor} />

              {/* Upper Band Line (Red) */}
              <path className={styles.upperLine} d={upperLinePath} stroke={upperColor} />

              {/* Middle SMA Band Line (Blue) */}
              <path className={styles.middleLine} d={middleLinePath} stroke={middleColor} />

              {/* Raw Price Close Line (Grey) */}
              <path className={styles.priceLine} d={priceLinePath} stroke={priceColor} />

              {/* Interactive Crosshair & Focus Dots */}
              {interactive && hoveredPoint && (
                <g className="interactive-layer">
                  {/* Vertical Crosshair Line */}
                  <line
                    className={styles.crosshair}
                    x1={xScale(hoveredPoint.date)}
                    y1={margin.top}
                    x2={xScale(hoveredPoint.date)}
                    y2={height - margin.bottom}
                  />

                  {/* Dot on Upper Band */}
                  <circle
                    className={styles.focusDot}
                    cx={xScale(hoveredPoint.date)}
                    cy={yScale(hoveredPoint.upper)}
                    r={4}
                    stroke={upperColor}
                  />

                  {/* Dot on Middle Band */}
                  <circle
                    className={styles.focusDot}
                    cx={xScale(hoveredPoint.date)}
                    cy={yScale(hoveredPoint.sma)}
                    r={4}
                    stroke={middleColor}
                  />

                  {/* Dot on Lower Band */}
                  <circle
                    className={styles.focusDot}
                    cx={xScale(hoveredPoint.date)}
                    cy={yScale(hoveredPoint.lower)}
                    r={4}
                    stroke={lowerColor}
                  />

                  {/* Dot on Price Close */}
                  <circle
                    className={styles.focusDot}
                    cx={xScale(hoveredPoint.date)}
                    cy={yScale(hoveredPoint.value)}
                    r={5}
                    stroke={priceColor}
                  />
                </g>
              )}
            </>
          )}
        </svg>

        {/* Hover Tooltip */}
        {interactive && hoveredPoint && mousePos && (
          <div
            className={styles.tooltip}
            style={{
              left: Math.min(containerWidth - 140, Math.max(140, mousePos.x)),
              top: mousePos.y,
            }}
          >
            <div className={styles.tooltipDate}>{formatDateStr(hoveredPoint.date)}</div>
            <div className={styles.tooltipRow}>
              <span style={{ color: priceColor }}>Close Price:</span>
              <span className={styles.tooltipValue}>{formatValueStr(hoveredPoint.value)}</span>
            </div>
            <div className={styles.tooltipRow}>
              <span style={{ color: upperColor }}>Upper Band (+{currentMultiplier}σ):</span>
              <span className={styles.tooltipValue}>{formatValueStr(hoveredPoint.upper)}</span>
            </div>
            <div className={styles.tooltipRow}>
              <span style={{ color: middleColor }}>SMA ({currentPeriod}D):</span>
              <span className={styles.tooltipValue}>{formatValueStr(hoveredPoint.sma)}</span>
            </div>
            <div className={styles.tooltipRow}>
              <span style={{ color: lowerColor }}>Lower Band (-{currentMultiplier}σ):</span>
              <span className={styles.tooltipValue}>{formatValueStr(hoveredPoint.lower)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
