
import { useMemo } from "react";
import { Users } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDashboard } from "../../context/DashboardContext";

function EnrollmentOverview() {
  const { dashboardData, loading, error } = useDashboard();

  const enrollmentData = dashboardData?.enrollmentOverview || [];

  // Total enrollments for the displayed six months
  const totalEnrollments = useMemo(
    () =>
      enrollmentData.reduce(
        (total, item) => total + item.students,
        0
      ),
    [enrollmentData]
  );

  // Current month's enrollments
  const currentMonthEnrollments =
    enrollmentData[enrollmentData.length - 1]?.students || 0;

  if (loading) {
    return <p className="mt-6">Loading enrollment data...</p>;
  }

  if (error) {
    return <p className="mt-6 text-red-500">{error}</p>;
  }

  return (
    <div className="w-full shadow-sm  min-h-92 rounded-xl bg-white p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold">Enrollment Overview</h3>

        <span className="text-sm text-gray-400">
          Last 6 months
        </span>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-2xl font-bold">
            {currentMonthEnrollments}
          </p>

          <p className="text-sm text-gray-400">
            Enrollments this month
          </p>
        </div>

        <div className="rounded-lg bg-blue-50 p-3">
          <Users className="text-blue-600" size={24} />
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-52 min-w-0 overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={enrollmentData}
            margin={{
              top: 10,
              right: 5,
              left: -20,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient
                id="enrollmentGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#3b82f6"
                  stopOpacity={0.3}
                />

                <stop
                  offset="95%"
                  stopColor="#3b82f6"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
            />

            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
            />

            <Tooltip
              formatter={(value) => [
                `${value} enrollments`,
                "Enrollments",
              ]}
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                fontSize: "12px",
              }}
            />

            <Area
              type="monotone"
              dataKey="students"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#enrollmentGradient)"
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default EnrollmentOverview;
