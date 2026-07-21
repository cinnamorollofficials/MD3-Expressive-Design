import { useState } from 'react';
import { AreaChart, Card, CardContent, Button, SegmentedButton } from '../../lib';
import { DemoSection, PageTitle } from '../components/DemoSection';

// Sample datasets
const ANALYTICS_DATA = [
  { date: '2026-07-10', pageViews: 1200, users: 450, bounceRate: 42 },
  { date: '2026-07-11', pageViews: 1450, users: 510, bounceRate: 38 },
  { date: '2026-07-12', pageViews: 1100, users: 390, bounceRate: 45 },
  { date: '2026-07-13', pageViews: 1900, users: 720, bounceRate: 35 },
  { date: '2026-07-14', pageViews: 2400, users: 950, bounceRate: 30 },
  { date: '2026-07-15', pageViews: 2100, users: 800, bounceRate: 33 },
  { date: '2026-07-16', pageViews: 2800, users: 1100, bounceRate: 28 },
  { date: '2026-07-17', pageViews: 3200, users: 1250, bounceRate: 25 },
  { date: '2026-07-18', pageViews: 1500, users: 600, bounceRate: 40 },
  { date: '2026-07-19', pageViews: 1350, users: 550, bounceRate: 41 },
  { date: '2026-07-20', pageViews: 2600, users: 1050, bounceRate: 29 },
  { date: '2026-07-21', pageViews: 3500, users: 1400, bounceRate: 24 },
];

const CRYPTO_DATA = [
  { index: 1, price: 42100 },
  { index: 2, price: 42400 },
  { index: 3, price: 41900 },
  { index: 4, price: 42800 },
  { index: 5, price: 43500 },
  { index: 6, price: 43100 },
  { index: 7, price: 44200 },
  { index: 8, price: 44900 },
  { index: 9, price: 44600 },
  { index: 10, price: 45800 },
  { index: 11, price: 45100 },
  { index: 12, price: 46500 },
];

const MISSING_DATA = [
  { time: '10:00', signal: 75 },
  { time: '10:05', signal: 80 },
  { time: '10:10', signal: null },
  { time: '10:15', signal: null },
  { time: '10:20', signal: 90 },
  { time: '10:25', signal: 85 },
  { time: '10:30', signal: 60 },
  { time: '10:35', signal: null },
  { time: '10:40', signal: 70 },
  { time: '10:45', signal: 95 },
  { time: '10:50', signal: 90 },
];

export function ChartsPage({ activeComponent }: { activeComponent?: string }) {
  const [selectedMetric, setSelectedMetric] = useState('pageViews');
  const [curveType, setCurveType] = useState<'linear' | 'monotone' | 'step'>('monotone');
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);

  const showAll = !activeComponent;

  // Formatting helper
  const currencyFormatter = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const numberFormatter = (val: number) => {
    return new Intl.NumberFormat('en-US').format(val);
  };

  const dateFormatter = (val: any) => {
    if (val instanceof Date) {
      return val.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return String(val);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <PageTitle 
        title="Charts" 
        subtitle="Expressive data visualizations using SVG rendering backed by D3 mathematical mapping." 
      />

      {(showAll || activeComponent === 'area-chart') && (
        <>
          {/* Section 1: Standard Area Chart */}
          <DemoSection
            title="Area Chart"
            description="Area charts display progress or trends over a continuous domain, filled with a smooth color gradient. Fully dynamic and adapts to design system light/dark theme shifts."
            code={`import { AreaChart } from '@hadi_gunawan/md3-expressive-ds';

const data = [
  { date: '2026-07-10', pageViews: 1200 },
  { date: '2026-07-11', pageViews: 1450 },
  // ...
];

<AreaChart
  data={data}
  xKey="date"
  yKey="pageViews"
  title="Website Traffic Analytics"
  subtitle="Daily page views trend"
/>`}
          >
            <div style={{ width: '100%' }}>
              <Card variant="outlined" style={{ padding: 16 }}>
                <CardContent>
                  <AreaChart
                    data={ANALYTICS_DATA}
                    xKey="date"
                    yKey="pageViews"
                    title="Website Traffic Analytics"
                    subtitle="Daily page views trend over the last 12 days"
                    xFormatter={dateFormatter}
                    yFormatter={numberFormatter}
                  />
                </CardContent>
              </Card>
            </div>
          </DemoSection>

          {/* Section 2: Interactive Controls & Interpolation */}
          <DemoSection
            title="Interactive Customizations"
            description="Toggle axis visibility, grid overlays, curve interpolation types (linear, step, spline monotone), and select between different data metrics."
            code={`<AreaChart
  data={analyticsData}
  xKey="date"
  yKey="${selectedMetric}"
  curve="${curveType}"
  showGrid={${showGrid}}
  showAxes={${showAxes}}
  color="var(--md-sys-color-secondary)"
/>`}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
              {/* Interactive Toolbar */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--md-sys-color-on-surface-variant)' }}>Metric</span>
                  <SegmentedButton
                    value={selectedMetric}
                    onChange={(val) => setSelectedMetric(val as string)}
                    options={[
                      { value: 'pageViews', label: 'Page Views' },
                      { value: 'users', label: 'Unique Users' },
                      { value: 'bounceRate', label: 'Bounce Rate (%)' },
                    ]}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--md-sys-color-on-surface-variant)' }}>Interpolation</span>
                  <SegmentedButton
                    value={curveType}
                    onChange={(val) => setCurveType(val as any)}
                    options={[
                      { value: 'monotone', label: 'Spline (Smooth)' },
                      { value: 'linear', label: 'Linear' },
                      { value: 'step', label: 'Step' },
                    ]}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--md-sys-color-on-surface-variant)' }}>Options</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button 
                      variant={showGrid ? 'filled' : 'outlined'} 
                      onClick={() => setShowGrid(prev => !prev)}
                      size="sm"
                    >
                      {showGrid ? 'Hide Grid' : 'Show Grid'}
                    </Button>
                    <Button 
                      variant={showAxes ? 'filled' : 'outlined'} 
                      onClick={() => setShowAxes(prev => !prev)}
                      size="sm"
                    >
                      {showAxes ? 'Hide Axes' : 'Show Axes'}
                    </Button>
                  </div>
                </div>
              </div>

              <Card variant="filled" style={{ padding: 16 }}>
                <CardContent>
                  <AreaChart
                    data={ANALYTICS_DATA}
                    xKey="date"
                    yKey={selectedMetric}
                    curve={curveType}
                    showGrid={showGrid}
                    showAxes={showAxes}
                    color="var(--md-sys-color-secondary)"
                    title={`Analytics Trend — ${selectedMetric === 'pageViews' ? 'Page Views' : selectedMetric === 'users' ? 'Unique Users' : 'Bounce Rate'}`}
                    subtitle="Interactive configuration showcase"
                    xFormatter={dateFormatter}
                    yFormatter={selectedMetric === 'bounceRate' ? (v) => `${v}%` : numberFormatter}
                  />
                </CardContent>
              </Card>
            </div>
          </DemoSection>

          {/* Section 3: Rich Styled Numeric & Tooltip Formatting */}
          <DemoSection
            title="Custom Formatting & Alternative Color Tones"
            description="D3 Area Charts can render linear domains (e.g. numeric index x-axis) and adapt layout properties. Below, the chart uses custom colors (tertiary scheme) and formats tooltip content to represent currency amounts."
            code={`<AreaChart
  data={cryptoData}
  xKey="index"
  yKey="price"
  color="var(--md-sys-color-tertiary)"
  yFormatter={(val) => currencyFormatter(val)}
  tooltipFormatter={(point) => ({
    label: \`Sequence #\${point.index}\`,
    value: \`\${currencyFormatter(point.price)} USD\`
  })}
/>`}
          >
            <div style={{ width: '100%' }}>
              <Card variant="outlined" style={{ padding: 16 }}>
                <CardContent>
                  <AreaChart
                    data={CRYPTO_DATA}
                    xKey="index"
                    yKey="price"
                    color="var(--md-sys-color-tertiary)"
                    title="Asset Price Evolution"
                    subtitle="Sample values tracked over a numeric sequence"
                    xFormatter={(val) => `Seq #${val}`}
                    yFormatter={currencyFormatter}
                    tooltipFormatter={(point) => ({
                      label: `Transaction Sequence #${point.index}`,
                      value: `Price: ${currencyFormatter(point.price)}`,
                    })}
                  />
                </CardContent>
              </Card>
            </div>
          </DemoSection>
        </>
      )}

      {(showAll || activeComponent === 'area-chart-missing') && (
        <DemoSection
          title="Area with Missing Data"
          description="Missing or undefined data points (e.g. null, undefined, or NaN) are handled gracefully by breaking both the outline stroke and the gradient area fill. Hover tracking lines and tooltip labels are automatically skipped for missing values."
          code={`const signalData = [
  { time: '10:00', signal: 75 },
  { time: '10:05', signal: 80 },
  { time: '10:10', signal: null }, // missing
  { time: '10:15', signal: null }, // missing
  { time: '10:20', signal: 90 },
  // ...
];

<AreaChart
  data={signalData}
  xKey="time"
  yKey="signal"
  color="var(--md-sys-color-error)"
  title="Network Signal Performance"
  subtitle="Gaps represent periods of connection loss"
/>`}
        >
          <div style={{ width: '100%' }}>
            <Card variant="outlined" style={{ padding: 16 }}>
              <CardContent>
                <AreaChart
                  data={MISSING_DATA}
                  xKey="time"
                  yKey="signal"
                  color="var(--md-sys-color-error)"
                  title="Network Signal Performance"
                  subtitle="Gaps represent periods of connection loss (null values)"
                  yFormatter={(val) => `${val} dBm`}
                />
              </CardContent>
            </Card>
          </div>
        </DemoSection>
      )}
    </div>
  );
}
