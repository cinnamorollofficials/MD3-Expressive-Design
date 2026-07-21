import { ReactNode, useEffect, useState, useMemo } from 'react';
import { getComponentMetadata, ComponentMetadata } from '../metadata/componentsRegistry';
import { Icon } from '../../lib/components/Icon';
import { cn } from '../../lib/utils/cn';
import {
  Button, IconButton, FAB, Card, CardContent, CardTitle, CardBody,
  Switch, Checkbox, TextField, Slider, Badge, Avatar,
  AreaChart, StackedAreaChart, DifferenceChart, BarChart, HorizontalBarChart, DivergingBarChart, StackedBarChart, TimelineChart, CalendarChart, ForceDirectedGraph, DisjointForceDirectedGraph, DirectedForceGraph, ArcDiagram
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

const PLAYGROUND_HBAR_DATA = [
  { country: 'India', value: 1428.6 },
  { country: 'China', value: 1425.7 },
  { country: 'USA', value: 339.0 },
  { country: 'Indonesia', value: 277.5 },
  { country: 'Pakistan', value: 240.5 },
  { country: 'Brazil', value: 215.3 },
];

const PLAYGROUND_DIVERGING_DATA = [
  { state: 'Puerto Rico',   change: -532045 },
  { state: 'Illinois',      change: -158011 },
  { state: 'Connecticut',   change: -60928 },
  { state: 'Kansas',        change: -61196 },
  { state: 'Hawaii',        change: +55571 },
  { state: 'New York',      change: +75428 },
  { state: 'Pennsylvania',  change: +99010 },
  { state: 'Ohio',          change: +152394 },
  { state: 'Florida',       change: +2679427 },
  { state: 'Texas',         change: +3999935 },
];

const PLAYGROUND_STACKED_BAR_DATA = [
  { month: 'Jan', Chrome: 65, Safari: 18, Firefox: 8, Edge: 5, Other: 4 },
  { month: 'Feb', Chrome: 66, Safari: 17, Firefox: 9, Edge: 5, Other: 3 },
  { month: 'Mar', Chrome: 64, Safari: 19, Firefox: 8, Edge: 6, Other: 3 },
  { month: 'Apr', Chrome: 65, Safari: 18, Firefox: 8, Edge: 6, Other: 3 },
  { month: 'May', Chrome: 67, Safari: 17, Firefox: 7, Edge: 6, Other: 3 },
];

const PLAYGROUND_TIMELINE_DATA = [
  { id: 'meso', name: 'Mesopotamia', start: -3500, end: -500, region: 'Near East' },
  { id: 'egypt', name: 'Egypt', start: -3100, end: -30, region: 'Mediterranean' },
  { id: 'indus', name: 'Indus Valley', start: -2500, end: -1700, region: 'South Asia' },
  { id: 'china', name: 'Ancient China', start: -2000, end: 1900, region: 'East Asia' },
  { id: 'rome', name: 'Rome', start: -500, end: 500, region: 'Mediterranean' },
];

const generatePlaygroundCalendar = () => {
  const data = [];
  const year = 2020;
  for (let month = 0; month < 3; month++) {
    for (let day = 1; day <= 28; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const pseudoRand = Math.sin(month * 10 + day) * 0.05;
      data.push({ date: dateStr, value: pseudoRand });
    }
  }
  return data;
};
const PLAYGROUND_CALENDAR_DATA = generatePlaygroundCalendar();

const PLAYGROUND_NETWORK_DATA = {
  nodes: [
    { id: '1', label: 'Alpha', group: 1, val: 12 },
    { id: '2', label: 'Beta', group: 1, val: 8 },
    { id: '3', label: 'Gamma', group: 1, val: 15 },
    { id: '4', label: 'Delta', group: 2, val: 10 },
    { id: '5', label: 'Epsilon', group: 2, val: 6 },
    { id: '6', label: 'Zeta', group: 2, val: 9 },
    { id: '7', label: 'Eta', group: 3, val: 14 },
    { id: '8', label: 'Theta', group: 3, val: 11 },
  ],
  links: [
    { source: '1', target: '2', value: 3 },
    { source: '1', target: '3', value: 5 },
    { source: '2', target: '3', value: 4 },
    { source: '3', target: '4', value: 2 },
    { source: '4', target: '5', value: 3 },
    { source: '4', target: '6', value: 4 },
    { source: '5', target: '6', value: 2 },
    { source: '3', target: '7', value: 3 },
    { source: '7', target: '8', value: 5 },
  ],
};


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
      case 'horizontal-bar-chart':
        return (
          <div style={{ width: '100%', height: 260, padding: '0 16px' }}>
            <HorizontalBarChart
              data={PLAYGROUND_HBAR_DATA}
              yKey="country"
              xKey="value"
              showGrid={playgroundProps.showGrid}
              showAxes={playgroundProps.showAxes}
              showValueLabels={playgroundProps.showValueLabels}
              interactive={playgroundProps.interactive}
              color="var(--md-sys-color-primary)"
              xFormatter={(v) => `${v}M`}
              height={220}
            />
          </div>
        );
      case 'diverging-bar-chart':
        return (
          <div style={{ width: '100%', height: 320, padding: '0 16px' }}>
            <DivergingBarChart
              data={PLAYGROUND_DIVERGING_DATA}
              yKey="state"
              xKey="change"
              showGrid={playgroundProps.showGrid}
              showAxes={playgroundProps.showAxes}
              showValueLabels={playgroundProps.showValueLabels}
              interactive={playgroundProps.interactive}
              xFormatter={(val) => {
                const k = Math.round(Math.abs(val) / 1000);
                return val >= 0 ? `+${k}K` : `-${k}K`;
              }}
              legendLabels={['Gain', 'Loss']}
              height={300}
            />
          </div>
        );
      case 'stacked-bar-chart':
        return (
          <div style={{ width: '100%', height: 280, padding: '0 16px' }}>
            <StackedBarChart
              data={PLAYGROUND_STACKED_BAR_DATA}
              categoryKey="month"
              keys={['Chrome', 'Safari', 'Firefox', 'Edge', 'Other']}
              horizontal={playgroundProps.horizontal}
              showGrid={playgroundProps.showGrid}
              showAxes={playgroundProps.showAxes}
              interactive={playgroundProps.interactive}
              height={240}
            />
          </div>
        );
      case 'normalized-stacked-bar-chart':
        return (
          <div style={{ width: '100%', height: 280, padding: '0 16px' }}>
            <StackedBarChart
              data={PLAYGROUND_STACKED_BAR_DATA}
              categoryKey="month"
              keys={['Chrome', 'Safari', 'Firefox', 'Edge', 'Other']}
              normalized={true}
              horizontal={playgroundProps.horizontal}
              showGrid={playgroundProps.showGrid}
              showAxes={playgroundProps.showAxes}
              interactive={playgroundProps.interactive}
              height={240}
            />
          </div>
        );
      case 'timeline-chart':
        return (
          <div style={{ width: '100%', height: 280, padding: '0 16px' }}>
            <TimelineChart
              data={PLAYGROUND_TIMELINE_DATA}
              idKey="id"
              labelKey="name"
              startKey="start"
              endKey="end"
              categoryKey="region"
              showGrid={playgroundProps.showGrid}
              showAxes={playgroundProps.showAxes}
              interactive={playgroundProps.interactive}
              height={240}
            />
          </div>
        );
      case 'calendar-chart':
        return (
          <div style={{ width: '100%', height: 160, padding: '0 16px' }}>
            <CalendarChart
              data={PLAYGROUND_CALENDAR_DATA}
              dateKey="date"
              valueKey="value"
              weekdaysOnly={playgroundProps.weekdaysOnly}
              interactive={playgroundProps.interactive}
              cellSize={12}
            />
          </div>
        );
      case 'force-directed-graph':
        return (
          <div style={{ width: '100%', padding: '0 16px' }}>
            <ForceDirectedGraph
              nodes={PLAYGROUND_NETWORK_DATA.nodes}
              links={PLAYGROUND_NETWORK_DATA.links}
              showLabels={playgroundProps.showLabels}
              showLegend={playgroundProps.showLegend}
              draggable={playgroundProps.draggable}
              zoomable={playgroundProps.zoomable}
              interactive={playgroundProps.interactive}
              height={320}
            />
          </div>
        );
      case 'disjoint-force-directed-graph':
        return (
          <div style={{ width: '100%', padding: '0 16px' }}>
            <DisjointForceDirectedGraph
              nodes={PLAYGROUND_NETWORK_DATA.nodes}
              links={PLAYGROUND_NETWORK_DATA.links}
              showLabels={playgroundProps.showLabels}
              showLegend={playgroundProps.showLegend}
              draggable={playgroundProps.draggable}
              zoomable={playgroundProps.zoomable}
              interactive={playgroundProps.interactive}
              height={320}
            />
          </div>
        );
      case 'mobile-patent-suits':
        return (
          <div style={{ width: '100%', padding: '0 16px' }}>
            <DirectedForceGraph
              nodes={PLAYGROUND_NETWORK_DATA.nodes}
              links={PLAYGROUND_NETWORK_DATA.links.map((l) => ({ ...l, type: Number(l.source) % 2 === 0 ? 'suit' : 'licensing' }))}
              showLabels={playgroundProps.showLabels}
              showLegend={playgroundProps.showLegend}
              draggable={playgroundProps.draggable}
              zoomable={playgroundProps.zoomable}
              interactive={playgroundProps.interactive}
              height={320}
            />
          </div>
        );
      case 'arc-diagram':
        return (
          <div style={{ width: '100%', padding: '0 16px' }}>
            <ArcDiagram
              nodes={PLAYGROUND_NETWORK_DATA.nodes}
              links={PLAYGROUND_NETWORK_DATA.links}
              showLabels={playgroundProps.showLabels}
              showLegend={playgroundProps.showLegend}
              interactive={playgroundProps.interactive}
              height={360}
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
