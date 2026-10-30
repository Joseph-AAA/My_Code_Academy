
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
  const topCourses = courses.slice(0, 7);

  return (
    <div className="w-full bg-white min-h-92 rounded-xl flex justify-center items-center">
      <div className="w-[90%] h-[90%] mt-2 rounded-2xl">

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
          <p className="py-6 text-sm text-gray-500">
            No course enrollments available yet.
          </p>
        ) : (
          topCourses.map((course) => {
            const Icon = courseIcons[course.icon] || BookOpen;

            return (
              <div
                className="w-full flex min-h-15 mb-3 gap-3 items-center"
                key={course.id}
              >
               <span
                    className="h-15 w-15 rounded-md flex justify-center items-center border border-gray-200 shadow-md shrink-0 overflow-hidden"
                    style={{
                        backgroundColor: course.color || "#f3f4f6",
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

                <div className="w-full flex justify-between items-center gap-2">
                  <span className="text-sm flex flex-col min-w-0">
                    <h3 className="font-bold truncate">
                      {course.title}
                    </h3>

                    <p className="text-gray-400">
                      {course.students} students
                    </p>
                  </span>

                  <span className="bg-gray-100 shadow-sm text-sm p-2 rounded-md shrink-0">
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
