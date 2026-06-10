import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, KeyboardAvoidingView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { Fonts } from '@/constants/theme';
import HeaderWithBack from '@/components/products/HeaderWithBack';
import CustomInput from '@/components/products/CustomInput';
import OptionsModal from '@/components/products/OptionsModal';
import { useProductStore } from '@/store/useProductStore';

const CATEGORIES = ['Food', 'Beverages', 'Personal Care', 'Health and Beauty'];
const UNITS = ['kg', 'g', 'bag', 'tin', 'crate', 'Pack', 'pieces'];

export default function StockInScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();

  const products = useProductStore((state) => state.products);
  const product = products.find(p => p.id === params.id);

  const [productName, setProductName] = useState(product?.name || 'Golden Penny Semovita 1Kg');
  const [category, setCategory] = useState<string | null>(product?.category || 'Food');
  const [sku, setSku] = useState(product?.sku || '50000112548013');
  const [quantity, setQuantity] = useState('50');
  const [unit, setUnit] = useState<string | null>(product?.unit || 'Kg');
  const [batch, setBatch] = useState('');
  const [expiry, setExpiry] = useState('');
  const [supplier, setSupplier] = useState('');

  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [isUnitModalOpen, setUnitModalOpen] = useState(false);

  const handleStockIn = () => {
    // Nav back after stocking in
    router.back();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.headerWrapper, { paddingTop: Platform.OS === 'ios' ? insets.top : 16 }]}>
        <HeaderWithBack title="Stock In" />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        keyboardShouldPersistTaps="handled"
      >
        <CustomInput 
          label="Product Name" 
          value={productName}
          onChangeText={setProductName}
        />

        <View style={styles.row}>
          <Pressable style={styles.halfWidth} onPress={() => setCategoryModalOpen(true)}>
            <View pointerEvents="none">
              <CustomInput 
                label="Category" 
                value={category || ''}
                isDropdown 
              />
            </View>
          </Pressable>
          <CustomInput 
            label="SKU/Barcode" 
            value={sku}
            onChangeText={setSku}
            style={styles.halfWidth} 
          />
        </View>

        <View style={styles.row}>
          <CustomInput 
            label="Quantity to Add" 
            placeholder="0" 
            value={quantity}
            onChangeText={setQuantity}
            style={styles.halfWidth} 
            keyboardType="numeric"
          />
          <Pressable style={styles.halfWidth} onPress={() => setUnitModalOpen(true)}>
            <View pointerEvents="none">
              <CustomInput 
                label="Unit of Scale" 
                value={unit || ''}
                isDropdown 
              />
            </View>
          </Pressable>
        </View>

        <View style={styles.row}>
          <CustomInput 
            label="Batch Number (Optional)" 
            placeholder="0" 
            value={batch}
            onChangeText={setBatch}
            style={styles.halfWidth} 
          />
          <CustomInput 
            label="Expiry Date (Optional)" 
            placeholder="YYYY-MM-DD" 
            value={expiry}
            onChangeText={setExpiry}
            style={styles.halfWidth} 
          />
        </View>

        <CustomInput 
          label="Supplier" 
          placeholder="Product Name" 
          value={supplier}
          onChangeText={setSupplier}
        />

      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <Pressable style={styles.saveBtn} onPress={handleStockIn}>
          <Text style={styles.saveBtnText}>Stock In</Text>
        </Pressable>
      </View>

      <OptionsModal
        visible={isCategoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        title="Category"
        options={CATEGORIES}
        selectedOption={category}
        onSelect={setCategory}
      />

      <OptionsModal
        visible={isUnitModalOpen}
        onClose={() => setUnitModalOpen(false)}
        title="Unit of Scale"
        options={UNITS}
        selectedOption={unit}
        onSelect={setUnit}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerWrapper: {
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
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
  },
  saveBtn: {
    backgroundColor: '#2D511A', // slightly darker green matching screenshot
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts?.sans,
  },
});
