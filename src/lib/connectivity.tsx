import { useEffect, useState } from 'react';
import { View, Text, Platform } from 'react-native';
import { colors } from '../theme';
import { useT } from '../i18n';

export function useIsOffline(): boolean {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const onOnline  = () => setOffline(false);
      const onOffline = () => setOffline(true);
      setOffline(!navigator.onLine);
      window.addEventListener('online',  onOnline);
      window.addEventListener('offline', onOffline);
      return () => {
        window.removeEventListener('online',  onOnline);
        window.removeEventListener('offline', onOffline);
      };
    }
    // Native: lazy-load NetInfo only when not on web
    let unsub: (() => void) | undefined;
    import('@react-native-community/netinfo').then((NetInfo) => {
      unsub = NetInfo.default.addEventListener((state) => {
        setOffline(state.isConnected === false);
      });
    });
    return () => unsub?.();
  }, []);

  return offline;
}

export function OfflineBanner() {
  const offline = useIsOffline();
  const t = useT();
  if (!offline) return null;
  return (
    <View
      style={{
        backgroundColor: '#92600A',
        paddingVertical: 8,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      }}
      accessibilityRole="alert"
      accessibilityLabel={t('offline_banner')}
    >
      <Text style={{ fontSize: 14 }}>📶</Text>
      <Text style={{ color: colors.white, fontSize: 13, fontWeight: '700', flex: 1 }}>
        {t('offline_banner')}
      </Text>
    </View>
  );
}
