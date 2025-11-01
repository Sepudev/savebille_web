import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Plus, Trash, ArrowLeft, X } from "@phosphor-icons/react";
import { useCategories } from "@/hooks/categories/useCategories";
import { renderIcon } from "@/utils/general/iconRenderer";
import {
  PHOSPHOR_ICON_OPTIONS,
  COLOR_OPTIONS,
} from "@/utils/categories/categoryOptions";
import { CategoriesSkeleton } from "@/components/categories/CategoriesSkeleton";

export const Categories: React.FC = () => {
  const navigate = useNavigate();
  const {
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
  } = useCategories();

  if (loading) {
    return <CategoriesSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="h-9 w-9 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Categorías</h1>
              <p className="text-xs text-muted-foreground">
                Gestiona tus categorías de transacciones
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setActiveTab("personal");
            }}
            size="sm"
            className="h-9"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Nueva
          </Button>
        </div>

        <div className="flex gap-1 mb-4 p-1 bg-muted rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("personal")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "personal"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Mis Categorías
          </button>
          <button
            onClick={() => setActiveTab("global")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "global"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Globales
          </button>
        </div>

        <Drawer open={showAddForm} onOpenChange={setShowAddForm}>
          <DrawerContent className="max-h-[85vh]">
            <DrawerHeader className="px-6 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <DrawerTitle className="text-lg">Nueva Categoría</DrawerTitle>
                  <DrawerDescription className="text-xs">
                    Crea una categoría personalizada
                  </DrawerDescription>
                </div>
                <DrawerClose asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </DrawerClose>
              </div>
            </DrawerHeader>

            <form onSubmit={addCategory} className="flex flex-col flex-1">
              <div className="flex-1 overflow-y-auto px-6 pb-3">
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-xs font-medium mb-1 block">
                        Nombre
                      </label>
                      <Input
                        type="text"
                        placeholder="ej: Supermercado"
                        value={newCategory.name}
                        onChange={(e) =>
                          setNewCategory({
                            ...newCategory,
                            name: e.target.value,
                          })
                        }
                        required
                        className="h-9 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block">
                        Tipo
                      </label>
                      <select
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={newCategory.type}
                        onChange={(e) =>
                          setNewCategory({
                            ...newCategory,
                            type: e.target.value as "income" | "expense",
                          })
                        }
                        required
                      >
                        <option value="expense">Gasto</option>
                        <option value="income">Ingreso</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-1 block">
                      Ícono
                    </label>
                    <div className="grid grid-cols-8 gap-1.5">
                      {PHOSPHOR_ICON_OPTIONS.map((iconName) => {
                        const IconComponent = renderIcon(iconName);
                        return (
                          <button
                            key={iconName}
                            type="button"
                            className={`p-2 border border-border rounded-md hover:bg-accent transition-colors flex items-center justify-center ${
                              newCategory.icon === iconName
                                ? "ring-2 ring-primary bg-accent"
                                : ""
                            }`}
                            onClick={() =>
                              setNewCategory({ ...newCategory, icon: iconName })
                            }
                          >
                            {IconComponent}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-1 block">
                      Color
                    </label>
                    <div className="flex gap-1.5 flex-wrap">
                      {COLOR_OPTIONS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`w-8 h-8 rounded-md border-2 transition-all ${
                            newCategory.color === color
                              ? "ring-2 ring-offset-1 ring-primary scale-105"
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
                </div>
              </div>

              <DrawerFooter className="pt-3 px-6 pb-4">
                <Button
                  type="submit"
                  disabled={submitting}
                  size="default"
                  className="w-full"
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <Spinner size="sm" />
                      <span>Guardando...</span>
                    </div>
                  ) : (
                    "Guardar Categoría"
                  )}
                </Button>
                <DrawerClose asChild>
                  <Button type="button" variant="outline" disabled={submitting}>
                    Cancelar
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </DrawerContent>
        </Drawer>

        {activeTab === "personal" && (
          <div>
            <div className="mb-3">
              <h2 className="text-base font-semibold">Mis Categorías</h2>
              <p className="text-xs text-muted-foreground">
                Personalizadas y editables
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-1.5">
              {incomeCategories.map((category) => (
                <div
                  key={category.id}
                  className="relative flex flex-col items-center gap-1.5 p-1.5 rounded-md border border-border bg-card hover:bg-accent/50 transition-colors group"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteCategory(category.id)}
                    disabled={deleting === category.id}
                    className="absolute top-0.5 right-0.5 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {deleting === category.id ? (
                      <Spinner size="sm" />
                    ) : (
                      <Trash
                        className="h-2.5 w-2.5 text-red-400"
                        weight="bold"
                      />
                    )}
                  </Button>
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                    style={{ backgroundColor: category.color + "E6" }}
                  >
                    {renderIcon(category.icon)}
                  </div>
                  <span className="text-[10px] font-medium text-center leading-tight line-clamp-2 w-full px-0.5">
                    {category.name}
                  </span>
                </div>
              ))}

              {expenseCategories.map((category) => (
                <div
                  key={category.id}
                  className="relative flex flex-col items-center gap-1.5 p-1.5 rounded-md border border-border bg-card hover:bg-accent/50 transition-colors group"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(category)}
                    disabled={deleting === category.id}
                    className="absolute top-0.5 right-0.5 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {deleting === category.id ? (
                      <Spinner size="sm" />
                    ) : (
                      <Trash
                        className="h-2.5 w-2.5 text-red-400"
                        weight="bold"
                      />
                    )}
                  </Button>
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                    style={{ backgroundColor: category.color + "E6" }}
                  >
                    {renderIcon(category.icon)}
                  </div>
                  <span className="text-[10px] font-medium text-center leading-tight line-clamp-2 w-full px-0.5">
                    {category.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Global Categories Section */}
        {activeTab === "global" && (
          <div>
            <div className="mb-3">
              <h2 className="text-base font-semibold">Categorías Globales</h2>
              <p className="text-xs text-muted-foreground">
                Disponibles para todos los usuarios
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-1.5">
              {globalIncomeCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex flex-col items-center gap-1.5 p-1.5 rounded-md border border-border bg-card hover:bg-accent/30 transition-colors"
                >
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                    style={{ backgroundColor: category.color + "E6" }}
                  >
                    {renderIcon(category.icon)}
                  </div>
                  <span className="text-[10px] font-medium text-center leading-tight line-clamp-2 w-full px-0.5">
                    {category.name}
                  </span>
                </div>
              ))}

              {globalExpenseCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex flex-col items-center gap-1.5 p-1.5 rounded-md border border-border bg-card hover:bg-accent/30 transition-colors"
                >
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                    style={{ backgroundColor: category.color + "E6" }}
                  >
                    {renderIcon(category.icon)}
                  </div>
                  <span className="text-[10px] font-medium text-center leading-tight line-clamp-2 w-full px-0.5">
                    {category.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ open, categoryId: null, categoryName: "" })
        }
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>¿Eliminar categoría?</DialogTitle>
            <DialogDescription>
              Estás por eliminar la categoría{" "}
              <span className="font-semibold text-foreground">
                "{deleteDialog.categoryName}"
              </span>
              . Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setDeleteDialog({
                  open: false,
                  categoryId: null,
                  categoryName: "",
                })
              }
              disabled={deleting !== null}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                if (deleteDialog.categoryId) {
                  deleteCategory(deleteDialog.categoryId);
                }
              }}
              disabled={deleting !== null}
            >
              {deleting !== null ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" />
                  <span>Eliminando...</span>
                </div>
              ) : (
                "Eliminar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
