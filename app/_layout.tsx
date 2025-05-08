import { useCallback, useEffect } from 'react';
import { Stack } from 'expo-router'; // comentario
import { StatusBar } from 'expo-status-bar';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/contexts/AuthContext';
import { NeedsProvider } from '@/contexts/NeedsContext';
import { MessagesProvider } from '@/contexts/MessagesContext';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';
import { AppTheme } from '@/constants/theme';

// Keep the splash screen visible until fonts loaded
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useFrameworkReady();

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <AuthProvider>
        <NeedsProvider>
          <MessagesProvider>
            <Stack screenOptions={{ 
              headerStyle: { backgroundColor: AppTheme.colors.primary },
              headerTintColor: 'white',
              headerTitleStyle: { fontFamily: 'Inter-SemiBold' }
            }}>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="auth/login" options={{ title: 'Sign In', headerShown: false }} />
              <Stack.Screen name="auth/register" options={{ title: 'Create Account', headerShown: false }} />
              <Stack.Screen name="need/[id]" options={{ title: 'Need Details' }} />
              <Stack.Screen name="messages/conversation/[id]" options={{ title: 'Chat' }} />
              <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
            </Stack>
            <StatusBar style="auto" />
          </MessagesProvider>
        </NeedsProvider>
      </AuthProvider>
    </View>
  );
}