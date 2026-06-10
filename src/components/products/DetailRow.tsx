import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Fonts } from '@/constants/theme';

interface DetailRowProps {
  label: string;
  value?: string;
  valueColor?: string;
  isLast?: boolean;
  rightComponent?: React.ReactNode;
}

export default function DetailRow({ label, value, valueColor, isLast, rightComponent }: DetailRowProps) {
  return (
    <View style={[styles.row, !isLast && styles.borderBottom]}>
      <Text style={styles.label}>{label}</Text>
      {rightComponent ? (
        rightComponent
      ) : (
        <Text style={[styles.value, valueColor ? { color: valueColor } : undefined]}>
          {value}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  label: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: Fonts?.sans,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    fontFamily: Fonts?.sans,
  },
});
