import { create } from 'zustand';
import { DashboardData } from '@/types/dashboard';

interface AppState {
  isOffline: boolean;
  role: 'admin' | 'attendance';
  dashboardData: DashboardData;
  setOffline: (offline: boolean) => void;
  setRole: (role: 'admin' | 'attendance') => void;
  setDashboardData: (data: Partial<DashboardData>) => void;
}

// Dummy data representing the 3 states
export const DUMMY_ATTENDANCE_ONLINE: DashboardData = {
  stats: {
    lowStockCount: 18,
    pendingOrdersCount: 45823,
    pendingOrdersValue: 0,
    todaySalesCount: 47,
  },
  alerts: [
    { id: '1', title: 'Indomie chicken running low', time: '5m ago' },
    { id: '2', title: 'Coca-Cola 50cl below reorder level', time: '15m ago' },
  ],
  recentSales: [
    {
      id: '1',
      transactionId: 'SRD-1042',
      type: 'Transfer',
      amount: 16050,
      time: '9:22am',
      items: [{ name: 'Coca-Cola 50cl', quantity: 'x2' }],
      additionalItemsCount: 3,
    },
    {
      id: '2',
      transactionId: 'SRD-1043',
      type: 'Cash',
      amount: 14450,
      time: '9:05am',
      items: [
        { name: 'Peak Milk', quantity: 'x3' },
        { name: 'Milo 500g', quantity: 'x1' },
      ],
      additionalItemsCount: 1,
    },
    {
      id: '3',
      transactionId: 'SRD-1044',
      type: 'POS',
      amount: 13650,
      time: '7:47am',
      items: [{ name: 'Vaseline Lotion', quantity: 'x1' }],
      additionalItemsCount: 2,
    },
  ],
  topProducts: [
    {
      id: '1',
      name: 'Indomie Chicken',
      quantityStr: '320 Cartons',
      image: 'indomie',
    },
    {
      id: '2',
      name: 'Coca-Cola 50cl',
      quantityStr: '280 Crates',
      image: 'coke',
    },
  ],
  syncItems: [],
};

export const DUMMY_ADMIN_ONLINE: DashboardData = {
  stats: {
    lowStockCount: 18,
    pendingOrdersCount: 45823,
    pendingOrdersValue: 2450000,
    todaySalesCount: 47,
    totalStockValue: 18450000,
    totalStockValueTrend: 10,
    monthlySalesRevenue: 5200000,
    monthlySalesRevenueTrend: 10,
  },
  alerts: [
    { id: '1', title: 'Indomie chicken running low', time: '5m ago' },
    { id: '2', title: 'Coca-Cola 50cl below reorder level', time: '15m ago' },
  ],
  recentSales: [...DUMMY_ATTENDANCE_ONLINE.recentSales],
  topProducts: [],
  syncItems: [],
  chartData: [
    { month: 'Jan', sales: 4.9, inventory: 3.6 },
    { month: 'Feb', sales: 3.5, inventory: 2.7 },
    { month: 'Mar', sales: 5.6, inventory: 4.8 },
    { month: 'Apr', sales: 6.6, inventory: 5.8 },
    { month: 'May', sales: 4.4, inventory: 3.2 },
    { month: 'Jun', sales: 5.1, inventory: 4.5 },
    { month: 'Jul', sales: 3.6, inventory: 2.7 },
  ],
};

export const DUMMY_ATTENDANCE_OFFLINE: DashboardData = {
  ...DUMMY_ATTENDANCE_ONLINE,
  syncItems: [
    {
      id: '1',
      title: 'Sales recorded - Indomie Chicken x12',
      time: '14:32pm',
      iconType: 'cart',
    },
    {
      id: '2',
      title: 'Product delete - Dettol Soap',
      time: '13:55pm',
      iconType: 'trash',
    },
    {
      id: '3',
      title: 'Sales recorded - Peak Milk x4',
      time: '12:10pm',
      iconType: 'cart',
    },
  ],
};

export const DUMMY_EMPTY_STATE: DashboardData = {
  stats: {
    lowStockCount: 0,
    pendingOrdersCount: 0,
    pendingOrdersValue: 0,
    todaySalesCount: 0,
  },
  alerts: [],
  recentSales: [],
  topProducts: [],
  syncItems: [],
};

export const useAppStore = create<AppState>((set) => ({
  isOffline: false,
  role: 'attendance',
  dashboardData: DUMMY_ATTENDANCE_ONLINE,
  setOffline: (offline) =>
    set((state) => ({
      isOffline: offline,
      dashboardData: offline ? DUMMY_ATTENDANCE_OFFLINE : DUMMY_ATTENDANCE_ONLINE,
    })),
  setRole: (role) =>
    set({
      role,
      dashboardData: role === 'admin' ? DUMMY_ADMIN_ONLINE : DUMMY_ATTENDANCE_ONLINE,
    }),
  setDashboardData: (data) =>
    set((state) => ({
      dashboardData: { ...state.dashboardData, ...data },
    })),
}));
