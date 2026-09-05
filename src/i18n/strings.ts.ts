// Setswana (ts) catalog for HopeBox Southern Africa NGO Logistics
import { strings as en } from "./strings";

export const strings = {
  app: {
    name: "HopeBox",
    tagline: "Sisteme ya Enjiniri ya QR ya Dikhamphani tsa NGO",
  },

  auth: {
    signIn: "Tsena",
    signUp: "Bula Akhaonto",
    welcome: "O Amogetswe Gape",
    welcomeSub: "Tsena go tswelela pele",
    createHeading: "Bula Akhaonto e Ntšha",
    createSub: "Ikgolaganye le rona gompieno",
    fullName: "LEINA LA BOTLALO",
    email: "ATERESE YA EMAIL",
    password: "INBOX YA KHUPAMARAMA",
    emailPlaceholder: "wena@sekaoloso.com",
    passwordPlaceholder: "••••••••",
    namePlaceholder: "Leina la gago",
    forgotPassword: "O lebetse khupamarama?",
    noAccount: "Ga o na akhaonto?",
    haveAccount: "O na le akhaonto mme?",
    strengthLabels: {
      empty: "Bokao jwa mefuta e 8",
      tooShort: "Khutshwane thata",
      fair: "E amogelesegang",
      strong: "E kuatileng",
    },
    termsPrefix: "Ka go ikwadisetsa o dumalana le ",
    termsSuffix: " le ",
    termsOfService: "Melawana ya Tiriso",
    privacyPolicy: "Pholisi ya Sephiri",
    legalLinkHint: "E bula mo sebatling sa gago",
    legalLinkUnavailable: "Kgolagano e ga e se e baakanngwe.",
    errors: {
      emailInvalid: "Tsenya aterese e e amogelesegang ya email",
      passwordShort: "Khupamarama e tshwanetse go nna le mefuta e le 8 le go feta",
      nameRequired: "Leina la botlalo le a tlhokega",
      emailInUse: "Email e e kwadisitse pele.",
      invalidEmail: "Email e ga e a siama.",
      weakPassword: "Khupamarama e bokoa thata.",
      accountFailed: "Phetlelo ya akhaonto e paletswe",
      invalidCredentials: "Email kapa khupamarama ga ya siama",
      timeout: "Nako ya kgolagano e fetile. Tlhatlhoba inthanete.",
      tooManyRequests: "Diteko di dintsi. Leka gape moragonyana.",
      noUser: "Ga go na akhaonto e e bonweng ka email e.",
      wrongPassword: "Khupamarama ga ya siama.",
    },
  },

  forgotPassword: {
    eyebrow: "PUSO YA AKHAONTO",
    title: "Seta Khupamarama Gape",
    subtitle: "Tsenya email ya gago re tla go romela kgolagano ya pusetso.",
    emailLabel: "Aterese ya email",
  },

  dashboard: {
    title: "Lekgotla la Taolo (Dashboard)",
    manageBoxes: "Laola Dikase",
    scanQR: "Skena Khoutu ya QR",
    adminInventory: "Polokelo ya Mmaraka",
    analytics: "Tshekatsheko ya Dintlha",
    auditLog: "Rekote ya Tlhatlhobo",
    exportCSV: "Romela CSV",
    exportPDF: "Romela PDF",
    emptyChart: "Ga go na dintlha tsa polokelo",
    exportEmpty: "Ga go na dikase tse di romelwang",
    exportSuccess: "CSV e rometswe ka katlego",
    exportFailed: "Phetlelo ya go romela CSV e paletswe",
    pdfSuccess: "PDF e rometswe ka katlego",
    pdfFailed: "Phetlelo ya go romela PDF e paletswe",
    themeLight: "Mekgwa ya Lesedi",
    themeDark: "Mekgwa ya Lefifi",
    signOut: "Tswa mo Sisteng",
  },

  boxes: {
    title: "Lethathamo la Dikase tsa Thuso",
    addBox: "Oketsa Kase e Ntšha",
    searchPlaceholder: "Batla ka ID ya Kase kapa QR Code...",
    filterAll: "Tshotlhe",
    filterStored: "Mo Polokelong",
    filterDispatched: "Tse di Abilweng",
    filterReturned: "Tse di Bojileng",
    emptyTitle: "Ga go na kase e e bonweng",
    emptySubtitle: "Ga go na kase ya thuso e e tsamaelanang le patlo ya gago.",
  },

  common: {
    save: "Boloka",
    cancel: "Khansela",
    delete: "Phimola",
    edit: "Baakanya",
    back: "Morago",
    loading: "E a laisha…",
    retry: "Leka Gape",
    confirm: "Netefatsa",
    refreshing: "E a ntshafatsa…",
    refresh: "Goga go ntshafatsa",
    dismiss: "Tswala",
    permissionDeniedTitle: "Tetla e Ganetswe",
    permissionDeniedMessage: "Akhaonto ya gago ga e na tetla ya go tsena mo karolong e.",
    offline: "Ga o mo inthaneteng. Diphetogo di tla synchronized fa o golagana.",
    signedOut: "O tswile mo sisteng ka katlego",
    signOutFailed: "Go tswa mo sisteng go paletswe",
    signOutConfirm: "A o netefatsa gore o batla go tswa mo sisteng?",
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
