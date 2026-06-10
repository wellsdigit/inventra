import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';

import { Fonts } from '@/constants/theme';

interface ImageUploaderProps {
  onImageSelected?: (uri: string) => void;
}

export default function ImageUploader({ onImageSelected }: ImageUploaderProps) {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      if (onImageSelected) {
        onImageSelected(result.assets[0].uri);
      }
    }
  };

  if (imageUri) {
    return (
      <Pressable onPress={pickImage} style={styles.containerImage}>
        <Image source={{ uri: imageUri }} style={styles.imagePreview} contentFit="cover" />
      </Pressable>
    );
  }

  return (
    <Pressable style={styles.container} onPress={pickImage}>
      <View style={styles.iconCircle}>
        <Camera size={24} color="#475569" />
      </View>
      <Text style={styles.uploadText}>
        <Text style={styles.uploadTextGreen}>Click to upload</Text>
        <Text style={styles.uploadTextGrey}> or drag and drop</Text>
      </Text>
      <Text style={styles.uploadSubText}>SVG, PNG, JPG or GIF (max. 800x400px)</Text>
      <View style={styles.browseBtn}>
        <Text style={styles.browseBtnText}>Browse Files</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 24,
  },
  containerImage: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadText: {
    fontSize: 15,
    fontFamily: Fonts?.sans,
    marginBottom: 4,
  },
  uploadTextGreen: {
    color: '#385F24',
    fontWeight: '600',
  },
  uploadTextGrey: {
    color: '#64748B',
  },
  uploadSubText: {
    fontSize: 13,
    color: '#94A3B8',
    fontFamily: Fonts?.sans,
    marginBottom: 16,
  },
  browseBtn: {
    backgroundColor: '#385F24',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  browseBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Fonts?.sans,
  },
});
