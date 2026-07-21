import { useState, useMemo } from 'react';
import { MovingAverageChart, BollingerBandsChart, Card, CardContent } from '../../lib';
import { DemoSection, PageTitle } from '../components/DemoSection';

// Generate 5 years of daily stock close prices ($60 - $190) matching D3 Bollinger Bands reference image
function generateStockPriceData() {
  const data: { date: Date; value: number }[] = [];
  const startDate = new Date('2013-05-01');
  const numDays = 1825; // 5 years

  let price = 62.0;
  for (let i = 0; i < numDays; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);

    // Long-term bullish growth trend + cyclical waves + daily volatility
    const trend = (i / numDays) * 110; // Growth from 60 to ~170
    const cycle = Math.sin(i / 110) * 15 + Math.cos(i / 45) * 8;
    const dailyNoise = (Math.random() - 0.48) * 2.2;

    price = Math.max(50, 60 + trend + cycle + dailyNoise);
    data.push({ date: d, value: price });
  }

  return data;
}

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

  const stockPriceData = useMemo(() => generateStockPriceData(), []);
  const [bollingerPeriod, setBollingerPeriod] = useState(20);
  const [bollingerK, setBollingerK] = useState(2.0);

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

  const renderBollingerBands = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card variant="outlined" style={{ padding: 24 }}>
        <CardContent>
          <BollingerBandsChart
            title="Daily Close Stock Price with Bollinger Bands ($)"
            subtitle="Technical analysis visualization displaying Upper (+Kσ - Red), Middle SMA (N - Blue), and Lower (-Kσ - Green) bands with a shaded volatility envelope band around daily closing stock price."
            data={stockPriceData}
            period={bollingerPeriod}
            multiplier={bollingerK}
            height={540}
            showControls={true}
            valueFormatter={(v) => `$${v.toFixed(2)}`}
            onChangeParams={(p, k) => {
              setBollingerPeriod(p);
              setBollingerK(k);
            }}
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

      {(!activeComponent || activeComponent === 'bollinger-bands') && (
        <DemoSection
          title="Bollinger Bands"
          description="Financial volatility and momentum indicator plot consisting of an N-period SMA middle band with upper (+Kσ) and lower (-Kσ) standard deviation threshold lines."
        >
          {renderBollingerBands()}
        </DemoSection>
      )}
    </div>
  );
}

