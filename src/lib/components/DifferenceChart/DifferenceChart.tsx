import { useMemo, useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
import { cn } from '../../utils/cn';
import styles from './DifferenceChart.module.css';

export interface DifferenceChartProps {
  /** Array of data objects to render */
  data: any[];
  /** Key of the x-axis value in the data objects */
  xKey: string;
  /** Key of the first series (renders as the main outline line) */
  y0Key: string;
  /** Key of the second series (comparison target) */
  y1Key: string;
  /** Label for the first series */
  y0Label?: string;
  /** Label for the second series */
  y1Label?: string;
  /** Chart height in pixels. Width is responsive */
  height?: number;
  /** Padding around the chart inside the SVG */
  margin?: { top: number; right: number; bottom: number; left: number };
  /** Curve style of the area paths */
  curve?: 'linear' | 'monotone' | 'step';
  /** Show horizontal grid lines */
  showGrid?: boolean;
  /** Show X and Y axes */
  showAxes?: boolean;
  /** Custom colors for positive (y0 > y1) and negative (y0 < y1) fills */
  colors?: { positive: string; negative: string };
  /** Enable interactive tooltips and tracking lines on hover */
  interactive?: boolean;
  /** Main chart title */
  title?: string;
  /** Subtitle or description below the title */
  subtitle?: string;
  /** Optional custom formatter for X-axis values */
  xFormatter?: (val: any) => string;
  /** Optional custom formatter for Y-axis values */
  yFormatter?: (val: any) => string;
  /** Additional CSS class name */
  className?: string;
}

const DEFAULT_COLORS = {
  positive: '#5985ab', // blue (SF > NY in winter or actual > normal)
  negative: '#f09438', // orange (SF < NY or actual < normal)
};

export function DifferenceChart({
  data = [],
  xKey,
  y0Key,
  y1Key,
  y0Label = 'Series A',
  y1Label = 'Series B',
  height = 300,
  margin = { top: 24, right: 24, bottom: 40, left: 48 },
  curve = 'monotone',
  showGrid = true,
  showAxes = true,
  colors = DEFAULT_COLORS,
  interactive = true,
  title,
  subtitle,
  xFormatter,
  yFormatter,
  className,
}: DifferenceChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(500);

  // Unique ID for SVG ClipPaths to avoid conflicts between multiple instances
  const uniqueId = useMemo(() => Math.random().toString(36).substring(2, 9), []);
  const clipAboveId = `diff-clip-above-${uniqueId}`;
  const clipBelowId = `diff-clip-below-${uniqueId}`;

  // ResizeObserver to handle fluid responsiveness
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width } = entries[0].contentRect;
      if (width > 0) {
        setContainerWidth(width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Parse x values to detect Dates/Numbers
  const parsedData = useMemo(() => {
    if (!data.length) return [];
    return data.map((d) => {
      const rawX = d[xKey];
      let parsedX = rawX;
      if (rawX instanceof Date) {
        parsedX = rawX;
      } else if (typeof rawX === 'string' && !isNaN(Date.parse(rawX)) && isNaN(Number(rawX))) {
        parsedX = new Date(rawX);
      }
      return {
        ...d,
        _rawX: rawX,
        _x: parsedX,
      };
    });
  }, [data, xKey]);

  // Dimensions of drawing area
  const innerWidth = Math.max(0, containerWidth - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);

  // Create Scales
  const scales = useMemo(() => {
    if (!parsedData.length || innerWidth <= 0 || innerHeight <= 0) return null;

    const firstX = parsedData[0]._x;
    const isDate = firstX instanceof Date;
    const isNumeric = typeof firstX === 'number';

    let xScale: d3.ScaleTime<number, number> | d3.ScaleLinear<number, number> | d3.ScalePoint<string>;

    if (isDate) {
      xScale = d3.scaleTime()
        .domain(d3.extent(parsedData, d => d._x as Date) as [Date, Date])
        .range([0, innerWidth]);
    } else if (isNumeric) {
      xScale = d3.scaleLinear()
        .domain(d3.extent(parsedData, d => d._x as number) as [number, number])
        .range([0, innerWidth]);
    } else {
      xScale = d3.scalePoint<string>()
        .domain(parsedData.map(d => String(d._rawX)))
        .range([0, innerWidth])
        .padding(0.1);
    }

    const yMin = d3.min(parsedData, d => Math.min(Number(d[y0Key]) || 0, Number(d[y1Key]) || 0)) || 0;
    const yMax = d3.max(parsedData, d => Math.max(Number(d[y0Key]) || 0, Number(d[y1Key]) || 0)) || 0;
    
    // Add some padding to domain bounds
    const domainDiff = yMax - yMin;
    const yPad = domainDiff > 0 ? domainDiff * 0.05 : 10;

    const yScale = d3.scaleLinear()
      .domain([yMin - yPad, yMax + yPad])
      .range([innerHeight, 0])
      .nice();

    return { xScale, yScale, isDate, isNumeric };
  }, [parsedData, y0Key, y1Key, innerWidth, innerHeight]);

  // Curve interpolator lookup
  const curveInterpolator = useMemo(() => {
    switch (curve) {
      case 'linear':
        return d3.curveLinear;
      case 'step':
        return d3.curveStep;
      case 'monotone':
      default:
        return d3.curveMonotoneX;
    }
  }, [curve]);

  // Generate paths and clips
  const paths = useMemo(() => {
    if (!scales || !parsedData.length) return null;
    const { xScale, yScale } = scales;

    // 1. Clip above: area NY from 0 to yScale(NY)
    const clipAboveGenerator = d3.area<any>()
      .x(d => {
        const val = d._x;
        return xScale(val instanceof Date ? val.getTime() : val as any) || 0;
      })
      .y0(0)
      .y1(d => yScale(Number(d[y1Key]) || 0))
      .curve(curveInterpolator);

    // 2. Clip below: area NY from yScale(NY) to innerHeight
    const clipBelowGenerator = d3.area<any>()
      .x(d => {
        const val = d._x;
        return xScale(val instanceof Date ? val.getTime() : val as any) || 0;
      })
      .y0(d => yScale(Number(d[y1Key]) || 0))
      .y1(innerHeight)
      .curve(curveInterpolator);

    // 3. SF Area (below SF) to clip with clipAbove -> positive difference (SF > NY)
    const sfAreaGenerator = d3.area<any>()
      .x(d => {
        const val = d._x;
        return xScale(val instanceof Date ? val.getTime() : val as any) || 0;
      })
      .y0(innerHeight)
      .y1(d => yScale(Number(d[y0Key]) || 0))
      .curve(curveInterpolator);

    // 4. SF Area (above SF) to clip with clipBelow -> negative difference (SF < NY)
    const sfAreaAboveGenerator = d3.area<any>()
      .x(d => {
        const val = d._x;
        return xScale(val instanceof Date ? val.getTime() : val as any) || 0;
      })
      .y0(0)
      .y1(d => yScale(Number(d[y0Key]) || 0))
      .curve(curveInterpolator);

    // 5. Line paths
    const line0Generator = d3.line<any>()
      .x(d => {
        const val = d._x;
        return xScale(val instanceof Date ? val.getTime() : val as any) || 0;
      })
      .y(d => yScale(Number(d[y0Key]) || 0))
      .curve(curveInterpolator);

    const line1Generator = d3.line<any>()
      .x(d => {
        const val = d._x;
        return xScale(val instanceof Date ? val.getTime() : val as any) || 0;
      })
      .y(d => yScale(Number(d[y1Key]) || 0))
      .curve(curveInterpolator);

    return {
      clipAbovePath: clipAboveGenerator(parsedData) || '',
      clipBelowPath: clipBelowGenerator(parsedData) || '',
      sfAreaPath: sfAreaGenerator(parsedData) || '',
      sfAreaAbovePath: sfAreaAboveGenerator(parsedData) || '',
      line0Path: line0Generator(parsedData) || '',
      line1Path: line1Generator(parsedData) || '',
    };
  }, [scales, parsedData, y0Key, y1Key, curveInterpolator, innerHeight]);

  // Interactive Hover state (index in parsedData)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const handlePointerMove = (e: React.PointerEvent<SVGRectElement>) => {
    if (!interactive || !scales || !parsedData.length) return;

    const { xScale, isDate, isNumeric } = scales;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    let idx = 0;

    if (isDate || isNumeric) {
      const activeXVal = (xScale as any).invert(mouseX);
      const bisect = d3.bisector((d: any) => d._x).left;
      const bIdx = bisect(parsedData, activeXVal, 1);

      const p0 = parsedData[bIdx - 1];
      const p1 = parsedData[bIdx];

      if (p0 && p1) {
        const t0 = p0._x instanceof Date ? p0._x.getTime() : (p0._x as number);
        const t1 = p1._x instanceof Date ? p1._x.getTime() : (p1._x as number);
        const tActive = activeXVal instanceof Date ? activeXVal.getTime() : (activeXVal as number);
        idx = tActive - t0 < t1 - tActive ? bIdx - 1 : bIdx;
      } else {
        idx = p0 ? bIdx - 1 : bIdx;
      }
    } else {
      const domain = xScale.domain();
      const range = xScale.range();
      const step = (range[1] - range[0]) / (domain.length - 1 || 1);
      idx = Math.min(domain.length - 1, Math.max(0, Math.round((mouseX - range[0]) / step)));
    }

    if (idx >= 0 && idx < parsedData.length) {
      setHoverIndex(idx);
    }
  };

  const handlePointerLeave = () => {
    setHoverIndex(null);
  };

  // Ticks generators
  const xTicksData = useMemo<{ pos: number; label: string }[]>(() => {
    if (!scales) return [];
    const { xScale, isDate, isNumeric } = scales;

    if (isDate || isNumeric) {
      const count = Math.min(parsedData.length, Math.max(2, Math.floor(containerWidth / 90)));
      return (xScale as any).ticks(count).map((val: any) => {
        let label = '';
        if (xFormatter) {
          label = xFormatter(val);
        } else if (isDate) {
          label = d3.timeFormat('%B')(val as Date); // format as Month Name (e.g. October)
        } else {
          label = String(val);
        }
        return {
          pos: (xScale as any)(val) || 0,
          label,
        };
      });
    } else {
      const domain = xScale.domain();
      const skipFactor = Math.ceil(domain.length / (containerWidth / 70));
      return domain.map((val, i) => {
        if (i % skipFactor !== 0) return null;
        const valStr = String(val);
        return {
          pos: (xScale as d3.ScalePoint<string>)(valStr) || 0,
          label: xFormatter ? xFormatter(val) : valStr,
        };
      }).filter(Boolean) as { pos: number; label: string }[];
    }
  }, [scales, parsedData, containerWidth, xFormatter]);

  const yTicksData = useMemo(() => {
    if (!scales) return [];
    const { yScale } = scales;
    const ticks = yScale.ticks(6);
    return ticks.map((val) => ({
      pos: yScale(val),
      label: yFormatter ? yFormatter(val) : String(val),
    }));
  }, [scales, yFormatter]);

  // Hover details calculation
  const hoverDetails = useMemo(() => {
    if (hoverIndex === null || !scales) return null;
    const { xScale, yScale } = scales;
    const activePoint = parsedData[hoverIndex];

    const posX = xScale(activePoint._x instanceof Date ? activePoint._x.getTime() : activePoint._x as any) || 0;
    
    const y0Val = Number(activePoint[y0Key]) || 0;
    const y1Val = Number(activePoint[y1Key]) || 0;

    const titleX = xFormatter 
      ? xFormatter(activePoint._rawX)
      : (activePoint._x instanceof Date ? d3.timeFormat('%B %d, %Y')(activePoint._x) : String(activePoint._rawX));

    return {
      x: posX,
      title: titleX,
      y0: yScale(y0Val),
      y1: yScale(y1Val),
      y0Val,
      y1Val,
    };
  }, [hoverIndex, scales, parsedData, y0Key, y1Key, xFormatter]);

  return (
    <div 
      className={cn(styles.root, className)}
      ref={containerRef}
      data-md3-component="difference-chart"
    >
      {(title || subtitle) && (
        <div className={styles.header}>
          {title && <h4 className={styles.title}>{title}</h4>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}

      {/* Legend Row */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: colors.positive }} />
          <span>{y0Label} is warmer than {y1Label}</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: colors.negative }} />
          <span>{y0Label} is colder than {y1Label}</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendLine0} />
          <span>{y0Label}</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendLine1} />
          <span>{y1Label}</span>
        </div>
      </div>

      <div className={styles.chartContainer} style={{ height }}>
        {scales && paths && (
          <svg
            className={styles.svg}
            width={containerWidth}
            height={height}
            viewBox={`0 0 ${containerWidth} ${height}`}
          >
            {/* SVG Clip Path definitions */}
            <defs>
              <clipPath id={clipAboveId}>
                <path d={paths.clipAbovePath} />
              </clipPath>
              <clipPath id={clipBelowId}>
                <path d={paths.clipBelowPath} />
              </clipPath>
            </defs>

            <g transform={`translate(${margin.left}, ${margin.top})`}>
              {/* Grid Lines */}
              {showGrid && (
                <g>
                  {yTicksData.map((tick, i) => (
                    <line
                      key={i}
                      className={styles.gridLine}
                      x1={0}
                      y1={tick.pos}
                      x2={innerWidth}
                      y2={tick.pos}
                    />
                  ))}
                </g>
              )}

              {/* Area Fills clipped dynamically */}
              {/* 1. Positive difference (SF > NY) clipped by above NY */}
              <path
                className={styles.positiveArea}
                d={paths.sfAreaPath}
                clipPath={`url(#${clipAboveId})`}
                fill={colors.positive}
              />

              {/* 2. Negative difference (SF < NY) clipped by below NY */}
              <path
                className={styles.negativeArea}
                d={paths.sfAreaAbovePath}
                clipPath={`url(#${clipBelowId})`}
                fill={colors.negative}
              />

              {/* Faint comparison line y1 (NY) */}
              <path
                className={styles.line1}
                d={paths.line1Path}
              />

              {/* Bold main outline line y0 (SF) */}
              <path
                className={styles.line0}
                d={paths.line0Path}
              />

              {/* Y Axis ticks & label */}
              {showAxes && (
                <g className={styles.axis}>
                  {yTicksData.map((tick, i) => (
                    <g key={i} transform={`translate(0, ${tick.pos})`}>
                      <line 
                        className={styles.axisTickLine} 
                        x1={-6} 
                        y1={0} 
                        x2={0} 
                        y2={0} 
                      />
                      <text
                        className={styles.axisText}
                        x={-10}
                        dy="0.32em"
                        textAnchor="end"
                      >
                        {tick.label}
                      </text>
                    </g>
                  ))}
                </g>
              )}

              {/* X Axis ticks & label */}
              {showAxes && (
                <g className={styles.axis} transform={`translate(0, ${innerHeight})`}>
                  <line 
                    className={styles.axisLine} 
                    x1={0} 
                    y1={0} 
                    x2={innerWidth} 
                    y2={0} 
                  />
                  {xTicksData.map((tick, i) => (
                    <g key={i} transform={`translate(${tick.pos}, 0)`}>
                      <line 
                        className={styles.axisTickLine} 
                        x1={0} 
                        y1={0} 
                        x2={0} 
                        y2={6} 
                      />
                      <text
                        className={styles.axisText}
                        y={20}
                        textAnchor="middle"
                      >
                        {tick.label}
                      </text>
                    </g>
                  ))}
                </g>
              )}

              {/* Interactive Hover Indicators */}
              {interactive && hoverDetails && (
                <g>
                  {/* Vertical dashed line */}
                  <line
                    className={styles.hoverLine}
                    x1={hoverDetails.x}
                    y1={0}
                    x2={hoverDetails.x}
                    y2={innerHeight}
                  />

                  {/* Marker dot on Series y0 (SF) */}
                  <circle
                    className={styles.hoverDot}
                    cx={hoverDetails.x}
                    cy={hoverDetails.y0}
                    r={5}
                    fill="var(--md-sys-color-on-surface)"
                  />

                  {/* Marker dot on Series y1 (NY) */}
                  <circle
                    className={styles.hoverDot}
                    cx={hoverDetails.x}
                    cy={hoverDetails.y1}
                    r={4}
                    fill="var(--md-sys-color-outline)"
                  />
                </g>
              )}

              {/* Interactive Mouse Event Overlay */}
              {interactive && (
                <rect
                  className={styles.overlay}
                  width={innerWidth}
                  height={innerHeight}
                  onPointerMove={handlePointerMove}
                  onPointerLeave={handlePointerLeave}
                />
              )}
            </g>
          </svg>
        )}

        {/* Floating Tooltip Card */}
        {interactive && hoverDetails && (
          <div
            className={styles.tooltip}
            style={{
              left: hoverDetails.x + margin.left,
              top: Math.min(hoverDetails.y0, hoverDetails.y1) + margin.top, // position above the higher dot
            }}
          >
            <span className={styles.tooltipTitle}>{hoverDetails.title}</span>
            <div className={styles.tooltipRow}>
              <div className={styles.tooltipLabelGroup}>
                <span className={styles.tooltipMarker} style={{ backgroundColor: 'var(--md-sys-color-on-surface)' }} />
                <span>{y0Label}</span>
              </div>
              <span className={styles.tooltipValue}>
                {yFormatter ? yFormatter(hoverDetails.y0Val) : hoverDetails.y0Val}
              </span>
            </div>
            <div className={styles.tooltipRow}>
              <div className={styles.tooltipLabelGroup}>
                <span className={styles.tooltipMarker} style={{ backgroundColor: 'var(--md-sys-color-outline-variant)' }} />
                <span>{y1Label}</span>
              </div>
              <span className={styles.tooltipValue}>
                {yFormatter ? yFormatter(hoverDetails.y1Val) : hoverDetails.y1Val}
              </span>
            </div>
            <div className={styles.tooltipRow} style={{ borderTop: '1px solid var(--md-sys-color-outline-variant)', paddingTop: 4, marginTop: 2 }}>
              <span style={{ fontWeight: 500 }}>Difference</span>
              <span className={styles.tooltipValue} style={{ color: hoverDetails.y0Val >= hoverDetails.y1Val ? colors.positive : colors.negative }}>
                {hoverDetails.y0Val >= hoverDetails.y1Val ? '+' : ''}
                {yFormatter 
                  ? yFormatter(Math.round((hoverDetails.y0Val - hoverDetails.y1Val) * 10) / 10)
                  : Math.round((hoverDetails.y0Val - hoverDetails.y1Val) * 10) / 10}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Fallback formatter helper
function numberFormatter(val: any): string {
  const num = Number(val);
  if (isNaN(num)) return String(val);
  return new Intl.NumberFormat('en-US').format(num);
}
