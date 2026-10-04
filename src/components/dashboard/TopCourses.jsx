import { courses } from "../../data/courseData";
import { ArrowRight} from "lucide-react";
import TopCoursesModal from "./modals/TopCoursesModal";
import { useState } from "react";
function TopCourses(){

    const topCourses = courses.sort((a,b)=> b.students - a.students).slice(0,5);
    const [showTopCourses, setShowTopCourses] = useState(false);
    // console.log(topCourses);

    return(
        <div className="w-full bg-white min-h-92 rounded-xl flex justify-center items-center">
            <div className="w-[90%] h-[90%] mt-2 rounded-2xl">
{/****************************************************Top Courses Header****************************************************/}
                <div className="flex justify-between mb-3">
                    <h3 className="font-bold">Top Courses</h3>
                    <span className="flex">
                         <button className="text-sm md:text-md text-blue-600 flex gap-1 
                         cursor-pointer hover:underline underline-offset-4"  
                         onClick={() => setShowTopCourses(true)} >View All <ArrowRight /> </button>
                    </span>
                </div>
{/****************************************************Activity Modal****************************************************/}
                {
                    showTopCourses && <TopCoursesModal closeModal = {()=>setShowTopCourses(false)}/>
                }




{/****************************************************Top Courses Data****************************************************/}          
                    {
                      topCourses.map((courses)=>{
                            return(
                                <div className="w-full flex h-15  mb-3 gap-3
                                        items-center " key={courses.id}>
                                    <span className={`h-full w-15 rounded-md flex justify-center
                                                  items-center border border-gray-200 shadow-md ${courses.color} shrink-0`}>
                                        <img src={courses.icon} alt={courses.title} />
                                    </span>
                                    <div className="w-full flex justify-between">
                                        <span className="text-sm flex flex-col">
                                            <h3 className="font-bold">
                                                {courses.title}
                                            </h3>
                                            <p className="text-gray-400">
                                                {courses.students} students
                                            </p>
                                        </span>
                                        <span className={`${courses.bgcolor} shadow-md text-sm p-2 rounded-md`}>
                                            {courses.level}
                                        </span>
                                    </div>
                                </div>
                                )
                        })
                     }
            
            </div>
        </div>
    )
}

export default TopCourses; 