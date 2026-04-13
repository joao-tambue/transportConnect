"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Navigation,
  Shield,
  Building2,
  Landmark,
  ChevronRight,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ENTITIES = [
  {
    id: "rtda",
    name: "Rwanda Transport Development Agency",
    short: "RTDA",
    icon: Shield,
    description: "Administrador do sistema — acesso total a todos os dados",
    color: "emerald",
    email_hint: "nome@rtda.gov.rw",
  },
  {
    id: "kigali",
    name: "Município de Kigali",
    short: "MK",
    icon: Building2,
    description: "Gestão operacional e incidentes da região de Kigali",
    color: "blue",
    email_hint: "nome@kigalicity.gov.rw",
  },
  {
    id: "mininfra",
    name: "MININFRA",
    short: "INFRA",
    icon: Landmark,
    description: "Planeamento estratégico e infraestrutura nacional",
    color: "purple",
    email_hint: "nome@mininfra.gov.rw",
  },
];

const ICON_COLORS: Record<string, string> = {
  emerald: "bg-emerald-600",
  blue: "bg-blue-600",
  purple: "bg-purple-600",
};

const BORDER_ACTIVE: Record<string, string> = {
  emerald: "border-emerald-500/60 bg-emerald-500/8",
  blue: "border-blue-500/60 bg-blue-500/8",
  purple: "border-purple-500/60 bg-purple-500/8",
};

const DOT_COLORS: Record<string, string> = {
  emerald: "bg-emerald-500",
  blue: "bg-blue-500",
  purple: "bg-purple-500",
};

export default function LoginPage() {
  const router = useRouter();
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [step, setStep] = useState<"entity" | "credentials">("entity");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const entity = ENTITIES.find((e) => e.id === selectedEntity);

  const handleContinue = () => {
    if (selectedEntity) {
      setStep("credentials");
      setEmail("");
      setPassword("");
    }
  };

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1600));
    if (typeof window !== "undefined") {
      localStorage.setItem("tc_entity", selectedEntity!);
      localStorage.setItem("tc_user", email);
    }
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/40 via-background to-background" />
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-emerald-500/4 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/4 rounded-full blur-3xl pointer-events-none" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 w-full max-w-md px-4 py-8">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-500/20">
            <Navigation className="size-6 text-white" />
          </div>
          <div className="text-center">
            <h1 className="font-bold text-xl leading-tight">TransportConnect Rwanda</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Painel de Gestão Institucional
            </p>
          </div>
        </div>

        {/* Step: Entity Selection */}
        {step === "entity" && (
          <Card className="border-white/10 bg-card/70 backdrop-blur-xl shadow-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Selecionar Entidade</CardTitle>
              <CardDescription className="text-xs">
                Escolha a instituição à qual pertence para continuar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {ENTITIES.map((e) => {
                const Icon = e.icon;
                const isSelected = selectedEntity === e.id;
                return (
                  <button
                    key={e.id}
                    onClick={() => setSelectedEntity(e.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-150",
                      isSelected
                        ? BORDER_ACTIVE[e.color]
                        : "border-white/10 bg-muted/20 hover:border-white/20 hover:bg-muted/30"
                    )}
                  >
                    <div
                      className={cn(
                        "size-9 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                        isSelected ? ICON_COLORS[e.color] : "bg-muted"
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-4 transition-colors",
                          isSelected ? "text-white" : "text-muted-foreground"
                        )}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold leading-tight">{e.short}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight line-clamp-1">
                        {e.description}
                      </p>
                    </div>
                    {isSelected && (
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full shrink-0",
                          DOT_COLORS[e.color]
                        )}
                      />
                    )}
                  </button>
                );
              })}

              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white mt-1"
                disabled={!selectedEntity}
                onClick={handleContinue}
              >
                Continuar
                <ChevronRight className="size-4 ml-1" />
              </Button>

              <Separator className="opacity-20" />
              <p className="text-center text-[11px] text-muted-foreground">
                Acesso restrito a entidades autorizadas pelo{" "}
                <span className="text-emerald-400">MININFRA</span>
              </p>
            </CardContent>
          </Card>
        )}

        {/* Step: Credentials */}
        {step === "credentials" && entity && (
          <Card className="border-white/10 bg-card/70 backdrop-blur-xl shadow-2xl">
            <CardHeader className="pb-4">
              <button
                onClick={() => setStep("entity")}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3 -mt-1"
              >
                <ArrowLeft className="size-3" />
                Voltar
              </button>
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={cn(
                    "size-6 rounded flex items-center justify-center",
                    ICON_COLORS[entity.color]
                  )}
                >
                  <entity.icon className="size-3.5 text-white" />
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px] h-5 border-white/20"
                >
                  {entity.short}
                </Badge>
              </div>
              <CardTitle className="text-base">Credenciais de Acesso</CardTitle>
              <CardDescription className="text-xs">
                {entity.name}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Email institucional
                </Label>
                <Input
                  type="email"
                  placeholder={entity.email_hint}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-white/10 bg-muted/30 text-sm h-9"
                  disabled={loading}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Palavra-passe
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && !loading && handleLogin()
                    }
                    className="border-white/10 bg-muted/30 text-sm h-9 pr-10"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="size-3.5" />
                    ) : (
                      <Eye className="size-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                className={cn(
                  "w-full text-white",
                  ICON_COLORS[entity.color],
                  entity.color === "emerald"
                    ? "hover:bg-emerald-500"
                    : entity.color === "blue"
                    ? "hover:bg-blue-500"
                    : "hover:bg-purple-500"
                )}
                onClick={handleLogin}
                disabled={!email || !password || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    A autenticar…
                  </>
                ) : (
                  "Entrar no Painel"
                )}
              </Button>

              <p className="text-center text-[11px] text-muted-foreground">
                Problemas de acesso? Contacte o administrador de sistema.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}