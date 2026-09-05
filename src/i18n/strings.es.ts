// Spanish (es) catalog for HopeBox NGO Logistics
import { strings as en } from "./strings";

export const strings = {
  app: {
    name: "HopeBox",
    tagline: "Cadena de Suministro QR para ONGs",
  },

  nav: {
    home: "Inicio",
    boxes: "Cajas",
    scan: "Escanear",
    analytics: "Analítica",
    settings: "Ajustes",
  },

  auth: {
    signIn: "Iniciar Sesión",
    signUp: "Crear Cuenta",
    welcome: "Bienvenido de nuevo",
    welcomeSub: "Inicia sesión para continuar",
    createHeading: "Crear una Cuenta",
    createSub: "Únete a nosotros hoy",
    fullName: "NOMBRE COMPLETO",
    email: "CORREO ELECTRÓNICO",
    password: "CONTRASEÑA",
    emailPlaceholder: "tu@ejemplo.com",
    passwordPlaceholder: "••••••••",
    namePlaceholder: "Tu nombre",
    forgotPassword: "¿Olvidaste tu contraseña?",
    noAccount: "¿No tienes una cuenta?",
    haveAccount: "¿Ya tienes una cuenta?",
    strengthLabels: {
      empty: "Mín. 8 caracteres",
      tooShort: "Demasiado corta",
      fair: "Aceptable",
      strong: "Fuerte",
    },
    termsPrefix: "Al registrarte aceptas nuestros ",
    termsSuffix: " y ",
    termsOfService: "Términos del Servicio",
    privacyPolicy: "Política de Privacidad",
    legalLinkHint: "Se abre en tu navegador",
    legalLinkUnavailable: "Este enlace no ha sido configurado.",
    errors: {
      emailInvalid: "Ingresa un correo electrónico válido",
      passwordShort: "La contraseña debe tener al menos 8 caracteres",
      nameRequired: "El nombre completo es requerido",
      emailInUse: "Este correo ya está registrado.",
      invalidEmail: "Correo electrónico no válido.",
      weakPassword: "La contraseña es muy débil.",
      accountFailed: "Fallo al crear la cuenta",
      invalidCredentials: "Correo o contraseña incorrectos",
      timeout: "Conexión expirada. Revisa tu internet e intenta de nuevo.",
      tooManyRequests: "Demasiados intentos. Intenta más tarde.",
      noUser: "No se encontró cuenta con este correo.",
      wrongPassword: "Contraseña incorrecta.",
    },
  },

  forgotPassword: {
    eyebrow: "RECUPERACIÓN DE CUENTA",
    title: "Restablecer Contraseña",
    subtitle: "Ingresa tu correo y te enviaremos un enlace de recuperación.",
    emailLabel: "Correo electrónico",
  },

  dashboard: {
    title: "Panel de Control",
    manageBoxes: "Gestionar Cajas",
    scanQR: "Escanear QR",
    adminInventory: "Inventario General",
    analytics: "Analítica",
    auditLog: "Registro de Auditoría",
    exportCSV: "Exportar CSV",
    exportPDF: "Exportar PDF",
    emptyChart: "No hay datos de inventario disponibles",
    exportEmpty: "No hay cajas para exportar",
    exportSuccess: "CSV exportado con éxito",
    exportFailed: "Error al exportar CSV",
    pdfSuccess: "PDF exportado con éxito",
    pdfFailed: "Error al exportar PDF",
    themeLight: "Modo Claro",
    themeDark: "Modo Oscuro",
    signOut: "Cerrar Sesión",
  },

  boxes: {
    title: "Lista de Cajas de Ayuda",
    addBox: "Agregar Nueva Caja",
    searchPlaceholder: "Buscar por ID de Caja o Código QR...",
    filterAll: "Todas",
    filterStored: "En Almacén",
    filterDispatched: "Despachadas",
    filterReturned: "Devueltas",
    emptyTitle: "No se encontraron cajas",
    emptySubtitle: "No hay cajas de ayuda que coincidan con tu búsqueda.",
  },

  common: {
    save: "Guardar",
    cancel: "Cancelar",
    delete: "Eliminar",
    edit: "Editar",
    back: "Volver",
    loading: "Cargando…",
    retry: "Reintentar",
    confirm: "Confirmar",
    refreshing: "Actualizando…",
    refresh: "Desliza para actualizar",
    dismiss: "Cerrar",
    permissionDeniedTitle: "Permiso Denegado",
    permissionDeniedMessage: "Tu cuenta no tiene acceso a esta sección.",
    offline: "Estás fuera de línea. Los cambios se sincronizarán al conectar.",
    signedOut: "Sesión cerrada correctamente",
    signOutFailed: "No se pudo cerrar sesión",
    signOutConfirm: "¿Estás seguro de que deseas cerrar sesión?",
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
