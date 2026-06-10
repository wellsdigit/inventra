import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Fonts } from '@/constants/theme';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (category: string, stock: string | null) => void;
  initialCategory: string;
  initialStock: string | null;
}

const CATEGORIES = ['All', 'Beverages', 'Food', 'Personal Care', 'Health and Beauty'];
const STOCK_STATUSES = ['Out of stock', 'Low stock', 'Expired stock'];

export default function FilterModal({
  visible,
  onClose,
  onApply,
  initialCategory,
  initialStock,
}: FilterModalProps) {
  const insets = useSafeAreaInsets();
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [stockFilter, setStockFilter] = useState(initialStock);

  useEffect(() => {
    if (visible) {
      setCategoryFilter(initialCategory);
      setStockFilter(initialStock);
    }
  }, [visible, initialCategory, initialStock]);

  const handleApply = () => {
    onApply(categoryFilter, stockFilter);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalSheet, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          <View style={styles.modalHandleWrapper}>
            <View style={styles.modalHandle} />
          </View>
          
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Products</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.filterSectionTitle}>Category</Text>
            <View style={styles.categoryPills}>
              {CATEGORIES.map(cat => {
                const isActive = categoryFilter === cat;
                return (
                  <Pressable 
                    key={cat}
                    style={[styles.catPill, isActive && styles.catPillActive]}
                    onPress={() => setCategoryFilter(cat)}
                  >
                    <Text style={[styles.catPillText, isActive && styles.catPillTextActive]}>{cat}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.filterSectionTitle}>Stock Availability</Text>
            <View style={styles.radioGroup}>
              {STOCK_STATUSES.map(status => {
                const isActive = stockFilter === status;
                return (
                  <Pressable 
                    key={status} 
                    style={styles.radioRow}
                    onPress={() => setStockFilter(isActive ? null : status)}
                  >
                    <View style={[styles.radioOuter, isActive && styles.radioOuterActive]}>
                      {isActive && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.radioText}>{status}</Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <Pressable style={styles.applyFilterBtn} onPress={handleApply}>
              <Text style={styles.applyFilterBtnText}>Apply Filter</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    maxHeight: '90%',
  },
  modalHandleWrapper: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
  },
  modalHeader: {
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    fontFamily: Fonts?.sans,
  },
  filterSectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
    fontFamily: Fonts?.sans,
    marginBottom: 12,
  },
  categoryPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 28,
  },
  catPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  catPillActive: {
    backgroundColor: '#385F24',
    borderColor: '#385F24',
  },
  catPillText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    fontFamily: Fonts?.sans,
  },
  catPillTextActive: {
    color: '#FFFFFF',
  },
  radioGroup: {
    gap: 16,
    marginBottom: 32,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterActive: {
    borderColor: '#385F24',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#385F24',
  },
  radioText: {
    fontSize: 15,
    color: '#475569',
    fontFamily: Fonts?.sans,
  },
  modalFooter: {
    paddingTop: 16,
  },
  applyFilterBtn: {
    backgroundColor: '#385F24',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyFilterBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts?.sans,
  },
});
