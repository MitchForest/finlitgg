import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
        }}
      />
      <Tabs.Screen
        name="earn"
        options={{
          title: 'Earn',
        }}
      />
      <Tabs.Screen
        name="save"
        options={{
          title: 'Save',
        }}
      />
    </Tabs>
  );
}




