import { Users, ArrowRight, User } from "lucide-react";
import { Link } from "react-router-dom";
import studentUpdate from "../../../assets/highlight-icons/studentUpdate.png";

function StudentUpdateHighlight() {
  return (
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
                        items-center justify-center rounded-xl bg-green-100 text-green-600">
                    <User size={50} />
                  </div>

                  <div className="">
                    <h3 className="font-medium text-2xl  text-slate-900">
                      Student Updates
                    </h3>

                    <p className="text-sm text-slate-500 z-10">
                      12 students have outstanding payments
                    </p>
                  </div>
              </div>

              <div className="grid gap-2">
                <h2 className="mt-2  text-4xl font-bold text-slate-900">
                  +7
                </h2>

                <p className="text-lg text-slate-500">
                  New Students - 85 total
                </p>
              </div>

              <button className="bg-blue-300 hover:cursor-pointer rounded-2xl h-8 sm:h-13 p-5 mt-auto  flex w-fit items-center gap-2 text-lg font-medium text-blue-600">
                View Students
                <ArrowRight size={16} />
              </button>

                <img src={studentUpdate}
                  className="w-25 sm:w-40 absolute right-0 top-1/2 -translate-y-1/3 " />
       
          </div>
    </div>
    
  );
};

export default StudentUpdateHighlight;