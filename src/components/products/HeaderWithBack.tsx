import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { Fonts } from '@/constants/theme';

interface HeaderWithBackProps {
  title: string;
  rightIcon?: React.ReactNode;
  onRightPress?: () => void;
}

export default function HeaderWithBack({ title, rightIcon, onRightPress }: HeaderWithBackProps) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={15}>
        <ChevronLeft size={24} color="#0F172A" />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.rightSlot}>
        {rightIcon ? (
          <Pressable onPress={onRightPress} hitSlop={15}>
            {rightIcon}
          </Pressable>
        ) : (
          <View style={{ width: 24 }} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0F172A',
    fontFamily: Fonts?.sans,
  },
  rightSlot: {
    width: 32,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
