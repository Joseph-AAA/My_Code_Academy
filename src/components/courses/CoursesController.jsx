import { useState } from "react";
import {courses} from "../../data/courseData";
import CourseCard from "./CourseCard";
import CourseDetailModal from "./../dashboard/modals/CourseDetailModal";

function CoursesController({sortBy, searchQuery}){

    const publishedCourses = courses.filter((data)=> data.status === "Published");
    const [selectedCourse, setSelectedCourse] = useState(null);

    const filteredCourses = publishedCourses.filter((course)=>{
        const query = searchQuery.trim().toLowerCase();
        return (
            course.title.toLocaleLowerCase().includes(query) ||
            course.category.toLocaleLowerCase().includes(query)
        )
    })

    

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
        <div className="w-full grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-3 h-full">
            {
               sortedCourses.map((coursesData)=>{
                    
                    return <div key={coursesData.id} onClick={()=>setSelectedCourse(coursesData)}>
                                <CourseCard coursesData={coursesData} />
                             
                           </div> 
                          
                })
                
            }

            {   filteredCourses.length === 0 && (
                    <p className="col-span-full py-8 text-center font-bold text-2xl text-gray-500">
                        No courses found.
                    </p>
            )}

            {
                selectedCourse && (
                        <CourseDetailModal
                            selectedCourse={selectedCourse}
                            onClose={() => setSelectedCourse(null)}
                        />
                )
            }
           
        </div>
    )
}

export default CoursesController;