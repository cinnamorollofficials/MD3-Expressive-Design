import { BarChart, Card, CardContent } from '../../lib';
import { DemoSection, PageTitle } from '../components/DemoSection';

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

export function BarChartsPage({ activeComponent }: { activeComponent?: string }) {
  const showAll = !activeComponent;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <PageTitle
        title="Bar Charts"
        subtitle="Bar charts compare discrete categorical data using rectangular bars drawn from a common baseline, implemented using D3 scaleBand scales."
      />

      {(showAll || activeComponent === 'bar-chart') && (
        <DemoSection
          title="Bar Chart"
          description="A vertical bar chart mapping 26 letters to their relative frequency in the English language — mirroring the canonical D3.js bar chart example. Each bar height encodes a quantitative value; on hover, a tooltip surfaces the exact label and value."
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
