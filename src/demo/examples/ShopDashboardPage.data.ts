export const REVENUE_BY_RANGE: Record<string, number[]> = {
  '7d': [4200, 4800, 5100, 4900, 6200, 7300, 6800],
  '30d': [3800, 4100, 4500, 4700, 4900, 5300, 5100, 5400, 5800, 6100, 6400, 6700, 7000, 6800, 7200, 7600, 7400, 7800, 8100, 7900, 8300, 8600, 8400, 8900, 9100, 8700, 9400, 9700, 9300, 9800],
  '90d': Array.from({ length: 12 }, (_, i) => 3000 + i * 600 + Math.round(Math.sin(i / 2) * 500)),
};

export const TARGET_BY_RANGE: Record<string, number[]> = {
  '7d': [5000, 5000, 5000, 5500, 5500, 6500, 6500],
  '30d': Array.from({ length: 30 }, (_, i) => 4000 + i * 200),
  '90d': Array.from({ length: 12 }, (_, i) => 3500 + i * 550),
};

export const KPIS = [
  { key: 'revenue', label: 'Total revenue', value: '$48,392', delta: 12.4, deltaLabel: 'vs last week', icon: 'payments', tone: '' },
  { key: 'orders', label: 'Orders', value: '1,284', delta: 8.1, deltaLabel: 'vs last week', icon: 'shopping_cart', tone: 'kpiIconAlt' },
  { key: 'aov', label: 'Avg. order value', value: '$37.69', delta: 3.2, deltaLabel: 'vs last week', icon: 'price_check', tone: 'kpiIconTri' },
  { key: 'refunds', label: 'Refunds', value: '$1,204', delta: -2.6, deltaLabel: 'vs last week', icon: 'undo', tone: 'kpiIconErr' },
] as const;

export const SPARK = [
  [12, 18, 14, 22, 28, 24, 32, 38, 34, 42],
  [22, 18, 26, 20, 30, 28, 34, 32, 40, 36],
  [10, 16, 14, 20, 18, 24, 22, 30, 26, 34],
  [40, 36, 32, 34, 28, 30, 24, 20, 22, 18],
];

export const TOP_PRODUCTS = [
  { name: 'Wireless Earbuds Pro', sku: 'SKU-2891', sold: 482, revenue: 19280, icon: 'headphones', pct: 100 },
  { name: 'Smart Watch Series X', sku: 'SKU-1102', sold: 351, revenue: 17550, icon: 'watch', pct: 91 },
  { name: 'Mechanical Keyboard', sku: 'SKU-4439', sold: 297, revenue: 11880, icon: 'keyboard', pct: 62 },
  { name: 'USB-C Hub 8-in-1', sku: 'SKU-7720', sold: 264, revenue: 6336, icon: 'usb', pct: 33 },
  { name: 'Webcam 4K Pro', sku: 'SKU-5301', sold: 198, revenue: 9900, icon: 'videocam', pct: 51 },
];

export type OrderStatus = 'Paid' | 'Shipped' | 'Pending' | 'Refunded';
export interface Order { id: string; customer: string; email: string; items: number; total: number; status: OrderStatus; date: string; }
export const ORDERS: Order[] = [
  { id: '#10293', customer: 'Sarah Chen', email: 'sarah@example.com', items: 3, total: 248.50, status: 'Paid', date: '2 min ago' },
  { id: '#10292', customer: 'Marcus Johnson', email: 'marcus@example.com', items: 1, total: 49, status: 'Shipped', date: '14 min ago' },
  { id: '#10291', customer: 'Priya Patel', email: 'priya@example.com', items: 5, total: 412.20, status: 'Pending', date: '32 min ago' },
  { id: '#10290', customer: 'Liam OBrien', email: 'liam@example.com', items: 2, total: 159.99, status: 'Paid', date: '1 hr ago' },
  { id: '#10289', customer: 'Yuki Tanaka', email: 'yuki@example.com', items: 1, total: 29.50, status: 'Refunded', date: '2 hr ago' },
  { id: '#10288', customer: 'Aisha Bello', email: 'aisha@example.com', items: 4, total: 318.75, status: 'Shipped', date: '3 hr ago' },
  { id: '#10287', customer: 'David Kim', email: 'david@example.com', items: 2, total: 98.40, status: 'Paid', date: '4 hr ago' },
  { id: '#10286', customer: 'Elena Rossi', email: 'elena@example.com', items: 6, total: 524, status: 'Pending', date: '5 hr ago' },
];

export const ACTIVITY = [
  { icon: 'shopping_bag', text: 'New order #10293 from Sarah Chen', time: '2 min ago' },
  { icon: 'star', text: 'New 5-star review on Wireless Earbuds Pro', time: '18 min ago' },
  { icon: 'person_add', text: 'New customer signup: marcus@example.com', time: '24 min ago' },
  { icon: 'inventory_2', text: 'Stock alert: USB-C Hub is running low', time: '1 hr ago' },
  { icon: 'undo', text: 'Refund issued for order #10289', time: '2 hr ago' },
  { icon: 'local_shipping', text: 'Order #10288 shipped via FedEx', time: '3 hr ago' },
];

export const STOCK_ALERTS = [
  { name: 'USB-C Hub 8-in-1', left: 3 },
  { name: 'Wireless Charger', left: 5 },
  { name: 'Phone Stand Premium', left: 7 },
];
