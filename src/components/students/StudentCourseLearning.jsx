
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function StudentCourseLearning() {
  const { courseId } = useParams();

  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchEnrollment = async () => {
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      if (!token) {
        setError("Please sign in to access your course.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/enrollments/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load course."
          );
        }

        const selectedEnrollment = (
          data.enrollments || []
        ).find(
          (item) =>
            String(item.course?.id) === String(courseId)
        );

        if (!selectedEnrollment) {
          throw new Error(
            "This course is not in your active enrollments."
          );
        }

        if (!cancelled) {
          setEnrollment(selectedEnrollment);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message || "Something went wrong."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchEnrollment();

    return () => {
      cancelled = true;
    };
  }, [courseId]);

  if (loading) {
    return (
      <div className="p-6 text-gray-600">
        Loading course...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="mb-4 text-red-600">{error}</p>

        <Link
          to="/my-enrollments"
          className="text-blue-600 hover:underline"
        >
          Back to My Enrollments
        </Link>
      </div>
    );
  }

  const course = enrollment.course;
  const title = course.title || "Untitled course";

  const tutorials = [1, 2, 3, 4, 5].map((number) => ({
    number,
    title: `${title} Tutorial ${number}`,
  }));

  return (
    <div className="w-full p-6">
      <Link
        to="/my-enrollments"
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600"
      >
        <ArrowLeft size={16} />
        Back to My Enrollments
      </Link>

      {/* Course header */}
      <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          {course.imageUrl ? (
            <img
              src={course.imageUrl}
              alt={`${title} logo`}
              className="h-20 w-20 rounded-xl object-contain"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-blue-50">
              <BookOpen
                size={36}
                className="text-blue-600"
              />
            </div>
          )}

          <div>
            <p className="mb-2 text-sm font-medium text-blue-700">
              {course.category || "Course"}
            </p>

            <h1 className="text-2xl font-bold text-gray-900">
              {title}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {tutorials.length} tutorials
            </p>
          </div>
        </div>

        {course.description && (
          <p className="mt-5 leading-6 text-gray-600">
            {course.description}
          </p>
        )}
      </div>

      {/* Tutorial heading */}
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900">
          Course Content
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Explore the tutorials included in this course.
        </p>
      </div>

      {/* Tutorial cards */}
      <div className="grid grid-cols-1 gap-4">
        {tutorials.map((tutorial) => (
          <article
            key={tutorial.number}
            className="rounded-xl border border-gray-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 font-bold text-blue-700">
                {String(tutorial.number).padStart(2, "0")}
              </div>

              <h3 className="flex-1 font-semibold text-gray-900">
                {tutorial.title}
              </h3>

              {course.imageUrl ? (
                <img
                  src={course.imageUrl}
                  alt={`${title} logo`}
                  className="h-10 w-10 shrink-0 object-contain"
                />
              ) : (
                <BookOpen
                  size={32}
                  className="shrink-0 text-blue-600"
                />
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default StudentCourseLearning;
