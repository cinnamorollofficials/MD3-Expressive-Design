import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { cn } from '../../utils/cn';
import styles from './CandlestickChart.module.css';

export interface CandlestickDataPoint {
  date: string | Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
  [key: string]: any;
}

export interface CandlestickChartProps {
  /** Array of candlestick data points */
  data: CandlestickDataPoint[];
  /** Chart height in pixels */
  height?: number;
  /** Whether to render volume histogram at the bottom */
  showVolume?: boolean;
  /** Whether to render Moving Average overlay */
  showSma?: boolean;
  /** Moving average window period (default: 9) */
  smaPeriod?: number;
  /** Whether to render Bollinger Bands overlay */
  showBollinger?: boolean;
  /** Bollinger Bands window period (default: 20) */
  bollingerPeriod?: number;
  /** Bollinger Bands standard deviation multiplier (default: 2) */
  bollingerStdDev?: number;
  /** Color for bullish (up) candles */
  upColor?: string;
  /** Color for bearish (down) candles */
  downColor?: string;
  /** Color for Moving Average line */
  maColor?: string;
  /** Color for Bollinger Bands */
  bollingerColor?: string;
  /** Chart main title */
  title?: string;
  /** Chart subtitle description */
  subtitle?: string;
  /** Value formatter for prices */
  valueFormatter?: (val: number) => string;
  /** Date formatter */
  dateFormatter?: (date: Date) => string;
  /** Enable interactive hover crosshair and legend */
  interactive?: boolean;
  /** Additional CSS class name */
  className?: string;
}

export function CandlestickChart({
  data = [],
  height = 400,
  showVolume = true,
  showSma = true,
  smaPeriod = 9,
  showBollinger = false,
  bollingerPeriod = 20,
  bollingerStdDev = 2,
  upColor = '#00e676',
  downColor = '#ff5252',
  maColor = '#38bdf8',
  bollingerColor = '#a78bfa',
  title,
  subtitle,
  valueFormatter,
  dateFormatter,
  interactive = true,
  className,
}: CandlestickChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const [containerHeight, setContainerHeight] = useState<number>(height);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // ResizeObserver for responsive width & height
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(entry.contentRect.width);
        }
        if (entry.contentRect.height > 0) {
          setContainerHeight(entry.contentRect.height);
        }
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Parse dates and compute indicators
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const parsed = data.map((d) => ({
      ...d,
      parsedDate: d.date instanceof Date ? d.date : new Date(d.date),
      volume: d.volume ?? 0,
    }));

    // Sort chronologically
    parsed.sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime());

    // Calculate SMA
    const result = parsed.map((d, idx) => {
      let smaVal: number | undefined = undefined;
      if (idx >= smaPeriod - 1) {
        const slice = parsed.slice(idx - smaPeriod + 1, idx + 1);
        const sum = slice.reduce((acc, curr) => acc + curr.close, 0);
        smaVal = sum / smaPeriod;
      }

      // Calculate Bollinger Bands
      let upperBand: number | undefined = undefined;
      let lowerBand: number | undefined = undefined;
      let bollingerMiddle: number | undefined = undefined;

      if (idx >= bollingerPeriod - 1) {
        const slice = parsed.slice(idx - bollingerPeriod + 1, idx + 1);
        const mean = slice.reduce((acc, curr) => acc + curr.close, 0) / bollingerPeriod;
        const variance = slice.reduce((acc, curr) => acc + Math.pow(curr.close - mean, 2), 0) / bollingerPeriod;
        const stdDev = Math.sqrt(variance);

        bollingerMiddle = mean;
        upperBand = mean + bollingerStdDev * stdDev;
        lowerBand = mean - bollingerStdDev * stdDev;
      }

      return {
        ...d,
        sma: smaVal,
        bollingerMiddle,
        upperBand,
        lowerBand,
      };
    });

    return result;
  }, [data, smaPeriod, bollingerPeriod, bollingerStdDev]);

  const activePoint = useMemo(() => {
    if (processedData.length === 0) return null;
    if (hoverIndex !== null && processedData[hoverIndex]) {
      return processedData[hoverIndex];
    }
    return processedData[processedData.length - 1];
  }, [processedData, hoverIndex]);

  const defaultFormatValue = useCallback((val: number) => {
    if (valueFormatter) return valueFormatter(val);
    return val >= 10000 ? val.toLocaleString() : val.toFixed(2);
  }, [valueFormatter]);

  const defaultFormatDate = useCallback((d: Date) => {
    if (dateFormatter) return dateFormatter(d);
    return d3.timeFormat('%b %d, %H:%M')(d);
  }, [dateFormatter]);

  // Layout dimensions
  const padding = { top: 20, right: 65, bottom: 30, left: 10 };
  const innerWidth = Math.max(100, containerWidth - padding.left - padding.right);
  const innerHeight = Math.max(100, (containerHeight || height) - padding.top - padding.bottom);

  // Scales
  const { xScale, yScale, volScale, candleWidth, stepX } = useMemo(() => {
    if (processedData.length === 0) {
      return {
        xScale: d3.scaleTime().range([0, innerWidth]),
        yScale: d3.scaleLinear().range([innerHeight, 0]),
        volScale: d3.scaleLinear().range([0, 50]),
        candleWidth: 6,
        stepX: 10,
      };
    }

    const minPrice = d3.min(processedData, (d) => Math.min(d.low, d.lowerBand ?? d.low)) ?? 0;
    const maxPrice = d3.max(processedData, (d) => Math.max(d.high, d.upperBand ?? d.high)) ?? 100;
    const pricePadding = (maxPrice - minPrice) * 0.05 || 5;

    const y = d3.scaleLinear()
      .domain([Math.max(0, minPrice - pricePadding), maxPrice + pricePadding])
      .range([showVolume ? innerHeight * 0.78 : innerHeight, 0]);

    const maxVol = d3.max(processedData, (d) => d.volume) || 1;
    const volY = d3.scaleLinear()
      .domain([0, maxVol])
      .range([0, innerHeight * 0.20]);

    const step = innerWidth / processedData.length;
    const candleW = Math.max(2, Math.min(18, step * 0.7));

    return {
      xScale: d3.scaleTime().domain(d3.extent(processedData, (d) => d.parsedDate) as [Date, Date]).range([0, innerWidth]),
      yScale: y,
      volScale: volY,
      candleWidth: candleW,
      stepX: step,
    };
  }, [processedData, innerWidth, innerHeight, showVolume]);

  // Generators for SMA & Bollinger Bands paths
  const smaLinePath = useMemo(() => {
    if (!showSma || processedData.length === 0) return '';
    const lineGen = d3.line<typeof processedData[0]>()
      .defined((d) => d.sma !== undefined)
      .x((_, i) => i * stepX + stepX / 2)
      .y((d) => yScale(d.sma!))
      .curve(d3.curveMonotoneX);
    return lineGen(processedData) || '';
  }, [processedData, showSma, stepX, yScale]);

  const bollingerUpperPath = useMemo(() => {
    if (!showBollinger || processedData.length === 0) return '';
    const lineGen = d3.line<typeof processedData[0]>()
      .defined((d) => d.upperBand !== undefined)
      .x((_, i) => i * stepX + stepX / 2)
      .y((d) => yScale(d.upperBand!))
      .curve(d3.curveMonotoneX);
    return lineGen(processedData) || '';
  }, [processedData, showBollinger, stepX, yScale]);

  const bollingerLowerPath = useMemo(() => {
    if (!showBollinger || processedData.length === 0) return '';
    const lineGen = d3.line<typeof processedData[0]>()
      .defined((d) => d.lowerBand !== undefined)
      .x((_, i) => i * stepX + stepX / 2)
      .y((d) => yScale(d.lowerBand!))
      .curve(d3.curveMonotoneX);
    return lineGen(processedData) || '';
  }, [processedData, showBollinger, stepX, yScale]);

  const yTicks = useMemo(() => {
    return yScale.ticks(6);
  }, [yScale]);

  return (
    <div className={cn(styles.root, className)}>
      {(title || subtitle) && (
        <div className={styles.header}>
          <div>
            {title && <h4 className={styles.title}>{title}</h4>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>
      )}

      {/* Interactive OHLCV Legend Bar */}
      {activePoint && (
        <div className={styles.legendBar}>
          <span className={styles.legendItem}>
            <span>O:</span>
            <span className={`${styles.legendVal} ${activePoint.close >= activePoint.open ? styles.upText : styles.downText}`}>
              {defaultFormatValue(activePoint.open)}
            </span>
          </span>
          <span className={styles.legendItem}>
            <span>H:</span>
            <span className={`${styles.legendVal} ${activePoint.close >= activePoint.open ? styles.upText : styles.downText}`}>
              {defaultFormatValue(activePoint.high)}
            </span>
          </span>
          <span className={styles.legendItem}>
            <span>L:</span>
            <span className={`${styles.legendVal} ${activePoint.close >= activePoint.open ? styles.upText : styles.downText}`}>
              {defaultFormatValue(activePoint.low)}
            </span>
          </span>
          <span className={styles.legendItem}>
            <span>C:</span>
            <span className={`${styles.legendVal} ${activePoint.close >= activePoint.open ? styles.upText : styles.downText}`}>
              {defaultFormatValue(activePoint.close)}
            </span>
          </span>
          {showVolume && (
            <span className={styles.legendItem}>
              <span>Vol:</span>
              <span className={styles.legendVal}>{activePoint.volume.toLocaleString()}</span>
            </span>
          )}
          {showSma && activePoint.sma !== undefined && (
            <span className={styles.legendItem} style={{ color: maColor }}>
              <span>SMA({smaPeriod}):</span>
              <span className={styles.legendVal}>{defaultFormatValue(activePoint.sma)}</span>
            </span>
          )}
        </div>
      )}

      <div className={styles.chartContainer} ref={containerRef}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${containerWidth} ${containerHeight || height}`}
          onMouseLeave={() => setHoverIndex(null)}
          onMouseMove={(e) => {
            if (!interactive || processedData.length === 0) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const mouseX = e.clientX - rect.left - padding.left;
            const idx = Math.min(
              processedData.length - 1,
              Math.max(0, Math.floor(mouseX / stepX))
            );
            setHoverIndex(idx);
          }}
        >
          <g transform={`translate(${padding.left}, ${padding.top})`}>
            {/* Grid & Y-Axis Labels */}
            {yTicks.map((tick, idx) => {
              const y = yScale(tick);
              return (
                <g key={`ytick-${idx}`}>
                  <line
                    className={styles.gridLine}
                    x1={0}
                    y1={y}
                    x2={innerWidth}
                    y2={y}
                  />
                  <text
                    className={styles.axisText}
                    x={innerWidth + 6}
                    y={y + 3}
                  >
                    {defaultFormatValue(tick)}
                  </text>
                </g>
              );
            })}

            {/* Bollinger Bands Paths */}
            {showBollinger && (
              <>
                <path
                  d={bollingerUpperPath}
                  fill="none"
                  stroke={bollingerColor}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
                <path
                  d={bollingerLowerPath}
                  fill="none"
                  stroke={bollingerColor}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
              </>
            )}

            {/* Moving Average Line Path */}
            {showSma && (
              <path
                d={smaLinePath}
                fill="none"
                stroke={maColor}
                strokeWidth={1.8}
              />
            )}

            {/* Volume Bars */}
            {showVolume &&
              processedData.map((d, i) => {
                const cx = i * stepX + stepX / 2;
                const isBull = d.close >= d.open;
                const volH = volScale(d.volume);
                const volY = innerHeight - volH;

                return (
                  <rect
                    key={`vol-${i}`}
                    x={cx - candleWidth / 2}
                    y={volY}
                    width={candleWidth}
                    height={volH}
                    fill={isBull ? 'rgba(0, 230, 118, 0.25)' : 'rgba(255, 82, 82, 0.25)'}
                  />
                );
              })}

            {/* Candlesticks (Wicks + Bodies) */}
            {processedData.map((d, i) => {
              const cx = i * stepX + stepX / 2;
              const isBull = d.close >= d.open;
              const color = isBull ? upColor : downColor;

              const highY = yScale(d.high);
              const lowY = yScale(d.low);
              const openY = yScale(d.open);
              const closeY = yScale(d.close);

              const bodyY = Math.min(openY, closeY);
              const bodyH = Math.max(1, Math.abs(closeY - openY));

              return (
                <g key={`candle-${i}`}>
                  {/* High-Low Wick */}
                  <line
                    x1={cx}
                    y1={highY}
                    x2={cx}
                    y2={lowY}
                    stroke={color}
                    strokeWidth={1.2}
                  />
                  {/* Open-Close Body */}
                  <rect
                    x={cx - candleWidth / 2}
                    y={bodyY}
                    width={candleWidth}
                    height={bodyH}
                    fill={color}
                    stroke={color}
                  />
                </g>
              );
            })}

            {/* Current Last Price Line Indicator */}
            {processedData.length > 0 && (() => {
              const last = processedData[processedData.length - 1];
              const lastY = yScale(last.close);
              const lastColor = last.close >= last.open ? upColor : downColor;
              return (
                <g key="last-price-line">
                  <line
                    x1={0}
                    y1={lastY}
                    x2={innerWidth}
                    y2={lastY}
                    stroke={lastColor}
                    strokeWidth={1}
                    strokeDasharray="2 2"
                  />
                  <rect
                    x={innerWidth}
                    y={lastY - 9}
                    width={58}
                    height={18}
                    rx={4}
                    fill={lastColor}
                  />
                  <text
                    x={innerWidth + 6}
                    y={lastY + 4}
                    fill="#000000"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    {defaultFormatValue(last.close)}
                  </text>
                </g>
              );
            })()}

            {/* Hover Hairline Crosshair */}
            {hoverIndex !== null && processedData[hoverIndex] && (
              <g key="crosshair">
                <line
                  x1={hoverIndex * stepX + stepX / 2}
                  y1={0}
                  x2={hoverIndex * stepX + stepX / 2}
                  y2={innerHeight}
                  stroke="var(--md-sys-color-on-surface-variant, #94a3b8)"
                  strokeWidth={0.8}
                  strokeDasharray="3 3"
                />
              </g>
            )}

            {/* Time X-Axis Ticks */}
            {processedData.map((d, i) => {
              if (i % Math.max(1, Math.floor(processedData.length / 7)) !== 0) return null;
              const cx = i * stepX + stepX / 2;
              return (
                <text
                  key={`time-${i}`}
                  className={styles.axisText}
                  x={cx}
                  y={innerHeight + 18}
                  textAnchor="middle"
                >
                  {defaultFormatDate(d.parsedDate)}
                </text>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
