// Sinhala (si) catalog for HopeBox South Asian NGO Logistics
import { strings as en } from "./strings";

export const strings = {
  app: {
    name: "හෝප්බොක්ස් (HopeBox)",
    tagline: "NGO සඳහා QR සැපයුම් දාම පද්ධතිය",
  },

  auth: {
    signIn: "ඇතුල් වන්න (Sign In)",
    signUp: "ගිණුමක් සාදන්න",
    welcome: "සාදරයෙන් පිළිගනිමු",
    welcomeSub: "წინ යාමට ඇතුල් වන්න",
    createHeading: "නව ගිණුමක්",
    createSub: "අදම අප හා එක්වන්න",
    fullName: "සම්පූර්ණ නම",
    email: "විද්‍යුත් තැපෑල",
    password: "මුරපදය",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "••••••••",
    namePlaceholder: "ඔබගේ නම",
    forgotPassword: "මුරපදය අමතක වුනිද?",
    noAccount: "ගිණුමක් නොමැතිද?",
    haveAccount: "දැනටමත් ගිණුමක් තිබේද?",
    strengthLabels: {
      empty: "අවම වශයෙන් අක්ෂර 8 ක්",
      tooShort: "කෙටි වැඩියි",
      fair: "සාමාන්‍යයි",
      strong: "ශක්තිමත්",
    },
    termsPrefix: "ලියාපදිංචි වීමෙන් ඔබ අපගේ ",
    termsSuffix: " සහ ",
    termsOfService: "සේවා කොන්දේසි",
    privacyPolicy: "රහස්‍යතා ප්‍රතිපත්තිය",
    legalLinkHint: "ඔබගේ බ්‍රවුසරයේ විවෘත වේ",
    legalLinkUnavailable: "මෙම ප්‍රතිපත්ති සබැඳිය තවම වින්‍යාස කර නොමැත.",
    errors: {
      emailInvalid: "වලංගු විද්‍යුත් තැපැල් ලිපිනයක් ඇතුළත් කරන්න",
      passwordShort: "මුරපදය අවම වශයෙන් අක්ෂර 8 ක් විය යුතුය",
      nameRequired: "සම්පූර්ණ නම අවශ්‍ය වේ",
      emailInUse: "මෙම විද්‍යුත් තැපෑල ලියාපදිංචි කර ඇත.",
      invalidEmail: "අවලංගු විද්‍යුත් තැපෑල.",
      weakPassword: "මුරපදය දුර්වලයි.",
      accountFailed: "ගිණුම සෑදීමට අපොහොසත් විය",
      invalidCredentials: "වැරදි විද්‍යුත් තැපෑල හෝ මුරපදය",
      timeout: "සම්බන්ධතාවය කල් ඉකුත් විය.",
      tooManyRequests: "උත්සාහයන් වැඩියි. පසුව නැවත උත්සාහ කරන්න.",
      noUser: "මෙම විද්‍යුත් තැපෑල සඳහා ගිණුමක් නැත.",
      wrongPassword: "වැරදි මුරපදය.",
    },
  },

  dashboard: {
    title: "පාලන පුවරුව (Dashboard)",
    manageBoxes: "පෙට්ටි කළමනාකරණය",
    scanQR: "QR ස්කෑන් කරන්න",
    adminInventory: "ගබඩා තොග",
    analytics: "විශ්ලේෂණ",
    auditLog: "ගණන් තැබීම්",
    exportCSV: "CSV ලෙස සුරකින්න",
    exportPDF: "PDF ලෙස සුරකින්න",
    emptyChart: "තොග දත්ත නොමැත",
    exportEmpty: "සුරැකීමට පෙට්ටි නොමැත",
    exportSuccess: "CSV සාර්ථකව සුරකින ලදී",
    exportFailed: "CSV සුරැකීමට අපොහොසත් විය",
    pdfSuccess: "PDF සාර්ථකව සුරකින ලදී",
    pdfFailed: "PDF සුරැකීමට අපොහොසත් විය",
    themeLight: "ආලෝක ප්‍රකාරය",
    themeDark: "අඳුරු ප්‍රකාරය",
    signOut: "ඉවත් වන්න",
  },

  common: {
    save: "සුරකින්න",
    cancel: "අවලංගු කරන්න",
    delete: "මකා දමන්න",
    edit: "සංස්කරණය",
    back: "ආපසු",
    loading: "ලෝඩ් වෙමින් පවතී…",
    retry: "නැවත උත්සාහ කරන්න",
    confirm: "තහවුරු කරන්න",
    refreshing: "යාවත්කාලීන වෙමින්…",
    refresh: "යාවත්කාලීන කිරීමට අදින්න",
    dismiss: "වසා දමන්න",
    permissionDeniedTitle: "අවසර නැත",
    permissionDeniedMessage: "ඔබගේ ගිණුමට මෙම කොටසට ප්‍රවේශ වීමට අවසර නැත.",
    offline: "ඔබ නොබැඳිව ඇත. සම්බන්ධ වූ පසු යාවත්කාලීන වේ.",
    signedOut: "සාර්ථකව ඉවත් විය",
    signOutFailed: "ඉවත් වීමට අපොහොසත් විය",
    signOutConfirm: "ඔබට ඉවත් වීමට අවශ්‍ය බව විශ්වාසද?",
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
