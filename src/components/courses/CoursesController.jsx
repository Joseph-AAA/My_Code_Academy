import { useState } from "react";
import {courses} from "../../data/courseData";
import CourseCard from "./CourseCard";
import CourseDetailModal from "./../dashboard/modals/CourseDetailModal";
import CourseListView from "./CourseListView";

function CoursesController({viewMode, sortBy, searchQuery, appliedFilters}){

    const publishedCourses = courses.filter((data)=> data.status === "Published");
    const [selectedCourse, setSelectedCourse] = useState(null);

{/*********************************************** Filter and sort courses ***********************************/}

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

            const matchesStatus =
                !appliedFilters.status ||
                course.status === appliedFilters.status;

            const price = Number(course.price.replace("RM ", ""));

            const matchesPrice =
                !appliedFilters.priceRange ||
                (appliedFilters.priceRange === "0-500" &&
                price >= 0 && price <= 500) ||
                (appliedFilters.priceRange === "500-1000" &&
                price > 500 && price <= 1000) ||
                (appliedFilters.priceRange === "1000+" &&
                price > 1000);

            return (
                matchesSearch &&
                matchesCategory &&
                matchesLevel &&
                matchesStatus &&
                matchesPrice
            );
            });

        const sortedCourses = [...filteredCourses].sort((a, b) => {
            switch (sortBy) {
                case "newest":
                return new Date(b.releaseDate) - new Date(a.releaseDate);

                case "oldest":
                return new Date(a.releaseDate) - new Date(b.releaseDate);

                case "price":
                return (
                    Number(a.price.replace("RM ", "")) -
                    Number(b.price.replace("RM ", ""))
                );

                default:
                return 0;
            }
        });

        console.log("sortBy:", sortBy);
            console.log(
            "Sorted courses:",
            sortedCourses.map((course) => ({
                title: course.title,
                releaseDate: course.releaseDate,
            }))
            );

    return(
        <>
 
{/*********************************************** Dispaly Sorted Courses ***********************************/}

            {viewMode === "grid" ? (
            <div className="w-full grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-3 h-full">
                {sortedCourses.map((coursesData) => (
                <div
                    key={coursesData.id}
                    onClick={() => setSelectedCourse(coursesData)}
                >
                    <CourseCard coursesData={coursesData} />
                </div>
                ))}
            </div>
            ) : (
            <CourseListView
                courses={sortedCourses}
                onCourseClick={setSelectedCourse}
            />
            )}

{/*****************************************************No Courses Found *****************************************/}

            {   filteredCourses.length === 0 && (
                    <p className="col-span-full py-8 text-center font-bold text-2xl text-gray-500">
                        No courses found.
                    </p>
            )}

{/*********************************************** Selected Course Modal*****************************************/}

            {
                selectedCourse && (
                        <CourseDetailModal
                            selectedCourse={selectedCourse}
                            onClose={() => setSelectedCourse(null)}
                        />
                )
            }
           
        </>
    )
}

export default CoursesController;