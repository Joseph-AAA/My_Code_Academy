import { 
  Search, BookOpen, Clock, CheckCircle, FileText, 
  Plus, ChevronDown, LayoutGrid, List, X, Star, Users, 
  MoreVertical, Trash2, Pencil, CalendarDays
} from "lucide-react";
import {stats} from "../data/courseData" 
import Search_Sortbar from "../components/courses/Search_Sortbar"
import CoursesController from "../components/courses/CoursesController";
import CoursesRightSidebar from "../components/courses/CoursesRightSidebar";
function Courses(){
  return(
    <div className=" w-full flex flex-col md:flex-row gap-6 ">

{/***************************************Course Section************************************************/}
      <section className="flex-1 mb-6">

{/***************************************Header************************************************/}
        <div className="flex justify-between mb-3">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Courses</h2>
              <p className="text-md text-gray-500 mt-1">Manage and organize all courses</p>
            </div>
            <button
              //onClick={() => { setEditingCourse(null); setFormData({ title: "", category: "Web Development", level: "Beginner", duration: "8 weeks", price: "", description: "" }); setShowAddCourse(true); }}
              className="bg-blue-600 h-12 text-white px-5 py-2.5 rounded-lg
                         hover:bg-blue-700 hover:cursor-pointer flex items-center gap-2 font-medium">
              <Plus size={18} /> Add Course
            </button>
        </div>
            
{/******************************************Stats************************************************/}        

        <div className="grid grid-cols-2 2xl:grid-cols-4 gap-4 mb-4">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="bg-white border border-(--border) rounded-xl p-4 
                                            flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${stat.bg}`}>
                      <Icon size={24} className={stat.color} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                      <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
                    </div>
                  </div>
                );
              })}
        </div>
        
        <Search_Sortbar />

         <div>
            <CoursesController />
         </div>
      </section>

{/***************************************Rgiht Sidebar************************************************/}

        <section className="md:w-88 shrink-0 pb-5 ">
                <CoursesRightSidebar />
        </section>
    </div>
  )

}
export default Courses;