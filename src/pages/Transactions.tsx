import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TransactionDetailModal } from "@/components/transactions/TransactionDetailModal";
import { TransactionsSkeleton } from "@/components/transactions/TransactionsSkeleton";
import { renderIcon } from "@/utils/general/iconRenderer";
import {
  TrashIcon,
  MagnifyingGlassIcon,
  XIcon,
  ListDashesIcon,
} from "@phosphor-icons/react";
import { useTransactions } from "@/hooks/transactions/useTransactions";

export const Transactions: React.FC = () => {
  const {
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
  } = useTransactions();

  const groupedTransactions = groupTransactionsByDate(filteredTransactions);

  if (loading) {
    return <TransactionsSkeleton />;
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
          <MagnifyingGlassIcon
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
              <XIcon className="h-4 w-4" />
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
            <MagnifyingGlassIcon
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
        <div className="space-y-6">
          {Object.entries(groupedTransactions).map(([date, transactions]) => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 capitalize">
                {date}
              </h3>
              <div className="space-y-2">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="group flex items-center gap-4 p-4 rounded-xl border border-border transition-colors duration-200"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 shadow-sm"
                      style={{
                        backgroundColor: transaction.categories?.color + "40",
                      }}
                    >
                      {renderIcon(transaction.categories?.icon || "question")}
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
                          {new Date(
                            transaction.date + "T00:00:00"
                          ).toLocaleDateString("es-CO", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className={`text-base font-bold whitespace-nowrap ${
                          transaction.type === "income"
                            ? "text-primary"
                            : "text-secondary"
                        }`}
                      >
                        {transaction.type === "expense" && "-"}
                        {formatCOP(Number(transaction.amount))}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDetailModal(transaction)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                        title="Ver información completa"
                      >
                        <ListDashesIcon className="h-4 w-4" weight="bold" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(transaction)}
                        disabled={deleting === transaction.id}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-red-400 hover:bg-red-400/10"
                        title="Eliminar"
                      >
                        {deleting === transaction.id ? (
                          <Spinner size="sm" />
                        ) : (
                          <TrashIcon className="h-4 w-4" weight="bold" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <TransactionDetailModal
        transaction={selectedTransaction}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        onUpdate={fetchTransactions}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar transacción?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la
              transacción.
            </DialogDescription>
          </DialogHeader>

          {transactionToDelete && (
            <div className="py-4">
              <div className="flex items-center gap-3 p-4 rounded-lg border">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                  style={{
                    backgroundColor:
                      transactionToDelete.categories?.color + "40",
                  }}
                >
                  {renderIcon(
                    transactionToDelete.categories?.icon || "question"
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {transactionToDelete.description || "Sin descripción"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {transactionToDelete.categories?.name}
                  </p>
                </div>
                <p
                  className={`text-lg font-bold ${
                    transactionToDelete.type === "income"
                      ? "text-secondary"
                      : "text-red-400"
                  }`}
                >
                  {formatCOP(Number(transactionToDelete.amount))}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setTransactionToDelete(null);
              }}
              disabled={deleting !== null}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                transactionToDelete && deleteTransaction(transactionToDelete.id)
              }
              disabled={deleting !== null}
            >
              {deleting ? <Spinner size="sm" /> : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
