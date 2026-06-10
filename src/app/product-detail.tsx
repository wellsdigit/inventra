import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SquarePen } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Fonts } from '@/constants/theme';
import HeaderWithBack from '@/components/products/HeaderWithBack';
import DetailRow from '@/components/products/DetailRow';
import { useProductStore } from '@/store/useProductStore';
import { ProductStatus } from '@/components/products/types';

const getStatusStyles = (status: ProductStatus | string) => {
  switch (status) {
    case 'In stock': return { bg: '#DCFCE7', text: '#16A34A' };
    case 'Low Stock': return { bg: '#FFEDD5', text: '#EA580C' };
    case 'Out of Stock': return { bg: '#FEE2E2', text: '#DC2626' };
    case 'Expired': return { bg: '#F1F5F9', text: '#64748B' };
    default: return { bg: '#DCFCE7', text: '#16A34A' };
  }
};

export default function ProductDetailScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const router = useRouter();

  const products = useProductStore((state) => state.products);
  const product = products.find(p => p.id === params.id);

  // Use product data if available, else mock data fallback
  const name = product?.name || (params.name as string) || 'Golden Penny Semovita 1Kg';
  const category = product?.category || (params.category as string) || 'Food';
  const sku = product?.sku || (params.sku as string) || 'GPS-1KG-BG';
  const sellingPrice = product?.price?.toLocaleString() || (params.sellingPrice as string) || '2,800';
  const costPrice = '2,200'; // Usually fetched from the product, hardcoding fallback
  const lowStockAlert = '5';
  const unit = product?.unit || (params.unit as string) || 'bag';
  const supplier = 'Dufil Prima';
  const stock = product?.stock !== undefined ? product.stock.toString() : '12';
  const imageSource = product?.image || require('@/assets/images/indomie.png');
  const status = product?.status || 'In stock';
  
  const statusStyles = getStatusStyles(status);

  return (
    <View style={styles.container}>
      <View style={[styles.headerWrapper, { paddingTop: Platform.OS === 'ios' ? insets.top : 16 }]}>
        <HeaderWithBack 
          title="Product Detail" 
          rightIcon={<SquarePen size={22} color="#0F172A" />} 
          onRightPress={() => console.log('Edit pressed')}
        />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
      >
        {/* Top Info Card */}
        <View style={styles.topCard}>
          <View style={styles.imageBox}>
            <Image 
              source={imageSource} 
              style={styles.productImage} 
              contentFit="contain" 
            />
          </View>
          <View style={styles.topInfo}>
            <View style={[styles.statusPill, { backgroundColor: statusStyles.bg }]}>
              <Text style={[styles.statusText, { color: statusStyles.text }]}>{status}</Text>
            </View>
            <Text style={styles.productName} numberOfLines={2}>
              {name}
            </Text>
            <Text style={styles.metaText}>
              SKU: {sku}    Barcode: 50000112548013
            </Text>
            <Text style={styles.priceContainer}>
              <Text style={styles.priceBold}>₦{sellingPrice}</Text>
              <Text style={styles.priceUnit}> / {unit}</Text>
            </Text>
          </View>
        </View>

        {/* Product Info List Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Product Info</Text>
          
          <DetailRow label="Category" value={category} />

          {/* Current Stock dynamic row */}
          {status === 'Expired' ? (
            <DetailRow 
              label="Current Stock" 
              rightComponent={
                <Text style={{ color: '#DC2626', fontWeight: '600', fontSize: 14, fontFamily: Fonts?.sans }}>
                  {stock} {unit}s (expired)
                </Text>
              } 
            />
          ) : status === 'Low Stock' ? (
            <DetailRow 
              label="Current Stock" 
              rightComponent={
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ fontWeight: '600', fontSize: 14, color: '#1E293B', fontFamily: Fonts?.sans }}>
                    {stock} {unit}s
                  </Text>
                  <View style={{ backgroundColor: '#FFEDD5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 }}>
                    <Text style={{ color: '#EA580C', fontSize: 12, fontWeight: '500', fontFamily: Fonts?.sans }}>
                      Below reorder level
                    </Text>
                  </View>
                </View>
              } 
            />
          ) : status === 'Out of Stock' ? (
            <DetailRow 
              label="Current Stock" 
              rightComponent={
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ fontWeight: '600', fontSize: 14, color: '#1E293B', fontFamily: Fonts?.sans }}>
                    0 {unit}
                  </Text>
                  <View style={{ backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 }}>
                    <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '500', fontFamily: Fonts?.sans }}>
                      Unavailable
                    </Text>
                  </View>
                </View>
              } 
            />
          ) : (
            <DetailRow label="Current Stock" value={`${stock} ${unit}s`} />
          )}

          {/* Reorder Level - Only for In Stock / Low Stock */}
          {(status === 'In stock' || status === 'Low Stock') && (
            <DetailRow label="Reorder Level" value={`${lowStockAlert} ${unit}s`} />
          )}

          <DetailRow label="Cost Price" value={`₦${costPrice}`} />

          {/* Status specific rows */}
          {status === 'Out of Stock' && (
            <DetailRow label="Days Out of Stock" value="4 days" />
          )}
          {status === 'Expired' && (
            <DetailRow label="Expiry Date" value="15 Apr 2026" valueColor="#DC2626" />
          )}
          {status === 'In stock' && (
            <DetailRow label="Margin" value="21.4%" valueColor="#16A34A" />
          )}

          {/* Restocked / Received */}
          {status === 'Low Stock' && (
            <DetailRow label="Last Restocked" value="18 May 2026" />
          )}
          {status === 'Out of Stock' && (
            <DetailRow label="Last Restocked" value="2 May 2026" />
          )}
          {status === 'Expired' && (
            <DetailRow label="Date Received" value="10 Jan 2026" />
          )}

          <DetailRow label="Supplier" value={supplier} valueColor="#16A34A" isLast />
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <Pressable 
          style={styles.btnOutline} 
          onPress={() => status === 'Expired' ? console.log('Return to supplier') : router.push({ pathname: '/adjust-stock', params: { id: product?.id } })}
        >
          <Text style={styles.btnOutlineText}>
            {status === 'Expired' ? 'Return to Supplier' : 'Adjust stock'}
          </Text>
        </Pressable>
        <Pressable 
          style={styles.btnSolid}
          onPress={() => router.push({ pathname: '/stock-in', params: { id: product?.id } })}
        >
          <Text style={styles.btnSolidText}>Stock-in</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // slightly off-white bg matching the mockup
  },
  headerWrapper: {
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 16,
  },
  topCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 16,
  },
  imageBox: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  topInfo: {
    flex: 1,
    alignItems: 'flex-start',
  },
  statusPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  statusText: {
    color: '#16A34A',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Fonts?.sans,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    fontFamily: Fonts?.sans,
    marginBottom: 4,
    lineHeight: 22,
  },
  metaText: {
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: Fonts?.sans,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceBold: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    fontFamily: Fonts?.sans,
  },
  priceUnit: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: Fonts?.sans,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  infoCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
    fontFamily: Fonts?.sans,
    marginBottom: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    flexDirection: 'row',
    gap: 16,
  },
  btnOutline: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#385F24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOutlineText: {
    color: '#385F24',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts?.sans,
  },
  btnSolid: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: '#385F24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSolidText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts?.sans,
  },
});
