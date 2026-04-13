"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingUp, Clock, Star, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  WEEKLY_TRENDS,
  PEAK_HOURS_DATA,
  ROUTES_PERFORMANCE,
} from "@/lib/dashboard-data";

// ── Configs ──
const trendsConfig = {
  passageiros: { label: "Passageiros", color: "#22c55e" },
  receita: { label: "Receita (RWF)", color: "#3b82f6" },
} satisfies ChartConfig;

const peakConfig = {
  seg: { label: "Segunda", color: "#22c55e" },
  ter: { label: "Terça", color: "#3b82f6" },
  qua: { label: "Quarta", color: "#a855f7" },
  qui: { label: "Quinta", color: "#f97316" },
  sex: { label: "Sexta", color: "#ef4444" },
} satisfies ChartConfig;

// Simulate monthly growth data
const monthlyGrowth = [
  { month: "Out", ocupacao: 71, pontualidade: 84, satisfacao: 3.8 },
  { month: "Nov", ocupacao: 74, pontualidade: 86, satisfacao: 3.9 },
  { month: "Dez", ocupacao: 78, pontualidade: 87, satisfacao: 4.0 },
  { month: "Jan", ocupacao: 80, pontualidade: 88, satisfacao: 4.1 },
  { month: "Fev", ocupacao: 79, pontualidade: 87, satisfacao: 4.0 },
  { month: "Mar", ocupacao: 83, pontualidade: 89, satisfacao: 4.2 },
  { month: "Abr", ocupacao: 81, pontualidade: 88, satisfacao: 4.1 },
];

const performanceConfig = {
  ocupacao: { label: "Ocupação (%)", color: "#22c55e" },
  pontualidade: { label: "Pontualidade (%)", color: "#3b82f6" },
} satisfies ChartConfig;

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6 min-h-full">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold">Analytics Avançado</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Tendências, horários de pico e performance do sistema de transporte
        </p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          {
            label: "Média Semanal",
            value: "45.9k",
            sub: "passageiros/dia",
            color: "text-emerald-400",
          },
          {
            label: "Receita Média",
            value: "RWF 22.9k",
            sub: "por dia esta semana",
            color: "text-blue-400",
          },
          {
            label: "Ocupação Média",
            value: "80.6%",
            sub: "todas as linhas",
            color: "text-purple-400",
          },
          {
            label: "Taxa de Pontualidade",
            value: "86.6%",
            sub: "chegadas a tempo",
            color: "text-orange-400",
          },
        ].map((s) => (
          <Card
            key={s.label}
            className="border-white/10 bg-card/60 backdrop-blur"
          >
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={cn("text-xl font-bold mt-1", s.color)}>{s.value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs for charts */}
      <Tabs defaultValue="trends">
        <TabsList className="border border-white/10 bg-muted/30 h-9">
          <TabsTrigger value="trends" className="text-xs">
            Tendências Semanais
          </TabsTrigger>
          <TabsTrigger value="peak" className="text-xs">
            Horários de Pico
          </TabsTrigger>
          <TabsTrigger value="performance" className="text-xs">
            Performance do Sistema
          </TabsTrigger>
        </TabsList>

        {/* ── Trends ── */}
        <TabsContent value="trends" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <Card className="border-white/10 bg-card/60 backdrop-blur">
              <CardHeader className="pb-0">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="size-4 text-emerald-400" />
                  Passageiros por Dia
                </CardTitle>
                <CardDescription className="text-xs">
                  Volume diário da semana actual
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <ChartContainer config={trendsConfig} className="h-[220px] w-full">
                  <AreaChart data={WEEKLY_TRENDS}>
                    <defs>
                      <linearGradient id="passGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="passageiros"
                      stroke="#22c55e"
                      strokeWidth={2}
                      fill="url(#passGrad)"
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-card/60 backdrop-blur">
              <CardHeader className="pb-0">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="size-4 text-blue-400" />
                  Receita Diária (RWF '000)
                </CardTitle>
                <CardDescription className="text-xs">
                  Receita de bilhetes por dia da semana
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <ChartContainer config={trendsConfig} className="h-[220px] w-full">
                  <BarChart data={WEEKLY_TRENDS}>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="receita"
                      fill="var(--color-receita)"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={32}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Peak Hours ── */}
        <TabsContent value="peak" className="space-y-4 mt-4">
          <Card className="border-white/10 bg-card/60 backdrop-blur">
            <CardHeader className="pb-0">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="size-4 text-amber-400" />
                Índice de Pico por Período e Dia
              </CardTitle>
              <CardDescription className="text-xs">
                Intensidade do tráfego (0–100) por slot horário e dia da semana
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <ChartContainer config={peakConfig} className="h-[280px] w-full">
                <BarChart data={PEAK_HOURS_DATA} barGap={1}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis
                    dataKey="slot"
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
                  <ChartLegend content={<ChartLegendContent />} />
                  {["seg", "ter", "qua", "qui", "sex"].map((d) => (
                    <Bar
                      key={d}
                      dataKey={d}
                      fill={`var(--color-${d})`}
                      radius={[2, 2, 0, 0]}
                      maxBarSize={10}
                    />
                  ))}
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Insight cards */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
            {[
              {
                title: "Período mais crítico",
                value: "06h – 08h",
                sub: "Média de 92% em dias úteis",
                icon: "🔴",
              },
              {
                title: "Dia com maior fluxo",
                value: "Sexta-feira",
                sub: "Média 14% superior ao restante da semana",
                icon: "📈",
              },
              {
                title: "Período com menor ocupação",
                value: "10h – 12h",
                sub: "Janela ideal para manutenção programada",
                icon: "🟢",
              },
            ].map((ins) => (
              <Card
                key={ins.title}
                className="border-white/10 bg-card/60 backdrop-blur"
              >
                <CardContent className="p-4">
                  <p className="text-xl mb-1">{ins.icon}</p>
                  <p className="text-xs text-muted-foreground">{ins.title}</p>
                  <p className="text-base font-bold mt-0.5">{ins.value}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{ins.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ── System Performance ── */}
        <TabsContent value="performance" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Trend chart */}
            <Card className="border-white/10 bg-card/60 backdrop-blur">
              <CardHeader className="pb-0">
                <CardTitle className="text-sm">
                  Performance do Sistema — Últimos 7 Meses
                </CardTitle>
                <CardDescription className="text-xs">
                  Evolução de ocupação e pontualidade (%)
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <ChartContainer
                  config={performanceConfig}
                  className="h-[220px] w-full"
                >
                  <LineChart data={monthlyGrowth}>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }}
                      axisLine={false}
                      tickLine={false}
                      domain={[60, 100]}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Line
                      type="monotone"
                      dataKey="ocupacao"
                      stroke="var(--color-ocupacao)"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="pontualidade"
                      stroke="var(--color-pontualidade)"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Route table */}
            <Card className="border-white/10 bg-card/60 backdrop-blur">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Performance por Rota</CardTitle>
                <CardDescription className="text-xs">
                  Comparativo de todas as linhas activas
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/8 hover:bg-transparent">
                      <TableHead className="text-[10px] text-muted-foreground pl-4">Rota</TableHead>
                      <TableHead className="text-[10px] text-muted-foreground">Ocup.</TableHead>
                      <TableHead className="text-[10px] text-muted-foreground">Pont.</TableHead>
                      <TableHead className="text-[10px] text-muted-foreground">Satis.</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ROUTES_PERFORMANCE.map((r) => (
                      <TableRow key={r.route} className="border-white/8">
                        <TableCell className="text-xs font-medium pl-4 py-2.5">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={cn(
                                "w-1.5 h-1.5 rounded-full shrink-0",
                                r.status === "active"
                                  ? "bg-emerald-500"
                                  : "bg-amber-500"
                              )}
                            />
                            {r.route}
                          </div>
                        </TableCell>
                        <TableCell className="py-2.5">
                          <div className="flex items-center gap-1.5">
                            <Progress
                              value={r.occupancy}
                              className="h-1 w-12"
                            />
                            <span className="text-[10px] text-muted-foreground">
                              {r.occupancy}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs py-2.5">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[9px] h-4 px-1.5",
                              r.onTime >= 90
                                ? "border-emerald-500/30 text-emerald-400"
                                : r.onTime >= 80
                                ? "border-amber-500/30 text-amber-400"
                                : "border-red-500/30 text-red-400"
                            )}
                          >
                            {r.onTime}%
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2.5">
                          <div className="flex items-center gap-1 text-[10px]">
                            <Star className="size-3 text-amber-400 fill-amber-400" />
                            {r.satisfaction}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}