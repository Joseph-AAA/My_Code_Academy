
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useDashboard } from "../../context/DashboardContext";

function RevenueOverviewChart() {
  const { dashboardData, loading, error } = useDashboard();

  const [filter, setFilter] = useState("last-3-months");

  if (loading) return <p>Loading revenue data...</p>;

  if (error) return <p className="text-red-500">{error}</p>;

  if (!dashboardData) return null;

  const allRevenue = dashboardData.revenueOverview || [];

  // Determine which months to display.
  let chartData = allRevenue;

  if (filter === "this-month") {
    chartData = allRevenue.slice(-1);
  } else if (filter === "last-month") {
    chartData = allRevenue.slice(-2, -1);
  } else if (filter === "last-3-months") {
    chartData = allRevenue.slice(-3);
  } else if (filter === "this-year") {
    chartData = allRevenue;
  }

  const totalRevenue = chartData.reduce(
    (total, item) => total + Number(item.revenue || 0),
    0
  );

  return (
    <div className="w-full flex flex-col items-center rounded-xl h-96 bg-white shadow-sm">

      {/* Header */}
      <div className="w-full flex items-center p-5 py-5 justify-between">
        <div>
          <h3 className="font-bold">Revenue Overview</h3>
        </div>

        <div className="relative w-36 h-11">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="h-full w-full appearance-none cursor-pointer rounded-lg border border-gray-200 bg-white pl-3 pr-9 text-sm text-gray-700 outline-none transition-all hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="this-month">This month</option>
              <option value="last-month">Last month</option>
              <option value="last-3-months">Last 3 months</option>
              <option value="this-year">This year</option>
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
        </div>
    </div>

      {/* Total Revenue */}
      <div className="flex flex-col justify-start w-full px-5 font-bold">
        <h1 className="text-lg md:text-2xl">
          RM {totalRevenue.toLocaleString("en-MY")}
        </h1>

        <p className="text-sm md:text-xl px-1 font-medium">
          Total Revenue
        </p>
      </div>

      {/* Revenue Chart */}
      <div className="w-full min-w-0 overflow-hidden pr-5">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value) => [
                `RM ${Number(value).toLocaleString("en-MY")}`,
                "Revenue",
              ]}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              fill="#2563eb"
              stroke="#2563eb"
              fillOpacity={0.15}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RevenueOverviewChart;
