import { PageTitle, DemoSection } from '../components/DemoSection';
import { Card, CardContent } from '../../lib';

export function DesignTokensPage() {
  const shapes = [
    { name: 'none', variable: '--md-sys-shape-corner-none', val: '0px' },
    { name: 'extra-small', variable: '--md-sys-shape-corner-extra-small', val: '4px' },
    { name: 'small', variable: '--md-sys-shape-corner-small', val: '8px' },
    { name: 'medium', variable: '--md-sys-shape-corner-medium', val: '12px' },
    { name: 'large', variable: '--md-sys-shape-corner-large', val: '16px' },
    { name: 'extra-large', variable: '--md-sys-shape-corner-extra-large', val: '28px' },
    { name: 'full', variable: '--md-sys-shape-corner-full', val: '9999px' },
  ];

  const elevations = [
    { level: '0', variable: '--md-sys-elevation-0', desc: 'Flat surface container' },
    { level: '1', variable: '--md-sys-elevation-1', desc: 'Card rests, sidebar outlines' },
    { level: '2', variable: '--md-sys-elevation-2', desc: 'Raised alerts, hover cards' },
    { level: '3', variable: '--md-sys-elevation-3', desc: 'FAB overlays, dialog bases' },
    { level: '4', variable: '--md-sys-elevation-4', desc: 'Popups, floating drawers' },
    { level: '5', variable: '--md-sys-elevation-5', desc: 'Dropdown menus, palettes' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <PageTitle
        title="Design Tokens"
        subtitle="Tokens allow developers to enforce unified sizes, shadows, and spacing. Use them inside custom styles to extend the design system."
      />

      <DemoSection title="Shape Corners Tokens" description="Expressive components utilize shape corners to morph layout states on scroll/press.">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 16,
          width: '100%'
        }}>
          {shapes.map(s => (
            <div
              key={s.name}
              style={{
                background: 'var(--md-sys-color-primary-container)',
                color: 'var(--md-sys-color-on-primary-container)',
                border: '1px solid var(--md-sys-color-primary)',
                borderRadius: `var(${s.variable})`,
                padding: '24px 12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                gap: 8,
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ font: 'var(--md-sys-typescale-title-small)', fontWeight: 600 }}>{s.name}</span>
              <code style={{ font: 'var(--md-sys-typescale-label-small)', fontSize: 10 }}>{s.val}</code>
            </div>
          ))}
        </div>
      </DemoSection>

      <DemoSection title="Elevation Shadows Tokens" description="Elevation adds depth to your layout using smooth multi-layered ambient CSS shadows.">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 20,
          width: '100%'
        }}>
          {elevations.map(el => (
            <Card key={el.level} style={{ boxShadow: `var(${el.variable})` }}>
              <CardContent>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ font: 'var(--md-sys-typescale-title-medium)', fontWeight: 600 }}>Level {el.level}</span>
                  <code style={{ font: 'var(--md-sys-typescale-label-small)', color: 'var(--md-sys-color-primary)' }}>{el.variable}</code>
                </div>
                <p style={{ margin: 0, font: 'var(--md-sys-typescale-body-medium)', color: 'var(--md-sys-color-on-surface-variant)' }}>
                  {el.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </DemoSection>
    </div>
  );
}
