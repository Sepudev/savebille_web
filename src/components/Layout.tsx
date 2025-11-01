import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Profile } from "@/types";
import {
  SignOut,
  FolderOpen,
  House,
  MagnifyingGlass,
  Receipt,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [lastSignIn, setLastSignIn] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setLastSignIn(user.last_sign_in_at || null);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex min-h-screen bg-background">
      <div
        className={`sticky top-0 h-screen border-r border-border flex flex-col transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? "w-[72px]" : "w-64"
        }`}
      >
        <div className="h-20 flex items-center justify-between px-4 pt-4">
          <div
            className={`flex items-center gap-3 transition-opacity duration-200 ${
              sidebarCollapsed ? "opacity-0 w-0" : "opacity-100"
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-primary/90 flex items-center justify-center shadow-sm">
              <span className="text-lg font-bold text-primary-foreground">
                S
              </span>
            </div>
            <div className={`${sidebarCollapsed ? "hidden" : "block"}`}>
              <h1 className="text-sm font-semibold">Savebille</h1>
              <p className="text-xs text-muted-foreground">Expense Tracker</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="h-8 w-8 shrink-0"
          >
            {sidebarCollapsed ? (
              <CaretRight className="h-4 w-4" weight="bold" />
            ) : (
              <CaretLeft className="h-4 w-4" weight="bold" />
            )}
          </Button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <Button
            variant="ghost"
            className={`w-full relative h-11 rounded-xl transition-all duration-200 group ${
              sidebarCollapsed ? "justify-center px-3" : "justify-start px-4"
            } ${
              location.pathname === "/"
                ? "bg-primary/10 text-primary shadow-sm"
                : "hover:bg-muted/50"
            }`}
            onClick={() => navigate("/")}
          >
            {location.pathname === "/" && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full group-hover:opacity-0 transition-opacity" />
            )}
            <House
              className={sidebarCollapsed ? "h-8 w-8" : "h-5 w-5"}
              weight={location.pathname === "/" ? "fill" : "regular"}
            />
            {!sidebarCollapsed && <span className="ml-3">Inicio</span>}
          </Button>
          <Button
            variant="ghost"
            className={`w-full relative h-11 rounded-xl transition-all duration-200 group ${
              sidebarCollapsed ? "justify-center px-3" : "justify-start px-4"
            } ${
              location.pathname === "/categories"
                ? "bg-primary/10 text-primary shadow-sm"
                : "hover:bg-muted/50"
            }`}
            onClick={() => navigate("/categories")}
          >
            {location.pathname === "/categories" && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full group-hover:opacity-0 transition-opacity" />
            )}
            <FolderOpen
              className={sidebarCollapsed ? "h-8 w-8" : "h-5 w-5"}
              weight={location.pathname === "/categories" ? "fill" : "regular"}
            />
            {!sidebarCollapsed && <span className="ml-3">Categorías</span>}
          </Button>
          <Button
            variant="ghost"
            className={`w-full relative h-11 rounded-xl transition-all duration-200 group ${
              sidebarCollapsed ? "justify-center px-3" : "justify-start px-4"
            } ${
              location.pathname === "/transactions"
                ? "bg-primary/10 text-primary shadow-sm"
                : "hover:bg-muted/50"
            }`}
            onClick={() => navigate("/transactions")}
          >
            {location.pathname === "/transactions" && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full group-hover:opacity-0 transition-opacity" />
            )}
            <Receipt
              className={sidebarCollapsed ? "h-8 w-8" : "h-5 w-5"}
              weight={
                location.pathname === "/transactions" ? "fill" : "regular"
              }
            />
            {!sidebarCollapsed && <span className="ml-3">Transacciones</span>}
          </Button>
        </nav>

        <div className="p-3 pb-4">
          <Button
            variant="ghost"
            className={`w-full h-11 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 ${
              sidebarCollapsed ? "justify-center px-2" : "justify-start px-4"
            }`}
            onClick={handleSignOut}
          >
            <SignOut
              className={sidebarCollapsed ? "h-5 w-5" : "h-4 w-4"}
              weight="bold"
            />
            {!sidebarCollapsed && <span className="ml-2">Cerrar Sesión</span>}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-40 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <MagnifyingGlass
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  weight="bold"
                />
                <Input placeholder="Buscar transacciones..." className="pl-9" />
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {profile?.full_name
                        ? profile.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : profile?.email?.slice(0, 2).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <div className="flex flex-col space-y-3 p-4">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold">
                      {profile?.full_name || "Usuario"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {profile?.email}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2 pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Miembro desde
                      </span>
                      <span className="text-xs font-medium">
                        {profile?.created_at
                          ? new Date(profile.created_at).toLocaleDateString(
                              "es-CO",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Última sesión
                      </span>
                      <span className="text-xs font-medium">
                        {lastSignIn
                          ? new Date(lastSignIn).toLocaleString("es-CO", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
};
