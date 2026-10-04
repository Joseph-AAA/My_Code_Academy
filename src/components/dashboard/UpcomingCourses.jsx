import { ArrowRight} from "lucide-react";
import { courses } from "../../data/courseData";
import { data } from "react-router-dom";
import CourseCard from "../courses/CourseCard";
import { useState } from "react";
import CourseDetailModal from "../courses/CourseDetailModal";
function UpcomingCourses (){

    const upcomingCourses = courses.filter((data)=> data.status=="Upcoming").slice(0,4);
     const [selectedCourse, setSelectedCourse] = useState(null);
    

    return(
        <div className="w-full min-h-96 bg-white shadow-md rounded-2xl flex flex-col items-center justify-center">
             <div className="w-[95%]  h-16 flex items-center justify-between">
                    <span className="text-lg font-medium text-blue-600">Upcoming Courses</span>
                    <a className="flex text-lg font-medium text-blue-600" href="#">View Schedule  <ArrowRight  /></a>
            </div>
             <div className="w-[95%] h-full  grid   md:grid-cols-2
                            xl:grid-cols-1
                            2xl:grid-cols-2 gap-3 flex-wrap pb-5">
              
                    {
                        upcomingCourses.map((upcomingCoursesData)=>{
                            return(
                                  <div key={upcomingCoursesData.id} onClick={()=>setSelectedCourse(upcomingCoursesData)}  className="relative rounded-xl min-h-56 bg-gray-100 shadow-sm">
                                    <CourseCard coursesData={upcomingCoursesData}   />
                                  </div>
                            )
                        })
                    }                      
             </div>
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
export default UpcomingCourses;