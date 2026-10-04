import { useState } from "react";
import {courses} from "../../data/courseData";
import CourseCard from "./CourseCard";
import CourseDetailModal from "./CourseDetailModal";

function CoursesController(){

    const publishedCourses = courses.filter((data)=> data.status === "Published");
    const [selectedCourse, setSelectedCourse] = useState(null);


    return(
        <div className="w-full grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-3 h-full">
            {
                publishedCourses.map((coursesData)=>{
                    
                    return <div key={coursesData.id} onClick={()=>setSelectedCourse(coursesData)}>
                                <CourseCard coursesData={coursesData} />
                             
                           </div> 
                          
                })
            }
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