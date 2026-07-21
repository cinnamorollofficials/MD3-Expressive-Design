import { BarChart, HorizontalBarChart, DivergingBarChart, Card, CardContent } from '../../lib';
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

// Most populated countries, sorted descending — canonical horizontal bar chart example
const POPULATION_DATA = [
  { country: 'India', population: 1428.6 },
  { country: 'China', population: 1425.7 },
  { country: 'United States', population: 339.0 },
  { country: 'Indonesia', population: 277.5 },
  { country: 'Pakistan', population: 240.5 },
  { country: 'Brazil', population: 215.3 },
  { country: 'Nigeria', population: 223.8 },
  { country: 'Bangladesh', population: 172.9 },
  { country: 'Russia', population: 144.4 },
  { country: 'Ethiopia', population: 126.5 },
];

// US state population change 2010–2020 (sorted from most loss to most gain)
// Matches the canonical D3 diverging bar chart reference
const STATE_POPULATION_CHANGE = [
  { state: 'Puerto Rico',    change: -532045 },
  { state: 'Illinois',       change: -158011 },
  { state: 'West Virginia',  change: -59929 },
  { state: 'Connecticut',    change: -60928 },
  { state: 'Vermont',        change: -1752 },
  { state: 'Rhode Island',   change: -4787 },
  { state: 'Mississippi',    change: -6853 },
  { state: 'Wyoming',        change: -15133 },
  { state: 'Maine',          change: -15851 },
  { state: 'Alaska',         change: -21314 },
  { state: 'New Mexico',     change: +37650 },
  { state: 'New Hampshire',  change: +43241 },
  { state: 'Hawaii',         change: +55571 },
  { state: 'Kansas',         change: -61196 },
  { state: 'South Dakota',   change: +75179 },
  { state: 'New York',       change: +75428 },
  { state: 'Delaware',       change: +75830 },
  { state: 'Montana',        change: +78363 },
  { state: 'North Dakota',   change: +89671 },
  { state: 'New Jersey',     change: +90296 },
  { state: 'Pennsylvania',   change: +99010 },
  { state: 'Arkansas',       change: +101967 },
  { state: 'Michigan',       change: +103217 },
  { state: 'D.C.',           change: +104685 },
  { state: 'Nebraska',       change: +109067 },
  { state: 'Iowa',           change: +109715 },
  { state: 'Louisiana',      change: +115423 },
  { state: 'Alabama',        change: +123449 },
  { state: 'Kentucky',       change: +129390 },
  { state: 'Wisconsin',      change: +135649 },
  { state: 'Missouri',       change: +148351 },
  { state: 'Ohio',           change: +152394 },
  { state: 'Oklahoma',       change: +205823 },
  { state: 'Idaho',          change: +216305 },
  { state: 'Indiana',        change: +248417 },
  { state: 'Maryland',       change: +272128 },
  { state: 'Minnesota',      change: +305707 },
  { state: 'Nevada',         change: +376065 },
  { state: 'Oregon',         change: +386883 },
  { state: 'Massachusetts',  change: +401874 },
  { state: 'Utah',           change: +442073 },
  { state: 'Tennessee',      change: +487269 },
  { state: 'South Carolina', change: +499365 },
  { state: 'Virginia',       change: +534495 },
  { state: 'Colorado',       change: +726540 },
  { state: 'Arizona',        change: +888700 },
  { state: 'Washington',     change: +994353 },
  { state: 'Georgia',        change: +1028770 },
  { state: 'North Carolina', change: +1052601 },
  { state: 'California',     change: +2157700 },
  { state: 'Florida',        change: +2679427 },
  { state: 'Texas',          change: +3999935 },
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

      {(showAll || activeComponent === 'horizontal-bar-chart') && (
        <DemoSection
          title="Horizontal Bar Chart"
          description="Horizontal bar charts are ideal when category labels are long, when there are many categories, or when a left-to-right reading order is more natural. Bars extend from a common baseline on the Y axis."
          code={`import { HorizontalBarChart } from '@hadi_gunawan/md3-expressive-ds';

const data = [
  { country: 'India', population: 1428.6 },
  { country: 'China', population: 1425.7 },
  // ...
];

<HorizontalBarChart
  data={data}
  yKey="country"
  xKey="population"
  title="Most Populated Countries (2023)"
  subtitle="Population in millions"
  xFormatter={(val) => \`\${val}M\`}
/>`}
        >
          <div style={{ width: '100%' }}>
            <Card variant="outlined" style={{ padding: 16 }}>
              <CardContent>
                <HorizontalBarChart
                  data={POPULATION_DATA}
                  yKey="country"
                  xKey="population"
                  title="Most Populated Countries (2023)"
                  subtitle="Population in millions — sorted by population descending"
                  xFormatter={(val) => `${val}M`}
                  color="#5985ab"
                  height={380}
                />
              </CardContent>
            </Card>
          </div>
        </DemoSection>
      )}

      {(showAll || activeComponent === 'diverging-bar-chart') && (
        <DemoSection
          title="Diverging Bar Chart"
          description="Diverging bar charts compare values that can be positive or negative relative to a shared zero baseline. Positive values extend right in blue, negative values extend left in orange — directly replicating the D3.js Diverging Bar Chart showing US state population change 2010–2020."
          code={`import { DivergingBarChart } from '@hadi_gunawan/md3-expressive-ds';

const data = [
  { state: 'Texas',       change: +3999935 },
  { state: 'Florida',     change: +2679427 },
  { state: 'Puerto Rico', change: -532045 },
  // ...
];

<DivergingBarChart
  data={data}
  yKey="state"
  xKey="change"
  title="US State Population Change 2010–2020"
  legendLabels={['Population gain', 'Population loss']}
  xFormatter={(val) => val >= 0 ? \`+\${(val/1000).toFixed(0)}K\` : \`\${(val/1000).toFixed(0)}K\`}
/>`}
        >
          <div style={{ width: '100%' }}>
            <Card variant="outlined" style={{ padding: 16 }}>
              <CardContent>
                <DivergingBarChart
                  data={STATE_POPULATION_CHANGE}
                  yKey="state"
                  xKey="change"
                  title="US State Population Change, 2010–2020"
                  subtitle="States sorted from most loss (top) to most gain (bottom), mirroring the official D3 example"
                  legendLabels={['Population gain', 'Population loss']}
                  xFormatter={(val) => {
                    const k = Math.round(Math.abs(val) / 1000);
                    return val >= 0 ? `+${k}K` : `-${k}K`;
                  }}
                  height={1100}
                />
              </CardContent>
            </Card>
          </div>
        </DemoSection>
      )}
    </div>
  );
}
