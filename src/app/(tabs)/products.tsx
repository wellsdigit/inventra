import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, ScanLine, Filter, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { Fonts } from '@/constants/theme';
import { Product } from '@/components/products/types';
import ProductCard from '@/components/products/ProductCard';
import FilterModal from '@/components/products/FilterModal';
import DeleteModal from '@/components/products/DeleteModal';
import EmptyState from '@/components/products/EmptyState';
import SuccessScreen from '@/components/products/SuccessScreen';
import { useProductStore } from '@/store/useProductStore';

export default function ProductsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const products = useProductStore((state) => state.products);
  const deleteProductFromStore = useProductStore((state) => state.deleteProduct);

  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter Modal State
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState<string | null>(null);

  // Delete Modal State
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // Success Screen State
  const [isSuccessView, setSuccessView] = useState(false);

  const handleDeletePress = (id: string) => {
    setProductToDelete(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProductFromStore(productToDelete);
    }
    setDeleteModalVisible(false);
    setProductToDelete(null);
    setSuccessView(true); // Show success view
  };

  const handleApplyFilter = (category: string, stock: string | null) => {
    setCategoryFilter(category);
    setStockFilter(stock);
  };

  // Filter Logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = true;
    if (categoryFilter !== 'All') {
      matchesCategory = product.category === categoryFilter;
    }

    let matchesStock = true;
    if (stockFilter === 'Out of stock') matchesStock = product.status === 'Out of Stock';
    if (stockFilter === 'Low stock') matchesStock = product.status === 'Low Stock';
    if (stockFilter === 'Expired stock') matchesStock = product.status === 'Expired';

    return matchesSearch && matchesCategory && matchesStock;
  });

  if (isSuccessView) {
    return <SuccessScreen onGoHome={() => setSuccessView(false)} />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top + 8 : 24 }]}>
        <Text style={styles.headerTitle}>Products</Text>
        {products.length > 0 && (
          <Pressable style={styles.headerAddBtn} onPress={() => router.push('/add-product')}>
            <Plus size={16} color="#FFFFFF" />
            <Text style={styles.headerAddBtnText}>Add Product</Text>
          </Pressable>
        )}
      </View>

      {/* Search Bar Row */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products or SKU"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Pressable>
            <ScanLine size={20} color="#6B7280" />
          </Pressable>
        </View>
        <Pressable style={styles.filterBtn} onPress={() => setFilterModalVisible(true)}>
          <Filter size={20} color="#6B7280" />
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {filteredProducts.length === 0 ? (
          <EmptyState 
            type={products.length === 0 ? 'no-products' : 'no-search'} 
            onAddProduct={products.length === 0 ? () => router.push('/add-product') : undefined}
          />
        ) : (
          <View style={styles.productList}>
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onDelete={handleDeletePress} 
                onPress={(product) => {
                  router.push({
                    pathname: '/product-detail',
                    params: { id: product.id }
                  });
                }}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Modals */}
      <FilterModal 
        visible={isFilterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyFilter}
        initialCategory={categoryFilter}
        initialStock={stockFilter}
      />

      <DeleteModal 
        visible={isDeleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={confirmDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#0F172A',
    fontFamily: Fonts?.sans,
  },
  headerAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#385F24',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  headerAddBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Fonts?.sans,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: Fonts?.sans,
    color: '#1F2937',
  },
  filterBtn: {
    width: 48,
    height: 48,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    flexGrow: 1,
  },
  productList: {
    gap: 16,
  },
});
