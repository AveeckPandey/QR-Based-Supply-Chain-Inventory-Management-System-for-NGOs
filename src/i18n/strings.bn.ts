// Bangla (bn) catalog for HopeBox South Asian NGO Logistics
import { strings as en } from "./strings";

export const strings = {
  app: {
    name: "হোপবক্স (HopeBox)",
    tagline: "এনজিওর জন্য কিউআর সাপ্লাই চেইন সিস্টেম",
  },

  auth: {
    signIn: "সাইন ইন করুন",
    signUp: "অ্যাকাউন্ট তৈরি করুন",
    welcome: "স্বাগতম",
    welcomeSub: "চালিয়ে যেতে সাইন ইন করুন",
    createHeading: "অ্যাকাউন্ট তৈরি করুন",
    createSub: "আজই আমাদের সাথে যোগ দিন",
    fullName: "সম্পূর্ণ নাম",
    email: "ইমেইল ঠিকানা",
    password: "পাসওয়ার্ড",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "••••••••",
    namePlaceholder: "আপনার নাম",
    forgotPassword: "পাসওয়ার্ড ভুলে গেছেন?",
    noAccount: "অ্যাকাউন্ট নেই?",
    haveAccount: "ইতিমধ্যে একটি অ্যাকাউন্ট আছে?",
    strengthLabels: {
      empty: "নূন্যতম ৮ টি অক্ষর",
      tooShort: "খুব ছোট",
      fair: "মোটামুটি",
      strong: "শক্তিশালী",
    },
    termsPrefix: "সাইন আপ করে আপনি আমাদের ",
    termsSuffix: " এবং ",
    termsOfService: "সেবার শর্তাবলী",
    privacyPolicy: "গোপনীয়তা নীতি",
    legalLinkHint: "আপনার ব্রাউজারে খুলবে",
    legalLinkUnavailable: "এই নীতি লিংকটি এখনও কনফিগার করা হয়নি।",
    errors: {
      emailInvalid: "একটি বৈধ ইমেইল ঠিকানা দিন",
      passwordShort: "পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে",
      nameRequired: "সম্পূর্ণ নাম আবশ্যক",
      emailInUse: "এই ইমেইলটি ইতিমধ্যেই নিবন্ধিত। অনুগ্রহ করে সাইন ইন করুন।",
      invalidEmail: "অকার্যকর ইমেইল ঠিকানা।",
      weakPassword: "পাসওয়ার্ড দুর্বল। অক্ষর ও সংখ্যা মিলিয়ে অন্তত ৮ টি অক্ষর দিন।",
      accountFailed: "অ্যাকাউন্ট তৈরি করতে ব্যর্থ হয়েছে",
      invalidCredentials: "ইমেইল বা পাসওয়ার্ড ভুল",
      timeout: "সংযোগের সময় শেষ হয়েছে। ইন্টারনেট পরীক্ষা করুন।",
      tooManyRequests: "অনেক বেশি প্রচেষ্টা। পরে আবার চেষ্টা করুন।",
      noUser: "এই ইমেইল দিয়ে কোন অ্যাকাউন্ট পাওয়া যায়নি।",
      wrongPassword: "ভুল পাসওয়ার্ড।",
    },
  },

  forgotPassword: {
    eyebrow: "অ্যাকাউন্ট পুনরুদ্ধার",
    title: "পাসওয়ার্ড রিসেট করুন",
    subtitle: "আপনার ইমেইল দিন, আমরা একটি রিসেট লিংক পাঠাব।",
    emailLabel: "ইমেইল ঠিকানা",
  },

  dashboard: {
    title: "ড্যাশবোর্ড",
    manageBoxes: "বক্স পরিচালনা",
    scanQR: "কিউআর স্ক্যান",
    adminInventory: "গুদাম ইনভেন্টরি",
    analytics: "বিশ্লেষণ",
    auditLog: "অডিট লগ",
    exportCSV: "সিএসভি এক্সপোর্ট",
    exportPDF: "পিডিএফ এক্সপোর্ট",
    emptyChart: "কোন ইনভেন্টরি ডাটা পাওয়া যায়নি",
    exportEmpty: "এক্সপোর্ট করার মত কোন বক্স নেই",
    exportSuccess: "সিএসভি সফলভাবে এক্সপোর্ট হয়েছে",
    exportFailed: "সিএসভি এক্সপোর্ট করতে ব্যর্থ",
    pdfSuccess: "পিডিএফ সফলভাবে এক্সপোর্ট হয়েছে",
    pdfFailed: "পিডিএফ এক্সপোর্ট করতে ব্যর্থ",
    themeLight: "লাইট মোড",
    themeDark: "ডার্ক মোড",
    signOut: "সাইন আউট",
  },

  boxes: {
    title: "ত্রাণ বক্স তালিকা",
    addBox: "নতুন বক্স যোগ করুন",
    searchPlaceholder: "বক্স আইডি বা কিউআর দিয়ে খুঁজুন...",
    filterAll: "সব",
    filterStored: "গুদামে সংরক্ষিত",
    filterDispatched: "বিতরণ করা হয়েছে",
    filterReturned: "ফেরত এসেছে",
    emptyTitle: "কোন বক্স পাওয়া যায়নি",
    emptySubtitle: "আপনার অনুসন্ধানের সাথে মেলে এমন কোন ত্রাণ বক্স নেই।",
  },

  common: {
    save: "সংরক্ষণ করুন",
    cancel: "বাতিল করুন",
    delete: "মুছে ফেলুন",
    edit: "সম্পাদনা করুন",
    back: "ফিরে যান",
    loading: "লোড হচ্ছে…",
    retry: "পুনরায় চেষ্টা করুন",
    confirm: "নিশ্চিত করুন",
    refreshing: "রিফ্রেশ হচ্ছে…",
    refresh: "রিফ্রেশ করতে টানুন",
    dismiss: "বন্ধ করুন",
    permissionDeniedTitle: "অনুমতি অস্বীকৃত",
    permissionDeniedMessage: "আপনার অ্যাকাউন্টে এই বিভাগে প্রবেশের অনুমতি নেই।",
    offline: "আপনি অফলাইনে আছেন। সংযোগ এলে সিঙ্ক হবে।",
    signedOut: "সফলভাবে সাইন আউট হয়েছে",
    signOutFailed: "সাইন আউট করা যায়নি",
    signOutConfirm: "আপনি কি নিশ্চিত যে সাইন আউট করতে চান?",
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
