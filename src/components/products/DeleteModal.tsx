import React from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { Trash2 } from 'lucide-react-native';

import { Fonts } from '@/constants/theme';

interface DeleteModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteModal({ visible, onClose, onConfirm }: DeleteModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlayCenter}>
        <View style={styles.deleteModalBox}>
          <View style={styles.deleteIconBox}>
            <Trash2 size={24} color="#DC2626" />
          </View>
          <Text style={styles.deleteModalTitle}>Delete</Text>
          <Text style={styles.deleteModalText}>Are you sure you want to delete?</Text>
          
          <View style={styles.deleteModalActions}>
            <Pressable style={styles.btnCancel} onPress={onClose}>
              <Text style={styles.btnCancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.btnConfirm} onPress={onConfirm}>
              <Text style={styles.btnConfirmText}>Confirm</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  deleteModalBox: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  deleteIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    fontFamily: Fonts?.sans,
    marginBottom: 8,
  },
  deleteModalText: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    fontFamily: Fonts?.sans,
    marginBottom: 24,
  },
  deleteModalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  btnCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  btnCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
    fontFamily: Fonts?.sans,
  },
  btnConfirm: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#DC2626',
    alignItems: 'center',
  },
  btnConfirmText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: Fonts?.sans,
  },
});
