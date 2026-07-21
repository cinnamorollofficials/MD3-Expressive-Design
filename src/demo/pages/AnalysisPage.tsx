import { useState, useMemo } from 'react';
import { MovingAverageChart, BollingerBandsChart, BoxPlot, Histogram, Card, CardContent } from '../../lib';
import { DemoSection, PageTitle } from '../components/DemoSection';


// Generate Diamond Price vs Carat Distribution dataset matching reference image
function generateDiamondCaratData() {
  const carats = [0.3, 0.5, 0.7, 0.9, 1.1, 1.3, 1.5, 1.8, 2.0, 2.2, 2.5, 3.0, 3.5, 4.0];
  return carats.map((carat) => {
    const basePrice = Math.pow(carat, 1.6) * 3200 + 400;
    const spread = basePrice * 0.35;
    const count = 120;
    const values: number[] = [];

    for (let i = 0; i < count; i++) {
      // Gaussian-like random price
      const r = (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
      values.push(Math.max(300, basePrice + r * spread));
    }

    // Add some realistic upper outliers for smaller carats
    if (carat <= 1.5) {
      const numOutliers = Math.floor(Math.random() * 15) + 5;
      for (let j = 0; j < numOutliers; j++) {
        values.push(basePrice * 2.2 + Math.random() * 5000);
      }
    }

    return {
      group: carat.toFixed(1),
      values,
    };
  });
}


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


// Generate US County Unemployment Rate data (right-skewed, 3,143 counties)
// Matching reference histogram: peak near 5%, long right tail up to ~28%
function generateUnemploymentData(): number[] {
  const values: number[] = [];
  const rng = (seed: number) => {
    // xorshift32 deterministic pseudo-RNG for reproducibility
    seed ^= seed << 13;
    seed ^= seed >> 17;
    seed ^= seed << 5;
    return (seed >>> 0) / 0xffffffff;
  };

  let seed = 42;
  // ~3143 US counties: mostly 2-10%, long tail to ~28%
  for (let i = 0; i < 3143; i++) {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    const u1 = rng(seed);
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    const u2 = rng(seed);

    // Box-Muller transform, then shift/scale to get right-skewed gamma-like distribution
    const normal = Math.sqrt(-2 * Math.log(Math.max(1e-10, u1))) * Math.cos(2 * Math.PI * u2);

    // Shape: mean ~5.5%, std ~2.8%, min ~1.5%, long right tail to ~28%
    const k = 3.8; // shape param
    const theta = 1.45; // scale param
    // Approximate gamma via normal * sqrt(k) + k (central limit approx)
    const gammaApprox = Math.max(0, (normal * Math.sqrt(2 * k) + 2 * k) * theta * 0.72);
    const rate = Math.max(1.5, Math.min(28, gammaApprox + 1.5));
    values.push(parseFloat(rate.toFixed(2)));
  }

  return values;
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

  const diamondData = useMemo(() => generateDiamondCaratData(), []);

  const renderBoxPlot = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card variant="outlined" style={{ padding: 24 }}>
        <CardContent>
          <BoxPlot
            title="Diamond Price Distribution by Carat Weight (Tukey Box Plot)"
            subtitle="Statistical 5-number summary (Min, Q1, Median, Q3, Max) displaying diamond price distributions ($0k - $20k) across carat size groups with jittered outlier dots."
            data={diamondData}
            height={560}
            showOutliers={true}
            valueFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `$${v.toFixed(0)}`)}
          />
        </CardContent>
      </Card>
    </div>
  );

  const unemploymentData = useMemo(() => generateUnemploymentData(), []);

  const renderHistogram = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card variant="outlined" style={{ padding: 24 }}>
        <CardContent>
          <Histogram
            title="US County Unemployment Rate Distribution (Histogram)"
            subtitle="Frequency distribution of unemployment rates across 3,143 US counties. Right-skewed distribution with peak near 5%. Adjust the Bins slider to control bin width granularity."
            data={unemploymentData}
            height={500}
            xAxisTitle="Unemployment rate (%)"
            yAxisTitle="Frequency (no. of counties)"
            showControls={true}
            minBins={5}
            maxBins={80}
            xFormatter={(v) => `${v.toFixed(0)}`}
            yFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v))}
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

      {(!activeComponent || activeComponent === 'box-plot') && (
        <DemoSection
          title="Box Plot"
          description="Five-number summary box-and-whisker plot displaying medians, interquartile ranges (IQR), and statistical outliers."
        >
          {renderBoxPlot()}
        </DemoSection>
      )}

      {(!activeComponent || activeComponent === 'histogram') && (
        <DemoSection
          title="Histogram"
          description="Frequency distribution chart grouping continuous numeric data into bins to reveal the shape, spread, and central tendency of a dataset."
        >
          {renderHistogram()}
        </DemoSection>
      )}
    </div>
  );
}



