import { useState, useMemo } from 'react';
import { MovingAverageChart, BollingerBandsChart, BoxPlot, Histogram, KernelDensityEstimation, HexbinChart, QQPlot, Card, CardContent, CandlestickChart } from '../../lib';
import { DemoSection, PageTitle } from '../components/DemoSection';





// Generate 120-day OHLCV candlestick dataset
function generateCandlestickData() {
  const data: { date: Date; open: number; high: number; low: number; close: number; volume: number }[] = [];
  let price = 145.0;
  for (let i = 0; i < 120; i++) {
    const d = new Date('2024-01-01');
    d.setDate(d.getDate() + i);
    const change = (Math.random() - 0.48) * 4;
    const open = price;
    const close = Math.max(50, price + change);
    const high = Math.max(open, close) + Math.random() * 2.5;
    const low = Math.min(open, close) - Math.random() * 2.5;
    const volume = Math.floor(8e6 + Math.random() * 12e6);
    data.push({ date: d, open, high, low, close, volume });
    price = close;
  }
  return data;
}

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

// Old Faithful geyser waiting times between eruptions (minutes)
// Bimodal distribution: two clusters around ~54 min and ~80 min (n=272)
function generateOldFaithfulData(): number[] {
  // Faithful waiting times dataset — classic bimodal distribution
  const shortWait = [43,45,47,47,48,48,49,49,50,51,51,52,53,54,54,54,54,54,54,55,56,56,56,57,57,57,58,58,59,60,60,61,61,62,62];
  const longWait  = [70,71,72,72,73,73,74,74,75,75,75,75,76,76,76,77,77,77,77,77,77,78,78,78,78,78,78,79,79,79,79,80,80,80,80,80,80,81,81,81,81,81,82,82,82,82,82,82,82,82,83,83,83,83,84,84,84,84,84,84,85,85,85,85,85,85,85,85,86,86,86,86,86,86,86,87,87,87,88,88,88,88,88,88,89,89,89,89,90,90,90,90,90,91,91,92,92,93,93,94,94,95,96];
  // Add slight Gaussian jitter for realism
  const jitter = (v: number, s: number) => v + (Math.random() - 0.5) * s;
  return [
    ...shortWait.map((v) => parseFloat(jitter(v, 1.5).toFixed(1))),
    ...longWait.map((v) => parseFloat(jitter(v, 1.5).toFixed(1))),
    // duplicate short cluster to balance counts (matches n≈272)
    ...shortWait.map((v) => parseFloat(jitter(v, 2.0).toFixed(1))),
    ...longWait.slice(0, 30).map((v) => parseFloat(jitter(v, 1.0).toFixed(1))),
  ];
}

// Generate Walmart Stores dataset (~3,000 stores across US matching D3 reference)
// Originates in Bentonville, AR (~1962), expanding outward over 40 years.
function generateWalmartStoresData() {
  const stores: { lon: number; lat: number; year: number }[] = [];
  const arLon = -94.2;
  const arLat = 36.3;

  for (let i = 0; i < 3000; i++) {
    // Distance from Arkansas origin (0 to ~25 degrees longitude/latitude)
    const dist = Math.pow(Math.random(), 1.4) * 26;
    const angle = Math.random() * 2 * Math.PI;

    const lon = arLon + Math.cos(angle) * dist * 1.25;
    const lat = arLat + Math.sin(angle) * dist * 0.75;

    // Reject points outside continental US bounding box roughly
    if (lon < -124.5 || lon > -67.0 || lat < 25.0 || lat > 49.0) continue;

    // Store opening year correlated with distance from Arkansas (1962 - 2006)
    const yearBase = 1962 + dist * 1.5;
    const yearNoise = (Math.random() - 0.5) * 5;
    const year = Math.max(1962, Math.min(2006, Math.round(yearBase + yearNoise)));

    stores.push({ lon, lat, year });
  }

  return stores;
}

// Generate Batch 1 vs Batch 2 datasets matching the exact Q-Q plot reference image
function generateBatchData() {
  // Deterministic seed for reproducible batch measurements
  const b1: number[] = [];
  const b2: number[] = [];

  const n = 140;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    // Batch 1 (Y axis): values 380 - 820 with S-curve distribution
    const yVal = 380 + Math.pow(t, 0.7) * 350 + Math.sin(t * Math.PI) * 90;
    // Batch 2 (X axis): values 340 - 820
    const xVal = 345 + Math.pow(t, 1.25) * 475;

    b1.push(parseFloat(yVal.toFixed(1)));
    b2.push(parseFloat(xVal.toFixed(1)));
  }

  return { batch1: b1, batch2: b2 };
}

interface AnalysisPageProps {
  activeComponent?: string;
}




export function AnalysisPage({ activeComponent }: AnalysisPageProps) {
  const candlestickData = useMemo(() => generateCandlestickData(), []);
  const [showSmaCs, setShowSmaCs] = useState(true);
  const [showBollingerCs, setShowBollingerCs] = useState(false);

  const renderCandlestickChart = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card variant="outlined" style={{ overflow: 'hidden', padding: 0 }}>
        <div style={{ background: '#060810', width: '100%' }}>
          <CandlestickChart
            data={candlestickData}
            height={480}
            showVolume={true}
            showSma={showSmaCs}
            showBollinger={showBollingerCs}
            upColor="#26a69a"
            downColor="#ef5350"
            maColor="#38bdf8"
            bollingerColor="#a78bfa"
            valueFormatter={(v) => `$${v.toFixed(2)}`}
          />
        </div>
        <div style={{ borderTop: '1px solid var(--md-sys-color-outline-variant)', display: 'flex', gap: 16, flexWrap: 'wrap', paddingTop: 12, paddingBottom: 12, paddingLeft: 16, paddingRight: 16 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', font: 'var(--md-sys-typescale-body-medium)' }}>
            <input type="checkbox" checked={showSmaCs} onChange={e => setShowSmaCs(e.target.checked)} /> Show SMA (20)
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', font: 'var(--md-sys-typescale-body-medium)' }}>
            <input type="checkbox" checked={showBollingerCs} onChange={e => setShowBollingerCs(e.target.checked)} /> Show Bollinger Bands
          </label>
        </div>
      </Card>
    </div>
  );

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

  const oldFaithfulData = useMemo(() => generateOldFaithfulData(), []);

  const renderKDE = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card variant="outlined" style={{ padding: 24 }}>
        <CardContent>
          <KernelDensityEstimation
            title="Old Faithful Geyser — Waiting Time Distribution (KDE)"
            subtitle="Kernel Density Estimation over histogram bars showing the bimodal distribution of wait times between eruptions (minutes). Adjust the bandwidth h to control smoothing — smaller h reveals peaks, larger h shows the overall shape."
            data={oldFaithfulData}
            height={500}
            xAxisTitle="Time between eruptions (min.)"
            yAxisTitle="Density"
            showControls={true}
            showKernelSelector={true}
            showHistogram={true}
            minBandwidth={0.5}
            maxBandwidth={20}
            bandwidthStep={0.5}
            xFormatter={(v) => v.toFixed(0)}
            yFormatter={(v) => `${(v * 100).toFixed(2)}%`}
          />
        </CardContent>
      </Card>
    </div>
  );

  const walmartData = useMemo(() => generateWalmartStoresData(), []);

  const renderHexbinChart = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card variant="outlined" style={{ padding: 24 }}>
        <CardContent>
          <HexbinChart
            title="Walmart Store Openings Across the United States (Hexbin Map)"
            subtitle="Hexagonal binning of 3,000 store locations. Hexagon area represents store density in the vicinity, while color represents the median opening year (older stores in red/orange near Bentonville AR, newer stores in blue/cyan toward coasts)."
            data={walmartData}
            xAccessor={(d) => d.lon}
            yAccessor={(d) => d.lat}
            valueAccessor={(d) => d.year}
            sizeMode="area"
            colorMode="value"
            valueAggregation="median"
            radius={14}
            minRadius={6}
            maxRadius={28}
            colorScheme="spectral"
            colorLegendTitle="Median Opening Year"
            xAxisTitle="Longitude (°W)"
            yAxisTitle="Latitude (°N)"
            height={560}
            showControls={true}
            xFormatter={(v) => `${Math.abs(v).toFixed(1)}°W`}
            yFormatter={(v) => `${v.toFixed(1)}°N`}
            valueFormatter={(v) => `${Math.round(v)}`}
          />
        </CardContent>
      </Card>
    </div>
  );

  const batchData = useMemo(() => generateBatchData(), []);

  const renderQQPlot = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card variant="outlined" style={{ padding: 24 }}>
        <CardContent>
          <QQPlot
            title="Empirical Quantile-Quantile (Q-Q) Plot (Batch 1 vs Batch 2)"
            subtitle="Comparing empirical distributions of two experimental batches. If the distributions are identical in shape, points lie on the 45° reference line. S-curve deviations reveal differences in tail weights and skewness."
            data={batchData.batch1}
            sample2={batchData.batch2}
            mode="two-sample"
            xLabel="Batch 2"
            yLabel="Batch 1"
            height={560}
            interactive={true}
            valueFormatter={(v) => v.toFixed(0)}
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

      {(!activeComponent || activeComponent === 'candlestick-chart') && (
        <DemoSection
          title="Candlestick Chart"
          description="Financial OHLCV candlestick chart rendering Open, High, Low, Close price bars with optional Volume histogram subplot, SMA overlay, and Bollinger Bands. Designed for trading and market data visualization."
        >
          {renderCandlestickChart()}
        </DemoSection>
      )}

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

      {(!activeComponent || activeComponent === 'kernel-density-estimation') && (
        <DemoSection
          title="Kernel Density Estimation (KDE)"
          description="Non-parametric density estimator that smooths each data point with a kernel function K and bandwidth h. The KDE curve estimates the underlying probability density function (PDF) of the data."
        >
          {renderKDE()}
        </DemoSection>
      )}

      {(!activeComponent || activeComponent === 'hexbin-chart') && (
        <DemoSection
          title="Hexbin Chart (Hexagonal Binning)"
          description="Aggregates dense 2D spatial or bivariate scatter data into hexagonal bins to eliminate overplotting. Hexagon size represents point density and color represents aggregated metric values."
        >
          {renderHexbinChart()}
        </DemoSection>
      )}

      {(!activeComponent || activeComponent === 'qq-plot') && (
        <DemoSection
          title="Q-Q Plot (Quantile-Quantile)"
          description="Graphical method for comparing two probability distributions by plotting their quantiles against each other along a diagonal 45° reference line."
        >
          {renderQQPlot()}
        </DemoSection>
      )}
    </div>
  );
}





