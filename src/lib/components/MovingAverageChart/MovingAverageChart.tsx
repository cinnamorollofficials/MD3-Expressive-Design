import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { cn } from '../../utils/cn';
import styles from './MovingAverageChart.module.css';

export interface TimeSeriesDataPoint {
  date: string | Date;
  value: number;
  [key: string]: any;
}

export interface MovingAverageChartProps {
  /** Time series dataset array ({ date, value }) */
  data: TimeSeriesDataPoint[];
  /** Initial sliding window size (N) in number of points/days */
  windowSize?: number;
  /** Minimum allowed window size (default 1) */
  minWindowSize?: number;
  /** Maximum allowed window size (default 365) */
  maxWindowSize?: number;
  /** Moving average algorithm type: 'sma' (Simple) or 'ema' (Exponential) */
  type?: 'sma' | 'ema';
  /** Chart height in pixels */
  height?: number;
  /** Color for raw data representation */
  rawColor?: string;
  /** Color for moving average trend line */
  maColor?: string;
  /** Rendering mode for raw data: 'area' | 'line' | 'bar' | 'none' */
  rawMode?: 'area' | 'line' | 'bar' | 'none';
  /** Show window N slider and input in top toolbar */
  showControls?: boolean;
  /** Show quick preset buttons (7D, 30D, 50D, 100D, 200D) */
  showPresets?: boolean;
  /** Enable hover crosshair and tooltips */
  interactive?: boolean;
  /** Main chart title */
  title?: string;
  /** Subtitle description */
  subtitle?: string;
  /** Custom value formatter */
  valueFormatter?: (val: number) => string;
  /** Custom date formatter */
  dateFormatter?: (date: Date) => string;
  /** Callback triggered when window size N changes */
  onWindowSizeChange?: (newSize: number) => void;
  /** Additional CSS class name */
  className?: string;
}

const PRESET_WINDOWS = [7, 30, 50, 100, 200];

export function MovingAverageChart({
  data = [],
  windowSize = 100,
  minWindowSize = 1,
  maxWindowSize = 365,
  type = 'sma',
  height = 480,
  rawColor = 'var(--md-sys-color-primary, #4682B4)',
  maColor = 'var(--md-sys-color-tertiary, #C0392B)',
  rawMode = 'area',
  showControls = true,
  showPresets = true,
  interactive = true,
  title,
  subtitle,
  valueFormatter,
  dateFormatter,
  onWindowSizeChange,
  className,
}: MovingAverageChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(700);

  const [currentWindowSize, setCurrentWindowSize] = useState(windowSize);
  const [hoveredPoint, setHoveredPoint] = useState<any | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Synchronize internal state if prop changes
  useEffect(() => {
    setCurrentWindowSize(windowSize);
  }, [windowSize]);

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

  const handleWindowChange = (val: number) => {
    const clamped = Math.max(minWindowSize, Math.min(maxWindowSize, val));
    setCurrentWindowSize(clamped);
    onWindowSizeChange?.(clamped);
  };

  // Compute moving average dataset
  const processedData = useMemo(() => {
    if (data.length === 0) return [];

    const points = data.map((d) => ({
      date: d.date instanceof Date ? d.date : new Date(d.date),
      value: Number(d.value) || 0,
      raw: d,
    }));

    // Sort chronologically
    points.sort((a, b) => a.date.getTime() - b.date.getTime());

    const N = Math.max(1, currentWindowSize);
    const isEMA = type === 'ema';
    const alpha = 2 / (N + 1);

    let emaPrev = points[0]?.value || 0;

    return points.map((p, i) => {
      let maVal = 0;
      if (isEMA) {
        if (i === 0) maVal = p.value;
        else {
          maVal = p.value * alpha + emaPrev * (1 - alpha);
        }
        emaPrev = maVal;
      } else {
        const start = Math.max(0, i - N + 1);
        const windowPoints = points.slice(start, i + 1);
        const sum = windowPoints.reduce((acc, curr) => acc + curr.value, 0);
        maVal = sum / windowPoints.length;
      }

      return {
        ...p,
        maValue: maVal,
      };
    });
  }, [data, currentWindowSize, type]);

  // Dimensions
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
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
    const maxVal = d3.max(processedData, (d) => Math.max(d.value, d.maValue)) || 1;
    return d3
      .scaleLinear()
      .domain([0, maxVal * 1.05])
      .range([height - margin.bottom, margin.top]);
  }, [processedData, height, margin.bottom, margin.top]);

  // Path Generators
  const rawAreaPath = useMemo(() => {
    if (!xScale || !yScale || processedData.length === 0) return '';
    const areaGen = d3
      .area<any>()
      .x((d) => xScale(d.date))
      .y0(height - margin.bottom)
      .y1((d) => yScale(d.value));
    return areaGen(processedData) || '';
  }, [xScale, yScale, processedData, height, margin.bottom]);

  const rawLinePath = useMemo(() => {
    if (!xScale || !yScale || processedData.length === 0) return '';
    const lineGen = d3
      .line<any>()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.value));
    return lineGen(processedData) || '';
  }, [xScale, yScale, processedData]);

  const maLinePath = useMemo(() => {
    if (!xScale || !yScale || processedData.length === 0) return '';
    const lineGen = d3
      .line<any>()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.maValue))
      .curve(d3.curveMonotoneX);
    return lineGen(processedData) || '';
  }, [xScale, yScale, processedData]);

  // Axis Ticks
  const xTicks = useMemo(() => {
    if (!xScale) return [];
    return xScale.ticks(Math.max(4, Math.floor(innerWidth / 100)));
  }, [xScale, innerWidth]);

  const yTicks = useMemo(() => {
    if (!yScale) return [];
    return yScale.ticks(6);
  }, [yScale]);

  // Formatters
  const formatValueStr = (val: number) => (valueFormatter ? valueFormatter(val) : val.toFixed(2));
  const formatDateStr = (date: Date) =>
    dateFormatter ? dateFormatter(date) : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

  // Mouse hover lookup
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!interactive || !xScale || processedData.length === 0 || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Clear tooltip if mouse is in margins outside plot area
      if (
        mouseX < margin.left ||
        mouseX > containerWidth - margin.right ||
        mouseY < margin.top ||
        mouseY > height - margin.bottom
      ) {
        setHoveredPoint(null);
        setMousePos(null);
        return;
      }

      setMousePos({ x: mouseX, y: mouseY });

      const dateAtMouse = xScale.invert(mouseX);
      const bisect = d3.bisector((d: any) => d.date).center;
      const idx = bisect(processedData, dateAtMouse);
      const point = processedData[idx];

      if (point) {
        setHoveredPoint(point);
      }
    },
    [interactive, xScale, processedData, margin, containerWidth, height]
  );


  return (
    <div className={cn(styles.root, className)} ref={containerRef} data-md3-component="moving-average-chart">
      {(title || subtitle || showControls) && (
        <div className={styles.header}>
          <div className={styles.headerText}>
            {title && <h4 className={styles.title}>{title}</h4>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>

          {showControls && (
            <div className={styles.controls}>
              <div className={styles.controlGroup}>
                <span className={styles.controlLabel}>Days (N):</span>
                <input
                  type="number"
                  className={styles.numberInput}
                  value={currentWindowSize}
                  min={minWindowSize}
                  max={maxWindowSize}
                  onChange={(e) => handleWindowChange(parseInt(e.target.value) || minWindowSize)}
                />
                <input
                  type="range"
                  className={styles.slider}
                  min={minWindowSize}
                  max={maxWindowSize}
                  value={currentWindowSize}
                  onChange={(e) => handleWindowChange(parseInt(e.target.value))}
                />
              </div>

              {showPresets && (
                <div className={styles.presetGroup}>
                  {PRESET_WINDOWS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      className={cn(styles.presetBtn, currentWindowSize === preset && styles.presetBtnActive)}
                      onClick={() => handleWindowChange(preset)}
                    >
                      {preset}D
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

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
          {xScale && yScale && (
            <>
              {/* Horizontal Y Gridlines & Labels */}
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
                      y={height - margin.bottom + 18}
                      textAnchor="middle"
                    >
                      {tickDate.getFullYear()}
                    </text>
                  );
                })}
              </g>

              {/* Raw Data Layer */}
              {rawMode === 'area' && (
                <path className={styles.rawArea} d={rawAreaPath} fill={rawColor} />
              )}
              {rawMode === 'line' && (
                <path className={styles.rawLine} d={rawLinePath} stroke={rawColor} />
              )}

              {/* Moving Average Line Layer */}
              <path className={styles.maLine} d={maLinePath} stroke={maColor} />

              {/* Interactive Hover Crosshair & Dots */}
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

                  {/* Dot on Raw Value */}
                  <circle
                    className={styles.focusDot}
                    cx={xScale(hoveredPoint.date)}
                    cy={yScale(hoveredPoint.value)}
                    r={4}
                    stroke={rawColor}
                  />

                  {/* Dot on Moving Average Line */}
                  <circle
                    className={styles.focusDot}
                    cx={xScale(hoveredPoint.date)}
                    cy={yScale(hoveredPoint.maValue)}
                    r={5}
                    stroke={maColor}
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
              left: Math.min(containerWidth - 120, Math.max(120, mousePos.x)),
              top: mousePos.y,
            }}
          >
            <div className={styles.tooltipDate}>{formatDateStr(hoveredPoint.date)}</div>
            <div className={styles.tooltipRow}>
              <span style={{ color: rawColor }}>Raw Value:</span>
              <span className={styles.tooltipValue}>{formatValueStr(hoveredPoint.value)}</span>
            </div>
            <div className={styles.tooltipRow}>
              <span style={{ color: maColor }}>MA ({currentWindowSize}D):</span>
              <span className={styles.tooltipValue}>{formatValueStr(hoveredPoint.maValue)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
