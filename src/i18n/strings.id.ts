// Indonesian (id) catalog for HopeBox NGO Logistics
import { strings as en } from "./strings";

export const strings = {
  app: {
    name: "HopeBox",
    tagline: "Rantai Pasokan QR untuk LSM / NGO",
  },

  auth: {
    signIn: "Masuk",
    signUp: "Buat Akun",
    welcome: "Selamat Datang Kembali",
    welcomeSub: "Masuk untuk melanjutkan",
    createHeading: "Buat Akun Baru",
    createSub: "Bergabunglah dengan kami hari ini",
    fullName: "NAMA LENGKAP",
    email: "ALAMAT EMAIL",
    password: "KATA SANDI",
    emailPlaceholder: "anda@contoh.com",
    passwordPlaceholder: "••••••••",
    namePlaceholder: "Nama Anda",
    forgotPassword: "Lupa kata sandi?",
    noAccount: "Belum punya akun?",
    haveAccount: "Sudah punya akun?",
    strengthLabels: {
      empty: "Min. 8 karakter",
      tooShort: "Terlalu pendek",
      fair: "Sedang",
      strong: "Kuat",
    },
    termsPrefix: "Dengan mendaftar Anda menyetujui ",
    termsSuffix: " dan ",
    termsOfService: "Ketentuan Layanan",
    privacyPolicy: "Kebijakan Privasi",
    legalLinkHint: "Buka di peramban Anda",
    legalLinkUnavailable: "Tautan kebijakan ini belum dikonfigurasi.",
    errors: {
      emailInvalid: "Masukkan alamat email yang valid",
      passwordShort: "Kata sandi minimal 8 karakter",
      nameRequired: "Nama lengkap wajib diisi",
      emailInUse: "Email ini sudah terdaftar.",
      invalidEmail: "Alamat email tidak valid.",
      weakPassword: "Kata sandi terlalu lemah.",
      accountFailed: "Gagal membuat akun",
      invalidCredentials: "Email atau kata sandi salah",
      timeout: "Waktu koneksi habis. Periksa internet Anda.",
      tooManyRequests: "Terlalu banyak percobaan. Coba lagi nanti.",
      noUser: "Tidak ada akun ditemukan dengan email ini.",
      wrongPassword: "Kata sandi salah.",
    },
  },

  forgotPassword: {
    eyebrow: "PEMULIHAN AKUN",
    title: "Atur Ulang Kata Sandi",
    subtitle: "Masukkan email Anda untuk menerima tautan atur ulang.",
    emailLabel: "Alamat email",
  },

  dashboard: {
    title: "Dasbor Utama",
    manageBoxes: "Kelola Kotak Bantuan",
    scanQR: "Pindai QR Code",
    adminInventory: "Inventaris Gudang",
    analytics: "Analisis Data",
    auditLog: "Log Audit",
    exportCSV: "Ekspor CSV",
    exportPDF: "Ekspor PDF",
    emptyChart: "Tidak ada data inventaris",
    exportEmpty: "Tidak ada kotak untuk diekspor",
    exportSuccess: "CSV berhasil diekspor",
    exportFailed: "Gagal mengekspor CSV",
    pdfSuccess: "PDF berhasil diekspor",
    pdfFailed: "Gagal mengekspor PDF",
    themeLight: "Mode Terang",
    themeDark: "Mode Gelap",
    signOut: "Keluar (Sign Out)",
  },

  boxes: {
    title: "Daftar Kotak Bantuan",
    addBox: "Tambah Kotak Baru",
    searchPlaceholder: "Cari berdasarkan ID Kotak atau Kode QR...",
    filterAll: "Semua",
    filterStored: "Tersimpan di Gudang",
    filterDispatched: "Disalurkan",
    filterReturned: "Dikembalikan",
    emptyTitle: "Tidak ada kotak ditemukan",
    emptySubtitle: "Tidak ada kotak bantuan yang cocok dengan pencarian Anda.",
  },

  common: {
    save: "Simpan",
    cancel: "Batal",
    delete: "Hapus",
    edit: "Edit",
    back: "Kembali",
    loading: "Memuat…",
    retry: "Coba Lagi",
    confirm: "Konfirmasi",
    refreshing: "Memperbarui…",
    refresh: "Tarik untuk memperbarui",
    dismiss: "Tutup",
    permissionDeniedTitle: "Izin Ditolak",
    permissionDeniedMessage: "Akun Anda tidak memiliki akses ke bagian ini.",
    offline: "Anda sedang offline. Perubahan akan disinkronkan saat terhubung.",
    signedOut: "Berhasil keluar",
    signOutFailed: "Gagal keluar",
    signOutConfirm: "Apakah Anda yakin ingin keluar?",
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
