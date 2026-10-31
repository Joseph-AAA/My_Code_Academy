import { useEffect, useState } from "react";
import {
  Code2,
  Globe,
  Database,
  Monitor,
  BookOpen,
} from "lucide-react";

      import CourseCard from "./CourseCard";
      import CourseDetailModal from "./../dashboard/modals/CourseDetailModal";
      import CourseListView from "./CourseListView";
      import DeleteCourseConfirmationModal from "./DeleteCourseConfirmationModal";
      import EditCourseModal from "./EditCourseModal";


const API_URL = import.meta.env.VITE_API_URL;

const iconMap = {
                  Code2,
                  Globe,
                  Database,
                  Monitor,
                  BookOpen,
                };

function CoursesController({viewMode,sortBy,searchQuery,appliedFilters,refreshKey}){
  
          const [courses, setCourses] = useState([]);
          const [selectedCourse, setSelectedCourse] = useState(null);
          const [loading, setLoading] = useState(true);
          const [error, setError] = useState("");

          const [courseToEdit, setCourseToEdit] = useState(null);

    //******************************  Delete course states *************************
          const [courseToDelete, setCourseToDelete] = useState(null);
          const [isDeleting, setIsDeleting] = useState(false);
          const [deleteError, setDeleteError] = useState("");
          const [deleteSuccess, setDeleteSuccess] = useState(false);

   
    //******************************  Pagination states *************************

          const [currentPage, setCurrentPage] = useState(1);
          const [totalPages, setTotalPages] = useState(0);
          const [totalCourses, setTotalCourses] = useState(0);
          const COURSES_PER_PAGE = 6;

  //*************************** Fetch courses from the Express backend *************************
          useEffect(() => {
          const fetchCourses = async () => {
            try {
              setLoading(true);
              setError("");

              const params = new URLSearchParams({
                page: String(currentPage),
                limit: String(COURSES_PER_PAGE),
                sortBy,
              });

              if (searchQuery.trim()) {
                params.set("search", searchQuery.trim());
              }

              if (appliedFilters.category) {
                params.set("category", appliedFilters.category);
              }

              if (appliedFilters.level) {
                params.set("level", appliedFilters.level);
              }

              if (appliedFilters.priceRange) {
                params.set("priceRange", appliedFilters.priceRange);
              }

              if (appliedFilters.status) {
                params.set("status", appliedFilters.status);
              }

              const response = await fetch(
                `${API_URL}/api/courses?${params.toString()}`
              );

              if (!response.ok) {
                throw new Error("Failed to fetch courses");
              }

              const data = await response.json();

              const normalizedCourses = (data.courses || []).map((course) => ({
                ...course,
                price: Number(course.price),
                icon: iconMap[course.icon] || Code2,
                color: course.color || "#DBEAFE",
              }));

                setCourses(normalizedCourses);
                setTotalPages(data.totalPages ?? 0);
                setTotalCourses(data.totalCourses ?? 0);
                } catch (err) {
                  console.error("Fetch courses error:", err);
                  setError("Unable to load courses. Please try again.");
                } finally {
                  setLoading(false);
                }
              };

          fetchCourses();
       }, [
          currentPage,
          refreshKey,
          searchQuery,
          sortBy,
          appliedFilters,
                  ]);


useEffect(() => {
  setCurrentPage(1);
}, [searchQuery, sortBy, appliedFilters]);



//******************************************* Fetch to Detle Courses *************************************
const handleDeleteCourse = async (courseId) => {
  try {
    setIsDeleting(true);
    setDeleteError("");

    const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/api/courses/${courseId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete course");
    }

    // Remove the deleted course from the list
    setCourses((prevCourses) =>
      prevCourses.filter((course) => course.id !== courseId)
    );

    // Close the detail modal if it shows the deleted course
    setSelectedCourse((prevCourse) =>
      prevCourse?.id === courseId ? null : prevCourse
    );

    // Show success message
    setDeleteSuccess(true);

  } catch (error) {
    console.error("Delete course error:", error);
    setDeleteError(error.message || "Failed to delete course");
  } finally {
    setIsDeleting(false);
  }
};

  return (
    <>

{/**************************************** Course Grid and List View **********************************/}
             
{/* Course Grid and List View */}
      {courses.length === 0 ? (
        <p className="col-span-full py-8 text-center text-2xl font-bold text-gray-500">
          No courses found.
        </p>
      ) : viewMode === "grid" ? (
                <div className="grid h-full w-full grid-cols-1 gap-3 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      onClick={() => setSelectedCourse(course)}
                    >
                      <CourseCard
                        coursesData={course}
                        onEdit={(course) => setCourseToEdit(course)}
                        onDelete={(course) => {
                          setCourseToDelete(course);
                          setDeleteError("");
                          setDeleteSuccess(false);
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <CourseListView
                  courses={courses}
                  onCourseClick={setSelectedCourse}
                />
              )}


{/**********************************************  Course Detail Modal *********************************/}

          {selectedCourse && (
            <CourseDetailModal
              selectedCourse={selectedCourse}
              onClose={() => setSelectedCourse(null)}
            />
          )}

{/******************************************** Delete Confirmation Modal ******************************/}
        <DeleteCourseConfirmationModal
            isOpen={Boolean(courseToDelete)}
            courseTitle={courseToDelete?.title}
            onCancel={() => {
              if (!isDeleting) {
                setCourseToDelete(null);
                setDeleteError("");
                setDeleteSuccess(false);
              }
            }}
            onConfirm={() => {
              if (courseToDelete && !isDeleting) {
                handleDeleteCourse(courseToDelete.id);
              }
            }}
              isDeleting={isDeleting}
              error={deleteError}
              isSuccess={deleteSuccess}
          />

{/********************************************** Edit Course ******************************************/}
          {courseToEdit && (
            <EditCourseModal
              key={courseToEdit.id}
              courseToEdit={courseToEdit}
              onClose={() => setCourseToEdit(null)}
              onUpdated={(updatedCourse) => {
                const normalizedCourse = {
                  ...updatedCourse,
                  price: Number(updatedCourse.price),
                  icon:
                    iconMap[updatedCourse.icon] || Code2,
                  color: updatedCourse.color || "#DBEAFE",
                };

                setCourses((prevCourses) =>
                  prevCourses.map((course) =>
                    course.id === normalizedCourse.id
                      ? normalizedCourse
                      : course
                  )
                );

                setSelectedCourse((prevCourse) =>
                  prevCourse?.id === normalizedCourse.id
                    ? normalizedCourse
                    : prevCourse
                );
              }}
            />
          )}
          {totalPages > 1 && (
          <nav
            aria-label="Course pagination"
            className="mt-8 flex flex-wrap items-center justify-center gap-2"
          >
{/******************************************* Previous Button *****************************************/}
        <button
          type="button"
          onClick={() => setCurrentPage((page) => page - 1)}
          disabled={currentPage === 1}
          className="cursor-pointer rounded-lg border border-(--border) bg-(--surface) px-3 py-2 text-sm text-(--text-primary) transition hover:bg-(--surface-secondary) hover:text-(--text-primary) disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

{/************************************************** Pagination ************************************* */}

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  aria-current={currentPage === page ? "page" : undefined}
                  className={`cursor-pointer rounded-lg border px-4 py-2 text-sm transition ${
                    currentPage === page
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-(--border) bg-(--surface) text-(--text-primary) hover:bg-(--surface-secondary) hover:text-(--text-primary)"
                  }`}
                >
                  {page}
                </button>
              )
          )}

{/*************************************************** Next Button **************************************/}
          <button
            type="button"
            onClick={() => setCurrentPage((page) => page + 1)}
            disabled={currentPage === totalPages}
            className="cursor-pointer rounded-lg border border-(--border) bg-(--surface) px-3 py-2 text-sm text-(--text-primary) transition hover:bg-(--surface-secondary) hover:text-(--text-primary) disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </nav>
    )}

        <p className="mt-3 text-center text-sm text-(--text-secondary)">
          {totalCourses} courses in total
        </p>
    </>
  );
}

export default CoursesController;



