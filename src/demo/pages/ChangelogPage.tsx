import { PageTitle, DemoSection } from '../components/DemoSection';
import { Card, CardContent, CardTitle, CardBody } from '../../lib';

export function ChangelogPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <PageTitle
        title="Changelog"
        subtitle="Version history logs and feature release milestones for the @hadi_gunawan/md3-expressive-ds design system."
      />

      <DemoSection title="Releases Timeline">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
          {/* v0.7.0 */}
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--md-sys-color-primary)', border: '4px solid var(--md-sys-color-primary-container)' }} />
              <div style={{ flex: 1, width: 2, background: 'var(--md-sys-color-outline-variant)', marginTop: 8 }} />
            </div>

            <Card variant="outlined" style={{ flex: 1 }}>
              <CardContent>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CardTitle>v0.7.0</CardTitle>
                    <span style={{ background: 'var(--md-sys-color-primary-container)', color: 'var(--md-sys-color-on-primary-container)', padding: '2px 8px', borderRadius: 'var(--md-sys-shape-corner-full)', font: 'var(--md-sys-typescale-label-small)', fontWeight: 'bold' }}>
                      Latest
                    </span>
                  </div>
                  <span style={{ font: 'var(--md-sys-typescale-label-medium)', color: 'var(--md-sys-color-on-surface-variant)' }}>July 22, 2026</span>
                </div>
                <CardBody>
                  <strong>Systemic Global Density System, Advanced DataTable Suite & Tabbed Demo Cards</strong>
                  <p style={{ margin: '8px 0', fontSize: '12px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                    Introduced systemic layout density controls across the design system, expanded DataTable features with Datetime Range Filtering and Tree Mode, and unified preview documentation into tabbed card containers.
                  </p>
                  <ul style={{ paddingLeft: 20, margin: '8px 0 0 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <li><strong>Global Density System:</strong> Added <code>DensityProvider</code> and <code>useDensity</code> hook supporting <code>comfortable</code> and <code>compact</code> density modes with local component overrides and localStorage persistence.</li>
                    <li><strong>Header Density Switcher:</strong> Placed a topbar <code>DensitySwitcher</code> pill control in <code>DemoLayout</code> to toggle systemic component density application-wide.</li>
                    <li><strong>DataTable Datetime Range Filter:</strong> Built-in <code>dateRangeFilter</code> prop supporting start and end date pickers, real-time bounding, and quick date range presets (<em>Today</em>, <em>Last 7 Days</em>, <em>Last 30 Days</em>).</li>
                    <li><strong>DataTable Feature Suite:</strong> Shipped Tree Mode hierarchical rows, floating bulk action bar, pinned freeze columns, column resizers, and double-click inline cell editing.</li>
                    <li><strong>DataTable Grid Alignment Fix:</strong> Re-architected row rendering to use direct <code>&lt;tr&gt;</code> elements under <code>&lt;tbody&gt;</code> with <code>React.Fragment</code>, guaranteeing 100% header/body column border alignment.</li>
                    <li><strong>Unified Tabbed Demo Cards:</strong> Combined UI Previews and Code Snippets inside a single card container with interactive <code>Preview</code> and <code>Code</code> tab switcher buttons across <code>DemoSection</code>.</li>
                    <li><strong>Per-Preview Variant Selector:</strong> Added interactive <code>Variant: [ Flat ] [ Outlined ] [ Striped ] [ Flush ]</code> controls to every table preview card.</li>
                  </ul>
                </CardBody>
              </CardContent>
            </Card>
          </div>

          {/* v0.6.2 */}
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--md-sys-color-primary)', border: '4px solid var(--md-sys-color-primary-container)' }} />
              <div style={{ flex: 1, width: 2, background: 'var(--md-sys-color-outline-variant)', marginTop: 8 }} />
            </div>

            <Card variant="outlined" style={{ flex: 1 }}>
              <CardContent>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CardTitle>v0.6.2</CardTitle>
                  </div>
                  <span style={{ font: 'var(--md-sys-typescale-label-medium)', color: 'var(--md-sys-color-on-surface-variant)' }}>July 22, 2026</span>
                </div>
                <CardBody>
                  <strong>Full-width Examples & Copy-ready Source Release</strong>
                  <p style={{ margin: '8px 0', fontSize: '12px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                    Turned the example area into direct, full-width application showcases with reusable project components and browsable source code.
                  </p>
                  <ul style={{ paddingLeft: 20, margin: '8px 0 0 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <li><strong>Direct Example Navigation:</strong> Removed the Examples overview route and replaced the header link with an accessible dropdown for ACME Store and Company Profile.</li>
                    <li><strong>Full-width Application Layouts:</strong> Removed the documentation width cap and sidebar from example routes so dashboards use the complete viewport.</li>
                    <li><strong>Design-system Adoption:</strong> Migrated example cards, avatars, data tables, progress indicators, document panels, and supporting UI to shared library components.</li>
                    <li><strong>Live Source Viewer:</strong> Added a wide SideSheet with Page, Data, and Styles tabs, line numbers, syntax highlighting, copy actions, and package-ready imports.</li>
                    <li><strong>Readable Example Architecture:</strong> Extracted ACME Store mock data and data types into a dedicated module displayed separately in the source viewer.</li>
                    <li><strong>Themed Scrollbars:</strong> Styled source-code and SideSheet scrollbars with MD3 surface, outline, radius, corner, and hover tokens.</li>
                    <li><strong>Indonesia Labor Map:</strong> Added a full-width bivariate choropleth Example comparing provincial unemployment and minimum wages across all 38 provinces, with regional filters, search, province detail, sortable data, official-source references, and copy-ready source tabs.</li>
                  </ul>
                </CardBody>
              </CardContent>
            </Card>
          </div>

          {/* v0.6.1 */}
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--md-sys-color-primary)', border: '4px solid var(--md-sys-color-primary-container)' }} />
              <div style={{ flex: 1, width: 2, background: 'var(--md-sys-color-outline-variant)', marginTop: 8 }} />
            </div>

            <Card variant="outlined" style={{ flex: 1 }}>
              <CardContent>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CardTitle>v0.6.1</CardTitle>
                  </div>
                  <span style={{ font: 'var(--md-sys-typescale-label-medium)', color: 'var(--md-sys-color-on-surface-variant)' }}>July 22, 2026</span>
                </div>
                <CardBody>
                  <strong>Documentation Navigation & Surface Polish</strong>
                  <p style={{ margin: '8px 0', fontSize: '12px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                    Refined documentation onboarding, navigation hierarchy, loading performance, card containment, and the minimized sidebar experience.
                  </p>
                  <ul style={{ paddingLeft: 20, margin: '8px 0 0 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <li><strong>Quick Start Guide:</strong> Replaced the documentation Overview entry with a focused setup guide covering installation, ThemeProvider, stylesheet imports, and first component usage.</li>
                    <li><strong>Grouping-only Sidebar Parents:</strong> Removed parent category routes and made category labels pure expand/collapse controls for their component children.</li>
                    <li><strong>Lazy Documentation Loading:</strong> Split category demo modules into lazy chunks so the home and guide routes no longer load every component showcase up front.</li>
                    <li><strong>Streamlined Installation UI:</strong> Combined npm, yarn, and pnpm commands into one accessible tabbed card and removed redundant nested card surfaces.</li>
                    <li><strong>Consistent MD3 Shapes:</strong> Added canonical verbose shape aliases and a shared card shape token so independent cards consistently receive medium rounded corners.</li>
                    <li><strong>Collapsed Sidebar Fixes:</strong> Standardized minimized navigation icons to centered 48px slots, removed scrollbar offset, and corrected active-state clipping.</li>
                  </ul>
                </CardBody>
              </CardContent>
            </Card>
          </div>

          {/* v0.6.0 */}
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--md-sys-color-primary)', border: '4px solid var(--md-sys-color-primary-container)' }} />
              <div style={{ flex: 1, width: 2, background: 'var(--md-sys-color-outline-variant)', marginTop: 8 }} />
            </div>

            <Card variant="outlined" style={{ flex: 1 }}>
              <CardContent>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CardTitle>v0.6.0</CardTitle>
                  </div>
                  <span style={{ font: 'var(--md-sys-typescale-label-medium)', color: 'var(--md-sys-color-on-surface-variant)' }}>July 22, 2026</span>
                </div>
                <CardBody>
                  <strong>Expressive Home & Component Discovery Release</strong>
                  <p style={{ margin: '8px 0', fontSize: '12px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                    Introduced a full-width landing experience that makes every component a first-class, visually recognizable entry point into the design system.
                  </p>
                  <ul style={{ paddingLeft: 20, margin: '8px 0 0 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <li><strong>New Root Home:</strong> Promoted the landing page to the root route, removed its sidebar, added clickable brand navigation, and preserved browser Back/Forward behavior.</li>
                    <li><strong>Complete Component Gallery:</strong> Added equal-size responsive cards with a maximum of five columns and direct navigation to every component document.</li>
                    <li><strong>Faithful UI Previews:</strong> Created dedicated miniatures for controls, content patterns, area and bar charts, networks, statistical analysis, maps, and hierarchy visualizations.</li>
                    <li><strong>Expressive Hero:</strong> Added a full-width welcome banner, prominent calls to action, an enlarged dashboard visualization, and refined spacing.</li>
                    <li><strong>Theme & Interaction Polish:</strong> Improved the closing CTA in dark mode and removed upward hover motion while retaining accessible feedback.</li>
                    <li><strong>Stronger Typography Identity:</strong> Increased display, headline, title, and label weights across the token system.</li>
                  </ul>
                </CardBody>
              </CardContent>
            </Card>
          </div>

          {/* v0.5.0 */}
          <div style={{ display: 'flex', gap: 16 }}>
            {/* Timeline track node */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: 'var(--md-sys-color-primary)',
                border: '4px solid var(--md-sys-color-primary-container)'
              }} />
              <div style={{ flex: 1, width: 2, background: 'var(--md-sys-color-outline-variant)', marginTop: 8 }} />
            </div>

            {/* Version content */}
            <Card variant="outlined" style={{ flex: 1 }}>
              <CardContent>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CardTitle>v0.5.0</CardTitle>
                  </div>
                  <span style={{ font: 'var(--md-sys-typescale-label-medium)', color: 'var(--md-sys-color-on-surface-variant)' }}>July 22, 2026</span>
                </div>
                <CardBody>
                  <strong>Statistical Analysis, Cartographic Maps & Hierarchical Trees Release</strong>
                  <p style={{ margin: '8px 0', fontSize: '12px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                    Introduced 12 new specialized D3 visualization components spanning 3 new categories (Analysis, Maps, Hierarchies), complete with cartographic projections, 3×3 bivariate color matrices, 6 treemap tiling algorithms, and multi-parent DAG layout algorithms.
                  </p>
                  <ul style={{ paddingLeft: 20, margin: '8px 0 0 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <li><strong>Statistical Analysis Components:</strong> Added <code>Histogram</code> with Sturges rule binning, <code>KernelDensityEstimation</code> (Epanechnikov, Gaussian, Triangular, Uniform kernels), <code>HexbinChart</code> (2D density spatial binning), and <code>QQPlot</code> (Two-Sample & Normal Q-Q plots with Acklam probit algorithm).</li>
                    <li><strong>Geographic Map Components:</strong> Created <code>ChoroplethMap</code> supporting U.S. Census counties and Natural Earth world topologies (Albers USA, Mercator, Equal Earth, Natural Earth projections with spherical globe outline) and <code>BivariateChoroplethMap</code> with 2D 3×3 color matrix and 45° rotated diamond legend.</li>
                    <li><strong>Hierarchical Visualization Components:</strong> Built <code>Treemap</code> (6 tiling algorithms), <code>IndentedTree</code> (vertical list with orthogonal step links, tabular Size & Count columns, expand/collapse), <code>TidyTree</code> (Reingold-Tilford horizontal tree), <code>RadialTree</code> (360° circular tree with 180° text flip rotation), <code>SunburstChart</code> (radial partition rings with subtree zoom), and <code>TangledTree</code> (multi-parent DAG genealogy layout).</li>
                    <li><strong>Tooltip & Cursor Hover State Fixes:</strong> Re-architected mouse leave event handlers across all 25+ chart components to guarantee clean tooltip dismissal on mouse leave.</li>
                  </ul>
                </CardBody>
              </CardContent>
            </Card>
          </div>

          {/* v0.4.0 */}
          <div style={{ display: 'flex', gap: 16 }}>
            {/* Timeline track node */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: 'var(--md-sys-color-outline)',
                border: '2px solid var(--md-sys-color-outline-variant)'
              }} />
              <div style={{ flex: 1, width: 2, background: 'var(--md-sys-color-outline-variant)', marginTop: 8 }} />
            </div>

            {/* Version content */}
            <Card variant="outlined" style={{ flex: 1, opacity: 0.9 }}>
              <CardContent>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CardTitle>v0.4.0</CardTitle>
                  </div>
                  <span style={{ font: 'var(--md-sys-typescale-label-medium)', color: 'var(--md-sys-color-on-surface-variant)' }}>July 21, 2026</span>
                </div>

                <CardBody>
                  <strong>D3-based Data Visualization Components & Timelines Release</strong>
                  <p style={{ margin: '8px 0', fontSize: '12px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                    Introduced 9 major interactive data visualization and charting components, adding complete whitelisted playgrounds and registry schema configurations.
                  </p>
                  <ul style={{ paddingLeft: 20, margin: '8px 0 0 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <li><strong>Area Chart Variants:</strong> Created <code>AreaChart</code>, <code>StackedAreaChart</code> (with percentage scaling offset expansions), and <code>DifferenceChart</code>. Replicated the canonical D3 streamgraph wiggle layouts.</li>
                    <li><strong>Standard & Diverging Bar Charts:</strong> Added <code>BarChart</code> with top-rounded bars, <code>HorizontalBarChart</code> with label overflow auto-margin margins, and <code>DivergingBarChart</code> centering values around a zero baseline.</li>
                    <li><strong>Stacked & Normalized Stacked Bar Charts:</strong> Implemented <code>StackedBarChart</code> featuring absolute sums, 100% percentage normalization, and legend series filter toggling.</li>
                    <li><strong>World History Timeline:</strong> Created <code>TimelineChart</code> mapping start/end years with customizable region colors, BC/AD ticks formatting, row sorting dropdown, and cursor tracker crosshairs.</li>
                    <li><strong>Calendar View Heatmap:</strong> Created <code>CalendarChart</code> mapping daily stock metrics into weekday grids, supporting customized cellSize, and diverging color gradient legends.</li>
                  </ul>
                </CardBody>
              </CardContent>
            </Card>
          </div>

          {/* v0.2.3 */}
          <div style={{ display: 'flex', gap: 16 }}>
            {/* Timeline track node */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: 'var(--md-sys-color-outline)',
                border: '2px solid var(--md-sys-color-outline-variant)'
              }} />
              <div style={{ flex: 1, width: 2, background: 'var(--md-sys-color-outline-variant)', marginTop: 8 }} />
            </div>

            {/* Version content */}
            <Card variant="outlined" style={{ flex: 1, opacity: 0.9 }}>
              <CardContent>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CardTitle>v0.2.3</CardTitle>
                  </div>
                  <span style={{ font: 'var(--md-sys-typescale-label-medium)', color: 'var(--md-sys-color-on-surface-variant)' }}>May 30, 2026</span>
                </div>
                <CardBody>
                  <strong>Custom MD3 Expressive Component Improvements & Fixes</strong>
                  <ul style={{ paddingLeft: 20, margin: '8px 0 0 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <li><strong>Portal & Alignment Menu:</strong> Added <code>align</code> and <code>usePortal</code> props to <code>Menu</code>. Dropdowns are now rendered into portals to avoid container overflow and z-index overlaps in tables and headers.</li>
                    <li><strong>Tooltip Enhancements:</strong> Integrated <code>placement</code> controls with smart viewport collision detection (auto-flip) and cascade color protection wrapper.</li>
                    <li><strong>Sized Select Trigger:</strong> Added <code>minWidth</code>, <code>width</code>, and <code>size</code> props to <code>Select</code>, automatically resizing the internal <code>TextField</code> and isolating dropdown list dimensions.</li>
                    <li><strong>Flexible SegmentedButton:</strong> Made labels optional for icon-only segments, added internal tooltip integration, and solved border divider rendering conflicts.</li>
                    <li><strong>System Theme Preference:</strong> Enhanced <code>useTheme</code> hook to support <code>system</code> theme preference that dynamically syncs with OS media queries.</li>
                    <li><strong>Prop Forwarding & Target Selectors:</strong> Enabled HTMLAttributes propagation, forwarding <code>className</code>/<code>style</code>, and appended stable <code>data-md3-component</code> selectors to layout wrappers.</li>
                    <li><strong>Checkbox Adjustments:</strong> Handled standalone flex gap alignment and added focus-ring visible outlines.</li>
                  </ul>
                </CardBody>
              </CardContent>
            </Card>
          </div>

          {/* v0.2.1 */}
          <div style={{ display: 'flex', gap: 16 }}>
            {/* Timeline track node */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: 'var(--md-sys-color-outline)',
                border: '2px solid var(--md-sys-color-outline-variant)'
              }} />
              <div style={{ flex: 1, width: 2, background: 'var(--md-sys-color-outline-variant)', marginTop: 8 }} />
            </div>

            {/* Version content */}
            <Card variant="outlined" style={{ flex: 1, opacity: 0.9 }}>
              <CardContent>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CardTitle>v0.2.1</CardTitle>
                  </div>
                  <span style={{ font: 'var(--md-sys-typescale-label-medium)', color: 'var(--md-sys-color-on-surface-variant)' }}>May 22, 2026</span>
                </div>
                <CardBody>
                  <strong>Theme Architecture Refactoring & React 19 Upgrade</strong>
                  <ul style={{ paddingLeft: 20, margin: '8px 0 0 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <li><strong>Centralized Theme State:</strong> Introduced <code>ThemeProvider</code> and <code>ThemeContext</code> to sync state reactively across consumer components.</li>
                    <li><strong>Flashing Prevention (FOUC):</strong> Defined all color tokens at the <code>:root</code> level of <code>light-purple.css</code> to ensure robust CSS fallbacks before JS hydration.</li>
                    <li><strong>React 19 Compatibility:</strong> Upgraded developer dependencies and type packages to React 19, resolving dual-instance issues on local linking.</li>
                    <li><strong>TextField Refinements:</strong> Set default width to <code>100%</code>, increased outlined border to <code>1.5px</code> for better accessibility, and implemented dynamic <code>--md-tf-surface</code> color customizer fallback for floating labels.</li>
                    <li><strong>Button Improvements:</strong> Added <code>border: none</code> to default buttons to prevent default browser border overlays in filled/tonal variants.</li>
                  </ul>
                </CardBody>
              </CardContent>
            </Card>
          </div>


          {/* v0.1.0 */}
          <div style={{ display: 'flex', gap: 16 }}>
            {/* Timeline track node */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: 'var(--md-sys-color-outline)',
                border: '2px solid var(--md-sys-color-outline-variant)'
              }} />
              <div style={{ flex: 1, width: 2, background: 'var(--md-sys-color-outline-variant)', marginTop: 8 }} />
            </div>

            {/* Version content */}
            <Card variant="outlined" style={{ flex: 1, opacity: 0.9 }}>
              <CardContent>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CardTitle>v0.1.0</CardTitle>
                  </div>
                  <span style={{ font: 'var(--md-sys-typescale-label-medium)', color: 'var(--md-sys-color-on-surface-variant)' }}>May 22, 2026</span>
                </div>
                <CardBody>
                  <strong>Initial Release of MD3 Expressive Component Library for React</strong>
                  <ul style={{ paddingLeft: 20, margin: '8px 0 0 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <li>Shipped 45+ components styled via vanilla CSS modules using full HSL color tokens.</li>
                    <li>Added custom transitions with springy overshoot physics curves.</li>
                    <li>Built layout customizers, themes support, and Examples modules.</li>
                    <li>Implemented full responsive grids, typography sizes, and shapes.</li>
                  </ul>
                </CardBody>
              </CardContent>
            </Card>
          </div>

          {/* v0.0.1-beta */}
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: 'var(--md-sys-color-outline)',
                border: '2px solid var(--md-sys-color-outline-variant)'
              }} />
            </div>

            <Card variant="outlined" style={{ flex: 1, opacity: 0.8 }}>
              <CardContent>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CardTitle>v0.0.1-beta</CardTitle>
                    <span style={{
                      background: 'var(--md-sys-color-secondary-container)',
                      color: 'var(--md-sys-color-on-secondary-container)',
                      padding: '2px 8px',
                      borderRadius: 'var(--md-sys-shape-corner-full)',
                      font: 'var(--md-sys-typescale-label-small)',
                      fontWeight: 'bold'
                    }}>
                      Beta
                    </span>
                  </div>
                  <span style={{ font: 'var(--md-sys-typescale-label-medium)', color: 'var(--md-sys-color-on-surface-variant)' }}>May 15, 2026</span>
                </div>
                <CardBody>
                  Beta releases and early design concept.
                  <ul style={{ paddingLeft: 20, margin: '8px 0 0 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <li>Tested core layout structures, typography scales, and CSS modules loading.</li>
                    <li>Wired initial purple, ocean, and forest color mappings.</li>
                  </ul>
                </CardBody>
              </CardContent>
            </Card>
          </div>
        </div>
      </DemoSection>
    </div>
  );
}

