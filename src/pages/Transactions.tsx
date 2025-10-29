import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import type { Transaction } from "@/types";
import { Trash, MagnifyingGlass, Funnel, X } from "@phosphor-icons/react";

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all"
  );

  const formatCOP = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [searchQuery, filterType, transactions]);

  const fetchTransactions = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: transactionsData, error } = await supabase
        .from("transactions")
        .select("*, categories(name, icon, color)")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (error) throw error;
      setTransactions(transactionsData || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = transactions;

    if (filterType !== "all") {
      filtered = filtered.filter((t) => t.type === filterType);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.categories?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  };

  const deleteTransaction = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta transacción?")) return;

    try {
      setDeleting(id);
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setTransactions(transactions.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert("Error al eliminar la transacción");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-4">
        <Spinner size="lg" />
        <p className="text-sm text-muted-foreground">
          Cargando transacciones...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Transacciones</h1>
        <p className="text-sm text-muted-foreground">
          {filteredTransactions.length} transacción
          {filteredTransactions.length !== 1 ? "es" : ""} encontrada
          {filteredTransactions.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <MagnifyingGlass
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            weight="bold"
          />
          <Input
            placeholder="Buscar transacciones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 border-border"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant={filterType === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("all")}
            className="h-10"
          >
            Todas
          </Button>
          <Button
            variant={filterType === "income" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("income")}
            className={
              filterType === "income"
                ? "h-10 bg-secondary hover:bg-secondary/90"
                : "h-10"
            }
          >
            Ingresos
          </Button>
          <Button
            variant={filterType === "expense" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("expense")}
            className={
              filterType === "expense"
                ? "h-10 bg-red-500 hover:bg-red-600"
                : "h-10"
            }
          >
            Gastos
          </Button>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <MagnifyingGlass
              className="h-8 w-8 text-muted-foreground"
              weight="bold"
            />
          </div>
          <h3 className="text-lg font-semibold mb-1">No hay transacciones</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            {searchQuery || filterType !== "all"
              ? "Intenta ajustar los filtros de búsqueda"
              : "Comienza agregando tu primera transacción"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="group flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-accent/30 transition-colors duration-200"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 shadow-sm"
                style={{
                  backgroundColor: transaction.categories?.color + "40",
                }}
              >
                {transaction.categories?.icon}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {transaction.description || "Sin descripción"}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <span className="truncate">
                    {transaction.categories?.name}
                  </span>
                  <span>•</span>
                  <span className="whitespace-nowrap">
                    {new Date(transaction.date).toLocaleDateString("es-CO", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`text-base font-bold whitespace-nowrap ${
                    transaction.type === "income"
                      ? "text-secondary"
                      : "text-red-400"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCOP(Number(transaction.amount))}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTransaction(transaction.id)}
                  disabled={deleting === transaction.id}
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 text-muted-foreground hover:text-red-400 hover:bg-red-400/10"
                >
                  {deleting === transaction.id ? (
                    <Spinner size="sm" />
                  ) : (
                    <Trash className="h-4 w-4" weight="bold" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
