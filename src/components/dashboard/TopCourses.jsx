import { courses } from "../../data/courseData";
import { ArrowRight} from "lucide-react";
function TopCourses(){

    const topCourses = courses.sort((a,b)=> b.students - a.students).slice(0,5);

    // console.log(topCourses);

    return(
        <div className="w-full bg-white min-h-92 rounded-xl flex justify-center items-center">
            <div className="w-[90%] h-[90%] mt-2 rounded-2xl">

                <div className="flex justify-between mb-3">
                    <h3 className="font-bold">Top Courses</h3>
                    <span className="flex">
                         <a className="text-sm md:text-md text-blue-600">View All </a><ArrowRight className="text-blue-600"/>
                    </span>
                </div>
           
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
                                        <span className={`${courses.bgcolor} text-sm p-2 rounded-md`}>
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