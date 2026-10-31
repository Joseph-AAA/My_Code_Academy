
import {
  Wallet,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";

function PaymentOverviewHighlight({ paymentStatus }) {
  const payments = [
    {
      label: "Paid",
      value: paymentStatus?.paid ?? 0,
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      label: "Pending",
      value: paymentStatus?.pending ?? 0,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      label: "Failed",
      value: paymentStatus?.failed ?? 0,
      icon: XCircle,
      color: "text-rose-600",
      bg: "bg-rose-100",
    },
  ];

  return (
    <div className="min-h-96 rounded-2xl bg-indigo-200 p-6">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
          PAYMENT OVERVIEW
        </span>

        <div className="rounded-xl bg-indigo-100 p-3">
          <Wallet size={26} className="text-indigo-600" />
        </div>
      </div>

      <div className="mt-5">
        <h3 className="text-xl font-bold text-indigo-950">
          Payment Summary
        </h3>
        <p className="mt-1 text-sm text-indigo-700">
          Keep track of student payment activity.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {payments.map((payment) => {
          const Icon = payment.icon;

          return (
            <div
              key={payment.label}
              className="rounded-xl bg-white p-3 shadow-sm"
            >
              <div className={`mb-2 w-fit rounded-lg p-2 ${payment.bg}`}>
                <Icon size={18} className={payment.color} />
              </div>

              <p className="text-xl font-bold text-gray-800">
                {payment.value}
              </p>

              <p className="text-xs text-gray-500">
                {payment.label}
              </p>
            </div>
          );
        })}
      </div>

      <Link
        className="mt-15 flex items-center justify-between text-sm"
        to="/payments"
      >
        <span className="font-medium text-indigo-700">
          View payment details
        </span>
        <ArrowUpRight size={18} className="text-indigo-600" />
      </Link>
    </div>
  );
}

export default PaymentOverviewHighlight;
