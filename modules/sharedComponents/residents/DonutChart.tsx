// modules/sharedComponents/residents/DonutChart.tsx
"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

type DonutChartProps = {
  allowed: number;
  notAllowed: number;
  total: number;
};

const COLORS = {
  allowed: "#4ade80", // أخضر
  notAllowed: "#f87171", // أحمر
};

export default function DonutChart({
  allowed,
  notAllowed,
  total,
}: DonutChartProps) {
  const data = [
    { name: "Allowed", value: allowed, color: COLORS.allowed },
    { name: "Not Allowed", value: notAllowed, color: COLORS.notAllowed },
  ];

  // إذا كان العدد الكلي 0
  if (total === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 flex items-center justify-center h-[220px]">
        <p className="text-muted-foreground text-sm">No data to display</p>
      </div>
    );
  }

  const allowedPercentage = ((allowed / total) * 100).toFixed(1);
  const notAllowedPercentage = ((notAllowed / total) * 100).toFixed(1);

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-center w-full">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                color: "white",
                fontSize: "16px",
                padding: "10px 14px",
                minWidth: "140px",
              }}
              labelStyle={{
                color: "white",
                fontSize: "17px",
                fontWeight: "600",
                marginBottom: "4px",
              }}
              itemStyle={{
                color: "white",
                fontSize: "16px",
                fontWeight: "500",
              }}
              formatter={(value, name) => [`${value ?? 0} residents`, name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* النص في وسط الدائرة */}
      <div className="text-center mt-1">
        <p className="text-sm font-bold text-foreground">{total}</p>

        <p className="text-base text-muted-foreground">Total Residents</p>
      </div>
    </div>
  );
}
