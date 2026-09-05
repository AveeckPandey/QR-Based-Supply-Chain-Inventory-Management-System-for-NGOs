// Malay (ms) catalog for HopeBox NGO Logistics
import { strings as en } from "./strings";

export const strings = {
  app: {
    name: "HopeBox",
    tagline: "Rangkaian Pembekalan QR untuk NGO",
  },

  auth: {
    signIn: "Log Masuk",
    signUp: "Daftar Akaun",
    welcome: "Selamat Kembali",
    welcomeSub: "Log masuk untuk meneruskan",
    createHeading: "Daftar Akaun Baru",
    createSub: "Sertai kami hari ini",
    fullName: "NAMA PENUH",
    email: "ALAMAT EMEL",
    password: "KATALALUAN",
    emailPlaceholder: "anda@contoh.com",
    passwordPlaceholder: "••••••••",
    namePlaceholder: "Nama anda",
    forgotPassword: "Lupa katalaluan?",
    noAccount: "Belum ada akaun?",
    haveAccount: "Sudah ada akaun?",
    strengthLabels: {
      empty: "Min. 8 aksara",
      tooShort: "Terlalu pendek",
      fair: "Sederhana",
      strong: "Kuat",
    },
    termsPrefix: "Dengan mendaftar anda bersetuju dengan ",
    termsSuffix: " dan ",
    termsOfService: "Syarat Perkhidmatan",
    privacyPolicy: "Dasar Privasi",
    legalLinkHint: "Dibuka dalam pelayar anda",
    legalLinkUnavailable: "Pautan dasar ini belum dikonfigurasikan.",
    errors: {
      emailInvalid: "Sila masukkan alamat emel yang sah",
      passwordShort: "Katalaluan mestilah sekurang-kurangnya 8 aksara",
      nameRequired: "Nama penuh diperlukan",
      emailInUse: "Emel ini telah berdaftar.",
      invalidEmail: "Alamat emel tidak sah.",
      weakPassword: "Katalaluan terlalu lemah.",
      accountFailed: "Gagal mendaftar akaun",
      invalidCredentials: "Emel atau katalaluan salah",
      timeout: "Masa sambungan tamat. Semak internet anda.",
      tooManyRequests: "Terlalu banyak percubaan. Cuba lagi kemudian.",
      noUser: "Tiada akaun ditemui dengan emel ini.",
      wrongPassword: "Katalaluan salah.",
    },
  },

  forgotPassword: {
    eyebrow: "PEMULIHAN AKAUN",
    title: "Tetapkan Semula Katalaluan",
    subtitle: "Masukkan emel anda untuk menerima pautan penetapan semula.",
    emailLabel: "Alamat emel",
  },

  dashboard: {
    title: "Papan Pemuka",
    manageBoxes: "Urus Kotak Bantuan",
    scanQR: "Imbas Kod QR",
    adminInventory: "Inventori Gudang",
    analytics: "Analisis Data",
    auditLog: "Log Audit",
    exportCSV: "Eksport CSV",
    exportPDF: "Eksport PDF",
    emptyChart: "Tiada data inventori",
    exportEmpty: "Tiada kotak untuk dieksport",
    exportSuccess: "CSV berjaya dieksport",
    exportFailed: "Gagal mengeksport CSV",
    pdfSuccess: "PDF berjaya dieksport",
    pdfFailed: "Gagal mengeksport PDF",
    themeLight: "Mod Terang",
    themeDark: "Mod Gelap",
    signOut: "Log Keluar",
  },

  boxes: {
    title: "Senarai Kotak Bantuan",
    addBox: "Tambah Kotak Baru",
    searchPlaceholder: "Cari mengikut ID Kotak atau Kod QR...",
    filterAll: "Semua",
    filterStored: "Dalam Gudang",
    filterDispatched: "Agihan Selesai",
    filterReturned: "Dikembalikan",
    emptyTitle: "Tiada kotak ditemui",
    emptySubtitle: "Tiada kotak bantuan yang sepadan dengan carian anda.",
  },

  common: {
    save: "Simpan",
    cancel: "Batal",
    delete: "Padam",
    edit: "Edit",
    back: "Kembali",
    loading: "Memuatkan…",
    retry: "Cuba Lagi",
    confirm: "Sahkan",
    refreshing: "Mengemas kini…",
    refresh: "Tarik untuk kemas kini",
    dismiss: "Tutup",
    permissionDeniedTitle: "Kebenaran Ditolak",
    permissionDeniedMessage: "Akaun anda tidak mempunyai akses ke bahagian ini.",
    offline: "Anda luar talian. Perubahan akan disinkronkan apabila dalam talian.",
    signedOut: "Berjaya log keluar",
    signOutFailed: "Gagal log keluar",
    signOutConfirm: "Adakah anda pasti mahu log keluar?",
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
