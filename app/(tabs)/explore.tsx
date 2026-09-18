import { useState, useMemo } from 'react';
import { FlatList, Pressable, SafeAreaView, Text, View } from 'react-native';
import { colors, spacing } from '../../src/theme';
import { CAREERS, QUALIFICATIONS, PROVIDERS } from '../../src/data/seed';
import CareerCard from '../../src/components/CareerCard';
import QualCard from '../../src/components/QualCard';
import ProviderCard from '../../src/components/ProviderCard';
import SearchBar from '../../src/components/SearchBar';

type Tab = 'careers' | 'qualifications' | 'providers';
type SortCareer = 'default' | 'salary' | 'outlook';
type SortQual = 'default' | 'nqf_asc' | 'nqf_desc';

const CAREER_FIELDS = ['Health', 'Technology', 'Business', 'Education', 'Engineering', 'Arts', 'Law', 'Social Sciences', 'Agriculture'];
const OUTLOOK_OPTIONS = ['High demand', 'Growing', 'Stable', 'Competitive'];
const NQF_LEVELS = ['3', '4', '5', '6', '7', '8'];
const QUAL_FIELDS = ['Health', 'Technology', 'Business', 'Education', 'Engineering', 'Arts', 'Law', 'Social Sciences', 'Agriculture'];
const PROVINCES = ['Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Limpopo', 'Eastern Cape'];
const PROVIDER_TYPES = ['University', 'University of Technology', 'TVET College', 'Distance Learning'];

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7,
        backgroundColor: active ? colors.navy : colors.white,
        borderWidth: 1.5, borderColor: active ? colors.navy : colors.border,
        marginRight: 8, marginBottom: 8,
      }}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={`Filter: ${label}`}
    >
      <Text style={{ color: active ? colors.white : colors.ink, fontWeight: '700', fontSize: 13 }}>{label}</Text>
    </Pressable>
  );
}

function FilterSection({ title, options, selected, onToggle }: {
  title: string; options: string[]; selected: string[]; onToggle: (v: string) => void;
}) {
  return (
    <View style={{ marginBottom: 4 }}>
      <Text style={{ color: colors.muted, fontSize: 12, fontWeight: '700', marginBottom: 6, letterSpacing: 0.5 }}>
        {title.toUpperCase()}
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {options.map((opt) => (
          <Chip key={opt} label={opt} active={selected.includes(opt)} onPress={() => onToggle(opt)} />
        ))}
      </View>
    </View>
  );
}

export default function Explore() {
  const [tab, setTab] = useState<Tab>('careers');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Career filters
  const [fieldFilters, setFieldFilters] = useState<string[]>([]);
  const [outlookFilters, setOutlookFilters] = useState<string[]>([]);
  const [careerSort, setCareerSort] = useState<SortCareer>('default');

  // Qualification filters
  const [nqfFilters, setNqfFilters] = useState<string[]>([]);
  const [qualFieldFilters, setQualFieldFilters] = useState<string[]>([]);
  const [qualSort, setQualSort] = useState<SortQual>('default');

  // Provider filters
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

  const filteredCareers = useMemo(() => {
    let list = CAREERS.filter((c) =>
      (!q || c.title.toLowerCase().includes(q) || c.field.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)) &&
      (!fieldFilters.length || fieldFilters.includes(c.field)) &&
      (!outlookFilters.length || outlookFilters.includes(c.outlook))
    );
    if (careerSort === 'outlook') {
      const order = ['High demand', 'Growing', 'Stable', 'Competitive'];
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

  const resultCount =
    tab === 'careers' ? filteredCareers.length :
    tab === 'qualifications' ? filteredQuals.length :
    filteredProviders.length;

  const totalCount =
    tab === 'careers' ? CAREERS.length :
    tab === 'qualifications' ? QUALIFICATIONS.length :
    PROVIDERS.length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Header */}
      <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: 0 }}>
        <Text style={{ fontSize: 28, fontWeight: '800', color: colors.navy }}>Explore</Text>
        <Text style={{ color: colors.muted, marginTop: 2, marginBottom: 14, fontSize: 14 }}>
          Careers · Qualifications · Providers
        </Text>

        {/* Tab switcher */}
        <View style={{ flexDirection: 'row', backgroundColor: colors.border, borderRadius: 12, padding: 3, marginBottom: spacing.sm }}>
          {(['careers', 'qualifications', 'providers'] as Tab[]).map((t) => (
            <Pressable
              key={t}
              onPress={() => switchTab(t)}
              style={{ flex: 1, paddingVertical: 9, borderRadius: 10, alignItems: 'center', backgroundColor: tab === t ? colors.white : 'transparent' }}
              accessibilityRole="tab"
              accessibilityState={{ selected: tab === t }}
            >
              <Text style={{ color: tab === t ? colors.navy : colors.muted, fontWeight: '700', fontSize: 13, textTransform: 'capitalize' }}>
                {t}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Search + filter toggle row */}
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <SearchBar value={search} onChangeText={setSearch} placeholder={`Search ${tab}…`} />
          </View>
          <Pressable
            onPress={() => setShowFilters((v) => !v)}
            style={{
              height: 48, paddingHorizontal: 14, borderRadius: 12,
              backgroundColor: activeFilterCount > 0 ? colors.navy : colors.white,
              borderWidth: 1, borderColor: activeFilterCount > 0 ? colors.navy : colors.border,
              alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6,
            }}
            accessibilityRole="button"
            accessibilityLabel="Toggle filters"
          >
            <Text style={{ fontSize: 16 }}>⚙</Text>
            {activeFilterCount > 0 && (
              <View style={{ backgroundColor: colors.yellow, borderRadius: 10, width: 18, height: 18, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: colors.navy, fontSize: 11, fontWeight: '800' }}>{activeFilterCount}</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Result count + sort */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ color: colors.muted, fontSize: 13 }}>
            {resultCount === totalCount ? `${totalCount} results` : `${resultCount} of ${totalCount}`}
          </Text>
          {tab === 'careers' && (
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {(['default', 'outlook'] as SortCareer[]).map((s) => (
                <Pressable key={s} onPress={() => setCareerSort(s)}
                  style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, backgroundColor: careerSort === s ? colors.navy : colors.white, borderWidth: 1, borderColor: careerSort === s ? colors.navy : colors.border }}
                  accessibilityRole="button"
                >
                  <Text style={{ color: careerSort === s ? colors.white : colors.muted, fontSize: 12, fontWeight: '700' }}>
                    {s === 'default' ? 'Default' : 'By demand'}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
          {tab === 'qualifications' && (
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {(['default', 'nqf_asc', 'nqf_desc'] as SortQual[]).map((s) => (
                <Pressable key={s} onPress={() => setQualSort(s)}
                  style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, backgroundColor: qualSort === s ? colors.navy : colors.white, borderWidth: 1, borderColor: qualSort === s ? colors.navy : colors.border }}
                  accessibilityRole="button"
                >
                  <Text style={{ color: qualSort === s ? colors.white : colors.muted, fontSize: 12, fontWeight: '700' }}>
                    {s === 'default' ? 'Default' : s === 'nqf_asc' ? 'NQF ↑' : 'NQF ↓'}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Filter panel */}
        {showFilters && (
          <View style={{ backgroundColor: colors.white, borderRadius: 14, padding: spacing.md, marginBottom: 12 }}>
            {tab === 'careers' && (
              <>
                <FilterSection title="Field" options={CAREER_FIELDS} selected={fieldFilters} onToggle={(v) => toggle(fieldFilters, setFieldFilters, v)} />
                <FilterSection title="Outlook" options={OUTLOOK_OPTIONS} selected={outlookFilters} onToggle={(v) => toggle(outlookFilters, setOutlookFilters, v)} />
              </>
            )}
            {tab === 'qualifications' && (
              <>
                <FilterSection title="NQF Level" options={NQF_LEVELS} selected={nqfFilters} onToggle={(v) => toggle(nqfFilters, setNqfFilters, v)} />
                <FilterSection title="Field" options={QUAL_FIELDS} selected={qualFieldFilters} onToggle={(v) => toggle(qualFieldFilters, setQualFieldFilters, v)} />
              </>
            )}
            {tab === 'providers' && (
              <>
                <FilterSection title="Province" options={PROVINCES} selected={provinceFilters} onToggle={(v) => toggle(provinceFilters, setProvinceFilters, v)} />
                <FilterSection title="Type" options={PROVIDER_TYPES} selected={typeFilters} onToggle={(v) => toggle(typeFilters, setTypeFilters, v)} />
                <Chip label="Distance learning only" active={distanceOnly} onPress={() => setDistanceOnly((v) => !v)} />
              </>
            )}
            {activeFilterCount > 0 && (
              <Pressable
                onPress={() => { setFieldFilters([]); setOutlookFilters([]); setNqfFilters([]); setQualFieldFilters([]); setProvinceFilters([]); setTypeFilters([]); setDistanceOnly(false); }}
                style={{ marginTop: 4 }}
                accessibilityRole="button"
              >
                <Text style={{ color: colors.danger, fontWeight: '700', fontSize: 13 }}>✕ Clear all filters</Text>
              </Pressable>
            )}
          </View>
        )}
      </View>

      {/* Lists */}
      {tab === 'careers' && (
        <FlatList
          data={filteredCareers}
          keyExtractor={(c) => c.id}
          renderItem={({ item }) => <CareerCard career={item} />}
          contentContainerStyle={{ paddingHorizontal: spacing.md, paddingTop: 4, paddingBottom: 40 }}
          ListEmptyComponent={<EmptyState label="No careers match your search or filters." />}
        />
      )}
      {tab === 'qualifications' && (
        <FlatList
          data={filteredQuals}
          keyExtractor={(q) => q.id}
          renderItem={({ item }) => <QualCard qual={item} />}
          contentContainerStyle={{ paddingHorizontal: spacing.md, paddingTop: 4, paddingBottom: 40 }}
          ListEmptyComponent={<EmptyState label="No qualifications match your search or filters." />}
        />
      )}
      {tab === 'providers' && (
        <FlatList
          data={filteredProviders}
          keyExtractor={(p) => p.id}
          renderItem={({ item }) => <ProviderCard provider={item} />}
          contentContainerStyle={{ paddingHorizontal: spacing.md, paddingTop: 4, paddingBottom: 40 }}
          ListEmptyComponent={<EmptyState label="No providers match your search or filters." />}
        />
      )}
    </SafeAreaView>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <View style={{ alignItems: 'center', marginTop: 60, paddingHorizontal: 40 }}>
      <Text style={{ fontSize: 40, marginBottom: 12 }}>🔍</Text>
      <Text style={{ color: colors.muted, textAlign: 'center', fontSize: 15, lineHeight: 22 }}>{label}</Text>
    </View>
  );
}
