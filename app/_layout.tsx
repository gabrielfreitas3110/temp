import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Splash } from "./splash";
import { useState } from "react";
import { preventAutoHideAsync } from "expo-splash-screen";

preventAutoHideAsync();

export default function RootLayout() {
  const [splashComplete, setSplashComplete] = useState(false);

  return !splashComplete ? (
    <Splash onComplete={setSplashComplete} />
  ) : (
    <Stack>
      <Stack.Screen name="splash" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="quiz" options={{ headerShown: false }} />
      <Stack.Screen name="questionsMenu" options={{ headerShown: false }} />
      <Stack.Screen name="slides" options={{ headerShown: false }} />
      <Stack.Screen name="grid" options={{ headerShown: false }} />
      <Stack.Screen name="member" options={{ headerShown: false }} />
      <Stack.Screen name="videoPlayer" options={{ headerShown: false }} />
      <Stack.Screen name="daniellAnimation" options={{ headerShown: false }} />
    </Stack>
  );
}
