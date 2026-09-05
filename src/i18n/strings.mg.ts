// Malagasy (mg) catalog for HopeBox NGO Logistics
import { strings as en } from "./strings";

export const strings = {
  app: {
    name: "HopeBox",
    tagline: "Rafitra QR ho an'ny NGO",
  },

  auth: {
    signIn: "Miditra",
    signUp: "Hamorona Kaonty",
    welcome: "Tonga soa indray",
    welcomeSub: "Midira mba hanohy",
    createHeading: "Hamorona Kaonty Vaovao",
    createSub: "Miaraha aminay anio",
    fullName: "ANARANA FENO",
    email: "ADIRESY EMAIL",
    password: "TENY CIPHER/PASSWORD",
    emailPlaceholder: "ianao@ompatra.com",
    passwordPlaceholder: "••••••••",
    namePlaceholder: "Anaranao",
    forgotPassword: "Adino ny mot de passe?",
    noAccount: "Mbola tsy manana kaonty?",
    haveAccount: "Efa manana kaonty?",
    strengthLabels: {
      empty: "Kely indrindra 8 stilo",
      tooShort: "Fohy loatra",
      fair: "Antonony",
      strong: "Matajaka",
    },
    termsPrefix: "Amin'ny fisoratana anarana ianao dia manaiky ny ",
    termsSuffix: " sy ny ",
    termsOfService: "Fepetra Fampiasana",
    privacyPolicy: "Politikan'ny Privacy",
    legalLinkHint: "Misokatra amin'ny navigateur-nao",
    legalLinkUnavailable: "Mbola tsy namboarina ity rohy ity.",
    errors: {
      emailInvalid: "Mampidira adiresy email manan-kery",
      passwordShort: "Ny mot de passe dia tsy maintsy misy 8 stilo na mihoatra",
      nameRequired: "Mila anarana feno",
      emailInUse: "Efa voasoratra anarana ity email ity.",
      invalidEmail: "Adiresy email tsy manan-kery.",
      weakPassword: "Mora loatra ny mot de passe.",
      accountFailed: "Tsy nahomby ny famoronana kaonty",
      invalidCredentials: "Email na mot de passe diso",
      timeout: "Lany ny fotoana fifandraisana. Jereo ny internet.",
      tooManyRequests: "Andrana be loatra. Manandrama indray avy eo.",
      noUser: "Tsy nisy kaonty hita tamin'ity email ity.",
      wrongPassword: "Mot de passe diso.",
    },
  },

  forgotPassword: {
    eyebrow: "FANAMBOARANA KAONTY",
    title: "Hamerina ny Mot de Passe",
    subtitle: "Mampidira email dia handefasanay rohy fanavaozana.",
    emailLabel: "Adiresy email",
  },

  dashboard: {
    title: "Dashboard",
    manageBoxes: "Tantano ny Boaty",
    scanQR: "Hizaha QR Code",
    adminInventory: "Tahirin'ny Trano trano",
    analytics: "Famakafakana",
    auditLog: "Rakitra Fanaraha-maso",
    exportCSV: "Hamoaka CSV",
    exportPDF: "Hamoaka PDF",
    emptyChart: "Tsy nisy angon-drakitra tahiry hita",
    exportEmpty: "Tsy misy boaty havoaka",
    exportSuccess: "Tafavoaka soa aman-tsara ny CSV",
    exportFailed: "Tsy nahomby ny famoahana CSV",
    pdfSuccess: "Tafavoaka soa aman-tsara ny PDF",
    pdfFailed: "Tsy nahomby ny famoahana PDF",
    themeLight: "Hazavana",
    themeDark: "Maizina",
    signOut: "Mivoaka",
  },

  boxes: {
    title: "Listan'ny Boaty Fanampiana",
    addBox: "Hampiditra Boaty Vaovao",
    searchPlaceholder: "Hitady amin'ny ID Boaty na QR Code...",
    filterAll: "Rehetra",
    filterStored: "Ao amin me fitahirizana",
    filterDispatched: "Efa nozaraina",
    filterReturned: "Namberina",
    emptyTitle: "Tsy nisy boaty hita",
    emptySubtitle: "Tsy misy boaty fanampiana mifanaraka amin'ny fikarohanao.",
  },

  common: {
    save: "Hahatsindry",
    cancel: "Hanafoana",
    delete: "Fafana",
    edit: "Hanova",
    back: "Hiverina",
    loading: "Mamaky…",
    retry: "Manandrana Indray",
    confirm: "Hanaiky",
    refreshing: "Manavao…",
    refresh: "Tario mba hanavao",
    dismiss: "Hikatona",
    permissionDeniedTitle: "Tsy Nomena Alalana",
    permissionDeniedMessage: "Tsy manana alalana hiditra amin'ity fizarana ity ny kaontinao.",
    offline: "Tsy mifandray amin'ny net ianao. Hifanaraka ny fanovana rehefa mifandray.",
    signedOut: "Tafavoaka soa aman-tsara",
    signOutFailed: "Tsy afaka nivoaka",
    signOutConfirm: "Tena te hivoaka ve ianao?",
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
