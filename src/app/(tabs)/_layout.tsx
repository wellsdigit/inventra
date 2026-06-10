import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeIcon from '@/assets/icons/tabs/home.svg';
import HomeActiveIcon from '@/assets/icons/tabs/home-active.svg';
import AnalyticsIcon from '@/assets/icons/tabs/analytics.svg';
import AnalyticsActiveIcon from '@/assets/icons/tabs/pie-chart.svg';
import AlertIcon from '@/assets/icons/tabs/alert.svg';
import AlertActiveIcon from '@/assets/icons/tabs/alert-active.svg';
import ProductIcon from '@/assets/icons/tabs/product.svg';
import ProductActiveIcon from '@/assets/icons/tabs/products-active.svg';
import SaleIcon from '@/assets/icons/tabs/sale.svg';
import SaleActiveIcon from '@/assets/icons/tabs/sale-active.svg';

import { Brand, Fonts } from '@/constants/theme';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Brand.primaryDark,
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontFamily: Fonts?.sans,
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          paddingTop: 12,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          elevation: 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            focused ? (
              <HomeActiveIcon width={24} height={24} />
            ) : (
              <HomeIcon width={24} height={24} color={color} />
            )
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Products',
          tabBarIcon: ({ color, focused }) => (
            focused ? (
              <ProductActiveIcon width={24} height={24} />
            ) : (
              <ProductIcon width={24} height={24} color={color} />
            )
          ),
        }}
      />
      <Tabs.Screen
        name="sale"
        options={{
          title: 'Sale',
          tabBarIcon: ({ color, focused }) => (
            focused ? (
              <SaleActiveIcon width={24} height={24} />
            ) : (
              <SaleIcon width={24} height={24} color={color} />
            )
          ),
        }}
      />
      <Tabs.Screen
        name="alert"
        options={{
          title: 'Alert',
          tabBarIcon: ({ color, focused }) => (
            <View>
              {focused ? (
                <AlertActiveIcon width={24} height={24} />
              ) : (
                <AlertIcon width={24} height={24} color={color} />
              )}
              <View style={styles.badge}>
                <Text style={styles.badgeText}>10</Text>
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color, focused }) => (
            focused ? (
              <AnalyticsActiveIcon width={24} height={24} />
            ) : (
              <AnalyticsIcon width={24} height={24} color={color} />
            )
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: Fonts?.sans,
    fontWeight: '700',
  },
});
