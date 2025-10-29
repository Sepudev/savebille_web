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
import type { Category } from "@/types";
import { Plus, Trash, ArrowLeft } from "@phosphor-icons/react";

const EMOJI_OPTIONS = [
  "💰",
  "💼",
  "📈",
  "🍔",
  "🚗",
  "🛍️",
  "📄",
  "🎬",
  "🏥",
  "📚",
  "🏠",
  "✈️",
  "🎮",
  "☕",
  "💊",
  "🎓",
  "🔧",
  "🎨",
  "🏋️",
  "🍕",
];
const COLOR_OPTIONS = [
  "#ef4444",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f43f5e",
  "#6366f1",
];

export default function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    icon: "💰",
    color: "#3b82f6",
    type: "expense" as "income" | "expense",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

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
        icon: "💰",
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
    if (
      !confirm(
        "Are you sure you want to delete this category? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeleting(id);
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);

      if (error) throw error;
      fetchCategories();
    } catch (error: any) {
      console.error("Error deleting category:", error);
      if (error.code === "23503") {
        alert(
          "Cannot delete this category because it has transactions. Please delete those transactions first."
        );
      } else {
        alert("Error deleting category");
      }
    } finally {
      setDeleting(null);
    }
  };

  const expenseCategories = categories.filter((c) => c.type === "expense");
  const incomeCategories = categories.filter((c) => c.type === "income");

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-4">
        <Spinner size="lg" />
        <p className="text-sm text-muted-foreground">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-primary">Categories</h1>
              <p className="text-muted-foreground mt-1">
                Manage your transaction categories
              </p>
            </div>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>

        {showAddForm && (
          <Card className="mb-8 border-border">
            <CardHeader>
              <CardTitle>Add New Category</CardTitle>
              <CardDescription>
                Create a custom category for your transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={addCategory} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Name
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g., Groceries"
                      value={newCategory.name}
                      onChange={(e) =>
                        setNewCategory({ ...newCategory, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Type
                    </label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={newCategory.type}
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          type: e.target.value as "income" | "expense",
                        })
                      }
                      required
                    >
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Icon</label>
                  <div className="grid grid-cols-10 gap-2">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        className={`p-3 text-2xl border border-border rounded-lg hover:bg-accent transition-colors ${
                          newCategory.icon === emoji
                            ? "ring-2 ring-primary bg-accent"
                            : ""
                        }`}
                        onClick={() =>
                          setNewCategory({ ...newCategory, icon: emoji })
                        }
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Color
                  </label>
                  <div className="flex gap-2">
                    {COLOR_OPTIONS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          newCategory.color === color
                            ? "ring-2 ring-offset-2 ring-primary scale-110"
                            : ""
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() =>
                          setNewCategory({ ...newCategory, color })
                        }
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <div className="flex items-center gap-2">
                        <Spinner size="sm" />
                        <span>Saving...</span>
                      </div>
                    ) : (
                      "Save Category"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-secondary">
                Income Categories
              </CardTitle>
              <CardDescription>
                {incomeCategories.length} categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              {incomeCategories.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No income categories yet
                </p>
              ) : (
                <div className="space-y-2">
                  {incomeCategories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                          style={{ backgroundColor: category.color + "20" }}
                        >
                          {category.icon}
                        </div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteCategory(category.id)}
                        disabled={deleting === category.id}
                      >
                        {deleting === category.id ? (
                          <Spinner size="sm" />
                        ) : (
                          <Trash
                            className="h-4 w-4 text-red-400"
                            weight="bold"
                          />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-red-400">Expense Categories</CardTitle>
              <CardDescription>
                {expenseCategories.length} categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              {expenseCategories.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No expense categories yet
                </p>
              ) : (
                <div className="space-y-2">
                  {expenseCategories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                          style={{ backgroundColor: category.color + "20" }}
                        >
                          {category.icon}
                        </div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteCategory(category.id)}
                        disabled={deleting === category.id}
                      >
                        {deleting === category.id ? (
                          <Spinner size="sm" />
                        ) : (
                          <Trash
                            className="h-4 w-4 text-red-400"
                            weight="bold"
                          />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
