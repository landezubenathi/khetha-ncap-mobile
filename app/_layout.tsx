import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../src/theme';

const client = new QueryClient();
export default function RootLayout() { return <QueryClientProvider client={client}><StatusBar style="light" backgroundColor={colors.navy} /><Stack screenOptions={{ headerStyle: { backgroundColor: colors.navy }, headerTintColor: colors.white, headerTitleStyle: { fontWeight: '700' } }}><Stack.Screen name="index" options={{ headerShown: false }} /><Stack.Screen name="(tabs)" options={{ headerShown: false }} /><Stack.Screen name="onboarding" options={{ headerShown: false }} /><Stack.Screen name="questionnaire/[type]" options={{ title: 'Your questions' }} /><Stack.Screen name="career/[id]" options={{ title: 'Career details' }} /></Stack></QueryClientProvider>; }
