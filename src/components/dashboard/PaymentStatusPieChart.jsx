
import { PieChart, Pie, Cell } from "recharts";
import { useDashboard } from "../../context/DashboardContext";

const paymentColors = {
  Paid: "#22c55e",
  Pending: "#f59e0b",
  Failed: "#ef4444",
};

export default function PaymentStatusPieChart() {
  const { dashboardData, loading, error } = useDashboard();

  const paymentStatus = dashboardData?.paymentStatus;

  if (loading) {
    return <p className="p-4">Loading payment status...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-500">{error}</p>;
  }

  if (!paymentStatus) return null;

  const data = [
    {
      name: "Paid",
      value: paymentStatus.paid,
      fill: paymentColors.Paid,
    },
    {
      name: "Pending",
      value: paymentStatus.pending,
      fill: paymentColors.Pending,
    },
    {
      name: "Failed",
      value: paymentStatus.failed,
      fill: paymentColors.Failed,
    },
  ];

  const totalPayments = data.reduce(
    (total, item) => total + item.value,
    0
  );

  return (
    <div className="w-full h-full rounded-xl">
      {/* Header */}
      <div className="h-10 w-full flex">
        <h2 className="text-lg font-semibold">
          Payment Status
        </h2>
      </div>

      {/* Chart and Legend */}
      <div className="grid items-center justify-center h-full grid-cols-[1.5fr_1.5fr]">

        {/* Donut Chart */}
        <div className="max-w-56 relative flex items-center justify-center">
          <PieChart
            responsive
            style={{
              width: "100%",
              maxWidth: "300px",
              aspectRatio: 1,
            }}
          >
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="60%"
              outerRadius="90%"
              isAnimationActive={false}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={entry.fill}
                />
              ))}
            </Pie>
          </PieChart>

          {/* Center Total */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-xl font-bold">
              {totalPayments}
            </span>

            <span className="text-sm font-medium text-gray-500">
              Total Payments
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col justify-center gap-5">
          {data.map((item) => {
            const percentage =
              totalPayments > 0
                ? Math.round((item.value / totalPayments) * 100)
                : 0;

            return (
              <div
                key={item.name}
                className="flex flex-wrap items-center gap-2"
              >
                <div className="flex gap-3 items-center">
                  <span
                    className="w-5 h-5 rounded-md shrink-0"
                    style={{
                      backgroundColor: item.fill,
                    }}
                  />

                  <p>{item.name}</p>
                </div>

                <p className="ml-2 text-sm text-gray-500">
                  {item.value} ({percentage}%)
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
