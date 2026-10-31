
import { Code2, BookOpen } from "lucide-react";

const courseIcons = {
  Code2,
  BookOpen,
};

function TopCoursesModal({ topCourses = [], closeModal }) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-4">
      <div
        className="w-full max-w-xl rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Top Courses Modal Header */}
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="text-xl font-bold">Top Courses</h2>

            <p className="text-sm text-(--text-secondary)">
              Courses ranked by active enrollments
            </p>
          </div>

          <button
            className="hover:cursor-pointer hover:text-red-500 hover:font-extrabold"
            onClick={closeModal}
          >
            ✕
          </button>
        </div>

        {/* Top Courses */}
        <div className="max-h-[65vh] overflow-y-auto p-5">

          {topCourses.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">
              No course enrollments available yet.
            </p>
          ) : (
           topCourses.map((course, index) => {
              const Icon = courseIcons[course.icon] || BookOpen;
              const courseColor = course.color || "#f3f4f6";

              return (
                <div
                  className={`w-full flex min-h-15 mb-3 gap-3 items-center border-b border-gray-100 pb-3 ${
                    index === topCourses.length - 1
                      ? "border-b-0 pb-2 mb-0"
                      : ""
                  }`}
                  key={course.id}
                >
                  {/* Course Icon */}
                  <span
                    className="h-15 w-15 rounded-md flex justify-center items-center border border-gray-200 shadow-md shrink-0 overflow-hidden"
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

                      <p className="text-gray-400">
                        {course.students} students
                      </p>
                    </span>

                    {/* Level Badge */}
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

        {/* Top Courses Modal Footer */}
        <div className="border-t p-4 text-right">
          <button
            onClick={closeModal}
            className="rounded-lg hover:cursor-pointer hover:bg-blue-700 bg-blue-600 px-4 py-2 text-sm font-medium text-white"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

export default TopCoursesModal;
