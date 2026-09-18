import { View } from 'react-native';
import { colors } from '../theme';

type Props = { current: number; total: number };

export default function ProgressBar({ current, total }: Props) {
  const pct = total > 0 ? (current / total) * 100 : 0;
  return (
    <View
      style={{ height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' }}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: total, now: current }}
    >
      <View style={{ height: '100%', width: `${pct}%`, backgroundColor: colors.teal, borderRadius: 3 }} />
    </View>
  );
}
