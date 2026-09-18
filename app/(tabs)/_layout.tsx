import { Tabs } from 'expo-router';
import { ActivityIndicator, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow } from '../../src/theme';
import { useRequireAuth } from '../../src/lib/session';
import { router } from 'expo-router';

export default function TabsLayout() {
  const ready = useRequireAuth();

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.yellow} size="large" />
      </View>
    );
  }
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          height: 68,
          paddingBottom: 10,
          paddingTop: 6,
          backgroundColor: colors.white,
          borderTopWidth: 0,
          ...shadow.lg,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700' },
        headerStyle: { backgroundColor: colors.navy },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: '800' },
      }}
    >
      <Tabs.Screen name="index"     options={{ title: 'Home',      headerShown: false, tabBarIcon: ({ color, size }) => <Ionicons name="home"     color={color} size={size} /> }} />
      <Tabs.Screen name="explore"   options={{ title: 'Explore',   tabBarIcon: ({ color, size }) => <Ionicons name="search"   color={color} size={size} /> }} />
      <Tabs.Screen name="journey"   options={{ title: 'Journey',   tabBarIcon: ({ color, size }) => <Ionicons name="map"      color={color} size={size} /> }} />
      <Tabs.Screen name="saved"     options={{ title: 'Saved',     tabBarIcon: ({ color, size }) => <Ionicons name="bookmark" color={color} size={size} /> }} />
      <Tabs.Screen name="profile"   options={{ title: 'Profile',   tabBarIcon: ({ color, size }) => <Ionicons name="person"   color={color} size={size} /> }} />
    </Tabs>
  );
}
