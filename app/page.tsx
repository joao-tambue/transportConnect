"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Map,
  MapRoute,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
  useMap,
} from "@/components/ui/map";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RotateCcw,
  Mountain,
  Route,
  Navigation,
  Bot,
  Send,
  Radio,
  Activity,
  Loader2,
  Clock,
  X,
  Zap,
  ChevronRight,
  Construction,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
// SIMULATED DATA
// ─────────────────────────────────────────────

const KIGALI_CENTER: [number, number] = [30.0619, -1.9441];

const BUS_ROUTES = [
  {
    id: "bus-1",
    name: "KBS Linha 01",
    subtitle: "Nyabugogo ↔ CBD",
    color: "#22c55e",
    type: "bus" as const,
    status: "active",
    frequency: "15 min",
    passengers: "2.4k/dia",
    coordinates: [
      [30.0489, -1.9356],
      [30.052, -1.937],
      [30.055, -1.9385],
      [30.058, -1.94],
      [30.0619, -1.9441],
    ] as [number, number][],
  },
  {
    id: "bus-2",
    name: "KBS Linha 02",
    subtitle: "Remera ↔ Kacyiru",
    color: "#3b82f6",
    type: "bus" as const,
    status: "active",
    frequency: "20 min",
    passengers: "1.8k/dia",
    coordinates: [
      [30.0889, -1.9511],
      [30.08, -1.948],
      [30.072, -1.946],
      [30.063, -1.9417],
    ] as [number, number][],
  },
  {
    id: "moto-1",
    name: "Moto-Táxi Linha A",
    subtitle: "Kimironko ↔ Nyarugenge",
    color: "#f97316",
    type: "moto" as const,
    status: "active",
    frequency: "5 min",
    passengers: "3.1k/dia",
    coordinates: [
      [30.1006, -1.9497],
      [30.09, -1.949],
      [30.08, -1.947],
      [30.07, -1.9456],
      [30.0619, -1.9441],
    ] as [number, number][],
  },
  {
    id: "moto-2",
    name: "Moto-Táxi Linha B",
    subtitle: "Gikondo ↔ Kicukiro",
    color: "#a855f7",
    type: "moto" as const,
    status: "delayed",
    frequency: "8 min",
    passengers: "1.1k/dia",
    coordinates: [
      [30.0619, -1.9441],
      [30.065, -1.955],
      [30.068, -1.962],
      [30.072, -1.97],
    ] as [number, number][],
  },
];

const MAINTENANCE_ROADS = [
  {
    id: "maint-1",
    name: "KN 5 Road",
    description: "Reparação de asfalto — Obras em curso",
    severity: "medium" as const,
    eta: "3 dias",
    coordinates: [
      [30.058, -1.948],
      [30.063, -1.952],
      [30.068, -1.955],
    ] as [number, number][],
  },
  {
    id: "maint-2",
    name: "Rua Gikondo Sul",
    description: "Drenagem de águas pluviais",
    severity: "low" as const,
    eta: "1 dia",
    coordinates: [
      [30.068, -1.96],
      [30.07, -1.963],
      [30.073, -1.966],
    ] as [number, number][],
  },
];

const HUBS = [
  {
    id: "hub-1",
    name: "Terminal Nyabugogo",
    type: "terminal" as const,
    lng: 30.0489,
    lat: -1.9356,
    routes: 12,
    passengers: "2.4k/dia",
  },
  {
    id: "hub-2",
    name: "Hub CBD Kigali",
    type: "hub" as const,
    lng: 30.0619,
    lat: -1.9441,
    routes: 8,
    passengers: "3.1k/dia",
  },
  {
    id: "hub-3",
    name: "Paragem Remera",
    type: "stop" as const,
    lng: 30.0889,
    lat: -1.9511,
    routes: 5,
    passengers: "1.2k/dia",
  },
  {
    id: "hub-4",
    name: "Hub Kimironko",
    type: "hub" as const,
    lng: 30.1006,
    lat: -1.9497,
    routes: 6,
    passengers: "1.8k/dia",
  },
  {
    id: "hub-5",
    name: "Paragem Gikondo",
    type: "stop" as const,
    lng: 30.072,
    lat: -1.97,
    routes: 4,
    passengers: "0.9k/dia",
  },
];

const TRAFFIC_ALERTS = [
  {
    id: "t-1",
    road: "KN 5 Road",
    severity: "high" as const,
    description: "Congestionamento intenso — Rush da manhã",
    duration: "~45 min",
    time: "07:30",
  },
  {
    id: "t-2",
    road: "KG 7 Avenue",
    severity: "medium" as const,
    description: "Fluxo moderado — Obras próximas",
    duration: "~20 min",
    time: "07:45",
  },
  {
    id: "t-3",
    road: "Blvd. de l'Umuganda",
    severity: "low" as const,
    description: "Tráfego fluindo normalmente",
    duration: "~5 min",
    time: "08:00",
  },
];

const AI_PREDICTIONS = [
  {
    id: "pred-1",
    type: "congestion" as const,
    location: "KN 5 Road",
    time: "17:00 – 19:00",
    confidence: 87,
    severity: "high" as const,
    description: "Pico de congestionamento previsto para hora de saída do trabalho",
  },
  {
    id: "pred-2",
    type: "landslide" as const,
    location: "Estrada Kacyiru–Kagugu",
    time: "14:00 – 16:00",
    confidence: 72,
    severity: "medium" as const,
    description: "Risco de deslizamento após chuvas fortes previstas pela meteorologia",
  },
  {
    id: "pred-3",
    type: "congestion" as const,
    location: "Blvd. de l'Umuganda",
    time: "08:00 – 09:30",
    confidence: 91,
    severity: "medium" as const,
    description:
      "Congestionamento moderado durante rush matinal — considere rotas alternativas",
  },
];

const KIGALI_LOCATIONS = [
  { name: "Terminal Nyabugogo", coords: [30.0489, -1.9356] as [number, number] },
  { name: "CBD Kigali", coords: [30.0619, -1.9441] as [number, number] },
  { name: "Remera", coords: [30.0889, -1.9511] as [number, number] },
  { name: "Kimironko", coords: [30.1006, -1.9497] as [number, number] },
  { name: "Kacyiru", coords: [30.063, -1.9417] as [number, number] },
  { name: "Gikondo", coords: [30.072, -1.97] as [number, number] },
];

const INCIDENT_TYPES = [
  { value: "accident", label: "🚗 Acidente" },
  { value: "congestion", label: "🔴 Congestionamento" },
  { value: "maintenance", label: "🔧 Estrada danificada" },
  { value: "flood", label: "🌊 Inundação" },
  { value: "other", label: "📍 Outro" },
];

const BOT_FLOW: Record<string, string> = {
  accident:
    "Entendido — acidente registado. Pode descrever quantos veículos estão envolvidos e se há feridos?",
  congestion:
    "Alerta de congestionamento recebido! Qual o nível de gravidade e em que direção o tráfego está parado?",
  maintenance:
    "Obrigado pelo reporte. Descreva a condição da estrada — buracos, deslizamentos ou obras não sinalizadas?",
  flood:
    "Situação de emergência registada. Qual o nível da água? A estrada está completamente intransitável?",
  other:
    "Por favor, descreva o incidente com o máximo de detalhes — localização, hora aproximada e impacto no tráfego.",
  location_prompt:
    "Perfeito. Qual é a localização exata? Indique o nome da rua, bairro ou ponto de referência próximo.",
  done: "✅ Reporte enviado com sucesso! Vou alertar as autoridades competentes e a comunidade. Obrigado por contribuir para uma melhor mobilidade em Kigali.",
};

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

type Message = {
  id: number;
  role: "bot" | "user";
  content: string;
};

type BotStep = "type" | "details" | "location" | "done";

type ActiveRoute = {
  coords: [number, number][];
  from: string;
  to: string;
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const severityBg = {
  high: "bg-red-500/10 border-red-500/30 text-red-400",
  medium: "bg-amber-500/10 border-amber-500/30 text-amber-400",
  low: "bg-green-500/10 border-green-500/30 text-green-400",
};

const severityLabel = { high: "Alto", medium: "Médio", low: "Baixo" };

const hubTypeEmoji = { terminal: "🚌", hub: "🔄", stop: "🛑" };

async function fetchRouteCoords(
  from: [number, number],
  to: [number, number]
): Promise<[number, number][]> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${from[0]},${from[1]};${to[0]},${to[1]}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.routes?.[0]?.geometry?.coordinates) {
      return data.routes[0].geometry.coordinates as [number, number][];
    }
  } catch {
    /* fallback below */
  }
  return [from, to];
}

function fitMapToCoords(
  map: ReturnType<typeof useMap>["map"],
  coords: [number, number][]
) {
  if (!map || coords.length < 2) return;
  let minLng = coords[0][0],
    maxLng = coords[0][0];
  let minLat = coords[0][1],
    maxLat = coords[0][1];
  for (const [lng, lat] of coords) {
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  }
  (map as any).fitBounds(
    [
      [minLng, minLat],
      [maxLng, maxLat],
    ],
    { padding: 100, duration: 1000 }
  );
}

// ─────────────────────────────────────────────
// ROUTE CARD
// ─────────────────────────────────────────────

function RouteCard({
  onClose,
  onRouteReady,
}: {
  onClose: () => void;
  onRouteReady: (coords: [number, number][], from: string, to: string) => void;
}) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromCoords, setFromCoords] = useState<[number, number] | null>(null);
  const [toCoords, setToCoords] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFromChange = (val: string) => {
    const loc = KIGALI_LOCATIONS.find((l) => l.name === val);
    if (loc) { setFrom(val); setFromCoords(loc.coords); }
  };

  const handleToChange = (val: string) => {
    const loc = KIGALI_LOCATIONS.find((l) => l.name === val);
    if (loc) { setTo(val); setToCoords(loc.coords); }
  };

  const handleTrace = async () => {
    if (!fromCoords || !toCoords || from === to) return;
    setLoading(true);
    const coords = await fetchRouteCoords(fromCoords, toCoords);
    setLoading(false);
    onRouteReady(coords, from, to);
  };

  return (
    <Card className="w-72 shadow-2xl border-white/10 bg-background/95 backdrop-blur">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-1.5">
            <Route className="size-4 text-emerald-500" />
            Traçar Rota
          </CardTitle>
          <Button
            size="icon"
            variant="ghost"
            className="size-6"
            onClick={onClose}
          >
            <X className="size-3.5" />
          </Button>
        </div>
        <CardDescription className="text-xs">
          Selecione origem e destino
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">📍 Origem</Label>
          <Select onValueChange={handleFromChange}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="De onde parte?" />
            </SelectTrigger>
            <SelectContent>
              {KIGALI_LOCATIONS.map((l) => (
                <SelectItem key={l.name} value={l.name} className="text-xs">
                  {l.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">🎯 Destino</Label>
          <Select onValueChange={handleToChange}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Para onde vai?" />
            </SelectTrigger>
            <SelectContent>
              {KIGALI_LOCATIONS.map((l) => (
                <SelectItem key={l.name} value={l.name} className="text-xs">
                  {l.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          size="sm"
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs"
          onClick={handleTrace}
          disabled={!fromCoords || !toCoords || loading || from === to}
        >
          {loading ? (
            <>
              <Loader2 className="size-3.5 mr-1.5 animate-spin" />
              Calculando rota...
            </>
          ) : (
            <>
              <Navigation className="size-3.5 mr-1.5" />
              Traçar Rota
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────
// INFO PANEL (viewport + data tabs)
// ─────────────────────────────────────────────

function InfoPanel({ pitch, bearing }: { pitch: number; bearing: number }) {
  return (
    <div className="space-y-2">
      {/* Viewport */}
      <div className="bg-background/90 rounded-md border border-white/10 px-3 py-2 font-mono text-xs backdrop-blur space-y-0.5">
        <div className="text-muted-foreground">
          Pitch: <span className="text-foreground font-semibold">{pitch}°</span>
        </div>
        <div className="text-muted-foreground">
          Bearing:{" "}
          <span className="text-foreground font-semibold">{bearing}°</span>
        </div>
      </div>

      {/* Data Tabs */}
      <Card className="w-64 shadow-2xl border-white/10 bg-background/95 backdrop-blur">
        <Tabs defaultValue="traffic">
          <CardHeader className="pb-0 pt-3 px-3">
            <TabsList className="w-full h-7 grid grid-cols-4">
              <TabsTrigger value="traffic" className="text-[10px] px-1">
                Tráfego
              </TabsTrigger>
              <TabsTrigger value="maintenance" className="text-[10px] px-1">
                Obras
              </TabsTrigger>
              <TabsTrigger value="hubs" className="text-[10px] px-1">
                Hubs
              </TabsTrigger>
              <TabsTrigger value="ia" className="text-[10px] px-1">
                IA ✦
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent className="p-2">
            <ScrollArea className="h-52">
              {/* ── Traffic ── */}
              <TabsContent value="traffic" className="mt-0 space-y-1.5 pr-1">
                {TRAFFIC_ALERTS.map((alert) => (
                  <div
                    key={alert.id}
                    className="rounded-md border border-white/8 bg-muted/30 p-2 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold leading-none">
                        {alert.road}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] h-4 px-1.5",
                          severityBg[alert.severity]
                        )}
                      >
                        {severityLabel[alert.severity]}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      {alert.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
                      <Clock className="size-2.5" />
                      {alert.time} · {alert.duration}
                    </div>
                  </div>
                ))}
              </TabsContent>

              {/* ── Maintenance ── */}
              <TabsContent
                value="maintenance"
                className="mt-0 space-y-1.5 pr-1"
              >
                {MAINTENANCE_ROADS.map((road) => (
                  <div
                    key={road.id}
                    className="rounded-md border border-white/8 bg-muted/30 p-2 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Construction className="size-2.5 text-amber-400" />
                        <span className="text-[10px] font-semibold">
                          {road.name}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] h-4 px-1.5",
                          severityBg[road.severity]
                        )}
                      >
                        {road.eta}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      {road.description}
                    </p>
                  </div>
                ))}
              </TabsContent>

              {/* ── Hubs ── */}
              <TabsContent value="hubs" className="mt-0 space-y-1.5 pr-1">
                {HUBS.map((hub) => (
                  <div
                    key={hub.id}
                    className="rounded-md border border-white/8 bg-muted/30 p-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs">{hubTypeEmoji[hub.type]}</span>
                        <span className="text-[10px] font-semibold leading-none">
                          {hub.name}
                        </span>
                      </div>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block" />
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-[9px] text-muted-foreground">
                      <span>🚌 {hub.routes} rotas</span>
                      <span>👥 {hub.passengers}</span>
                    </div>
                  </div>
                ))}
              </TabsContent>

              {/* ── IA Predictions ── */}
              <TabsContent value="ia" className="mt-0 space-y-1.5 pr-1">
                <div className="flex items-center gap-1 text-[9px] text-muted-foreground mb-1">
                  <Zap className="size-2.5 text-emerald-400" />
                  Previsões para as próximas 24h
                </div>
                {AI_PREDICTIONS.map((pred) => (
                  <div
                    key={pred.id}
                    className="rounded-md border border-white/8 bg-muted/30 p-2 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold">
                        {pred.location}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] h-4 px-1.5",
                          severityBg[pred.severity]
                        )}
                      >
                        {pred.confidence}% conf.
                      </Badge>
                    </div>
                    <p className="text-[9px] text-muted-foreground leading-tight">
                      {pred.description}
                    </p>
                    <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                      <Clock className="size-2.5" />
                      {pred.time}
                    </div>
                  </div>
                ))}
              </TabsContent>
            </ScrollArea>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAP CONTROLLER (must be child of <Map>)
// ─────────────────────────────────────────────

function MapController() {
  const { map, isLoaded } = useMap();
  const [pitch, setPitch] = useState(0);
  const [bearing, setBearing] = useState(0);
  const [showRouteCard, setShowRouteCard] = useState(false);
  const [activeRoute, setActiveRoute] = useState<ActiveRoute | null>(null);

  useEffect(() => {
    if (!map || !isLoaded) return;
    const handleMove = () => {
      setPitch(Math.round(map.getPitch()));
      setBearing(Math.round(map.getBearing()));
    };
    map.on("move", handleMove);
    return () => { map.off("move", handleMove); };
  }, [map, isLoaded]);

  const handle3DView = () =>
    map?.easeTo({ pitch: 60, bearing: -20, duration: 1000 });

  const handleReset = () => {
    map?.easeTo({ pitch: 0, bearing: 0, duration: 1000 });
    setActiveRoute(null);
  };

  const handleRouteReady = useCallback(
    (coords: [number, number][], from: string, to: string) => {
      setActiveRoute({ coords, from, to });
      setShowRouteCard(false);
      fitMapToCoords(map, coords);
    },
    [map]
  );

  return (
    <>
      {/* ── Bus & Moto Routes ── */}
      {BUS_ROUTES.map((route) => (
        <MapRoute
          key={route.id}
          coordinates={route.coordinates}
          color={route.color}
          width={3}
          opacity={0.75}
          dashArray={route.type === "moto" ? [2, 2] : undefined}
        />
      ))}

      {/* ── Maintenance Roads ── */}
      {MAINTENANCE_ROADS.map((road) => (
        <MapRoute
          key={road.id}
          coordinates={road.coordinates}
          color="#f59e0b"
          width={4}
          opacity={0.85}
          dashArray={[4, 4]}
        />
      ))}

      {/* ── Active User Route ── */}
      {activeRoute && activeRoute.coords.length >= 2 && (
        <MapRoute
          coordinates={activeRoute.coords}
          color="#22c55e"
          width={5}
          opacity={0.95}
        />
      )}

      {/* ── Hub Markers ── */}
      {HUBS.map((hub) => (
        <MapMarker key={hub.id} longitude={hub.lng} latitude={hub.lat}>
          <MarkerContent>
            <div
              className={cn(
                "flex items-center justify-center rounded-full border-2 border-white text-sm shadow-lg cursor-pointer transition-transform hover:scale-110",
                hub.type === "terminal"
                  ? "bg-emerald-600 size-8"
                  : hub.type === "hub"
                  ? "bg-blue-600 size-6"
                  : "bg-slate-600 size-5"
              )}
            >
              {hub.type === "terminal" ? "🚌" : hub.type === "hub" ? "🔄" : "·"}
            </div>
          </MarkerContent>
          <MarkerTooltip>
            <div className="text-xs font-semibold">{hub.name}</div>
            <div className="text-[10px] opacity-70 mt-0.5">
              {hub.routes} rotas · {hub.passengers}
            </div>
          </MarkerTooltip>
        </MapMarker>
      ))}

      {/* ── Route A/B Markers ── */}
      {activeRoute && activeRoute.coords.length >= 2 && (
        <>
          <MapMarker
            longitude={activeRoute.coords[0][0]}
            latitude={activeRoute.coords[0][1]}
          >
            <MarkerContent>
              <div className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded-full border-2 border-white font-bold shadow-md">
                A
              </div>
            </MarkerContent>
          </MapMarker>
          <MapMarker
            longitude={
              activeRoute.coords[activeRoute.coords.length - 1][0]
            }
            latitude={
              activeRoute.coords[activeRoute.coords.length - 1][1]
            }
          >
            <MarkerContent>
              <div className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full border-2 border-white font-bold shadow-md">
                B
              </div>
            </MarkerContent>
          </MapMarker>
        </>
      )}

      {/* ── Control Panel UI ── */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {/* Action buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" variant="secondary" onClick={handle3DView}>
            <Mountain className="mr-1.5 size-4" />
            Vista 3D
          </Button>
          <Button size="sm" variant="secondary" onClick={handleReset}>
            <RotateCcw className="mr-1.5 size-4" />
            Reset
          </Button>
          <Button
            size="sm"
            onClick={() => setShowRouteCard((v) => !v)}
            className={cn(
              showRouteCard
                ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            <Route className="mr-1.5 size-4" />
            Ver Rota
          </Button>
        </div>

        {/* Route card */}
        {showRouteCard && (
          <RouteCard
            onClose={() => setShowRouteCard(false)}
            onRouteReady={handleRouteReady}
          />
        )}

        {/* Active route info chip */}
        {activeRoute && (
          <Card className="border-white/10 bg-background/95 backdrop-blur">
            <CardContent className="p-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[10px] min-w-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="font-medium truncate">{activeRoute.from}</span>
                  <ChevronRight className="size-3 text-muted-foreground shrink-0" />
                  <span className="font-medium truncate">{activeRoute.to}</span>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-5 shrink-0"
                  onClick={() => setActiveRoute(null)}
                >
                  <X className="size-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info panel */}
        <InfoPanel pitch={pitch} bearing={bearing} />
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// MAP LEGEND
// ─────────────────────────────────────────────

function MapLegend() {
  return (
    <Card className="absolute bottom-12 left-3 z-10 border-white/10 bg-background/95 backdrop-blur w-48">
      <CardContent className="p-2.5 space-y-1.5">
        <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">
          Legenda
        </p>
        {BUS_ROUTES.map((r) => (
          <div key={r.id} className="flex items-center gap-2">
            <svg width="20" height="6">
              <line
                x1="0"
                y1="3"
                x2="20"
                y2="3"
                stroke={r.color}
                strokeWidth="3"
                strokeDasharray={r.type === "moto" ? "3,3" : undefined}
              />
            </svg>
            <span className="text-[10px] text-muted-foreground">{r.name}</span>
          </div>
        ))}
        <Separator className="opacity-20 my-1" />
        <div className="flex items-center gap-2">
          <svg width="20" height="6">
            <line
              x1="0" y1="3" x2="20" y2="3"
              stroke="#f59e0b" strokeWidth="3" strokeDasharray="4,4"
            />
          </svg>
          <span className="text-[10px] text-muted-foreground">Em manutenção</span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="20" height="6">
            <line x1="0" y1="3" x2="20" y2="3" stroke="#22c55e" strokeWidth="4" />
          </svg>
          <span className="text-[10px] text-muted-foreground">Rota traçada</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────
// REPORT MODAL (Bot Chat Interface)
// ─────────────────────────────────────────────

function ReportModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const initialMessages: Message[] = [
    {
      id: 1,
      role: "bot",
      content:
        "Olá! Sou o assistente TransportConnect 🤖\n\nEstou aqui para recolher reportes de incidentes em Kigali. Selecione o tipo de ocorrência abaixo para começar.",
    },
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [step, setStep] = useState<BotStep>("type");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const addBotMessage = (content: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: "bot", content },
      ]);
    }, 1200);
  };

  const addUserMessage = (content: string) => {
    setMessages((prev) => [...prev, { id: Date.now(), role: "user", content }]);
  };

  const handleIncidentSelect = (type: string) => {
    const label = INCIDENT_TYPES.find((t) => t.value === type)?.label ?? type;
    addUserMessage(label);
    setStep("details");
    addBotMessage(BOT_FLOW[type] ?? BOT_FLOW["other"]);
    setTimeout(() => inputRef.current?.focus(), 1400);
  };

  const handleSend = () => {
    const msg = inputValue.trim();
    if (!msg) return;
    setInputValue("");
    addUserMessage(msg);

    if (step === "details") {
      setStep("location");
      addBotMessage(BOT_FLOW["location_prompt"]);
    } else if (step === "location") {
      setStep("done");
      addBotMessage(BOT_FLOW["done"]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setMessages(initialMessages);
      setStep("type");
      setInputValue("");
      setIsTyping(false);
    }, 300);
  };

  const handleNewReport = () => {
    addUserMessage("Quero reportar outro incidente");
    setStep("type");
    addBotMessage(
      "Claro! Selecione o tipo de incidente para o novo reporte. 👇"
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-lg w-full p-0 gap-0 overflow-hidden border-white/10 backdrop-blur-xl">
        {/* Header */}
        <DialogHeader className="px-4 py-3 border-b border-white/10 bg-emerald-600/10">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-emerald-600 flex items-center justify-center shadow-md">
              <Bot className="size-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-sm font-semibold">
                Assistente de Reporte
              </DialogTitle>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                TransportConnect IA · Online
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Messages */}
        <div className="h-72 overflow-y-auto px-4 py-3 space-y-3 scroll-smooth">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-2 items-end",
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              {msg.role === "bot" && (
                <Avatar className="size-7 shrink-0">
                  <AvatarFallback className="bg-emerald-600 text-white text-[10px] font-bold">
                    TC
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-3 py-2 text-xs leading-relaxed whitespace-pre-line",
                  msg.role === "bot"
                    ? "bg-muted text-foreground rounded-tl-none"
                    : "bg-emerald-600 text-white rounded-tr-none"
                )}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-2 items-end">
              <Avatar className="size-7 shrink-0">
                <AvatarFallback className="bg-emerald-600 text-white text-[10px] font-bold">
                  TC
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-2xl rounded-tl-none px-3 py-2.5 flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <Separator className="opacity-20" />

        {/* Incident Type Buttons */}
        {(step === "type") && !isTyping && (
          <div className="px-4 py-3 space-y-2">
            <p className="text-[10px] text-muted-foreground">
              Selecionar tipo de incidente:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {INCIDENT_TYPES.map((type) => (
                <Button
                  key={type.value}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 border-white/15 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-colors"
                  onClick={() => handleIncidentSelect(type.value)}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Text Input */}
        {(step === "details" || step === "location") && (
          <div className="px-4 py-3">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  step === "details"
                    ? "Descreva o incidente em detalhe..."
                    : "Indique a localização exacta..."
                }
                className="text-xs h-9 border-white/10 bg-muted/50 focus-visible:ring-emerald-500/50"
                disabled={isTyping}
                autoFocus
              />
              <Button
                size="icon"
                className="size-9 bg-emerald-600 hover:bg-emerald-500 shrink-0"
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
              >
                <Send className="size-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* Done Actions */}
        {step === "done" && !isTyping && (
          <div className="px-4 py-3 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs border-white/15"
              onClick={handleNewReport}
            >
              + Novo reporte
            </Button>
            <Button
              size="sm"
              className="flex-1 text-xs bg-emerald-600 hover:bg-emerald-500"
              onClick={handleClose}
            >
              Fechar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────

export default function Home() {
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <>
      <div className="h-screen w-full relative overflow-hidden">
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
          <div className="flex items-center justify-between px-4 py-2.5">
            <div></div>
            {/* Brand */}
            {/* <div className="pointer-events-auto flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-emerald-600 flex items-center justify-center shadow-md">
                <Navigation className="size-4 text-white" />
              </div>
              <span className="text-sm font-bold tracking-tight">
                TransportConnect
              </span>
              <Badge
                variant="outline"
                className="text-[10px] border-emerald-500/40 text-emerald-400 h-5"
              >
                Rwanda · Beta
              </Badge>
            </div> */}

            {/* Report button */}
            <Button
              size="sm"
              className="pointer-events-auto bg-red-600 hover:bg-red-500 text-white gap-1.5 shadow-lg"
              onClick={() => setReportOpen(true)}
            >
              <Radio className="size-3.5 animate-pulse" />
              Reportar Incidente
            </Button>
          </div>
        </div>

        {/* Map */}
        <Map center={KIGALI_CENTER} zoom={13}>
          <MapController />
          <MapLegend />
        </Map>
      </div>

      {/* Report Modal */}
      <ReportModal open={reportOpen} onClose={() => setReportOpen(false)} />
    </>
  );
}