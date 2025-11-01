import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Transaction } from "@/types";

export function useTransactions() {
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
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);

  const formatCOP = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const groupTransactionsByDate = (transactions: Transaction[]) => {
    const grouped: { [key: string]: Transaction[] } = {};

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date + "T00:00:00").toLocaleDateString(
        "es-CO",
        {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      );

      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(transaction);
    });

    return grouped;
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

      const { data: transactionsData, error: transError } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (transError) throw transError;

      const [globalCatsResponse, userCatsResponse] = await Promise.all([
        supabase.from("global_categories").select("*"),
        supabase.from("categories").select("*").eq("user_id", user.id),
      ]);

      const categoriesMap = new Map();

      if (globalCatsResponse.data) {
        globalCatsResponse.data.forEach((cat) => {
          categoriesMap.set(cat.id, cat);
        });
      }

      if (userCatsResponse.data) {
        userCatsResponse.data.forEach((cat) => {
          categoriesMap.set(cat.id, cat);
        });
      }

      const transactionsWithCategories = transactionsData?.map((t) => ({
        ...t,
        categories: categoriesMap.get(t.category_id) || null,
      }));

      setTransactions(transactionsWithCategories || []);
    } catch (error) {
      console.error("Error fetching data:", error);
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
    try {
      setDeleting(id);
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setTransactions(transactions.filter((t) => t.id !== id));
      setDeleteDialogOpen(false);
      setTransactionToDelete(null);
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert("Error al eliminar la transacción");
    } finally {
      setDeleting(null);
    }
  };

  const openDeleteDialog = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setDeleteDialogOpen(true);
  };

  const openDetailModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDetailModalOpen(true);
  };

  return {
    transactions,
    filteredTransactions,
    loading,
    deleting,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    selectedTransaction,
    detailModalOpen,
    setDetailModalOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    transactionToDelete,
    setTransactionToDelete,
    formatCOP,
    groupTransactionsByDate,
    fetchTransactions,
    deleteTransaction,
    openDeleteDialog,
    openDetailModal,
  };
}
