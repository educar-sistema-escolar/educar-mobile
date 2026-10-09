import { Redirect, Tabs } from 'expo-router';
import React from 'react';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/lib/auth';
import { palette } from '@/constants/palette';

export default function TabLayout() {
  const {session,ready}=useAuth();
  if(!ready) return null;
  if(!session) return <Redirect href="/login" />;
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: palette.ink,
        tabBarInactiveTintColor: palette.muted,
        tabBarStyle: { backgroundColor: palette.paper, borderTopColor: palette.line, height: 62, paddingTop: 5 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={22} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          title: 'Payments',
          tabBarIcon: ({ color }) => <IconSymbol size={22} name="creditcard.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: 'Services',
          tabBarIcon: ({ color }) => <IconSymbol size={22} name="person.2.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
