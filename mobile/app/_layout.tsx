import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { ActivityIndicator, View, TouchableOpacity, Text } from 'react-native';
 

export const unstable_settings = {
  // Start the app at the auth flow by default so unauthenticated users land
  // on the sign-in screen. This prevents the tabs from being the initial route.
  anchor: '(auth)/login',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  function AuthGate() {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();

    async function handleSignOut() {
      try {
        await signOut();
      } finally {
        // Ensure navigation to auth screen
        router.replace('/(auth)/login');
      }
    }

    if (loading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <Stack>
        {user ? (
          <>
            <Stack.Screen
              name="(tabs)"
              options={{
                // hide the parent stack header so the Tabs navigator controls the header
                // (prevents duplicate router header bars appearing)
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="modal"
              options={{
                presentation: 'modal',
                title: 'Modal',
                headerShown: true,
                headerRight: () => (
                  <TouchableOpacity onPress={handleSignOut} style={{ paddingHorizontal: 12 }}>
                    <Text style={{ color: '#007AFF' }}>Sign out</Text>
                  </TouchableOpacity>
                ),
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/signup" options={{ headerShown: false }} />
          </>
        )}
      </Stack>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
