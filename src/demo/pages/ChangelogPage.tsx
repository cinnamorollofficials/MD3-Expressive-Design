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
          {/* v0.2.0 */}
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
                    <CardTitle>v0.2.1</CardTitle>
                    <span style={{
                      background: 'var(--md-sys-color-primary-container)',
                      color: 'var(--md-sys-color-on-primary-container)',
                      padding: '2px 8px',
                      borderRadius: 'var(--md-sys-shape-corner-full)',
                      font: 'var(--md-sys-typescale-label-small)',
                      fontWeight: 'bold'
                    }}>
                      Latest
                    </span>
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

