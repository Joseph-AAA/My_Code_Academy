import { 
  Search, BookOpen, Clock, CheckCircle, FileText, 
  Plus, ChevronDown, LayoutGrid, List, X, Star, Users, 
  MoreVertical, Trash2, Pencil, CalendarDays
} from "lucide-react";
function CoursesPreview(){
    return(
         <div className="w-full shrink-0 pb-5">
            <div className="bg-white border border-(--border) rounded-xl p-4 ">
            <h3 className="font-semibold text-gray-800 mb-3">Course Preview</h3>
            <div className="bg-blue-50 rounded-lg p-3 mb-3">
                <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">⚛️</span>
                <span className="text-xs text-blue-600 font-medium">Web Development</span>
                </div>
                <h4 className="font-bold text-gray-800 text-sm mt-1">React.js Bootcamp</h4>
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-600 border border-blue-200 mt-2">Intermediate</span>
            </div>
            <p className="text-xs text-gray-600 mb-3 leading-relaxed">Learn React from scratch and build real-world applications with modern tools and best practices.</p>
            <div className="space-y-2 mb-3">
                <div className="flex justify-between text-xs"><span className="text-gray-500 flex items-center gap-1"><Clock size={12} /> Duration</span><span className="font-medium">10 weeks</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500 flex items-center gap-1"><BookOpen size={12} /> Price</span><span className="font-medium">RM 899</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500 flex items-center gap-1"><Users size={12} /> Students</span><span className="font-medium">89 enrolled</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500 flex items-center gap-1"><FileText size={12} /> Status</span><span className="font-medium text-green-600">Published</span></div>
            </div>
            <button className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 text-xs font-medium">View Course Details</button>
                {/* onClick={() => openCourseModal(courses[1] || courses[0])}  */}
            </div>
        </div>
    )
}

export default CoursesPreview;