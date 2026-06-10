import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { ChevronDown } from 'lucide-react-native';

import { Fonts } from '@/constants/theme';

interface CustomInputProps extends TextInputProps {
  label: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isDropdown?: boolean;
  inputStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

export default function CustomInput({ label, leftIcon, rightIcon, isDropdown, style, inputStyle, containerStyle, ...props }: CustomInputProps) {
  return (
    <View style={[styles.container, style as any, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, props.editable === false && styles.inputContainerDisabled]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input, 
            leftIcon ? styles.inputWithLeftIcon : null,
            rightIcon ? styles.inputWithRightIcon : null,
            inputStyle
          ]}
          placeholderTextColor="#94A3B8"
          editable={props.editable !== undefined ? props.editable : !isDropdown}
          {...props}
        />
        {isDropdown && !rightIcon && (
          <View style={styles.rightIcon}>
            <ChevronDown size={20} color="#64748B" />
          </View>
        )}
        {rightIcon && (
          <View style={styles.rightIcon}>{rightIcon}</View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
    fontFamily: Fonts?.sans,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    height: 48,
    paddingHorizontal: 12,
  },
  inputContainerDisabled: {
    backgroundColor: '#F8FAFC', // light gray for disabled
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#1E293B',
    fontFamily: Fonts?.sans,
  },
  inputWithLeftIcon: {
    marginLeft: 8,
  },
  inputWithRightIcon: {
    marginRight: 8,
  },
  leftIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
