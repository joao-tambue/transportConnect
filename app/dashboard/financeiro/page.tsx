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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Bus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MONTHLY_REVENUE, REVENUE_BY_LINE } from "@/lib/dashboard-data";

// ── Configs ──
const revenueConfig = {
  receita: { label: "Receita (k RWF)", color: "#22c55e" },
  meta: { label: "Meta (k RWF)", color: "#3b82f6" },
} satisfies ChartConfig;

const lineConfig = {
  receita: { label: "Receita (k RWF)", color: "#22c55e" },
  eficiencia: { label: "Eficiência (%)", color: "#a855f7" },
} satisfies ChartConfig;

// ── KPI card ──
function FinKPI({
  title,
  value,
  sub,
  change,
  positive,
}: {
  title: string;
  value: string;
  sub: string;
  change: string;
  positive: boolean;
}) {
  return (
    <Card className="border-white/10 bg-card/60 backdrop-blur">
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold mt-1 leading-tight">{value}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
        <div
          className={cn(
            "flex items-center gap-1 mt-2 text-[11px] font-medium",
            positive ? "text-emerald-400" : "text-red-400"
          )}
        >
          {positive ? (
            <ArrowUpRight className="size-3" />
          ) : (
            <ArrowDownRight className="size-3" />
          )}
          {change}
        </div>
      </CardContent>
    </Card>
  );
}

export default function FinanceiroPage() {
  // Current month totals from data
  const currentRevenue = MONTHLY_REVENUE[MONTHLY_REVENUE.length - 1];
  const prevRevenue = MONTHLY_REVENUE[MONTHLY_REVENUE.length - 2];
  const revenueChange = (
    ((currentRevenue.receita - prevRevenue.receita) / prevRevenue.receita) *
    100
  ).toFixed(1);

  const totalLineRevenue = REVENUE_BY_LINE.reduce(
    (acc, l) => acc + l.receita,
    0
  );
  const avgEfficiency = Math.round(
    REVENUE_BY_LINE.reduce((acc, l) => acc + l.eficiencia, 0) /
      REVENUE_BY_LINE.length
  );
  const totalPassengers = REVENUE_BY_LINE.reduce(
    (acc, l) => acc + l.passageiros,
    0
  );

  return (
    <div className="p-6 space-y-6 min-h-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-emerald-600/20 flex items-center justify-center">
          <Wallet className="size-5 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Gestão Financeira</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Receita de bilhetes, eficiência por linha e metas anuais
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <FinKPI
          title="Receita — Dezembro"
          value="RWF 612k"
          sub="melhor mês do ano"
          change={`+${revenueChange}% vs mês anterior`}
          positive={true}
        />
        <FinKPI
          title="Meta Anual Atingida"
          value="104.2%"
          sub="RWF 5.53M de RWF 5.30M"
          change="Superada em RWF 230k"
          positive={true}
        />
        <FinKPI
          title="Receita por Passageiro"
          value="RWF 0.72"
          sub={`${totalPassengers.toLocaleString()} pass. activos`}
          change="−0.02 vs trimestre anterior"
          positive={false}
        />
        <FinKPI
          title="Eficiência Média das Linhas"
          value={`${avgEfficiency}%`}
          sub="média ponderada por passageiros"
          change="+3.1% vs ano anterior"
          positive={true}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Monthly revenue chart */}
        <Card className="border-white/10 bg-card/60 backdrop-blur xl:col-span-2">
          <CardHeader className="pb-0">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="size-4 text-emerald-400" />
              Receita Mensal vs Meta (k RWF)
            </CardTitle>
            <CardDescription className="text-xs">
              Comparativo de receita realizada e meta definida para 2026
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ChartContainer config={revenueConfig} className="h-[240px] w-full">
              <AreaChart data={MONTHLY_REVENUE}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="metaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                  domain={[300, 700]}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Area
                  type="monotone"
                  dataKey="receita"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#revGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="meta"
                  stroke="#3b82f6"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fill="url(#metaGrad)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Revenue breakdown */}
        <Card className="border-white/10 bg-card/60 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Distribuição por Linha</CardTitle>
            <CardDescription className="text-xs">
              Contribuição de cada linha para a receita total
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {REVENUE_BY_LINE.map((line) => {
              const share = Math.round((line.receita / totalLineRevenue) * 100);
              return (
                <div key={line.linha} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Bus className="size-2.5 text-muted-foreground" />
                      <span className="font-medium">{line.linha}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{share}%</span>
                      <span className="font-semibold">
                        RWF {line.receita}k
                      </span>
                    </div>
                  </div>
                  <Progress value={share * 1.6} className="h-1" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Revenue by line bar + Efficiency table */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Bar chart */}
        <Card className="border-white/10 bg-card/60 backdrop-blur">
          <CardHeader className="pb-0">
            <CardTitle className="text-sm">Receita por Linha (k RWF)</CardTitle>
            <CardDescription className="text-xs">
              Comparativo directo de receita entre linhas
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ChartContainer config={lineConfig} className="h-[200px] w-full">
              <BarChart data={REVENUE_BY_LINE} layout="vertical">
                <CartesianGrid stroke="rgba(255,255,255,0.06)" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 9, fill: "rgba(255,255,255,0.4)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  dataKey="linha"
                  type="category"
                  tick={{ fontSize: 10, fill: "rgba(255,255,255,0.5)" }}
                  axisLine={false}
                  tickLine={false}
                  width={48}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="receita"
                  fill="var(--color-receita)"
                  radius={[0, 4, 4, 0]}
                  maxBarSize={18}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Efficiency table */}
        <Card className="border-white/10 bg-card/60 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Eficiência Operacional por Linha</CardTitle>
            <CardDescription className="text-xs">
              Passageiros, receita e índice de eficiência
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-white/8 hover:bg-transparent">
                  <TableHead className="text-[10px] text-muted-foreground pl-4">Linha</TableHead>
                  <TableHead className="text-[10px] text-muted-foreground">Pass./Dia</TableHead>
                  <TableHead className="text-[10px] text-muted-foreground">Eficiência</TableHead>
                  <TableHead className="text-[10px] text-muted-foreground">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {REVENUE_BY_LINE.map((line) => (
                  <TableRow key={line.linha} className="border-white/8">
                    <TableCell className="text-xs font-medium pl-4 py-3">
                      {line.linha}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground py-3">
                      {line.passageiros.toLocaleString()}
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-1.5">
                        <Progress
                          value={line.eficiencia}
                          className="h-1 w-14"
                        />
                        <span className="text-[10px] text-muted-foreground">
                          {line.eficiencia}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] h-4 px-1.5",
                          line.eficiencia >= 85
                            ? "border-emerald-500/30 text-emerald-400"
                            : line.eficiencia >= 75
                            ? "border-amber-500/30 text-amber-400"
                            : "border-red-500/30 text-red-400"
                        )}
                      >
                        {line.eficiencia >= 85
                          ? "Óptimo"
                          : line.eficiencia >= 75
                          ? "Bom"
                          : "Atenção"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}