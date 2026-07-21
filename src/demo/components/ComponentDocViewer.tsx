import { ReactNode, useEffect, useState, useMemo } from 'react';
import { getComponentMetadata, ComponentMetadata } from '../metadata/componentsRegistry';
import { Icon } from '../../lib/components/Icon';
import { cn } from '../../lib/utils/cn';
import {
  Button, IconButton, FAB, Card, CardContent, CardTitle, CardBody,
  Switch, Checkbox, TextField, Slider, Badge, Avatar,
  AreaChart, StackedAreaChart, DifferenceChart, BarChart
} from '../../lib';
import { CodeBlock } from './CodeBlock';
import styles from './ComponentDocViewer.module.css';

const PLAYGROUND_AREA_DATA = [
  { index: 1, value: 30 },
  { index: 2, value: 45 },
  { index: 3, value: 35 },
  { index: 4, value: 60 },
  { index: 5, value: 50 },
  { index: 6, value: 75 },
];

const PLAYGROUND_MISSING_DATA = [
  { index: 1, value: 30 },
  { index: 2, value: 45 },
  { index: 3, value: null },
  { index: 4, value: 60 },
  { index: 5, value: null },
  { index: 6, value: 75 },
];

const PLAYGROUND_STACKED_DATA = [
  { index: 1, A: 30, B: 20, C: 15 },
  { index: 2, A: 45, B: 25, C: 20 },
  { index: 3, A: 35, B: 30, C: 25 },
  { index: 4, A: 60, B: 40, C: 30 },
  { index: 5, A: 50, B: 35, C: 20 },
  { index: 6, A: 75, B: 45, C: 35 },
];

const PLAYGROUND_DIFFERENCE_DATA = [
  { index: 1, A: 45, B: 40 },
  { index: 2, A: 48, B: 52 },
  { index: 3, A: 55, B: 50 },
  { index: 4, A: 50, B: 62 },
  { index: 5, A: 65, B: 58 },
  { index: 6, A: 58, B: 70 },
  { index: 7, A: 72, B: 65 },
];

const PLAYGROUND_BAR_DATA = [
  { label: 'E', value: 12.7 },
  { label: 'T', value: 9.1 },
  { label: 'A', value: 8.2 },
  { label: 'O', value: 7.5 },
  { label: 'I', value: 7.0 },
  { label: 'N', value: 6.7 },
  { label: 'S', value: 6.3 },
  { label: 'H', value: 6.1 },
  { label: 'R', value: 6.0 },
  { label: 'D', value: 4.3 },
];

interface ComponentDocViewerProps {
  id: string;
  children: ReactNode; // original demo sections
}

export function ComponentDocViewer({ id, children }: ComponentDocViewerProps) {
  const metadata = useMemo(() => getComponentMetadata(id), [id]);

  // Controls states
  const [rtl, setRtl] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  // Playground props states
  const initialPlaygroundValues = useMemo(() => {
    const vals: Record<string, any> = {};
    metadata.playgroundControls?.forEach(c => {
      vals[c.name] = c.defaultValue;
    });
    return vals;
  }, [metadata]);

  const [playgroundProps, setPlaygroundProps] = useState<Record<string, any>>(initialPlaygroundValues);

  // Reset props when component changes
  useEffect(() => {
    setPlaygroundProps(initialPlaygroundValues);
  }, [initialPlaygroundValues]);

  const handlePropChange = (name: string, value: any) => {
    setPlaygroundProps(prev => ({ ...prev, [name]: value }));
  };

  // Render the interactive component for the playground
  const livePreview = useMemo(() => {
    switch (id) {
      case 'button':
        return (
          <Button
            variant={playgroundProps.variant}
            size={playgroundProps.size}
            disabled={playgroundProps.disabled}
            startIcon={playgroundProps.startIcon || undefined}
            endIcon={playgroundProps.endIcon || undefined}
          >
            {playgroundProps.children}
          </Button>
        );
      case 'icon-button':
        return (
          <IconButton
            icon={playgroundProps.icon}
            label={playgroundProps.label}
            variant={playgroundProps.variant}
            disabled={playgroundProps.disabled}
            toggle={playgroundProps.toggle}
          />
        );
      case 'fab':
        return (
          <FAB
            icon={playgroundProps.icon}
            label={playgroundProps.label || undefined}
            size={playgroundProps.size}
            color={playgroundProps.color}
          />
        );
      case 'card':
        return (
          <Card variant={playgroundProps.variant} style={{ maxWidth: 320 }}>
            <CardContent>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <Avatar name="MD" size="sm" />
                <div>
                  <div style={{ font: 'var(--md-sys-typescale-title-small)', color: 'var(--md-sys-color-on-surface)' }}>Interactive Card</div>
                  <div style={{ font: 'var(--md-sys-typescale-body-small)', color: 'var(--md-sys-color-on-surface-variant)' }}>Subtitle text</div>
                </div>
              </div>
              <CardTitle>Interactive Card</CardTitle>
              <CardBody>
                This card preview changes visually depending on the variant property. Check out the elevation and borders!
              </CardBody>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
                <Button variant="text" size="sm">Dismiss</Button>
                <Button variant="filled" size="sm">Action</Button>
              </div>
            </CardContent>
          </Card>
        );
      case 'switch':
        return (
          <Switch
            checked={playgroundProps.checked}
            disabled={playgroundProps.disabled}
            label={playgroundProps.label || undefined}
            onChange={(e) => handlePropChange('checked', e.target.checked)}
          />
        );
      case 'checkbox':
        return (
          <Checkbox
            checked={playgroundProps.checked}
            indeterminate={playgroundProps.indeterminate}
            disabled={playgroundProps.disabled}
            label={playgroundProps.label || undefined}
            onChange={(e) => handlePropChange('checked', e.target.checked)}
          />
        );
      case 'text-field':
        return (
          <TextField
            value={playgroundProps.value}
            label={playgroundProps.label}
            placeholder={playgroundProps.placeholder || undefined}
            error={playgroundProps.error}
            helperText={playgroundProps.errorText || undefined}
            leadingIcon={playgroundProps.leadingIcon || undefined}
            trailingIcon={playgroundProps.trailingIcon || undefined}
            onChange={(e) => handlePropChange('value', e.target.value)}
          />
        );
      case 'slider':
        return (
          <div style={{ width: '100%', padding: '0 16px' }}>
            <div style={{ font: 'var(--md-sys-typescale-label-medium)', marginBottom: 8, color: 'var(--md-sys-color-on-surface-variant)' }}>
              Value: {playgroundProps.value}
            </div>
            <Slider
              value={playgroundProps.value}
              min={playgroundProps.min}
              max={playgroundProps.max}
              step={playgroundProps.step}
              onChange={(e) => handlePropChange('value', Number(e.target.value))}
            />
          </div>
        );
      case 'badge':
        return (
          <Badge
            count={playgroundProps.count || undefined}
            dot={playgroundProps.dot}
            max={playgroundProps.max}
          >
            <IconButton icon="notifications" label="Notifications" variant="outlined" />
          </Badge>
        );
      case 'avatar':
        return (
          <Avatar
            src={playgroundProps.src || undefined}
            name={playgroundProps.name || undefined}
            size={playgroundProps.size}
            shape={playgroundProps.shape}
            alt="Playground Avatar"
          />
        );
      case 'area-chart':
        return (
          <div style={{ width: '100%', height: 260, padding: '0 16px' }}>
            <AreaChart
              data={PLAYGROUND_AREA_DATA}
              xKey="index"
              yKey="value"
              curve={playgroundProps.curve}
              showGrid={playgroundProps.showGrid}
              showAxes={playgroundProps.showAxes}
              gradient={playgroundProps.gradient}
              interactive={playgroundProps.interactive}
              height={220}
            />
          </div>
        );
      case 'area-chart-missing':
        return (
          <div style={{ width: '100%', height: 260, padding: '0 16px' }}>
            <AreaChart
              data={PLAYGROUND_MISSING_DATA}
              xKey="index"
              yKey="value"
              curve={playgroundProps.curve}
              showGrid={playgroundProps.showGrid}
              showAxes={playgroundProps.showAxes}
              gradient={playgroundProps.gradient}
              interactive={playgroundProps.interactive}
              height={220}
            />
          </div>
        );
      case 'stacked-area-chart':
        return (
          <div style={{ width: '100%', height: 260, padding: '0 16px' }}>
            <StackedAreaChart
              data={PLAYGROUND_STACKED_DATA}
              xKey="index"
              yKeys={['A', 'B', 'C']}
              curve={playgroundProps.curve}
              showGrid={playgroundProps.showGrid}
              showAxes={playgroundProps.showAxes}
              interactive={playgroundProps.interactive}
              height={220}
            />
          </div>
        );
      case 'normalized-stacked-area-chart':
        return (
          <div style={{ width: '100%', height: 260, padding: '0 16px' }}>
            <StackedAreaChart
              data={PLAYGROUND_STACKED_DATA}
              xKey="index"
              yKeys={['A', 'B', 'C']}
              normalized={true}
              curve={playgroundProps.curve}
              showGrid={playgroundProps.showGrid}
              showAxes={playgroundProps.showAxes}
              interactive={playgroundProps.interactive}
              height={220}
            />
          </div>
        );
      case 'streamgraph':
        return (
          <div style={{ width: '100%', height: 260, padding: '0 16px' }}>
            <StackedAreaChart
              data={PLAYGROUND_STACKED_DATA}
              xKey="index"
              yKeys={['A', 'B', 'C']}
              stream={true}
              curve={playgroundProps.curve}
              showGrid={playgroundProps.showGrid}
              showAxes={playgroundProps.showAxes}
              interactive={playgroundProps.interactive}
              height={220}
            />
          </div>
        );
      case 'difference-chart':
        return (
          <div style={{ width: '100%', height: 260, padding: '0 16px' }}>
            <DifferenceChart
              data={PLAYGROUND_DIFFERENCE_DATA}
              xKey="index"
              y0Key="A"
              y1Key="B"
              y0Label="Series A"
              y1Label="Series B"
              curve={playgroundProps.curve}
              showGrid={playgroundProps.showGrid}
              showAxes={playgroundProps.showAxes}
              interactive={playgroundProps.interactive}
              height={220}
            />
          </div>
        );
      case 'bar-chart':
        return (
          <div style={{ width: '100%', height: 260, padding: '0 16px' }}>
            <BarChart
              data={PLAYGROUND_BAR_DATA}
              xKey="label"
              yKey="value"
              showGrid={playgroundProps.showGrid}
              showAxes={playgroundProps.showAxes}
              interactive={playgroundProps.interactive}
              color="var(--md-sys-color-primary)"
              height={220}
            />
          </div>
        );
      default:
        return null;
    }
  }, [id, playgroundProps]);

  // Generate code string dynamically for playground
  const generatedCode = useMemo(() => {
    if (!metadata.playgroundControls) return '';

    const propsStr = Object.entries(playgroundProps)
      .filter(([key, val]) => {
        // Find default value
        const ctrl = metadata.playgroundControls?.find(c => c.name === key);
        return ctrl ? ctrl.defaultValue !== val : true;
      })
      .map(([key, val]) => {
        if (typeof val === 'boolean') {
          return val ? key : `${key}={false}`;
        }
        if (typeof val === 'number') {
          return `${key}={${val}}`;
        }
        if (typeof val === 'string') {
          return val ? `${key}="${val}"` : '';
        }
        return '';
      })
      .filter(Boolean)
      .join(' ');

    const name = metadata.label;
    if (id === 'button') {
      return `<Button ${propsStr}>${playgroundProps.children}</Button>`;
    }
    if (id === 'card') {
      return `<Card ${propsStr}>\n  <CardContent>\n    <CardTitle>Title</CardTitle>\n    <CardBody>Body text</CardBody>\n  </CardContent>\n</Card>`;
    }
    if (id === 'badge') {
      return `<Badge ${propsStr}>\n  <IconButton icon="notifications" label="Notifications" />\n</Badge>`;
    }
    return `<${name} ${propsStr} />`;
  }, [id, playgroundProps, metadata]);

  // Launch StackBlitz
  const openStackBlitz = () => {
    const files = {
      'index.html': `<!DOCTYPE html>
<html>
<head>
  <title>MD3 Expressive Sandbox</title>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet">
</head>
<body>
  <div id="root"></div>
</body>
</html>`,
      'App.tsx': `import React from 'react';
import { ${metadata.label} } from '@hadi_gunawan/md3-expressive-ds';
import '@hadi_gunawan/md3-expressive-ds/style.css';

export default function App() {
  return (
    <div style={{ padding: 48, display: 'flex', justifyContent: 'center' }}>
      ${generatedCode || `<${metadata.label} />`}
    </div>
  );
}`,
      'index.tsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);`,
      'package.json': `{
  "name": "md3-expressive-sandbox",
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@hadi_gunawan/md3-expressive-ds": "latest"
  }
}`
    };

    // Create form to POST files to stackblitz
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://stackblitz.com/run';
    form.target = '_blank';

    Object.entries(files).forEach(([name, content]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = `project[files][${name}]`;
      input.value = content;
      form.appendChild(input);
    });

    const titleInput = document.createElement('input');
    titleInput.type = 'hidden';
    titleInput.name = 'project[title]';
    titleInput.value = `MD3 Expressive - ${metadata.label}`;
    form.appendChild(titleInput);

    const descInput = document.createElement('input');
    descInput.type = 'hidden';
    descInput.name = 'project[description]';
    descInput.value = `Live sandbox playground for ${metadata.label} component`;
    form.appendChild(descInput);

    const templateInput = document.createElement('input');
    templateInput.type = 'hidden';
    templateInput.name = 'project[template]';
    templateInput.value = 'create-react-app';
    form.appendChild(templateInput);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  // Status Colors
  const statusBadge = (
    <span className={cn(
      styles.statusBadge,
      metadata.status === 'stable' && styles.stable,
      metadata.status === 'beta' && styles.beta,
      metadata.status === 'experimental' && styles.experimental
    )}>
      {metadata.status}
    </span>
  );

  return (
    <div className={cn(styles.viewerRoot, fullscreen && styles.fullscreenActive)}>
      <header className={styles.viewHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <h1 className={styles.viewTitle}>{metadata.label}</h1>
          {statusBadge}
        </div>
        <p className={styles.viewDesc}>{metadata.description}</p>
      </header>

      {/* Interactive Toolbars */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarGroup}>
          <button
            type="button"
            className={cn(styles.toolBtn, rtl && styles.toolBtnActive)}
            onClick={() => setRtl(p => !p)}
            title="Toggle RTL Direction"
          >
            <Icon name="format_textdirection_r_to_l" size={20} />
            RTL
          </button>

          <button
            type="button"
            className={cn(styles.toolBtn, isMobileFrame && styles.toolBtnActive)}
            onClick={() => setIsMobileFrame(p => !p)}
            title="Toggle Mobile Screen Mockup"
          >
            <Icon name="phone_iphone" size={20} />
            Mobile Frame
          </button>

          <button
            type="button"
            className={cn(styles.toolBtn, showAnnotations && styles.toolBtnActive)}
            onClick={() => setShowAnnotations(p => !p)}
            title="Toggle Token Annotations Overlay"
          >
            <Icon name="label" size={20} />
            Show Tokens
          </button>
        </div>

        <div className={styles.toolbarGroup}>
          <div className={styles.zoomControl}>
            <button type="button" className={styles.zoomBtn} onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}>
              <Icon name="remove" size={16} />
            </button>
            <span style={{ font: 'var(--md-sys-typescale-label-medium)', width: 36, textAlign: 'center' }}>
              {Math.round(zoom * 100)}%
            </span>
            <button type="button" className={styles.zoomBtn} onClick={() => setZoom(z => Math.min(2, z + 0.1))}>
              <Icon name="add" size={16} />
            </button>
            <button type="button" className={styles.zoomBtn} onClick={() => setZoom(1)} title="Reset zoom">
              <Icon name="refresh" size={16} />
            </button>
          </div>

          <button
            type="button"
            className={styles.toolBtn}
            onClick={() => setFullscreen(p => !p)}
            title="Fullscreen Modal View"
          >
            <Icon name={fullscreen ? 'fullscreen_exit' : 'fullscreen'} size={20} />
          </button>

          <button
            type="button"
            className={styles.toolBtn}
            onClick={openStackBlitz}
            title="Launch Sandbox on StackBlitz"
          >
            <Icon name="bolt" size={20} />
            Sandbox
          </button>

          <button
            type="button"
            className={styles.toolBtn}
            onClick={() => window.print()}
            title="Print Page"
          >
            <Icon name="print" size={20} />
          </button>
        </div>
      </div>

      {/* Main Grid: Playground & Controls */}
      {metadata.playgroundControls && (
        <div className={styles.playgroundGrid}>
          {/* Live Preview Display Box */}
          <div className={cn(styles.previewWrapper, showAnnotations && styles.annotated)}>
            <div
              className={cn(styles.previewBox, isMobileFrame && styles.mobileFrameStyle)}
              dir={rtl ? 'rtl' : 'ltr'}
            >
              <div
                className={styles.scalingContainer}
                style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
              >
                {livePreview}

                {/* Simulated Annotations Overlays when hover occurs */}
                {showAnnotations && (
                  <div className={styles.annotationsOverlay}>
                    <div className={styles.tokenTag}>--md-sys-color-primary</div>
                    <div className={styles.tokenTag}>--md-sys-shape-corner-full</div>
                    <div className={styles.tokenTag}>--md-sys-motion-duration-short3</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Configuration Parameters Panel */}
          <div className={styles.controlsPanel}>
            <div className={styles.panelTitle}>Configuration</div>
            <div className={styles.controlsList}>
              {metadata.playgroundControls.map(c => (
                <div key={c.name} className={styles.controlRow}>
                  <label className={styles.controlLabel}>{c.label}</label>

                  {c.type === 'boolean' && (
                    <Switch
                      checked={!!playgroundProps[c.name]}
                      onChange={(e) => handlePropChange(c.name, e.target.checked)}
                    />
                  )}

                  {c.type === 'text' && (
                    <TextField
                      value={playgroundProps[c.name] || ''}
                      onChange={(e) => handlePropChange(c.name, e.target.value)}
                      label=""
                    />
                  )}

                  {c.type === 'number' && (
                    <input
                      type="number"
                      className={styles.numberInput}
                      value={playgroundProps[c.name] ?? 0}
                      onChange={(e) => handlePropChange(c.name, Number(e.target.value))}
                    />
                  )}

                  {c.type === 'select' && c.options && (
                    <select
                      className={styles.selectInput}
                      value={playgroundProps[c.name] || ''}
                      onChange={(e) => handlePropChange(c.name, e.target.value)}
                    >
                      {c.options.map(opt => (
                        <option key={opt} value={opt}>
                          {opt || '(none)'}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>

            {/* Generated Code Block */}
            {generatedCode && (
              <div style={{ marginTop: 16 }}>
                <CodeBlock code={generatedCode} language="jsx" showLineNumbers />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Visual Showcases (original page content) */}
      <div className={styles.showcaseSection}>
        <div className={styles.sectionDivider}>
          <span>Visual Variants Showcase</span>
        </div>
        {children}
      </div>

      {/* Props Table */}
      <section className={styles.tableSection}>
        <h3 className={styles.sectionHeading}>
          <Icon name="view_list" size={24} /> API Specifications (Props)
        </h3>
        <div className={styles.tableCard}>
          <table className={styles.propTable}>
            <thead>
              <tr>
                <th>Property</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {metadata.props.map(prop => (
                <tr key={prop.name}>
                  <td><code className={styles.codeName}>{prop.name}</code></td>
                  <td><code className={styles.codeType}>{prop.type}</code></td>
                  <td><code>{prop.default}</code></td>
                  <td>{prop.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Do's & Don'ts */}
      {metadata.doDonts && metadata.doDonts.length > 0 && (
        <section className={styles.dodontSection}>
          <h3 className={styles.sectionHeading}>
            <Icon name="fact_check" size={24} /> Design & Usage Guidelines
          </h3>
          <div className={styles.dodontGrid}>
            <div className={cn(styles.guidelineCard, styles.doCard)}>
              <div className={styles.cardHeader}>
                <Icon name="check_circle" size={20} /> DO
              </div>
              <ul>
                {metadata.doDonts.map((item, idx) => (
                  <li key={idx}>{item.do}</li>
                ))}
              </ul>
            </div>
            <div className={cn(styles.guidelineCard, styles.dontCard)}>
              <div className={styles.cardHeader}>
                <Icon name="cancel" size={20} /> DON'T
              </div>
              <ul>
                {metadata.doDonts.map((item, idx) => (
                  <li key={idx}>{item.dont}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Accessibility & Keyboard shortcuts */}
      <section className={styles.a11ySection}>
        <h3 className={styles.sectionHeading}>
          <Icon name="accessibility" size={24} /> Accessibility (A11y)
        </h3>
        <div className={styles.a11yGrid}>
          {/* Keyboard mapping */}
          <div className={styles.a11yCard}>
            <h4 className={styles.a11yHeader}>Keyboard Interaction</h4>
            {metadata.keyboard.length > 0 ? (
              <table className={styles.a11yTable}>
                <thead>
                  <tr>
                    <th>Key</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {metadata.keyboard.map((kb, idx) => (
                    <tr key={idx}>
                      <td><kbd className={styles.kbd}>{kb.key}</kbd></td>
                      <td>{kb.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className={styles.a11yEmpty}>No custom keyboard hotkeys required for visual layout.</p>
            )}
          </div>

          {/* ARIA mappings */}
          <div className={styles.a11yCard}>
            <h4 className={styles.a11yHeader}>WAI-ARIA Attributes</h4>
            {metadata.aria.length > 0 ? (
              <table className={styles.a11yTable}>
                <thead>
                  <tr>
                    <th>Attribute</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {metadata.aria.map((ar, idx) => (
                    <tr key={idx}>
                      <td><code>{ar.name}</code></td>
                      <td>{ar.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className={styles.a11yEmpty}>Standard HTML markup with implicit accessibility semantics.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
