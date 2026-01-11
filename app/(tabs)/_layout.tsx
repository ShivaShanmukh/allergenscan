import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="login" />
      <Tabs.Screen name="scan" />
    </Tabs>
  );
}
