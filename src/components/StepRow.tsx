import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';

type Props = {
  index: number;
  label: string;
  status: string;
  done: boolean;
  onPress?: () => void;
};

export default function StepRow({ index, label, status, done, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={done}
      style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg }}
      accessibilityRole={done ? 'text' : 'button'}
      accessibilityLabel={`${label}: ${status}`}
      accessibilityState={{ disabled: done }}
    >
      <View style={{
        width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
        backgroundColor: done ? colors.teal : colors.white,
        borderWidth: done ? 0 : 2, borderColor: colors.border,
      }}>
        {done
          ? <Ionicons name="checkmark" size={18} color={colors.white} />
          : <Text style={{ color: colors.muted, fontWeight: '800', fontSize: 13 }}>{index}</Text>
        }
      </View>
      <View style={{ marginLeft: 14, flex: 1 }}>
        <Text style={{ color: done ? colors.muted : colors.navy, fontWeight: '800', fontSize: 15, textDecorationLine: done ? 'line-through' : 'none' }}>
          {label}
        </Text>
        <Text style={{ color: colors.muted, marginTop: 3, fontSize: 13 }}>{status}</Text>
      </View>
      {!done && onPress && (
        <Ionicons name="chevron-forward" size={18} color={colors.muted} />
      )}
    </Pressable>
  );
}
