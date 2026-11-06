import { type ColorValue } from 'react-native';
import React from 'react';
import { Redirect, Tabs } from 'expo-router';
import { useDemo } from '@/lib/demo';
import { Icon, colors, type IconName } from './demo-ui';

export function DemoTabs() {
  const { role } = useDemo();
  if (!role) return <Redirect href="/login" />;
  const tab = (title: string, icon: IconName, hidden = false) => ({ title, href: hidden ? null : undefined, tabBarIcon: ({ color }: { color: ColorValue }) => <Icon name={icon} color={color} size={22} /> });
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.deep, tabBarInactiveTintColor: colors.muted, tabBarActiveBackgroundColor: '#EDF5FF', tabBarItemStyle: { borderRadius:16, marginHorizontal:4 }, tabBarLabelStyle: { fontSize: 11, fontWeight: '600' }, tabBarStyle: { alignSelf: 'center', width: '100%', maxWidth: 600, height: 72, paddingTop: 8, paddingBottom: 10, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: colors.line, boxShadow: '0px -4px 20px rgba(28,57,101,.035)' }, sceneStyle: { backgroundColor: '#EAF0F8' } }}>
    <Tabs.Screen name="index" options={tab('Inicio', 'home-outline')} />
    <Tabs.Screen name="children" options={tab('Mis hijos', 'people-outline', role !== 'family')} />
    <Tabs.Screen name="payments" options={tab('Cuotas', 'wallet-outline', role !== 'family')} />
    <Tabs.Screen name="services" options={tab('Servicios', 'grid-outline')} />
    <Tabs.Screen name="transport" options={tab('Transporte', 'bus-outline')} />
  </Tabs>;
}

