export interface TickerItem {
  symbol: string;
  name: string;
  lastPrice: number;
  change: number;
  changePercent: number;
  currency: 'IDR' | 'USD';
  iconColor: string;
  category: 'Semua' | 'Crypto' | 'Saham' | 'Futures';
}

export interface CandlestickPoint {
  time: string;
  dateStr: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  sma9?: number;
  upperBand?: number;
  lowerBand?: number;
}

export interface AccountPosition {
  id: string;
  symbol: string;
  side: 'Buy' | 'Sell';
  leverage: string;
  qty: string;
  avgFillPrice: number;
  otherDetails: string;
  pnl: number;
  pnlCurrency: 'IDR' | 'USD';
  pnlPercent: number;
  currentValue: number;
  margin: string;
}

export interface AccountOrder {
  id: string;
  symbol: string;
  side: 'Buy' | 'Sell';
  type: 'Limit' | 'Market' | 'Stop';
  price: number;
  qty: string;
  status: 'Open' | 'Pending' | 'Filled';
  date: string;
}

export const TOP_GAINERS: { symbol: string; changePercent: number }[] = [
  { symbol: 'BANK', changePercent: 16.25 },
  { symbol: 'TLM', changePercent: 10.20 },
  { symbol: 'SAFE', changePercent: 9.99 },
  { symbol: 'UB', changePercent: 10.15 },
  { symbol: 'EPIC', changePercent: 9.53 },
  { symbol: 'MIRA', changePercent: 57.09 },
  { symbol: 'TAC', changePercent: 18.34 },
  { symbol: 'ESE', changePercent: 17.38 },
  { symbol: 'LISTA', changePercent: 15.56 },
  { symbol: 'UAI', changePercent: 15.97 },
];

export const WATCHLIST: TickerItem[] = [
  { symbol: 'SIREN-IDR', name: 'Siren Token', lastPrice: 1228, change: -6, changePercent: -0.49, currency: 'IDR', iconColor: '#00e676', category: 'Crypto' },
  { symbol: 'MANDI', name: 'Bank Mandiri', lastPrice: 1145.51, change: 5.12, changePercent: 0.45, currency: 'IDR', iconColor: '#29b6f6', category: 'Saham' },
  { symbol: 'XRP-IDR', name: 'XRP Token', lastPrice: 20588, change: 83, changePercent: 0.41, currency: 'IDR', iconColor: '#9c27b0', category: 'Crypto' },
  { symbol: 'DOT-IDR', name: 'Polkadot', lastPrice: 15067, change: -202, changePercent: -1.32, currency: 'IDR', iconColor: '#e91e63', category: 'Crypto' },
  { symbol: 'POL-IDR', name: 'Polygon', lastPrice: 1410, change: -24, changePercent: -1.67, currency: 'IDR', iconColor: '#7c4dff', category: 'Crypto' },
  { symbol: 'SUI-IDR', name: 'Sui Network', lastPrice: 13813, change: 141, changePercent: 1.03, currency: 'IDR', iconColor: '#00bcd4', category: 'Crypto' },
  { symbol: 'ETH-IDR', name: 'Ethereum', lastPrice: 34897468, change: 255458, changePercent: 0.74, currency: 'IDR', iconColor: '#3f51b5', category: 'Crypto' },
  { symbol: 'SOL-IDR', name: 'Solana', lastPrice: 1400130, change: 6189, changePercent: 0.44, currency: 'IDR', iconColor: '#18ffff', category: 'Crypto' },
  { symbol: 'BTC-IDR', name: 'Bitcoin', lastPrice: 1182404119, change: -9188758, changePercent: -0.76, currency: 'IDR', iconColor: '#ff9800', category: 'Crypto' },
  { symbol: 'TON-IDR', name: 'Toncoin', lastPrice: 28911, change: 304, changePercent: 1.07, currency: 'IDR', iconColor: '#0288d1', category: 'Crypto' },
  { symbol: 'EBAY', name: 'eBay Inc', lastPrice: 112.11, change: -0.84, changePercent: -0.73, currency: 'USD', iconColor: '#e53935', category: 'Saham' },
  { symbol: 'TSLA', name: 'Tesla Motors', lastPrice: 378.35, change: -0.53, changePercent: -0.14, currency: 'USD', iconColor: '#d32f2f', category: 'Saham' },
  { symbol: 'AMD', name: 'Advanced Micro', lastPrice: 554.85, change: 10.52, changePercent: 1.93, currency: 'USD', iconColor: '#43a047', category: 'Saham' },
  { symbol: 'PLTR', name: 'Palantir Tech', lastPrice: 128.83, change: -5.79, changePercent: -4.37, currency: 'USD', iconColor: '#ef5350', category: 'Saham' },
  { symbol: 'AMZN', name: 'Amazon.com', lastPrice: 175.63, change: 1.06, changePercent: 0.60, currency: 'USD', iconColor: '#ffb300', category: 'Saham' },
  { symbol: 'AAPL', name: 'Apple Inc', lastPrice: 324.89, change: -2.75, changePercent: -0.84, currency: 'USD', iconColor: '#78909c', category: 'Saham' },
  { symbol: 'NVDA', name: 'NVIDIA Corp', lastPrice: 213.02, change: 5.88, changePercent: 2.84, currency: 'USD', iconColor: '#76b900', category: 'Saham' },
  { symbol: 'BTC-FUT', name: 'BTC Futures 2026', lastPrice: 65400, change: 450, changePercent: 0.69, currency: 'USD', iconColor: '#ff6d00', category: 'Futures' },
];

export const INITIAL_POSITIONS: AccountPosition[] = [
  {
    id: 'pos-1',
    symbol: 'BTC-IDR',
    side: 'Buy',
    leverage: '1x',
    qty: '0.00424899',
    avgFillPrice: 1175457979,
    otherDetails: '-',
    pnl: 29514.08,
    pnlCurrency: 'IDR',
    pnlPercent: 0.59,
    currentValue: 5024023,
    margin: '-',
  },
  {
    id: 'pos-2',
    symbol: 'GOOG',
    side: 'Buy',
    leverage: '1x',
    qty: '0.737628963',
    avgFillPrice: 370.74,
    otherDetails: '-',
    pnl: -17.56,
    pnlCurrency: 'USD',
    pnlPercent: -6.42,
    currentValue: 255.91,
    margin: '-',
  },
];

export const INITIAL_ORDERS: AccountOrder[] = [
  {
    id: 'ord-101',
    symbol: 'ETH-IDR',
    side: 'Buy',
    type: 'Limit',
    price: 34000000,
    qty: '0.1500',
    status: 'Open',
    date: '2026-07-22 22:45',
  },
  {
    id: 'ord-102',
    symbol: 'NVDA',
    side: 'Sell',
    type: 'Limit',
    price: 225.00,
    qty: '2.0000',
    status: 'Open',
    date: '2026-07-22 21:10',
  },
];

export function generateCandlestickData(symbol: string, count = 60): CandlestickPoint[] {
  const baseItem = WATCHLIST.find(w => w.symbol === symbol) || WATCHLIST[0];
  let price = baseItem.lastPrice * 0.92;
  const isIdr = baseItem.currency === 'IDR';
  const volatility = isIdr ? (price > 100000 ? 0.015 : 0.035) : 0.02;

  const dates = [
    'May 2', 'May 5', 'May 8', 'May 12', 'May 15', 'May 19', 'May 22', 'May 26', 'May 29',
    'Jun 2', 'Jun 5', 'Jun 8', 'Jun 12', 'Jun 15', 'Jun 19', 'Jun 22', 'Jun 26', 'Jun 29',
    'Jul 2', 'Jul 5', 'Jul 8', 'Jul 12', 'Jul 15', 'Jul 19', 'Jul 22', 'Jul 26', 'Jul 29',
    'Aug 2', 'Aug 5', 'Aug 8', 'Aug 12', 'Aug 15', 'Aug 19', 'Aug 22'
  ];

  const points: CandlestickPoint[] = [];
  const closes: number[] = [];

  for (let i = 0; i < count; i++) {
    const changeFactor = (Math.random() - 0.49) * volatility;
    const open = price;
    const close = Math.max(1, open * (1 + changeFactor));
    const high = Math.max(open, close) * (1 + Math.random() * (volatility * 0.7));
    const low = Math.min(open, close) * (1 - Math.random() * (volatility * 0.7));
    const volume = Math.floor(Math.random() * 50000 + 10000) * (isIdr ? 1 : 10);

    const dateStr = dates[i % dates.length];
    closes.push(close);

    // SMA 9 calculation
    let sma9 = close;
    if (i >= 8) {
      const slice = closes.slice(i - 8, i + 1);
      sma9 = slice.reduce((a, b) => a + b, 0) / slice.length;
    }

    // Bollinger Bands (20 period)
    let upperBand = high;
    let lowerBand = low;
    if (i >= 19) {
      const slice = closes.slice(i - 19, i + 1);
      const mean = slice.reduce((a, b) => a + b, 0) / slice.length;
      const stdDev = Math.sqrt(slice.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / slice.length);
      upperBand = mean + stdDev * 2;
      lowerBand = mean - stdDev * 2;
    }

    points.push({
      time: `2026-07-${(i % 28 + 1).toString().padStart(2, '0')}`,
      dateStr,
      open: Number(open.toFixed(isIdr && price < 10000 ? 2 : (price > 10000 ? 0 : 2))),
      high: Number(high.toFixed(isIdr && price < 10000 ? 2 : (price > 10000 ? 0 : 2))),
      low: Number(low.toFixed(isIdr && price < 10000 ? 2 : (price > 10000 ? 0 : 2))),
      close: Number(close.toFixed(isIdr && price < 10000 ? 2 : (price > 10000 ? 0 : 2))),
      volume,
      sma9: Number(sma9.toFixed(isIdr && price < 10000 ? 2 : (price > 10000 ? 0 : 2))),
      upperBand: Number(upperBand.toFixed(isIdr && price < 10000 ? 2 : (price > 10000 ? 0 : 2))),
      lowerBand: Number(lowerBand.toFixed(isIdr && price < 10000 ? 2 : (price > 10000 ? 0 : 2))),
    });

    price = close;
  }

  if (points.length > 0) {
    points[points.length - 1].close = baseItem.lastPrice;
  }

  return points;
}
