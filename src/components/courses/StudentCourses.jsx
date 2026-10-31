
import { useEffect, useState } from "react";
import { Code2 } from "lucide-react";

import CourseCard from "../courses/CourseCard";
import StudentCourseFilter from "../courses/StudentCourseFilter";
import CourseDetailModal from "../dashboard/modals/CourseDetailModal";
import Search_Sortbar from "../courses/Search_Sortbar";
import CourseListView from "../courses/CourseListView";

const API_URL = import.meta.env.VITE_API_URL;

    const initialFilters = {
      category: "",
      level: "",
      priceRange: "",
      duration: "",
    };

function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      
      try {
        setLoading(true);
        setError("");

//*********************** Fetch published courses. The student page will filter ******************
//*********************** the courses locally, without changing the admin page. ******************
        
        const response = await fetch(
          `${API_URL}/api/courses/public?page=1&limit=1000`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch courses.");
        }

        const data = await response.json();

        const normalizedCourses = (data.courses || []).map((course) => ({
            ...course,
            price: Number(course.price),
            icon: course.icon || Code2,
            color: course.color || "#DBEAFE",
            students: course.students ?? 0,
        }));

        setCourses(normalizedCourses);
      } catch (err) {
        console.error("Fetch student courses error:", err);
        setError("Unable to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

    const [viewMode, setViewMode] = useState("grid");
    const [sortBy, setSortBy] = useState("newest");
    const [searchQuery, setSearchQuery] = useState("");




// ********************************************* Filter Courses *********************************
  
const normalizedQuery = searchQuery.trim().toLowerCase();

// Filter courses using search and the existing student filters
const filteredCourses = courses.filter((course) => {
  const { category, level, priceRange, duration } = appliedFilters;
  const price = Number(course.price);

  // Search by title, category, description, or instructor
  const instructorName =
    typeof course.instructor === "string"
      ? course.instructor
      : course.instructor?.name;

  const searchableText = [
    course.title,
    course.category,
    course.description,
    instructorName,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const matchesSearch =
  !normalizedQuery ||
  String(course.title || "")
    .toLowerCase()
    .includes(normalizedQuery);

  const matchesCategory =
    !category || course.category === category;

  const matchesLevel =
    !level || course.level === level;

  const matchesPrice =
    !priceRange ||
    (priceRange === "0-500" && price >= 0 && price <= 500) ||
    (priceRange === "500-1000" && price > 500 && price <= 1000) ||
    (priceRange === "1000+" && price > 1000);

  // Convert duration to weeks for comparison
  const durationText = String(course.duration || "").toLowerCase();
  const durationNumber = Number(
    durationText.match(/\d+(\.\d+)?/)?.[0]
  );

  const durationInWeeks = durationText.includes("month")
    ? durationNumber * 4.345
    : durationNumber;

  const matchesDuration =
    !duration ||
    (duration === "under-4" && durationInWeeks < 4) ||
    (duration === "4-8" &&
      durationInWeeks >= 4 &&
      durationInWeeks <= 8) ||
    (duration === "9-12" &&
      durationInWeeks >= 9 &&
      durationInWeeks <= 12) ||
    (duration === "over-12" && durationInWeeks > 12);

  return (
    matchesSearch &&
    matchesCategory &&
    matchesLevel &&
    matchesPrice &&
    matchesDuration
  );
});

// Sort the matching courses
      const sortedCourses = [...filteredCourses].sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return (
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
            );

          case "oldest":
            return (
              new Date(a.createdAt || 0).getTime() -
              new Date(b.createdAt || 0).getTime()
            );

          case "price":
            return Number(a.price) - Number(b.price);

          default:
            return 0;
        }
      });

      // Pagination
      const COURSES_PER_PAGE = 6;

      const filteredTotalPages = Math.ceil(
        sortedCourses.length / COURSES_PER_PAGE
      );

      const safeCurrentPage = Math.min(
        currentPage,
        Math.max(filteredTotalPages, 1)
      );

      const visibleCourses = sortedCourses.slice(
        (safeCurrentPage - 1) * COURSES_PER_PAGE,
        safeCurrentPage * COURSES_PER_PAGE
      );


    const handleApply = () => {
      setAppliedFilters(draftFilters);
      setCurrentPage(1);
    };

    const handleClear = () => {
      setDraftFilters(initialFilters);
      setAppliedFilters(initialFilters);
      setCurrentPage(1);
    };

  return (
    <section className="w-full min-w-0 p-5 sm:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-(--text-primary)">
          Explore Courses
        </h1>

        <p className="mt-2 text-(--text-secondary)">
          Find the right course for your learning journey.
        </p>
      </div>

{/***************************************** Search_Sort Bar ****************************************** */}
    
      <Search_Sortbar
        setViewMode={setViewMode}
        viewMode={viewMode}
        sortBy={sortBy}
        setSortBy={(value) => {
          setSortBy(value);
          setCurrentPage(1);
        }}
        searchQuery={searchQuery}
        setSearchQuery={(value) => {
          setSearchQuery(value);
          setCurrentPage(1);
        }}
      />

    

{/***************************************** Filter ****************************************** */}
      <div className="mb-8 rounded-xl border border-(--border) bg-(--surface) p-5">
        <StudentCourseFilter
          draftFilters={draftFilters}
          setDraftFilters={setDraftFilters}
          onApply={handleApply}
          onClear={handleClear}
        />
      </div>

      {loading && (
            <p className="py-12 text-center text-(--text-secondary)">
              Loading courses...
            </p>
          )}

          {!loading && error && (
            <p className="py-12 text-center text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          {!loading && !error && visibleCourses.length === 0 && (
            <p className="py-12 text-center text-(--text-secondary)">
              No courses match your filters.
            </p>
          )}

          {!loading && !error && visibleCourses.length > 0 && (
            <>
              <div className="mb-5 text-sm text-(--text-secondary)">
                Showing {visibleCourses.length} of {filteredCourses.length} courses
              </div>


          {viewMode === "list" ? (
            <CourseListView
              courses={visibleCourses}
              onCourseClick={setSelectedCourse}
            />
          ) : (
            <div className="grid w-full min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {visibleCourses.map((course) => (
                <div
                  key={course.id}
                  className="w-full min-w-0 *:w-full! *:max-w-none!"
                  onClick={() => setSelectedCourse(course)}
                >
                  <CourseCard
                    coursesData={course}
                    isAdmin={false}
                  />
                </div>
              ))}
            </div>
          )}



{/*********************************** Previous,Next and Page Numbers*******************************/}
    
          {filteredTotalPages > 1 && (
            <nav
              aria-label="Course pagination"
              className="mt-8 flex items-center justify-center gap-3"
            >
              <button
                type="button"
                disabled={safeCurrentPage === 1}
                onClick={() => setCurrentPage((page) => page - 1)}
                className="cursor-pointer rounded-lg border border-(--border) px-4 py-2 text-(--text-secondary) transition hover:bg-(--surface-secondary) disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-sm text-(--text-secondary)">
                Page {safeCurrentPage} of {filteredTotalPages}
              </span>

              <button
                type="button"
                disabled={safeCurrentPage >= filteredTotalPages}
                onClick={() => setCurrentPage((page) => page + 1)}
                className="cursor-pointer rounded-lg border border-(--border) px-4 py-2 text-(--text-secondary) transition hover:bg-(--surface-secondary) disabled:opacity-40"
              >
                Next
              </button>
            </nav>
          )}
        </>
      )}

      {selectedCourse && (
        <CourseDetailModal
          selectedCourse={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </section>
  );
}

export default StudentCourses;
