import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as geo from 'd3-geo';
import { feature as topoFeature, mesh as topoMesh } from 'topojson-client';
import { cn } from '../../utils/cn';
import styles from './BivariateChoroplethMap.module.css';

export interface BivariateFeatureData {
  id: string | number;
  valueA: number; // e.g. Diabetes % (Y-axis of matrix)
  valueB: number; // e.g. Obesity % (X-axis of matrix)
  name?: string;
  [key: string]: any;
}

export interface BivariateChoroplethMapProps {
  /** GeoJSON FeatureCollection OR TopoJSON object for region polygons */
  geojson: any;
  /** TopoJSON object key to extract features if TopoJSON is passed (e.g. 'counties' or 'states') */
  topoObjectKey?: string;
  /** Optional TopoJSON mesh key for state/country border lines (e.g. 'states') */
  bordersTopoKey?: string;
  /** Array of bivariate data mapping region ID -> valueA & valueB */
  data: BivariateFeatureData[];
  /** Property key in GeoJSON feature to match with BivariateFeatureData.id (default 'id') */
  featureIdKey?: string;
  /** Map projection type: 'albersUsa' | 'mercator' | 'equalEarth' | 'naturalEarth' */
  projection?: 'albersUsa' | 'mercator' | 'equalEarth' | 'naturalEarth';
  /** Label for Variable A (Y-axis of diamond legend, e.g. 'Diabetes') */
  labelA?: string;
  /** Label for Variable B (X-axis of diamond legend, e.g. 'Obesity') */
  labelB?: string;
  /** Custom 3x3 color matrix [colorsA0, colorsA1, colorsA2] */
  colors?: string[][];
  /** Chart height in pixels */
  height?: number;
  /** Main chart title */
  title?: string;
  /** Subtitle description */
  subtitle?: string;
  /** Custom value A formatter */
  valueAFormatter?: (val: number) => string;
  /** Custom value B formatter */
  valueBFormatter?: (val: number) => string;
  /** Whether interactive hover tooltips and highlights are enabled */
  interactive?: boolean;
  /** Callback when a region/county polygon is clicked */
  onFeatureClick?: (feature: any, dataItem?: BivariateFeatureData) => void;
  /** Additional CSS class name */
  className?: string;
}

// Canonical 3x3 Bivariate Color Matrix (Magenta vs Cyan / Diabetes vs Obesity)
const DEFAULT_BIVARIATE_COLORS = [
  ['#e8e8e8', '#ace4e4', '#5ac8c8'], // Low A (Diabetes): Low B, Med B, High B (Obesity)
  ['#dfb0d6', '#a5add3', '#5698c4'], // Med A
  ['#be64ac', '#8c62aa', '#3b4994'], // High A
];

function quantileSorted(values: number[], probability: number): number | undefined {
  if (!values.length) return undefined;
  const index = (values.length - 1) * probability;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return values[lower];
  return values[lower] + (values[upper] - values[lower]) * (index - lower);
}

export function BivariateChoroplethMap({
  geojson,
  topoObjectKey = 'counties',
  bordersTopoKey = 'states',
  data = [],
  featureIdKey = 'id',
  projection: projectionType = 'albersUsa',
  labelA = 'Diabetes',
  labelB = 'Obesity',
  colors = DEFAULT_BIVARIATE_COLORS,
  height = 620,
  title,
  subtitle,
  valueAFormatter,
  valueBFormatter,
  interactive = true,
  onFeatureClick,
  className,
}: BivariateChoroplethMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(850);

  const [hoveredFeature, setHoveredFeature] = useState<any | null>(null);
  const [hoveredData, setHoveredData] = useState<BivariateFeatureData | null>(null);
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

  // Parse GeoJSON features & borders from GeoJSON or TopoJSON
  const { features, borderMesh } = useMemo(() => {
    if (!geojson) return { features: [], borderMesh: null };

    let featList: any[] = [];
    let mesh: any = null;

    if (geojson.type === 'Topology') {
      const objKey = topoObjectKey in geojson.objects ? topoObjectKey : Object.keys(geojson.objects)[0];
      if (objKey && geojson.objects[objKey]) {
        featList = (topoFeature(geojson, geojson.objects[objKey]) as any).features || [];
      }
      if (bordersTopoKey && geojson.objects[bordersTopoKey]) {
        mesh = topoMesh(geojson, geojson.objects[bordersTopoKey], (a, b) => a !== b);
      }
    } else if (geojson.type === 'FeatureCollection') {
      featList = geojson.features || [];
    } else if (Array.isArray(geojson)) {
      featList = geojson;
    }

    return { features: featList, borderMesh: mesh };
  }, [geojson, topoObjectKey, bordersTopoKey]);

  // Fast map lookup: ID -> BivariateFeatureData item
  const dataMap = useMemo(() => {
    const map = new Map<string | number, BivariateFeatureData>();
    data.forEach((item) => {
      if (item && item.id !== undefined) {
        map.set(String(item.id), item);
      }
    });
    return map;
  }, [data]);

  // Calculate 33rd & 66th percentiles (tertiles) for Variable A and Variable B
  const { quantilesA, quantilesB } = useMemo(() => {
    if (data.length === 0)
      return { quantilesA: [33, 66] as [number, number], quantilesB: [33, 66] as [number, number] };

    const valsA = data.map((d) => d.valueA).filter((v) => typeof v === 'number' && !isNaN(v)).sort((a, b) => a - b);
    const valsB = data.map((d) => d.valueB).filter((v) => typeof v === 'number' && !isNaN(v)).sort((a, b) => a - b);

    const qA1 = quantileSorted(valsA, 0.333) ?? 33;
    const qA2 = quantileSorted(valsA, 0.666) ?? 66;

    const qB1 = quantileSorted(valsB, 0.333) ?? 33;
    const qB2 = quantileSorted(valsB, 0.666) ?? 66;

    return {
      quantilesA: [qA1, qA2] as [number, number],
      quantilesB: [qB1, qB2] as [number, number],
    };
  }, [data]);

  // Function to compute bivariate color for a given item
  const getBivariateColor = useCallback(
    (item: BivariateFeatureData): string => {
      const idxA = item.valueA < quantilesA[0] ? 0 : item.valueA < quantilesA[1] ? 1 : 2;
      const idxB = item.valueB < quantilesB[0] ? 0 : item.valueB < quantilesB[1] ? 1 : 2;
      return colors[idxA][idxB];
    },
    [quantilesA, quantilesB, colors]
  );

  // D3 Projection & Path Generator
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const innerWidth = Math.max(100, containerWidth - margin.left - margin.right);
  const innerHeight = Math.max(100, height - margin.top - margin.bottom);

  const { pathGenerator, borderPathD } = useMemo(() => {
    const isPreprojected =
      geojson &&
      geojson.objects &&
      Object.keys(geojson.objects).some((k) => k.includes('albers'));

    if (isPreprojected) {
      const pathGen = geo.geoPath(null);
      const borderD = borderMesh ? pathGen(borderMesh) : null;
      return { pathGenerator: pathGen, borderPathD: borderD };
    }

    let proj: geo.GeoProjection;
    switch (projectionType) {
      case 'mercator':
        proj = geo.geoMercator();
        break;
      case 'equalEarth':
        proj = geo.geoEqualEarth();
        break;
      case 'naturalEarth':
        proj = geo.geoNaturalEarth1();
        break;
      case 'albersUsa':
      default:
        proj = geo.geoAlbersUsa();
        break;
    }

    if (features.length > 0) {
      try {
        const collection = { type: 'FeatureCollection', features };
        proj.fitExtent(
          [
            [15, 15],
            [innerWidth - 15, innerHeight - 15],
          ],
          collection as any
        );
      } catch (err) {
        console.warn('Map projection fit error:', err);
      }
    }

    const pathGen = geo.geoPath().projection(proj);
    const borderD = borderMesh ? pathGen(borderMesh) : null;

    return { pathGenerator: pathGen, borderPathD: borderD };
  }, [geojson, projectionType, features, borderMesh, innerWidth, innerHeight]);

  const fmtA = useCallback(
    (v: number) => (valueAFormatter ? valueAFormatter(v) : `${v.toFixed(1)}%`),
    [valueAFormatter]
  );
  const fmtB = useCallback(
    (v: number) => (valueBFormatter ? valueBFormatter(v) : `${v.toFixed(1)}%`),
    [valueBFormatter]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!interactive || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    },
    [interactive]
  );

  const getFeatureDataItem = useCallback(
    (feat: any): BivariateFeatureData | undefined => {
      if (!feat) return undefined;
      const id1 = feat[featureIdKey] !== undefined ? String(feat[featureIdKey]) : '';
      const id2 = feat.properties && feat.properties[featureIdKey] !== undefined ? String(feat.properties[featureIdKey]) : '';
      const featId = feat.id !== undefined ? String(feat.id) : '';
      const featIdNum = feat.id !== undefined ? String(Number(feat.id)) : '';
      const name = feat.properties?.name || '';

      return (
        dataMap.get(id1) ||
        dataMap.get(id2) ||
        dataMap.get(featId) ||
        dataMap.get(featIdNum) ||
        dataMap.get(name) ||
        dataMap.get(name.toLowerCase())
      );
    },
    [dataMap, featureIdKey]
  );

  return (
    <div className={cn(styles.root, className)} ref={containerRef} data-md3-component="bivariate-choropleth-map">
      {/* Header */}
      {(title || subtitle) && (
        <div className={styles.header}>
          <div className={styles.headerText}>
            {title && <h4 className={styles.title}>{title}</h4>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>
      )}

      {/* Main Map Canvas */}
      <div
        className={styles.chartContainer}
        style={{ height }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setHoveredFeature(null);
          setHoveredData(null);
          setMousePos(null);
        }}
      >
        <svg className={styles.svg} width={containerWidth} height={height}>
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {/* County / Region Features */}
            <g className="features-layer">
              {features.map((feat, idx) => {
                const dItem = getFeatureDataItem(feat);
                const pathD = pathGenerator(feat);
                if (!pathD) return null;

                const isHovered = hoveredFeature === feat;
                const fillColor = dItem ? getBivariateColor(dItem) : undefined;
                const fId = feat.id || feat.properties?.name || idx;

                return (
                  <path
                    key={fId}
                    className={cn(
                      dItem ? styles.featurePath : styles.missingPath,
                      hoveredFeature && !isHovered && styles.featureDimmed
                    )}
                    d={pathD}
                    fill={fillColor}
                    onMouseEnter={() => {
                      if (!interactive) return;
                      setHoveredFeature(feat);
                      setHoveredData(dItem || null);
                    }}
                    onMouseLeave={() => {
                      if (!interactive) return;
                      setHoveredFeature(null);
                      setHoveredData(null);
                    }}
                    onClick={() => onFeatureClick?.(feat, dItem)}
                  />
                );
              })}
            </g>

            {/* State Mesh Borders Overlay */}
            {borderPathD && <path className={styles.borderPath} d={borderPathD} />}
          </g>
        </svg>

        {/* 45-degree Rotated Diamond Bivariate Legend (Bottom Right matching reference image) */}
        <div className={styles.legendOverlay}>
          <svg className={styles.legendSvg} width={130} height={130}>
            {/* Arrow marker definition */}
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--md-sys-color-on-surface)" />
              </marker>
            </defs>

            <g transform="translate(65, 65)">
              {/* Rotated 3x3 Bivariate Matrix Squares */}
              <g transform="rotate(-45)">
                {colors.map((row, i) =>
                  row.map((cellColor, j) => {
                    const boxSize = 16;
                    const x = (j - 1.5) * boxSize;
                    const y = (2 - i - 1.5) * boxSize;

                    return (
                      <rect
                        key={`${i}-${j}`}
                        x={x}
                        y={y}
                        width={boxSize - 0.5}
                        height={boxSize - 0.5}
                        fill={cellColor}
                      />
                    );
                  })
                )}
              </g>

              {/* Axis Arrow Lines & Labels */}
              {/* Axis A (Diabetes): points top-left (-32, -32) */}
              <line x1={-30} y1={30} x2={-48} y2={-48} stroke="var(--md-sys-color-on-surface)" strokeWidth={1.5} markerEnd="url(#arrow)" />
              <text className={styles.legendLabel} x={-48} y={-42} textAnchor="end" transform="rotate(-45, -48, -42)">
                {labelA}
              </text>

              {/* Axis B (Obesity): points top-right (32, 32) */}
              <line x1={-30} y1={30} x2={48} y2={48} stroke="var(--md-sys-color-on-surface)" strokeWidth={1.5} markerEnd="url(#arrow)" />
              <text className={styles.legendLabel} x={48} y={54} textAnchor="start" transform="rotate(45, 48, 54)">
                {labelB}
              </text>
            </g>
          </svg>
        </div>

        {/* Hover Tooltip */}
        {interactive && hoveredFeature && mousePos && (
          <div
            className={styles.tooltip}
            style={{
              left: Math.min(containerWidth - 180, Math.max(180, mousePos.x)),
              top: Math.max(48, mousePos.y - 12),
            }}
          >
            <div className={styles.tooltipTitle}>
              {hoveredData?.name ||
                hoveredFeature.properties?.name ||
                hoveredFeature.properties?.title ||
                `Region ${hoveredFeature.id}`}
            </div>
            {hoveredData ? (
              <>
                <div className={styles.tooltipRow}>
                  <span>
                    <span className={styles.tooltipColorChip} style={{ background: getBivariateColor(hoveredData) }} />
                    {labelA}:
                  </span>
                  <span className={styles.tooltipValue}>{fmtA(hoveredData.valueA)}</span>
                </div>
                <div className={styles.tooltipRow}>
                  <span>
                    <span className={styles.tooltipColorChip} style={{ background: getBivariateColor(hoveredData) }} />
                    {labelB}:
                  </span>
                  <span className={styles.tooltipValue}>{fmtB(hoveredData.valueB)}</span>
                </div>
              </>
            ) : (
              <div className={styles.tooltipRow} style={{ fontStyle: 'italic', opacity: 0.7 }}>
                No data available
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
