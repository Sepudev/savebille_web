import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Transaction } from "@/types";

export function useDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const formatCOP = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const fetchData = async () => {
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

  useEffect(() => {
    fetchData();
  }, []);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpenses;

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

  return {
    transactions,
    loading,
    balance,
    totalIncome,
    totalExpenses,
    weekData,
    formatCOP,
    fetchData,
  };
}
