import { CalendarDays} from "lucide-react";
function CourseCard({coursesData}){
    return(
         <div className="relative rounded-xl min-h-56 bg-gray-200 border border-blue-200 shadow-sm overflow-hidden">
                                    <div key={coursesData.title} className="flex p-3">
                                        <span className="shrink-0 pr-3">
                                            <img src={coursesData.icon} className="w-14" alt="img"/>
                                        </span>
                                        <div className="pt-2">
                                            <span className={`${coursesData.bgcolor} shadow-sm inline-block px-2 py-1 mb-1 rounded-md`} >
                                                <p>{coursesData.category}</p>
                                            </span>
                                         
                                            <h4 className="text-lg font-medium mb-5">
                                                {coursesData.title}
                                            </h4>
                                               <span className="flex gap-2">
                                                <CalendarDays /> {coursesData.releaseDate} <label>( Release Date )</label> 
                                            </span>
                                        </div>
                                    </div>
                                    <div className="absolute flex items-center gap-5 pl-3 bottom-0 w-full h-16 bg-[#F6F8FD] ">
                                            <span className="flex justify-center items-center w-16 h-16 rounded-2xl">
                                                <img src={coursesData.instructor.image} className="w-12 rounded-full" alt={coursesData.instructor}/>
                                            </span>
                                            <span className="font-medium">
                                                Instructor : {coursesData.instructor.name}
                                            </span>
                                    </div>
                </div>
    )
}

export default CourseCard;