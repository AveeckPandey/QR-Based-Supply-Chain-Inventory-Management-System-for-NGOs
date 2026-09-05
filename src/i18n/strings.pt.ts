// Portuguese (pt) catalog for HopeBox NGO Logistics
import { strings as en } from "./strings";

export const strings = {
  app: {
    name: "HopeBox",
    tagline: "Cadeia de Suprimentos QR para ONGs",
  },

  auth: {
    signIn: "Entrar",
    signUp: "Criar Conta",
    welcome: "Bem-vindo de volta",
    welcomeSub: "Entrar para continuar",
    createHeading: "Criar uma Conta",
    createSub: "Junte-se a nós hoje",
    fullName: "NOME COMPLETO",
    email: "E-MAIL",
    password: "SENHA",
    emailPlaceholder: "voce@exemplo.com",
    passwordPlaceholder: "••••••••",
    namePlaceholder: "Seu nome",
    forgotPassword: "Esqueceu a senha?",
    noAccount: "Não tem uma conta?",
    haveAccount: "Já tem uma conta?",
    strengthLabels: {
      empty: "Mín. 8 caracteres",
      tooShort: "Muito curta",
      fair: "Razoável",
      strong: "Forte",
    },
    termsPrefix: "Ao se cadastrar você concorda com nossos ",
    termsSuffix: " e ",
    termsOfService: "Termos de Serviço",
    privacyPolicy: "Política de Privacidade",
    legalLinkHint: "Abre no seu navegador",
    legalLinkUnavailable: "Este link de política ainda não foi configurado.",
    errors: {
      emailInvalid: "Insira um e-mail válido",
      passwordShort: "A senha deve ter pelo menos 8 caracteres",
      nameRequired: "Nome completo é obrigatório",
      emailInUse: "Este e-mail já está cadastrado.",
      invalidEmail: "Endereço de e-mail inválido.",
      weakPassword: "A senha é muito fraca.",
      accountFailed: "Falha ao criar conta",
      invalidCredentials: "E-mail ou senha incorretos",
      timeout: "Tempo limite de conexão excedido.",
      tooManyRequests: "Muitas tentativas. Tente mais tarde.",
      noUser: "Nenhuma conta encontrada com este e-mail.",
      wrongPassword: "Senha incorreta.",
    },
  },

  forgotPassword: {
    eyebrow: "RECUPERAÇÃO DE CONTA",
    title: "Redefinir Senha",
    subtitle: "Insira seu e-mail e enviaremos um link de redefinição.",
    emailLabel: "Endereço de e-mail",
  },

  dashboard: {
    title: "Painel de Controle",
    manageBoxes: "Gerenciar Caixas",
    scanQR: "Escanear QR",
    adminInventory: "Inventário Geral",
    analytics: "Análises",
    auditLog: "Registro de Auditoria",
    exportCSV: "Exportar CSV",
    exportPDF: "Exportar PDF",
    emptyChart: "Nenhum dado de inventário disponível",
    exportEmpty: "Nenhuma caixa para exportar",
    exportSuccess: "CSV exportado com sucesso",
    exportFailed: "Falha ao exportar CSV",
    pdfSuccess: "PDF exportado com sucesso",
    pdfFailed: "Falha ao exportar PDF",
    themeLight: "Modo Claro",
    themeDark: "Modo Escuro",
    signOut: "Sair",
  },

  boxes: {
    title: "Lista de Caixas de Ajuda",
    addBox: "Adicionar Nova Caixa",
    searchPlaceholder: "Buscar por ID da Caixa ou Código QR...",
    filterAll: "Todas",
    filterStored: "Em Estoque",
    filterDispatched: "Despachadas",
    filterReturned: "Devolvidas",
    emptyTitle: "Nenhuma caixa encontrada",
    emptySubtitle: "Nenhuma caixa de ajuda corresponde à sua busca.",
  },

  common: {
    save: "Salvar",
    cancel: "Cancelar",
    delete: "Excluir",
    edit: "Editar",
    back: "Voltar",
    loading: "Carregando…",
    retry: "Tentar novamente",
    confirm: "Confirmar",
    refreshing: "Atualizando…",
    refresh: "Puxe para atualizar",
    dismiss: "Fechar",
    permissionDeniedTitle: "Permissão Negada",
    permissionDeniedMessage: "Sua conta não tem acesso a esta seção.",
    offline: "Você está offline. As alterações serão sincronizadas ao conectar.",
    signedOut: "Sessão encerrada com sucesso",
    signOutFailed: "Não foi possível sair",
    signOutConfirm: "Tem certeza de que deseja sair?",
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
