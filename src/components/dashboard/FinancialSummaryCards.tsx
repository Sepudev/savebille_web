import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendDownIcon,
  TrendUpIcon,
  CurrencyDollarIcon,
} from "@phosphor-icons/react";

interface FinancialSummaryCardsProps {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  formatCOP: (amount: number) => string;
}

export const FinancialSummaryCards: React.FC<FinancialSummaryCardsProps> = ({
  balance,
  totalIncome,
  totalExpenses,
  formatCOP,
}) => {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <Card className="border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-muted-foreground">Balance</p>
            <CurrencyDollarIcon
              className="h-3.5 w-3.5 text-muted-foreground"
              weight="bold"
            />
          </div>
          <div
            className={`text-lg font-bold ${
              balance >= 0 ? "text-white" : "text-secondary"
            }`}
          >
            {formatCOP(balance)}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-muted-foreground">
              Ingresos
            </p>
            <TrendUpIcon className="h-3.5 w-3.5 text-primary" weight="bold" />
          </div>
          <div className="text-lg font-bold text-primary">
            {formatCOP(totalIncome)}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-muted-foreground">Gastos</p>
            <TrendDownIcon
              className="h-3.5 w-3.5 text-secondary"
              weight="bold"
            />
          </div>
          <div className="text-lg font-bold text-secondary">
            {formatCOP(totalExpenses)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
