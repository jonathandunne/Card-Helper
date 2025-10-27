import { Tabs, useRouter } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { TouchableOpacity, Text } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { signOut } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    try {
      await signOut();
    } finally {
      router.replace('/(auth)/login');
    }
  }

  return (
    <Tabs
      // cast to any so we can pass through header options that the bottom tabs typing
      // doesn't include but which are respected by the underlying header implementation.
      screenOptions={( {
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Show header for every tab and add a sign-out button on the right
        headerShown: true,
        // hide the default back button title (prevents folder names like "(tabs)" from appearing)
        headerBackTitleVisible: false,
        headerRight: () => (
          <TouchableOpacity onPress={handleSignOut} style={{ paddingHorizontal: 12 }}>
            <Text style={{ color: Colors[colorScheme ?? 'light'].tint }}>Sign out</Text>
          </TouchableOpacity>
        ),
        tabBarButton: HapticTab,
      } as any)}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="purchase"
        options={{
          title: 'Purchase',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="cart.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="cards"
        options={{
          title: 'Cards',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="creditcard" color={color} />,
        }}
      />
    </Tabs>
  );
}
