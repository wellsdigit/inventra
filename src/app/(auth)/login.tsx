import { View, Text, Button } from 'react-native';
import { router } from 'expo-router';

export default function LoginScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Welcome to Stocksense</Text>
      <Button title="Login" onPress={() => router.replace('/(tabs)')} />
    </View>
  );
}
