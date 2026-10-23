
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Code2,
  Globe,
  Database,
  Monitor,
  BookOpen,
} from "lucide-react";

import CourseCard from "./CourseCard";
import CourseDetailModal from "../dashboard/modals/CourseDetailModal";

const API_URL = import.meta.env.VITE_API_URL;

const COURSES_PER_PAGE = 9;
const MAX_GUEST_PAGES = 2;

const iconMap = {
  Code2,
  Globe,
  Database,
  Monitor,
  BookOpen,
};

function PublicCourses() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/courses`);

        if (!response.ok) {
          throw new Error("Failed to fetch courses.");
        }

        const data = await response.json();

        const publishedCourses = (data.courses || [])
          .filter((course) => course.status === "Published")
          .map((course) => ({
            ...course,
            price: Number(course.price),
            icon: iconMap[course.icon] || Code2,
            color: course.color || "#DBEAFE",
            students: course.students ?? 0,
          }));

        setCourses(publishedCourses);
      } catch (err) {
        console.error("Fetch public courses error:", err);
        setError("Unable to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const totalPages = Math.ceil(
    courses.length / COURSES_PER_PAGE
  );

  const guestLimitReached =
    totalPages > MAX_GUEST_PAGES &&
    currentPage > MAX_GUEST_PAGES;

  const visibleCourses = courses.slice(
    (currentPage - 1) * COURSES_PER_PAGE,
    currentPage * COURSES_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="mx-auto w-full max-w-[1920px] px-8 py-10">
      {/* Page heading */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Explore Our Courses
        </h1>

        <p className="mt-3 text-gray-600">
          Build your skills with practical programming courses.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <p className="py-16 text-center text-gray-500">
          Loading courses...
        </p>
      )}

      {/* Error */}
      {!loading && error && (
        <p className="py-16 text-center text-red-600">
          {error}
        </p>
      )}

      {/* Empty state */}
      {!loading && !error && courses.length === 0 && (
        <p className="py-16 text-center text-gray-500">
          No published courses available yet.
        </p>
      )}

      {/* Sign-up prompt for page 3 and beyond */}
      {!loading &&
        !error &&
        courses.length > 0 &&
        guestLimitReached && (
          <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Discover More Courses
            </h2>

            <p className="mt-3 text-gray-600">
              Create a free account to explore more courses
              and start your learning journey with My Code Academy.
            </p>

            <Link
              to="/signup"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Sign Up for Free
            </Link>

            <p className="mt-4 text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="font-medium text-blue-600 hover:underline"
              >
                Sign in
              </Link>
            </p>

            <button
              type="button"
              onClick={() => handlePageChange(MAX_GUEST_PAGES)}
              className="mt-5 text-sm text-gray-600 hover:text-blue-600"
            >
              Back to courses
            </button>
          </div>
        )}

      {/* Course grid and pagination */}
      {!loading &&
        !error &&
        courses.length > 0 &&
        !guestLimitReached && (
          <>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {visibleCourses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                >
                  <CourseCard
                    coursesData={course}
                    isAdmin={false}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav
                aria-label="Course pagination"
                className="mt-10 flex flex-wrap items-center justify-center gap-2"
              >
                <button
                  type="button"
                  onClick={() =>
                    handlePageChange(currentPage - 1)
                  }
                  disabled={currentPage === 1}
                  className="hover:cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                {Array.from(
                  {
                    length: Math.min(
                      totalPages,
                      MAX_GUEST_PAGES + 1
                    ),
                  },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    aria-current={
                      currentPage === page ? "page" : undefined
                    }
                    className={`rounded-lg border px-4 py-2 text-sm hover:cursor-pointer ${
                      currentPage === page
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    handlePageChange(currentPage + 1)
                  }
                  disabled={
                    currentPage >=
                    Math.min(totalPages, MAX_GUEST_PAGES + 1)
                  }
                  className="hover:cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </nav>
            )}
          </>
        )}

      {/* Selected course details */}
      {selectedCourse && (
        <CourseDetailModal
          selectedCourse={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </section>
  );
}

export default PublicCourses;
