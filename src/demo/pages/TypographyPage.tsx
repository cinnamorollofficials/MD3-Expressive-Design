import { useState } from 'react';
import { PageTitle, DemoSection } from '../components/DemoSection';
import { TextField } from '../../lib';

interface TypeRow {
  group: 'Display' | 'Headline' | 'Title' | 'Body' | 'Label';
  name: string;
  variable: string;
  size: string;
  weight: string;
}

const TYPE_SCALES: TypeRow[] = [
  { group: 'Display', name: 'Display Large', variable: '--md-sys-typescale-display-large', size: '57px', weight: '400' },
  { group: 'Display', name: 'Display Medium', variable: '--md-sys-typescale-display-medium', size: '45px', weight: '400' },
  { group: 'Display', name: 'Display Small', variable: '--md-sys-typescale-display-small', size: '36px', weight: '400' },

  { group: 'Headline', name: 'Headline Large', variable: '--md-sys-typescale-headline-large', size: '32px', weight: '400' },
  { group: 'Headline', name: 'Headline Medium', variable: '--md-sys-typescale-headline-medium', size: '28px', weight: '400' },
  { group: 'Headline', name: 'Headline Small', variable: '--md-sys-typescale-headline-small', size: '24px', weight: '400' },

  { group: 'Title', name: 'Title Large', variable: '--md-sys-typescale-title-large', size: '22px', weight: '500' },
  { group: 'Title', name: 'Title Medium', variable: '--md-sys-typescale-title-medium', size: '16px', weight: '500' },
  { group: 'Title', name: 'Title Small', variable: '--md-sys-typescale-title-small', size: '14px', weight: '500' },

  { group: 'Body', name: 'Body Large', variable: '--md-sys-typescale-body-large', size: '16px', weight: '400' },
  { group: 'Body', name: 'Body Medium', variable: '--md-sys-typescale-body-medium', size: '14px', weight: '400' },
  { group: 'Body', name: 'Body Small', variable: '--md-sys-typescale-body-small', size: '12px', weight: '400' },

  { group: 'Label', name: 'Label Large', variable: '--md-sys-typescale-label-large', size: '14px', weight: '500' },
  { group: 'Label', name: 'Label Medium', variable: '--md-sys-typescale-label-medium', size: '12px', weight: '500' },
  { group: 'Label', name: 'Label Small', variable: '--md-sys-typescale-label-small', size: '11px', weight: '500' },
];

export function TypographyPage() {
  const [customText, setCustomText] = useState('Material 3 Expressive Typography');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <PageTitle
        title="Typography Scale"
        subtitle="Expressive styling maps text elements to a standardized 15-step typography scale built on Material Design 3 guidelines."
      />

      <div style={{
        background: 'var(--md-sys-color-surface-container-low)',
        border: '1px solid var(--md-sys-color-outline-variant)',
        borderRadius: 'var(--md-sys-shape-corner-large)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}>
        <div style={{ maxWidth: 480 }}>
          <TextField
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            label="Custom Preview Text"
            placeholder="Type text to view live scale sizes..."
          />
        </div>
      </div>

      <DemoSection title="Typography Scale Breakdown" description="Hover over any sample to see CSS class usage.">
        <div style={{
          background: 'var(--md-sys-color-surface)',
          border: '1px solid var(--md-sys-color-outline-variant)',
          borderRadius: 'var(--md-sys-shape-corner-large)',
          overflowX: 'auto',
          width: '100%'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            font: 'var(--md-sys-typescale-body-medium)'
          }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--md-sys-color-outline-variant)' }}>
                <th style={{ padding: '12px 16px', background: 'var(--md-sys-color-surface-container-low)', color: 'var(--md-sys-color-on-surface)' }}>Scale Name</th>
                <th style={{ padding: '12px 16px', background: 'var(--md-sys-color-surface-container-low)', color: 'var(--md-sys-color-on-surface)' }}>Font Token</th>
                <th style={{ padding: '12px 16px', background: 'var(--md-sys-color-surface-container-low)', color: 'var(--md-sys-color-on-surface)' }}>Size / Weight</th>
                <th style={{ padding: '12px 16px', background: 'var(--md-sys-color-surface-container-low)', color: 'var(--md-sys-color-on-surface)' }}>Visual Preview</th>
              </tr>
            </thead>
            <tbody>
              {TYPE_SCALES.map((scale, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--md-sys-color-outline-variant)' }}>
                  <td style={{ padding: '16px', fontWeight: 600, color: 'var(--md-sys-color-on-surface)' }}>{scale.name}</td>
                  <td style={{ padding: '16px' }}><code style={{ color: 'var(--md-sys-color-primary)', fontFamily: 'monospace' }}>{scale.variable}</code></td>
                  <td style={{ padding: '16px', color: 'var(--md-sys-color-on-surface-variant)' }}>{scale.size} / Weight {scale.weight}</td>
                  <td style={{ padding: '16px', overflow: 'hidden' }}>
                    <div style={{
                      font: `var(${scale.variable})`,
                      color: 'var(--md-sys-color-on-surface)',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      maxWidth: 400
                    }}>
                      {customText}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DemoSection>
    </div>
  );
}
