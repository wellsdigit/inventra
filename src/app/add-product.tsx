import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, KeyboardAvoidingView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScanLine } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { Fonts } from '@/constants/theme';
import HeaderWithBack from '@/components/products/HeaderWithBack';
import ImageUploader from '@/components/products/ImageUploader';
import CustomInput from '@/components/products/CustomInput';
import OptionsModal from '@/components/products/OptionsModal';
import { useProductStore } from '@/store/useProductStore';

const CATEGORIES = ['Food', 'Beverages', 'Personal Care', 'Health and Beauty'];
const UNITS = ['kg', 'g', 'bag', 'tin', 'crate', 'Pack', 'pieces'];

export default function AddProductScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [lowStockAlert, setLowStockAlert] = useState('');
  const [supplier, setSupplier] = useState('');
  const [expiry, setExpiry] = useState('');

  const [category, setCategory] = useState<string | null>(null);
  const [unit, setUnit] = useState<string | null>('kg'); // defaults to kg in UI mock

  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [isUnitModalOpen, setUnitModalOpen] = useState(false);

  const addProductToStore = useProductStore((state) => state.addProduct);

  const handleSave = () => {
    const finalName = name || 'Golden Penny Semovita 1Kg';
    const finalCategory = category || 'Food';
    const finalSku = sku || 'GPS-1KG-BG';
    const finalSellingPrice = sellingPrice || '2,800';
    const finalCostPrice = costPrice || '2,200';
    const finalLowStockAlert = lowStockAlert || '5';
    const finalUnit = unit || 'bag';
    const finalSupplier = supplier || 'Dufil Prima';
    const finalImageUri = imageUri || '';
    
    addProductToStore({
      name: finalName,
      sku: finalSku,
      price: parseInt(finalSellingPrice.replace(/,/g, ''), 10) || 0,
      unit: finalUnit,
      stock: 12, // Default mock stock for newly created
      image: finalImageUri ? { uri: finalImageUri } : require('@/assets/images/indomie.png'),
      category: finalCategory
    });

    router.back();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.headerWrapper, { paddingTop: Platform.OS === 'ios' ? insets.top : 16 }]}>
        <HeaderWithBack title="Add New Product" />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
      >
        <ImageUploader onImageSelected={setImageUri} />

        <CustomInput 
          label="Product Name" 
          placeholder="Product Name" 
          value={name}
          onChangeText={setName}
        />

        <View style={styles.row}>
          <Pressable style={styles.halfWidth} onPress={() => setCategoryModalOpen(true)}>
            <View pointerEvents="none">
              <CustomInput 
                label="Category" 
                placeholder="Placeholder" 
                value={category || ''}
                isDropdown 
              />
            </View>
          </Pressable>
          <CustomInput 
            label="SKU/Barcode" 
            placeholder="E.g SKU-123" 
            rightIcon={<ScanLine size={20} color="#64748B" />} 
            style={styles.halfWidth} 
            value={sku}
            onChangeText={setSku}
          />
        </View>

        <View style={styles.row}>
          <CustomInput 
            label="Selling Price" 
            placeholder="0.00" 
            leftIcon={<Text style={styles.currencyIcon}>₦</Text>} 
            style={styles.halfWidth} 
            keyboardType="numeric"
            value={sellingPrice}
            onChangeText={setSellingPrice}
          />
          <CustomInput 
            label="Cost Price" 
            placeholder="0.00" 
            leftIcon={<Text style={styles.currencyIcon}>₦</Text>} 
            style={styles.halfWidth} 
            keyboardType="numeric"
            value={costPrice}
            onChangeText={setCostPrice}
          />
        </View>

        <View style={styles.row}>
          <CustomInput 
            label="Low Stock Alert" 
            placeholder="0" 
            style={styles.halfWidth} 
            keyboardType="numeric"
            value={lowStockAlert}
            onChangeText={setLowStockAlert}
          />
          <Pressable style={styles.halfWidth} onPress={() => setUnitModalOpen(true)}>
            <View pointerEvents="none">
              <CustomInput 
                label="Unit of Scale" 
                placeholder="kg" 
                value={unit || ''}
                isDropdown 
              />
            </View>
          </Pressable>
        </View>

        <View style={styles.row}>
          <CustomInput 
            label="Supplier" 
            placeholder="Product Name" 
            style={styles.halfWidth} 
            value={supplier}
            onChangeText={setSupplier}
          />
          <CustomInput 
            label="Expiry Date (Optional)" 
            placeholder="Product Name" 
            style={styles.halfWidth} 
            value={expiry}
            onChangeText={setExpiry}
          />
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <Pressable style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Product</Text>
        </Pressable>
      </View>

      <OptionsModal
        visible={isCategoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        title="Select Category"
        options={CATEGORIES}
        selectedOption={category}
        onSelect={setCategory}
      />

      <OptionsModal
        visible={isUnitModalOpen}
        onClose={() => setUnitModalOpen(false)}
        title="Select Unit of Scale"
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
  currencyIcon: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '600',
    fontFamily: Fonts?.sans,
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
    backgroundColor: '#385F24',
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
