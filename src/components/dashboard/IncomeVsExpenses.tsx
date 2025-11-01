import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface IncomeVsExpensesProps {
  totalIncome: number;
  totalExpenses: number;
  formatCOP: (amount: number) => string;
}

export const IncomeVsExpenses: React.FC<IncomeVsExpensesProps> = ({
  totalIncome,
  totalExpenses,
  formatCOP,
}) => {
  return (
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
              <span className="font-medium text-primary">Ingresos</span>
              <span className="font-bold text-primary">
                {formatCOP(totalIncome)}
              </span>
            </div>
            <div className="h-8 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{
                  width: `${
                    totalIncome + totalExpenses > 0
                      ? (totalIncome / (totalIncome + totalExpenses)) * 100
                      : 50
                  }%`,
                }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-secondary">Gastos</span>
              <span className="font-bold text-secondary">
                {formatCOP(totalExpenses)}
              </span>
            </div>
            <div className="h-8 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary rounded-full transition-all"
                style={{
                  width: `${
                    totalIncome + totalExpenses > 0
                      ? (totalExpenses / (totalIncome + totalExpenses)) * 100
                      : 50
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
