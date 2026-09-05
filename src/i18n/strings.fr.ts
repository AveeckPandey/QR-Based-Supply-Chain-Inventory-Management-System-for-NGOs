// French (fr) catalog for HopeBox NGO Logistics
import { strings as en } from "./strings";

export const strings = {
  app: {
    name: "HopeBox",
    tagline: "Chaîne Logistique QR pour ONG",
  },

  nav: {
    home: "Accueil",
    boxes: "Colis",
    scan: "Scanner",
    analytics: "Analytique",
    settings: "Paramètres",
  },

  auth: {
    signIn: "Se Connecter",
    signUp: "Créer un Compte",
    welcome: "Bon retour parmi nous",
    welcomeSub: "Connectez-vous pour continuer",
    createHeading: "Créer un Compte",
    createSub: "Rejoignez-nous dès aujourd'hui",
    fullName: "NOM COMPLET",
    email: "ADRESSE EMAIL",
    password: "MOT DE PASSE",
    emailPlaceholder: "vous@exemple.com",
    passwordPlaceholder: "••••••••",
    namePlaceholder: "Votre nom",
    forgotPassword: "Mot de passe oublié ?",
    noAccount: "Pas encore de compte ?",
    haveAccount: "Vous avez déjà un compte ?",
    strengthLabels: {
      empty: "Min. 8 caractères",
      tooShort: "Trop court",
      fair: "Moyen",
      strong: "Fort",
    },
    termsPrefix: "En vous inscrivant, vous acceptez nos ",
    termsSuffix: " et ",
    termsOfService: "Conditions d'Utilisation",
    privacyPolicy: "Politique de Confidentialité",
    legalLinkHint: "S'ouvre dans votre navigateur",
    legalLinkUnavailable: "Ce lien n'a pas encore été configuré.",
    errors: {
      emailInvalid: "Entrez une adresse email valide",
      passwordShort: "Le mot de passe doit contenir au moins 8 caractères",
      nameRequired: "Le nom complet est requis",
      emailInUse: "Cet email est déjà enregistré.",
      invalidEmail: "Adresse email invalide.",
      weakPassword: "Le mot de passe est trop faible.",
      accountFailed: "Échec de la création du compte",
      invalidCredentials: "Email ou mot de passe incorrect",
      timeout: "Délai de connexion dépassé. Vérifiez votre connexion.",
      tooManyRequests: "Trop de tentatives. Réessayez plus tard.",
      noUser: "Aucun compte trouvé avec cet email.",
      wrongPassword: "Mot de passe incorrect.",
    },
  },

  forgotPassword: {
    eyebrow: "RÉCUPÉRATION DE COMPTE",
    title: "Réinitialiser le Mot de Passe",
    subtitle: "Entrez votre email pour recevoir un lien de réinitialisation.",
    emailLabel: "Adresse email",
  },

  dashboard: {
    title: "Tableau de Bord",
    manageBoxes: "Gérer les Colis",
    scanQR: "Scanner QR",
    adminInventory: "Inventaire Global",
    analytics: "Analytique",
    auditLog: "Journal d'Audit",
    exportCSV: "Exporter CSV",
    exportPDF: "Exporter PDF",
    emptyChart: "Aucune donnée d'inventaire disponible",
    exportEmpty: "Aucun colis à exporter",
    exportSuccess: "CSV exporté avec succès",
    exportFailed: "Échec de l'exportation CSV",
    pdfSuccess: "PDF exporté avec succès",
    pdfFailed: "Échec de l'exportation PDF",
    themeLight: "Mode Clair",
    themeDark: "Mode Sombre",
    signOut: "Déconnexion",
  },

  boxes: {
    title: "Liste des Colis d'Aide",
    addBox: "Ajouter un Nouveau Colis",
    searchPlaceholder: "Rechercher par ID ou Code QR...",
    filterAll: "Tous",
    filterStored: "En Stock",
    filterDispatched: "Distribués",
    filterReturned: "Retournés",
    emptyTitle: "Aucun colis trouvé",
    emptySubtitle: "Aucun colis ne correspond à votre recherche.",
  },

  common: {
    save: "Enregistrer",
    cancel: "Annuler",
    delete: "Supprimer",
    edit: "Modifier",
    back: "Retour",
    loading: "Chargement…",
    retry: "Réessayer",
    confirm: "Confirmer",
    refreshing: "Actualisation…",
    refresh: "Tirer pour actualiser",
    dismiss: "Fermer",
    permissionDeniedTitle: "Permission Refusée",
    permissionDeniedMessage: "Votre compte n'a pas accès à cette section.",
    offline: "Vous êtes hors ligne. Synchro au retour de la connexion.",
    signedOut: "Déconnexion réussie",
    signOutFailed: "Échec de la déconnexion",
    signOutConfirm: "Êtes-vous sûr de vouloir vous déconnecter ?",
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
