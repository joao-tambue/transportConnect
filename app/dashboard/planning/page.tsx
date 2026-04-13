"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Brain,
  Zap,
  TrendingUp,
  ChevronRight,
  Loader2,
  CheckCircle,
  Target,
  Users,
  DollarSign,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AI_SUGGESTIONS, KIGALI_LOCATIONS } from "@/lib/dashboard-data";

// ── Types ──
type SimulationResult = {
  estimatedPassengers: string;
  dailyRevenue: string;
  investment: string;
  breakEven: string;
  coverageScore: number;
  recommendation: string;
};

function generateSimulation(from: string, to: string): SimulationResult {
  // Deterministic pseudo-random based on inputs
  const seed = (from.length * 31 + to.length * 17) % 100;
  return {
    estimatedPassengers: `${2 + (seed % 4)}.${seed % 10}k/dia`,
    dailyRevenue: `RWF ${(48 + seed).toLocaleString()}.000`,
    investment: `RWF ${(2.2 + (seed % 4) * 0.3).toFixed(1)}M`,
    breakEven: `${50 + seed} dias`,
    coverageScore: 65 + (seed % 30),
    recommendation:
      seed > 60
        ? "Viável — ROI positivo esperado em menos de 3 meses. Alta procura latente identificada na análise de mobilidade."
        : "Moderadamente viável — Procura estimada suporta operação, mas considere estratégia de lançamento faseado.",
  };
}

// ── Impact badge ──
const impactStyles: Record<string, string> = {
  high: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  low: "bg-slate-500/15 text-slate-400 border-slate-500/30",
};

const impactLabel: Record<string, string> = {
  high: "Impacto Alto",
  medium: "Impacto Médio",
  low: "Impacto Baixo",
};

export default function PlanningPage() {
  const [fromLoc, setFromLoc] = useState("");
  const [toLoc, setToLoc] = useState("");
  const [simulating, setSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [expandedSug, setExpandedSug] = useState<string | null>(null);

  const handleSimulate = async () => {
    if (!fromLoc || !toLoc || fromLoc === toLoc) return;
    setSimulating(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 2000));
    setResult(generateSimulation(fromLoc, toLoc));
    setSimulating(false);
  };

  return (
    <div className="p-6 space-y-6 min-h-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-purple-600/20 flex items-center justify-center">
          <Brain className="size-5 text-purple-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Planeamento com IA</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Sugestões automáticas e simulações de expansão da rede
          </p>
        </div>
      </div>

      {/* AI Banner */}
      <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 px-4 py-3 flex items-start gap-3">
        <Zap className="size-4 text-purple-400 mt-0.5 shrink-0" />
        <div className="text-xs space-y-0.5">
          <p className="font-semibold text-purple-300">
            Motor de IA TransportConnect · Actualizado às 09:47
          </p>
          <p className="text-muted-foreground">
            Análise baseada em 847 veículos activos, padrões de 90 dias e dados
            de crescimento demográfico do NISR Rwanda. Confiança geral do modelo:{" "}
            <span className="text-purple-300 font-semibold">86%</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* ── AI Suggestions ── */}
        <div className="xl:col-span-2 space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Sugestões Automáticas
          </h2>

          {AI_SUGGESTIONS.map((sug) => {
            const isExpanded = expandedSug === sug.id;
            return (
              <Card
                key={sug.id}
                className="border-white/10 bg-card/60 backdrop-blur"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{sug.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <CardTitle className="text-sm">{sug.title}</CardTitle>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[9px] h-4 px-1.5",
                            impactStyles[sug.impact]
                          )}
                        >
                          {impactLabel[sug.impact]}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">
                        Passageiros estimados:{" "}
                        <span className="text-foreground font-semibold">
                          {sug.passengers_estimate}
                        </span>{" "}
                        · Investimento:{" "}
                        <span className="text-foreground font-semibold">
                          {sug.investment}
                        </span>{" "}
                        · ROI em{" "}
                        <span className="text-foreground font-semibold">
                          {sug.roi_months} meses
                        </span>
                      </CardDescription>
                    </div>
                  </div>

                  {/* Confidence */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-muted-foreground">Confiança do modelo</span>
                      <span className="font-semibold text-purple-400">
                        {sug.confidence}%
                      </span>
                    </div>
                    <Progress value={sug.confidence} className="h-1.5" />
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="pt-0 pb-3">
                    <Separator className="opacity-15 mb-3" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      <span className="text-foreground font-medium">
                        Fundamentação:{" "}
                      </span>
                      {sug.reason}
                    </p>
                  </CardContent>
                )}

                <CardContent className="pt-0 pb-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7 border-white/15"
                    onClick={() =>
                      setExpandedSug(isExpanded ? null : sug.id)
                    }
                  >
                    {isExpanded ? "Menos" : "Ver Fundamentação"}
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs h-7 bg-purple-600 hover:bg-purple-500 text-white"
                  >
                    <CheckCircle className="size-3 mr-1" />
                    Aprovar Sugestão
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* ── Route Simulator ── */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Simulador de Rotas
          </h2>

          <Card className="border-white/10 bg-card/60 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="size-4 text-purple-400" />
                "E se criarmos uma rota aqui?"
              </CardTitle>
              <CardDescription className="text-xs">
                Selecione origem e destino para simular uma nova rota com a IA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  📍 Ponto de Origem
                </Label>
                <Select onValueChange={setFromLoc}>
                  <SelectTrigger className="h-8 text-xs border-white/15">
                    <SelectValue placeholder="Seleccionar origem..." />
                  </SelectTrigger>
                  <SelectContent>
                    {KIGALI_LOCATIONS.map((l) => (
                      <SelectItem key={l} value={l} className="text-xs">
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  🎯 Ponto de Destino
                </Label>
                <Select onValueChange={setToLoc}>
                  <SelectTrigger className="h-8 text-xs border-white/15">
                    <SelectValue placeholder="Seleccionar destino..." />
                  </SelectTrigger>
                  <SelectContent>
                    {KIGALI_LOCATIONS.map((l) => (
                      <SelectItem key={l} value={l} className="text-xs">
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full bg-purple-600 hover:bg-purple-500 text-white text-xs h-8"
                disabled={
                  !fromLoc || !toLoc || fromLoc === toLoc || simulating
                }
                onClick={handleSimulate}
              >
                {simulating ? (
                  <>
                    <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                    A simular com IA…
                  </>
                ) : (
                  <>
                    <Brain className="size-3.5 mr-1.5" />
                    Simular Rota
                  </>
                )}
              </Button>

              {/* Simulation Result */}
              {result && (
                <>
                  <Separator className="opacity-15" />
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold text-purple-300 uppercase tracking-wider flex items-center gap-1">
                      <Zap className="size-2.5" /> Resultado da Simulação
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      {[
                        {
                          icon: Users,
                          label: "Passageiros",
                          value: result.estimatedPassengers,
                        },
                        {
                          icon: DollarSign,
                          label: "Receita/Dia",
                          value: result.dailyRevenue,
                        },
                        {
                          icon: TrendingUp,
                          label: "Investimento",
                          value: result.investment,
                        },
                        {
                          icon: Clock,
                          label: "Break-even",
                          value: result.breakEven,
                        },
                      ].map((m) => (
                        <div
                          key={m.label}
                          className="bg-muted/20 border border-white/8 rounded-lg p-2"
                        >
                          <p className="text-[9px] text-muted-foreground mb-0.5">
                            {m.label}
                          </p>
                          <p className="text-xs font-bold">{m.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Coverage score */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-muted-foreground">
                          Pontuação de Cobertura
                        </span>
                        <span className="font-semibold text-purple-400">
                          {result.coverageScore}%
                        </span>
                      </div>
                      <Progress value={result.coverageScore} className="h-1.5" />
                    </div>

                    {/* Recommendation */}
                    <div className="bg-purple-500/8 border border-purple-500/20 rounded-lg p-2.5">
                      <p className="text-[10px] font-semibold text-purple-300 mb-1">
                        Recomendação da IA
                      </p>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        {result.recommendation}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      className="w-full text-xs h-7 bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
                      <CheckCircle className="size-3 mr-1.5" />
                      Aprovar e criar proposta
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Expansion Roadmap */}
          <Card className="border-white/10 bg-card/60 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Roadmap de Expansão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { q: "Q2 2026", label: "Hub Kimisagara", status: "planned" },
                { q: "Q3 2026", label: "Rota Airport Express", status: "approved" },
                { q: "Q4 2026", label: "KBS Linha 03 extensão", status: "study" },
                { q: "Q1 2027", label: "Hub Norte — Ndera", status: "study" },
              ].map((item) => (
                <div key={item.q} className="flex items-center gap-2.5 py-1">
                  <div
                    className={cn(
                      "size-1.5 rounded-full shrink-0",
                      item.status === "approved"
                        ? "bg-emerald-500"
                        : item.status === "planned"
                        ? "bg-amber-500"
                        : "bg-muted-foreground"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">{item.label}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground">{item.q}</span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[8px] h-4 px-1",
                        item.status === "approved"
                          ? "border-emerald-500/30 text-emerald-400"
                          : item.status === "planned"
                          ? "border-amber-500/30 text-amber-400"
                          : "border-white/20 text-muted-foreground"
                      )}
                    >
                      {item.status === "approved"
                        ? "Aprovado"
                        : item.status === "planned"
                        ? "Planeado"
                        : "Em estudo"}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}