// IsiZulu (zu) catalog for HopeBox Southern Africa NGO Logistics
import { strings as en } from "./strings";

export const strings = {
  app: {
    name: "HopeBox",
    tagline: "Uhlelo lwe-QR le-Supply Chain lwama-NGO",
  },

  auth: {
    signIn: "Ngena",
    signUp: "Vula I-akhawunti",
    welcome: "Siyakwamukela Futhi",
    welcomeSub: "Ngena ukuze uqhubeke",
    createHeading: "Vula I-akhawunti Entsha",
    createSub: "Joyina nathi namhlanje",
    fullName: "IGAMA EILIGWELE",
    email: "IKHELI LE-EMAIL",
    password: "IPHASSWEDI",
    emailPlaceholder: "wena@isibonelo.com",
    passwordPlaceholder: "••••••••",
    namePlaceholder: "Igama lakho",
    forgotPassword: "Ukhohlwe iphasswedi?",
    noAccount: " Awuna-akhawunti?",
    haveAccount: "Uvele unayo i-akhawunti?",
    strengthLabels: {
      empty: "Okungenani izinhlamvu ezi-8",
      tooShort: "Kufushane kakhulu",
      fair: "Kwamukelekile",
      strong: "Kunamandla",
    },
    termsPrefix: "Ngokubhalisa uvumelana ne- ",
    termsSuffix: " kanye ne- ",
    termsOfService: "Imigomo Yesevisi",
    privacyPolicy: "Inqubomgomo Yobumfihlo",
    legalLinkHint: "Ivulwa kusiphequluli sakho",
    legalLinkUnavailable: "Isixhumanisi sinqubomgomo asikamiswa.",
    errors: {
      emailInvalid: "Faka ikheli le-email elivumelekile",
      passwordShort: "Iphasswedi kumele ibe nezinhlamvu ezi-8 noma ngaphezulu",
      nameRequired: "Igama eligcwele liyadingeka",
      emailInUse: "I-email isivele ibhalisiwe.",
      invalidEmail: "Ikheli le-email alivumelekile.",
      weakPassword: "Iphasswedi ibuthakathaka kakhulu.",
      accountFailed: "Ukudala i-akhawunti kuhlulekile",
      invalidCredentials: "I-email noma iphasswedi ayilungile",
      timeout: "Isikhathi soxhumano siphelile. Hlola i-inthanethi.",
      tooManyRequests: "Imizamo eminingi kakhulu. Zama futhi ngokuhamba kwesikhathi.",
      noUser: "Ayikho i-akhawunti etholakale ngale e-mail.",
      wrongPassword: "Iphasswedi engalungile.",
    },
  },

  forgotPassword: {
    eyebrow: "UKUBUYISWA KWE-AKHAWUNTI",
    title: "Setha Kabusha Iphasswedi",
    subtitle: "Faka i-email yakho sizokuthumelela isixhumanisi sokusetha kabusha.",
    emailLabel: "Ikheli le-email",
  },

  dashboard: {
    title: "Ideshibhodi (Dashboard)",
    manageBoxes: "Phatha Amabhokisi",
    scanQR: "Skena Ikhodi ye-QR",
    adminInventory: "Isitokwe Sendawo",
    analytics: "Ukuhlaziywa Kwemininingwane",
    auditLog: "Ilogi Yokuhlola",
    exportCSV: "Thumela ku-CSV",
    exportPDF: "Thumela ku-PDF",
    emptyChart: "Ayikho imininingwane yesitokwe etholakalayo",
    exportEmpty: "Awekho amabhokisi okuthumela",
    exportSuccess: "I-CSV ithunyelwe ngempumelelo",
    exportFailed: "Ukuthumela i-CSV kuhlulekile",
    pdfSuccess: "I-PDF ithunyelwe ngempumelelo",
    pdfFailed: "Ukuthumela i-PDF kuhlulekile",
    themeLight: "Imodi Ekhanyayo",
    themeDark: "Imodi Enyama",
    signOut: "Phuma (Sign Out)",
  },

  boxes: {
    title: "Uhlu Lwamabhokisi Osizo",
    addBox: "Engeza Ibhokisi Elisha",
    searchPlaceholder: "Cinga nge-ID yebhokisi noma ikhodi ye-QR...",
    filterAll: "Konke",
    filterStored: "Kugcinwe eSitolo",
    filterDispatched: "Kuhlinzekiwe",
    filterReturned: "Kubuyisiwe",
    emptyTitle: "Alikho ibhokisi elitholakale",
    emptySubtitle: "Alikho ibhokisi losizo elifana nosesho lwakho.",
  },

  common: {
    save: "Gcina",
    cancel: "Khansela",
    delete: "Susa",
    edit: "Hlela",
    back: "Emuva",
    loading: "Ilayisha…",
    retry: "Zama Futhi",
    confirm: "Qinisekisa",
    refreshing: "Iyabuyekeza…",
    refresh: "Donsa ukuze uvuselele",
    dismiss: "Vala",
    permissionDeniedTitle: "Imvume Inqatshiwe",
    permissionDeniedMessage: "I-akhawunti yakho ayinayo imvume yokungena kule ngxenye.",
    offline: "Awukho kuxhumano lwe-inthanethi. Izinguquko zizovumelaniswa uma usuxhumekile.",
    signedOut: "Uphume ngempumelelo",
    signOutFailed: "Ukuphuma kuhlulekile",
    signOutConfirm: "Ingabe uqinisekile ukuthi ufuna ukuphuma?",
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
