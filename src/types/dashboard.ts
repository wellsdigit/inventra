export type SaleItem = {
  id: string;
  transactionId: string;
  type: 'Transfer' | 'Cash' | 'POS';
  amount: number;
  time: string;
  items: { name: string; quantity: string }[];
  additionalItemsCount: number;
};

export type ProductItem = {
  id: string;
  name: string;
  quantityStr: string;
  image: any;
};

export type AlertItem = {
  id: string;
  title: string;
  time: string;
};

export type SyncItem = {
  id: string;
  title: string;
  time: string;
  iconType: 'cart' | 'trash';
};

export type ChartDataPoint = {
  month: string;
  sales: number;
  inventory: number;
};

export type DashboardStats = {
  lowStockCount: number;
  pendingOrdersCount: number;
  pendingOrdersValue: number;
  todaySalesCount: number;
  // Admin specific
  totalStockValue?: number;
  totalStockValueTrend?: number;
  monthlySalesRevenue?: number;
  monthlySalesRevenueTrend?: number;
};

export type DashboardData = {
  stats: DashboardStats;
  alerts: AlertItem[];
  recentSales: SaleItem[];
  topProducts: ProductItem[];
  syncItems: SyncItem[];
  chartData?: ChartDataPoint[];
};
