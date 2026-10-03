import {courses} from "../../data/courseData";
import CourseCard from "./CourseCard";

function CoursesController(){

    const publishedCourses = courses.filter((data)=> data.status === "Published");
    


    return(
        <div className="w-full grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-3 h-full">
            {
                publishedCourses.map((coursesData)=>{
                    console.log(coursesData.title)
                    return <div key={coursesData.id}>
                             <CourseCard coursesData={coursesData} />
                             
                          </div> 
                          
                })
            }
            {/*  */}
        </div>
    )
}

export default CoursesController;