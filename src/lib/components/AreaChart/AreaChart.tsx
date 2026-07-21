import { useMemo, useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
import { cn } from '../../utils/cn';
import styles from './AreaChart.module.css';

export interface AreaChartProps {
  /** Array of data objects to render */
  data: any[];
  /** Key of the x-axis value in the data objects */
  xKey: string;
  /** Key of the y-axis value in the data objects */
  yKey: string;
  /** Chart height in pixels. Width is responsive (100% of container) */
  height?: number;
  /** Padding around the chart inside the SVG */
  margin?: { top: number; right: number; bottom: number; left: number };
  /** Curve style of the area chart */
  curve?: 'linear' | 'monotone' | 'step';
  /** Show horizontal grid lines */
  showGrid?: boolean;
  /** Show X and Y axes */
  showAxes?: boolean;
  /** Override primary stroke/fill color (supports CSS variables, e.g. 'var(--md-sys-color-tertiary)') */
  color?: string;
  /** Fill area with a translucent gradient */
  gradient?: boolean;
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
  /** Optional custom formatter for tooltips */
  tooltipFormatter?: (val: any) => { label: string; value: string } | string;
  /** Additional CSS class name */
  className?: string;
}

export function AreaChart({
  data = [],
  xKey,
  yKey,
  height = 300,
  margin = { top: 24, right: 24, bottom: 40, left: 48 },
  curve = 'monotone',
  showGrid = true,
  showAxes = true,
  color,
  gradient = true,
  interactive = true,
  title,
  subtitle,
  xFormatter,
  yFormatter,
  tooltipFormatter,
  className,
}: AreaChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(500);

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

  // Parse x values to detect Dates and ensure y values are numeric
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
        _y: Number(d[yKey]) || 0,
      };
    });
  }, [data, xKey, yKey]);

  // Dimensions of the inner chart drawing area
  const innerWidth = Math.max(0, containerWidth - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);

  // Generate unique gradient ID to avoid collisions
  const gradientId = useMemo(() => `area-grad-${Math.random().toString(36).substring(2, 9)}`, []);

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
      // Fallback to ordinal/categorical scale
      xScale = d3.scalePoint<string>()
        .domain(parsedData.map(d => String(d._rawX)))
        .range([0, innerWidth])
        .padding(0.1);
    }

    const yMax = d3.max(parsedData, d => d._y) || 0;
    const yScale = d3.scaleLinear()
      .domain([0, yMax * 1.1]) // add 10% headroom
      .range([innerHeight, 0])
      .nice();

    return { xScale, yScale, isDate, isNumeric };
  }, [parsedData, innerWidth, innerHeight]);

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

  // Generate paths
  const paths = useMemo(() => {
    if (!scales || !parsedData.length) return null;
    const { xScale, yScale } = scales;

    const areaGenerator = d3.area<any>()
      .x(d => {
        const xVal = d._x;
        return xScale(xVal instanceof Date ? xVal.getTime() : xVal as any) || 0;
      })
      .y0(innerHeight)
      .y1(d => yScale(d._y))
      .curve(curveInterpolator);

    const lineGenerator = d3.line<any>()
      .x(d => {
        const xVal = d._x;
        return xScale(xVal instanceof Date ? xVal.getTime() : xVal as any) || 0;
      })
      .y(d => yScale(d._y))
      .curve(curveInterpolator);

    return {
      areaPath: areaGenerator(parsedData) || '',
      linePath: lineGenerator(parsedData) || '',
    };
  }, [scales, parsedData, innerHeight, curveInterpolator]);

  // Interaction State for Hover/Tooltip
  const [hoverState, setHoverState] = useState<{
    point: any;
    x: number;
    y: number;
  } | null>(null);

  const handlePointerMove = (e: React.PointerEvent<SVGRectElement>) => {
    if (!interactive || !scales || !parsedData.length) return;

    const { xScale, yScale, isDate, isNumeric } = scales;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    let targetPoint: any = null;

    if (isDate || isNumeric) {
      // Invert pixel X to data value
      const activeXVal = (xScale as any).invert(mouseX);
      
      // Binary search closest point
      const bisect = d3.bisector((d: any) => d._x).left;
      const idx = bisect(parsedData, activeXVal, 1);
      
      const p0 = parsedData[idx - 1];
      const p1 = parsedData[idx];

      if (p0 && p1) {
        const t0 = p0._x instanceof Date ? p0._x.getTime() : (p0._x as number);
        const t1 = p1._x instanceof Date ? p1._x.getTime() : (p1._x as number);
        const tActive = activeXVal instanceof Date ? activeXVal.getTime() : (activeXVal as number);
        targetPoint = tActive - t0 < t1 - tActive ? p0 : p1;
      } else {
        targetPoint = p0 || p1;
      }
    } else {
      // Categorical lookup: find closest point step
      const domain = xScale.domain();
      const range = xScale.range();
      const step = (range[1] - range[0]) / (domain.length - 1 || 1);
      const idx = Math.min(domain.length - 1, Math.max(0, Math.round((mouseX - range[0]) / step)));
      const xLabel = domain[idx];
      targetPoint = parsedData.find(d => String(d._rawX) === xLabel);
    }

    if (targetPoint) {
      const xVal = targetPoint._x;
      const posX = xScale(xVal instanceof Date ? xVal.getTime() : xVal as any) || 0;
      const posY = yScale(targetPoint._y) || 0;

      setHoverState({
        point: targetPoint,
        x: posX,
        y: posY,
      });
    }
  };

  const handlePointerLeave = () => {
    setHoverState(null);
  };

  // Tick calculation functions
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
          const date = val as Date;
          label = d3.timeFormat('%b %d')(date);
        } else {
          label = String(val);
        }
        return {
          pos: (xScale as any)(val) || 0,
          label,
        };
      });
    } else {
      // Categorical scales display all ticks, or skip every other one if crowded
      const domain = xScale.domain();
      const skipFactor = Math.ceil(domain.length / (containerWidth / 70));
      return domain.map((val, idx) => {
        if (idx % skipFactor !== 0) return null;
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
    const ticks = yScale.ticks(5);
    return ticks.map((val) => ({
      pos: yScale(val),
      label: yFormatter ? yFormatter(val) : String(val),
      value: val,
    }));
  }, [scales, yFormatter]);

  // Color theme properties override
  const strokeColor = color || 'var(--md-sys-color-primary)';
  const customStyles = {
    '--md-sys-color-primary': strokeColor,
  } as React.CSSProperties;

  // Formatter for Tooltip
  const renderTooltipContent = (point: any) => {
    if (!point) return null;

    if (tooltipFormatter) {
      const formatted = tooltipFormatter(point);
      if (typeof formatted === 'string') {
        return <span>{formatted}</span>;
      }
      return (
        <>
          <span className={styles.tooltipTitle}>{formatted.label}</span>
          <span className={styles.tooltipValue}>
            <span className={styles.tooltipMarker} />
            {formatted.value}
          </span>
        </>
      );
    }

    const labelX = xFormatter 
      ? xFormatter(point._rawX) 
      : (point._x instanceof Date ? d3.timeFormat('%B %d, %Y')(point._x) : String(point._rawX));
    
    const valueY = yFormatter ? yFormatter(point._y) : String(point._y);

    return (
      <>
        <span className={styles.tooltipTitle}>{labelX}</span>
        <span className={styles.tooltipValue}>
          <span className={styles.tooltipMarker} />
          {yKey}: {valueY}
        </span>
      </>
    );
  };

  return (
    <div 
      className={cn(styles.root, className)} 
      style={customStyles}
      ref={containerRef}
      data-md3-component="area-chart"
    >
      {(title || subtitle) && (
        <div className={styles.header}>
          {title && <h4 className={styles.title}>{title}</h4>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}

      <div className={styles.chartContainer} style={{ height }}>
        {scales && paths && (
          <svg
            className={styles.svg}
            width={containerWidth}
            height={height}
            viewBox={`0 0 ${containerWidth} ${height}`}
          >
            {/* Define Gradient */}
            {gradient && (
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--md-sys-color-primary)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--md-sys-color-primary)" stopOpacity={0.0} />
                </linearGradient>
              </defs>
            )}

            {/* Main drawing group shifted by margin */}
            <g transform={`translate(${margin.left}, ${margin.top})`}>
              {/* Grid Lines */}
              {showGrid && (
                <g className="grid-lines">
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

              {/* Area Path */}
              {gradient && (
                <path
                  className={styles.area}
                  d={paths.areaPath}
                  fill={`url(#${gradientId})`}
                />
              )}

              {/* Stroke Line Path */}
              <path
                className={styles.line}
                d={paths.linePath}
                stroke="var(--md-sys-color-primary)"
              />

              {/* Y Axis ticks & label */}
              {showAxes && (
                <g className={styles.axis}>
                  <line 
                    className={styles.axisLine} 
                    x1={0} 
                    y1={0} 
                    x2={0} 
                    y2={innerHeight} 
                  />
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

              {/* Interactive Hover Elements */}
              {interactive && hoverState && (
                <g>
                  {/* Vertical dashed line */}
                  <line
                    className={styles.hoverLine}
                    x1={hoverState.x}
                    y1={0}
                    x2={hoverState.x}
                    y2={innerHeight}
                  />

                  {/* Pulsing Ripple Dot */}
                  <circle
                    className={styles.hoverDotOuter}
                    cx={hoverState.x}
                    cy={hoverState.y}
                    r={12}
                  />

                  {/* Sharp Anchor Dot */}
                  <circle
                    className={styles.hoverDot}
                    cx={hoverState.x}
                    cy={hoverState.y}
                    r={6}
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

        {/* Absolute-positioned Tooltip HTML Card */}
        {interactive && hoverState && (
          <div
            className={styles.tooltip}
            style={{
              left: hoverState.x + margin.left,
              top: hoverState.y + margin.top,
            }}
          >
            {renderTooltipContent(hoverState.point)}
          </div>
        )}
      </div>
    </div>
  );
}
