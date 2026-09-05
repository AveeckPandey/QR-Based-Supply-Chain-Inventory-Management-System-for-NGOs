// Swahili (sw) catalog for HopeBox Sub-Saharan Africa NGO Logistics
import { strings as en } from "./strings";

export const strings = {
  app: {
    name: "HopeBox",
    tagline: "Mfumo wa QR wa Ugavi wa Mashirika yasiyo ya Kiserikali (NGO)",
  },

  nav: {
    home: "Mwanzo",
    boxes: "Makasha",
    scan: "Soma QR",
    analytics: "Uchambuzi",
    settings: "Mipangilio",
  },

  auth: {
    signIn: "Ingia",
    signUp: "Tengeneza Akaunti",
    welcome: "Karibu Tena",
    welcomeSub: "Ingia ili kuendelea",
    createHeading: "Tengeneza Akaunti Mpya",
    createSub: "Jiunge nasi leo",
    fullName: "JINA KAMILI",
    email: "BARUA PEPE",
    password: "NYWILA",
    emailPlaceholder: "wewe@mfano.com",
    passwordPlaceholder: "••••••••",
    namePlaceholder: "Jina lakow",
    forgotPassword: "Umesahau nywila?",
    noAccount: "Huna akaunti?",
    haveAccount: "Unayo akaunti tayari?",
    strengthLabels: {
      empty: "Kima cha chini herufi 8",
      tooShort: "Fupi mno",
      fair: "Kiasi",
      strong: "Imara",
    },
    termsPrefix: "Kwa kujisajili unakubaliana na ",
    termsSuffix: " na ",
    termsOfService: "Vigezo vya Huduma",
    privacyPolicy: "Sera ya Faragha",
    legalLinkHint: "Inafunguka kwenye kivinjari",
    legalLinkUnavailable: "Kiungo hiki hakijasanidiwa bado.",
    errors: {
      emailInvalid: "Weka barua pepe halali",
      passwordShort: "Nywila lazima iwe na herufi 8 au zaidi",
      nameRequired: "Jina kamili linahitajika",
      emailInUse: "Barua pepe hii imesajiliwa tayari.",
      invalidEmail: "Barua pepe si halali.",
      weakPassword: "Nywila ni dhaifu mno.",
      accountFailed: "Kushindwa kutengeneza akaunti",
      invalidCredentials: "Barua pepe au nywila si sahihi",
      timeout: "Muda wa muunganisho umeisha. Angalia mtandao wako.",
      tooManyRequests: "Jaribio nyingi mno. Jaribu tena baadae.",
      noUser: "Hakuna akaunti iliyopatikana kwa barua pepe hii.",
      wrongPassword: "Nywila si sahihi.",
    },
  },

  forgotPassword: {
    eyebrow: "UREJESHAJI WA AKAUNTI",
    title: "Weka Upya Nywila",
    subtitle: "Weka barua pepe yako tutatuma kiungo cha kuweka upya.",
    emailLabel: "Barua pepe",
  },

  dashboard: {
    title: "Dawati Kuu (Dashboard)",
    manageBoxes: "Simamia Makasha",
    scanQR: "Soma QR Code",
    adminInventory: "Akiba ya Stoo",
    analytics: "Uchambuzi",
    auditLog: "Kumbukumbu za Ukaguzi",
    exportCSV: "Pakua CSV",
    exportPDF: "Pakua PDF",
    emptyChart: "Hakuna takwimu za akiba zilizopatikana",
    exportEmpty: "Hakuna makasha ya kupakua",
    exportSuccess: "CSV imepakuliwa kikamilifu",
    exportFailed: "Imeshindwa kupakua CSV",
    pdfSuccess: "PDF imepakuliwa kikamilifu",
    pdfFailed: "Imeshindwa kupakua PDF",
    themeLight: "Hali ya Mwangaza",
    themeDark: "Hali ya Giza",
    signOut: "Ondoka (Sign Out)",
  },

  boxes: {
    title: "Orodha ya Makasha ya Msaada",
    addBox: "Ongeza Kasha Mpya",
    searchPlaceholder: "Tafuta kwa ID ya Kasha au QR...",
    filterAll: "Yote",
    filterStored: "Gerezani / Stoo",
    filterDispatched: "Yaliyosambazwa",
    filterReturned: "Yaliyorereshwa",
    emptyTitle: "Hakuna makasha yaliyopatikana",
    emptySubtitle: "Hakuna kasha la msaada linalolingana na utafutaji wako.",
  },

  common: {
    save: "Hifadhi",
    cancel: "Ghairi",
    delete: "Futa",
    edit: "Hariri",
    back: "Rudi",
    loading: "Inapakia…",
    retry: "Jaribu Tena",
    confirm: "Thibitisha",
    refreshing: "Inasasisha…",
    refresh: "Vuta ili kusasisha",
    dismiss: "Funga",
    permissionDeniedTitle: "Ruhusa Imekataliwa",
    permissionDeniedMessage: "Akaunti yako haina ruhusa ya kufikia sehemu hii.",
    offline: "Haupo kwenye mtandao. Mabadiliko yatasawazishwa ukirudi mtandaoni.",
    signedOut: "Umeondoka kikamilifu",
    signOutFailed: "Imeshindwa kuondoka",
    signOutConfirm: "Je, una uhakika unataka kuondoka?",
  },
};

function deepMerge(fallback: unknown, primary: unknown): Record<string, unknown> {
  const out: Record<string, unknown> = { ...((fallback as Record<string, unknown>) || {}) };
  for (const [k, v] of Object.entries((primary as Record<string, unknown>) || {})) {
    if (
      v &&
      typeof v === "object" &&
      !Array.isArray(v) &&
      out[k] &&
      typeof out[k] === "object"
    ) {
      out[k] = deepMerge(out[k], v);
    } else if (v !== undefined && v !== null && v !== "") {
      out[k] = v;
    }
  }
  return out;
}

export const merged = deepMerge(en, strings);
