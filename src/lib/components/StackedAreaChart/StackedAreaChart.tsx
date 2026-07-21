import { useMemo, useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
import { cn } from '../../utils/cn';
import styles from './StackedAreaChart.module.css';

export interface StackedAreaChartProps {
  /** Array of data objects to render */
  data: any[];
  /** Key of the x-axis value in the data objects */
  xKey: string;
  /** Keys of the multiple series to stack */
  yKeys: string[];
  /** Legend labels corresponding to yKeys. If omitted, yKeys are used as labels */
  legendLabels?: string[];
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
  /** Custom colors array for the stack layers */
  colors?: string[];
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

const DEFAULT_PALETTE = [
  'var(--md-sys-color-primary, #6750a4)',
  'var(--md-sys-color-tertiary, #7d5260)',
  'var(--md-sys-color-secondary, #625b71)',
  'var(--md-sys-color-error, #ba1a1a)',
  'var(--md-sys-color-primary-container, #eaddff)',
  'var(--md-sys-color-tertiary-container, #ffd8e4)',
  'var(--md-sys-color-secondary-container, #e8def8)',
];

export function StackedAreaChart({
  data = [],
  xKey,
  yKeys = [],
  legendLabels,
  height = 300,
  margin = { top: 24, right: 24, bottom: 40, left: 48 },
  curve = 'monotone',
  showGrid = true,
  showAxes = true,
  colors = DEFAULT_PALETTE,
  interactive = true,
  title,
  subtitle,
  xFormatter,
  yFormatter,
  className,
}: StackedAreaChartProps) {
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

  // Generate Stack layout values
  const stackedSeries = useMemo(() => {
    if (!parsedData.length || !yKeys.length) return [];
    const stackGen = d3.stack<any>()
      .keys(yKeys)
      .value((d, key) => Number(d[key]) || 0);
    return stackGen(parsedData);
  }, [parsedData, yKeys]);

  // Dimensions of drawing area
  const innerWidth = Math.max(0, containerWidth - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);

  // Create Scales
  const scales = useMemo(() => {
    if (!parsedData.length || !stackedSeries.length || innerWidth <= 0 || innerHeight <= 0) return null;

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

    const yMax = d3.max(stackedSeries, series => d3.max(series, d => d[1])) || 0;
    const yScale = d3.scaleLinear()
      .domain([0, yMax * 1.05]) // add 5% headroom
      .range([innerHeight, 0])
      .nice();

    return { xScale, yScale, isDate, isNumeric };
  }, [parsedData, stackedSeries, innerWidth, innerHeight]);

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

  // Generate path coordinates
  const paths = useMemo(() => {
    if (!scales || !stackedSeries.length) return [];
    const { xScale, yScale } = scales;

    const areaGenerator = d3.area<d3.SeriesPoint<any>>()
      .x(d => {
        const xVal = d.data._x;
        return xScale(xVal instanceof Date ? xVal.getTime() : xVal as any) || 0;
      })
      .y0(d => yScale(d[0]))
      .y1(d => yScale(d[1]))
      .curve(curveInterpolator);

    const lineGenerator = d3.line<d3.SeriesPoint<any>>()
      .x(d => {
        const xVal = d.data._x;
        return xScale(xVal instanceof Date ? xVal.getTime() : xVal as any) || 0;
      })
      .y(d => yScale(d[1]))
      .curve(curveInterpolator);

    return stackedSeries.map((series, idx) => ({
      key: series.key,
      areaPath: areaGenerator(series) || '',
      linePath: lineGenerator(series) || '',
      fillColor: colors[idx % colors.length],
    }));
  }, [scales, stackedSeries, colors, curveInterpolator]);

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
          label = d3.timeFormat('%b %d')(val as Date);
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
    const ticks = yScale.ticks(5);
    return ticks.map((val) => ({
      pos: yScale(val),
      label: yFormatter ? yFormatter(val) : String(val),
    }));
  }, [scales, yFormatter]);

  // Hover details calculation
  const hoverDetails = useMemo(() => {
    if (hoverIndex === null || !scales || !stackedSeries.length) return null;
    const { xScale, yScale } = scales;
    const activePoint = parsedData[hoverIndex];

    const posX = xScale(activePoint._x instanceof Date ? activePoint._x.getTime() : activePoint._x as any) || 0;

    // Retrieve y-coordinates for each series stack layer
    const markers = stackedSeries.map((series, idx) => {
      const point = series[hoverIndex];
      return {
        key: series.key,
        label: legendLabels ? legendLabels[idx] : String(series.key),
        value: activePoint[series.key],
        y: yScale(point[1]),
        color: colors[idx % colors.length],
      };
    });

    // Label for tooltip title
    const titleX = xFormatter 
      ? xFormatter(activePoint._rawX)
      : (activePoint._x instanceof Date ? d3.timeFormat('%B %d, %Y')(activePoint._x) : String(activePoint._rawX));

    return {
      x: posX,
      title: titleX,
      markers: markers.reverse(), // reverse to display top stack on top of list
    };
  }, [hoverIndex, scales, parsedData, stackedSeries, colors, legendLabels, xFormatter]);

  // Labels for the legend row
  const legendItems = useMemo(() => {
    return yKeys.map((key, idx) => ({
      key,
      label: legendLabels ? legendLabels[idx] : String(key),
      color: colors[idx % colors.length],
    }));
  }, [yKeys, legendLabels, colors]);

  return (
    <div 
      className={cn(styles.root, className)}
      ref={containerRef}
      data-md3-component="stacked-area-chart"
    >
      {(title || subtitle) && (
        <div className={styles.header}>
          {title && <h4 className={styles.title}>{title}</h4>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}

      {/* Legend Row */}
      {legendItems.length > 0 && (
        <div className={styles.legend}>
          {legendItems.map((item, i) => (
            <div key={i} className={styles.legendItem}>
              <span className={styles.legendColor} style={{ backgroundColor: item.color }} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}

      <div className={styles.chartContainer} style={{ height }}>
        {scales && paths.length > 0 && (
          <svg
            className={styles.svg}
            width={containerWidth}
            height={height}
            viewBox={`0 0 ${containerWidth} ${height}`}
          >
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

              {/* Stacked Area Paths */}
              {paths.map((layer, i) => (
                <g key={i}>
                  <path
                    className={styles.area}
                    d={layer.areaPath}
                    fill={layer.fillColor}
                  />
                  <path
                    className={styles.line}
                    d={layer.linePath}
                    stroke={layer.fillColor}
                  />
                </g>
              ))}

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

                  {/* Marker dot on top outline of each stacked layer */}
                  {hoverDetails.markers.map((marker, i) => (
                    <circle
                      key={i}
                      className={styles.hoverDot}
                      cx={hoverDetails.x}
                      cy={marker.y}
                      r={5}
                      fill={marker.color}
                    />
                  ))}
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
              top: (hoverDetails.markers[0]?.y ?? 0) + margin.top, // position above the topmost dot
            }}
          >
            <span className={styles.tooltipTitle}>{hoverDetails.title}</span>
            <div className={styles.tooltipRows}>
              {hoverDetails.markers.map((marker, i) => (
                <div key={i} className={styles.tooltipRow}>
                  <div className={styles.tooltipLabelGroup}>
                    <span className={styles.tooltipMarker} style={{ backgroundColor: marker.color }} />
                    <span>{marker.label}</span>
                  </div>
                  <span className={styles.tooltipValue}>
                    {yFormatter ? yFormatter(marker.value) : numberFormatter(marker.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple internal formatter fallback
function numberFormatter(val: any): string {
  const num = Number(val);
  if (isNaN(num)) return String(val);
  return new Intl.NumberFormat('en-US').format(num);
}
