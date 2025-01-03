import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ExpenseSummary } from '../types/expense';

interface ExpenseChartProps {
  data: ExpenseSummary[];
}

const COLORS = {
  Food: '#22c55e',       // Green
  Travel: '#3b82f6',     // Blue
  Utilities: '#a855f7',  // Purple
  Entertainment: '#ec4899', // Pink
  Other: '#64748b',      // Gray
};

// Custom label component for better positioning and readability
const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value, category }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Only show label if percentage is greater than 5%
  if (percent < 0.05) return null;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="middle"
      className="text-sm font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
        <p className="font-medium text-gray-900">{data.category}</p>
        <p className="text-gray-600">₹{data.total.toFixed(2)}</p>
        <p className="text-gray-500 text-sm">{(data.percent * 100).toFixed(1)}% of total</p>
      </div>
    );
  }
  return null;
};

// Custom legend that shows both category and amount
const CustomLegend = ({ payload }: any) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 px-4 pt-4">
      {payload.map((entry: any) => (
        <div key={entry.value} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <div className="text-sm">
            <span className="font-medium">{entry.value}</span>
            <span className="text-gray-500 ml-1">
              (₹{entry.payload.total.toFixed(0)})
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export function ExpenseChart({ data }: ExpenseChartProps) {
  // Calculate percentages for each category
  const total = data.reduce((sum, item) => sum + item.total, 0);
  const dataWithPercent = data.map(item => ({
    ...item,
    percent: item.total / total
  }));

  if (data.length === 0) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <p className="text-gray-500 text-lg">No expense data to display</p>
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dataWithPercent}
            cx="50%"
            cy="45%"
            labelLine={false}
            outerRadius={120}
            innerRadius={80}
            fill="#8884d8"
            dataKey="total"
            nameKey="category"
            label={CustomLabel}
            paddingAngle={2}
          >
            {dataWithPercent.map((entry) => (
              <Cell 
                key={`cell-${entry.category}`} 
                fill={COLORS[entry.category as keyof typeof COLORS] || COLORS.Other}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            content={<CustomLegend />}
            verticalAlign="bottom"
            height={80}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}