
import {
  Wallet,
  TrendingUp,
  CircleDollarSign,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";

function RevenueInsightsHighlight({  statistics,revenueOverview,paymentStatus,}) {
  const totalRevenue = Number(statistics?.totalRevenue ?? 0);

  const monthlyRevenue = Number(
    revenueOverview?.[revenueOverview.length - 1]?.revenue ?? 0
  );

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: statistics?.currency || "MYR",
    }).format(amount);

  return (
    <div className="h-full rounded-2xl bg-emerald-200 p-6">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          REVENUE INSIGHTS
        </span>

        <div className="rounded-xl bg-emerald-100 p-3">
          <Wallet size={26} className="text-emerald-600" />
        </div>
      </div>

      <div className="mt-5">
        <h3 className="text-xl font-bold text-emerald-950">
          Revenue performance
        </h3>

        <p className="mt-1 text-sm text-emerald-700">
          Monitor your academy's financial performance.
        </p>
      </div>

      <div className="mt-6 rounded-xl bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <CircleDollarSign size={18} className="text-emerald-600" />
          Total Revenue
        </div>

        <h4 className="mt-3 text-3xl font-bold text-gray-800">
          {formatCurrency(totalRevenue)}
        </h4>

        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
            <TrendingUp size={13} />
            Revenue
          </div>

          <span className="text-xs text-gray-500">
            After refunds
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-emerald-100 p-3">
          <p className="text-xs text-emerald-700">
            This month
          </p>
          <p className="mt-1 text-lg font-bold text-emerald-900">
            {formatCurrency(monthlyRevenue)}
          </p>
        </div>

        <div className="rounded-xl bg-white p-3">
          <p className="text-xs text-gray-500">
            Successful payments
          </p>
          <p className="mt-1 text-lg font-bold text-gray-800">
            {/* Payment count is supplied by Payment Overview */}
            {paymentStatus?.paid ?? 0}
          </p>
        </div>
      </div>

      <Link
        className="mt-4 flex items-center justify-between text-sm"
        to="/payments"
      >
        <span className="font-medium text-emerald-700">
          View revenue details
        </span>
        <ArrowUpRight size={18} className="text-emerald-600" />
      </Link>
    </div>
  );
}

export default RevenueInsightsHighlight;
