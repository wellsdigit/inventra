import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, KeyboardAvoidingView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { Fonts } from '@/constants/theme';
import HeaderWithBack from '@/components/products/HeaderWithBack';
import CustomInput from '@/components/products/CustomInput';
import OptionsModal from '@/components/products/OptionsModal';
import { useProductStore } from '@/store/useProductStore';

const REASONS = [
  'New Shipment',
  'Count Correction',
  'Damaged Goods',
  'Returned to Supplier',
  'Theft / Shrinkage',
  'Expiry Write-off'
];

export default function AdjustStockScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();

  const products = useProductStore((state) => state.products);
  const product = products.find(p => p.id === params.id);

  // Dynamic data based on product
  const productName = product?.name || 'Golden Penny Semovita 1Kg';
  const currentCount = product?.stock !== undefined ? product.stock : 12;
  const expectedCount = product?.stock !== undefined ? product.stock : 12;

  const [newCount, setNewCount] = useState(currentCount.toString());
  const [reason, setReason] = useState<string | null>(null);
  const [isReasonModalOpen, setReasonModalOpen] = useState(false);

  // Calculate discrepancy
  const newCountNum = parseInt(newCount, 10) || 0;
  const discrepancyNum = newCountNum - currentCount;
  const discrepancyText = discrepancyNum > 0 ? `+${discrepancyNum}` : `${discrepancyNum}`;
  const discrepancyColor = discrepancyNum > 0 ? '#16A34A' : (discrepancyNum < 0 ? '#DC2626' : '#64748B');

  const handleUpdate = () => {
    // Navigate back to product detail after saving
    router.back();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.headerWrapper, { paddingTop: Platform.OS === 'ios' ? insets.top : 16 }]}>
        <HeaderWithBack title="New Adjustment" />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        keyboardShouldPersistTaps="handled"
      >
        <CustomInput 
          label="Product Name" 
          value={productName}
          editable={false}
        />

        <View style={styles.row}>
          <CustomInput 
            label="Current Count" 
            value={currentCount.toString()}
            style={styles.halfWidth} 
            editable={false}
          />
          <CustomInput 
            label="New Count" 
            placeholder="0" 
            value={newCount}
            onChangeText={setNewCount}
            style={styles.halfWidth} 
            keyboardType="numeric"
          />
        </View>

        <View style={styles.row}>
          <CustomInput 
            label="Expected Count" 
            value={expectedCount.toString()}
            style={styles.halfWidth} 
            editable={false}
          />
          <CustomInput 
            label="Discrepancy" 
            value={newCount ? discrepancyText : ''}
            style={styles.halfWidth} 
            editable={false}
            inputStyle={{ color: discrepancyColor }}
          />
        </View>

        <Pressable onPress={() => setReasonModalOpen(true)}>
          <View pointerEvents="none">
            <CustomInput 
              label="Adjustment Reason" 
              placeholder="Select a reason" 
              value={reason || ''}
              isDropdown 
            />
          </View>
        </Pressable>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <Pressable style={styles.saveBtn} onPress={handleUpdate}>
          <Text style={styles.saveBtnText}>Update Ledger</Text>
        </Pressable>
      </View>

      <OptionsModal
        visible={isReasonModalOpen}
        onClose={() => setReasonModalOpen(false)}
        title="Adjustment Reason"
        options={REASONS}
        selectedOption={reason}
        onSelect={setReason}
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
