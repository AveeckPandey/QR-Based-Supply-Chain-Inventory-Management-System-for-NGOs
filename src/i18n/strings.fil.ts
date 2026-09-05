// Filipino (fil) catalog for HopeBox NGO Logistics
import { strings as en } from "./strings";

export const strings = {
  app: {
    name: "HopeBox",
    tagline: "QR Supply Chain para sa mga NGO",
  },

  auth: {
    signIn: "Mag-sign In",
    signUp: "Gumawa ng Account",
    welcome: "Maligayang Pagbabalik",
    welcomeSub: "Mag-sign in upang magpatuloy",
    createHeading: "Gumawa ng Bagong Account",
    createSub: "Sumali sa amin ngayon",
    fullName: "BUONG PANGALAN",
    email: "EMAIL ADDRESS",
    password: "PASSWORD",
    emailPlaceholder: "ikaw@halimbawa.com",
    passwordPlaceholder: "••••••••",
    namePlaceholder: "Iyong pangalan",
    forgotPassword: "Nakalimutan ang password?",
    noAccount: "Wala pang account?",
    haveAccount: "May account na?",
    strengthLabels: {
      empty: "Min. 8 karakter",
      tooShort: "Masyadong maikli",
      fair: "Katamtaman",
      strong: "Matibay",
    },
    termsPrefix: "Sa pag-sign up sumasang-ayon ka sa aming ",
    termsSuffix: " at ",
    termsOfService: "Mga Tuntunin ng Serbisyo",
    privacyPolicy: "Kebijakan sa Privacy",
    legalLinkHint: "Bubukas sa iyong browser",
    legalLinkUnavailable: "Hindi pa na-configure ang link na ito.",
    errors: {
      emailInvalid: "Magpasok ng wastong email address",
      passwordShort: "Ang password ay dapat may hindi bababa sa 8 karakter",
      nameRequired: "Kailangan ang buong pangalan",
      emailInUse: "Naka-rehistro na ang email na ito.",
      invalidEmail: "Hindi valid ang email address.",
      weakPassword: "Masyadong mahina ang password.",
      accountFailed: "Pumalya ang paggawa ng account",
      invalidCredentials: "Maling email o password",
      timeout: "Na-timeout ang koneksyon. Suriin ang iyong internet.",
      tooManyRequests: "Masyadong maraming subok. Subukang muli mamaya.",
      noUser: "Walang nahanap na account gamit ang email na ito.",
      wrongPassword: "Maling password.",
    },
  },

  forgotPassword: {
    eyebrow: "RECOVERY NG ACCOUNT",
    title: "I-reset ang Password",
    subtitle: "Ipasok ang iyong email upang makatanggap ng reset link.",
    emailLabel: "Email address",
  },

  dashboard: {
    title: "Dashboard",
    manageBoxes: "Pamahalaan ang mga Kahon",
    scanQR: "Mag-scan ng QR Code",
    adminInventory: "Inventaryo ng Bodega",
    analytics: "Analitika",
    auditLog: "Log ng Audit",
    exportCSV: "I-export ang CSV",
    exportPDF: "I-export ang PDF",
    emptyChart: "Walang data ng inventaryo",
    exportEmpty: "Walang kahon na i-eexport",
    exportSuccess: "Matagumpay na na-export ang CSV",
    exportFailed: "Pumalya ang pag-export ng CSV",
    pdfSuccess: "Matagumpay na na-export ang PDF",
    pdfFailed: "Pumalya ang pag-export ng PDF",
    themeLight: "Light Mode",
    themeDark: "Dark Mode",
    signOut: "Mag-sign Out",
  },

  boxes: {
    title: "Talaan ng Relief Box",
    addBox: "Magdagdag ng Bagong Kahon",
    searchPlaceholder: "Maghanap gamit ang Box ID o QR Code...",
    filterAll: "Lahat",
    filterStored: "Naka-imbak sa Bodega",
    filterDispatched: "Naipamahagi Na",
    filterReturned: "Isinauli",
    emptyTitle: "Walang nahanap na kahon",
    emptySubtitle: "Walang relief box na tumutugma sa iyong paghahanap.",
  },

  common: {
    save: "I-save",
    cancel: "Kanselahin",
    delete: "Burahin",
    edit: "I-edit",
    back: "Bumalik",
    loading: "Naglo-load…",
    retry: "Subukang Muli",
    confirm: "Kumpirmahin",
    refreshing: "Nagre-refresh…",
    refresh: "Hilahin upang mag-refresh",
    dismiss: "Isara",
    permissionDeniedTitle: "Tanggihang Permiso",
    permissionDeniedMessage: "Walang access ang iyong account sa seksyong ito.",
    offline: "Ikaw ay offline. Mag-si-sync ang mga pagbabago kapag naka-konekta na.",
    signedOut: "Matagumpay na nakapag-sign out",
    signOutFailed: "Hindi nakapag-sign out",
    signOutConfirm: "Sigurado ka bang gusto mong mag-sign out?",
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
