// Chichewa (ny) catalog for HopeBox Southern Africa NGO Logistics
import { strings as en } from "./strings";

export const strings = {
  app: {
    name: "HopeBox",
    tagline: "Dongosolo la QR la Zinthu za Ma NGO",
  },

  auth: {
    signIn: "Lowa",
    signUp: "Panga Akaunti",
    welcome: "Takulandirani Komanso",
    welcomeSub: "Lowani kuti mupitilize",
    createHeading: "Panga Akaunti Yatsopano",
    createSub: "Tiyeni tipite limodzi lero",
    fullName: "DZINA LONNSE",
    email: "ADIRESI YA EMAIL",
    password: "MAWU ACHINSISI/PASSWORD",
    emailPlaceholder: "inuyo@chitsanzo.com",
    passwordPlaceholder: "••••••••",
    namePlaceholder: "Dzina lanu",
    forgotPassword: "Mwayala mawu achinsisi?",
    noAccount: "Manda akaunti?",
    haveAccount: "Muli naye kale akaunti?",
    strengthLabels: {
      empty: "Zosakwana zigawo 8",
      tooShort: "Yochepa kwambiri",
      fair: "Yapakati",
      strong: "Yamphamvu",
    },
    termsPrefix: "Podembetsa mukuvomereza ",
    termsSuffix: " ndi ",
    termsOfService: "Zofunika pa Utumiki",
    privacyPolicy: "Mfundo Zachinsisi",
    legalLinkHint: "Zitsegulidwa mu msakatuli wanu",
    legalLinkUnavailable: "Ulalo uwu sunakonzedwe bwino.",
    errors: {
      emailInvalid: "Lembani adiresi ya email yogwira ntchito",
      passwordShort: "Mawu achinsisi akhale ndi zigawo 8 kapena kuposerapo",
      nameRequired: "Dzina lonse likufunika",
      emailInUse: "Email iyi inalembetsedwa kale.",
      invalidEmail: "Adiresi ya email njoipa.",
      weakPassword: "Mawu achinsisi ndi ofooka.",
      accountFailed: "Kupanga akaunti kwakanika",
      invalidCredentials: "Email kapena mawu achinsisi si zoona",
      timeout: "Nthawi yolumikizana yatha. Onani intaneti yanu.",
      tooManyRequests: "Kuyeza kochuluka. Yesaninso tsopano.",
      noUser: "Palibe akaunti yokhala ndi email iyi.",
      wrongPassword: "Mawu achinsisi si oona.",
    },
  },

  forgotPassword: {
    eyebrow: "KUBWEZERETSA AKAUNTI",
    title: "Sinthani Mawu Achinsisi",
    subtitle: "Lembani email yanu tikutumizireni ulalo wobwezeretsa.",
    emailLabel: "Adiresi ya email",
  },

  dashboard: {
    title: "Deshibodi (Dashboard)",
    manageBoxes: "Dsamalani Mabokosi",
    scanQR: "Jambulani QR Code",
    adminInventory: "Katundu wa M'nkhokwe",
    analytics: "Kusanthula Zinthu",
    auditLog: "Zolemba za Audit",
    exportCSV: "Tumizani CSV",
    exportPDF: "Tumizani PDF",
    emptyChart: "Palibe zambiri za katundu",
    exportEmpty: "Palibe mabokosi otumizidwa",
    exportSuccess: "CSV yatumizidwa bwino",
    exportFailed: "Kutumiza CSV kwakanika",
    pdfSuccess: "PDF yatumizidwa bwino",
    pdfFailed: "Kutumiza PDF kwakanika",
    themeLight: "Kuunika",
    themeDark: "Mdimu",
    signOut: "Tulukani (Sign Out)",
  },

  boxes: {
    title: "Mndandanda wa Mabokosi Chithandizo",
    addBox: "Onjezerani Bokosi Latsopano",
    searchPlaceholder: "Fufuzani ndi ID ya Bokosi kapena QR Code...",
    filterAll: "Zonse",
    filterStored: "Zosungidwa m'Nkhokwe",
    filterDispatched: "Zogawidwa",
    filterReturned: "Zobwezeredwa",
    emptyTitle: "Palibe bokosi lofufuzidwa",
    emptySubtitle: "Palibe bokosi la chithandizo lofanana ndi zomwe mwasanthula.",
  },

  common: {
    save: "Sungani",
    cancel: "Siyani",
    delete: "Fufutani",
    edit: "Sinthani",
    back: "Bwererani",
    loading: "Zikunyamula…",
    retry: "Yesaninso",
    confirm: "Tsimikizani",
    refreshing: "Kutsitsimutsa…",
    refresh: "Kutani kuti mutsitsimutse",
    dismiss: "Tsekani",
    permissionDeniedTitle: "Chilolezo Chakanidwa",
    permissionDeniedMessage: "Akaunti yanu ilibe chilolezo cholowera gawoli.",
    offline: "Muli kunja kwa intaneti. Zosintha zizafanana mukalowera pamaneti.",
    signedOut: "Mwatuluka bwino",
    signOutFailed: "Kutuluka kwakanika",
    signOutConfirm: "Kodi muli ndi chitsimikizo kuti mukufuna kutuluka?",
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
