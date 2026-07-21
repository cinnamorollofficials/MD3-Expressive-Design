import { useState, useMemo } from 'react';
import { MovingAverageChart, Card, CardContent } from '../../lib';
import { DemoSection, PageTitle } from '../components/DemoSection';

// Generate 5 years of daily time series data matching the D3 moving average reference
function generateTimeSeriesData() {
  const data: { date: Date; value: number }[] = [];
  const startDate = new Date('2015-01-01');
  const numDays = 1825; // 5 years

  let val = 1.2;
  for (let i = 0; i < numDays; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);

    // Seasonal annual wave + mid-year cycle + noise
    const dayOfYear = i % 365;
    const seasonal = Math.sin((dayOfYear / 365) * Math.PI * 2) * 0.5;
    const multiYearCycle = Math.sin((i / (365 * 2)) * Math.PI * 2) * 0.4;
    const noise = (Math.random() - 0.5) * 0.25;

    val = Math.max(0.2, 1.2 + seasonal + multiYearCycle + noise);
    data.push({ date: d, value: val });
  }

  return data;
}

interface AnalysisPageProps {
  activeComponent?: string;
}

export function AnalysisPage({ activeComponent }: AnalysisPageProps) {
  const timeSeriesData = useMemo(() => generateTimeSeriesData(), []);
  const [currentWindow, setCurrentWindow] = useState(100);

  const renderMovingAverage = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card variant="outlined" style={{ padding: 24 }}>
        <CardContent>
          <MovingAverageChart
            title="Daily Metric Time Series (Moving Average Smoothing)"
            subtitle="Interactive sliding window moving average visualization. Drag the Days slider (N) or click preset buttons (7D, 30D, 50D, 100D, 200D) to smooth out short-term fluctuations."
            data={timeSeriesData}
            windowSize={currentWindow}
            minWindowSize={1}
            maxWindowSize={365}
            type="sma"
            rawMode="area"
            height={500}
            showControls={true}
            showPresets={true}
            valueFormatter={(v) => v.toFixed(2)}
            onWindowSizeChange={(w) => setCurrentWindow(w)}
          />
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <PageTitle
        title="Data Analysis & Statistical Visualizations"
        subtitle="Data analysis components for time series smoothing, trend identification, moving averages, and statistical modeling styled with Material Design 3 Expressive design tokens."
      />

      {(!activeComponent || activeComponent === 'moving-average') && (
        <DemoSection
          title="Moving Average"
          description="Smooths out time series fluctuations over a sliding window (N days) to reveal underlying trends, cycles, and momentum."
        >
          {renderMovingAverage()}
        </DemoSection>
      )}
    </div>
  );
}
