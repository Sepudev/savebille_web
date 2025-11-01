import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { renderIcon } from "@/utils/general/iconRenderer";
import type { Transaction } from "@/types";

interface RecentTransactionsProps {
  transactions: Transaction[];
  formatCOP: (amount: number) => string;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  formatCOP,
}) => {
  const navigate = useNavigate();

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm">Transacciones Recientes</CardTitle>
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
                      backgroundColor: transaction.categories?.color + "20",
                    }}
                  >
                    {renderIcon(transaction.categories?.icon || "question")}
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
                      ? "text-primary"
                      : "text-secondary"
                  }`}
                >
                  {transaction.type === "expense" && "-"}
                  {formatCOP(Number(transaction.amount))}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
