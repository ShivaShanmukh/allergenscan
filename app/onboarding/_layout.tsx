import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="allergens" />
      <Stack.Screen name="dietary" />
      <Stack.Screen name="goals" />
    </Stack>
  );
}
