import { useMemo, useState } from 'react';
import {
  TopAppBar, IconButton, Badge, Search, Menu, Icon,
  SegmentedButton, Tabs, Chip, FAB, Snackbar, Tooltip,
  Divider, ProgressIndicator,
} from '../../lib';
import { cn } from '../../lib/utils/cn';
import styles from './ShopDashboardPage.module.css';

// ---------------------- mock data ----------------------

const REVENUE_BY_RANGE: Record<string, number[]> = {
  '7d':  [4200, 4800, 5100, 4900, 6200, 7300, 6800],
  '30d': [3800, 4100, 4500, 4700, 4900, 5300, 5100, 5400, 5800, 6100, 6400, 6700, 7000, 6800, 7200, 7600, 7400, 7800, 8100, 7900, 8300, 8600, 8400, 8900, 9100, 8700, 9400, 9700, 9300, 9800],
  '90d': Array.from({ length: 12 }, (_, i) => 3000 + i * 600 + Math.round(Math.sin(i / 2) * 500)),
};
const TARGET_BY_RANGE: Record<string, number[]> = {
  '7d':  [5000, 5000, 5000, 5500, 5500, 6500, 6500],
  '30d': Array(30).fill(0).map((_, i) => 4000 + i * 200),
  '90d': Array(12).fill(0).map((_, i) => 3500 + i * 550),
};

const KPIS = [
  { key: 'revenue', label: 'Total revenue', value: '$48,392', delta: 12.4, deltaLabel: 'vs last week', icon: 'payments', tone: '' },
  { key: 'orders',  label: 'Orders',        value: '1,284',  delta:  8.1, deltaLabel: 'vs last week', icon: 'shopping_cart', tone: 'kpiIconAlt' },
  { key: 'aov',     label: 'Avg. order value', value: '$37.69', delta: 3.2, deltaLabel: 'vs last week', icon: 'price_check', tone: 'kpiIconTri' },
  { key: 'refunds', label: 'Refunds',       value: '$1,204', delta: -2.6, deltaLabel: 'vs last week', icon: 'undo', tone: 'kpiIconErr' },
] as const;

const SPARK = [
  [12,18,14,22,28,24,32,38,34,42],
  [22,18,26,20,30,28,34,32,40,36],
  [10,16,14,20,18,24,22,30,26,34],
  [40,36,32,34,28,30,24,20,22,18],
];

const TOP_PRODUCTS = [
  { name: 'Wireless Earbuds Pro', sku: 'SKU-2891', sold: 482, revenue: 19_280, icon: 'headphones', pct: 100 },
  { name: 'Smart Watch Series X', sku: 'SKU-1102', sold: 351, revenue: 17_550, icon: 'watch', pct: 91 },
  { name: 'Mechanical Keyboard', sku: 'SKU-4439', sold: 297, revenue: 11_880, icon: 'keyboard', pct: 62 },
  { name: 'USB-C Hub 8-in-1',   sku: 'SKU-7720', sold: 264, revenue:  6_336, icon: 'usb', pct: 33 },
  { name: 'Webcam 4K Pro',      sku: 'SKU-5301', sold: 198, revenue:  9_900, icon: 'videocam', pct: 51 },
];

type OrderStatus = 'Paid' | 'Shipped' | 'Pending' | 'Refunded';
const ORDERS: Array<{
  id: string; customer: string; email: string; items: number;
  total: number; status: OrderStatus; date: string;
}> = [
  { id: '#10293', customer: 'Sarah Chen',     email: 'sarah@example.com',  items: 3, total: 248.50, status: 'Paid',     date: '2 min ago' },
  { id: '#10292', customer: 'Marcus Johnson', email: 'marcus@example.com', items: 1, total:  49.00, status: 'Shipped',  date: '14 min ago' },
  { id: '#10291', customer: 'Priya Patel',    email: 'priya@example.com',  items: 5, total: 412.20, status: 'Pending',  date: '32 min ago' },
  { id: '#10290', customer: 'Liam OBrien',    email: 'liam@example.com',   items: 2, total: 159.99, status: 'Paid',     date: '1 hr ago' },
  { id: '#10289', customer: 'Yuki Tanaka',    email: 'yuki@example.com',   items: 1, total:  29.50, status: 'Refunded', date: '2 hr ago' },
  { id: '#10288', customer: 'Aisha Bello',    email: 'aisha@example.com',  items: 4, total: 318.75, status: 'Shipped',  date: '3 hr ago' },
  { id: '#10287', customer: 'David Kim',      email: 'david@example.com',  items: 2, total:  98.40, status: 'Paid',     date: '4 hr ago' },
  { id: '#10286', customer: 'Elena Rossi',    email: 'elena@example.com',  items: 6, total: 524.00, status: 'Pending',  date: '5 hr ago' },
];

const ACTIVITY = [
  { icon: 'shopping_bag', text: 'New order #10293 from Sarah Chen', time: '2 min ago' },
  { icon: 'star', text: 'New 5-star review on Wireless Earbuds Pro', time: '18 min ago' },
  { icon: 'person_add', text: 'New customer signup: marcus@example.com', time: '24 min ago' },
  { icon: 'inventory_2', text: 'Stock alert: USB-C Hub is running low', time: '1 hr ago' },
  { icon: 'undo', text: 'Refund issued for order #10289', time: '2 hr ago' },
  { icon: 'local_shipping', text: 'Order #10288 shipped via FedEx', time: '3 hr ago' },
];

const STOCK_ALERTS = [
  { name: 'USB-C Hub 8-in-1',   left: 3 },
  { name: 'Wireless Charger',   left: 5 },
  { name: 'Phone Stand Premium', left: 7 },
];

// ---------------------- helpers ----------------------

function Sparkline({ data, up }: { data: number[]; up: boolean }) {
  const w = 100, h = 40;
  const max = Math.max(...data), min = Math.min(...data);
  const dx = w / (data.length - 1);
  const pts = data.map((v, i) => [i * dx, h - ((v - min) / (max - min || 1)) * (h - 4) - 2] as [number, number]);
  const d = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(' ');
  return (
    <svg className={styles.sparkline} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <path d={d} fill="none" stroke={up ? 'currentColor' : 'var(--md-sys-color-error)'} strokeWidth={1.5} />
    </svg>
  );
}

function SalesChart({ revenue, target }: { revenue: number[]; target: number[] }) {
  const w = 720, h = 240, pad = { l: 40, r: 12, t: 16, b: 28 };
  const xN = revenue.length;
  const all = [...revenue, ...target];
  const max = Math.max(...all) * 1.1;
  const min = 0;
  const x = (i: number) => pad.l + (i / (xN - 1)) * (w - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - (v - min) / (max - min || 1)) * (h - pad.t - pad.b);

  const linePath = revenue.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(v)}`).join(' ');
  const areaPath = `${linePath} L ${x(xN - 1)} ${h - pad.b} L ${x(0)} ${h - pad.b} Z`;
  const targetPath = target.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(v)}`).join(' ');

  const ticks = 4;
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) => (max * i) / ticks);

  return (
    <svg className={styles.chart} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      {yTicks.map((t, i) => (
        <g key={i}>
          <line className={styles.chartGrid} x1={pad.l} y1={y(t)} x2={w - pad.r} y2={y(t)} />
          <text className={styles.chartLabel} x={pad.l - 8} y={y(t) + 4} textAnchor="end">
            ${(t / 1000).toFixed(1)}k
          </text>
        </g>
      ))}
      <path className={styles.chartArea} d={areaPath} />
      <path className={styles.chartLine} d={linePath} />
      <path className={styles.chartLine2} d={targetPath} />
      {revenue.map((v, i) => (
        <circle key={i} className={styles.chartDot} cx={x(i)} cy={y(v)} r={3} />
      ))}
    </svg>
  );
}

// ---------------------- page ----------------------

type Range = '7d' | '30d' | '90d';
type TabId = 'orders' | 'products' | 'customers';

const initials = (name: string) =>
  name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();

const statusClass: Record<OrderStatus, string> = {
  Paid: styles.statusPaid, Shipped: styles.statusShipped,
  Pending: styles.statusPending, Refunded: styles.statusRefund,
};

export function ShopDashboardPage() {
  const [range, setRange] = useState<Range>('7d');
  const [tab, setTab] = useState<TabId>('orders');
  const [statusFilter, setStatusFilter] = useState<OrderStatus[]>([]);
  const [snack, setSnack] = useState<string | null>(null);

  const revenue = REVENUE_BY_RANGE[range];
  const target = TARGET_BY_RANGE[range];
  const total = useMemo(() => revenue.reduce((a, b) => a + b, 0), [revenue]);

  const filteredOrders = useMemo(
    () => statusFilter.length ? ORDERS.filter(o => statusFilter.includes(o.status)) : ORDERS,
    [statusFilter],
  );

  const toggleFilter = (s: OrderStatus) =>
    setStatusFilter(f => f.includes(s) ? f.filter(x => x !== s) : [...f, s]);

  return (
    <div className={styles.page}>
      {/* Top app bar */}
      <TopAppBar
        variant="small"
        title="Acme Store"
        start={<IconButton icon="storefront" label="Store" variant="tonal" />}
        end={
          <>
            <Search placeholder="Search orders, products…" />
            <Tooltip label="Notifications">
              <Badge count={5}>
                <IconButton icon="notifications" label="Notifications" />
              </Badge>
            </Tooltip>
            <Tooltip label="Help">
              <IconButton icon="help" label="Help" />
            </Tooltip>
            <Menu
              trigger={(p) => (
                <button {...p} type="button" className={styles.profile}>
                  <span className={styles.avatar}>JD</span>
                  <span className={styles.profileName}>Jane Doe</span>
                  <Icon name="expand_more" size={18} />
                </button>
              )}
              items={[
                { label: 'Profile', icon: 'person', onClick: () => setSnack('Opening profile…') },
                { label: 'Settings', icon: 'settings', onClick: () => setSnack('Opening settings…') },
                { label: 'Billing', icon: 'credit_card' },
                { divider: true, label: '' },
                { label: 'Sign out', icon: 'logout' },
              ]}
            />
          </>
        }
      />

      {/* Section header */}
      <div className={styles.topbar}>
        <div>
          <div className={styles.topbarTitle}>Dashboard</div>
          <div className={styles.topbarSub}>
            Welcome back, Jane — here's what's happening today.
          </div>
        </div>
        <div className={styles.topbarSpacer} />
        <div className={styles.topbarRight}>
          <SegmentedButton
            value={range}
            onChange={(v) => setRange(v as Range)}
            options={[
              { value: '7d',  label: '7 days' },
              { value: '30d', label: '30 days' },
              { value: '90d', label: '90 days' },
            ]}
          />
          <Tooltip label="Export"><IconButton icon="download" label="Export" variant="tonal" /></Tooltip>
        </div>
      </div>

      {/* KPI cards */}
      <div className={styles.kpiGrid}>
        {KPIS.map((k, i) => {
          const up = k.delta >= 0;
          return (
            <div key={k.key} className={styles.kpi}>
              <div className={styles.kpiHeader}>
                <span className={styles.kpiLabel}>{k.label}</span>
                <span className={cn(styles.kpiIcon, k.tone && (styles as any)[k.tone])}>
                  <Icon name={k.icon} size={20} />
                </span>
              </div>
              <div className={styles.kpiValue}>{k.value}</div>
              <div>
                <span className={cn(styles.kpiDelta, up ? styles.up : styles.down)}>
                  <Icon name={up ? 'trending_up' : 'trending_down'} size={16} />
                  {up ? '+' : ''}{k.delta}%
                </span>{' '}
                <span className={styles.kpiDeltaLabel}>{k.deltaLabel}</span>
              </div>
              <Sparkline data={SPARK[i]} up={up} />
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className={styles.row}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>Sales overview</div>
            <div className={styles.legend}>
              <span className={styles.legendItem}><span className={styles.legendSwatch} />Revenue</span>
              <span className={styles.legendItem}><span className={cn(styles.legendSwatch, styles.alt)} />Target</span>
            </div>
            <Menu
              trigger={(p) => <IconButton icon="more_vert" label="More" {...p} />}
              items={[
                { label: 'Download CSV', icon: 'download' },
                { label: 'Compare period', icon: 'compare_arrows' },
                { label: 'Configure', icon: 'tune' },
              ]}
            />
          </div>
          <SalesChart revenue={revenue} target={target} />
          <Divider />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ font: 'var(--md-sys-typescale-body-small)', color: 'var(--md-sys-color-on-surface-variant)' }}>
                Total revenue
              </div>
              <div style={{ font: 'var(--md-sys-typescale-headline-small)' }}>
                ${total.toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ font: 'var(--md-sys-typescale-body-small)', color: 'var(--md-sys-color-on-surface-variant)' }}>
                Conversion rate
              </div>
              <div style={{ font: 'var(--md-sys-typescale-headline-small)' }}>3.24%</div>
            </div>
            <div>
              <div style={{ font: 'var(--md-sys-typescale-body-small)', color: 'var(--md-sys-color-on-surface-variant)' }}>
                Sessions
              </div>
              <div style={{ font: 'var(--md-sys-typescale-headline-small)' }}>42,180</div>
            </div>
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>Top products</div>
            <IconButton icon="open_in_new" label="View all" />
          </div>
          {TOP_PRODUCTS.map(p => (
            <div key={p.sku} className={styles.product}>
              <span className={styles.productThumb}><Icon name={p.icon} size={22} /></span>
              <div className={styles.productMain}>
                <div className={styles.productName}>{p.name}</div>
                <div className={styles.productMeta}>{p.sku} · {p.sold} sold</div>
                <div className={styles.bar}><div className={styles.barFill} style={{ width: `${p.pct}%` }} /></div>
              </div>
              <div className={styles.productSales}>${p.revenue.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.panel}>
        <Tabs
          items={[
            { value: 'orders',    label: 'Recent orders', icon: 'receipt_long' },
            { value: 'products',  label: 'Products',      icon: 'inventory_2' },
            { value: 'customers', label: 'Customers',     icon: 'group' },
          ]}
          value={tab}
          onChange={(v) => setTab(v as TabId)}
        />

        {tab === 'orders' && (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              <span style={{ font: 'var(--md-sys-typescale-label-large)', color: 'var(--md-sys-color-on-surface-variant)' }}>
                Filter:
              </span>
              {(['Paid', 'Shipped', 'Pending', 'Refunded'] as OrderStatus[]).map(s => (
                <Chip key={s} kind="filter" label={s}
                  selected={statusFilter.includes(s)}
                  onClick={() => toggleFilter(s)} />
              ))}
              <div style={{ flex: 1 }} />
              <span style={{ font: 'var(--md-sys-typescale-body-small)', color: 'var(--md-sys-color-on-surface-variant)' }}>
                {filteredOrders.length} of {ORDERS.length}
              </span>
            </div>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(o => (
                    <tr key={o.id}>
                      <td style={{ fontWeight: 500 }}>{o.id}</td>
                      <td>
                        <span className={styles.customer}>
                          <span className={styles.customerAvatar}>{initials(o.customer)}</span>
                          <span>
                            <div>{o.customer}</div>
                            <div style={{ font: 'var(--md-sys-typescale-body-small)', color: 'var(--md-sys-color-on-surface-variant)' }}>
                              {o.email}
                            </div>
                          </span>
                        </span>
                      </td>
                      <td>{o.items}</td>
                      <td className={styles.amount}>${o.total.toFixed(2)}</td>
                      <td>
                        <span className={cn(styles.status, statusClass[o.status])}>
                          <span className={styles.statusDot} />
                          {o.status}
                        </span>
                      </td>
                      <td style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{o.date}</td>
                      <td>
                        <Menu
                          trigger={(p) => <IconButton icon="more_vert" label="More" {...p} />}
                          items={[
                            { label: 'View order', icon: 'visibility', onClick: () => setSnack(`Viewing ${o.id}`) },
                            { label: 'Edit', icon: 'edit' },
                            { label: 'Refund', icon: 'undo' },
                            { divider: true, label: '' },
                            { label: 'Cancel', icon: 'cancel' },
                          ]}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === 'products' && (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Sold</th>
                  <th>Revenue</th>
                  <th>Performance</th>
                </tr>
              </thead>
              <tbody>
                {TOP_PRODUCTS.map(p => (
                  <tr key={p.sku}>
                    <td>
                      <span className={styles.customer}>
                        <span className={styles.productThumb} style={{ width: 32, height: 32 }}>
                          <Icon name={p.icon} size={18} />
                        </span>
                        {p.name}
                      </span>
                    </td>
                    <td style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{p.sku}</td>
                    <td>{p.sold}</td>
                    <td className={styles.amount}>${p.revenue.toLocaleString()}</td>
                    <td style={{ width: 200 }}>
                      <ProgressIndicator value={p.pct} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'customers' && (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Orders</th>
                  <th>Lifetime value</th>
                </tr>
              </thead>
              <tbody>
                {ORDERS.slice(0, 6).map((o, i) => (
                  <tr key={o.id}>
                    <td>
                      <span className={styles.customer}>
                        <span className={styles.customerAvatar}>{initials(o.customer)}</span>
                        {o.customer}
                      </span>
                    </td>
                    <td style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{o.email}</td>
                    <td>{1 + i * 2}</td>
                    <td className={styles.amount}>${(o.total * (1 + i * 2)).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Activity + stock alerts row */}
      <div className={styles.row}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>Recent activity</div>
            <Chip kind="suggestion" label="Live" icon="circle" />
          </div>
          <div className={styles.activityList}>
            {ACTIVITY.map((a, i) => (
              <div key={i} className={styles.activityItem}>
                <span className={styles.activityIcon}><Icon name={a.icon} size={18} /></span>
                <div className={styles.activityMain}>
                  <div className={styles.activityText}>{a.text}</div>
                  <div className={styles.activityTime}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>Low stock alerts</div>
            <Badge count={STOCK_ALERTS.length}>
              <Icon name="warning" />
            </Badge>
          </div>
          {STOCK_ALERTS.map(s => (
            <div key={s.name} className={styles.stockItem}>
              <span className={styles.productThumb}><Icon name="inventory_2" size={20} /></span>
              <div style={{ flex: 1 }}>
                <div className={styles.productName}>{s.name}</div>
                <div className={styles.productMeta}>Reorder recommended</div>
              </div>
              <span className={styles.stockCount}>{s.left} left</span>
            </div>
          ))}
          <Divider />
          <div className={styles.activityItem} style={{ alignItems: 'center' }}>
            <span className={styles.activityIcon}><Icon name="lightbulb" size={18} /></span>
            <div className={styles.activityMain}>
              <div className={styles.activityText}>Restock 15 SKUs to avoid stockouts this week</div>
              <div className={styles.activityTime}>Review recommendations →</div>
            </div>
          </div>
        </div>
      </div>

      {/* FAB */}
      <div className={styles.fab}>
        <FAB icon="add" label="New product" onClick={() => setSnack('Opening product editor…')} />
      </div>

      <Snackbar
        open={!!snack}
        message={snack ?? ''}
        action={{ label: 'Dismiss', onClick: () => setSnack(null) }}
        onClose={() => setSnack(null)}
      />
    </div>
  );
}
