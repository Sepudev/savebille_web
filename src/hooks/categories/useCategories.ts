import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Category } from "@/types";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [globalCategories, setGlobalCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    categoryId: string | null;
    categoryName: string;
  }>({ open: false, categoryId: null, categoryName: "" });
  const [activeTab, setActiveTab] = useState<"global" | "personal">("personal");
  const [newCategory, setNewCategory] = useState({
    name: "",
    icon: "money",
    color: "#3b82f6",
    type: "expense" as "income" | "expense",
  });

  useEffect(() => {
    fetchCategories();
    fetchGlobalCategories();
  }, []);

  const fetchGlobalCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("global_categories")
        .select("*")
        .order("type", { ascending: false })
        .order("name", { ascending: true });

      if (error) throw error;
      setGlobalCategories(data || []);
    } catch (error) {
      console.error("Error fetching global categories:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", user.id)
        .order("type", { ascending: false })
        .order("name", { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (e: React.FormEvent) => {
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

      const { error } = await supabase.from("categories").insert([
        {
          user_id: user.id,
          name: newCategory.name,
          icon: newCategory.icon,
          color: newCategory.color,
          type: newCategory.type,
        },
      ]);

      if (error) throw error;

      setNewCategory({
        name: "",
        icon: "money",
        color: "#3b82f6",
        type: "expense",
      });
      setShowAddForm(false);
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Error adding category");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteCategory = async (id: string) => {
    setDeleting(id);
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);

      if (error) throw error;
      setDeleteDialog({ open: false, categoryId: null, categoryName: "" });
      fetchCategories();
    } catch (error: any) {
      console.error("Error deleting category:", error);
      if (error.code === "23503") {
        alert(
          "No puedes eliminar esta categoría porque tiene transacciones asociadas. Elimina primero esas transacciones."
        );
      } else {
        alert("Error al eliminar la categoría");
      }
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteClick = (category: Category) => {
    setDeleteDialog({
      open: true,
      categoryId: category.id,
      categoryName: category.name,
    });
  };

  const expenseCategories = categories.filter((c) => c.type === "expense");
  const incomeCategories = categories.filter((c) => c.type === "income");

  const globalExpenseCategories = globalCategories.filter(
    (c) => c.type === "expense"
  );
  const globalIncomeCategories = globalCategories.filter(
    (c) => c.type === "income"
  );

  return {
    categories,
    globalCategories,
    loading,
    submitting,
    deleting,
    showAddForm,
    setShowAddForm,
    deleteDialog,
    setDeleteDialog,
    activeTab,
    setActiveTab,
    newCategory,
    setNewCategory,
    addCategory,
    deleteCategory,
    handleDeleteClick,
    expenseCategories,
    incomeCategories,
    globalExpenseCategories,
    globalIncomeCategories,
  };
}
