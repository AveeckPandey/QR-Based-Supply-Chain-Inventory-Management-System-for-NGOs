// Luganda (lg) catalog for HopeBox East Africa NGO Logistics
import { strings as en } from "./strings";

export const strings = {
  app: {
    name: "HopeBox",
    tagline: "Enfunda ya QR ey'Ebibina by'Obwereere (NGO)",
  },

  auth: {
    signIn: "Yingira",
    signUp: "Tondawo Akaunti",
    welcome: "Tukwaniriza Nnate",
    welcomeSub: "Yingira okweyongerayo",
    createHeading: "Tonda Akaunti Empya",
    createSub: "Gegatta naffe leero",
    fullName: "ERINNYA LYO LYONNA",
    email: "EX-EMAIL",
    password: "EBYAMA/PASSWORD",
    emailPlaceholder: "gwe@ekyakulirako.com",
    passwordPlaceholder: "••••••••",
    namePlaceholder: "Erinnya lyo",
    forgotPassword: "Wewerabidde password?",
    noAccount: "Tolina akaunti?",
    haveAccount: "Olina akaunti dda?",
    strengthLabels: {
      empty: "Obubonero obutakka wansi wa 8",
      tooShort: "Kimpi nnyo",
      fair: "Kigerekere",
      strong: "Kyamanyi",
    },
    termsPrefix: "Bw’owandiisa okkiriza ",
    termsSuffix: " na ",
    termsOfService: "Emateeka g’Obuweereza",
    privacyPolicy: "Enkola y’Ebyama",
    legalLinkHint: "Kiggulwa mu browser yo",
    legalLinkUnavailable: "Enyunzi eno temannategekebwa.",
    errors: {
      emailInvalid: "Yingiza e-mail entuufu",
      passwordShort: "Password ebeere n'obubonero 8 kwozugga",
      nameRequired: "Erinnya lyonna lyetaagisa",
      emailInUse: "E-mail eno yawandiisibwa dda.",
      invalidEmail: "E-mail si ntuufu.",
      weakPassword: "Password nnafu nnyo.",
      accountFailed: "Kulemwa kutonda akaunti",
      invalidCredentials: "E-mail oba password si ntuufu",
      timeout: "Emmere y'omutimbagano eweddeyo. Kebera internet yo.",
      tooManyRequests: "Okugezaako kuyitiridde. Gezaako gye buseere.",
      noUser: "Tewali akaunti essangiddwa mu e-mail eno.",
      wrongPassword: "Password si ntuufu.",
    },
  },

  forgotPassword: {
    eyebrow: "OKUZZAWO AKAUNTI",
    title: "Kyusa Password",
    subtitle: "Yingiza e-mail yo tukuweereze enyunzi ezjawo.",
    emailLabel: "Endagiriro ya E-mail",
  },

  dashboard: {
    title: "Olupapula Olufuzi (Dashboard)",
    manageBoxes: "Ddukanya Essanduuko",
    scanQR: "Kebera Code ya QR",
    adminInventory: "Eby'omu Tterekero",
    analytics: "Ebibalo n'Okwekenneenya",
    auditLog: "Ebiwandiiko by'Okukebera",
    exportCSV: "Fulumya CSV",
    exportPDF: "Fulumya PDF",
    emptyChart: "Tewali biwandiiko bya tterekero",
    exportEmpty: "Tewali ssanduuko zifulumizibwa",
    exportSuccess: "CSV efulumiziddwa bulungi",
    exportFailed: "Kulemwa kufulumya CSV",
    pdfSuccess: "PDF efulumiziddwa bulungi",
    pdfFailed: "Kulemwa kufulumya PDF",
    themeLight: "Ekitangaala",
    themeDark: "Ekizikiza",
    signOut: "Fulumamu (Sign Out)",
  },

  boxes: {
    title: "Olukalala lw'Essanduuko z'Obuyambi",
    addBox: "Yongerako Essanduuko Empya",
    searchPlaceholder: "Nnoonya ku ID ya Ssanduuko oba QR Code...",
    filterAll: "Zonna",
    filterStored: "Mu Tterekero",
    filterDispatched: "Ezigabiddwa",
    filterReturned: "Ezizziddwawo",
    emptyTitle: "Tewali ssanduuko essangiddwa",
    emptySubtitle: "Tewali ssanduuko y'obuyambi ekwatagana n'onnoonya yo.",
  },

  common: {
    save: "Terekere",
    cancel: "Sazaamu",
    delete: "Sanyawo",
    edit: "Kyusizamu",
    back: "Dda mabega",
    loading: "Kibala…",
    retry: "Gezaako Nnate",
    confirm: "Kasa",
    refreshing: "Pya nnya…",
    refresh: "Sika okuddamu",
    dismiss: "Ggalawo",
    permissionDeniedTitle: "Olukusa Lwagaaniddwa",
    permissionDeniedMessage: "Akaunti yo terina lukusa okuyingira mu kitundu kino.",
    offline: "Toli ku mutimbagano. Ebyakyusiddwa bijja kusiingibwa bw'odya ku mutimbagano.",
    signedOut: "Ofulumye bulungi",
    signOutFailed: "Kulemwa kufuluma",
    signOutConfirm: "Ddala oyagala kufuluma?",
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
