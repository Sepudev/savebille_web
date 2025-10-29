import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Transaction, Category } from "@/types";
import {
  Plus,
  TrendDown,
  TrendUp,
  CurrencyDollar,
  CalendarBlank,
} from "@phosphor-icons/react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    description: "",
    category_id: "",
    type: "expense" as "income" | "expense",
    date: new Date().toISOString().split("T")[0],
  });

  const formatCOP = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: transactionsData, error: transError } = await supabase
        .from("transactions")
        .select("*, categories(name, icon, color)")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (transError) throw transError;
      setTransactions(transactionsData || []);

      const { data: categoriesData, error: catError } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", user.id);

      if (catError) throw catError;
      setCategories(categoriesData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
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
        alert("Please login first");
        return;
      }

      const { error } = await supabase.from("transactions").insert([
        {
          user_id: user.id,
          amount: parseFloat(newTransaction.amount),
          description: newTransaction.description,
          category_id: newTransaction.category_id,
          type: newTransaction.type,
          date: newTransaction.date,
        },
      ]);

      if (error) throw error;

      setNewTransaction({
        amount: "",
        description: "",
        category_id: "",
        type: "expense",
        date: new Date().toISOString().split("T")[0],
      });
      setDrawerOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("Error adding transaction. Make sure you have categories created.");
    } finally {
      setSubmitting(false);
    }
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  const monthlyExpenses = transactions
    .filter((t) => {
      const transDate = new Date(t.date);
      const now = new Date();
      return (
        t.type === "expense" &&
        transDate.getMonth() === now.getMonth() &&
        transDate.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const getLastWeekData = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - daysToMonday);
    monday.setHours(0, 0, 0, 0);

    const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    const weekData = weekDays.map((day, index) => {
      const currentDay = new Date(monday);
      currentDay.setDate(monday.getDate() + index);

      const dayTransactions = transactions.filter((t) => {
        const transDate = new Date(t.date);
        return transDate.toDateString() === currentDay.toDateString();
      });

      const income = dayTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const expense = dayTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      return {
        day,
        ingresos: income,
        gastos: expense,
      };
    });

    return weekData;
  };

  const weekData = getLastWeekData();

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="sticky top-0 h-screen border-r border-border p-6 flex flex-col w-64">
          <div className="mb-8">
            <Skeleton className="h-8 w-32 mb-1" />
            <Skeleton className="h-3 w-28" />
          </div>
          <nav className="flex-1 space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </nav>
          <Skeleton className="h-10 w-full mt-auto" />
        </div>

        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
            <div className="flex h-16 items-center justify-between px-6">
              <div className="flex-1 max-w-xl">
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full ml-4" />
            </div>
          </header>

          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 p-6 overflow-auto">
              <div className="mb-6">
                <Skeleton className="h-8 w-32 mb-1" />
                <Skeleton className="h-4 w-48" />
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-3.5 w-3.5 rounded" />
                      </div>
                      <Skeleton className="h-6 w-28" />
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="mb-6 border-border">
                <CardHeader>
                  <Skeleton className="h-4 w-40 mb-1" />
                  <Skeleton className="h-3 w-52" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-[250px] w-full" />
                </CardContent>
              </Card>

              <Card className="mb-6 border-border">
                <CardHeader>
                  <Skeleton className="h-4 w-36 mb-1" />
                  <Skeleton className="h-3 w-44" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                          <Skeleton className="h-3 w-20" />
                        </div>
                        <Skeleton className="h-2 w-full rounded-full" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6 border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <Skeleton className="h-4 w-44 mb-1" />
                      <Skeleton className="h-3 w-36" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                      >
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="w-96 border-l border-border p-6 overflow-auto space-y-6">
              <div>
                <Skeleton className="h-5 w-36 mb-4" />
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-3 w-24" />
                          <Skeleton className="h-2 w-16" />
                        </div>
                      </div>
                      <Skeleton className="h-3 w-16" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Skeleton className="h-5 w-28 mb-4" />
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <Skeleton className="h-2 w-12" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-1">Analíticas</h2>
            <p className="text-sm text-muted-foreground">
              Resumen de tus finanzas
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Balance
                  </p>
                  <CurrencyDollar
                    className="h-3.5 w-3.5 text-muted-foreground"
                    weight="bold"
                  />
                </div>
                <div
                  className={`text-lg font-bold ${
                    balance >= 0 ? "text-secondary" : "text-red-400"
                  }`}
                >
                  {formatCOP(balance)}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Ingresos
                  </p>
                  <TrendUp
                    className="h-3.5 w-3.5 text-secondary"
                    weight="bold"
                  />
                </div>
                <div className="text-lg font-bold text-secondary">
                  {formatCOP(totalIncome)}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Gastos
                  </p>
                  <TrendDown
                    className="h-3.5 w-3.5 text-red-400"
                    weight="bold"
                  />
                </div>
                <div className="text-lg font-bold text-red-400">
                  {formatCOP(totalExpenses)}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6 border-border">
            <CardHeader>
              <CardTitle className="text-sm">Actividad de la Semana</CardTitle>
              <CardDescription className="text-xs">
                Ingresos y gastos de Lun a Dom
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={weekData}>
                  <defs>
                    <linearGradient
                      id="colorIngresos"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#FFB1C1" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#FFB1C1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorGastos"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#5A86E5" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#5A86E5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#374151"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="day"
                    stroke="#9CA3AF"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    style={{ fontSize: "12px" }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => formatCOP(value)}
                    labelStyle={{ color: "#F9FAFB" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="ingresos"
                    stroke="#FFB1C1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorIngresos)"
                    name="Ingresos"
                  />
                  <Area
                    type="monotone"
                    dataKey="gastos"
                    stroke="#5A86E5"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorGastos)"
                    name="Gastos"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="mb-6 border-border">
            <CardHeader>
              <CardTitle className="text-sm">Gastos por Categoría</CardTitle>
              <CardDescription className="text-xs">
                Top categorías este mes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <p className="text-center text-muted-foreground text-xs py-8">
                  No hay datos para mostrar
                </p>
              ) : (
                <div className="space-y-3">
                  {categories
                    .map((cat) => {
                      const categoryTotal = transactions
                        .filter(
                          (t) =>
                            t.category_id === cat.id &&
                            t.type === "expense" &&
                            new Date(t.date).getMonth() ===
                              new Date().getMonth()
                        )
                        .reduce((sum, t) => sum + Number(t.amount), 0);
                      return { ...cat, total: categoryTotal };
                    })
                    .filter((cat) => cat.total > 0)
                    .sort((a, b) => b.total - a.total)
                    .slice(0, 5)
                    .map((cat) => {
                      const percentage =
                        monthlyExpenses > 0
                          ? (cat.total / monthlyExpenses) * 100
                          : 0;
                      return (
                        <div key={cat.id} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-base">{cat.icon}</span>
                              <span className="font-medium">{cat.name}</span>
                            </div>
                            <span className="font-medium">
                              {formatCOP(cat.total)}
                            </span>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: cat.color,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mb-6 border-border">
            <CardHeader>
              <CardTitle className="text-sm">Ingresos vs Gastos</CardTitle>
              <CardDescription className="text-xs">
                Comparación general
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-secondary">Ingresos</span>
                    <span className="font-bold text-secondary">
                      {formatCOP(totalIncome)}
                    </span>
                  </div>
                  <div className="h-8 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary rounded-full transition-all"
                      style={{
                        width: `${
                          totalIncome + totalExpenses > 0
                            ? (totalIncome / (totalIncome + totalExpenses)) *
                              100
                            : 50
                        }%`,
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-red-400">Gastos</span>
                    <span className="font-bold text-red-400">
                      {formatCOP(totalExpenses)}
                    </span>
                  </div>
                  <div className="h-8 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-400 rounded-full transition-all"
                      style={{
                        width: `${
                          totalIncome + totalExpenses > 0
                            ? (totalExpenses / (totalIncome + totalExpenses)) *
                              100
                            : 50
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6 border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm">
                    Transacciones Recientes
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Últimas 8 transacciones
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => navigate("/transactions")}
                >
                  Ver todas
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <p className="text-center text-muted-foreground text-xs py-8">
                  No hay transacciones
                </p>
              ) : (
                <div className="space-y-3">
                  {transactions.slice(0, 8).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                          style={{
                            backgroundColor: transaction.categories?.color,
                          }}
                        >
                          {transaction.categories?.icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {transaction.description || "Sin descripción"}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{transaction.categories?.name}</span>
                            <span>•</span>
                            <span>
                              {new Date(transaction.date).toLocaleDateString(
                                "es-CO",
                                {
                                  day: "numeric",
                                  month: "short",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`text-sm font-bold ${
                          transaction.type === "income"
                            ? "text-secondary"
                            : "text-red-400"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCOP(Number(transaction.amount))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="w-96 border-l border-border p-6 overflow-auto space-y-6">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm">
                    Transacciones Recientes
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Últimas 5 entradas
                  </CardDescription>
                </div>
                <button
                  onClick={() => navigate("/transactions")}
                  className="text-xs text-primary hover:underline"
                >
                  Ver todas
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <p className="text-center text-muted-foreground text-xs py-4">
                  No hay transacciones aún
                </p>
              ) : (
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((transaction: any) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-2 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                          style={{
                            backgroundColor:
                              transaction.categories?.color + "20",
                          }}
                        >
                          {transaction.categories?.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-xs truncate">
                            {transaction.description || "Sin descripción"}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {transaction.categories?.name}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-sm font-bold ${
                          transaction.type === "income"
                            ? "text-secondary"
                            : "text-red-400"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCOP(Number(transaction.amount))}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-sm">Categorías</CardTitle>
              <CardDescription className="text-xs">
                {categories.length} en total
              </CardDescription>
            </CardHeader>
            <CardContent>
              {categories.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground text-xs mb-2">
                    No hay categorías aún
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate("/categories")}
                  >
                    Crear Categoría
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {categories.slice(0, 6).map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center gap-2 p-2 border border-border rounded-lg"
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                        style={{ backgroundColor: category.color + "20" }}
                      >
                        {category.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium">{category.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {category.type === "income" ? "Ingreso" : "Gasto"}
                        </p>
                      </div>
                    </div>
                  ))}
                  {categories.length > 6 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full text-xs"
                      onClick={() => navigate("/categories")}
                    >
                      Ver todas las {categories.length} categorías
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerTrigger asChild>
          <Button className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all z-50 p-0">
            <Plus className="h-5 w-5" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-md">
            <DrawerHeader>
              <DrawerTitle>Agregar Transacción</DrawerTitle>
              <DrawerDescription>
                Agrega un nuevo ingreso o gasto
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Monto</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newTransaction.amount}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      amount: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Descripción
                </label>
                <Input
                  placeholder="Ingresa descripción"
                  value={newTransaction.description}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Tipo</label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={
                      newTransaction.type === "income" ? "default" : "outline"
                    }
                    className="flex-1"
                    onClick={() =>
                      setNewTransaction({
                        ...newTransaction,
                        type: "income",
                      })
                    }
                  >
                    Ingreso
                  </Button>
                  <Button
                    type="button"
                    variant={
                      newTransaction.type === "expense" ? "default" : "outline"
                    }
                    className="flex-1"
                    onClick={() =>
                      setNewTransaction({
                        ...newTransaction,
                        type: "expense",
                      })
                    }
                  >
                    Gasto
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Categoría
                </label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newTransaction.category_id}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      category_id: e.target.value,
                    })
                  }
                >
                  <option value="">Seleccionar categoría</option>
                  {categories
                    .filter((cat) => cat.type === newTransaction.type)
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Fecha</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarBlank className="mr-2 h-4 w-4" weight="bold" />
                      {newTransaction.date
                        ? format(new Date(newTransaction.date), "PPP", {
                            locale: es,
                          })
                        : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        newTransaction.date
                          ? new Date(newTransaction.date)
                          : undefined
                      }
                      onSelect={(date) => {
                        if (date) {
                          setNewTransaction({
                            ...newTransaction,
                            date: format(date, "yyyy-MM-dd"),
                          });
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DrawerFooter>
              <Button onClick={addTransaction} disabled={submitting}>
                {submitting ? (
                  <>
                    <Spinner size="sm" className="mr-2 border-white" />
                    Guardando...
                  </>
                ) : (
                  "Agregar Transacción"
                )}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
