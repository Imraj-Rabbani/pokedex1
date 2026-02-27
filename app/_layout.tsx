import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="pokemon-stats"
        options={{
          presentation: "formSheet",
          title: "More Info",
          headerShadowVisible: false,
          sheetGrabberVisible: true,
        }}
      />
    </Stack>
  );
}
