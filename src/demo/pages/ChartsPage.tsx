import { useState } from 'react';
import { AreaChart, StackedAreaChart, DifferenceChart, BarChart, Card, CardContent, Button, SegmentedButton } from '../../lib';
import { DemoSection, PageTitle } from '../components/DemoSection';

// Sample datasets
const BROWSER_SHARE_DATA = [
  { month: 'Jan', Chrome: 65, Safari: 18, Firefox: 8, Edge: 5, Other: 4 },
  { month: 'Feb', Chrome: 66, Safari: 17, Firefox: 9, Edge: 5, Other: 3 },
  { month: 'Mar', Chrome: 64, Safari: 19, Firefox: 8, Edge: 6, Other: 3 },
  { month: 'Apr', Chrome: 65, Safari: 18, Firefox: 8, Edge: 6, Other: 3 },
  { month: 'May', Chrome: 67, Safari: 17, Firefox: 7, Edge: 6, Other: 3 },
  { month: 'Jun', Chrome: 68, Safari: 16, Firefox: 7, Edge: 6, Other: 3 },
  { month: 'Jul', Chrome: 66, Safari: 18, Firefox: 7, Edge: 6, Other: 3 },
];

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

const UNEMPLOYED_INDUSTRIES = [
  'Retail',
  'Manufacturing',
  'Services',
  'Construction',
  'Finance',
  'Education',
  'Government',
  'Agriculture',
  'Other'
];

const UNEMPLOYED_COLORS = [
  '#4eb3a9', // teal
  '#5985ab', // steel blue
  '#91735d', // greyish brown
  '#4671a3', // royal blue
  '#f09438', // orange
  '#a37aa3', // purple
  '#e3be58', // yellow
  '#d65a60', // red
  '#5aa663'  // green
];

const generateUnemploymentData = () => {
  const data = [];
  const startYear = 2000;
  const endYear = 2010;

  for (let year = startYear; year <= endYear; year++) {
    const months = year === endYear ? 1 : 12;
    for (let month = 0; month < months; month++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      const t = ((year - startYear) * 12 + month) / (10 * 12);
      
      // Mimic growing baseline + spike at 2008 recession (around t=0.8) with higher density waves
      const base = 5000 + Math.sin(t * Math.PI * 18) * 800 + Math.sin(t * Math.PI * 48) * 200 + (t > 0.8 ? (t - 0.8) * 16000 : 0);
      
      const row: any = { date: dateStr };
      let sum = 0;
      
      UNEMPLOYED_INDUSTRIES.forEach((ind, idx) => {
        const phase = (idx / UNEMPLOYED_INDUSTRIES.length) * Math.PI * 2;
        // Denser oscillation for each industry category
        const share = 0.11 + 0.06 * Math.sin(t * Math.PI * 22 + phase) + 0.02 * Math.cos(t * Math.PI * 44 - phase);
        row[ind] = Math.round(base * share);
        sum += row[ind];
      });
      
      row[UNEMPLOYED_INDUSTRIES[UNEMPLOYED_INDUSTRIES.length - 1]] += Math.max(0, Math.round(base - sum));
      
      data.push(row);
    }
  }
  return data;
};

const UNEMPLOYMENT_DATA = generateUnemploymentData();

const generateDifferenceData = () => {
  const data = [];
  const startDate = new Date('2011-10-01');
  const days = 365;
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const t = i / days;
    
    // SF: relatively flat, minor variations, around 55F
    const sf = 55 + Math.sin(t * Math.PI * 8) * 3 + Math.random() * 2;
    
    // NY: highly seasonal, peaks in July (t=0.8), troughs in Jan (t=0.3)
    const nyBase = 53 - Math.cos((t - 0.05) * Math.PI * 2) * 20;
    const ny = nyBase + Math.sin(t * Math.PI * 50) * 1.5 + Math.random() * 3;
    
    data.push({
      date: dateStr,
      SF: Math.round(sf * 10) / 10,
      NY: Math.round(ny * 10) / 10,
    });
  }
  return data;
};

const DIFFERENCE_DATA = generateDifferenceData();

// Letter frequency data matching the official D3 bar chart example
const LETTER_FREQUENCY_DATA = [
  { letter: 'E', frequency: 12.702 },
  { letter: 'T', frequency: 9.056 },
  { letter: 'A', frequency: 8.167 },
  { letter: 'O', frequency: 7.507 },
  { letter: 'I', frequency: 6.966 },
  { letter: 'N', frequency: 6.749 },
  { letter: 'S', frequency: 6.327 },
  { letter: 'H', frequency: 6.094 },
  { letter: 'R', frequency: 5.987 },
  { letter: 'D', frequency: 4.253 },
  { letter: 'L', frequency: 4.025 },
  { letter: 'C', frequency: 2.782 },
  { letter: 'U', frequency: 2.758 },
  { letter: 'M', frequency: 2.406 },
  { letter: 'W', frequency: 2.360 },
  { letter: 'F', frequency: 2.228 },
  { letter: 'G', frequency: 2.015 },
  { letter: 'Y', frequency: 1.974 },
  { letter: 'P', frequency: 1.929 },
  { letter: 'B', frequency: 1.492 },
  { letter: 'V', frequency: 0.978 },
  { letter: 'K', frequency: 0.772 },
  { letter: 'J', frequency: 0.153 },
  { letter: 'X', frequency: 0.150 },
  { letter: 'Q', frequency: 0.095 },
  { letter: 'Z', frequency: 0.074 },
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

      {(showAll || activeComponent === 'stacked-area-chart') && (
        <DemoSection
          title="Stacked Area Chart"
          description="Stacked area charts show the relationship of individual series to the total cumulative value over time. They are ideal for displaying proportion changes over time."
          code={`import { StackedAreaChart } from '@hadi_gunawan/md3-expressive-ds';

const browserData = [
  { month: 'Jan', Chrome: 65, Safari: 18, Firefox: 8, Edge: 5, Other: 4 },
  { month: 'Feb', Chrome: 66, Safari: 17, Firefox: 9, Edge: 5, Other: 3 },
  // ...
];

<StackedAreaChart
  data={browserData}
  xKey="month"
  yKeys={['Chrome', 'Safari', 'Firefox', 'Edge', 'Other']}
  title="Browser Market Share Evolution"
  subtitle="Proportional browser choice tracking"
  yFormatter={(val) => \`\${val}%\`}
/>`}
        >
          <div style={{ width: '100%' }}>
            <Card variant="outlined" style={{ padding: 16 }}>
              <CardContent>
                <StackedAreaChart
                  data={BROWSER_SHARE_DATA}
                  xKey="month"
                  yKeys={['Chrome', 'Safari', 'Firefox', 'Edge', 'Other']}
                  title="Browser Market Share Evolution"
                  subtitle="Stacked tracking of market share percentages"
                  yFormatter={(val) => `${val}%`}
                />
              </CardContent>
            </Card>
          </div>
        </DemoSection>
      )}

      {(showAll || activeComponent === 'normalized-stacked-area-chart') && (
        <DemoSection
          title="Normalized Stacked Area Chart (100% Stacked)"
          description="Normalized stacked area charts scale each category as a percentage of the total for that point, summing to 100%. They are ideal for showing proportional changes over time rather than absolute values."
          code={`import { StackedAreaChart } from '@hadi_gunawan/md3-expressive-ds';

const browserData = [
  { month: 'Jan', Chrome: 65, Safari: 18, Firefox: 8, Edge: 5, Other: 4 },
  { month: 'Feb', Chrome: 66, Safari: 17, Firefox: 9, Edge: 5, Other: 3 },
  // ...
];

<StackedAreaChart
  data={browserData}
  xKey="month"
  yKeys={['Chrome', 'Safari', 'Firefox', 'Edge', 'Other']}
  normalized={true}
  title="Browser Proportional Share"
  subtitle="Normalized to 100% stacked layout"
/>`}
        >
          <div style={{ width: '100%' }}>
            <Card variant="outlined" style={{ padding: 16 }}>
              <CardContent>
                <StackedAreaChart
                  data={BROWSER_SHARE_DATA}
                  xKey="month"
                  yKeys={['Chrome', 'Safari', 'Firefox', 'Edge', 'Other']}
                  normalized={true}
                  title="Browser Proportional Share (100% Stacked)"
                  subtitle="Normalized stacked tracking showing proportional composition"
                />
              </CardContent>
            </Card>
          </div>
        </DemoSection>
      )}

      {(showAll || activeComponent === 'streamgraph') && (
        <DemoSection
          title="Streamgraph"
          description="Streamgraphs are a type of stacked area chart displaced around a central axis, resulting in flowing, organic waves. They are ideal for visualizing transaction volume changes or organic metric trends over time."
          code={`import { StackedAreaChart } from '@hadi_gunawan/md3-expressive-ds';

// Industries: 'Retail', 'Manufacturing', 'Services', 'Construction', 'Finance', 'Education', 'Government', 'Agriculture', 'Other'
<StackedAreaChart
  data={unemploymentData}
  xKey="date"
  yKeys={industriesList}
  colors={customColors}
  stream={true}
  title="Unemployed Persons by Industry"
  subtitle="Central axis wiggle offset showing industry composition (2000-2010)"
/>`}
        >
          <div style={{ width: '100%' }}>
            <Card variant="outlined" style={{ padding: 16 }}>
              <CardContent>
                <StackedAreaChart
                  data={UNEMPLOYMENT_DATA}
                  xKey="date"
                  yKeys={UNEMPLOYED_INDUSTRIES}
                  colors={UNEMPLOYED_COLORS}
                  stream={true}
                  xFormatter={(val) => String(new Date(val).getFullYear())}
                  title="Unemployed Persons by Industry"
                  subtitle="Simulation matching the official D3.js Streamgraph layout (2000 - 2010)"
                />
              </CardContent>
            </Card>
          </div>
        </DemoSection>
      )}

      {(showAll || activeComponent === 'difference-chart') && (
        <DemoSection
          title="Difference Chart"
          description="Difference charts display the variation between two overlapping time series, visually highlighting positive (blue) and negative (orange) areas using clip-path intersections."
          code={`import { DifferenceChart } from '@hadi_gunawan/md3-expressive-ds';

<DifferenceChart
  data={temperatureData}
  xKey="date"
  y0Key="SF"
  y1Key="NY"
  y0Label="San Francisco"
  y1Label="New York"
  title="New York vs San Francisco Temperature Difference"
  subtitle="Difference in temperature (F) over a one-year sequence"
  yFormatter={(val) => \`\${val}°F\`}
/>`}
        >
          <div style={{ width: '100%' }}>
            <Card variant="outlined" style={{ padding: 16 }}>
              <CardContent>
                <DifferenceChart
                  data={DIFFERENCE_DATA}
                  xKey="date"
                  y0Key="SF"
                  y1Key="NY"
                  y0Label="San Francisco"
                  y1Label="New York"
                  title="New York vs San Francisco Temperature Difference"
                  subtitle="Daily comparison matching the official D3.js Difference Chart (October 2011 - September 2012)"
                  yFormatter={(val) => `${val}°F`}
                />
              </CardContent>
            </Card>
          </div>
        </DemoSection>
      )}

      {(showAll || activeComponent === 'bar-chart') && (
        <DemoSection
          title="Bar Chart"
          description="Bar charts compare discrete categories along a common baseline. Bars are sorted by value and each column is labelled along the X axis. Referencing the official D3 Bar Chart letter frequency example."
          code={`import { BarChart } from '@hadi_gunawan/md3-expressive-ds';

const data = [
  { letter: 'E', frequency: 12.702 },
  { letter: 'T', frequency: 9.056 },
  // ...
];

<BarChart
  data={data}
  xKey="letter"
  yKey="frequency"
  title="Letter Frequency"
  subtitle="Relative frequency of letters in the English language"
  yFormatter={(val) => \`\${val}%\`}
/>`}
        >
          <div style={{ width: '100%' }}>
            <Card variant="outlined" style={{ padding: 16 }}>
              <CardContent>
                <BarChart
                  data={LETTER_FREQUENCY_DATA}
                  xKey="letter"
                  yKey="frequency"
                  title="Letter Frequency"
                  subtitle="Relative frequency of letters in the English language"
                  yFormatter={(val) => `${val}%`}
                  color="#5985ab"
                />
              </CardContent>
            </Card>
          </div>
        </DemoSection>
      )}
    </div>
  );
}
