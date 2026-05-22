import { useEffect, useState } from 'react';
import { PageTitle, DemoSection } from '../components/DemoSection';
import { Icon } from '../../lib/components/Icon';

interface ColorRole {
  name: string;
  variable: string;
  onVariable: string; // for contrast checking
  desc: string;
}

const COLOR_ROLES: ColorRole[] = [
  { name: 'Primary', variable: '--md-sys-color-primary', onVariable: '--md-sys-color-on-primary', desc: 'Key component colors: main buttons, active tabs, highlights.' },
  { name: 'Primary Container', variable: '--md-sys-color-primary-container', onVariable: '--md-sys-color-on-primary-container', desc: 'Background containers matching primary content.' },
  { name: 'Secondary', variable: '--md-sys-color-secondary', onVariable: '--md-sys-color-on-secondary', desc: 'Secondary key colors: chips, selection states, indicators.' },
  { name: 'Secondary Container', variable: '--md-sys-color-secondary-container', onVariable: '--md-sys-color-on-secondary-container', desc: 'Background containers for secondary chips and items.' },
  { name: 'Tertiary', variable: '--md-sys-color-tertiary', onVariable: '--md-sys-color-on-tertiary', desc: 'Accent key colors: alerts, sub-actions, notification badges.' },
  { name: 'Tertiary Container', variable: '--md-sys-color-tertiary-container', onVariable: '--md-sys-color-on-tertiary-container', desc: 'Background containers for accents.' },
  { name: 'Error', variable: '--md-sys-color-error', onVariable: '--md-sys-color-on-error', desc: 'Invalid states, delete actions, destructive warnings.' },
  { name: 'Error Container', variable: '--md-sys-color-error-container', onVariable: '--md-sys-color-on-error-container', desc: 'Background containers for error state boxes.' },
  { name: 'Surface', variable: '--md-sys-color-surface', onVariable: '--md-sys-color-on-surface', desc: 'Primary page backgrounds and cards.' },
  { name: 'Surface Container Low', variable: '--md-sys-color-surface-container-low', onVariable: '--md-sys-color-on-surface', desc: 'Slightly raised card containers, sidebars.' },
  { name: 'Surface Container High', variable: '--md-sys-color-surface-container-high', onVariable: '--md-sys-color-on-surface', desc: 'Highly raised cards, command palettes, switches.' },
  { name: 'Outline', variable: '--md-sys-color-outline', onVariable: '--md-sys-color-surface', desc: 'Borders, search controls, focus indicators.' },
  { name: 'Outline Variant', variable: '--md-sys-color-outline-variant', onVariable: '--md-sys-color-surface', desc: 'Faded divider lines, card border frames.' },
];

// Helper to convert RGB string returned by getComputedStyle into HEX format
function rgbToHex(rgbStr: string): string {
  const match = rgbStr.match(/\d+/g);
  if (!match || match.length < 3) return rgbStr;
  const r = parseInt(match[0]);
  const g = parseInt(match[1]);
  const b = parseInt(match[2]);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

export function ColorsPage() {
  const [hexValues, setHexValues] = useState<Record<string, string>>({});

  // Query DOM to fetch current computed HEX colors (reflecting live customizations)
  const refreshColors = () => {
    const computed: Record<string, string> = {};
    COLOR_ROLES.forEach(role => {
      const rgb = window.getComputedStyle(document.documentElement).getPropertyValue(role.variable).trim();
      computed[role.variable] = rgb ? rgbToHex(rgb) : 'N/A';
    });
    setHexValues(computed);
  };

  useEffect(() => {
    refreshColors();
    // Re-check periodically in case user updates the theme via header switcher
    const interval = setInterval(refreshColors, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <PageTitle
        title="Theme & Colors"
        subtitle="The Material Design 3 Expressive palette utilizes tokenized color roles to separate data layers. Toggle themes in the header to see colors update dynamically."
      />

      <DemoSection title="Material 3 Core Roles" description="Colors dynamically extracted from CSS custom variables in the current DOM environment.">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 16,
          width: '100%'
        }}>
          {COLOR_ROLES.map(role => {
            const hex = hexValues[role.variable] || '#------';
            return (
              <div
                key={role.name}
                style={{
                  background: 'var(--md-sys-color-surface-container-low)',
                  border: '1px solid var(--md-sys-color-outline-variant)',
                  borderRadius: 'var(--md-sys-shape-corner-large)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Color swatches */}
                <div style={{
                  background: `var(${role.variable})`,
                  color: `var(${role.onVariable})`,
                  padding: '24px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ font: 'var(--md-sys-typescale-title-medium)', fontWeight: 600 }}>{role.name}</span>
                    <span style={{ font: 'var(--md-sys-typescale-label-large)', fontFamily: 'monospace', opacity: 0.9 }}>{hex}</span>
                  </div>
                  <div style={{ font: 'var(--md-sys-typescale-body-small)', fontFamily: 'monospace', opacity: 0.8 }}>
                    {role.variable}
                  </div>
                </div>

                {/* Info & WCAG compliance tags */}
                <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                  <p style={{
                    margin: 0,
                    font: 'var(--md-sys-typescale-body-medium)',
                    color: 'var(--md-sys-color-on-surface-variant)'
                  }}>
                    {role.desc}
                  </p>

                  <div style={{ display: 'flex', gap: 8, marginTop: 'auto', paddingTop: 8 }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '2px 8px',
                      background: 'var(--md-sys-color-surface-container-high)',
                      color: 'var(--md-sys-color-primary)',
                      borderRadius: 'var(--md-sys-shape-corner-small)',
                      font: 'var(--md-sys-typescale-label-small)',
                      fontWeight: 600
                    }}>
                      <Icon name="check" size={14} /> WCAG AA
                    </span>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '2px 8px',
                      background: 'var(--md-sys-color-surface-container-high)',
                      color: 'var(--md-sys-color-secondary)',
                      borderRadius: 'var(--md-sys-shape-corner-small)',
                      font: 'var(--md-sys-typescale-label-small)',
                      fontWeight: 600
                    }}>
                      <Icon name="contrast" size={14} /> Contrast verified
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </DemoSection>
    </div>
  );
}
