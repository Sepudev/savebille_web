import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface WeeklyActivityChartProps {
  weekData: {
    day: string;
    ingresos: number;
    gastos: number;
  }[];
  formatCOP: (amount: number) => string;
}

export const WeeklyActivityChart: React.FC<WeeklyActivityChartProps> = ({
  weekData,
  formatCOP,
}) => {
  return (
    <Card className="mb-6 border-border">
      <CardHeader>
        <CardTitle className="text-sm">Actividad de la Semana</CardTitle>
        <CardDescription className="text-xs">
          Ingresos y gastos de Lun a Dom
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={weekData}>
            <defs>
              <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5A86E5" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#5A86E5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFB1C1" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#FFB1C1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#374151"
              opacity={0.3}
            />
            <XAxis
              dataKey="day"
              stroke="#9CA3AF"
              style={{ fontSize: "12px" }}
            />
            <YAxis
              stroke="#9CA3AF"
              style={{ fontSize: "12px" }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: number) => formatCOP(value)}
              labelStyle={{ color: "#F9FAFB" }}
            />
            <Area
              type="monotone"
              dataKey="ingresos"
              stroke="#5A86E5"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorIngresos)"
              name="Ingresos"
            />
            <Area
              type="monotone"
              dataKey="gastos"
              stroke="#FFB1C1"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorGastos)"
              name="Gastos"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
