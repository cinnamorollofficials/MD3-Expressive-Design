# Workspace Rules & Guides — MD3 Expressive Design

## Cartographic & Choropleth Map Visualizations (`ChoroplethMap`)

### 1. Map Projections (`projection`)
- **United States Maps**: Use `projection="albersUsa"`. `d3.geoAlbersUsa()` scales and positions the continental US while rendering Alaska and Hawaii in lower-left inset boxes.
- **International & World Maps (Indonesia, Japan, Europe, Global)**: Use `projection="mercator"`, `projection="equalEarth"`, or `projection="naturalEarth"`.
  - Do NOT use `albersUsa` for non-US coordinates; `d3.geoAlbersUsa()` returns `null` for points outside the United States.
  - The component automatically fits non-US boundaries to the container viewport via `proj.fitExtent()`.

### 2. GeoJSON vs TopoJSON & Pre-Projected Detection
- **Unprojected GeoJSON / TopoJSON (e.g. `counties-10m.json`, `world-110m.json`)**: Coordinates are in longitude/latitude degrees `[lon, lat]`. Must be projected using a D3 projection (`geoAlbersUsa`, `geoMercator`, etc.).
- **Quantized TopoJSON**: Contains `geojson.transform` for integer compression, but coordinates after `topoFeature()` extraction are still unprojected degrees. Do NOT treat quantized TopoJSON as pre-projected.
- **Pre-Projected TopoJSON (e.g. `counties-albers-10m.json`)**: Coordinates are already in pixel space ($975 \times 610$). Only use identity projection `d3.geoPath(null)` when topology object keys explicitly contain `'albers'`.

### 3. Feature ID Matching (`featureIdKey`)
- **World Map**: Match ISO 3-letter codes (`ISO_A3`: `"IDN"`, `"USA"`, `"JPN"`).
- **US Map**: Match 5-digit FIPS codes (`"06069"` for counties, `"06"` for states).
- **Indonesia Map**: Match BPS / Kemendagri province/regency codes (`"31"` for DKI Jakarta, `"32"` for Jawa Barat).
