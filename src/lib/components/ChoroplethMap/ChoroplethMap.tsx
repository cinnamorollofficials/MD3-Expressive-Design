import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import * as geo from 'd3-geo';
import { feature as topoFeature, mesh as topoMesh } from 'topojson-client';
import { cn } from '../../utils/cn';
import styles from './ChoroplethMap.module.css';

export interface FeatureData {
  id: string | number;
  value: number;
  name?: string;
  [key: string]: any;
}

export interface ChoroplethMapProps {
  /** GeoJSON FeatureCollection OR TopoJSON object for region polygons */
  geojson: any;
  /** TopoJSON object key to extract features if TopoJSON is passed (e.g. 'counties' or 'states') */
  topoObjectKey?: string;
  /** Optional TopoJSON mesh key for state/country border lines (e.g. 'states') */
  bordersTopoKey?: string;
  /** Array of data mapping region ID -> value */
  data: FeatureData[];
  /** Property key in GeoJSON feature.properties or feature.id to match with FeatureData.id (default 'id') */
  featureIdKey?: string;
  /** Map projection type: 'albersUsa' | 'mercator' | 'equalEarth' | 'naturalEarth' */
  projection?: 'albersUsa' | 'mercator' | 'equalEarth' | 'naturalEarth';
  /** Color scale interpolator: 'blues' | 'greens' | 'reds' | 'viridis' | 'spectral' */
  colorScheme?: 'blues' | 'greens' | 'reds' | 'viridis' | 'spectral';
  /** Number of discrete color thresholds for map & legend bar (default 8) */
  numThresholds?: number;
  /** Custom domain [min, max] (derived automatically from data if omitted) */
  domain?: [number, number];
  /** Chart height in pixels */
  height?: number;
  /** Title for color scale legend bar */
  legendTitle?: string;
  /** Main chart title */
  title?: string;
  /** Subtitle description */
  subtitle?: string;
  /** Whether to render spherical globe outline (useful for global maps with equalEarth / naturalEarth) */
  showSphereOutline?: boolean;

  /** Whether to render background graticule grid lines */
  showGraticule?: boolean;
  /** Custom value formatter */
  valueFormatter?: (val: number) => string;
  /** Whether interactive hover tooltips and highlights are enabled */
  interactive?: boolean;
  /** Callback when a region/county polygon is clicked */
  onFeatureClick?: (feature: any, dataItem?: FeatureData) => void;
  /** Additional CSS class name */
  className?: string;
}

export function ChoroplethMap({
  geojson,
  topoObjectKey = 'counties',
  bordersTopoKey = 'states',
  data = [],
  featureIdKey = 'id',
  projection: projectionType = 'albersUsa',
  colorScheme = 'blues',
  numThresholds = 8,
  domain: customDomain,
  height = 580,
  legendTitle = 'Unemployment rate (%)',
  title,
  subtitle,
  showSphereOutline = false,
  showGraticule = false,
  valueFormatter,
  interactive = true,
  onFeatureClick,
  className,
}: ChoroplethMapProps) {

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);

  const [hoveredFeature, setHoveredFeature] = useState<any | null>(null);
  const [hoveredData, setHoveredData] = useState<FeatureData | null>(null);
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

  // Parse GeoJSON features from GeoJSON or TopoJSON
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

  // Fast map lookup: ID -> FeatureData item
  const dataMap = useMemo(() => {
    const map = new Map<string | number, FeatureData>();
    data.forEach((item) => {
      if (item && item.id !== undefined) {
        map.set(String(item.id), item);
      }
    });
    return map;
  }, [data]);

  // Compute domain bounds [min, max]
  const domain = useMemo<[number, number]>(() => {
    if (customDomain) return customDomain;
    if (data.length === 0) return [0, 10];
    const vals = data.map((d) => d.value).filter((v) => typeof v === 'number' && !isNaN(v));
    const extent = d3.extent(vals) as [number, number];
    return extent[0] !== undefined && extent[1] !== undefined
      ? [Math.floor(extent[0]), Math.ceil(extent[1])]
      : [0, 10];
  }, [customDomain, data]);

  // Color interpolator selector
  const colorInterpolator = useMemo(() => {
    switch (colorScheme) {
      case 'greens':
        return d3.interpolateGreens;
      case 'reds':
        return d3.interpolateReds;
      case 'viridis':
        return d3.interpolateViridis;
      case 'spectral':
        return (t: number) => d3.interpolateSpectral(1 - t);
      case 'blues':
      default:
        return d3.interpolateBlues;
    }
  }, [colorScheme]);

  // Thresholds scale (matching the D3 reference bar with discrete steps: 2, 3, 4, 5, 6, 7, 8, 9)
  const thresholdValues = useMemo(() => {
    const [minVal, maxVal] = domain;
    const step = (maxVal - minVal) / numThresholds;
    return d3.range(numThresholds).map((i) => minVal + i * step);
  }, [domain, numThresholds]);

  const thresholdColors = useMemo(() => {
    return d3.range(numThresholds).map((i) => {
      // Map index to 0.15 - 0.95 interpolator range so lightest step is visible
      const t = 0.15 + (i / Math.max(1, numThresholds - 1)) * 0.8;
      return colorInterpolator(t);
    });
  }, [numThresholds, colorInterpolator]);

  const colorScale = useMemo(() => {
    return d3.scaleThreshold<number, string>().domain(thresholdValues.slice(1)).range(thresholdColors);
  }, [thresholdValues, thresholdColors]);

  // D3 Projection & Path Generator
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const innerWidth = Math.max(100, containerWidth - margin.left - margin.right);
  const innerHeight = Math.max(100, height - margin.top - margin.bottom);

  const pathGenResult = useMemo(() => {
    // Check if topology is pre-projected in 975x610 pixel space (e.g. counties-albers-10m.json)
    // Quantized topologies (counties-10m.json) have coordinates in degrees [lon, lat],
    // so only use null projection if the topology object explicitly contains 'albers'.
    const isPreprojected =
      geojson &&
      geojson.objects &&
      Object.keys(geojson.objects).some((k) => k.includes('albers'));

    if (isPreprojected) {
      const pathGen = geo.geoPath(null);
      const borderD = borderMesh ? pathGen(borderMesh) : null;
      return { pathGenerator: pathGen, borderPathD: borderD };
    }

    // Select D3 projection. Note: 'albersUsa' is tailored for US maps (moves AK/HI insets).
    // For international/world maps (Indonesia, Japan, Global), use 'mercator', 'equalEarth', or 'naturalEarth'.
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
        // Automatically fit geographic bounds to container viewport
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
    const sphereD = pathGen({ type: 'Sphere' });
    const gratD = pathGen(geo.geoGraticule10());

    return { pathGenerator: pathGen, borderPathD: borderD, sphereOutlineD: sphereD, graticuleD: gratD };
  }, [geojson, projectionType, features, borderMesh, innerWidth, innerHeight]);

  const { pathGenerator, borderPathD, sphereOutlineD, graticuleD } = pathGenResult;

  const fmtVal = useCallback(
    (v: number) => (valueFormatter ? valueFormatter(v) : `${v.toFixed(1)}%`),
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

  // Helper to extract feature ID
  const getFeatureId = useCallback(
    (feat: any): string => {
      if (!feat) return '';
      if (feat[featureIdKey] !== undefined) return String(feat[featureIdKey]);
      if (feat.properties && feat.properties[featureIdKey] !== undefined)
        return String(feat.properties[featureIdKey]);
      if (feat.id !== undefined) return String(feat.id);
      if (feat.properties && feat.properties.id !== undefined) return String(feat.properties.id);
      if (feat.properties && feat.properties.name !== undefined) return String(feat.properties.name);
      return '';
    },
    [featureIdKey]
  );

  // Enhanced feature data lookup supporting numeric ISO string padding (e.g. "076" vs "76") & names
  const getFeatureDataItem = useCallback(
    (feat: any): FeatureData | undefined => {
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
    <div className={cn(styles.root, className)} ref={containerRef} data-md3-component="choropleth-map">
      {/* Header */}
      {(title || subtitle) && (
        <div className={styles.header}>
          <div className={styles.headerText}>
            {title && <h4 className={styles.title}>{title}</h4>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>
      )}

      {/* Threshold Color Legend Bar (Top Right matching D3 reference image) */}
      <div className={styles.legendContainer}>
        <span className={styles.legendTitle}>{legendTitle}</span>
        <div className={styles.legendBarWrapper}>
          <div className={styles.legendBar}>
            {thresholdColors.map((col, idx) => (
              <div key={idx} className={styles.legendSegment} style={{ backgroundColor: col }} />
            ))}
          </div>
          <div className={styles.legendTicks}>
            {thresholdValues.map((val, idx) => (
              <span key={idx}>{Math.round(val)}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
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
            {/* Background Graticule Grid Lines */}
            {showGraticule && graticuleD && <path className={styles.graticule} d={graticuleD} />}

            {/* Features (Counties/Regions/Countries Polygons) */}
            <g className="features-layer">
              {features.map((feat, idx) => {
                const dItem = getFeatureDataItem(feat);
                const pathD = pathGenerator(feat);
                if (!pathD) return null;

                const isHovered = hoveredFeature === feat;
                const fillColor = dItem ? colorScale(dItem.value) : undefined;
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

            {/* State/Country Mesh Borders Overlay */}
            {borderPathD && <path className={styles.borderPath} d={borderPathD} />}

            {/* Spherical Globe Outer Boundary Line */}
            {showSphereOutline && sphereOutlineD && (
              <path className={styles.sphereOutline} d={sphereOutlineD} />
            )}
          </g>

        </svg>

        {/* Hover Tooltip */}
        {interactive && hoveredFeature && mousePos && (
          <div
            className={styles.tooltip}
            style={{
              left: Math.min(containerWidth - 160, Math.max(160, mousePos.x)),
              top: Math.max(48, mousePos.y - 12),
            }}
          >
            <div className={styles.tooltipTitle}>
              {hoveredData?.name ||
                hoveredFeature.properties?.name ||
                hoveredFeature.properties?.title ||
                `Region ${getFeatureId(hoveredFeature)}`}
            </div>
            {hoveredData ? (
              <div className={styles.tooltipRow}>
                <span>{legendTitle}:</span>
                <span className={styles.tooltipValue}>{fmtVal(hoveredData.value)}</span>
              </div>
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
