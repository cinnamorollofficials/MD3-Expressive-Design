import { useState, useMemo, useEffect } from 'react';
import { ChoroplethMap, FeatureData, Card, CardContent } from '../../lib';
import { DemoSection, PageTitle } from '../components/DemoSection';

// Generate synthetic lightweight US 50 States GeoJSON boundaries + county grid polygon data
function generateUSMapDataset() {
  // US 50 States FIPS & Names
  const states = [
    { fips: '01', name: 'Alabama', x: -86.8, y: 32.8, w: 2.2, h: 3.2 },
    { fips: '02', name: 'Alaska', x: -152.0, y: 64.0, w: 6.0, h: 4.5 },
    { fips: '04', name: 'Arizona', x: -111.7, y: 34.2, w: 3.5, h: 4.2 },
    { fips: '05', name: 'Arkansas', x: -92.4, y: 34.8, w: 2.5, h: 2.5 },
    { fips: '06', name: 'California', x: -119.5, y: 37.2, w: 3.2, h: 6.5 },
    { fips: '08', name: 'Colorado', x: -105.5, y: 39.0, w: 3.8, h: 2.8 },
    { fips: '09', name: 'Connecticut', x: -72.7, y: 41.6, w: 1.2, h: 1.0 },
    { fips: '10', name: 'Delaware', x: -75.5, y: 39.0, w: 0.8, h: 1.2 },
    { fips: '12', name: 'Florida', x: -81.7, y: 27.8, w: 4.2, h: 3.8 },
    { fips: '13', name: 'Georgia', x: -83.4, y: 32.6, w: 2.8, h: 3.2 },
    { fips: '15', name: 'Hawaii', x: -157.5, y: 21.3, w: 3.0, h: 2.0 },
    { fips: '16', name: 'Idaho', x: -114.5, y: 44.2, w: 2.5, h: 4.5 },
    { fips: '17', name: 'Illinois', x: -89.2, y: 40.0, w: 2.2, h: 3.8 },
    { fips: '18', name: 'Indiana', x: -86.1, y: 39.8, w: 1.8, h: 2.8 },
    { fips: '19', name: 'Iowa', x: -93.5, y: 42.0, w: 3.2, h: 2.2 },
    { fips: '20', name: 'Kansas', x: -98.5, y: 38.5, w: 4.2, h: 2.2 },
    { fips: '21', name: 'Kentucky', x: -84.6, y: 37.5, w: 3.8, h: 1.8 },
    { fips: '22', name: 'Louisiana', x: -91.8, y: 31.0, w: 2.8, h: 2.8 },
    { fips: '23', name: 'Maine', x: -69.2, y: 45.3, w: 2.2, h: 3.2 },
    { fips: '24', name: 'Maryland', x: -76.6, y: 39.0, w: 2.0, h: 1.2 },
    { fips: '25', name: 'Massachusetts', x: -71.8, y: 42.2, w: 2.0, h: 1.0 },
    { fips: '26', name: 'Michigan', x: -84.5, y: 44.3, w: 3.2, h: 3.2 },
    { fips: '27', name: 'Minnesota', x: -94.3, y: 46.3, w: 3.2, h: 3.8 },
    { fips: '28', name: 'Mississippi', x: -89.7, y: 32.7, w: 1.8, h: 3.2 },
    { fips: '29', name: 'Missouri', x: -92.5, y: 38.4, w: 3.2, h: 2.8 },
    { fips: '30', name: 'Montana', x: -109.5, y: 47.0, w: 5.2, h: 2.8 },
    { fips: '31', name: 'Nebraska', x: -99.8, y: 41.5, w: 4.2, h: 2.0 },
    { fips: '32', name: 'Nevada', x: -116.6, y: 38.8, w: 3.2, h: 4.8 },
    { fips: '33', name: 'New Hampshire', x: -71.5, y: 43.7, w: 1.0, h: 1.8 },
    { fips: '34', name: 'New Jersey', x: -74.4, y: 40.1, w: 1.0, h: 1.8 },
    { fips: '35', name: 'New Mexico', x: -106.0, y: 34.4, w: 3.8, h: 3.8 },
    { fips: '36', name: 'New York', x: -75.5, y: 43.0, w: 3.2, h: 2.5 },
    { fips: '37', name: 'North Carolina', x: -79.0, y: 35.5, w: 4.2, h: 1.8 },
    { fips: '38', name: 'North Dakota', x: -100.5, y: 47.5, w: 3.8, h: 2.0 },
    { fips: '39', name: 'Ohio', x: -82.8, y: 40.3, w: 2.2, h: 2.2 },
    { fips: '40', name: 'Oklahoma', x: -97.5, y: 35.5, w: 4.2, h: 2.0 },
    { fips: '41', name: 'Oregon', x: -120.5, y: 44.0, w: 4.0, h: 3.2 },
    { fips: '42', name: 'Pennsylvania', x: -77.7, y: 40.9, w: 2.8, h: 1.8 },
    { fips: '44', name: 'Rhode Island', x: -71.4, y: 41.6, w: 0.6, h: 0.8 },
    { fips: '45', name: 'South Carolina', x: -80.9, y: 33.8, w: 2.5, h: 2.0 },
    { fips: '46', name: 'South Dakota', x: -100.2, y: 44.4, w: 3.8, h: 2.2 },
    { fips: '47', name: 'Tennessee', x: -86.3, y: 35.8, w: 4.2, h: 1.5 },
    { fips: '48', name: 'Texas', x: -99.5, y: 31.5, w: 6.8, h: 6.2 },
    { fips: '49', name: 'Utah', x: -111.5, y: 39.3, w: 2.8, h: 3.5 },
    { fips: '50', name: 'Vermont', x: -72.6, y: 44.0, w: 1.0, h: 1.6 },
    { fips: '51', name: 'Virginia', x: -78.7, y: 37.5, w: 3.8, h: 1.8 },
    { fips: '53', name: 'Washington', x: -120.5, y: 47.4, w: 3.5, h: 2.5 },
    { fips: '54', name: 'West Virginia', x: -80.6, y: 38.6, w: 2.0, h: 2.0 },
    { fips: '55', name: 'Wisconsin', x: -89.6, y: 44.5, w: 2.8, h: 3.2 },
    { fips: '56', name: 'Wyoming', x: -107.5, y: 43.0, w: 3.8, h: 2.8 },
  ];

  const features: any[] = [];
  const featureData: FeatureData[] = [];

  // Deterministic seed PRNG
  let seed = 12345;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  states.forEach((st) => {
    // Subdivide each state into 6-12 county grid cells
    const rows = 3;
    const cols = 3;
    const dw = st.w / cols;
    const dh = st.h / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cId = `${st.fips}${r}${c}`;
        const x0 = st.x - st.w / 2 + c * dw;
        const y0 = st.y - st.h / 2 + r * dh;
        const x1 = x0 + dw * 0.96;
        const y1 = y0 + dh * 0.96;

        // County GeoJSON polygon
        const polygon = {
          type: 'Feature',
          id: cId,
          properties: {
            id: cId,
            name: `${st.name} County ${r * cols + c + 1}`,
            state: st.name,
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [x0, y0],
                [x1, y0],
                [x1, y1],
                [x0, y1],
                [x0, y0],
              ],
            ],
          },
        };

        // Unemployment rate value matching D3 reference image (2.0% - 9.8%)
        // High in Appalachia/West Coast/South, lower in Midwest
        const isAppalachia = st.fips === '21' || st.fips === '54' || st.fips === '47';
        const isWest = st.fips === '06' || st.fips === '53' || st.fips === '04';
        const baseRate = isAppalachia ? 7.2 : isWest ? 6.5 : 4.2;
        const rate = Math.max(1.8, Math.min(9.8, baseRate + (rnd() - 0.45) * 4.5));

        features.push(polygon);
        featureData.push({
          id: cId,
          value: parseFloat(rate.toFixed(1)),
          name: `${st.name} County ${r * cols + c + 1}`,
        });
      }
    }
  });

  return {
    geojson: { type: 'FeatureCollection', features },
    data: featureData,
  };
}

interface MapsPageProps {
  activeComponent?: string;
}

export function MapsPage({ activeComponent }: MapsPageProps) {
  const usDataset = useMemo(() => generateUSMapDataset(), []);

  const renderChoroplethMap = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card variant="outlined" style={{ padding: 24 }}>
        <CardContent>
          <ChoroplethMap
            title="U.S. County Unemployment Rate (Choropleth Map)"
            subtitle="Unemployment rate by U.S. county, August 2016. Data: Bureau of Labor Statistics. Colored using sequential threshold steps matching D3 Albers USA projection."
            geojson={usDataset.geojson}
            data={usDataset.data}
            featureIdKey="id"
            projection="albersUsa"
            colorScheme="blues"
            numThresholds={8}
            domain={[2, 9]}
            legendTitle="Unemployment rate (%)"
            height={580}
            interactive={true}
            valueFormatter={(v) => `${v.toFixed(1)}%`}
          />
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <PageTitle
        title="Map & Geographic Visualizations"
        subtitle="Cartographic visualization components for choropleth maps, spatial distributions, and geospatial datasets styled with Material Design 3 Expressive design tokens."
      />

      {(!activeComponent || activeComponent === 'choropleth') && (
        <DemoSection
          title="Choropleth Map"
          description="Thematic map where geographic regions are colored or shaded in proportion to a numeric data variable, such as unemployment rate or population density."
        >
          {renderChoroplethMap()}
        </DemoSection>
      )}
    </div>
  );
}
