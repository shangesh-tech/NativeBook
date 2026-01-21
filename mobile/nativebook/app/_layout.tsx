import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";
import { View } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);

  const { checkAuth, user, token, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    const prepare = async () => {
      await checkAuth();
      setIsReady(true);
      SplashScreen.hideAsync();
    };
    prepare();
  }, [checkAuth]);

  useEffect(() => {
    if (!isReady || isCheckingAuth) return;

    const inAuthScreen = segments[0] === "(auth)";
    const isSignedIn = user && token;

    if (!isSignedIn && !inAuthScreen) router.replace("/(auth)");
    else if (isSignedIn && inAuthScreen) router.replace("/(tabs)");
  }, [user, token, segments, isReady, isCheckingAuth, router]);

  if (!isReady) return null;

  return (
    <SafeAreaProvider>
      <View style={{ paddingTop: 40, flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
        <StatusBar style="dark" />
      </View>
    </SafeAreaProvider>
  );
}
