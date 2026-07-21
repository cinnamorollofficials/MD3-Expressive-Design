import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { hexbin as d3Hexbin } from 'd3-hexbin';
import { cn } from '../../utils/cn';
import styles from './HexbinChart.module.css';

export interface HexbinPoint {
  x: number;
  y: number;
  value?: number;
  [key: string]: any;
}

export interface HexbinChartProps {
  /** Array of raw data points */
  data: (HexbinPoint | [number, number] | any)[];
  /** Custom X coordinate accessor */
  xAccessor?: (d: any) => number;
  /** Custom Y coordinate accessor */
  yAccessor?: (d: any) => number;
  /** Custom value accessor (for color aggregating mode, e.g. median year) */
  valueAccessor?: (d: any) => number;
  /** Radius of hexagons in pixels (default 12) */
  radius?: number;
  /** Minimum allowed radius for slider */
  minRadius?: number;
  /** Maximum allowed radius for slider */
  maxRadius?: number;
  /** How hexagon size is determined: 'constant' (uniform size) or 'area' (scaled by bin count) */
  sizeMode?: 'constant' | 'area';
  /** How hexagon color is determined: 'count' (density frequency) or 'value' (aggregated valueAccessor metric) */
  colorMode?: 'count' | 'value';
  /** Value aggregation statistic when colorMode is 'value': 'median' or 'mean' */
  valueAggregation?: 'median' | 'mean';
  /** Chart height in pixels */
  height?: number;
  /** Show radius slider control */
  showControls?: boolean;
  /** Title for color scale legend */
  colorLegendTitle?: string;
  /** Main chart title */
  title?: string;
  /** Subtitle description */
  subtitle?: string;
  /** Label for X axis */
  xAxisTitle?: string;
  /** Label for Y axis */
  yAxisTitle?: string;
  /** Custom X axis formatter */
  xFormatter?: (val: number) => string;
  /** Custom Y axis formatter */
  yFormatter?: (val: number) => string;
  /** Custom value formatter for tooltip */
  valueFormatter?: (val: number) => string;
  /** Optional background SVG path strings (e.g. map outlines/state borders) */
  mapPaths?: { d: string; id?: string }[];
  /** Color scale interpolator: 'spectral' | 'viridis' | 'turbo' | 'magma' | 'warm' */
  colorScheme?: 'spectral' | 'viridis' | 'turbo' | 'magma' | 'warm';
  /** Whether chart is interactive with hover tooltips */
  interactive?: boolean;
  /** Callback when a hexagon bin is clicked */
  onHexClick?: (bin: { x: number; y: number; count: number; value?: number; points: any[] }) => void;
  /** Additional CSS class name */
  className?: string;
}

export function HexbinChart({
  data = [],
  xAccessor = (d) => (Array.isArray(d) ? d[0] : d.x),
  yAccessor = (d) => (Array.isArray(d) ? d[1] : d.y),
  valueAccessor = (d) => (Array.isArray(d) ? d[2] ?? 0 : d.value ?? 0),
  radius: radiusProp = 12,
  minRadius = 4,
  maxRadius = 32,
  sizeMode = 'area',
  colorMode = 'value',
  valueAggregation = 'median',
  height = 540,
  showControls = true,
  colorLegendTitle = 'Metric Value',
  title,
  subtitle,
  xAxisTitle,
  yAxisTitle,
  xFormatter,
  yFormatter,
  valueFormatter,
  mapPaths,
  colorScheme = 'spectral',
  interactive = true,
  onHexClick,
  className,
}: HexbinChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(700);
  const [radius, setRadius] = useState(radiusProp);

  const [hoveredBin, setHoveredBin] = useState<any | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Sync radius prop
  useEffect(() => {
    if (radiusProp !== undefined) setRadius(radiusProp);
  }, [radiusProp]);

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

  const margin = { top: 35, right: 30, bottom: 55, left: 60 };
  const innerWidth = Math.max(100, containerWidth - margin.left - margin.right);
  const innerHeight = Math.max(100, height - margin.top - margin.bottom);

  // Compute X and Y domains from raw data
  const { xDomain, yDomain } = useMemo(() => {
    if (data.length === 0) return { xDomain: [0, 100], yDomain: [0, 100] };
    const xVals = data.map(xAccessor).filter((v) => typeof v === 'number' && !isNaN(v));
    const yVals = data.map(yAccessor).filter((v) => typeof v === 'number' && !isNaN(v));
    const xExtent = d3.extent(xVals) as [number, number];
    const yExtent = d3.extent(yVals) as [number, number];

    const xPad = (xExtent[1] - xExtent[0]) * 0.04 || 1;
    const yPad = (yExtent[1] - yExtent[0]) * 0.04 || 1;

    return {
      xDomain: [xExtent[0] - xPad, xExtent[1] + xPad],
      yDomain: [yExtent[0] - yPad, yExtent[1] + yPad],
    };
  }, [data, xAccessor, yAccessor]);

  // Linear scales
  const xScale = useMemo(() => {
    return d3.scaleLinear().domain(xDomain).range([margin.left, margin.left + innerWidth]);
  }, [xDomain, margin.left, innerWidth]);

  const yScale = useMemo(() => {
    return d3.scaleLinear().domain(yDomain).range([height - margin.bottom, margin.top]);
  }, [yDomain, height, margin.bottom, margin.top]);

  // Convert raw data to screen coordinates [screenX, screenY, rawItem]
  const screenPoints = useMemo(() => {
    return data.map((d) => {
      const vx = xAccessor(d);
      const vy = yAccessor(d);
      return [xScale(vx), yScale(vy), d] as [number, number, any];
    });
  }, [data, xAccessor, yAccessor, xScale, yScale]);

  // Calculate hexbin generator
  const hexbinGen = useMemo(() => {
    return d3Hexbin<[number, number, any]>()
      .x((d) => d[0])
      .y((d) => d[1])
      .radius(radius)
      .extent([
        [margin.left, margin.top],
        [margin.left + innerWidth, height - margin.bottom],
      ]);
  }, [radius, margin.left, margin.top, innerWidth, height, margin.bottom]);

  // Generate hex bins
  const bins = useMemo(() => {
    if (screenPoints.length === 0) return [];
    const rawBins = hexbinGen(screenPoints);

    return rawBins.map((bin) => {
      const items = bin.map((p) => p[2]);
      const count = items.length;

      // Aggregated metric
      const values = items.map(valueAccessor).filter((v) => typeof v === 'number' && !isNaN(v));
      let aggValue = 0;
      if (values.length > 0) {
        if (valueAggregation === 'median') {
          aggValue = d3.median(values) ?? 0;
        } else {
          aggValue = d3.mean(values) ?? 0;
        }
      }

      return {
        x: bin.x,
        y: bin.y,
        count,
        aggValue,
        points: items,
        bin,
      };
    });
  }, [screenPoints, hexbinGen, valueAccessor, valueAggregation]);

  const maxCount = useMemo(() => d3.max(bins, (d) => d.count) || 1, [bins]);

  // Color interpolator selector
  const colorInterpolator = useMemo(() => {
    switch (colorScheme) {
      case 'viridis':
        return d3.interpolateViridis;
      case 'turbo':
        return d3.interpolateTurbo;
      case 'magma':
        return d3.interpolateMagma;
      case 'warm':
        return d3.interpolateWarm;
      case 'spectral':
      default:
        // Reverse spectral so warm/red is low/older and cool/blue is high/newer (matching reference)
        return (t: number) => d3.interpolateSpectral(1 - t);
    }
  }, [colorScheme]);

  // Color scale
  const colorDomain = useMemo(() => {
    if (bins.length === 0) return [0, 1];
    if (colorMode === 'count') {
      return [1, maxCount];
    }
    const vals = bins.map((b) => b.aggValue);
    const extent = d3.extent(vals) as [number, number];
    return extent[0] === extent[1] ? [extent[0] - 1, extent[0] + 1] : extent;
  }, [bins, colorMode, maxCount]);

  const colorScale = useMemo(() => {
    return d3.scaleSequential(colorInterpolator).domain(colorDomain);
  }, [colorInterpolator, colorDomain]);

  // SVG Hexagon path generator
  const hexPathGenerator = useMemo(() => {
    return (r: number) => hexbinGen.hexagon(r);
  }, [hexbinGen]);

  const fmtX = useCallback(
    (v: number) => (xFormatter ? xFormatter(v) : d3.format(',.2~f')(v)),
    [xFormatter]
  );
  const fmtY = useCallback(
    (v: number) => (yFormatter ? yFormatter(v) : d3.format(',.2~f')(v)),
    [yFormatter]
  );
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
  const yTicks = useMemo(() => yScale.ticks(6), [yScale]);

  return (
    <div className={cn(styles.root, className)} ref={containerRef} data-md3-component="hexbin-chart">
      {/* Header */}
      {(title || subtitle) && (
        <div className={styles.header}>
          <div className={styles.headerText}>
            {title && <h4 className={styles.title}>{title}</h4>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>
      )}

      {/* Control Toolbar */}
      {showControls && (
        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Radius (r):</span>
            <input
              type="number"
              className={styles.numberInput}
              min={minRadius}
              max={maxRadius}
              value={radius}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                if (!isNaN(v) && v >= minRadius && v <= maxRadius) setRadius(v);
              }}
            />
            <input
              type="range"
              className={styles.slider}
              min={minRadius}
              max={maxRadius}
              step={1}
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value, 10))}
            />
          </div>
        </div>
      )}

      {/* Color Legend Bar */}
      <div className={styles.legendContainer}>
        <span className={styles.legendLabel}>
          {colorMode === 'count' ? 'Count (density)' : colorLegendTitle}:
        </span>
        <div className={styles.colorBarWrapper}>
          <div
            className={styles.colorBar}
            style={{
              background: `linear-gradient(to right, ${d3.range(0, 1.05, 0.1).map(colorInterpolator).join(', ')})`,
            }}
          />
          <div className={styles.legendTicks}>
            <span>{fmtVal(colorDomain[0])}</span>
            <span>{fmtVal((colorDomain[0] + colorDomain[1]) / 2)}</span>
            <span>{fmtVal(colorDomain[1])}</span>
          </div>
        </div>
      </div>

      {/* Main Chart Container */}
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
          {/* Optional Map / Background Outlines */}
          {mapPaths && (
            <g className="map-layer">
              {mapPaths.map((path, idx) => (
                <path key={path.id || idx} className={styles.mapOutline} d={path.d} />
              ))}
            </g>
          )}

          {/* Y Gridlines & Axis */}
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
                    {fmtY(tickVal)}
                  </text>
                </g>
              );
            })}
          </g>

          {/* X Axis Ticks */}
          <g className="x-axis-layer">
            {xTicks.map((tickVal, idx) => {
              const x = xScale(tickVal);
              return (
                <text
                  key={idx}
                  className={styles.axisText}
                  x={x}
                  y={height - margin.bottom + 18}
                  textAnchor="middle"
                >
                  {fmtX(tickVal)}
                </text>
              );
            })}
          </g>

          {/* Axis Titles */}
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

          {/* Hexagons Layer */}
          <g className="hexagons-layer">
            {bins.map((binData, idx) => {
              const { x, y, count, aggValue } = binData;

              // Size mode calculation
              let currentR = radius;
              if (sizeMode === 'area') {
                // Scale radius by square root of count ratio (area proportional)
                const ratio = Math.max(0.18, Math.sqrt(count / maxCount));
                currentR = radius * ratio;
              }

              const pathD = hexPathGenerator(currentR);
              const fillColor = colorScale(colorMode === 'count' ? count : aggValue);
              const isHovered = hoveredBin === binData;

              return (
                <path
                  key={idx}
                  className={cn(styles.hexagon, hoveredBin && !isHovered && styles.hexDimmed)}
                  d={pathD}
                  transform={`translate(${x}, ${y})`}
                  fill={fillColor}
                  onMouseEnter={() => interactive && setHoveredBin(binData)}
                  onMouseLeave={() => interactive && setHoveredBin(null)}
                  onClick={() => onHexClick?.(binData)}
                />
              );
            })}
          </g>
        </svg>

        {/* Hover Tooltip */}
        {interactive && hoveredBin && mousePos && (
          <div
            className={styles.tooltip}
            style={{
              left: Math.min(containerWidth - 160, Math.max(160, mousePos.x)),
              top: Math.max(48, mousePos.y - 12),
            }}
          >
            <div className={styles.tooltipTitle}>
              Hexagon Center: ({fmtX(xScale.invert(hoveredBin.x))},{' '}
              {fmtY(yScale.invert(hoveredBin.y))})
            </div>
            <div className={styles.tooltipRow}>
              <span>Data Count (density):</span>
              <span className={styles.tooltipValue}>{hoveredBin.count} items</span>
            </div>
            {colorMode === 'value' && (
              <div className={styles.tooltipRow}>
                <span>
                  {valueAggregation === 'median' ? 'Median' : 'Mean'} {colorLegendTitle}:
                </span>
                <span className={styles.tooltipValue}>{fmtVal(hoveredBin.aggValue)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
