import { View, Text, StyleSheet, ScrollView, Platform, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Package, AlertTriangle, Banknote } from 'lucide-react-native';

import { Brand, Fonts } from '@/constants/theme';

export default function AlertScreen() {
  const insets = useSafeAreaInsets();

  const alerts = [
    {
      id: '1',
      name: 'Milo 380g',
      sku: 'SKU: MIL-380G-TN',
      badge: 'Low Stock',
      badgeType: 'warning',
      stockLevel: '9 / 20 tins',
      progress: 0.45,
      color: '#EA580C',
      trackColor: '#E5E7EB',
      buttonType: 'warning',
      image: require('@/assets/images/alert/milo.png'),
    },
    {
      id: '2',
      name: 'Peak Milk Tin',
      sku: 'SKU: PMT-TN',
      badge: 'Low Stock',
      badgeType: 'warning',
      stockLevel: '2 / 20 tins',
      progress: 0.1,
      color: '#EF4444',
      trackColor: '#E5E7EB',
      buttonType: 'critical',
      image: require('@/assets/images/alert/milk.png'),
    },
    {
      id: '3',
      name: 'Coca-Cola 50cl',
      sku: 'SKU: CCL-50CL-CR',
      badge: 'Out of Stock',
      badgeType: 'critical',
      stockLevel: '0 / 20 tins',
      progress: 0,
      color: '#EF4444',
      trackColor: '#FFF1F1',
      buttonType: 'warning',
      image: require('@/assets/images/alert/cocacola.png'),
    },
    {
      id: '4',
      name: 'Coca-Cola 50cl',
      sku: 'SKU: CCL-50CL-CR',
      badge: 'Out of Stock',
      badgeType: 'critical',
      stockLevel: '0 / 20 tins',
      progress: 0,
      color: '#EF4444',
      trackColor: '#FFF1F1',
      buttonType: 'warning',
      image: require('@/assets/images/alert/cocacola.png'),
    },
    {
      id: '5',
      name: 'Coca-Cola 50cl',
      sku: 'SKU: CCL-50CL-CR',
      badge: 'Out of Stock',
      badgeType: 'critical',
      stockLevel: '0 / 20 tins',
      progress: 0,
      color: '#EF4444',
      trackColor: '#FFF1F1',
      buttonType: 'warning',
      image: require('@/assets/images/alert/cocacola.png'),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top + 8 : 24 }]}>
        <Text style={styles.headerTitle}>Alerts</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
      >
        {/* Top Summary Cards Row */}
        <View style={styles.topSummaryRow}>
          <View style={styles.summaryCard}>
            <View style={styles.cardHeaderRow}>
              <View style={[styles.iconBox, { backgroundColor: '#FFF1E6' }]}>
                <Package size={16} color="#EA580C" />
              </View>
              <Text style={styles.summaryTitle} numberOfLines={1}>Low Stock Items</Text>
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryCount}>7 Items</Text>
              <Text style={styles.summaryAction}>Reorder soon</Text>
            </View>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.cardHeaderRow}>
              <View style={[styles.iconBox, { backgroundColor: '#FFF1F1' }]}>
                <AlertTriangle size={16} color="#EF4444" />
              </View>
              <Text style={styles.summaryTitle} numberOfLines={1}>Critical Items</Text>
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryCount}>4 Items</Text>
            </View>
          </View>
        </View>

        {/* Estimated Restock Cost Card */}
        <View style={styles.restockCostCard}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
              <Banknote size={16} color="#10B981" />
            </View>
            <Text style={styles.summaryTitle}>Estimated Restock Cost</Text>
          </View>
          <Text style={styles.restockAmount}>₦ 100,800</Text>
        </View>

        {/* Alerts List */}
        <View style={styles.alertsList}>
          {alerts.map((alert, index) => (
            <View key={`${alert.id}-${index}`} style={styles.productCard}>
              <View style={styles.productImageContainer}>
                <Image source={alert.image} style={styles.productImage} contentFit="contain" />
              </View>
              
              <View style={styles.productDetails}>
                <View style={styles.badgeAndButtonRow}>
                  <View style={[
                    styles.statusBadge, 
                    alert.badgeType === 'warning' ? styles.badgeWarning : styles.badgeCritical
                  ]}>
                    <Text style={[
                      styles.statusBadgeText, 
                      alert.badgeType === 'warning' ? styles.badgeTextWarning : styles.badgeTextCritical
                    ]}>
                      {alert.badge}
                    </Text>
                  </View>

                  <Pressable style={[
                    styles.orderButton,
                    alert.buttonType === 'warning' ? styles.orderButtonWarning : styles.orderButtonCritical
                  ]}>
                    <Text style={[
                      styles.orderButtonText,
                      alert.buttonType === 'warning' ? styles.orderButtonTextWarning : styles.orderButtonTextCritical
                    ]}>
                      Order Now
                    </Text>
                  </Pressable>
                </View>

                <Text style={styles.productName}>{alert.name}</Text>
                <Text style={styles.productSku}>{alert.sku}</Text>

                {/* Stock level info */}
                <View style={styles.stockLevelRow}>
                  <Text style={styles.stockLevelLabel}>Stock Level</Text>
                  <Text style={styles.stockLevelValue}>{alert.stockLevel}</Text>
                </View>

                {/* Progress bar */}
                <View style={[styles.progressBarTrack, { backgroundColor: alert.trackColor }]}>
                  {alert.progress > 0 && (
                    <View style={[
                      styles.progressBarFill, 
                      { width: `${alert.progress * 100}%`, backgroundColor: alert.color }
                    ]} />
                  )}
                </View>
              </View>
            </View>
          ))}
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
  content: {
    padding: 20,
    gap: 16,
  },
  topSummaryRow: {
    flexDirection: 'row',
    gap: 16,
  },
  summaryCard: {
    flex: 1,
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
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    fontFamily: Fonts?.sans,
    flex: 1,
  },
  summaryContent: {
    gap: 4,
  },
  summaryCount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: Fonts?.sans,
  },
  summaryAction: {
    fontSize: 13,
    color: '#EA580C',
    fontWeight: '600',
    fontFamily: Fonts?.sans,
  },
  restockCostCard: {
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
  restockAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: Fonts?.sans,
  },
  alertsList: {
    gap: 12,
    marginTop: 8,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F3F6',
    gap: 16,
    shadowColor: '#1F2937',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  productImageContainer: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productDetails: {
    flex: 1,
  },
  badgeAndButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeWarning: {
    backgroundColor: '#FFF1E6',
  },
  badgeCritical: {
    backgroundColor: '#FFF1F1',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: Fonts?.sans,
  },
  badgeTextWarning: {
    color: '#EA580C',
  },
  badgeTextCritical: {
    color: '#EF4444',
  },
  orderButton: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  orderButtonWarning: {
    backgroundColor: '#FFF1E6',
  },
  orderButtonCritical: {
    backgroundColor: '#FFF1F1',
  },
  orderButtonText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Fonts?.sans,
  },
  orderButtonTextWarning: {
    color: '#EA580C',
  },
  orderButtonTextCritical: {
    color: '#EF4444',
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: Fonts?.sans,
    marginBottom: 2,
  },
  productSku: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: Fonts?.sans,
    marginBottom: 12,
  },
  stockLevelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  stockLevelLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: Fonts?.sans,
  },
  stockLevelValue: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: Fonts?.sans,
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});
