"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import {
  Bus,
  Users,
  Activity,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  VEHICLE_FLOW_DATA,
  CONGESTION_DATA,
  HEATMAP_REGIONS,
  ROUTES_PERFORMANCE,
} from "@/lib/dashboard-data";

// ── Chart configs ──
const vehicleFlowConfig = {
  autocarros: { label: "Autocarros", color: "#22c55e" },
  motos: { label: "Moto-táxis", color: "#f97316" },
} satisfies ChartConfig;

const congestionConfig = {
  nivel: { label: "Congestionamento (%)", color: "#3b82f6" },
} satisfies ChartConfig;

// ── Helpers ──
function heatmapColor(level: number) {
  if (level >= 85) return "bg-red-500";
  if (level >= 70) return "bg-orange-500";
  if (level >= 55) return "bg-amber-500";
  if (level >= 40) return "bg-yellow-500";
  return "bg-emerald-500";
}

function heatmapBadge(level: number) {
  if (level >= 85) return "bg-red-500/15 text-red-400 border-red-500/30";
  if (level >= 70) return "bg-orange-500/15 text-orange-400 border-orange-500/30";
  if (level >= 55) return "bg-amber-500/15 text-amber-400 border-amber-500/30";
  if (level >= 40) return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
  return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
}

function heatmapLabel(level: number) {
  if (level >= 85) return "Crítico";
  if (level >= 70) return "Alto";
  if (level >= 55) return "Médio";
  if (level >= 40) return "Baixo";
  return "Normal";
}

// ── KPI Card ──
function KpiCard({
  title,
  value,
  sub,
  icon: Icon,
  trend,
  trendLabel,
  accent = "emerald",
}: {
  title: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  trend?: "up" | "down" | "warn";
  trendLabel?: string;
  accent?: "emerald" | "blue" | "orange" | "red";
}) {
  const accentColors = {
    emerald: "bg-emerald-500/10 text-emerald-400",
    blue: "bg-blue-500/10 text-blue-400",
    orange: "bg-orange-500/10 text-orange-400",
    red: "bg-red-500/10 text-red-400",
  };
  return (
    <Card className="border-white/10 bg-card/60 backdrop-blur w-full px-4">
      <CardContent className="p-4 ">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl font-bold leading-tight">{value}</p>
            {sub && (
              <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
            )}
          </div>
          <div
            className={cn(
              "size-9 rounded-lg flex items-center justify-center shrink-0",
              accentColors[accent]
            )}
          >
            <Icon className="size-4" />
          </div>
        </div>
        {trendLabel && (
          <div className="flex items-center gap-1 mt-3 text-[11px]">
            {trend === "up" && (
              <TrendingUp className="size-3 text-emerald-400" />
            )}
            {trend === "down" && (
              <TrendingDown className="size-3 text-red-400" />
            )}
            {trend === "warn" && (
              <AlertTriangle className="size-3 text-amber-400" />
            )}
            <span
              className={cn(
                trend === "up"
                  ? "text-emerald-400"
                  : trend === "down"
                  ? "text-red-400"
                  : "text-amber-400"
              )}
            >
              {trendLabel}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Page ──
export default function OperationalDashboard() {
  const [time, setTime] = useState("");
  const [refreshed, setRefreshed] = useState(false);

  useEffect(() => {
    const tick = () => {
      setTime(new Date().toLocaleTimeString("pt-PT", { timeStyle: "short" }));
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  const handleRefresh = () => {
    setRefreshed(true);
    setTimeout(() => setRefreshed(false), 1500);
  };

  return (
    <div className="p-6 space-y-6 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Dashboard Operacional</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitoramento em tempo real — Kigali Metropolitan Area
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3.5" />
            Actualizado às {time || "—"}
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-white/15 text-xs h-8"
            onClick={handleRefresh}
          >
            <RefreshCw
              className={cn("size-3.5 mr-1.5", refreshed && "animate-spin")}
            />
            Actualizar
          </Button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4 flex">
        <KpiCard
          title="Veículos Activos"
          value="847"
          sub="autocarros + moto-táxis"
          icon={Bus}
          trend="up"
          trendLabel="+12% vs ontem"
          accent="emerald"
        />
        <KpiCard
          title="Passageiros Hoje"
          value="124.5k"
          sub="acumulado desde 05h00"
          icon={Users}
          trend="up"
          trendLabel="+8% vs ontem"
          accent="blue"
        />
        <KpiCard
          title="Congestionamento Médio"
          value="68%"
          sub="pico às 17h — 95%"
          icon={Activity}
          trend="warn"
          trendLabel="Nível: Alto"
          accent="orange"
        />
        <KpiCard
          title="Incidentes Abertos"
          value="6"
          sub="3 pendentes de validação"
          icon={AlertTriangle}
          trend="down"
          trendLabel="−2 desde ontem"
          accent="red"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Vehicle Flow */}
        <Card className="border-white/10 bg-card/60 backdrop-blur xl:col-span-2">
          <CardHeader className="pb-0">
            <CardTitle className="text-sm">Fluxo de Veículos por Hora</CardTitle>
            <CardDescription className="text-xs">
              Autocarros e moto-táxis em circulação — hoje
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ChartContainer config={vehicleFlowConfig} className="h-[220px] w-full">
              <BarChart data={VEHICLE_FLOW_DATA} barGap={2}>
                <CartesianGrid
                  vertical={false}
                  stroke="rgba(255,255,255,0.06)"
                />
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="autocarros"
                  fill="var(--color-autocarros)"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={18}
                />
                <Bar
                  dataKey="motos"
                  fill="var(--color-motos)"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={18}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Congestion */}
        <Card className="border-white/10 bg-card/60 backdrop-blur">
          <CardHeader className="pb-0">
            <CardTitle className="text-sm">Nível de Congestionamento</CardTitle>
            <CardDescription className="text-xs">
              Evolução ao longo do dia (%)
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ChartContainer config={congestionConfig} className="h-[220px] w-full">
              <AreaChart data={CONGESTION_DATA}>
                <defs>
                  <linearGradient id="congGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 9, fill: "rgba(255,255,255,0.4)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: "rgba(255,255,255,0.4)" }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="nivel"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#congGrad)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Heatmap */}
        <Card className="border-white/10 bg-card/60 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Mapa de Calor — Congestionamento por Zona</CardTitle>
            <CardDescription className="text-xs">
              Nível actual de ocupação por região da cidade
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {HEATMAP_REGIONS.map((r) => (
              <div key={r.region} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{r.region}</span>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn("text-[9px] h-4 px-1.5", heatmapBadge(r.level))}
                    >
                      {heatmapLabel(r.level)}
                    </Badge>
                    <span className="text-muted-foreground text-[11px] w-8 text-right">
                      {r.level}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", heatmapColor(r.level))}
                    style={{ width: `${r.level}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Routes Status */}
        <Card className="border-white/10 bg-card/60 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Estado das Rotas Activas</CardTitle>
            <CardDescription className="text-xs">
              Ocupação e pontualidade por linha
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {ROUTES_PERFORMANCE.map((r) => (
              <div key={r.route}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full shrink-0",
                        r.status === "active" ? "bg-emerald-500" : "bg-amber-500"
                      )}
                    />
                    <span className="text-xs font-medium">{r.route}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span>🕐 {r.onTime}%</span>
                    <span>⭐ {r.satisfaction}</span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[9px] h-4 px-1.5",
                        r.status === "active"
                          ? "border-emerald-500/30 text-emerald-400"
                          : "border-amber-500/30 text-amber-400"
                      )}
                    >
                      {r.status === "active" ? "Activa" : "Atraso"}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={r.occupancy} className="h-1.5 flex-1" />
                  <span className="text-[10px] text-muted-foreground w-8 text-right">
                    {r.occupancy}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}