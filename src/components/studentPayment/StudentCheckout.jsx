
import { paymentMethods } from "../../data/data";
import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

function StudentCheckout() {
  const navigate = useNavigate();
  const location = useLocation();

  const API_URL = import.meta.env.VITE_API_URL;

  const [isProcessing, setIsProcessing] = useState(false);
  const idempotencyKeyRef = useRef(null);

  // The course is passed from CourseDetailModal through route state.
  const course = location.state?.course;

  const [paymentMethod, setPaymentMethod] = useState("fpx");
  const [notice, setNotice] = useState("");

  if (!course) {
    return (
      <section className="w-full min-w-0 p-6 sm:p-8">
        <div className="mx-auto max-w-xl rounded-2xl border border-(--border) bg-(--surface) p-8 text-center">
          <BookOpen className="mx-auto mb-4 size-12 text-(--primary)" />

          <h1 className="text-2xl font-bold text-(--text-primary)">
            No course selected
          </h1>

          <p className="mt-2 text-(--text-secondary)">
            Please select a course before proceeding to checkout.
          </p>

          <button
            type="button"
            onClick={() => navigate("/courses")}
            className="mt-6 rounded-lg bg-(--primary) px-5 py-3 font-medium text-white transition hover:opacity-90"
          >
            Browse Courses
          </button>
        </div>
      </section>
    );
  }

  const price = Number(course.price);
  const safePrice = Number.isFinite(price) && price >= 0 ? price : 0;

  const formattedPrice = new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
  }).format(safePrice);

  const handleContinue = async () => {
    if (isProcessing) return;

    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (!token) {
      navigate("/signin");
      return;
    }

    if (!course?.id) {
      setNotice("Please select a valid course.");
      return;
    }

    if (!API_URL) {
      setNotice("The API URL is not configured.");
      return;
    }

    // Reuse the key when retrying this same request.
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = crypto.randomUUID();
    }

    setIsProcessing(true);
    setNotice("");

    try {
      const response = await fetch(
        `${API_URL}/api/payments/checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Idempotency-Key": idempotencyKeyRef.current,
          },
          body: JSON.stringify({
            courseId: course.id,
          }),
        }
      );

      const data = await response.json();

      // Handle an invalid or expired token.
      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        navigate("/signin", { replace: true });
        return;
      }

      // Handle other API errors.
      if (!response.ok) {
        throw new Error(
          data.message || "Unable to start checkout."
        );
      }

      if (!data.checkoutUrl) {
        throw new Error(
          "The payment provider returned no checkout URL."
        );
      }

      // Redirect to Stripe Checkout.
      window.location.assign(data.checkoutUrl);
    } catch (error) {
      console.error("Checkout error:", error);
      setNotice(
        error.message || "Unable to connect to the payment server."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="w-full min-w-0 bg-(--surface-secondary) p-5 sm:p-8">
      <div className="mx-auto max-w-8xl">
        {/* Back to Course */}
        <button
          type="button"
          onClick={() => navigate("/courses")}
          className="mb-6 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-(--text-secondary) transition hover:text-(--primary)"
        >
          <ArrowLeft size={18} />
          Back to courses
        </button>

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-(--primary)">
            MyCode Academy
          </p>

          <h1 className="mt-2 text-3xl font-bold text-(--text-primary)">
            Checkout
          </h1>

          <p className="mt-2 text-(--text-secondary)">
            Review your course and choose a payment method.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
          {/* Payment method section */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-(--border) bg-(--surface) p-5 sm:p-7">
              <div className="mb-5">
                <h2 className="text-xl font-bold text-(--text-primary)">
                  Payment method
                </h2>

                <p className="mt-1 text-sm text-(--text-secondary)">
                  Choose how you would like to pay.
                </p>
              </div>

              {/* Payment Method */}
              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const selected = paymentMethod === method.id;

                  return (
                    <label
                      key={method.id}
                      className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                        selected
                          ? "border-(--primary) bg-(--primary-soft) ring-1 ring-(--primary)"
                          : "border-(--border) hover:bg-(--surface-secondary)"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={selected}
                        onChange={() => {
                          setPaymentMethod(method.id);
                          setNotice("");
                        }}
                        className="size-4 accent-(--primary)"
                      />

                      <div
                        className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${
                          selected
                            ? "bg-(--primary-soft) text-(--primary)"
                            : "bg-(--surface-secondary) text-(--text-secondary)"
                        }`}
                      >
                        <Icon size={22} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-(--text-primary)">
                          {method.title}
                        </p>

                        <p className="mt-1 text-sm text-(--text-secondary)">
                          {method.description}
                        </p>
                      </div>

                      {selected && (
                        <CheckCircle2
                          size={20}
                          className="shrink-0 text-(--primary)"
                        />
                      )}
                    </label>
                  );
                })}
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-xl bg-(--surface-secondary) p-4">
                <LockKeyhole
                  size={20}
                  className="mt-0.5 shrink-0 text-(--text-secondary)"
                />

                <div>
                  <p className="text-sm font-semibold text-(--text-primary)">
                    Secure checkout
                  </p>

                  <p className="mt-1 text-xs leading-5 text-(--text-secondary)">
                    Payment details will be handled through a payment provider
                    when the gateway is integrated. This page does not collect
                    or store card numbers or security codes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <aside className="h-fit rounded-2xl border border-(--border) bg-(--surface) p-5 sm:p-7">
            <h2 className="text-xl font-bold text-(--text-primary)">
              Order summary
            </h2>

            {/* Course Price */}
            <div className="mt-5 flex gap-4">
              {course.imageUrl ? (
                <img
                  src={course.imageUrl}
                  alt={course.title || "Course"}
                  className="size-20 shrink-0 rounded-xl object-cover"
                />
              ) : (
                <div
                  className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-(--primary-soft)"
                >
                  <BookOpen size={30} className="text-(--primary)" />
                </div>
              )}

              <div className="min-w-0">
                <h3 className="font-bold text-(--text-primary)">
                  {course.title || "Selected course"}
                </h3>

                <p className="mt-1 text-sm text-(--text-secondary)">
                  {course.category || "Online course"}
                </p>

                {course.level && (
                  <p className="mt-1 text-xs text-(--text-muted)">
                    {course.level}
                    {course.duration ? ` · ${course.duration}` : ""}
                  </p>
                )}
              </div>
            </div>

            <div className="my-6 border-t border-dashed border-(--border)" />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4 text-(--text-secondary)">
                <span>Course price</span>
                <span>{formattedPrice}</span>
              </div>

              <div className="flex justify-between gap-4 text-(--text-secondary)">
                <span>Discount</span>
                <span>RM 0.00</span>
              </div>
            </div>

            <div className="my-5 border-t border-(--border)" />

            {/* Total */}
            <div className="flex items-center justify-between gap-4">
              <span className="font-semibold text-(--text-primary)">
                Total
              </span>

              <span className="text-2xl font-bold text-(--text-primary)">
                {formattedPrice}
              </span>
            </div>

            <button
              type="button"
              onClick={handleContinue}
              disabled={isProcessing}
              className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-(--primary) px-5 py-3.5 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isProcessing
                ? "Preparing Checkout..."
                : "Continue to Payment"}
            </button>

            {notice && (
              <p
                role="status"
                className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm leading-5 text-amber-600 dark:text-amber-400"
              >
                {notice}
              </p>
            )}

            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-(--text-muted)">
              <ShieldCheck size={16} />
              Your payment should be verified securely by the server.
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default StudentCheckout;
