import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import PaymentRemiderHighlight from "./highlights/PaymentRemiderHighlight";
import UpcomingClassHighlight from "./highlights/UpcomingClassHighlight";
import CourseUpdateHighlight from "./highlights/CourseUpdateHighlight";
import StudentUpdateHighlight from "./highlights/StudentUpdateHighlight";

function ShowHighlights() {
  const slides = [
    {
      id: "payment",
      component: <PaymentRemiderHighlight />,
    },
    {
      id: "class",
      component: <UpcomingClassHighlight />,
    },
    {
      id: "course",
      component: <CourseUpdateHighlight />,
    },
    {
      id: "student",
      component: <StudentUpdateHighlight />,
    },
  ];

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalSlides = slides.length;

  // Next slide
        const nextSlide = () => {
          setCurrent((prev) => (prev + 1) % totalSlides);
        };

  // Previous slide
        const previousSlide = () => {
            setCurrent((prev)=>{
                return prev === 0 ? totalSlides - 1 : prev - 1
            })
        };

  // Auto play
        useEffect(() => {
            if (isPaused) return;

            const timer = setInterval(()=>{
            return nextSlide()
        },5000)

    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <div
        className="relative flex h-108 w-full items-center justify-center 
                  rounded-xl bg-white p-2 shadow-sm"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
    >
         {/* Previous button */}
        <button
          type="button"
          onClick={previousSlide}
          aria-label="Previous highlight"
          className="hover:cursor-pointer
            absolute left-3 top-1/2
            flex -translate-y-1/2
            items-center justify-center
            rounded-full bg-white/90 p-2
            text-slate-700 shadow-md
            transition z-1
            hover:bg-white
          "
        >
          <ChevronLeft size={18} className="" />
        </button>
      <div className="relative h-[90%] w-[90%] min-w-0 overflow-hidden rounded-2xl">
        
         <div className="flex transition-transform duration-500 ease-in-out"
            style={{
                transform: `translateX(-${current * 100}%)`,
              }}>
              {slides.map((slide)=>{
                return <div key={slide.id} className = "h-full w-full min-w-0 shrink-0 basis-full">
                          {slide.component}
                      </div>
              })}
          </div>
        </div>
      
       {/* Next button */}
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next highlight"
          className="hover:cursor-pointer
            absolute right-3 top-1/2
            flex -translate-y-1/2
            items-center justify-center
            rounded-full bg-white/90 p-2
            text-slate-700 shadow-md
            transition
            hover:bg-white
          "
        >
          <ChevronRight size={18} />
        </button>
        
        
        {/* Dots */}
        <div
          className="
            absolute bottom-5 left-1/2
            flex -translate-x-1/2
            items-center gap-2
          "
        >
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrent(index)}
              aria-label={`Go to ${slide.id}`}
              className={`hover:cursor-pointer
                h-2 rounded-full
                transition-all duration-300
                ${
                  current === index
                    ? "w-6 bg-blue-600"
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                }
              `}
            />
          ))}
        </div>
    </div>
  );
}

export default ShowHighlights;