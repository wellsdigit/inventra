import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Box, FileText, ShoppingBag, ShoppingCart, Trash2, ShieldAlert, Trophy, Bell, ChevronDown } from 'lucide-react-native';
import { BarChart } from 'react-native-gifted-charts';
import { format } from 'date-fns';

import { useAppStore } from '@/store/app-store';
import { Brand, Fonts } from '@/constants/theme';
import { DashboardData } from '@/types/dashboard';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { dashboardData, isOffline, role } = useAppStore();
  const { stats, alerts, recentSales, topProducts, syncItems, chartData } = dashboardData;

  const getAlertIcon = (title: string) => {
    return <ShieldAlert size={16} color="#EF4444" />;
  };

  const getSyncIcon = (type: 'cart' | 'trash') => {
    if (type === 'cart') return <ShoppingCart size={16} color={Brand.primaryDark} />;
    return <Trash2 size={16} color={Brand.primaryDark} />;
  };

  const barData = chartData?.reduce((acc: any[], item) => {
    acc.push({
      value: item.sales,
      label: item.month,
      spacing: 4,
      labelTextStyle: { color: '#6B7280', fontSize: 13, fontFamily: Fonts?.sans, width: 40, textAlign: 'center' },
      frontColor: '#38662B',
    });
    acc.push({
      value: item.inventory,
      spacing: 16,
      frontColor: '#B8C8A9',
    });
    return acc;
  }, []) || [];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top + 8 : 24 }]}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarContainer}>
            <Image
              source={require('@/assets/images/avatar.png')}
              style={styles.avatar}
              contentFit="cover"
            />
            <View style={styles.onlineBadge} />
          </View>
          <View>
            <Text style={styles.greeting}>Good Morning</Text>
            <Text style={styles.storeName}>AdeMart Enterprise</Text>
          </View>
        </View>
        <Pressable hitSlop={8}>
          <Bell size={24} color="#1F2937" />
        </Pressable>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
      >
        {/* Offline Banner */}
        {isOffline && (
          <View style={styles.offlineBanner}>
            <View style={styles.offlineBannerLeft}>
              <Box size={20} color="#EA580C" style={styles.offlineIcon} />
              <View>
                <Text style={styles.offlineTitle}>You're offline. They'll sync</Text>
                <Text style={styles.offlineTitle}>automatically when</Text>
                <Text style={styles.offlineTitle}>reconnected</Text>
              </View>
            </View>
            <View style={styles.offlineBadge}>
              <Text style={styles.offlineBadgeText}>3 queued</Text>
            </View>
          </View>
        )}

        {/* Stats Section based on Role */}
        {role === 'admin' ? (
          <>
            {/* Total Stock Value */}
            <View style={[styles.fullWidthCard, { marginBottom: 16 }]}>
              <View style={styles.statHeader}>
                <View style={[styles.iconBox, { backgroundColor: '#E0E7FF' }]}>
                  <Box size={20} color="#4F46E5" />
                </View>
                <Text style={styles.statTitle}>Total Stock Value</Text>
              </View>
              <Text style={styles.statValue}>₦{stats.totalStockValue?.toLocaleString()}</Text>
              <View style={styles.trendRow}>
                <Text style={styles.trendUp}>↑ {stats.totalStockValueTrend}%</Text>
                <Text style={styles.trendSubtitle}>vs last month</Text>
              </View>
              {isOffline && <Text style={styles.statCached}>Cached · 45m ago</Text>}
            </View>

            {/* Low Stock & Pending Orders */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <View style={[styles.iconBox, { backgroundColor: '#FFEDD5' }]}>
                    <Box size={20} color="#EA580C" />
                  </View>
                  <Text style={styles.statTitle}>Low Stock Items</Text>
                </View>
                <Text style={styles.statValue}>
                  {stats.lowStockCount} {stats.lowStockCount === 1 ? 'Item' : 'Items'}
                </Text>
                {stats.lowStockCount > 0 ? (
                  <Text style={styles.statAction}>Reorder soon</Text>
                ) : (
                  <Text style={styles.statOk}>All well stocked</Text>
                )}
              </View>

              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <View style={[styles.iconBox, { backgroundColor: '#E0E7FF' }]}>
                    <FileText size={20} color="#4F46E5" />
                  </View>
                  <Text style={styles.statTitle}>Pending Purchase{"\n"}Orders</Text>
                </View>
                <Text style={styles.statValue}>
                  {stats.pendingOrdersCount.toLocaleString()}
                </Text>
                <Text style={styles.statSubtitle}>Worth ₦{stats.pendingOrdersValue.toLocaleString()}</Text>
                {isOffline && <Text style={styles.statCached}>Cached · 45m ago</Text>}
              </View>
            </View>

            {/* Monthly Sales Revenue */}
            <View style={[styles.fullWidthCard, { marginTop: 16 }]}>
              <View style={styles.statHeader}>
                <View style={[styles.iconBox, { backgroundColor: '#DCFCE7' }]}>
                  <ShoppingBag size={20} color="#059669" />
                </View>
                <Text style={styles.statTitle}>Monthly Sales Revenue</Text>
              </View>
              <Text style={styles.statValue}>₦{stats.monthlySalesRevenue?.toLocaleString()}</Text>
              <View style={styles.trendRow}>
                <Text style={styles.trendUp}>↑ {stats.monthlySalesRevenueTrend}%</Text>
                <Text style={styles.trendSubtitle}>vs last month</Text>
              </View>
              {isOffline && <Text style={styles.statCached}>Cached · 45m ago</Text>}
            </View>
          </>
        ) : (
          <>
            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <View style={[styles.iconBox, { backgroundColor: '#FFEDD5' }]}>
                    <Box size={20} color="#EA580C" />
                  </View>
                  <Text style={styles.statTitle}>Low Stock Items</Text>
                </View>
                <Text style={styles.statValue}>
                  {stats.lowStockCount} {stats.lowStockCount === 1 ? 'Item' : 'Items'}
                </Text>
                {stats.lowStockCount > 0 ? (
                  <Text style={styles.statAction}>Reorder soon</Text>
                ) : (
                  <Text style={styles.statOk}>All items well stocked</Text>
                )}
              </View>

              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <View style={[styles.iconBox, { backgroundColor: '#FFEDD5' }]}>
                    <FileText size={20} color="#EA580C" />
                  </View>
                  <Text style={styles.statTitle}>Pending Purchase{"\n"}Orders</Text>
                </View>
                <Text style={styles.statValue}>
                  {stats.pendingOrdersCount.toLocaleString()}
                </Text>
                {isOffline && <Text style={styles.statCached}>Cached · 45m ago</Text>}
              </View>
            </View>

            {/* Today's Sales */}
            <View style={styles.fullWidthCard}>
              <View style={styles.statHeader}>
                <View style={[styles.iconBox, { backgroundColor: '#E0E7FF' }]}>
                  <ShoppingBag size={20} color="#4F46E5" />
                </View>
                <Text style={styles.statTitle}>Today's Sales</Text>
              </View>
              <Text style={styles.statValue}>{stats.todaySalesCount}</Text>
              <Text style={styles.statSubtitle}>Transactions logged</Text>
              {isOffline && <Text style={styles.statActionOffline}>+2 offline (queued)</Text>}
            </View>
          </>
        )}

        {/* Pending Sync (Offline only) */}
        {isOffline && syncItems.length > 0 && (
          <View style={styles.syncCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Box size={20} color={Brand.primaryDark} />
                <Text style={styles.cardTitle}>Pending Sync</Text>
              </View>
            </View>
            <View style={styles.syncList}>
              {syncItems.map((item) => (
                <View key={item.id} style={styles.syncItem}>
                  {getSyncIcon(item.iconType)}
                  <Text style={styles.syncItemTitle}>{item.title}</Text>
                  <Text style={styles.syncItemTime}>{item.time}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Priority Alerts */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <ShieldAlert size={20} color="#1F2937" />
              <Text style={styles.cardTitle}>Priority Alerts</Text>
            </View>
            {alerts.length > 0 && (
              <Pressable hitSlop={8}>
                <Text style={styles.viewAll}>View all</Text>
              </Pressable>
            )}
          </View>

          {isOffline && (
            <View style={styles.offlineAlertRow}>
              <Box size={16} color="#EA580C" />
              <Text style={styles.offlineAlertText}>Showing cached alerts - new alerts paused offline</Text>
            </View>
          )}

          {alerts.length > 0 ? (
            <View style={styles.alertsList}>
              {alerts.map((alert) => (
                <View key={alert.id} style={styles.alertItem}>
                  <View style={styles.alertLine} />
                  <View style={styles.alertContent}>
                    <View style={styles.alertIconWrapper}>
                      {getAlertIcon(alert.title)}
                    </View>
                    <View style={styles.alertTextWrapper}>
                      <Text style={styles.alertItemTitle}>{alert.title}</Text>
                      <Text style={styles.alertItemTime}>{alert.time}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconBox}>
                <ShieldAlert size={24} color="#22C55E" />
              </View>
              <Text style={styles.emptyTitle}>No alerts right now</Text>
              <Text style={styles.emptySubtitle}>
                All stock levels are healthy. We'll notify you if anything needs attention.
              </Text>
            </View>
          )}
        </View>

        {/* Recent Sales */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Text style={styles.cardTitle}>Recent Sales</Text>
              {isOffline && <Text style={styles.cachedText}>Cached · 2hr ago</Text>}
            </View>
            <Pressable hitSlop={8}>
              <Text style={styles.viewAll}>View all</Text>
            </Pressable>
          </View>

          {recentSales.length > 0 ? (
            <View style={styles.salesList}>
              {recentSales.map((sale) => (
                <View key={sale.id} style={styles.saleItem}>
                  <View style={styles.saleAvatar}>
                    <Text style={styles.saleAvatarText}>
                      {sale.transactionId.substring(4, 6)}
                    </Text>
                  </View>
                  <View style={styles.saleDetails}>
                    <View style={styles.saleDetailsTop}>
                      <Text style={styles.saleId}>{sale.transactionId}</Text>
                      <View style={[
                        styles.badge, 
                        sale.type === 'Transfer' ? styles.badgeTransfer : 
                        sale.type === 'Cash' ? styles.badgeCash : styles.badgePos
                      ]}>
                        <Text style={[
                          sale.type === 'Transfer' ? styles.badgeTextTransfer : 
                          sale.type === 'Cash' ? styles.badgeTextCash : styles.badgeTextPos
                        ]}>{sale.type}</Text>
                      </View>
                    </View>
                    <Text style={styles.saleItems} numberOfLines={1}>
                      {sale.items.map(i => `${i.name} ${i.quantity}`).join(', ')}
                      {sale.additionalItemsCount > 0 && ` +${sale.additionalItemsCount} more`}
                    </Text>
                  </View>
                  <View style={styles.saleAmounts}>
                    <Text style={styles.saleAmount}>₦{sale.amount.toLocaleString()}</Text>
                    <Text style={styles.saleTime}>{sale.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconCircle}>
                <ShoppingCart size={24} color="#9CA3AF" />
              </View>
              <Text style={styles.emptyTitle}>No sales yet</Text>
            </View>
          )}
        </View>

        {/* Chart (Admin only) */}
        {role === 'admin' && chartData && (
          <View style={styles.card}>
            <View style={[styles.cardHeader, { marginBottom: 8 }]}>
              <View>
                <Text style={styles.cardTitle}>Sales vs Inventory Cost</Text>
                {isOffline && (
                  <View style={[styles.offlineAlertRow, { marginBottom: 0, marginTop: 4, gap: 4 }]}>
                    <ShieldAlert size={14} color="#9CA3AF" />
                    <Text style={styles.cachedText}>Cached 2hr ago</Text>
                  </View>
                )}
              </View>
              <Pressable style={styles.dropdownButton}>
                <Text style={styles.dropdownText}>Yearly</Text>
                <ChevronDown size={16} color="#6B7280" />
              </Pressable>
            </View>

            <View style={[styles.chartLegend, { justifyContent: 'flex-end', marginBottom: 20 }]}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#38662B' }]} />
                <Text style={styles.legendText}>Sales</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#B8C8A9' }]} />
                <Text style={styles.legendText}>Inventory</Text>
              </View>
            </View>
            <View style={styles.giftedChartContainer}>
              <BarChart
                data={barData}
                barWidth={14}
                spacing={16}
                roundedTop
                roundedBottom={false}
                xAxisThickness={0}
                yAxisThickness={0}
                yAxisTextStyle={{ color: '#6B7280', fontSize: 13, fontFamily: Fonts?.sans }}
                noOfSections={5}
                maxValue={7.5}
                stepValue={1.5}
                yAxisLabelTexts={['0M', '1.5M', '3M', '4.5M', '6M', '7M']}
                rulesColor="#F3F4F6"
                rulesType="dashed"
                initialSpacing={10}
              />
            </View>
          </View>
        )}

        {/* Top Selling Products (Attendance only) */}
        {role === 'attendance' && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Trophy size={20} color="#1F2937" />
                <Text style={styles.cardTitle}>Top Selling Products</Text>
              </View>
              <Pressable hitSlop={8}>
                <Text style={styles.viewAll}>View all products</Text>
              </Pressable>
            </View>

            {isOffline && (
              <View style={styles.offlineAlertRow}>
                 <Text style={styles.cachedText}>Cached · 45m ago</Text>
              </View>
            )}

            {topProducts.length > 0 ? (
              <View style={styles.productsList}>
                {topProducts.map((product) => (
                  <View key={product.id} style={styles.productItem}>
                    <Image 
                      source={product.image === 'indomie' 
                        ? require('@/assets/images/indomie.png') 
                        : require('@/assets/images/coke.png')} 
                      style={styles.productImage}
                    />
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productQty}>{product.quantityStr}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconCircle}>
                  <Box size={24} color="#9CA3AF" />
                </View>
                <Text style={styles.emptyTitle}>No products yet</Text>
              </View>
            )}
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  greeting: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: Fonts?.sans,
    marginBottom: 2,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: Fonts?.sans,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  offlineBanner: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  offlineBannerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  offlineIcon: {
    marginTop: 2,
  },
  offlineTitle: {
    fontSize: 14,
    color: '#EA580C',
    fontFamily: Fonts?.sans,
    fontWeight: '500',
  },
  offlineBadge: {
    backgroundColor: '#9CA3AF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  offlineBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Fonts?.sans,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  fullWidthCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 14,
    color: '#4B5563',
    fontFamily: Fonts?.sans,
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: Fonts?.sans,
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: Fonts?.sans,
  },
  statAction: {
    fontSize: 13,
    color: '#EA580C',
    fontWeight: '500',
    fontFamily: Fonts?.sans,
  },
  statOk: {
    fontSize: 13,
    color: '#22C55E',
    fontWeight: '500',
    fontFamily: Fonts?.sans,
  },
  statCached: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: Fonts?.sans,
  },
  statActionOffline: {
    fontSize: 13,
    color: '#22C55E',
    fontWeight: '500',
    fontFamily: Fonts?.sans,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  syncCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: Fonts?.sans,
  },
  viewAll: {
    fontSize: 13,
    color: Brand.primary,
    fontWeight: '500',
    fontFamily: Fonts?.sans,
  },
  cachedText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: Fonts?.sans,
    marginLeft: 8,
  },
  alertsList: {
    gap: 12,
  },
  alertItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  alertLine: {
    width: 4,
    backgroundColor: '#EF4444',
  },
  alertContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  alertIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertTextWrapper: {
    flex: 1,
  },
  alertItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    fontFamily: Fonts?.sans,
    marginBottom: 2,
  },
  alertItemTime: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: Fonts?.sans,
  },
  offlineAlertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  offlineAlertText: {
    fontSize: 13,
    color: '#EA580C',
    fontFamily: Fonts?.sans,
  },
  salesList: {
    gap: 16,
  },
  saleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  saleAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saleAvatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  saleDetails: {
    flex: 1,
  },
  saleDetailsTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  saleId: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: Fonts?.sans,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeTransfer: {
    backgroundColor: '#E0E7FF',
  },
  badgeTextTransfer: {
    color: '#4F46E5',
    fontSize: 11,
    fontWeight: '600',
  },
  badgeCash: {
    backgroundColor: '#D1FAE5',
  },
  badgeTextCash: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '600',
  },
  badgePos: {
    backgroundColor: '#F3E8FF',
  },
  badgeTextPos: {
    color: '#9333EA',
    fontSize: 11,
    fontWeight: '600',
  },
  saleItems: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: Fonts?.sans,
  },
  saleAmounts: {
    alignItems: 'flex-end',
  },
  saleAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: Fonts?.sans,
    marginBottom: 4,
  },
  saleTime: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: Fonts?.sans,
  },
  productsList: {
    gap: 16,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  productImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  productName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
    fontFamily: Fonts?.sans,
  },
  productQty: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: Fonts?.sans,
  },
  syncList: {
    gap: 12,
  },
  syncItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  syncItemTitle: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    fontFamily: Fonts?.sans,
  },
  syncItemTime: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: Fonts?.sans,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: Fonts?.sans,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: Fonts?.sans,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  trendUp: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '600',
    fontFamily: Fonts?.sans,
  },
  trendSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: Fonts?.sans,
  },
  chartLegend: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: Fonts?.sans,
  },
  giftedChartContainer: {
    marginLeft: -16,
    marginTop: 8,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  dropdownText: {
    fontSize: 14,
    color: '#4B5563',
    fontFamily: Fonts?.sans,
    fontWeight: '500',
  },
});
