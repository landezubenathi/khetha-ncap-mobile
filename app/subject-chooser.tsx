import { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { Link, Stack } from 'expo-router';
import { colors, spacing } from '../src/theme';
import { CAREER_SUBJECT_PROFILES, ALL_SUBJECTS, matchCareersBySubjects } from '../src/data/subjects';

type Mode = 'career-to-subjects' | 'subjects-to-careers';

const REQ_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  required:    { bg: '#0E938422', text: colors.teal,   label: 'Required' },
  recommended: { bg: '#1677FF18', text: colors.blue,   label: 'Recommended' },
  advantage:   { bg: '#F4B74033', text: '#92600A',     label: 'Advantage' },
};

const FIELD_COLORS: Record<string, string> = {
  Health: colors.teal, Technology: colors.blue, Business: '#7B61FF',
  Education: '#F4A740', Engineering: '#E05C2A', Arts: '#D64545',
  Law: '#0E7490', 'Social Sciences': '#059669', Agriculture: '#65A30D',
};

export default function SubjectChooser() {
  const [mode, setMode] = useState<Mode>('career-to-subjects');

  // Mode 1: Career → Subjects
  const [selectedCareerId, setSelectedCareerId] = useState<string | null>(null);

  // Mode 2: Subjects → Careers
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const selectedProfile = CAREER_SUBJECT_PROFILES.find((p) => p.careerId === selectedCareerId);

  function toggleSubject(subject: string) {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  }

  const subjectResults = mode === 'subjects-to-careers' && selectedSubjects.length > 0
    ? matchCareersBySubjects(selectedSubjects)
    : [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack.Screen options={{ title: 'Subject Chooser' }} />
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 48 }}>

        {/* Header */}
        <Text style={{ color: colors.navy, fontSize: 26, fontWeight: '800', lineHeight: 34 }}>
          Subject Chooser
        </Text>
        <Text style={{ color: colors.muted, fontSize: 14, marginTop: 6, lineHeight: 22 }}>
          Find out which subjects you need for your career — or see which careers your subjects unlock.
        </Text>

        {/* Mode toggle */}
        <View style={{ flexDirection: 'row', backgroundColor: colors.white, borderRadius: 12, padding: 4, marginTop: 20, marginBottom: 24 }}>
          {(['career-to-subjects', 'subjects-to-careers'] as Mode[]).map((m) => {
            const active = mode === m;
            const label = m === 'career-to-subjects' ? 'Career → Subjects' : 'Subjects → Careers';
            return (
              <Pressable
                key={m}
                onPress={() => { setMode(m); setSelectedCareerId(null); setSelectedSubjects([]); }}
                style={{
                  flex: 1, paddingVertical: 10, borderRadius: 10,
                  backgroundColor: active ? colors.navy : 'transparent',
                  alignItems: 'center',
                }}
                accessibilityRole="button"
                accessibilityLabel={label}
              >
                <Text style={{ color: active ? colors.white : colors.muted, fontWeight: '700', fontSize: 13 }}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* ── MODE 1: Career → Subjects ── */}
        {mode === 'career-to-subjects' && (
          <>
            <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 16, marginBottom: 12 }}>
              Pick a career you are interested in:
            </Text>

            {CAREER_SUBJECT_PROFILES.map((profile) => {
              const isSelected = selectedCareerId === profile.careerId;
              const fieldColor = FIELD_COLORS[profile.field] ?? colors.muted;
              return (
                <Pressable
                  key={profile.careerId}
                  onPress={() => setSelectedCareerId(isSelected ? null : profile.careerId)}
                  style={{
                    backgroundColor: isSelected ? colors.navy : colors.white,
                    borderRadius: 14, padding: spacing.md, marginBottom: 10,
                    borderLeftWidth: 4, borderLeftColor: fieldColor,
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={profile.careerTitle}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ color: isSelected ? colors.white : colors.navy, fontWeight: '800', fontSize: 16 }}>
                      {profile.careerTitle}
                    </Text>
                    <View style={{ backgroundColor: fieldColor + '33', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 }}>
                      <Text style={{ color: fieldColor, fontSize: 11, fontWeight: '700' }}>{profile.field}</Text>
                    </View>
                  </View>
                  {isSelected && (
                    <Text style={{ color: colors.white + 'BB', fontSize: 12, marginTop: 4 }}>
                      APS min: {profile.apsMin} · {profile.mathsRequired} required
                    </Text>
                  )}
                </Pressable>
              );
            })}

            {/* Subject breakdown for selected career */}
            {selectedProfile && (
              <View style={{ marginTop: 8 }}>
                {/* Pathway banner */}
                <View style={{ backgroundColor: colors.navy + '0D', borderRadius: 14, padding: spacing.md, marginBottom: 16 }}>
                  <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 15, marginBottom: 6 }}>
                    📍 Study Pathway
                  </Text>
                  <Text style={{ color: colors.ink, fontSize: 13, lineHeight: 20 }}>{selectedProfile.pathway}</Text>
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                    <View style={{ backgroundColor: colors.teal + '22', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
                      <Text style={{ color: colors.teal, fontSize: 12, fontWeight: '700' }}>
                        Maths: {selectedProfile.mathsRequired}
                      </Text>
                    </View>
                    <View style={{ backgroundColor: colors.blue + '18', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
                      <Text style={{ color: colors.blue, fontSize: 12, fontWeight: '700' }}>
                        Min APS: {selectedProfile.apsMin}
                      </Text>
                    </View>
                    <View style={{ backgroundColor: colors.yellow + '33', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
                      <Text style={{ color: '#92600A', fontSize: 12, fontWeight: '700' }}>
                        {selectedProfile.minMatric}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Subject list */}
                <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 15, marginBottom: 10 }}>
                  Subjects for {selectedProfile.careerTitle}
                </Text>

                {/* Legend */}
                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                  {Object.entries(REQ_COLORS).map(([key, val]) => (
                    <View key={key} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: val.text }} />
                      <Text style={{ color: colors.muted, fontSize: 12 }}>{val.label}</Text>
                    </View>
                  ))}
                </View>

                {selectedProfile.subjects.map((s) => {
                  const style = REQ_COLORS[s.requirement];
                  return (
                    <View
                      key={s.subject}
                      style={{
                        backgroundColor: style.bg,
                        borderRadius: 12, padding: spacing.sm,
                        marginBottom: 8, flexDirection: 'row',
                        alignItems: 'flex-start', gap: 10,
                      }}
                    >
                      <View style={{ backgroundColor: style.text, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2, marginTop: 2 }}>
                        <Text style={{ color: colors.white, fontSize: 10, fontWeight: '800' }}>{style.label.toUpperCase()}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: colors.navy, fontWeight: '700', fontSize: 14 }}>{s.subject}</Text>
                        {s.note && (
                          <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>{s.note}</Text>
                        )}
                      </View>
                    </View>
                  );
                })}

                {/* CTA to career detail */}
                <Link href={`/career/${selectedProfile.careerId}`} asChild>
                  <Pressable
                    style={{ backgroundColor: colors.navy, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 12, minHeight: 52, justifyContent: 'center' }}
                    accessibilityRole="button"
                    accessibilityLabel={`Explore ${selectedProfile.careerTitle}`}
                  >
                    <Text style={{ color: colors.white, fontWeight: '800', fontSize: 15 }}>
                      Explore {selectedProfile.careerTitle} →
                    </Text>
                  </Pressable>
                </Link>
              </View>
            )}
          </>
        )}

        {/* ── MODE 2: Subjects → Careers ── */}
        {mode === 'subjects-to-careers' && (
          <>
            <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 16, marginBottom: 4 }}>
              Select the subjects you are taking:
            </Text>
            <Text style={{ color: colors.muted, fontSize: 13, marginBottom: 14 }}>
              {selectedSubjects.length} selected
            </Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {ALL_SUBJECTS.map((subject) => {
                const isSelected = selectedSubjects.includes(subject);
                return (
                  <Pressable
                    key={subject}
                    onPress={() => toggleSubject(subject)}
                    style={{
                      backgroundColor: isSelected ? colors.navy : colors.white,
                      borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
                      borderWidth: 1.5, borderColor: isSelected ? colors.navy : colors.border,
                    }}
                    accessibilityRole="checkbox"
                    accessibilityLabel={subject}
                    accessibilityState={{ checked: isSelected }}
                  >
                    <Text style={{ color: isSelected ? colors.white : colors.ink, fontWeight: '700', fontSize: 13 }}>
                      {subject}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Results */}
            {subjectResults.length > 0 && (
              <>
                <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 16, marginBottom: 12 }}>
                  Careers your subjects unlock:
                </Text>
                {subjectResults.map(({ profile, matchScore, missingRequired }) => {
                  const fieldColor = FIELD_COLORS[profile.field] ?? colors.muted;
                  const isFullMatch = missingRequired.length === 0;
                  return (
                    <Link key={profile.careerId} href={`/career/${profile.careerId}`} asChild>
                      <Pressable
                        style={{
                          backgroundColor: colors.white, borderRadius: 14,
                          padding: spacing.md, marginBottom: 12,
                          borderLeftWidth: 4,
                          borderLeftColor: isFullMatch ? colors.teal : colors.border,
                          opacity: matchScore < 20 ? 0.6 : 1,
                        }}
                        accessibilityRole="button"
                        accessibilityLabel={`${profile.careerTitle}, ${matchScore}% match`}
                      >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 16, flex: 1 }}>
                            {profile.careerTitle}
                          </Text>
                          <View style={{
                            backgroundColor: isFullMatch ? colors.teal + '22' : colors.border,
                            borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginLeft: 8,
                          }}>
                            <Text style={{ color: isFullMatch ? colors.teal : colors.muted, fontSize: 12, fontWeight: '800' }}>
                              {matchScore}% match
                            </Text>
                          </View>
                        </View>

                        {/* Missing required subjects warning */}
                        {missingRequired.length > 0 && (
                          <View style={{ backgroundColor: '#FEF3C7', borderRadius: 8, padding: 8, marginTop: 8 }}>
                            <Text style={{ color: '#92600A', fontSize: 12, fontWeight: '700' }}>
                              ⚠ Still needed: {missingRequired.join(', ')}
                            </Text>
                          </View>
                        )}

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                          <View style={{ backgroundColor: fieldColor + '22', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 }}>
                            <Text style={{ color: fieldColor, fontSize: 11, fontWeight: '700' }}>{profile.field}</Text>
                          </View>
                          <Text style={{ color: colors.blue, fontSize: 13, fontWeight: '700' }}>View pathway →</Text>
                        </View>
                      </Pressable>
                    </Link>
                  );
                })}
              </>
            )}

            {selectedSubjects.length === 0 && (
              <View style={{ backgroundColor: colors.white, borderRadius: 14, padding: spacing.lg, alignItems: 'center' }}>
                <Text style={{ color: colors.muted, fontSize: 14, textAlign: 'center', lineHeight: 22 }}>
                  Select at least one subject above to see which careers are available to you.
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
