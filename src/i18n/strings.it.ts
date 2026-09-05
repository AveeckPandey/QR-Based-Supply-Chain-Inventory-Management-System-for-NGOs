// Italian (it) catalog for HopeBox NGO Logistics
import { strings as en } from "./strings";

export const strings = {
  app: {
    name: "HopeBox",
    tagline: "Catena di Approvvigionamento QR per ONG",
  },

  auth: {
    signIn: "Accedi",
    signUp: "Crea Account",
    welcome: "Bentornato",
    welcomeSub: "Accedi per continuare",
    createHeading: "Crea un Nuovo Account",
    createSub: "Unisciti a noi oggi",
    fullName: "NOME COMPLETO",
    email: "INDIRIZZO EMAIL",
    password: "PASSWORD",
    emailPlaceholder: "tuo@esempio.com",
    passwordPlaceholder: "••••••••",
    namePlaceholder: "Il tuo nome",
    forgotPassword: "Password dimenticata?",
    noAccount: "Non hai un account?",
    haveAccount: "Hai già un account?",
    strengthLabels: {
      empty: "Minimo 8 caratteri",
      tooShort: "Troppo corta",
      fair: "Discreta",
      strong: "Forte",
    },
    termsPrefix: "Registrandoti accetti i nostri ",
    termsSuffix: " e la ",
    termsOfService: "Termini di Servizio",
    privacyPolicy: "Informativa sulla Privacy",
    legalLinkHint: "Si apre nel tuo browser",
    legalLinkUnavailable: "Questo link non è stato ancora configurato.",
    errors: {
      emailInvalid: "Inserisci un indirizzo email valido",
      passwordShort: "La password deve contenere almeno 8 caratteri",
      nameRequired: "Il nome completo è obbligatorio",
      emailInUse: "Questa email è già registrata.",
      invalidEmail: "Indirizzo email non valido.",
      weakPassword: "La password è troppo debole.",
      accountFailed: "Creazione dell'account fallita",
      invalidCredentials: "Email o password errate",
      timeout: "Connessione scaduta. Controlla internet e riprova.",
      tooManyRequests: "Troppi tentativi. Riprova più tardi.",
      noUser: "Nessun account trovato con questa email.",
      wrongPassword: "Password errata.",
    },
  },

  forgotPassword: {
    eyebrow: "RECUPERO ACCOUNT",
    title: "Reimposta Password",
    subtitle: "Inserisci la tua email e ti invieremo un link di ripristino.",
    emailLabel: "Indirizzo email",
  },

  dashboard: {
    title: "Pannello di Controllo",
    manageBoxes: "Gestisci Scatole",
    scanQR: "Scansiona QR Code",
    adminInventory: "Inventario Magazzino",
    analytics: "Analisi Dati",
    auditLog: "Registro Audit",
    exportCSV: "Esporta CSV",
    exportPDF: "Esporta PDF",
    emptyChart: "Nessun dato di inventario disponibile",
    exportEmpty: "Nessuna scatola da esportare",
    exportSuccess: "CSV esportato con successo",
    exportFailed: "Impossibile esportare il CSV",
    pdfSuccess: "PDF esportato con successo",
    pdfFailed: "Impossibile esportare il PDF",
    themeLight: "Modalità Chiara",
    themeDark: "Modalità Scura",
    signOut: "Disconnettiti",
  },

  boxes: {
    title: "Elenco Scatole di Aiuto",
    addBox: "Aggiungi Nuova Scatola",
    searchPlaceholder: "Cerca per ID Scatola o Codice QR...",
    filterAll: "Tutte",
    filterStored: "In Magazzino",
    filterDispatched: "Distribuite",
    filterReturned: "Rese",
    emptyTitle: "Nessuna scatola trovata",
    emptySubtitle: "Nessuna scatola corrisponde alla tua ricerca.",
  },

  common: {
    save: "Salva",
    cancel: "Annulla",
    delete: "Elimina",
    edit: "Modifica",
    back: "Indietro",
    loading: "Caricamento…",
    retry: "Riprova",
    confirm: "Conferma",
    refreshing: "Aggiornamento…",
    refresh: "Trascina per aggiornare",
    dismiss: "Chiudi",
    permissionDeniedTitle: "Autorizzazione Negata",
    permissionDeniedMessage: "Il tuo account non ha accesso a questa sezione.",
    offline: "Sei offline. Le modifiche verranno sincronizzate online.",
    signedOut: "Disconnesso con successo",
    signOutFailed: "Impossibile disconnettersi",
    signOutConfirm: "Sei sicuro di voler uscire?",
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
