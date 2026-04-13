// ─── Simulated data for TransportConnect Rwanda Dashboard ───

export const VEHICLE_FLOW_DATA = [
  { hour: "05h", autocarros: 45, motos: 120 },
  { hour: "06h", autocarros: 120, motos: 280 },
  { hour: "07h", autocarros: 320, motos: 650 },
  { hour: "08h", autocarros: 480, motos: 820 },
  { hour: "09h", autocarros: 350, motos: 580 },
  { hour: "10h", autocarros: 220, motos: 380 },
  { hour: "11h", autocarros: 180, motos: 310 },
  { hour: "12h", autocarros: 260, motos: 450 },
  { hour: "13h", autocarros: 240, motos: 420 },
  { hour: "14h", autocarros: 200, motos: 360 },
  { hour: "15h", autocarros: 220, motos: 380 },
  { hour: "16h", autocarros: 380, motos: 620 },
  { hour: "17h", autocarros: 520, motos: 890 },
  { hour: "18h", autocarros: 480, motos: 750 },
  { hour: "19h", autocarros: 280, motos: 450 },
  { hour: "20h", autocarros: 150, motos: 220 },
];

export const CONGESTION_DATA = [
  { hour: "05h", nivel: 12 },
  { hour: "06h", nivel: 28 },
  { hour: "07h", nivel: 72 },
  { hour: "08h", nivel: 91 },
  { hour: "09h", nivel: 65 },
  { hour: "10h", nivel: 42 },
  { hour: "11h", nivel: 35 },
  { hour: "12h", nivel: 58 },
  { hour: "13h", nivel: 52 },
  { hour: "14h", nivel: 38 },
  { hour: "15h", nivel: 44 },
  { hour: "16h", nivel: 68 },
  { hour: "17h", nivel: 95 },
  { hour: "18h", nivel: 87 },
  { hour: "19h", nivel: 55 },
  { hour: "20h", nivel: 28 },
];

export const WEEKLY_TRENDS = [
  { day: "Seg", passageiros: 45200, receita: 22600 },
  { day: "Ter", passageiros: 48500, receita: 24250 },
  { day: "Qua", passageiros: 52300, receita: 26150 },
  { day: "Qui", passageiros: 49800, receita: 24900 },
  { day: "Sex", passageiros: 61200, receita: 30600 },
  { day: "Sáb", passageiros: 38500, receita: 19250 },
  { day: "Dom", passageiros: 25800, receita: 12900 },
];

export const MONTHLY_REVENUE = [
  { month: "Jan", receita: 428, meta: 400 },
  { month: "Fev", receita: 392, meta: 400 },
  { month: "Mar", receita: 445, meta: 420 },
  { month: "Abr", receita: 468, meta: 440 },
  { month: "Mai", receita: 512, meta: 460 },
  { month: "Jun", receita: 488, meta: 480 },
  { month: "Jul", receita: 524, meta: 500 },
  { month: "Ago", receita: 536, meta: 520 },
  { month: "Set", receita: 498, meta: 520 },
  { month: "Out", receita: 551, meta: 540 },
  { month: "Nov", receita: 576, meta: 560 },
  { month: "Dez", receita: 612, meta: 580 },
];

export const REVENUE_BY_LINE = [
  { linha: "KBS L01", receita: 145, eficiencia: 87, passageiros: 2400 },
  { linha: "KBS L02", receita: 138, eficiencia: 82, passageiros: 1800 },
  { linha: "MT-A", receita: 163, eficiencia: 91, passageiros: 3100 },
  { linha: "MT-B", receita: 98, eficiencia: 74, passageiros: 1100 },
  { linha: "KBS L03", receita: 118, eficiencia: 79, passageiros: 1600 },
];

export const ROUTES_PERFORMANCE = [
  { route: "KBS Linha 01", occupancy: 87, onTime: 92, satisfaction: 4.2, status: "active" },
  { route: "KBS Linha 02", occupancy: 74, onTime: 88, satisfaction: 3.9, status: "active" },
  { route: "Moto-Táxi A", occupancy: 95, onTime: 79, satisfaction: 4.5, status: "active" },
  { route: "Moto-Táxi B", occupancy: 68, onTime: 83, satisfaction: 3.7, status: "delayed" },
  { route: "KBS Linha 03", occupancy: 79, onTime: 91, satisfaction: 4.1, status: "active" },
];

export const HEATMAP_REGIONS = [
  { region: "CBD / Nyarugenge", level: 95 },
  { region: "Nyabugogo", level: 88 },
  { region: "KN 5 Road", level: 82 },
  { region: "Remera", level: 71 },
  { region: "Kacyiru", level: 65 },
  { region: "Kimironko", level: 58 },
  { region: "Gikondo", level: 42 },
  { region: "Kicukiro", level: 35 },
];

export const PEAK_HOURS_DATA = [
  { slot: "06-08h", seg: 95, ter: 88, qua: 92, qui: 90, sex: 98 },
  { slot: "08-10h", seg: 78, ter: 72, qua: 75, qui: 74, sex: 82 },
  { slot: "10-12h", seg: 45, ter: 42, qua: 46, qui: 44, sex: 52 },
  { slot: "12-14h", seg: 65, ter: 60, qua: 63, qui: 62, sex: 70 },
  { slot: "14-16h", seg: 52, ter: 48, qua: 51, qui: 50, sex: 58 },
  { slot: "16-18h", seg: 88, ter: 82, qua: 85, qui: 84, sex: 91 },
  { slot: "18-20h", seg: 72, ter: 68, qua: 71, qui: 70, sex: 76 },
];

export const INCIDENTS = [
  {
    id: "INC-001",
    type: "accident",
    road: "KN 5 Road",
    time: "07:32",
    date: "13/04/2026",
    status: "pending",
    reporter: "Utilizador #4821",
    severity: "high",
    description: "Acidente com 2 veículos, bloqueio parcial da via sentido Nyabugogo",
  },
  {
    id: "INC-002",
    type: "congestion",
    road: "KG 7 Avenue",
    time: "07:45",
    date: "13/04/2026",
    status: "validated",
    reporter: "Utilizador #3192",
    severity: "medium",
    description: "Congestionamento intenso sentido CBD, tempo de espera ~30 min",
  },
  {
    id: "INC-003",
    type: "maintenance",
    road: "Gikondo Sul",
    time: "08:12",
    date: "13/04/2026",
    status: "actioned",
    reporter: "Utilizador #7834",
    severity: "low",
    description: "Buraco no asfalto junto ao Hub Gikondo, risco para moto-táxis",
  },
  {
    id: "INC-004",
    type: "flood",
    road: "Estrada Kacyiru",
    time: "08:30",
    date: "13/04/2026",
    status: "pending",
    reporter: "Utilizador #2241",
    severity: "high",
    description: "Alagamento após chuvas fortes, estrada parcialmente intransitável",
  },
  {
    id: "INC-005",
    type: "other",
    road: "Blvd. Umuganda",
    time: "09:01",
    date: "13/04/2026",
    status: "dismissed",
    reporter: "Utilizador #9012",
    severity: "low",
    description: "Veículo avariado na berma da estrada, sem impacto no tráfego",
  },
  {
    id: "INC-006",
    type: "congestion",
    road: "KN 3 Road",
    time: "09:15",
    date: "13/04/2026",
    status: "pending",
    reporter: "Utilizador #1105",
    severity: "medium",
    description: "Fluxo lento — mercado improvisado na berma da estrada",
  },
];

export const AI_SUGGESTIONS = [
  {
    id: "sug-1",
    type: "new_route",
    emoji: "🛣️",
    title: "Nova Rota: Kigali Heights ↔ Aeroporto",
    confidence: 89,
    impact: "high" as const,
    passengers_estimate: "4.2k/dia",
    reason:
      "Alta densidade populacional na área sem cobertura de transporte público. Análise de padrões de deslocamento indica forte procura latente.",
    investment: "RWF 2.8M",
    roi_months: 8,
  },
  {
    id: "sug-2",
    type: "frequency",
    emoji: "⚡",
    title: "Aumentar Frequência: KBS L01 em Hora de Pico",
    confidence: 94,
    impact: "high" as const,
    passengers_estimate: "+1.8k/dia",
    reason:
      "Taxa de ocupação de 87% com picos de 105% entre 07h–09h. Frequência de 15 para 8 minutos reduziria superlotação e melhoraria satisfação.",
    investment: "RWF 1.2M/mês",
    roi_months: 3,
  },
  {
    id: "sug-3",
    type: "infrastructure",
    emoji: "🏗️",
    title: "Novo Hub Logístico: Bairro Kimisagara",
    confidence: 76,
    impact: "medium" as const,
    passengers_estimate: "2.1k/dia",
    reason:
      "Área em crescimento acelerado sem ponto de transferência. Conectaria 3 linhas existentes e reduziria 18% do tempo médio de viagem.",
    investment: "RWF 5.4M",
    roi_months: 18,
  },
];

export const KIGALI_LOCATIONS = [
  "Terminal Nyabugogo",
  "CBD Kigali",
  "Remera",
  "Kimironko",
  "Kacyiru",
  "Gikondo",
  "Kicukiro",
  "Kimisagara",
  "Aeroporto Internacional",
  "Kigali Heights",
];

export const ENTITIES = {
  rtda: { name: "Rwanda Transport Development Agency", short: "RTDA", role: "Administrador" },
  kigali: { name: "Município de Kigali", short: "MK", role: "Gestor Regional" },
  mininfra: { name: "MININFRA", short: "INFRA", role: "Visualizador" },
};