// Nepali (ne) catalog for HopeBox South Asian NGO Logistics
import { strings as en } from "./strings";

export const strings = {
  app: {
    name: "होपबक्स (HopeBox)",
    tagline: "गैरसरकारी संस्थाका लागि QR आपूर्ति श्रृंखला",
  },

  nav: {
    home: "गृह",
    boxes: "बक्सहरू",
    scan: "स्क्यान",
    analytics: "विश्लेषण",
    settings: "सेटिङहरू",
  },

  auth: {
    signIn: "साइन इन गर्नुहोस्",
    signUp: "खाता बनाउनुहोस्",
    welcome: "स्वागत छ",
    welcomeSub: "जारी राख्न साइन इन गर्नुहोस्",
    createHeading: "नयाँ खाता",
    createSub: "आजै हामीसँग जोडिनुहोस्",
    fullName: "पुरा नाम",
    email: "इमेल ठेगाना",
    password: "पासवर्ड",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "••••••••",
    namePlaceholder: "तपाईंको नाम",
    forgotPassword: "पासवर्ड बिर्सनुभयो?",
    noAccount: "खाता छैन?",
    haveAccount: "पहिल्यै खाता छ?",
    strengthLabels: {
      empty: "न्यूनतम ८ अक्षर",
      tooShort: "धेरै छोटो",
      fair: "ठिकै छ",
      strong: "बलियो",
    },
    termsPrefix: "साइन अप गरेर तपाईं हाम्रा ",
    termsSuffix: " र ",
    termsOfService: "सेवाका सर्तहरू",
    privacyPolicy: "गोपनीयता नीति",
    legalLinkHint: "तपाईंको ब्राउजरमा खुल्नेछ",
    legalLinkUnavailable: "यो नीति लिङ्क अझै कन्फिगर गरिएको छैन।",
    errors: {
      emailInvalid: "मान्य इमेल ठेगाना प्रविष्ट गर्नुहोस्",
      passwordShort: "पासवर्ड कम्तिमा ८ अक्षरको हुनुपर्छ",
      nameRequired: "पुरा नाम आवश्यक छ",
      emailInUse: "यो इमेल पहिले नै दर्ता छ। कृपया साइन इन गर्नुहोस्।",
      invalidEmail: "अमान्य इमेल ठेगाना।",
      weakPassword: "पासवर्ड धेरै कमजोर छ। अक्षर र सङ्ख्या प्रयोग गर्नुहोस्।",
      accountFailed: "खाता सिर्जना गर्न असफल भयो",
      invalidCredentials: "अमान्य इमेल वा पासवर्ड",
      timeout: "सञ्जाल समय समाप्त। आफ्नो इन्टरनेट जाँच गर्नुहोस्।",
      tooManyRequests: "धेरै प्रयासहरू भए। पछि पुनः प्रयास गर्नुहोस्।",
      noUser: "यो इमेलसँग कुनै खाता फेला परेन।",
      wrongPassword: "गलत पासवर्ड।",
    },
  },

  forgotPassword: {
    eyebrow: "खाता पुनर्नवाकरण",
    title: "पासवर्ड रिसेट",
    subtitle: "आफ्नो इमेल प्रविष्ट गर्नुहोस्, हामी रिसेट लिङ्क पठाउनेछौं।",
    emailLabel: "इमेल ठेगाना",
  },

  dashboard: {
    title: "ड्यासबोर्ड",
    manageBoxes: "बक्स व्यवस्थापन",
    scanQR: "QR स्क्यान",
    adminInventory: "गोदाम मौज्दात",
    analytics: "विश्लेषण",
    auditLog: "अडिट लग",
    exportCSV: "CSV निर्यात",
    exportPDF: "PDF निर्यात",
    emptyChart: "कुनै मौज्दात डेटा फेला परेन",
    exportEmpty: "निर्यात गर्न कुनै बक्स छैन",
    exportSuccess: "CSV सफलतापूर्वक निर्यात भयो",
    exportFailed: "CSV निर्यात असफल भयो",
    pdfSuccess: "PDF सफलतापूर्वक निर्यात भयो",
    pdfFailed: "PDF निर्यात असफल भयो",
    themeLight: "लाइट मोड",
    themeDark: "डार्क मोड",
    signOut: "साइन आउट",
  },

  boxes: {
    title: "राहत बक्स सूची",
    addBox: "नयाँ बक्स थप्नुहोस्",
    searchPlaceholder: "बक्स ID वा QR बाट खोज्नुहोस्...",
    filterAll: "सबै",
    filterStored: "गोदाममा भण्डारित",
    filterDispatched: "वितरण गरिएको",
    filterReturned: "फर्ता आएको",
    emptyTitle: "कुनै बक्स फेला परेन",
    emptySubtitle: "तपाईंको खोजसँग मिल्दो कुनै राहत बक्स छैन।",
  },

  common: {
    save: "बचत गर्नुहोस्",
    cancel: "रद्द गर्नुहोस्",
    delete: "हटाउनुहोस्",
    edit: "सम्पादन गर्नुहोस्",
    back: "फर्कनुहोस्",
    loading: "लोड हुँदैछ…",
    retry: "पुनः प्रयास गर्नुहोस्",
    confirm: "पुष्टि गर्नुहोस्",
    refreshing: "ताजा हुँदैछ…",
    refresh: "ताजा गर्न तान्नुहोस्",
    dismiss: "बन्द गर्नुहोस्",
    permissionDeniedTitle: "अनुमति अस्वीकृत",
    permissionDeniedMessage: "तपाईंको खातामा यो भाग पहुँच गर्ने अनुमति छैन।",
    offline: "तपाईं अफलाइन हुनुहुन्छ। इन्टरनेट जोडिएपछि सिंक हुनेछ।",
    signedOut: "सफलतापूर्वक साइन आउट गरियो",
    signOutFailed: "साइन आउट गर्न सकिएन",
    signOutConfirm: "के तपाईं पक्का साइन आउट गर्न चाहनुहुन्छ?",
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
