import { useState, useEffect } from "react";
import React from "react";
import { supabase } from "@/lib/supabase";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { GlobalCategory } from "@/types";
import type { Category } from "@/types";
import { Plus, CalendarBlank } from "@phosphor-icons/react";
import { renderIcon } from "@/utils/general/iconRenderer";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface AddTransactionDrawerProps {
  onTransactionAdded: () => void;
}

export const AddTransactionDrawer: React.FC<AddTransactionDrawerProps> = ({
  onTransactionAdded,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [globalCategories, setGlobalCategories] = useState<GlobalCategory[]>(
    []
  );
  const [userCategories, setUserCategories] = useState<Category[]>([]);
  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    description: "",
    category_id: "",
    type: "expense" as "income" | "expense",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (drawerOpen) {
      fetchCategories();
    }
  }, [drawerOpen]);

  const fetchCategories = async () => {
    try {
      console.log("🔍 Fetching categories...");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.log("❌ No user found");
        return;
      }

      const { data: globalCats, error: globalError } = await supabase
        .from("global_categories")
        .select("*")
        .order("name", { ascending: true });

      console.log("📦 Global categories received:", globalCats?.length || 0);
      if (globalError) {
        console.error("❌ Error fetching global categories:", globalError);
      } else {
        setGlobalCategories(globalCats || []);
      }

      const { data: userCats, error: userError } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", user.id)
        .order("name", { ascending: true });

      console.log("👤 User categories received:", userCats?.length || 0);
      if (userError) {
        console.error("❌ Error fetching user categories:", userError);
      } else {
        setUserCategories(userCats || []);
      }

      console.log(
        "✅ Total categories:",
        (globalCats?.length || 0) + (userCats?.length || 0)
      );
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
    }
  };

  const addTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Por favor inicia sesión primero");
        return;
      }

      const { error } = await supabase.from("transactions").insert([
        {
          user_id: user.id,
          amount: parseFloat(newTransaction.amount),
          description: newTransaction.description,
          category_id: newTransaction.category_id,
          type: newTransaction.type,
          date: newTransaction.date.split("T")[0],
        },
      ]);

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      setNewTransaction({
        amount: "",
        description: "",
        category_id: "",
        type: "expense",
        date: new Date().toISOString().split("T")[0],
      });
      setDrawerOpen(false);
      onTransactionAdded();
    } catch (error: any) {
      console.error("Error adding transaction:", error);
      const errorMessage = error?.message || "Error desconocido";
      const errorCode = error?.code || "";
      alert(
        `Error al agregar transacción:\n${errorMessage}\nCódigo: ${errorCode}\n\n¿Tienes categorías creadas?`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerTrigger asChild>
        <Button className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all z-50 p-0">
          <Plus className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-4xl flex flex-col h-full">
          <DrawerHeader className="pb-4">
            <DrawerTitle>Agregar Transacción</DrawerTitle>
            <DrawerDescription>
              Completa los datos de tu ingreso o gasto
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-6 pb-4">
            <div className="grid grid-cols-5 gap-6">
              {/* Columna Izquierda - Inputs */}
              <div className="col-span-2 space-y-4">
                {/* Tipo */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Tipo</label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={
                        newTransaction.type === "income" ? "default" : "outline"
                      }
                      className="flex-1 h-10"
                      onClick={() => {
                        setNewTransaction({
                          ...newTransaction,
                          type: "income",
                          category_id: "",
                        });
                      }}
                    >
                      Ingreso
                    </Button>
                    <Button
                      type="button"
                      variant={
                        newTransaction.type === "expense"
                          ? "default"
                          : "outline"
                      }
                      className="flex-1 h-10"
                      onClick={() => {
                        setNewTransaction({
                          ...newTransaction,
                          type: "expense",
                          category_id: "",
                        });
                      }}
                    >
                      Gasto
                    </Button>
                  </div>
                </div>

                {/* Monto */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Monto
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      $
                    </span>
                    <Input
                      type="text"
                      placeholder="0"
                      value={
                        newTransaction.amount
                          ? new Intl.NumberFormat("es-CO").format(
                              Number(newTransaction.amount)
                            )
                          : ""
                      }
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(
                          /[^\d]/g,
                          ""
                        );
                        setNewTransaction({
                          ...newTransaction,
                          amount: numericValue,
                        });
                      }}
                      className="h-10 pl-6"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      COP
                    </span>
                  </div>
                </div>

                {/* Fecha */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Fecha
                  </label>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal h-10"
                      >
                        <CalendarBlank className="mr-2 h-4 w-4" weight="bold" />
                        {newTransaction.date
                          ? format(
                              new Date(newTransaction.date + "T00:00:00"),
                              "dd MMM yyyy",
                              {
                                locale: es,
                              }
                            )
                          : "Fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          newTransaction.date
                            ? new Date(newTransaction.date + "T00:00:00")
                            : undefined
                        }
                        onSelect={(date) => {
                          if (date) {
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(
                              2,
                              "0"
                            );
                            const day = String(date.getDate()).padStart(2, "0");
                            setNewTransaction({
                              ...newTransaction,
                              date: `${year}-${month}-${day}`,
                            });
                            setCalendarOpen(false);
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Descripción */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Descripción
                  </label>
                  <Input
                    placeholder="Ej: Supermercado"
                    value={newTransaction.description}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        description: e.target.value,
                      })
                    }
                    className="h-10"
                  />
                </div>
              </div>

              {/* Columna Derecha - Categorías */}
              <div className="col-span-3">
                <div className="space-y-4">
                  {/* Mis Categorías Personales */}
                  {userCategories.filter(
                    (cat) => cat.type === newTransaction.type
                  ).length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2 font-semibold">
                        Mis Categorías
                      </p>
                      <div className="grid grid-cols-5 gap-2">
                        {userCategories
                          .filter((cat) => cat.type === newTransaction.type)
                          .map((cat) => (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() =>
                                setNewTransaction({
                                  ...newTransaction,
                                  category_id: cat.id,
                                })
                              }
                              className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg border transition-all hover:bg-accent ${
                                newTransaction.category_id === cat.id
                                  ? "ring-2 ring-primary bg-accent border-primary"
                                  : "border-border"
                              }`}
                            >
                              <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: cat.color + "E6" }}
                              >
                                {renderIcon(cat.icon)}
                              </div>
                              <span className="text-[10px] font-medium text-center leading-tight line-clamp-1 w-full">
                                {cat.name}
                              </span>
                            </button>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Categorías Globales */}
                  {globalCategories.filter(
                    (cat) => cat.type === newTransaction.type
                  ).length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2 font-semibold">
                        Categorías Globales
                      </p>
                      <div className="grid grid-cols-5 gap-2">
                        {globalCategories
                          .filter((cat) => cat.type === newTransaction.type)
                          .map((cat) => (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() =>
                                setNewTransaction({
                                  ...newTransaction,
                                  category_id: cat.id,
                                })
                              }
                              className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg border transition-all hover:bg-accent ${
                                newTransaction.category_id === cat.id
                                  ? "ring-2 ring-primary bg-accent border-primary"
                                  : "border-border"
                              }`}
                            >
                              <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: cat.color + "E6" }}
                              >
                                {renderIcon(cat.icon)}
                              </div>
                              <span className="text-[10px] font-medium text-center leading-tight line-clamp-1 w-full">
                                {cat.name}
                              </span>
                            </button>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Mensaje si no hay categorías */}
                  {userCategories.filter(
                    (cat) => cat.type === newTransaction.type
                  ).length === 0 &&
                    globalCategories.filter(
                      (cat) => cat.type === newTransaction.type
                    ).length === 0 && (
                      <p className="text-center text-sm text-muted-foreground py-8">
                        No hay categorías disponibles para este tipo.
                      </p>
                    )}
                </div>
              </div>
            </div>
          </div>

          <DrawerFooter className="pt-4 px-6 pb-6">
            <div className="flex gap-2">
              <DrawerClose asChild>
                <Button variant="outline" className="flex-1 h-10">
                  Cancelar
                </Button>
              </DrawerClose>
              <Button
                onClick={addTransaction}
                disabled={
                  submitting ||
                  !newTransaction.amount ||
                  !newTransaction.category_id
                }
                className="flex-1 h-10"
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" />
                    <span>Guardando...</span>
                  </div>
                ) : (
                  "Agregar Transacción"
                )}
              </Button>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
