import { useUserStore } from './store/user';

export type Lang =
  | 'English' | 'isiZulu' | 'Sesotho' | 'Afrikaans'
  | 'isiXhosa' | 'Setswana' | 'Sepedi' | 'Xitsonga'
  | 'siSwati' | 'Tshivenda' | 'isiNdebele';

export const LANGUAGE_LIST: Lang[] = [
  'English', 'isiZulu', 'Sesotho', 'Afrikaans',
  'isiXhosa', 'Setswana', 'Sepedi', 'Xitsonga',
  'siSwati', 'Tshivenda', 'isiNdebele',
];

// Only English + the 3 most-spoken languages are fully translated.
// All others fall back to English gracefully via the useT() hook.
const dict: Record<string, Partial<Record<Lang, string>>> = {
  welcome:           { English: 'Welcome back 👋',                    isiZulu: 'Siyakwamukela 👋',                          Sesotho: 'Re a u amohela 👋',                    Afrikaans: 'Welkom terug 👋',           isiXhosa: 'Wamkelekile 👋' },
  tagline:           { English: 'Your future starts with a choice.',  isiZulu: 'Ikusasa lakho liqala ngokukhetha.',          Sesotho: 'Bokamoso ba hao bo qala ka kgetho.',   Afrikaans: 'Jou toekoms begin met \'n keuse.', isiXhosa: 'Ikamva lakho liqala ngokukhetha.' },
  start:             { English: 'Start my journey',                   isiZulu: 'Qala uhambo lwami',                          Sesotho: 'Qala leeto la ka',                     Afrikaans: 'Begin my reis',             isiXhosa: 'Qala uhambo lwam' },
  next:              { English: 'Next',                               isiZulu: 'Okulandelayo',                               Sesotho: 'E latelang',                           Afrikaans: 'Volgende',                  isiXhosa: 'Okulandelayo' },
  save:              { English: 'Save for later',                     isiZulu: 'Gcina kamuva',                               Sesotho: 'Boloka hamorao',                       Afrikaans: 'Stoor vir later',           isiXhosa: 'Gcina kamva' },
  saved:             { English: 'Saved ✓',                            isiZulu: 'Kugcinwe ✓',                                Sesotho: 'Ho bolokilwe ✓',                       Afrikaans: 'Gestoor ✓',                 isiXhosa: 'Kugcinwe ✓' },
  take_quiz:         { English: 'Take the quiz →',                    isiZulu: 'Thatha ikhwizi →',                           Sesotho: 'Nka khetho →',                         Afrikaans: 'Neem die toets →',          isiXhosa: 'Thatha ikhwizi →' },
  my_journey:        { English: 'My journey',                         isiZulu: 'Uhambo lwami',                               Sesotho: 'Leeto la ka',                          Afrikaans: 'My reis',                   isiXhosa: 'Uhambo lwam' },
  explore:           { English: 'Explore',                            isiZulu: 'Hlola',                                      Sesotho: 'Hlahloba',                             Afrikaans: 'Verken',                    isiXhosa: 'Hlola' },
  profile:           { English: 'Profile',                            isiZulu: 'Iphrofayili',                                Sesotho: 'Profaele',                             Afrikaans: 'Profiel',                   isiXhosa: 'Iprofayile' },
  careers:           { English: 'Careers',                            isiZulu: 'Imisebenzi',                                 Sesotho: 'Mesebetsi',                            Afrikaans: 'Loopbane',                  isiXhosa: 'Imisebenzi' },
  qualifications:    { English: 'Qualifications',                     isiZulu: 'Iziqinisekiso',                              Sesotho: 'Mangolo',                              Afrikaans: 'Kwalifikasies',             isiXhosa: 'Iziqinisekiso' },
  providers:         { English: 'Providers',                          isiZulu: 'Abahlinzeki',                                Sesotho: 'Banikeli',                             Afrikaans: 'Verskaffers',               isiXhosa: 'Abanikezeli' },
  contact_adviser:   { English: 'Contact an adviser',                 isiZulu: 'Xhumana nommeluleki',                        Sesotho: 'Ikopanya le moeletsi',                 Afrikaans: 'Kontak \'n adviseur',       isiXhosa: 'Qhagamshelana nomcebisi' },
  language_prompt:   { English: 'Choose your language',               isiZulu: 'Khetha ulimi lwakho',                        Sesotho: 'Khetha puo ya hao',                    Afrikaans: 'Kies jou taal',             isiXhosa: 'Khetha ulwimi lwakho' },
  consent_body:      {
    English:   'Khetha stores your quiz answers and saved items to personalise your career journey. Your data is private, never sold, and you can delete it at any time.',
    isiZulu:   'UKhetha ugcina izimpendulo zakho zombuzo nezinto ezigciniwe ukuze wenze uhambo lwakho lomsebenzi lube ngolwakho. Idatha yakho iyimfihlo, ayikaze ithengiswe, futhi ungayisusa nganoma yisiphi isikhathi.',
    Sesotho:   'Khetha e boloka dikarabo tsa hao tsa lipotso le dintho tse bolokilweng ho etsa leeto la hao la mosebetsi le le ikgethileng. Data ya hao ke ya sephiri, ha e rekiswe le hang, mme o ka e hlakola neng kapa neng.',
    Afrikaans: 'Khetha stoor jou toetsantwoorde en gestoorde items om jou loopbaanreis te personaliseer. Jou data is privaat, word nooit verkoop nie, en jy kan dit enige tyd uitvee.',
    isiXhosa:  'UKhetha ugcina iimpendulo zakho zekhwizi nezinto ezigciniwe ukwenza uhambo lwakho lomsebenzi lube lwakho. Idatha yakho iyimfihlo, ayikaze ithengiswe, kwaye ungazicima nangaliphi na ixesha.',
  },
  consent_agree:     { English: 'I agree — continue',                 isiZulu: 'Ngiyavuma — qhubeka',                        Sesotho: 'Ke a dumela — tswela pele',            Afrikaans: 'Ek stem saam — gaan voort', isiXhosa: 'Ndiyavuma — qhubeka' },
  no_results:        { English: 'No results found.',                  isiZulu: 'Awekho amatholakalo.',                       Sesotho: 'Ha ho na diphetho tse fumanweng.',      Afrikaans: 'Geen resultate gevind nie.', isiXhosa: 'Akukho ziphumo zifunyenweyo.' },
  loading:           { English: 'Loading…',                           isiZulu: 'Iyalayisha…',                                Sesotho: 'E a laela…',                           Afrikaans: 'Laai tans…',                isiXhosa: 'Iyalayisha…' },
  top_matches:       { English: 'Your top career matches',            isiZulu: 'Imisebenzi yakho ephezulu',                  Sesotho: 'Mesebetsi ya hao e phahameng',         Afrikaans: 'Jou beste loopbaanpasmaats', isiXhosa: 'Imisebenzi yakho ephezulu' },
  save_all:          { English: 'Save all to Journey',                isiZulu: 'Gcina konke ku-Journey',                     Sesotho: 'Boloka tsohle ho Leeto',               Afrikaans: 'Stoor alles na Reis',       isiXhosa: 'Gcina konke ku-Journey' },
  retake:            { English: 'Retake quiz',                        isiZulu: 'Phinda ikhwizi',                             Sesotho: 'Nka khetho hape',                      Afrikaans: 'Herhaal toets',             isiXhosa: 'Phinda ikhwizi' },
  sign_in:           { English: 'Sign in',                            isiZulu: 'Ngena',                                      Sesotho: 'Kena',                                 Afrikaans: 'Teken in',                  isiXhosa: 'Ngena' },
  sign_out:          { English: 'Sign out',                           isiZulu: 'Phuma',                                      Sesotho: 'Tswa',                                 Afrikaans: 'Teken uit',                 isiXhosa: 'Phuma' },
  guest_continue:    { English: 'Continue without account',           isiZulu: 'Qhubeka ngaphandle kwe-akhawunti',           Sesotho: 'Tswela pele ntle le akhaonto',         Afrikaans: 'Gaan voort sonder rekening', isiXhosa: 'Qhubeka ngaphandle kwe-akhawunti' },
  otp_prompt:        { English: 'Enter the 6-digit code sent to your email.', isiZulu: 'Faka ikhodi enemibalo engu-6 ethunywe ku-imeyili yakho.', Sesotho: 'Kenya khoutu ya dinomoro tse 6 e romeletsweng ho imeile ya hao.', Afrikaans: 'Voer die 6-syfer kode in wat na jou e-pos gestuur is.' },
  email_placeholder: { English: 'your@email.com',                     isiZulu: 'i-imeyili@yakho.com',                        Sesotho: 'imeile@ya-hao.com',                    Afrikaans: 'jou@epos.com' },
  send_code:         { English: 'Send code',                          isiZulu: 'Thumela ikhodi',                             Sesotho: 'Romela khoutu',                         Afrikaans: 'Stuur kode' },
  verify:            { English: 'Verify',                             isiZulu: 'Qinisekisa',                                 Sesotho: 'Netefatsa',                            Afrikaans: 'Verifieer' },
  home:              { English: 'Home',                               isiZulu: 'Ikhaya',                                     Sesotho: 'Hae',                                  Afrikaans: 'Tuis',                      isiXhosa: 'Ekhaya' },
  saved_tab:         { English: 'Saved',                              isiZulu: 'Okugciniwe',                                 Sesotho: 'Ho bolokilwe',                         Afrikaans: 'Gestoor',                   isiXhosa: 'Okugciniwe' },
  build_future:      { English: 'Build your future.',                 isiZulu: 'Yakha ikusasa lakho.',                       Sesotho: 'Haha bokamoso ba hao.',                Afrikaans: 'Bou jou toekoms.',          isiXhosa: 'Yakha ikamva lakho.' },
  your_next_step:    { English: 'YOUR NEXT STEP',                     isiZulu: 'ISINYATHELO SAKHO ESILANDELAYO',             Sesotho: 'MOHATO WA HAO O LATELANG',             Afrikaans: 'JOU VOLGENDE STAP' },
  discover_careers:  { English: 'Discover careers that fit you',      isiZulu: 'Thola imisebenzi efanele wena',              Sesotho: 'Fumana mesebetsi e u tshwanelang',     Afrikaans: 'Ontdek loopbane wat by jou pas' },
  explore_tools:     { English: 'Explore tools',                      isiZulu: 'Hlola amathuluzi',                           Sesotho: 'Hlahloba didirisiwa',                  Afrikaans: 'Verken gereedskap' },
  // ── Inclusivity / accessibility keys ──────────────────────────────────────
  offline_works:     {
    English:   'This app works without internet. All career information is available offline.',
    isiZulu:   'Lolu hlelo lusebenza ngaphandle kwe-inthanethi. Ulwazi lonke lwezikhundla luyatholakala ngaphandle kwe-inthanethi.',
    Sesotho:   'Lenaneo lena le sebetsa ntle le inthanete. Tlhahisoleseding yohle ya mesebetsi e fumaneha offline.',
    Afrikaans: 'Hierdie toepassing werk sonder internet. Alle loopbaaninfo is vanlyn beskikbaar.',
    isiXhosa:  'Le app isebenza ngaphandle kwe-intanethi. Ulwazi lonke lweemisebenzi lufumaneka ngaphandle kwe-intanethi.',
  },
  offline_banner:    {
    English:   'You are offline — all content still works.',
    isiZulu:   'Awunayo i-inthanethi — yonke imininingwane isasebenza.',
    Sesotho:   'Ha o na inthanete — litaba tsohle di ntse di sebetsa.',
    Afrikaans: 'Jy is vanlyn — alle inhoud werk steeds.',
    isiXhosa:  'Awunayo i-intanethi — yonke imixholo isasebenza.',
  },
  text_size:         { English: 'Text size',       isiZulu: 'Usayizi wombhalo',  Sesotho: 'Boholo ba mongolo',  Afrikaans: 'Teksgrootte' },
  text_size_small:   { English: 'A',               isiZulu: 'A',                 Sesotho: 'A',                  Afrikaans: 'A' },
  text_size_large:   { English: 'A',               isiZulu: 'A',                 Sesotho: 'A',                  Afrikaans: 'A' },
  high_contrast:     { English: 'High contrast',   isiZulu: 'Ukuphikisana okuphezulu', Sesotho: 'Phapang e phahameng', Afrikaans: 'Hoë kontras' },
  accessibility:     { English: 'Accessibility',   isiZulu: 'Ukufinyelela',      Sesotho: 'Phihlello',          Afrikaans: 'Toeganklikheid' },
  ussd_tip:          {
    English:   'No smartphone? Call or SMS the Khetha helpline: 086 999 0123',
    isiZulu:   'Awunayo i-smartphone? Shayela noma uthumele i-SMS ku-Khetha: 086 999 0123',
    Sesotho:   'Ha o na smartphone? Letsetsa kapa romela SMS ho Khetha: 086 999 0123',
    Afrikaans: 'Geen slimfoon nie? Bel of SMS die Khetha-hulplyn: 086 999 0123',
    isiXhosa:  'Awunayo i-smartphone? Tsalela okanye thumela i-SMS ku-Khetha: 086 999 0123',
  },
};

export function useT() {
  const language = useUserStore((s) => s.language) as Lang;
  return (key: string): string =>
    dict[key]?.[language] ?? dict[key]?.['English'] ?? key;
}
