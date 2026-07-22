import { useState, useMemo, useEffect } from 'react';
import {
  TopAppBar, IconButton, Badge, Search, Menu,
  SegmentedButton, Tabs, Chip, Snackbar, Tooltip,
  Divider, Card, Avatar, DataTable, Button, TextField,
  Slider, NavigationRail, KernelDensityEstimation, type DataTableColumn
} from '../../lib';
import { ExampleSourceSheet } from '../components/ExampleSourceSheet';
import {
  WATCHLIST, TOP_GAINERS, INITIAL_POSITIONS, INITIAL_ORDERS, generateCandlestickData,
  type TickerItem, type AccountPosition, type AccountOrder, type CandlestickPoint
} from './TradingUiPage.data';

import pageSource from './TradingUiPage.tsx?raw';
import dataSource from './TradingUiPage.data.ts?raw';
import styleSource from './TradingUiPage.module.css?raw';
import styles from './TradingUiPage.module.css';

// SVG Candlestick Chart Component with Indicators
function CandlestickChart({
  data,
  symbolItem,
  showSma,
  showBollinger,
}: {
  data: CandlestickPoint[];
  symbolItem: TickerItem;
  showSma: boolean;
  showBollinger: boolean;
}) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const width = 800;
  const height = 360;
  const padding = { top: 24, right: 65, bottom: 30, left: 10 };

  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const { minPrice, maxPrice, maxVol } = useMemo(() => {
    if (!data.length) return { minPrice: 0, maxPrice: 100, maxVol: 100 };
    let minP = Infinity;
    let maxP = -Infinity;
    let maxV = 0;
    data.forEach(d => {
      if (d.low < minP) minP = d.low;
      if (d.high > maxP) maxP = d.high;
      if (d.volume > maxV) maxV = d.volume;
    });
    const padP = (maxP - minP) * 0.05 || 10;
    return {
      minPrice: Math.max(0, minP - padP),
      maxPrice: maxP + padP,
      maxVol: maxV || 1,
    };
  }, [data]);

  const candleW = Math.max(2, (chartW / data.length) * 0.65);
  const stepX = chartW / (data.length || 1);

  const getY = (val: number) => {
    return padding.top + (1 - (val - minPrice) / (maxPrice - minPrice || 1)) * (chartH * 0.75);
  };

  const getVolY = (vol: number) => {
    const volH = (vol / maxVol) * (chartH * 0.22);
    return padding.top + chartH - volH;
  };

  const yTicks = useMemo(() => {
    const ticksCount = 6;
    const result = [];
    const step = (maxPrice - minPrice) / (ticksCount - 1);
    for (let i = 0; i < ticksCount; i++) {
      result.push(minPrice + step * i);
    }
    return result;
  }, [minPrice, maxPrice]);

  const hoverPoint = hoverIndex !== null && data[hoverIndex] ? data[hoverIndex] : data[data.length - 1];

  const smaPath = useMemo(() => {
    if (!showSma || data.length < 2) return '';
    return data
      .map((d, i) => {
        const x = padding.left + i * stepX + stepX / 2;
        const y = getY(d.sma9 ?? d.close);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  }, [data, showSma, stepX]);

  const bollingerPaths = useMemo(() => {
    if (!showBollinger || data.length < 2) return { upper: '', lower: '' };
    const upper = data
      .map((d, i) => {
        const x = padding.left + i * stepX + stepX / 2;
        const y = getY(d.upperBand ?? d.high);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
    const lower = data
      .map((d, i) => {
        const x = padding.left + i * stepX + stepX / 2;
        const y = getY(d.lowerBand ?? d.low);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
    return { upper, lower };
  }, [data, showBollinger, stepX]);

  return (
    <div className={styles.chartViewport} onMouseLeave={() => setHoverIndex(null)}>
      <div className={styles.pairSummary}>
        <span style={{ fontWeight: 700, color: 'var(--md-sys-color-on-surface, #fff)' }}>{symbolItem.symbol}</span>
        {hoverPoint && (
          <span>
            O <span className={styles.pairOhlc}>{hoverPoint.open}</span>{' '}
            H <span className={styles.pairOhlc}>{hoverPoint.high}</span>{' '}
            L <span className={styles.pairOhlc}>{hoverPoint.low}</span>{' '}
            C <span className={styles.pairOhlc}>{hoverPoint.close}</span>{' '}
            <span style={{ color: symbolItem.change >= 0 ? '#00e676' : '#ff5252' }}>
              {symbolItem.change >= 0 ? '+' : ''}{symbolItem.change} ({symbolItem.changePercent}%)
            </span>
          </span>
        )}
      </div>

      <svg
        className={styles.candlestickSvg}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const mouseX = e.clientX - rect.left - padding.left;
          const idx = Math.min(data.length - 1, Math.max(0, Math.floor(mouseX / stepX)));
          setHoverIndex(idx);
        }}
      >
        {/* Grid lines */}
        {yTicks.map((tick, i) => {
          const y = getY(tick);
          return (
            <g key={i}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="var(--md-sys-color-outline-variant, #18202c)" strokeWidth="1" strokeDasharray="3 3" />
              <text x={width - padding.right + 6} y={y + 3} fill="var(--md-sys-color-on-surface-variant, #64748b)" fontSize="10" fontFamily="sans-serif">
                {tick > 10000 ? `${(tick / 1000).toFixed(0)}K` : tick.toFixed(1)}
              </text>
            </g>
          );
        })}

        {/* Bollinger Bands Paths */}
        {showBollinger && (
          <>
            <path d={bollingerPaths.upper} fill="none" stroke="#a78bfa" strokeWidth="1" strokeDasharray="2 2" />
            <path d={bollingerPaths.lower} fill="none" stroke="#a78bfa" strokeWidth="1" strokeDasharray="2 2" />
          </>
        )}

        {/* SMA 9 Path */}
        {showSma && (
          <path d={smaPath} fill="none" stroke="#38bdf8" strokeWidth="1.5" />
        )}

        {/* Current Price Line */}
        {data.length > 0 && (
          <g>
            <line
              x1={padding.left}
              y1={getY(data[data.length - 1].close)}
              x2={width - padding.right}
              y2={getY(data[data.length - 1].close)}
              stroke={symbolItem.change >= 0 ? '#00e676' : '#ff5252'}
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            <rect
              x={width - padding.right}
              y={getY(data[data.length - 1].close) - 9}
              width={60}
              height={18}
              rx={4}
              fill={symbolItem.change >= 0 ? '#00e676' : '#ff5252'}
            />
            <text
              x={width - padding.right + 6}
              y={getY(data[data.length - 1].close) + 4}
              fill="#000000"
              fontSize="10"
              fontWeight="bold"
            >
              {data[data.length - 1].close > 10000 ? `${(data[data.length - 1].close / 1000).toFixed(1)}K` : data[data.length - 1].close}
            </text>
          </g>
        )}

        {/* Volume Bars */}
        {data.map((d, i) => {
          const cx = padding.left + i * stepX + stepX / 2;
          const isGreen = d.close >= d.open;
          const volY = getVolY(d.volume);
          const volH = padding.top + chartH - volY;
          return (
            <rect
              key={`vol-${i}`}
              x={cx - candleW / 2}
              y={volY}
              width={candleW}
              height={volH}
              fill={isGreen ? 'rgba(0, 230, 118, 0.25)' : 'rgba(255, 82, 82, 0.25)'}
            />
          );
        })}

        {/* Candlesticks */}
        {data.map((d, i) => {
          const cx = padding.left + i * stepX + stepX / 2;
          const isGreen = d.close >= d.open;
          const openY = getY(d.open);
          const closeY = getY(d.close);
          const highY = getY(d.high);
          const lowY = getY(d.low);

          const bodyY = Math.min(openY, closeY);
          const bodyH = Math.max(1, Math.abs(closeY - openY));
          const color = isGreen ? '#00e676' : '#ff5252';

          return (
            <g key={`candle-${i}`}>
              <line x1={cx} y1={highY} x2={cx} y2={lowY} stroke={color} strokeWidth="1.2" />
              <rect
                x={cx - candleW / 2}
                y={bodyY}
                width={candleW}
                height={bodyH}
                fill={color}
                stroke={color}
              />
            </g>
          );
        })}

        {/* Hover Hairline */}
        {hoverIndex !== null && (
          <g>
            <line
              x1={padding.left + hoverIndex * stepX + stepX / 2}
              y1={padding.top}
              x2={padding.left + hoverIndex * stepX + stepX / 2}
              y2={padding.top + chartH}
              stroke="#94a3b8"
              strokeWidth="0.8"
              strokeDasharray="4 4"
            />
          </g>
        )}

        {/* Time X-axis Labels */}
        {data.map((d, i) => {
          if (i % 8 !== 0) return null;
          const cx = padding.left + i * stepX + stepX / 2;
          return (
            <text key={`time-${i}`} x={cx} y={height - 10} fill="var(--md-sys-color-on-surface-variant, #64748b)" fontSize="9" textAnchor="middle">
              {d.dateStr}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

export function TradingUiPage() {
  const [navTab, setNavTab] = useState<string>('trade');
  const [activeSymbol, setActiveSymbol] = useState<string>('SIREN-IDR');
  const [tradeTab, setTradeTab] = useState<'Buy' | 'Sell'>('Buy');
  const [tradeQty, setTradeQty] = useState<string>('50');
  const [sliderPct, setSliderPct] = useState<number>(25);
  const [hideBalance, setHideBalance] = useState<boolean>(false);
  const [timeframe, setTimeframe] = useState<string>('1d');
  const [topSearch, setTopSearch] = useState<string>('');
  const [leftRailItem, setLeftRailItem] = useState<string>('crosshair');
  const [rightRailItem, setRightRailItem] = useState<string>('watchlist');
  const [watchlistCategory, setWatchlistCategory] = useState<string>('Semua');

  const [showSma, setShowSma] = useState<boolean>(true);
  const [showBollinger, setShowBollinger] = useState<boolean>(false);

  const [balanceIdr, setBalanceIdr] = useState<number>(1000000);
  const [watchlistQuery, setWatchlistQuery] = useState<string>('');
  const [accountTab, setAccountTab] = useState<string>('positions');
  const [accountCollapsed, setAccountCollapsed] = useState<boolean>(false);
  const [positions, setPositions] = useState<AccountPosition[]>(INITIAL_POSITIONS);
  const [orders, setOrders] = useState<AccountOrder[]>(INITIAL_ORDERS);

  const [watchlistData, setWatchlistData] = useState<TickerItem[]>(WATCHLIST);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [sourceOpen, setSourceOpen] = useState<boolean>(false);

  // Live price ticking effect
  useEffect(() => {
    const timer = setInterval(() => {
      setWatchlistData(prev => prev.map(item => {
        if (Math.random() > 0.4) {
          const delta = (Math.random() - 0.48) * (item.lastPrice * 0.002);
          const newPrice = Math.max(1, item.lastPrice + delta);
          return {
            ...item,
            lastPrice: Number(newPrice.toFixed(item.currency === 'IDR' && newPrice < 10000 ? 2 : (newPrice > 10000 ? 0 : 2))),
          };
        }
        return item;
      }));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const currentSymbolItem = useMemo(() => {
    return watchlistData.find(w => w.symbol === activeSymbol) || watchlistData[0];
  }, [activeSymbol, watchlistData]);

  // Check owned quantity of current symbol
  const ownedQuantity = useMemo(() => {
    const match = positions.find(p => p.symbol === activeSymbol);
    if (!match) return 100; // default mock quantity if not present
    return parseFloat(match.qty) || 0;
  }, [positions, activeSymbol]);

  const candleData = useMemo(() => {
    return generateCandlestickData(activeSymbol, 55);
  }, [activeSymbol]);

  const kdePriceData = useMemo(() => {
    return candleData.map(d => d.close);
  }, [candleData]);

  const filteredWatchlist = useMemo(() => {
    return watchlistData.filter(item => {
      const matchCat = watchlistCategory === 'Semua' || item.category === watchlistCategory;
      const query = (watchlistQuery || topSearch).trim().toLowerCase();
      const matchQ = !query ||
        item.symbol.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query);
      return matchCat && matchQ;
    });
  }, [watchlistData, watchlistCategory, watchlistQuery, topSearch]);

  const calculatedCost = useMemo(() => {
    const qty = parseFloat(tradeQty) || 0;
    return qty * currentSymbolItem.lastPrice;
  }, [tradeQty, currentSymbolItem]);

  // Recalculate quantity whenever slider or tab changes
  const handleSliderChange = (val: number | number[]) => {
    const pct = Array.isArray(val) ? val[0] : val;
    setSliderPct(pct);

    if (tradeTab === 'Buy') {
      const amountToSpend = (balanceIdr * pct) / 100;
      const qty = amountToSpend / (currentSymbolItem.lastPrice || 1);
      setTradeQty(qty > 10 ? qty.toFixed(2) : qty.toFixed(4));
    } else {
      const qtyToSell = (ownedQuantity * pct) / 100;
      setTradeQty(qtyToSell > 10 ? qtyToSell.toFixed(2) : qtyToSell.toFixed(4));
    }
  };

  // Sync slider whenever tradeQty changes manually
  const handleQtyInputChange = (val: string) => {
    setTradeQty(val);
    const parsedQty = parseFloat(val) || 0;
    if (tradeTab === 'Buy') {
      const cost = parsedQty * currentSymbolItem.lastPrice;
      const pct = Math.min(100, Math.max(0, (cost / (balanceIdr || 1)) * 100));
      setSliderPct(Math.round(pct));
    } else {
      const pct = Math.min(100, Math.max(0, (parsedQty / (ownedQuantity || 1)) * 100));
      setSliderPct(Math.round(pct));
    }
  };

  const handleTabChange = (newTab: 'Buy' | 'Sell') => {
    setTradeTab(newTab);
    setSliderPct(25);
    if (newTab === 'Buy') {
      const amountToSpend = (balanceIdr * 25) / 100;
      const qty = amountToSpend / (currentSymbolItem.lastPrice || 1);
      setTradeQty(qty > 10 ? qty.toFixed(2) : qty.toFixed(4));
    } else {
      const qtyToSell = (ownedQuantity * 25) / 100;
      setTradeQty(qtyToSell > 10 ? qtyToSell.toFixed(2) : qtyToSell.toFixed(4));
    }
  };

  const handleExecuteTrade = () => {
    const qty = parseFloat(tradeQty);
    if (!qty || qty <= 0) {
      setToastMsg(`Masukkan jumlah ${currentSymbolItem.symbol} yang valid`);
      return;
    }
    const cost = calculatedCost;

    if (tradeTab === 'Buy') {
      if (cost > balanceIdr) {
        setToastMsg('Saldo Daya Beli tidak mencukupi');
        return;
      }
      setBalanceIdr(prev => Math.max(0, prev - cost));
      const newPos: AccountPosition = {
        id: `pos-${Date.now()}`,
        symbol: currentSymbolItem.symbol,
        side: 'Buy',
        leverage: '1x',
        qty: tradeQty,
        avgFillPrice: currentSymbolItem.lastPrice,
        otherDetails: '-',
        pnl: 0,
        pnlCurrency: currentSymbolItem.currency,
        pnlPercent: 0,
        currentValue: cost,
        margin: '-',
      };
      setPositions(prev => [newPos, ...prev]);
    } else {
      setBalanceIdr(prev => prev + cost);
      setPositions(prev => prev.filter(p => p.symbol !== currentSymbolItem.symbol));
    }

    setToastMsg(`Order ${tradeTab === 'Buy' ? 'Beli' : 'Jual'} ${tradeQty} ${currentSymbolItem.symbol} Berhasil!`);
  };

  const handleClosePosition = (id: string, sym: string) => {
    setPositions(prev => prev.filter(p => p.id !== id));
    setToastMsg(`Posisi ${sym} berhasil ditutup!`);
  };

  const handleCancelOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
    setToastMsg(`Order #${id} dibatalkan`);
  };

  const positionColumns: DataTableColumn<AccountPosition>[] = [
    {
      id: 'symbol',
      header: 'Symbol',
      cell: (row) => <strong>{row.symbol}</strong>,
    },
    {
      id: 'side',
      header: 'Side',
      cell: (row) => (
        <span style={{ color: row.side === 'Buy' ? '#38bdf8' : '#ff5252', fontWeight: 600 }}>
          {row.side}
        </span>
      ),
    },
    {
      id: 'qty',
      header: 'Qty',
      cell: (row) => row.qty,
    },
    {
      id: 'avgFillPrice',
      header: 'Avg Fill Price',
      numeric: true,
      cell: (row) => row.avgFillPrice.toLocaleString(),
    },
    {
      id: 'pnl',
      header: 'PnL',
      numeric: true,
      cell: (row) => (
        <span style={{ color: row.pnl >= 0 ? '#00e676' : '#ff5252', fontWeight: 600 }}>
          {row.pnl >= 0 ? '+' : ''}{row.pnl.toLocaleString()} {row.pnlCurrency} ({row.pnlPercent}%)
        </span>
      ),
    },
    {
      id: 'currentValue',
      header: 'Current Value',
      numeric: true,
      cell: (row) => row.currentValue.toLocaleString(),
    },
    {
      id: 'actions',
      header: 'Action',
      align: 'right',
      cell: (row) => (
        <Button
          variant="tonal"
          size="xs"
          onClick={() => handleClosePosition(row.id, row.symbol)}
        >
          Tutup
        </Button>
      ),
    },
  ];

  const orderColumns: DataTableColumn<AccountOrder>[] = [
    { id: 'id', header: 'ID', cell: (r) => r.id },
    { id: 'symbol', header: 'Symbol', cell: (r) => <strong>{r.symbol}</strong> },
    { id: 'side', header: 'Side', cell: (r) => <span style={{ color: r.side === 'Buy' ? '#00e676' : '#ff5252', fontWeight: 600 }}>{r.side}</span> },
    { id: 'type', header: 'Type', cell: (r) => r.type },
    { id: 'price', header: 'Price', numeric: true, cell: (r) => r.price.toLocaleString() },
    { id: 'qty', header: 'Qty', numeric: true, cell: (r) => r.qty },
    { id: 'date', header: 'Date', cell: (r) => r.date },
    {
      id: 'actions',
      header: 'Action',
      align: 'right',
      cell: (r) => (
        <Button variant="tonal" size="xs" onClick={() => handleCancelOrder(r.id)}>
          Batal
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      {/* 1. Header Navigation with TopAppBar */}
      <TopAppBar
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar name="P" size="sm" tone={1} />
            <div>
              <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Pluang Trade</span>
            </div>
          </div>
        }
        start={<IconButton icon="menu" label="Menu" />}
        end={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Search
              placeholder="Cari saham, crypto..."
              value={topSearch}
              onChange={(e) => setTopSearch(e.target.value)}
              trailingIcon={topSearch ? "close" : undefined}
              onTrailingClick={() => setTopSearch('')}
            />
            <Chip
              kind="assist"
              icon={hideBalance ? 'visibility_off' : 'visibility'}
              label={hideBalance ? 'Saldo: •••••' : `Daya Beli: Rp ${balanceIdr.toLocaleString()}`}
              onClick={() => setHideBalance(!hideBalance)}
            />
            <Button
              variant="filled"
              startIcon="add_card"
              onClick={() => {
                setBalanceIdr(prev => prev + 1000000);
                setToastMsg('Top Up Rp 1.000.000 Berhasil!');
              }}
            >
              Top Up
            </Button>
            <Avatar name="Hadi Gunawan" size="sm" tone={3} />
          </div>
        }
      />

      {/* Sub Header Tabs */}
      <div style={{ borderBottom: '1px solid var(--md-sys-color-outline-variant, #1e2430)' }}>
        <Tabs
          items={[
            { value: 'trade', label: 'Trade', icon: 'candlestick_chart' },
            { value: 'portfolio', label: 'Portofolio', icon: 'account_balance_wallet' },
            { value: 'saldo', label: 'Saldo', icon: 'account_balance' },
            { value: 'history', label: 'Riwayat Transaksi', icon: 'history' },
          ]}
          value={navTab}
          onChange={(val) => setNavTab(val)}
        />
      </div>

      {/* 2. Top Ticker Chips Bar */}
      <div className={styles.tickerBanner}>
        <Chip kind="assist" label="Top Gainers" icon="trending_up" selected />
        <div className={styles.tickerMarquee}>
          {TOP_GAINERS.map((t, idx) => (
            <Chip
              key={idx}
              kind="suggestion"
              label={`${t.symbol} +${t.changePercent}%`}
              onClick={() => {
                const found = watchlistData.find(w => w.symbol.startsWith(t.symbol));
                if (found) setActiveSymbol(found.symbol);
              }}
            />
          ))}
        </div>
      </div>

      {/* 3. Main Workspace Layout */}
      <div className={styles.workspace}>
        {/* Left Drawing Tools Rail using NavigationRail */}
        <NavigationRail
          items={[
            { value: 'crosshair', label: 'Pointer', icon: 'design_services' },
            { value: 'trendline', label: 'Line', icon: 'show_chart' },
            { value: 'fork', label: 'Fork', icon: 'call_split' },
            { value: 'brush', label: 'Brush', icon: 'brush' },
            { value: 'text', label: 'Text', icon: 'title' },
            { value: 'measure', label: 'Measure', icon: 'straighten' },
            { value: 'lock', label: 'Lock', icon: 'lock' },
            { value: 'trash', label: 'Trash', icon: 'delete' },
          ]}
          value={leftRailItem}
          onChange={(val) => setLeftRailItem(val)}
        />

        {/* Center Panel (Chart & Account Table) */}
        <section className={styles.centerPanel}>
          {/* Chart Header Bar */}
          <div className={styles.chartToolbar}>
            <div className={styles.chartToolbarLeft}>
              <Menu
                trigger={(props) => (
                  <Button variant="outlined" size="xs" startIcon="arrow_drop_down" {...props}>
                    {currentSymbolItem.symbol}
                  </Button>
                )}
                items={watchlistData.slice(0, 8).map(w => ({
                  label: `${w.symbol} (${w.lastPrice})`,
                  onClick: () => setActiveSymbol(w.symbol)
                }))}
              />

              <SegmentedButton
                options={[
                  { value: '5y', label: '5Y' },
                  { value: '1y', label: '1Y' },
                  { value: '6m', label: '6M' },
                  { value: '1m', label: '1M' },
                  { value: '1d', label: '1D' },
                ]}
                value={timeframe}
                onChange={(val) => setTimeframe(val as string)}
              />

              <Menu
                trigger={(props) => (
                  <Button variant="tonal" size="xs" startIcon="insights" {...props}>
                    Indicators
                  </Button>
                )}
                items={[
                  {
                    label: `${showSma ? '✓' : ' '} Moving Average (SMA 9)`,
                    onClick: () => setShowSma(!showSma)
                  },
                  {
                    label: `${showBollinger ? '✓' : ' '} Bollinger Bands`,
                    onClick: () => setShowBollinger(!showBollinger)
                  },
                ]}
              />

              <div className={styles.buySellBadges}>
                <span className={styles.sellBadge}>
                  Sell {(currentSymbolItem.lastPrice * 0.99).toFixed(0)}
                </span>
                <span className={styles.buyBadge}>
                  Buy {currentSymbolItem.lastPrice}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <IconButton icon="settings" label="Settings" />
              <IconButton icon="fullscreen" label="Fullscreen" />
            </div>
          </div>

          {/* Chart Card using MD3 KernelDensityEstimation Component from library */}
          <Card variant="filled" style={{ borderRadius: 0, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '4px 8px' }}>
            <KernelDensityEstimation
              data={kdePriceData}
              curveColor="#38bdf8"
              barColor={currentSymbolItem.change >= 0 ? 'rgba(0, 230, 118, 0.25)' : 'rgba(255, 82, 82, 0.25)'}
              showHistogram={true}
              showControls={false}
              showKernelSelector={false}
              height={340}
              title={`Distribusi Estimasi Densitas Harga (KDE) — ${currentSymbolItem.symbol}`}
              xAxisTitle={`Harga (${currentSymbolItem.currency})`}
              yAxisTitle="Probabilitas Densitas"
              xFormatter={(val) => `${currentSymbolItem.currency === 'IDR' ? 'Rp' : '$'} ${val.toLocaleString()}`}
            />
          </Card>

          {/* Bottom Account Manager DataTable Panel */}
          <Card variant="outlined" className={`${styles.accountPanel} ${accountCollapsed ? styles.accountPanelCollapsed : ''}`}>
            <div className={styles.accountHeader}>
              <div className={styles.accountTabs}>
                <Tabs
                  items={[
                    { value: 'positions', label: `Positions (${positions.length})`, icon: 'view_list' },
                    { value: 'orders', label: `Orders (${orders.length})`, icon: 'pending_actions' },
                  ]}
                  value={accountTab}
                  onChange={(val) => setAccountTab(val)}
                />
              </div>

              <IconButton
                icon={accountCollapsed ? 'expand_less' : 'expand_more'}
                label={accountCollapsed ? 'Expand panel' : 'Collapse panel'}
                onClick={() => setAccountCollapsed(!accountCollapsed)}
              />
            </div>

            {!accountCollapsed && (
              <div className={styles.accountContent}>
                {accountTab === 'positions' ? (
                  <DataTable
                    columns={positionColumns as unknown as DataTableColumn<unknown>[]}
                    rows={positions as unknown[]}
                    variant="flush"
                    dense
                    ariaLabel="Account positions table"
                  />
                ) : (
                  <DataTable
                    columns={orderColumns as unknown as DataTableColumn<unknown>[]}
                    rows={orders as unknown[]}
                    variant="flush"
                    dense
                    ariaLabel="Account orders table"
                  />
                )}
              </div>
            )}
          </Card>
        </section>

        {/* Watchlist Card Panel */}
        <Card variant="outlined" className={styles.watchlistPanel}>
          <div className={styles.watchlistHeader}>
            <Search
              placeholder="Filter symbol..."
              value={watchlistQuery}
              onChange={(e) => setWatchlistQuery(e.target.value)}
              trailingIcon={watchlistQuery ? "close" : undefined}
              onTrailingClick={() => setWatchlistQuery('')}
            />
            <div className={styles.watchlistCategoryBar}>
              <SegmentedButton
                options={[
                  { value: 'Semua', label: 'Semua' },
                  { value: 'Crypto', label: 'Crypto' },
                  { value: 'Saham', label: 'Saham' },
                  { value: 'Futures', label: 'Futures' },
                ]}
                value={watchlistCategory}
                onChange={(val) => setWatchlistCategory(val as string)}
              />
            </div>
          </div>

          <Divider />

          <div className={styles.watchlistList}>
            {filteredWatchlist.map((item) => (
              <div
                key={item.symbol}
                className={`${styles.watchlistRow} ${item.symbol === activeSymbol ? styles.watchlistRowActive : ''}`}
                onClick={() => setActiveSymbol(item.symbol)}
              >
                <div className={styles.symbolName}>
                  <Avatar name={item.symbol} size="xs" shape="rounded" tone={1} />
                  <span>{item.symbol}</span>
                </div>
                <div className={styles.symbolPrice}>{item.lastPrice.toLocaleString()}</div>
                <div className={`${styles.symbolChg} ${item.changePercent >= 0 ? styles.pnlPositive : styles.pnlNegative}`}>
                  {item.changePercent >= 0 ? '+' : ''}{item.changePercent}%
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Order Execution Card Panel */}
        <Card variant="filled" className={styles.tradePanel}>
          {/* Custom Buy / Sell Toggle Tabs */}
          <div className={styles.tradeTabs}>
            <button
              type="button"
              className={`${styles.tradeTab} ${tradeTab === 'Buy' ? styles.tradeTabBuyActive : ''}`}
              onClick={() => handleTabChange('Buy')}
            >
              Beli
            </button>
            <button
              type="button"
              className={`${styles.tradeTab} ${tradeTab === 'Sell' ? styles.tradeTabSellActive : ''}`}
              onClick={() => handleTabChange('Sell')}
            >
              Jual
            </button>
          </div>

          <div className={styles.tradeBalanceRow}>
            <span>{tradeTab === 'Buy' ? 'Daya Beli' : 'Kepemilikan'}</span>
            <span className={styles.tradeBalanceVal}>
              {tradeTab === 'Buy'
                ? `Rp ${balanceIdr.toLocaleString()}`
                : `${ownedQuantity} ${currentSymbolItem.symbol}`}
            </span>
          </div>

          <TextField
            label={`Harga (${currentSymbolItem.currency})`}
            value={currentSymbolItem.lastPrice.toLocaleString()}
            readOnly
          />

          <TextField
            label={`Jumlah ${currentSymbolItem.symbol}`}
            value={tradeQty}
            onChange={(e) => handleQtyInputChange(e.target.value)}
            type="number"
          />

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)', marginBottom: 4 }}>
              <span>Alokasi Saldo</span>
              <span>{sliderPct}%</span>
            </div>
            <Slider
              value={sliderPct}
              onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
              min={0}
              max={100}
              step={5}
            />
            <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
              {[25, 50, 75, 100].map(pct => (
                <Chip
                  key={pct}
                  kind="assist"
                  label={`${pct}%`}
                  selected={sliderPct === pct}
                  onClick={() => handleSliderChange(pct)}
                />
              ))}
            </div>
          </div>

          <Divider />

          <div className={styles.costBreakdown}>
            <div className={styles.costRow}>
              <span>Est. Total</span>
              <span>{currentSymbolItem.currency === 'IDR' ? 'Rp' : '$'} {calculatedCost.toLocaleString()}</span>
            </div>
            <div className={styles.costRow}>
              <span>Biaya Transaksi</span>
              <span>Gratis</span>
            </div>
            <div className={styles.costRowBold}>
              <span>Est. Perlu {tradeTab === 'Buy' ? 'Dibayarkan' : 'Diterima'}</span>
              <span>{currentSymbolItem.currency === 'IDR' ? 'Rp' : '$'} {calculatedCost.toLocaleString()}</span>
            </div>
          </div>

          <Button
            variant="filled"
            size="lg"
            className={tradeTab === 'Buy' ? styles.executeBuyBtn : styles.executeSellBtn}
            onClick={handleExecuteTrade}
          >
            {tradeTab === 'Buy' ? `Beli ${currentSymbolItem.symbol}` : `Jual ${currentSymbolItem.symbol}`}
          </Button>

          <p className={styles.tradeDisclaimer}>
            Dengan membuat order ini, kamu telah menyetujui Syarat dan Ketentuan Pluang.
          </p>
        </Card>

        {/* Far Right Action Rail */}
        <NavigationRail
          items={[
            { value: 'aura', label: 'Aura AI', icon: 'auto_awesome' },
            { value: 'watchlist', label: 'Watchlist', icon: 'star' },
            { value: 'orderbook', label: 'Order Book', icon: 'toc' },
            { value: 'alerts', label: 'Alerts', icon: 'notifications' },
            { value: 'holdings', label: 'Holdings', icon: 'account_balance_wallet' },
          ]}
          value={rightRailItem}
          onChange={(val) => setRightRailItem(val)}
        />
      </div>

      {/* Floating View Source Drawer Button */}
      <div className={styles.sourceFab}>
        <Tooltip label="Inspect page implementation source">
          <Button
            variant="filled"
            startIcon="code"
            onClick={() => setSourceOpen(true)}
          >
            View Source
          </Button>
        </Tooltip>
      </div>

      {/* Feedback Toast */}
      {toastMsg && (
        <Snackbar
          message={toastMsg}
          open={Boolean(toastMsg)}
          onClose={() => setToastMsg(null)}
          duration={3000}
        />
      )}

      {/* Example Source Sheet Drawer */}
      <ExampleSourceSheet
        open={sourceOpen}
        onClose={() => setSourceOpen(false)}
        title="Pluang Trading UI"
        pageSource={pageSource}
        dataSource={dataSource}
        styleSource={styleSource}
      />
    </div>
  );
}
