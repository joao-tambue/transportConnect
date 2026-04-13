"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  BarChart3,
  Brain,
  Wallet,
  AlertTriangle,
  LogOut,
  Map,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ENTITIES } from "@/lib/dashboard-data";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Operacional", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/planning", label: "Planeamento IA", icon: Brain },
  { href: "/dashboard/financeiro", label: "Financeiro", icon: Wallet },
  { href: "/dashboard/incidentes", label: "Incidentes", icon: AlertTriangle, badge: 3 },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [entityKey, setEntityKey] = useState("rtda");
  const [userEmail, setUserEmail] = useState("admin@rtda.gov.rw");

  useEffect(() => {
    setEntityKey(localStorage.getItem("tc_entity") ?? "rtda");
    setUserEmail(localStorage.getItem("tc_user") ?? "admin@rtda.gov.rw");
  }, []);

  const entityInfo = ENTITIES[entityKey as keyof typeof ENTITIES] ?? ENTITIES.rtda;

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <aside className="w-64 h-screen flex flex-col border-r bg-background">
      {/* BRAND */}
      <div className="px-4 py-4">
        <h1 className="text-sm font-bold">TransportConnect</h1>
        <p className="text-xs text-muted-foreground">Painel de Gestão</p>
      </div>

      <Separator />

      {/* ENTITY */}
      <div className="p-3">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
          <p className="text-xs font-semibold text-emerald-400">
            {entityInfo.short}
          </p>
          <p className="text-xs text-muted-foreground">
            {entityInfo.name}
          </p>
        </div>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-2 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer",
                  isActive
                    ? "bg-emerald-600 text-white"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <Icon className="size-4" />
                <span className="flex-1">{item.label}</span>

                {item.badge && !isActive && (
                  <Badge className="bg-red-500 text-white text-xs">
                    {item.badge}
                  </Badge>
                )}
              </div>
            </Link>
          );
        })}

        <Separator className="my-2" />

        <Link href="/">
          <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-muted rounded-lg">
            <Map className="size-4" />
            Mapa Público
          </div>
        </Link>
      </nav>

      {/* USER */}
      <div className="p-3 border-t">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback>
              {userEmail.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-xs">
            <p className="font-medium truncate">{userEmail}</p>
            <p className="text-muted-foreground">{entityInfo.short}</p>
          </div>

          <button onClick={handleLogout}>
            <LogOut className="size-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </aside>
  );
}