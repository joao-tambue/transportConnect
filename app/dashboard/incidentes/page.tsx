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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Wrench,
  Eye,
  Clock,
  MapPin,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { INCIDENTS } from "@/lib/dashboard-data";

// ── Types ──
type IncidentStatus = "pending" | "validated" | "actioned" | "dismissed";
type Incident = (typeof INCIDENTS)[0];

// ── Helpers ──
const TYPE_CONFIG: Record<
  string,
  { label: string; emoji: string; color: string }
> = {
  accident: {
    label: "Acidente",
    emoji: "🚗",
    color: "border-red-500/30 text-red-400 bg-red-500/10",
  },
  congestion: {
    label: "Congestionamento",
    emoji: "🔴",
    color: "border-amber-500/30 text-amber-400 bg-amber-500/10",
  },
  maintenance: {
    label: "Estrada Danificada",
    emoji: "🔧",
    color: "border-orange-500/30 text-orange-400 bg-orange-500/10",
  },
  flood: {
    label: "Inundação",
    emoji: "🌊",
    color: "border-blue-500/30 text-blue-400 bg-blue-500/10",
  },
  other: {
    label: "Outro",
    emoji: "📍",
    color: "border-white/20 text-muted-foreground bg-muted/20",
  },
};

const SEVERITY_CONFIG: Record<string, { label: string; style: string }> = {
  high: { label: "Alta", style: "border-red-500/30 text-red-400" },
  medium: { label: "Média", style: "border-amber-500/30 text-amber-400" },
  low: { label: "Baixa", style: "border-emerald-500/30 text-emerald-400" },
};

const STATUS_CONFIG: Record<
  IncidentStatus,
  { label: string; style: string; icon: React.ElementType }
> = {
  pending: {
    label: "Pendente",
    style: "border-amber-500/30 text-amber-400",
    icon: Clock,
  },
  validated: {
    label: "Validado",
    style: "border-blue-500/30 text-blue-400",
    icon: CheckCircle,
  },
  actioned: {
    label: "Em Acção",
    style: "border-emerald-500/30 text-emerald-400",
    icon: Wrench,
  },
  dismissed: {
    label: "Descartado",
    style: "border-white/20 text-muted-foreground",
    icon: XCircle,
  },
};

// ── Summary stat ──
function StatCard({
  label,
  value,
  color,
  icon: Icon,
}: {
  label: string;
  value: number;
  color: string;
  icon: React.ElementType;
}) {
  return (
    <Card className="border-white/10 bg-card/60 backdrop-blur">
      <CardContent className="p-4 flex items-center gap-3">
        <div className={cn("size-8 rounded-lg flex items-center justify-center", color)}>
          <Icon className="size-4" />
        </div>
        <div>
          <p className="text-xl font-bold">{value}</p>
          <p className="text-[11px] text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Incident row (expandable) ──
function IncidentRow({
  incident,
  onAction,
}: {
  incident: Incident & { status: IncidentStatus };
  onAction: (id: string, action: IncidentStatus) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const type = TYPE_CONFIG[incident.type];
  const sev = SEVERITY_CONFIG[incident.severity];
  const status = STATUS_CONFIG[incident.status];
  const StatusIcon = status.icon;

  return (
    <>
      <TableRow
        className="border-white/8 cursor-pointer hover:bg-muted/20 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <TableCell className="pl-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{type.emoji}</span>
            <span className="text-xs font-mono text-muted-foreground">
              {incident.id}
            </span>
          </div>
        </TableCell>
        <TableCell className="py-3">
          <Badge variant="outline" className={cn("text-[9px] h-5 px-1.5", type.color)}>
            {type.label}
          </Badge>
        </TableCell>
        <TableCell className="py-3">
          <div className="flex items-center gap-1 text-xs">
            <MapPin className="size-2.5 text-muted-foreground" />
            {incident.road}
          </div>
        </TableCell>
        <TableCell className="py-3">
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="size-2.5" />
            {incident.time}
          </div>
        </TableCell>
        <TableCell className="py-3">
          <Badge
            variant="outline"
            className={cn("text-[9px] h-4 px-1.5", sev.style)}
          >
            {sev.label}
          </Badge>
        </TableCell>
        <TableCell className="py-3">
          <Badge
            variant="outline"
            className={cn("text-[9px] h-4 px-1.5 flex items-center gap-1 w-fit", status.style)}
          >
            <StatusIcon className="size-2.5" />
            {status.label}
          </Badge>
        </TableCell>
        <TableCell className="py-3 pr-4">
          {expanded ? (
            <ChevronUp className="size-3.5 text-muted-foreground" />
          ) : (
            <ChevronDown className="size-3.5 text-muted-foreground" />
          )}
        </TableCell>
      </TableRow>

      {/* Expanded detail */}
      {expanded && (
        <TableRow className="border-white/8 bg-muted/10">
          <TableCell colSpan={7} className="px-4 py-3">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MessageSquare className="size-3.5 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="text-foreground font-medium">Descrição: </span>
                  {incident.description}
                </p>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <Eye className="size-3" />
                Reportado por: <span className="text-foreground">{incident.reporter}</span>
                <Separator orientation="vertical" className="h-3 opacity-30" />
                <Clock className="size-3" />
                {incident.date} às {incident.time}
              </div>

              {/* Actions */}
              {incident.status === "pending" && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="text-xs h-7 bg-emerald-600 hover:bg-emerald-500 text-white"
                    onClick={(e) => { e.stopPropagation(); onAction(incident.id, "validated"); }}
                  >
                    <CheckCircle className="size-3 mr-1.5" />
                    Validar
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs h-7 bg-blue-600 hover:bg-blue-500 text-white"
                    onClick={(e) => { e.stopPropagation(); onAction(incident.id, "actioned"); }}
                  >
                    <Wrench className="size-3 mr-1.5" />
                    Acionar Manutenção
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7 border-white/15"
                    onClick={(e) => { e.stopPropagation(); onAction(incident.id, "dismissed"); }}
                  >
                    <XCircle className="size-3 mr-1.5" />
                    Descartar
                  </Button>
                </div>
              )}
              {incident.status === "validated" && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="text-xs h-7 bg-blue-600 hover:bg-blue-500 text-white"
                    onClick={(e) => { e.stopPropagation(); onAction(incident.id, "actioned"); }}
                  >
                    <Wrench className="size-3 mr-1.5" />
                    Acionar Manutenção
                  </Button>
                </div>
              )}
              {(incident.status === "actioned" || incident.status === "dismissed") && (
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <CheckCircle className="size-3 text-emerald-400" />
                  Reporte processado. Nenhuma acção adicional necessária.
                </div>
              )}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

// ── Page ──
export default function IncidentesPage() {
  const [incidents, setIncidents] = useState(
    INCIDENTS.map((i) => ({ ...i, status: i.status as IncidentStatus }))
  );

  const handleAction = (id: string, newStatus: IncidentStatus) => {
    setIncidents((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
    );
  };

  const byStatus = (status: IncidentStatus | "all") =>
    status === "all"
      ? incidents
      : incidents.filter((i) => i.status === status);

  const counts = {
    all: incidents.length,
    pending: incidents.filter((i) => i.status === "pending").length,
    validated: incidents.filter((i) => i.status === "validated").length,
    actioned: incidents.filter((i) => i.status === "actioned").length,
    dismissed: incidents.filter((i) => i.status === "dismissed").length,
  };

  return (
    <div className="p-6 space-y-6 min-h-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-red-500/15 flex items-center justify-center">
          <AlertTriangle className="size-5 text-red-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Gestão de Incidentes</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Reportes da comunidade — validar, descartar ou acionar resposta
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard label="Pendentes" value={counts.pending} color="bg-amber-500/15 text-amber-400" icon={Clock} />
        <StatCard label="Validados" value={counts.validated} color="bg-blue-500/15 text-blue-400" icon={CheckCircle} />
        <StatCard label="Em Acção" value={counts.actioned} color="bg-emerald-500/15 text-emerald-400" icon={Wrench} />
        <StatCard label="Descartados" value={counts.dismissed} color="bg-muted text-muted-foreground" icon={XCircle} />
      </div>

      {/* Table with tabs */}
      <Card className="border-white/10 bg-card/60 backdrop-blur">
        <CardHeader className="pb-0">
          <CardTitle className="text-sm">Todos os Reportes</CardTitle>
          <CardDescription className="text-xs">
            Clique em cada linha para expandir detalhes e tomar acção
          </CardDescription>
        </CardHeader>

        <Tabs defaultValue="all">
          <div className="px-4 pt-3 pb-0">
            <TabsList className="border border-white/10 bg-muted/20 h-8">
              <TabsTrigger value="all" className="text-xs h-6 px-3">
                Todos ({counts.all})
              </TabsTrigger>
              <TabsTrigger value="pending" className="text-xs h-6 px-3">
                Pendentes ({counts.pending})
              </TabsTrigger>
              <TabsTrigger value="validated" className="text-xs h-6 px-3">
                Validados ({counts.validated})
              </TabsTrigger>
              <TabsTrigger value="actioned" className="text-xs h-6 px-3">
                Em Acção ({counts.actioned})
              </TabsTrigger>
              <TabsTrigger value="dismissed" className="text-xs h-6 px-3">
                Descartados ({counts.dismissed})
              </TabsTrigger>
            </TabsList>
          </div>

          {(
            ["all", "pending", "validated", "actioned", "dismissed"] as const
          ).map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-0">
              <ScrollArea className="h-[420px]">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/8 hover:bg-transparent">
                      <TableHead className="text-[10px] text-muted-foreground pl-4 w-[90px]">ID</TableHead>
                      <TableHead className="text-[10px] text-muted-foreground w-[130px]">Tipo</TableHead>
                      <TableHead className="text-[10px] text-muted-foreground">Via</TableHead>
                      <TableHead className="text-[10px] text-muted-foreground w-[70px]">Hora</TableHead>
                      <TableHead className="text-[10px] text-muted-foreground w-[80px]">Gravidade</TableHead>
                      <TableHead className="text-[10px] text-muted-foreground w-[100px]">Estado</TableHead>
                      <TableHead className="w-[30px]" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {byStatus(tab === "all" ? "all" : (tab as IncidentStatus)).length === 0 ? (
                      <TableRow className="border-white/8">
                        <TableCell
                          colSpan={7}
                          className="text-center text-xs text-muted-foreground py-12"
                        >
                          Nenhum reporte nesta categoria
                        </TableCell>
                      </TableRow>
                    ) : (
                      byStatus(tab === "all" ? "all" : (tab as IncidentStatus)).map(
                        (incident) => (
                          <IncidentRow
                            key={incident.id}
                            incident={incident}
                            onAction={handleAction}
                          />
                        )
                      )
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </Card>
    </div>
  );
}