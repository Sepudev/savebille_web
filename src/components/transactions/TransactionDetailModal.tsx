import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
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
import type { Transaction, Category } from "@/types";
import {
  CurrencyCircleDollar,
  ArrowCircleUp,
  ArrowCircleDown,
  Clock,
  FloppyDisk,
  X,
  CalendarBlank,
} from "@phosphor-icons/react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const transactionSchema = z.object({
  amount: z
    .string()
    .min(1, "El monto es requerido")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "El monto debe ser un número mayor a 0",
    }),
  description: z.string().optional(),
  category_id: z.string().min(1, "La categoría es requerida"),
  type: z.enum(["income", "expense"]),
  date: z.date(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: () => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  open,
  onOpenChange,
  onUpdate,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [displayAmount, setDisplayAmount] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: "",
      description: "",
      category_id: "",
      type: "expense",
      date: new Date(),
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    if (transaction && open) {
      const formattedAmount = new Intl.NumberFormat("es-CO").format(
        Number(transaction.amount)
      );
      setDisplayAmount(formattedAmount);
      reset({
        amount: transaction.amount.toString(),
        description: transaction.description || "",
        category_id: transaction.category_id,
        type: transaction.type,
        date: new Date(transaction.date + "T00:00:00"),
      });
      fetchCategories();
    }
  }, [transaction, open, reset]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setValue("amount", value, { shouldDirty: true });
    if (value) {
      const formatted = new Intl.NumberFormat("es-CO").format(Number(value));
      setDisplayAmount(formatted);
    } else {
      setDisplayAmount("");
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
        .eq("user_id", user.id);

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const onSubmit = async (data: TransactionFormData) => {
    if (!transaction) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("transactions")
        .update({
          amount: parseFloat(data.amount),
          description: data.description || null,
          category_id: data.category_id,
          type: data.type,
          date: data.date.toISOString().split("T")[0],
        })
        .eq("id", transaction.id);

      if (error) throw error;

      onUpdate?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating transaction:", error);
      alert("Error al actualizar la transacción");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-CO", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!transaction) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="px-6">
          <DrawerTitle>Editar Transacción</DrawerTitle>
          <DrawerDescription>
            Modifica los datos directamente en los campos
          </DrawerDescription>
        </DrawerHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="overflow-y-auto px-6"
        >
          <div className="space-y-4 py-4 max-w-2xl mx-auto">
            {/* Type Selection */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">Tipo *</label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={
                    watchedValues.type === "expense" ? "default" : "outline"
                  }
                  className={`flex-1 ${
                    watchedValues.type === "expense"
                      ? "bg-secondary hover:bg-secondary"
                      : ""
                  }`}
                  onClick={() =>
                    setValue("type", "expense", { shouldDirty: true })
                  }
                >
                  <ArrowCircleDown className="h-4 w-4 mr-2" weight="bold" />
                  Gasto
                </Button>
                <Button
                  type="button"
                  variant={
                    watchedValues.type === "income" ? "default" : "outline"
                  }
                  className={`flex-1 ${
                    watchedValues.type === "income"
                      ? "bg-primary hover:bg-primary"
                      : ""
                  }`}
                  onClick={() =>
                    setValue("type", "income", { shouldDirty: true })
                  }
                >
                  <ArrowCircleUp className="h-4 w-4 mr-2" weight="bold" />
                  Ingreso
                </Button>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label
                htmlFor="amount"
                className="text-sm font-medium mb-1.5 block"
              >
                Monto (COP) *
              </label>
              <div className="relative">
                <CurrencyCircleDollar
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  weight="bold"
                />
                <Input
                  id="amount"
                  type="text"
                  placeholder="0"
                  value={displayAmount}
                  onChange={handleAmountChange}
                  className="pl-10"
                />
              </div>
              {errors.amount && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.amount.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="text-sm font-medium mb-1.5 block"
              >
                Descripción
              </label>
              <Input
                id="description"
                placeholder="Ej: Compra del supermercado"
                {...register("description")}
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="text-sm font-medium mb-1.5 block"
              >
                Categoría *
              </label>
              <select
                id="category"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                {...register("category_id")}
              >
                <option value="">Seleccionar categoría</option>
                {categories
                  .filter((cat) => cat.type === watchedValues.type)
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
              </select>
              {errors.category_id && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.category_id.message}
                </p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Fecha *
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarBlank className="mr-2 h-4 w-4" />
                    {format(watchedValues.date, "PPP", { locale: es })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={watchedValues.date}
                    onSelect={(date) =>
                      date && setValue("date", date, { shouldDirty: true })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Info about original transaction */}
            <div className="pt-4 border-t">
              <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <Clock
                  className="h-4 w-4 text-muted-foreground mt-0.5"
                  weight="bold"
                />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">
                    Transacción creada el
                  </p>
                  <p className="text-xs">
                    {formatDate(transaction.created_at)} a las{" "}
                    {formatTime(transaction.created_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DrawerFooter className="px-6">
            <div className="flex gap-2 max-w-2xl mx-auto w-full">
              <DrawerClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={submitting}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" weight="bold" />
                  Cancelar
                </Button>
              </DrawerClose>
              <Button
                type="submit"
                disabled={submitting || !isDirty}
                className="flex-1"
              >
                {submitting ? (
                  <Spinner size="sm" />
                ) : (
                  <>
                    <FloppyDisk className="h-4 w-4 mr-2" weight="bold" />
                    Guardar
                  </>
                )}
              </Button>
            </div>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};
