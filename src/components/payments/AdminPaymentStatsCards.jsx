
import {
  Wallet,
  CircleCheck,
  Clock3,
  CircleX,
} from "lucide-react";

function formatMoney(value, currency = "MYR") {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency,
  }).format(Number(value) || 0);
}

export default function AdminPaymentStatsCards({ stats, loading }) {
  const cards = [
    {
      label: "Successful Revenue",
      value: formatMoney(stats.successfulRevenue, stats.currency),
      description: "Successful MYR payments",
      icon: Wallet,
      iconStyle: "bg-blue-50 text-blue-600",
    },
    {
      label: "Successful Payments",
      value: stats.successfulPayments ?? 0,
      description: "Confirmed transactions",
      icon: CircleCheck,
      iconStyle: "bg-green-50 text-green-600",
    },
    {
      label: "Pending Payments",
      value: stats.pendingPayments ?? 0,
      description: "Awaiting final status",
      icon: Clock3,
      iconStyle: "bg-amber-50 text-amber-600",
    },
    {
      label: "Failed / Cancelled",
      value: stats.failedOrCancelledPayments ?? 0,
      description: "Unsuccessful transactions",
      icon: CircleX,
      iconStyle: "bg-red-50 text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.label}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-gray-500">
                  {card.label}
                </p>

                <p className="mt-3 break-words text-2xl font-bold text-gray-800">
                  {loading ? "—" : card.value}
                </p>
              </div>

              <div
                className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${card.iconStyle}`}
              >
                <Icon size={22} />
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              {card.description}
            </p>
          </article>
        );
      })}
    </div>
  );
}
