
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useDashboard } from "../../context/DashboardContext";

import PaymentOverviewHighlight from "./highlights/PaymentOverviewHighlight";
import StudentUpdateHighlight from "./highlights/StudentUpdateHighlight";
import EnrollmentOverviewHighlight from "./highlights/EnrollmentOverviewHighlight";
import RevenueInsightsHighlight from "./highlights/RevenueInsightsHighlight";

function ShowHighlights() {
  const { dashboardData, loading, error } = useDashboard();

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      id: "payment",
      component: (
        <PaymentOverviewHighlight
          paymentStatus={dashboardData?.paymentStatus}
        />
      ),
    },
    {
      id: "student",
      component: (
        <StudentUpdateHighlight
          recentActivities={dashboardData?.recentActivities}
        />
      ),
    },
    {
      id: "enrollment",
      component: (
        <EnrollmentOverviewHighlight
          statistics={dashboardData?.statistics}
        />
      ),
    },
    {
      id: "revenue",
      component: (
            <RevenueInsightsHighlight
                statistics={dashboardData?.statistics}
                revenueOverview={dashboardData?.revenueOverview}
                paymentStatus={dashboardData?.paymentStatus}
              />
      ),
    },
  ];

  const totalSlides = slides.length;

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % totalSlides);
  };

  const previousSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? totalSlides - 1 : prev - 1
    );
  };

  useEffect(() => {
    if (isPaused || loading || error) return;

    const timer = setInterval(nextSlide, 5000);

    return () => clearInterval(timer);
  }, [isPaused, loading, error]);

  if (loading) {
    return (
      <div className="flex min-h-113 items-center justify-center rounded-xl bg-white shadow-sm">
        <p className="text-sm text-gray-500">
          Loading highlights...
        </p>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="flex min-h-113 items-center justify-center rounded-xl bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">
          Highlights are currently unavailable.
        </p>
      </div>
    );
  }

  return (
    <div
      className="relative flex min-h-113 w-full items-center justify-center rounded-xl bg-white p-2 shadow-sm"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <button
        type="button"
        onClick={previousSlide}
        aria-label="Previous highlight"
        className="cursor-pointer absolute left-3 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/90 p-2 text-slate-700 shadow-md transition hover:bg-white"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="relative h-[90%] w-[90%] min-w-0 overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${current * 100}%)`,
          }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="h-full w-full min-w-0 shrink-0 basis-full"
            >
              {slide.component}
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next highlight"
        className="cursor-pointer absolute right-3 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/90 p-2 text-slate-700 shadow-md transition hover:bg-white"
      >
        <ChevronRight size={18} />
      </button>

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setCurrent(index)}
            aria-label={`Go to ${slide.id}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              current === index
                ? "w-6 bg-blue-600"
                : "w-2 bg-slate-300 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default ShowHighlights;
