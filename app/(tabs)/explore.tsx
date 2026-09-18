import { useState, useMemo } from 'react';
import { FlatList, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import { Feather, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { colors, spacing, radius, shadow } from '../../src/theme';
import { CAREERS, QUALIFICATIONS, PROVIDERS } from '../../src/data/seed';
import CareerCard from '../../src/components/CareerCard';
import QualCard from '../../src/components/QualCard';
import ProviderCard from '../../src/components/ProviderCard';

type Tab = 'careers' | 'qualifications' | 'providers';
type SortCareer = 'default' | 'outlook';
type SortQual = 'default' | 'nqf_asc' | 'nqf_desc';

const CAREER_FIELDS = ['Health','Technology','Business','Education','Engineering','Arts','Law','Social Sciences','Agriculture'];
const OUTLOOK_OPTIONS = ['High demand','Growing','Stable','Competitive'];
const NQF_LEVELS = ['3','4','5','6','7','8'];
const QUAL_FIELDS = ['Health','Technology','Business','Education','Engineering','Arts','Law','Social Sciences','Agriculture'];
const PROVINCES = ['Gauteng','Western Cape','KwaZulu-Natal','Limpopo','Eastern Cape'];
const PROVIDER_TYPES = ['University','University of Technology','TVET College','Distance Learning'];

const TAB_META: { key: Tab; label: string; Icon: any; iconName: string; color: string; glow: string }[] = [
  { key: 'careers',        label: 'Careers',       Icon: FontAwesome5,           iconName: 'briefcase',       color: colors.blue,   glow: colors.blueGlow },
  { key: 'qualifications', label: 'Qualifications', Icon: MaterialCommunityIcons, iconName: 'certificate',     color: colors.teal,   glow: colors.tealGlow },
  { key: 'providers',      label: 'Providers',      Icon: MaterialCommunityIcons, iconName: 'office-building', color: colors.purple, glow: colors.purpleGlow },
];

// ── Filter chip ───────────────────────────────────────────────────────────────
function Chip({ label, active, onPress, color }: { label: string; active: boolean; onPress: () => void; color?: string }) {
  const accent = color ?? colors.navy;
  return (
    <Pressable
      onPress={onPress}
      style={{
        borderRadius: radius.full, paddingHorizontal: 14, paddingVertical: 7,
        backgroundColor: active ? accent : colors.bgCard,
        borderWidth: 1.5, borderColor: active ? accent : colors.border,
        marginRight: 8, marginBottom: 8,
      }}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text style={{ color: active ? colors.white : colors.ink, fontWeight: '700', fontSize: 13 }}>{label}</Text>
    </Pressable>
  );
}

function FilterSection({ title, options, selected, onToggle, color }: {
  title: string; options: string[]; selected: string[]; onToggle: (v: string) => void; color?: string;
}) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={{ color: colors.muted, fontSize: 10, fontWeight: '800', marginBottom: 8, letterSpacing: 1.2 }}>{title.toUpperCase()}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {options.map((opt) => <Chip key={opt} label={opt} active={selected.includes(opt)} onPress={() => onToggle(opt)} color={color} />)}
      </View>
    </View>
  );
}

// ── Inline search bar ─────────────────────────────────────────────────────────
function InlineSearch({ value, onChangeText, placeholder }: { value: string; onChangeText: (t: string) => void; placeholder: string }) {
  return (
    <View style={{
      flex: 1, flexDirection: 'row', alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.12)',
      borderRadius: radius.md, paddingHorizontal: 12, height: 46,
      borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)',
    }}>
      <Feather name="search" size={16} color="rgba(255,255,255,0.5)" style={{ marginRight: 8 }} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.4)"
        style={{ flex: 1, color: colors.white, fontSize: 14 }}
        returnKeyType="search"
        accessibilityLabel={placeholder}
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')} hitSlop={8}>
          <Feather name="x" size={15} color="rgba(255,255,255,0.5)" />
        </Pressable>
      )}
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function Explore() {
  const [tab, setTab] = useState<Tab>('careers');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [fieldFilters, setFieldFilters] = useState<string[]>([]);
  const [outlookFilters, setOutlookFilters] = useState<string[]>([]);
  const [careerSort, setCareerSort] = useState<SortCareer>('default');
  const [nqfFilters, setNqfFilters] = useState<string[]>([]);
  const [qualFieldFilters, setQualFieldFilters] = useState<string[]>([]);
  const [qualSort, setQualSort] = useState<SortQual>('default');
  const [provinceFilters, setProvinceFilters] = useState<string[]>([]);
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  const [distanceOnly, setDistanceOnly] = useState(false);

  function toggle(arr: string[], setArr: (v: string[]) => void, val: string) {
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  }
  function switchTab(t: Tab) {
    setTab(t); setSearch(''); setShowFilters(false);
    setFieldFilters([]); setOutlookFilters([]); setCareerSort('default');
    setNqfFilters([]); setQualFieldFilters([]); setQualSort('default');
    setProvinceFilters([]); setTypeFilters([]); setDistanceOnly(false);
  }

  const q = search.toLowerCase();
  const activeMeta = TAB_META.find((t) => t.key === tab)!;

  const filteredCareers = useMemo(() => {
    let list = CAREERS.filter((c) =>
      (!q || c.title.toLowerCase().includes(q) || c.field.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)) &&
      (!fieldFilters.length || fieldFilters.includes(c.field)) &&
      (!outlookFilters.length || outlookFilters.includes(c.outlook))
    );
    if (careerSort === 'outlook') {
      const order = ['High demand','Growing','Stable','Competitive'];
      list = [...list].sort((a, b) => order.indexOf(a.outlook) - order.indexOf(b.outlook));
    }
    return list;
  }, [q, fieldFilters, outlookFilters, careerSort]);

  const filteredQuals = useMemo(() => {
    let list = QUALIFICATIONS.filter((q2) =>
      (!q || q2.title.toLowerCase().includes(q) || q2.provider_name.toLowerCase().includes(q) || q2.field.toLowerCase().includes(q)) &&
      (!nqfFilters.length || nqfFilters.includes(q2.nqf_level)) &&
      (!qualFieldFilters.length || qualFieldFilters.includes(q2.field))
    );
    if (qualSort === 'nqf_asc') list = [...list].sort((a, b) => Number(a.nqf_level) - Number(b.nqf_level));
    if (qualSort === 'nqf_desc') list = [...list].sort((a, b) => Number(b.nqf_level) - Number(a.nqf_level));
    return list;
  }, [q, nqfFilters, qualFieldFilters, qualSort]);

  const filteredProviders = useMemo(() => PROVIDERS.filter((p) =>
    (!q || p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || p.province.toLowerCase().includes(q)) &&
    (!provinceFilters.length || provinceFilters.includes(p.province)) &&
    (!typeFilters.length || typeFilters.includes(p.provider_type)) &&
    (!distanceOnly || p.distance_learning)
  ), [q, provinceFilters, typeFilters, distanceOnly]);

  const activeFilterCount =
    tab === 'careers' ? fieldFilters.length + outlookFilters.length :
    tab === 'qualifications' ? nqfFilters.length + qualFieldFilters.length :
    provinceFilters.length + typeFilters.length + (distanceOnly ? 1 : 0);

  const resultCount = tab === 'careers' ? filteredCareers.length : tab === 'qualifications' ? filteredQuals.length : filteredProviders.length;
  const totalCount  = tab === 'careers' ? CAREERS.length : tab === 'qualifications' ? QUALIFICATIONS.length : PROVIDERS.length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>

      {/* ── HEADER ── */}
      <View style={{
        backgroundColor: colors.navy,
        paddingHorizontal: spacing.md,
        paddingTop: spacing.md,
        paddingBottom: spacing.lg + 4,
        borderBottomLeftRadius: radius.xl,
        borderBottomRightRadius: radius.xl,
        overflow: 'hidden',
      }}>
        {/* Ambient glow — shifts with active tab */}
        <View style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: activeMeta.glow }} />
        <View style={{ position: 'absolute', bottom: -40, left: -40, width: 140, height: 140, borderRadius: 70, backgroundColor: activeMeta.glow }} />

        {/* Title row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <View style={{
            width: 40, height: 40, borderRadius: radius.md,
            backgroundColor: activeMeta.color,
            alignItems: 'center', justifyContent: 'center',
            shadowColor: activeMeta.color, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 6,
          }}>
            <activeMeta.Icon name={activeMeta.iconName} size={18} color={colors.white} />
          </View>
          <View>
            <Text style={{ color: colors.white, fontSize: 24, fontWeight: '800', lineHeight: 28 }}>Explore</Text>
            <Text style={{ color: colors.mutedLight, fontSize: 12, marginTop: 1 }}>
              {totalCount} {tab} in the directory
            </Text>
          </View>
        </View>

        {/* ── Tab switcher ── */}
        <View style={{ flexDirection: 'row', gap: 6, marginTop: spacing.sm, marginBottom: spacing.sm }}>
          {TAB_META.map((t) => {
            const isActive = tab === t.key;
            return (
              <Pressable
                key={t.key}
                onPress={() => switchTab(t.key)}
                style={{
                  flex: 1, paddingVertical: 10, borderRadius: radius.md,
                  alignItems: 'center', justifyContent: 'center', gap: 4,
                  backgroundColor: isActive ? t.color : 'rgba(255,255,255,0.08)',
                  borderWidth: 1,
                  borderColor: isActive ? t.color : 'rgba(255,255,255,0.1)',
                  ...(isActive ? { shadowColor: t.color, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.45, shadowRadius: 10, elevation: 6 } : {}),
                }}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
              >
                <t.Icon name={t.iconName} size={16} color={isActive ? colors.white : 'rgba(255,255,255,0.45)'} />
                <Text style={{ color: isActive ? colors.white : 'rgba(255,255,255,0.45)', fontWeight: '800', fontSize: 10, letterSpacing: 0.3 }}>
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* ── Search + filter row ── */}
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 10 }}>
          <InlineSearch value={search} onChangeText={setSearch} placeholder={`Search ${tab}…`} />
          <Pressable
            onPress={() => setShowFilters((v) => !v)}
            style={{
              width: 46, height: 46, borderRadius: radius.md,
              backgroundColor: activeFilterCount > 0 ? colors.yellow : 'rgba(255,255,255,0.12)',
              alignItems: 'center', justifyContent: 'center',
              borderWidth: 1, borderColor: activeFilterCount > 0 ? colors.yellow : 'rgba(255,255,255,0.15)',
              ...(activeFilterCount > 0 ? shadow.gold : {}),
            }}
            accessibilityRole="button"
            accessibilityLabel="Toggle filters"
          >
            <Feather name="sliders" size={18} color={activeFilterCount > 0 ? colors.navy : colors.white} />
            {activeFilterCount > 0 && (
              <View style={{ position: 'absolute', top: 5, right: 5, width: 16, height: 16, borderRadius: 8, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: colors.white, fontSize: 9, fontWeight: '800' }}>{activeFilterCount}</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* ── Result count + sort pills ── */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Feather name="layers" size={12} color="rgba(255,255,255,0.35)" />
            <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>
              {resultCount === totalCount ? `${totalCount} results` : `${resultCount} of ${totalCount}`}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {tab === 'careers' && (['default','outlook'] as SortCareer[]).map((s) => (
              <Pressable key={s} onPress={() => setCareerSort(s)}
                style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full, backgroundColor: careerSort === s ? colors.yellow : 'rgba(255,255,255,0.1)', flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                {s === 'outlook' && <Feather name="trending-up" size={10} color={careerSort === s ? colors.navy : 'rgba(255,255,255,0.6)'} />}
                <Text style={{ color: careerSort === s ? colors.navy : 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '700' }}>{s === 'default' ? 'Default' : 'By demand'}</Text>
              </Pressable>
            ))}
            {tab === 'qualifications' && (['default','nqf_asc','nqf_desc'] as SortQual[]).map((s) => (
              <Pressable key={s} onPress={() => setQualSort(s)}
                style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full, backgroundColor: qualSort === s ? colors.yellow : 'rgba(255,255,255,0.1)', flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                {s !== 'default' && <Feather name={s === 'nqf_asc' ? 'arrow-up' : 'arrow-down'} size={10} color={qualSort === s ? colors.navy : 'rgba(255,255,255,0.6)'} />}
                <Text style={{ color: qualSort === s ? colors.navy : 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '700' }}>{s === 'default' ? 'Default' : s === 'nqf_asc' ? 'NQF Low→High' : 'NQF High→Low'}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* ── FILTER PANEL ── */}
      {showFilters && (
        <View style={{ backgroundColor: colors.bgCard, marginHorizontal: spacing.md, marginTop: spacing.sm, borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.borderLight, ...shadow.md }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Feather name="filter" size={14} color={colors.navy} />
              <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 14 }}>Filter {tab}</Text>
            </View>
            {activeFilterCount > 0 && (
              <Pressable
                onPress={() => { setFieldFilters([]); setOutlookFilters([]); setNqfFilters([]); setQualFieldFilters([]); setProvinceFilters([]); setTypeFilters([]); setDistanceOnly(false); }}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
              >
                <Feather name="x-circle" size={14} color={colors.danger} />
                <Text style={{ color: colors.danger, fontWeight: '700', fontSize: 13 }}>Clear all</Text>
              </Pressable>
            )}
          </View>

          {tab === 'careers' && (
            <>
              <FilterSection title="Field" options={CAREER_FIELDS} selected={fieldFilters} onToggle={(v) => toggle(fieldFilters, setFieldFilters, v)} color={colors.blue} />
              <FilterSection title="Outlook" options={OUTLOOK_OPTIONS} selected={outlookFilters} onToggle={(v) => toggle(outlookFilters, setOutlookFilters, v)} color={colors.teal} />
            </>
          )}
          {tab === 'qualifications' && (
            <>
              <FilterSection title="NQF Level" options={NQF_LEVELS} selected={nqfFilters} onToggle={(v) => toggle(nqfFilters, setNqfFilters, v)} color={colors.teal} />
              <FilterSection title="Field" options={QUAL_FIELDS} selected={qualFieldFilters} onToggle={(v) => toggle(qualFieldFilters, setQualFieldFilters, v)} color={colors.blue} />
            </>
          )}
          {tab === 'providers' && (
            <>
              <FilterSection title="Province" options={PROVINCES} selected={provinceFilters} onToggle={(v) => toggle(provinceFilters, setProvinceFilters, v)} color={colors.purple} />
              <FilterSection title="Type" options={PROVIDER_TYPES} selected={typeFilters} onToggle={(v) => toggle(typeFilters, setTypeFilters, v)} color={colors.blue} />
              <Chip label="Distance learning only" active={distanceOnly} onPress={() => setDistanceOnly((v) => !v)} color={colors.teal} />
            </>
          )}
        </View>
      )}

      {/* ── LISTS ── */}
      {tab === 'careers' && (
        <FlatList
          data={filteredCareers}
          keyExtractor={(c) => c.id}
          renderItem={({ item }) => <CareerCard career={item} />}
          contentContainerStyle={{ paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: 100 }}
          ListEmptyComponent={<EmptyState label="No careers match your search or filters." icon="briefcase" />}
          showsVerticalScrollIndicator={false}
        />
      )}
      {tab === 'qualifications' && (
        <FlatList
          data={filteredQuals}
          keyExtractor={(q) => q.id}
          renderItem={({ item }) => <QualCard qual={item} />}
          contentContainerStyle={{ paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: 100 }}
          ListEmptyComponent={<EmptyState label="No qualifications match your search or filters." icon="award" />}
          showsVerticalScrollIndicator={false}
        />
      )}
      {tab === 'providers' && (
        <FlatList
          data={filteredProviders}
          keyExtractor={(p) => p.id}
          renderItem={({ item }) => <ProviderCard provider={item} />}
          contentContainerStyle={{ paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: 100 }}
          ListEmptyComponent={<EmptyState label="No providers match your search or filters." icon="map-pin" />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

function EmptyState({ label, icon }: { label: string; icon: string }) {
  return (
    <View style={{ alignItems: 'center', marginTop: 70, paddingHorizontal: 40 }}>
      <View style={{ width: 80, height: 80, borderRadius: radius.full, backgroundColor: colors.border + '44', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <Feather name={icon as any} size={36} color={colors.muted} />
      </View>
      <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 16, textAlign: 'center', marginBottom: 6 }}>Nothing found</Text>
      <Text style={{ color: colors.muted, textAlign: 'center', fontSize: 14, lineHeight: 21 }}>{label}</Text>
    </View>
  );
}
