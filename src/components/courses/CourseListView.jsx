
import { Clock, BookOpen } from "lucide-react";

function CourseListView({ courses, onCourseClick }) {
  return (
    <div className="w-full space-y-2">
      {courses.map((course) => (
        <div
          key={course.id}
          onClick={() => onCourseClick(course)}
          className="bg-white border border-(--border) rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer"
        >
          <div
            className={`${course.color} shadow-md h-12 w-12 flex items-center justify-center rounded-lg shrink-0`}
          >
            <img
              className="w-8"
              src={course.icon}
              alt={course.title}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-gray-800">
              {course.title}
            </h3>
            <p className="text-xs text-gray-500">
              {course.category} • {course.level}
            </p>
          </div>

          <div className="hidden md:flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {course.duration}
            </span>

            <span className="font-medium text-gray-700">
              {course.price}
            </span>

            <span className="flex items-center gap-1">
              <BookOpen size={12} />
              {course.students} students
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CourseListView;
