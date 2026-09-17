import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme';
export default function TabsLayout() { return <Tabs screenOptions={{ tabBarActiveTintColor: colors.blue, tabBarStyle: { height: 64, paddingBottom: 8 }, headerStyle: { backgroundColor: colors.navy }, headerTintColor: colors.white }}>{[['index','Home','home'],['explore','Explore','search'],['journey','Journey','map'],['saved','Saved','bookmark'],['profile','Profile','person']].map(([name,title,icon]) => <Tabs.Screen key={name} name={name} options={{ title, tabBarIcon: ({ color, size }) => <Ionicons name={icon as any} color={color} size={size} /> }} />)}</Tabs>; }
