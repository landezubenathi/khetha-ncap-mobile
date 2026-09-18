import { TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';

type Props = { value: string; onChangeText: (t: string) => void; placeholder?: string };

export default function SearchBar({ value, onChangeText, placeholder = 'Search…' }: Props) {
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white,
      borderRadius: 12, paddingHorizontal: spacing.sm, marginBottom: spacing.sm,
      borderWidth: 1, borderColor: colors.border, height: 48,
    }}>
      <Ionicons name="search" size={18} color={colors.muted} style={{ marginRight: 8 }} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        style={{ flex: 1, color: colors.navy, fontSize: 15 }}
        accessibilityLabel={placeholder}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
    </View>
  );
}
