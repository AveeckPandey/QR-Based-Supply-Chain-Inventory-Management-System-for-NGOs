// Yoruba (yo) catalog for HopeBox West Africa NGO Logistics
import { strings as en } from "./strings";

export const strings = {
  app: {
    name: "HopeBox",
    tagline: "Eto Agbese QR fun awon NGO",
  },

  auth: {
    signIn: "Wole",
    signUp: "Shedasilẹ Akaunti",
    welcome: "E kaabo pada",
    welcomeSub: "Wole lati tesiwaju",
    createHeading: "Shedasilẹ Akaunti Titun",
    createSub: "Darapo mọ wa loni",
    fullName: "ORUKO KIKUN",
    email: "ATERESE EMAIL",
    password: "ORUKO AGBARA/PASSWORD",
    emailPlaceholder: "iwo@apeere.com",
    passwordPlaceholder: "••••••••",
    namePlaceholder: "Oruko re",
    forgotPassword: "Se o gbagbe password?",
    noAccount: "Kosi akaunti?",
    haveAccount: "O ti ni akaunti tele?",
    strengthLabels: {
      empty: "Kere julo awon alafabeeti 8",
      tooShort: "Kukuru juju",
      fair: "O daa",
      strong: "O le koko",
    },
    termsPrefix: "Lati se igbasile o gba pẹlu ",
    termsSuffix: " ati ",
    termsOfService: "Awon Ilana Agbese",
    privacyPolicy: "Ilana Asiri",
    legalLinkHint: "A se si ikanni rẹ",
    legalLinkUnavailable: "Ilana yi ko ti se atunto.",
    errors: {
      emailInvalid: "Tẹ email to tọ",
      passwordShort: "Password gbodo jẹ alafabeeti 8 tabi ju bẹẹ lọ",
      nameRequired: "Oruko kikun ṣe pataki",
      emailInUse: "Email yii ti wa ninu eto tẹlẹ.",
      invalidEmail: "Email ko tọ.",
      weakPassword: "Password ko lagbara tó.",
      accountFailed: "Aisetomọ lati she akaunti",
      invalidCredentials: "Email tabi password ko tọ",
      timeout: "Asiko asopọ ti tan. Yẹ intanẹẹti rẹ wo.",
      tooManyRequests: "Awon igbiyanju ti pọ ju. Gbiyanju nigba miiran.",
      noUser: "Kosi akaunti pẹlu email yii.",
      wrongPassword: "Password ko tọ.",
    },
  },

  forgotPassword: {
    eyebrow: "PADABO AKAUNTI",
    title: "Tún Password Ṣeto",
    subtitle: "Tẹ email rẹ kii a fi ikanni apadabọ ranṣẹ.",
    emailLabel: "Aterese Email",
  },

  dashboard: {
    title: "Oju Eto (Dashboard)",
    manageBoxes: "Tọju Awọn Apoti",
    scanQR: "Ṣayẹwo QR Code",
    adminInventory: "Ile-Ipamọ Ọja",
    analytics: "Atupale Eto",
    auditLog: "Akojọ Ayẹwo",
    exportCSV: "Musouta bi CSV",
    exportPDF: "Musouta bi PDF",
    emptyChart: "Awon data ile-ipamọ ko si",
    exportEmpty: "Kosi apoti lati musouta",
    exportSuccess: "CSV musouta pẹlu aseyori",
    exportFailed: "Gbegbe lati musouta CSV",
    pdfSuccess: "PDF musouta pẹlu aseyori",
    pdfFailed: "Gbegbe lati musouta PDF",
    themeLight: "Amo Imọle",
    themeDark: "Amo Okunkun",
    signOut: "Jade Kuro (Sign Out)",
  },

  boxes: {
    title: "Akojọ Awọn Apoti Iranlọwọ",
    addBox: "Fi Apoti Titun Kún",
    searchPlaceholder: "Wari pẹlu ID Apoti tabi QR Code...",
    filterAll: "Gbogbo rẹ",
    filterStored: "Ninu Ile-ipamọ",
    filterDispatched: "Ti pinhun",
    filterReturned: "Ti da pada",
    emptyTitle: "Ko si apoti ti a rii",
    emptySubtitle: "Kosi apoti iranlọwọ to mu pẹlu awari rẹ.",
  },

  common: {
    save: "Fi Pamọ",
    cancel: "Fagilee",
    delete: "Pa rẹ",
    edit: "Ṣatunṣe",
    back: "Pada",
    loading: "O n gbe de…",
    retry: "Gbiyanju Sẹẹdi",
    confirm: "Muu daju",
    refreshing: "O n sọ di titun…",
    refresh: "Fa lati sọ di titun",
    dismiss: "Ti i",
    permissionDeniedTitle: "Aise gba Aṣẹ",
    permissionDeniedMessage: "Akaunti rẹ ko ni aṣẹ lati wọ apakan yii.",
    offline: "O wa nita netiwọki. Awọn iyipada yio bọ sipo nigbati o ba so pọ.",
    signedOut: "O ti jade pelu aseyori",
    signOutFailed: "Ko le jade",
    signOutConfirm: "Ṣe o da ẹ lẹjo pe o fẹ jade?",
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
