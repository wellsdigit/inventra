import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Plus, ShoppingBag, FileSearch } from 'lucide-react-native';

import { Fonts } from '@/constants/theme';
import { Image } from 'expo-image';

interface EmptyStateProps {
  type: 'no-products' | 'no-search';
  onAddProduct?: () => void;
}

export default function EmptyState({ type, onAddProduct }: EmptyStateProps) {
  if (type === 'no-products') {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyGraphicWrapper}>
          <View style={styles.bagGraphicBg}>
            <ShoppingBag size={48} color="#94A3B8" />
            <View style={styles.alertCircle}>
              <Text style={styles.alertCircleText}>!</Text>
            </View>
          </View>
        </View>
        <Text style={styles.emptyTitle}>No products to show</Text>
        <Text style={styles.emptySubtitle}>
          You have not added a product yet.{'\n'}Add your first product now
        </Text>
        {onAddProduct && (
          <Pressable style={styles.addBtnCenter} onPress={onAddProduct}>
            <Plus size={18} color="#FFFFFF" />
            <Text style={styles.addBtnText}>Add Product</Text>
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <View style={styles.emptyContainer}>
      <Image
        source={require('@/assets/images/products/no-data.png')}
        style={styles.emptyImage}
      />
      <Text style={styles.emptyTitle}>No Search found</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyGraphicWrapper: {
    marginBottom: 24,
  },
  emptyImage: {
    width: 160,
    height: 160,
    marginBottom: 16,
  },
  bagGraphicBg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  searchGraphicBg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  alertCircle: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#94A3B8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F8FAFC',
  },
  alertCircleText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  alertCircleSmall: {
    position: 'absolute',
    top: 15,
    right: 25,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#86EFAC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F0FDF4',
  },
  alertCircleTextSmall: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    fontFamily: Fonts?.sans,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    fontFamily: Fonts?.sans,
    marginBottom: 24,
    lineHeight: 20,
  },
  addBtnCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#385F24',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts?.sans,
  },
});
