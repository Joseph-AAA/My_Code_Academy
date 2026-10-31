
import { useState } from "react";
import { ArrowRight, Code2, BookOpen } from "lucide-react";
import { useDashboard } from "../../context/DashboardContext";
import TopCoursesModal from "./modals/TopCoursesModal";

const courseIcons = {
  Code2,
  BookOpen,
};

function TopCourses() {
  const [showTopCourses, setShowTopCourses] = useState(false);

  const { dashboardData } = useDashboard();

  const courses = dashboardData?.topCourses || [];
  const topCourses = courses.slice(0, 5);

  return (
    <div className="border border-(--border) w-full bg-(--surface) text-(--text-primary) min-h-92 rounded-xl flex justify-center items-center">
      <div className="w-[90%] h-[90%] mt-4 rounded-2xl">

        {/* Top Courses Header */}
        <div className="flex justify-between mb-3">
          <h3 className="font-bold">Top Courses</h3>

          <button
            className="text-sm md:text-md text-blue-600 flex gap-1 cursor-pointer hover:underline underline-offset-4"
            onClick={() => setShowTopCourses(true)}
          >
            View All <ArrowRight />
          </button>
        </div>

        {/* Top Courses Modal */}
        {showTopCourses && (
          <TopCoursesModal
            topCourses={courses}
            closeModal={() => setShowTopCourses(false)}
          />
        )}

        {/* Top Courses Data */}
        {topCourses.length === 0 ? (
          <p className="py-6 text-sm text-(--text-secondary)">
            No course enrollments available yet.
          </p>
        ) : (
          topCourses.map((course, index) => {
            const Icon = courseIcons[course.icon] || BookOpen;
            const courseColor = course.color || "#f3f4f6";

            return (
              <div
                className={`w-full flex min-h-15 mb-3 gap-3 items-center border-b border-(--border) pb-3 ${
                  index === topCourses.length - 1
                    ? "last:border-b-0 last:pb-0 last:mb-3"
                    : ""
                }`}
                key={course.id}
              >
                {/* Course Logo */}
                <span
                  className="h-15 w-15 rounded-md flex justify-center items-center border border-(--border) shadow-md shrink-0 overflow-hidden"
                  style={{
                    backgroundColor: courseColor,
                  }}
                >
                  {course.imageUrl ? (
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="h-12 w-12 object-cover"
                    />
                  ) : (
                    <Icon size={28} className="text-white" />
                  )}
                </span>

                {/* Course Details */}
                <div className="w-full flex justify-between items-center gap-2">
                  <span className="text-sm flex flex-col min-w-0">
                    <h3 className="font-bold truncate">
                      {course.title}
                    </h3>

                   <p className="text-(--text-secondary)">
                      {course.students} students
                   </p>
                  </span>

                  {/* Course Level Badge */}
                 <span
                    className="text-sm font-medium px-3 py-2 rounded-md shrink-0 text-white"
                    style={{
                      backgroundColor: courseColor,
                    }}
                  >
                    {course.level}
                  </span>
                </div>
              </div>
            );
          })
        )}

      </div>
    </div>
  );
}

export default TopCourses;
