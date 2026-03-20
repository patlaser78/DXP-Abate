// Estados do pipeline de processo
export const ESTADOS_PROCESSO = {
    LEAD: { label: "Lead", color: "bg-blue-500", icon: "📥", order: 0 },
    COTACAO: { label: "Cotação", color: "bg-purple-500", icon: "💰", order: 1 },
    AGENDADO: { label: "Agendado", color: "bg-orange-500", icon: "📅", order: 2 },
    RECOLHIDO: { label: "Recolhido", color: "bg-yellow-500", icon: "🚛", order: 3 },
    MODELO9: { label: "Modelo 9", color: "bg-cyan-500", icon: "📋", order: 4 },
    VALORCAR: { label: "Valorcar", color: "bg-indigo-500", icon: "💻", order: 5 },
    CERTIFICADO: { label: "Certificado", color: "bg-emerald-500", icon: "📄", order: 6 },
    CONCLUIDO: { label: "Concluído", color: "bg-green-600", icon: "✅", order: 7 },
} as const;

export type EstadoProcesso = keyof typeof ESTADOS_PROCESSO;

export const ESTADOS_LISTA = Object.entries(ESTADOS_PROCESSO)
    .sort(([, a], [, b]) => a.order - b.order)
    .map(([key, value]) => ({ key, ...value }));

// Tipos de combustível
export const COMBUSTIVEIS = [
    "Gasolina",
    "Gasóleo",
    "GPL",
    "Elétrico",
    "Híbrido",
    "Outro",
] as const;

// Tipos de documento
export const TIPOS_DOCUMENTO = {
    DUA: "Documento Único Automóvel",
    LIVRETE: "Livrete",
    CC: "Cartão de Cidadão",
    MODELO9: "Modelo 9 IMT",
    CERTIFICADO: "Certificado de Destruição",
    FOTO: "Fotografia",
    OUTRO: "Outro",
} as const;

// Roles
export const ROLES = {
    ADMIN: { label: "Administrador", description: "Acesso total" },
    OPERATOR: { label: "Operacional", description: "Gestão de processos e recolhas" },
    SECRETARY: { label: "Secretária", description: "Leads, agenda e contactos" },
} as const;

// Marcas de veículos comuns em Portugal
export const MARCAS_VEICULO = [
    "Audi", "BMW", "Citroën", "Dacia", "Fiat", "Ford", "Honda",
    "Hyundai", "Kia", "Mazda", "Mercedes-Benz", "Mitsubishi",
    "Nissan", "Opel", "Peugeot", "Renault", "Seat", "Skoda",
    "Smart", "Suzuki", "Toyota", "Volkswagen", "Volvo", "Outra",
] as const;
