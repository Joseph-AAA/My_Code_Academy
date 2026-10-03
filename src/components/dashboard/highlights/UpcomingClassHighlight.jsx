import {   CalendarDays,Clock, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import upcomingClass from "../../../assets/highlight-icons/upcomingClass.png";
import reactLogo from "../../../assets/course-icons/react..png";

function UpcomingClassHighlight(){
    return(
          <div className="h-full">
          <div className="h-full gap-4 flex flex-col relative">
             {/* <div className="flex items-center justify-between">
                 <h3 className="text-2xl font-bold"> Highlights</h3>
                 <div className="flex gap-3">
                    <span className="w-5 h-5 bg-gray-400 rounded-full"></span>
                    <span className="w-5 h-5 bg-gray-400 rounded-full"></span>
                    <span className="w-5 h-5 bg-gray-400 rounded-full"></span>
                    <span className="w-5 h-5 bg-gray-400 rounded-full"></span>
                 </div>
             </div> */}
              <div className="flex gap-3">
                  <div className="flex h-20 w-20 shrink-0 
                        items-center justify-center rounded-xl bg-purple-100  text-purple-600">
                    <CalendarDays size={50} />
                  </div>

                  <div className="">
                    <h3 className="font-medium text-2xl  text-slate-900">
                      Upcoming Class
                    </h3>

                    <p className="text-sm text-slate-500 z-10">
                      12 students have outstanding payments
                    </p>
                  </div>
              </div>

              <div className="grid p-2 sm:p-5 items-center gap-2 min-h-32 grid-cols-[1fr_2fr] w-[50%]
               border-gray-200  border rounded-md bg-blue-50">
                
                <div className="w-full h-[90%] grid justify-center">
                  <img src={reactLogo} className="w-15" alt="" />
                </div>
                <div className="h-[90%] text-xs sm:text-lg">
                   <h1 className="font-bold mb-1">React.js Bootcamp</h1>
                   <div>
                      
                      <span className="flex gap-2">
                         <CalendarDays className="w-5" />
                          <p>31.10.2026</p>
                      </span>
                      <span className="flex gap-2">
                          <Clock className="w-5" />
                          <p>12.00 PM</p>
                      </span>
                      
                      <span className="flex gap-2">
                         <User className="w-5 shrink-0" /> Instructor : John Doe
                      </span>
                      
                   </div>
                </div>
              </div>

              <button className="bg-blue-300 hover:cursor-pointer rounded-2xl 
                      h-8 sm:h-13 p-5 mt-auto  flex w-fit items-center gap-2 text-lg font-medium text-blue-600">
                View Schedule
                <ArrowRight size={16} />
              </button>

              <div className="absolute right-0 top-1/2 -translate-y-1/3">
                <img src={upcomingClass}
                  className="w-25 sm:w-45 " />
              </div>
          </div>
    </div>
    )
}
export default UpcomingClassHighlight;