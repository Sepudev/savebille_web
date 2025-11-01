import React from "react";
import { AddTransactionDrawer } from "@/components/transactions/AddTransactionDrawer";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { WeeklyActivityChart } from "@/components/dashboard/WeeklyActivityChart";
import { IncomeVsExpenses } from "@/components/dashboard/IncomeVsExpenses";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { FinancialSummaryCards } from "@/components/dashboard/FinancialSummaryCards";
import { useDashboard } from "@/hooks/dashboard/useDashboard";

export const Dashboard: React.FC = () => {
  const {
    transactions,
    loading,
    balance,
    totalIncome,
    totalExpenses,
    weekData,
    formatCOP,
    fetchData,
  } = useDashboard();

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-1">Analíticas</h2>
            <p className="text-sm text-muted-foreground">
              Resumen de tus finanzas
            </p>
          </div>

          <FinancialSummaryCards
            balance={balance}
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            formatCOP={formatCOP}
          />

          <WeeklyActivityChart weekData={weekData} formatCOP={formatCOP} />

          <IncomeVsExpenses
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            formatCOP={formatCOP}
          />
        </div>

        <div className="w-96 border-l border-border p-6 overflow-auto space-y-6">
          <RecentTransactions
            transactions={transactions}
            formatCOP={formatCOP}
          />
        </div>
      </div>

      <AddTransactionDrawer onTransactionAdded={fetchData} />
    </>
  );
};
