
import { courses } from "../../../data/courseData";

function TopCoursesModal({closeModal}){
    return(
            <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-4">
                <div
                    className="w-full max-w-xl rounded-2xl bg-white shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                >
{/**********************************************TopCourses Modal Header*****************************************************/}
                    <div className="flex items-center justify-between border-b p-5">
                        <div>
                            <h2 className="text-xl font-bold">Top Courses</h2>
                            <p className="text-sm text-(--text-secondary)">
                               Courses
                            </p>
                        </div>

                        <button className="hover:cursor-pointer  hover:text-red-500 hover:font-extrabold " onClick={closeModal}>✕</button>
                    </div>

{/*********************************************************TopCourses******************************************************/}
                
                    <div className="max-h-[65vh] overflow-y-auto p-5">
                        
                    {
                      courses.map((course)=>{
                            return(
                                <div className="w-full flex h-15  mb-3 gap-3
                                        items-center " key={course.id}>
                                    <span className={`h-full w-15 rounded-md flex justify-center
                                                  items-center border border-gray-200 shadow-md ${course.color} shrink-0`}>
                                        <img src={course.icon} alt={course.title} />
                                    </span>
                                    <div className="w-full flex justify-between">
                                        <span className="text-sm flex flex-col">
                                            <h3 className="font-bold">
                                                {course.title}
                                            </h3>
                                            <p className="text-gray-400">
                                                {course.students} students
                                            </p>
                                        </span>
                                        <span className={`${course.bgcolor} shadow-md text-sm p-2 rounded-md`}>
                                            {course.level}
                                        </span>
                                    </div>
                                </div>
                                )
                        })
                     }
                    </div>

{/****************************************************TopCourses Modal Footer***********************************************/}

                    <div className="border-t p-4 text-right">
                        <button
                            onClick={closeModal}
                            className="rounded-lg hover:cursor-pointer hover:bg-blue-700 bg-blue-600 
                                        px-4 py-2 text-sm font-medium text-white"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
    )
}

export default TopCoursesModal;