import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Trash2 } from 'lucide-react-native';

import { Fonts } from '@/constants/theme';
import { Product, ProductStatus } from './types';

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
  onPress?: (product: Product) => void;
}

const getStatusStyles = (status: ProductStatus) => {
  switch (status) {
    case 'In stock': return { bg: '#DCFCE7', text: '#16A34A', dot: '#16A34A' };
    case 'Low Stock': return { bg: '#FFEDD5', text: '#EA580C', dot: '#EA580C' };
    case 'Out of Stock': return { bg: '#FEE2E2', text: '#DC2626', dot: '#DC2626' };
    case 'Expired': return { bg: '#F1F5F9', text: '#64748B', dot: '#64748B' };
  }
};

export default function ProductCard({ product, onDelete, onPress }: ProductCardProps) {
  const statusStyles = getStatusStyles(product.status);

  return (
    <Pressable style={styles.productCard} onPress={() => onPress && onPress(product)}>
      <View style={styles.productImageWrapper}>
        <Image source={product.image} style={styles.productImage} contentFit="contain" />
      </View>
      
      <View style={styles.productInfo}>
        <View style={styles.cardHeaderRow}>
          <View style={[styles.statusPill, { backgroundColor: statusStyles.bg }]}>
            <Text style={[styles.statusPillText, { color: statusStyles.text }]}>
              {product.status}
            </Text>
          </View>
          <Pressable 
            style={styles.deleteBtn} 
            onPress={() => onDelete(product.id)}
            hitSlop={10}
          >
            <Trash2 size={18} color="#DC2626" />
          </Pressable>
        </View>
        
        <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.productSku}>{product.sku}</Text>
        
        <View style={styles.cardBottomRow}>
          <Text style={styles.productPriceText}>
            <Text style={styles.productPriceBold}>₦{product.price.toLocaleString()}</Text>
            <Text style={styles.productUnit}> / {product.unit}</Text>
          </Text>
          <View style={styles.stockInfo}>
            <View style={[styles.stockDot, { backgroundColor: statusStyles.dot }]} />
            <Text style={styles.stockCountText}>
              {product.stock} {product.unit}{product.stock !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    alignItems: 'center',
  },
  productImageWrapper: {
    width: 64,
    height: 64,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 4,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Fonts?.sans,
  },
  deleteBtn: {
    padding: 2,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    fontFamily: Fonts?.sans,
    marginBottom: 2,
  },
  productSku: {
    fontSize: 13,
    color: '#94A3B8',
    fontFamily: Fonts?.sans,
    marginBottom: 8,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPriceText: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  productPriceBold: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    fontFamily: Fonts?.sans,
  },
  productUnit: {
    fontSize: 13,
    color: '#64748B',
    fontFamily: Fonts?.sans,
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  stockCountText: {
    fontSize: 13,
    color: '#64748B',
    fontFamily: Fonts?.sans,
  },
});
