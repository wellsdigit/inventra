import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Check } from 'lucide-react-native';

import { Fonts } from '@/constants/theme';

interface SuccessScreenProps {
  onGoHome: () => void;
}

export default function SuccessScreen({ onGoHome }: SuccessScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successIconContainer}>
          <View style={styles.successIconCircle}>
            <View style={styles.successIconInner}>
              <Check size={36} color="#FFFFFF" />
            </View>
          </View>
        </View>

        <Text style={styles.successTitle}>Successful</Text>
        <Text style={styles.successSubtitle}>You've successfully deleted a product</Text>
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.homeBtn} onPress={onGoHome}>
          <Text style={styles.homeBtnText}>Go Back Home</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -80, // visual adjustment
  },
  successIconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIconInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#22C55E',
    fontFamily: Fonts?.sans,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 15,
    color: '#64748B',
    fontFamily: Fonts?.sans,
    textAlign: 'center',
  },
  footer: {
    width: '100%',
  },
  homeBtn: {
    backgroundColor: '#385F24',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  homeBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts?.sans,
  },
});
