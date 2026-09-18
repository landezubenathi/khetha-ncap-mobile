import { Pressable, ScrollView, Text } from 'react-native';
import { colors, spacing } from '../theme';

type Props = { options: string[]; selected: string; onSelect: (v: string) => void };

export default function FilterChips({ options, selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingBottom: spacing.sm }}
    >
      {['All', ...options].map((opt) => {
        const active = opt === selected || (opt === 'All' && selected === '');
        return (
          <Pressable
            key={opt}
            onPress={() => onSelect(opt === 'All' ? '' : opt)}
            style={{
              borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8,
              backgroundColor: active ? colors.navy : colors.white,
              borderWidth: 1, borderColor: active ? colors.navy : colors.border,
              minHeight: 36, justifyContent: 'center',
            }}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`Filter by ${opt}`}
          >
            <Text style={{ color: active ? colors.white : colors.ink, fontWeight: '600', fontSize: 13 }}>
              {opt}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
