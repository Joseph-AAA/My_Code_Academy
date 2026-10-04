import {
  X,
  Clock3,
  UsersRound,
  Star,
  BookOpen,
} from "lucide-react";

function CourseDetailModal({selectedCourse,onClose}){
//    if (!selectedCourse) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-[90%] lg:w-[50%] max-w-3xl max-h-[95vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close course details"
          className="absolute right-5 top-5 z-10 cursor-pointer text-gray-400 transition hover:text-gray-700"
        >
          <X size={28} />
        </button>

        {/* Course header */}
        <div className="flex items-center gap-5 pr-10">
          {/* Course icon */}
          <div
            className={`flex h-36 w-36 shrink-0 items-center justify-center rounded-2xl ${selectedCourse.color}`}
          >
            <img
              src={selectedCourse.icon}
              alt={selectedCourse.title}
              className="h-24 w-24 object-contain"
            />
          </div>

          {/* Title */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedCourse.title}
            </h2>

            <p className="mt-1 text-gray-500">
              {selectedCourse.category} • {selectedCourse.level}
            </p>
          </div>
        </div>

        {/* Course statistics */}
        <div className="mt-5 grid grid-cols-2 gap-y-5 sm:grid-cols-2">
          {/* Duration */}
          <div className="flex items-center gap-3 text-gray-600">
            <Clock3
              size={21}
              className="text-blue-500"
            />
            <span>
              Duration: {selectedCourse.duration}
            </span>
          </div>

          {/* Students */}
          <div className="flex items-center gap-3 text-gray-600">
            <UsersRound
              size={21}
              className="text-purple-500"
            />
            <span>
              Students: {selectedCourse.students}
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3 text-gray-600">
            <Star
              size={21}
              className="text-yellow-500"
            />
            <span>
              Rating: {selectedCourse.rating}
            </span>
          </div>

          {/* Lessons */}
          <div className="flex items-center gap-3 text-gray-600">
            <BookOpen
              size={21}
              className="text-green-500"
            />
            <span>
              Lessons: {selectedCourse.totalLessons}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="mt-6 text-base leading-7 text-gray-600">
          {selectedCourse.description}
        </p>

        {/* Instructor */}
        <div className="mt-5 rounded-2xl bg-gray-50 p-5">
          <h3 className="mb-4 font-semibold text-gray-800">
            Instructor
          </h3>

          <div className="flex items-center gap-4">
            {selectedCourse.instructor?.image ? (
              <img
                src={selectedCourse.instructor.image}
                alt={selectedCourse.instructor.name}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 font-semibold text-white">
                {selectedCourse.instructor?.name?.charAt(0)}
              </div>
            )}

            <div>
              <p className="font-medium text-gray-800">
                {selectedCourse.instructor?.name}
              </p>

              <p className="text-sm text-gray-500">
                {selectedCourse.instructor?.title}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="text-2xl font-bold text-gray-800">
            {selectedCourse.price}
          </p>

          <button
            type="button"
            onClick={() => {
              console.log("Enroll:", selectedCourse.title);
            }}
            className="cursor-pointer rounded-2xl bg-blue-600 px-7 py-3 text-white transition hover:bg-blue-700"
          >
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default CourseDetailModal;