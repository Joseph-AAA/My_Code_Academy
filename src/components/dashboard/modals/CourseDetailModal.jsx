
import {
  X,
  Clock3,
  UsersRound,
  Star,
  BookOpen,
  Code2,
} from "lucide-react";
import { getCourseBackground } from "../../courses/CourseColor";
import { useNavigate } from "react-router-dom";

function CourseDetailModal({ selectedCourse, onClose }) {

    const navigate = useNavigate();

    const storedUser =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    let user = null;

    try {
      user = storedUser ? JSON.parse(storedUser) : null;
    } catch {
      user = null;
    }

    const handleEnroll = () => {
      if (!user) {
        navigate("/signin");
        return;
      }

      if (user.role === "STUDENT") {
        onClose();
        navigate("/payment/checkout", {
          state: { course: selectedCourse },
        });
      }
    };


//*************************** Support prices from both the database and courseData.js.*******************
    const price = Number(
      String(selectedCourse.price ?? "").replace(/[^0-9.-]/g, "")
    );

    const formattedPrice = Number.isFinite(price)
      ? `RM ${price.toLocaleString("en-MY", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })}`
      : "Price unavailable";

  // Support both instructor image properties.
  const instructorImage =
    selectedCourse.instructor?.imageUrl ||
    selectedCourse.instructor?.image;

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
          {/* Course image or icon */}
          <div
            style={{
              backgroundColor: getCourseBackground(selectedCourse.color),
            }}
            className="flex h-20 w-20 md:h-36 md:w-36 shrink-0 items-center justify-center overflow-hidden rounded-2xl"
          >
            {selectedCourse.imageUrl ? (
              <img
                src={selectedCourse.imageUrl}
                alt={selectedCourse.title}
                className="h-15 w-15 md:h-25 md:w-25 rounded-xl object-contain"
              />
            ) : typeof selectedCourse.icon === "string" ? (
              <img
                src={selectedCourse.icon}
                alt={selectedCourse.title}
                className="h-25 w-25 object-contain"
              />
            ) : (
              (() => {
                const Icon = selectedCourse.icon || Code2;

                return (
                  <Icon
                    size={48}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                );
              })()
            )}
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
            <Clock3 size={21} className="text-blue-500" />
            <span>Duration: {selectedCourse.duration}</span>
          </div>

          {/* Students */}
          <div className="flex items-center gap-3 text-gray-600">
            <UsersRound size={21} className="text-purple-500" />
            <span>Students: {selectedCourse.students}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3 text-gray-600">
            <Star size={21} className="text-yellow-500" />
            <span>Rating: {selectedCourse.rating ?? "N/A"}</span>
          </div>

          {/* Lessons */}
          <div className="flex items-center gap-3 text-gray-600">
            <BookOpen size={21} className="text-green-500" />
            <span>Lessons: {selectedCourse.totalLessons ?? "N/A"}</span>
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
            {instructorImage ? (
              <img
                src={instructorImage}
                alt={selectedCourse.instructor?.name || "Instructor"}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-500 font-semibold text-white">
                {selectedCourse.instructor?.name?.charAt(0) || "?"}
              </div>
            )}

            <div>
              <p className="font-medium text-gray-800">
                {selectedCourse.instructor?.name || "Instructor not assigned"}
              </p>

              <p className="text-sm text-gray-500">
                {selectedCourse.instructor?.title || ""}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="text-2xl font-bold text-gray-800">
            {formattedPrice}
          </p>

            <button
                  type="button"
                  onClick={handleEnroll}
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