import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BarChart } from 'react-native-gifted-charts';
import { 
  BarChart2, 
  Wallet, 
  ShoppingCart, 
  Trophy, 
  ChevronDown, 
  TrendingUp, 
  TrendingDown 
} from 'lucide-react-native';

import { Brand, Fonts } from '@/constants/theme';

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedBar, setSelectedBar] = useState<any>({ value: 41200, label: 'Tue', index: 1 });

  const summaryCards = [
    {
      id: '1',
      title: 'Total revenue',
      value: '₦5,200,000',
      trend: '+18.4%',
      trendType: 'up',
      trendSub: 'vs last week',
      icon: <BarChart2 size={18} color="#10B981" />,
      iconBg: '#E6FDF0',
    },
    {
      id: '2',
      title: 'Net profit',
      value: '₦96,100',
      trend: '+22%',
      trendType: 'up',
      trendSub: '',
      icon: <Wallet size={18} color="#10B981" />,
      iconBg: '#E6FDF0',
    },
    {
      id: '3',
      title: 'Avg. order value',
      value: '₦18,450,000',
      trend: '-7%',
      trendType: 'down',
      trendSub: '',
      // Custom Naira symbol icon to match the screen exactly
      icon: <Text style={styles.nairaIconText}>₦</Text>,
      iconBg: '#E6FDF0',
    },
    {
      id: '4',
      title: 'Total orders',
      value: '127',
      trend: '10%',
      trendType: 'up',
      trendSub: 'vs last week',
      icon: <ShoppingCart size={18} color="#8B5CF6" />,
      iconBg: '#F3E8FF',
    },
  ];

  const chartData = [
    { value: 38000, label: 'Mon', frontColor: '#38662B' },
    { value: 41200, label: 'Tue', frontColor: '#38662B', showTooltip: true },
    { value: 50000, label: 'Wed', frontColor: '#38662B' },
    { value: 50000, label: 'Thu', frontColor: '#38662B' },
    { value: 80000, label: 'Fri', frontColor: '#38662B' },
    { value: 100000, label: 'Sat', frontColor: '#38662B' },
    { value: 48000, label: 'Sun', frontColor: '#38662B' },
  ];

  const topProducts = [
    { id: '1', name: 'Indomie Chicken', progress: 0.8, revenue: '₦980K' },
    { id: '2', name: 'Coca-Cola 50cl', progress: 0.62, revenue: '₦764K' },
    { id: '3', name: 'Peak Milk 400g', progress: 0.42, revenue: '₦470K' },
  ];

  // Dynamic layout parameters to fill the card width perfectly
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = screenWidth - 35;
  const chartInnerWidth = cardWidth - 32; // card padding 16*2
  const yAxisWidth = 40;
  const plotWidth = chartInnerWidth - yAxisWidth - 10; // 10px right padding
  const initialSpacing = 12;
  const barWidth = 26; // slightly wider bars like the screen
  
  // 7 bars means 6 spacing intervals
  const spacing = (plotWidth - initialSpacing - (7 * barWidth)) / 6;

  const getHighlightLeft = (idx: number) => {
    const barStart = yAxisWidth + initialSpacing + idx * (barWidth + spacing);
    return barStart - spacing / 2;
  };

  const getTooltipLeft = (idx: number) => {
    const highlightWidth = barWidth + spacing;
    const hlLeft = getHighlightLeft(idx);
    const hlCenter = hlLeft + highlightWidth / 2;
    let tooltipL = hlCenter - 55; // center tooltip (width 110) over column
    
    // Bounds check to ensure tooltip stays inside card and doesn't get cut off on edges
    const minLeft = 10;
    const maxLeft = chartInnerWidth - 105; // tooltip width is ~105
    if (tooltipL < minLeft) tooltipL = minLeft;
    if (tooltipL > maxLeft) tooltipL = maxLeft;
    
    return tooltipL;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top + 8 : 24 }]}>
        <Text style={styles.headerTitle}>Analytics</Text>
        <Pressable style={styles.dropdownButton}>
          <Text style={styles.dropdownText}>Weekly</Text>
          <ChevronDown size={16} color="#6B7280" />
        </Pressable>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
      >
        {/* 2x2 Summary Grid */}
        <View style={styles.grid}>
          {summaryCards.map(card => (
            <View key={card.id} style={styles.summaryCard}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: card.iconBg }]}>
                  {card.icon}
                </View>
                <Text style={styles.cardTitle} numberOfLines={1}>{card.title}</Text>
              </View>
              <Text style={styles.cardValue}>{card.value}</Text>
              <View style={styles.trendRow}>
                <View style={[
                  styles.trendBadge,
                  card.trendType === 'up' ? styles.badgeUp : styles.badgeDown
                ]}>
                  {card.trendType === 'up' ? (
                    <TrendingUp size={12} color="#10B981" />
                  ) : (
                    <TrendingDown size={12} color="#EF4444" />
                  )}
                  <Text style={[
                    styles.trendBadgeText,
                    card.trendType === 'up' ? styles.textUp : styles.textDown
                  ]}>
                    {card.trend}
                  </Text>
                </View>
                {card.trendSub !== '' && (
                  <Text style={styles.trendSubText}>{card.trendSub}</Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Daily Sales Chart Section */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Daily Sales (₦)</Text>
          
          <View style={styles.chartWrapper}>
            {/* Custom Tooltip overlay positioned dynamically */}
            {selectedBar && typeof selectedBar.index === 'number' && (
              <>
                {/* Vertical grey strip background highlight */}
                <View style={[styles.highlightBar, { left: getHighlightLeft(selectedBar.index), width: barWidth + spacing }]} />
                {/* Tooltip Card */}
                <View style={[styles.tooltipCard, { left: getTooltipLeft(selectedBar.index) }]}>
                  <Text style={styles.tooltipTitle}>{selectedBar.label}</Text>
                  <Text style={styles.tooltipSales}>
                    Sales: <Text style={styles.tooltipBold}>₦{selectedBar.value.toLocaleString()}</Text>
                  </Text>
                </View>
              </>
            )}

            <BarChart
              data={chartData}
              width={plotWidth}
              barWidth={barWidth}
              spacing={spacing}
              barBorderRadius={4}
              roundedBottom={false}
              xAxisThickness={0}
              yAxisThickness={0}
              yAxisTextStyle={{ color: '#9CA3AF', fontSize: 12, fontFamily: Fonts?.sans }}
              xAxisLabelTextStyle={{ color: '#9CA3AF', fontSize: 12, fontFamily: Fonts?.sans }}
              noOfSections={4}
              maxValue={100000}
              stepValue={25000}
              yAxisLabelTexts={['0k', '25k', '50k', '75k', '100k']}
              rulesColor="#F3F4F6"
              rulesType="dashed"
              initialSpacing={initialSpacing}
              onPress={(item: any) => {
                const idx = chartData.findIndex(x => x.label === item.label);
                setSelectedBar({ ...item, index: idx });
              }}
            />
          </View>
        </View>

        {/* Top Selling Products */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Trophy size={20} color="#1F2937" />
              <Text style={styles.sectionTitle}>Top Selling Products</Text>
            </View>
            <Text style={styles.sectionSub}>By revenue</Text>
          </View>

          <View style={styles.productsList}>
            {topProducts.map((product, index) => (
              <View key={product.id} style={styles.productRow}>
                <Text style={styles.productRank}>{index + 1}</Text>
                <View style={styles.productInfoCol}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <View style={styles.progressBarTrack}>
                    <View style={[styles.progressBarFill, { width: `${product.progress * 100}%` }]} />
                  </View>
                </View>
                <Text style={styles.productRevenue}>{product.revenue}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.sectionCard}>
          <Text style={styles.paymentTitle}>Payment Methods</Text>
          
          {/* Segmented capsule bars side by side with custom widths */}
          <View style={styles.capsuleRow}>
            <View style={[styles.capsuleBar, { flex: 48, backgroundColor: '#2563EB' }]} />
            <View style={[styles.capsuleBar, { flex: 35, backgroundColor: '#22C55E' }]} />
            <View style={[styles.capsuleBar, { flex: 17, backgroundColor: '#7C3AED' }]} />
          </View>

          {/* Legends */}
          <View style={styles.paymentLegends}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#2563EB' }]} />
              <Text style={styles.legendText}>Transfer 48%</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#22C55E' }]} />
              <Text style={styles.legendText}>Cash 35%</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#7C3AED' }]} />
              <Text style={styles.legendText}>POS 17%</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFD',
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
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: Fonts?.sans,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
  content: {
    padding: 20,
    gap: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  summaryCard: {
    width: '47.5%', // 2 columns taking almost half screen, accounting for gap
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F3F6',
    shadowColor: '#1F2937',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nairaIconText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    fontFamily: Fonts?.sans,
    flex: 1,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: Fonts?.sans,
    marginBottom: 8,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeUp: {
    backgroundColor: '#E6FDF0',
  },
  badgeDown: {
    backgroundColor: '#FEE2E2',
  },
  trendBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: Fonts?.sans,
  },
  textUp: {
    color: '#10B981',
  },
  textDown: {
    color: '#EF4444',
  },
  trendSubText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontFamily: Fonts?.sans,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F3F6',
    shadowColor: '#1F2937',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: Fonts?.sans,
    marginBottom: 20,
  },
  chartWrapper: {
    position: 'relative',
    marginLeft: -10,
  },
  highlightBar: {
    position: 'absolute',
    left: 82, // exact position aligning with Tue column
    top: 0,
    bottom: 30, // aligning with x-axis labels
    width: 38,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    opacity: 0.8,
  },
  tooltipCard: {
    position: 'absolute',
    left: 92, // floating card position above Tue bar
    top: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    zIndex: 10,
  },
  tooltipTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: Fonts?.sans,
    marginBottom: 4,
  },
  tooltipSales: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: Fonts?.sans,
  },
  tooltipBold: {
    fontWeight: '700',
    color: '#38662B',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F3F6',
    shadowColor: '#1F2937',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: Fonts?.sans,
  },
  sectionSub: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: Fonts?.sans,
  },
  productsList: {
    gap: 16,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productRank: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    width: 20,
  },
  productInfoCol: {
    flex: 1,
    marginHorizontal: 12,
    gap: 6,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: Fonts?.sans,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#38662B',
    borderRadius: 3,
  },
  productRevenue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: Fonts?.sans,
    textAlign: 'right',
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: Fonts?.sans,
    marginBottom: 16,
  },
  capsuleRow: {
    flexDirection: 'row',
    height: 10,
    gap: 6,
    marginBottom: 20,
  },
  capsuleBar: {
    height: '100%',
    borderRadius: 5,
  },
  paymentLegends: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '600',
    fontFamily: Fonts?.sans,
  },
});
