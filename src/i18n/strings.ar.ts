// Arabic (ar) catalog for HopeBox NGO Logistics
import { strings as en } from "./strings";

export const strings = {
  app: {
    name: "هوب بوكس (HopeBox)",
    tagline: "نظام إدارة سلاسل الإمداد للمنظمات غير الحكومية",
  },

  auth: {
    signIn: "تسجيل الدخول",
    signUp: "إنشاء حساب",
    welcome: "مرحباً بعودتك",
    welcomeSub: "قم بتسجيل الدخول للمتابعة",
    createHeading: "إنشاء حساب جديد",
    createSub: "انضم إلينا اليوم",
    fullName: "الاسم الكامل",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "••••••••",
    namePlaceholder: "اسمك",
    forgotPassword: "هل نسيت كلمة المرور؟",
    noAccount: "ليس لديك حساب؟",
    haveAccount: "لديك حساب بالفعل؟",
    strengthLabels: {
      empty: "8 أحرف على الأقل",
      tooShort: "قصير جداً",
      fair: "مقبول",
      strong: "قوي",
    },
    termsPrefix: "بالتسجيل أنت توافق على ",
    termsSuffix: " و ",
    termsOfService: "شروط الخدمة",
    privacyPolicy: "سياسة الخصوصية",
    legalLinkHint: "يفتح في المتصفح الخاص بك",
    legalLinkUnavailable: "لم يتم تكوين هذا الرابط بعد.",
    errors: {
      emailInvalid: "أدخل عنوان بريد إلكتروني صالح",
      passwordShort: "يجب أن تكون كلمة المرور 8 أحرف على الأقل",
      nameRequired: "الاسم الكامل مطلوب",
      emailInUse: "هذا البريد الإلكتروني مسجل بالفعل.",
      invalidEmail: "بريد إلكتروني غير صالح.",
      weakPassword: "كلمة المرور ضعيفة جداً.",
      accountFailed: "فشل إنشاء الحساب",
      invalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      timeout: "انتهت مهلة الاتصال. تحقق من الإنترنت واعد المحاولة.",
      tooManyRequests: "محاولات كثيرة جداً. حاول لاحقاً.",
      noUser: "لم يتم العثور على حساب بهذا البريد.",
      wrongPassword: "كلمة المرور غير صحيحة.",
    },
  },

  forgotPassword: {
    eyebrow: "استعادة الحساب",
    title: "إعادة تعيين كلمة المرور",
    subtitle: "أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة التعيين.",
    emailLabel: "عنوان البريد الإلكتروني",
  },

  dashboard: {
    title: "لوحة التحكم",
    manageBoxes: "إدارة الصناديق",
    scanQR: "مسح رمز QR",
    adminInventory: "المخزون المركزي",
    analytics: "التحليلات",
    auditLog: "سجل التدقيق",
    exportCSV: "تصدير CSV",
    exportPDF: "تصدير PDF",
    emptyChart: "لا تتوفر بيانات مخزون",
    exportEmpty: "لا توجد صناديق للتصدير",
    exportSuccess: "تم تصدير CSV بنجاح",
    exportFailed: "فشل تصدير CSV",
    pdfSuccess: "تم تصدير PDF بنجاح",
    pdfFailed: "فشل تصدير PDF",
    themeLight: "الوضع الفاتح",
    themeDark: "الوضع الداكن",
    signOut: "تسجيل الخروج",
  },

  boxes: {
    title: "قائمة صناديق الإغاثة",
    addBox: "إضافة صندوق جديد",
    searchPlaceholder: "البحث حسب معرف الصندوق أو رمز QR...",
    filterAll: "الكل",
    filterStored: "في المخزن",
    filterDispatched: "تم التوزيع",
    filterReturned: "مرتجع",
    emptyTitle: "لم يتم العثور على صناديق",
    emptySubtitle: "لا توجد صناديق إغاثة تطابق بحثك.",
  },

  common: {
    save: "حفظ",
    cancel: "إلغاء",
    delete: "حذف",
    edit: "تعديل",
    back: "رجوع",
    loading: "جاري التحميل…",
    retry: "إعادة المحاولة",
    confirm: "تأكيد",
    refreshing: "جاري التحديث…",
    refresh: "اسحب للتحديث",
    dismiss: "إغلاق",
    permissionDeniedTitle: "تم رفض الإذن",
    permissionDeniedMessage: "حسابك لا يملك صلاحية الوصول إلى هذا القسم.",
    offline: "أنت غير متصل بالإنترنت. سيتم المزامنة عند الاتصال.",
    signedOut: "تم تسجيل الخروج بنجاح",
    signOutFailed: "فشل تسجيل الخروج",
    signOutConfirm: "هل أنت تأكد من أنك تريد تسجيل الخروج؟",
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
