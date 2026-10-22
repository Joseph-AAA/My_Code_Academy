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

  //*************************** Fetch courses from the Express backend *************************
          useEffect(() => {
            const fetchCourses = async () => {
              try {
                setLoading(true);
                setError("");

                const response = await fetch(`${API_URL}/api/courses`);

                if (!response.ok) {
                  throw new Error("Failed to fetch courses");
                }

                const data = await response.json();
           
//************************* Convert API data into the shape expected by the UI *************************
                  
        const normalizedCourses = data.courses.map((course) => ({
          ...course,
          price: Number(course.price),
          icon: iconMap[course.icon] || Code2,

//****************** Override the category color with the saved background color ***********************
          color: course.color || "#DBEAFE",
        }));
                setCourses(normalizedCourses);
              } catch (err) {
                console.error("Fetch courses error:", err);
                setError("Unable to load courses. Please try again.");
              } finally {
                setLoading(false);
              }
            };

            fetchCourses();
          }, [refreshKey]);

//************************************ Show only published courses ***************************************
  const publishedCourses = courses.filter(
        (course) => course.status === "Published"
      );

//******************************************* Filter courses *********************************************
  const filteredCourses = publishedCourses.filter((course) => {
            const query = searchQuery.trim().toLowerCase();

            const matchesSearch =
              course.title.toLowerCase().includes(query) ||
              course.category.toLowerCase().includes(query);

            const matchesCategory =
              !appliedFilters.category ||
              course.category === appliedFilters.category;

            const matchesLevel =
              !appliedFilters.level ||
              course.level === appliedFilters.level;

            const matchesPrice =
              !appliedFilters.priceRange ||
              (appliedFilters.priceRange === "0-500" &&
                course.price >= 0 &&
                course.price <= 500) ||
              (appliedFilters.priceRange === "500-1000" &&
                course.price > 500 &&
                course.price <= 1000) ||
              (appliedFilters.priceRange === "1000+" &&
                course.price > 1000);

            const durationWeeks = Number.parseInt(course.duration, 10);

            const matchesDuration =
              !appliedFilters.duration ||
              (appliedFilters.duration === "0-4" &&
                durationWeeks <= 4) ||
              (appliedFilters.duration === "5-8" &&
                durationWeeks >= 5 &&
                durationWeeks <= 8) ||
              (appliedFilters.duration === "9+" &&
                durationWeeks >= 9);

              return (
                matchesSearch &&
                matchesCategory &&
                matchesLevel &&
                matchesPrice &&
                matchesDuration
              );
          });

//********************************************* Sort Courses *********************************************
  const sortedCourses = [...filteredCourses].sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return (
              new Date(b.releaseDate || b.createdAt) -
              new Date(a.releaseDate || a.createdAt)
            );

          case "oldest":
            return (
              new Date(a.releaseDate || a.createdAt) -
              new Date(b.releaseDate || b.createdAt)
            );

          case "price":
            return a.price - b.price;

          default:
            return 0;
        }
      });

        if (loading) {
          return (
            <p className="py-8 text-center text-gray-500">
              Loading courses...
            </p>
          );
        }

      if (error) {
        return (
          <p className="py-8 text-center text-red-500">
            {error}
          </p>
        );
      }

//******************************************* Fetch to Detle Courses *************************************
const handleDeleteCourse = async (courseId) => {
    try {
      setIsDeleting(true);
      setDeleteError("");

      const response = await fetch(
        `${API_URL}/api/courses/${courseId}`,
        {
          method: "DELETE",
        }
      );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete course");
    }

//************************************ Remove the deleted course from the list *****************************
    setCourses((prevCourses) =>
      prevCourses.filter((course) => course.id !== courseId)
    );

    // Close the detail modal if it shows the deleted course
    setSelectedCourse((prevCourse) =>
      prevCourse?.id === courseId ? null : prevCourse
    );

    // Show success message inside the confirmation modal
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
          {sortedCourses.length === 0 ? (
            <p className="col-span-full py-8 text-center text-2xl font-bold text-gray-500">
              No courses found.
            </p>
          ) : viewMode === "grid" ? (
            <div className="grid h-full w-full grid-cols-1 gap-3 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3">
              {sortedCourses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                >
                  <CourseCard
                      coursesData={course}
                      onEdit={(course) => {
                        setCourseToEdit(course);
                      }}
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
              courses={sortedCourses}
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
    </>
  );
}

export default CoursesController;



