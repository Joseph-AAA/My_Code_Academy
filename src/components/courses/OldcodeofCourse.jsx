import { useState, useMemo, useEffect } from "react";
import { 
  Search, BookOpen, Clock, CheckCircle, FileText, 
  Plus, ChevronDown, LayoutGrid, List, X, Star, Users, 
  MoreVertical, Trash2, Pencil, CalendarDays
} from "lucide-react";
import {coursesData} from "../data/data";



export default function Courses() {
  const [courses, setCourses] = useState(coursesData);
  const [searchQuery, setSearchQuery] = useState("");
  // const [viewMode, setViewMode] = useState("grid");
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [modalCourse, setModalCourse] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);

  const [draftFilters, setDraftFilters] = useState({ 
    category: "All Categories", level: "All Levels", status: "All Status", priceRange: "Select price range" 
  });
  const [appliedFilters, setAppliedFilters] = useState(draftFilters);
  const [sortBy, setSortBy] = useState("newest");

  const [formData, setFormData] = useState({ 
    title: "", category: "Web Development", level: "Beginner", duration: "8 weeks", price: "", description: "" 
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId && !event.target.closest(".relative")) setOpenMenuId(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const stats = [
    { label: "Total Courses", value: courses.length, change: "+2 this month", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Published", value: courses.filter(c => c.status === "Published").length, change: "75% of total", icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
    { label: "In Progress", value: courses.filter(c => c.status === "In Progress").length, change: "21% of total", icon: Clock, color: "text-yellow-500", bg: "bg-yellow-50" },
    { label: "Draft", value: courses.filter(c => c.status === "Draft").length, change: "4% of total", icon: FileText, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  const filteredCourses = useMemo(() => {
    let result = courses.filter((course) => {
      if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (appliedFilters.category !== "All Categories" && course.category !== appliedFilters.category) return false;
      if (appliedFilters.level !== "All Levels" && course.level !== appliedFilters.level) return false;
      if (appliedFilters.status !== "All Status" && course.status !== appliedFilters.status) return false;
      if (appliedFilters.priceRange !== "Select price range") {
        const priceNum = parseInt(course.price.replace("RM ", ""));
        if (appliedFilters.priceRange === "RM 0 - RM 500" && priceNum > 500) return false;
        if (appliedFilters.priceRange === "RM 500 - RM 1000" && (priceNum < 500 || priceNum > 1000)) return false;
        if (appliedFilters.priceRange === "RM 1000+" && priceNum < 1000) return false;
      }
      return true;
    });
    
    if (sortBy === "newest") result = [...result].sort((a, b) => b.id - a.id);
    if (sortBy === "oldest") result = [...result].sort((a, b) => a.id - b.id);
    if (sortBy === "price") result = [...result].sort((a, b) => parseInt(a.price.replace("RM ", "")) - parseInt(b.price.replace("RM ", "")));
    return result;
  }, [courses, searchQuery, appliedFilters, sortBy]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
    const newCourse = {
      id: Date.now(),
      ...formData,
      students: 0,
      icon: formData.title.charAt(0).toUpperCase(),
      color: "bg-purple-400",
      textColor: "text-purple-600",
      rating: 0,
      totalLessons: 0,
      status: "Draft",
      instructor: { name: "Admin", title: "Instructor" },
    };
    setCourses([newCourse, ...courses]);
    setShowAddCourse(false);
    setFormData({ title: "", category: "Web Development", level: "Beginner", duration: "8 weeks", price: "", description: "" });
    setEditingCourse(null);
  };

  const handleDeleteCourse = (courseId) => {
    setCourses(courses.filter(c => c.id !== courseId));
    setOpenMenuId(null);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      category: course.category,
      level: course.level,
      duration: course.duration,
      price: course.price,
      description: course.description,
    });
    setShowAddCourse(true);
    setOpenMenuId(null);
  };

  const openCourseModal = (course) => {
    setModalCourse(course);
    setShowCourseModal(true);
  };

  const handleApplyFilters = () => setAppliedFilters({ ...draftFilters });
  const handleClearFilters = () => {
    const resetFilters = { category: "All Categories", level: "All Levels", status: "All Status", priceRange: "Select price range" };
    setDraftFilters(resetFilters);
    setAppliedFilters(resetFilters);
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 ">
      {/* Main Content */}
      {/* <div className="md:flex-1 min-w-0">
        {/* Header */}
        {/* <div className="flex justify-between items-center  mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Courses</h2>
            <p className="text-sm text-gray-500 mt-1">Manage and organize all courses</p>
          </div>
          <button
            onClick={() => { setEditingCourse(null); setFormData({ title: "", category: "Web Development", level: "Beginner", duration: "8 weeks", price: "", description: "" }); setShowAddCourse(true); }}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
          >
            <Plus size={18} /> Add Course
          </button>
        </div> */}

{/* 
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white border border-(--border) rounded-xl p-4 flex items-center gap-4">
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
        </div> */}

        {/* Search & Sort Bar */}
        {/* <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-(--border) rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-(--border) rounded-lg px-4 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="newest">Sort by: Newest</option>
                <option value="oldest">Sort by: Oldest</option>
                <option value="price">Sort by: Price</option>
              </select>
              <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={16} />
            </div> */}
            {/* <div className="flex border border-(--border) rounded-lg overflow-hidden">
              <button onClick={() => setViewMode("grid")} className={`p-2.5 ${viewMode === "grid" ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:bg-gray-50"}`}>
                <LayoutGrid size={18} />
              </button>
              <button onClick={() => setViewMode("list")} className={`p-2.5 ${viewMode === "list" ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:bg-gray-50"}`}>
                <List size={18} />
              </button>
            </div> */}
          </div> */}
      

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {filteredCourses.map((course) => (
              <div key={course.id} onClick={() => openCourseModal(course)} className="bg-white border border-(--border) rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer relative">
                {/* Colored Header */}
                <div className={`${course.color} h-24 flex items-center justify-center`}>
                  <span className="font-bold w-full text-white flex justify-center">
                      <img className="w-23" src={course.icon} alt={course.title}/> 
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === course.id ? null : course.id); }} className="text-white/70 hover:text-white">
                    <MoreVertical size={18} />
                  </button>
                  {openMenuId === course.id && (
                    <div className="absolute right-0 top-6 bg-white shadow-lg rounded-lg border border-(--border) py-1 w-32 z-10">
                      <button onClick={(e) => { e.stopPropagation(); handleEditCourse(course); }} className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 w-full text-left">
                        <Pencil size={14} /> Edit
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteCourse(course.id); }} className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium mb-2 ${course.textColor} bg-opacity-10`}>{course.category}</span>
                  <h3 className="font-semibold text-sm text-gray-800 mb-2 leading-snug">{course.title}</h3>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] ${course.textColor} border border-current mb-3`}>{course.level}</span>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-gray-100">
                    <span className="flex items-center gap-1"><Clock size={11} /> {course.duration}</span>
                    <span className="font-medium">{course.price}</span>
                    <span className="flex items-center gap-1"><BookOpen size={11} /> {course.students} students</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2 ">
            {filteredCourses.map((course) => (
              <div key={course.id} onClick={() => openCourseModal(course)} className="bg-white border border-(--border) rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer">
                <div className={`${course.color} h-12 w-12 flex items-center justify-center rounded-lg shrink-0`}>
                  <span className="text-xl font-bold text-white">{course.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-800">{course.title}</h3>
                  <p className="text-xs text-gray-500">{course.category} • {course.level}</p>
                </div>
                <div className="hidden md:flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
                  <span className="font-medium text-gray-700">{course.price}</span>
                  <span className="flex items-center gap-1"><BookOpen size={12} /> {course.students}</span>
                </div>
                <div className="relative">
                  <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === course.id ? null : course.id); }} className="text-gray-400 hover:text-gray-600">
                    <MoreVertical size={18} />
                  </button>
                  {openMenuId === course.id && (
                    <div className="absolute right-0 top-6 bg-white shadow-lg rounded-lg border border-(--border) py-1 w-32 z-10">
                      <button onClick={(e) => { e.stopPropagation(); handleEditCourse(course); }} className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 w-full text-left">
                        <Pencil size={14} /> Edit
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteCourse(course.id); }} className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

   
      <div className="md:w-72 shrink-0 pb-5">
        <div className="bg-white border border-(--border) rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">Filters</h3>
            <button onClick={handleClearFilters} className="text-blue-500 text-xs hover:underline">Clear all</button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Category</label>
              <select value={draftFilters.category} onChange={(e) => setDraftFilters({ ...draftFilters, category: e.target.value })} className="w-full appearance-none bg-white border border-(--border) rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                <option>All Categories</option>
                <option>Web Development</option>
                <option>Backend Development</option>
                <option>UI/UX Design</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Level</label>
              <select value={draftFilters.level} onChange={(e) => setDraftFilters({ ...draftFilters, level: e.target.value })} className="w-full appearance-none bg-white border border-(--border) rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                <option>All Levels</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Status</label>
              <select value={draftFilters.status} onChange={(e) => setDraftFilters({ ...draftFilters, status: e.target.value })} className="w-full appearance-none bg-white border border-(--border) rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                <option>All Status</option>
                <option>Published</option>
                <option>In Progress</option>
                <option>Draft</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Price Range</label>
              <select value={draftFilters.priceRange} onChange={(e) => setDraftFilters({ ...draftFilters, priceRange: e.target.value })} className="w-full appearance-none bg-white border border-(--border) rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                <option>Select price range</option>
                <option>RM 0 - RM 500</option>
                <option>RM 500 - RM 1000</option>
                <option>RM 1000+</option>
              </select>
            </div>
            <button onClick={handleApplyFilters} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">Apply Filters</button>
          </div>
        </div>

    
        <div className="bg-white border border-(--border) rounded-xl p-4 mt-4">
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
          <button onClick={() => openCourseModal(courses[1] || courses[0])} className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 text-xs font-medium">View Course Details</button>
        </div>
      </div>

      {/* Add/Edit Course Modal */}
      {showAddCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">{editingCourse ? "Edit Course" : "Add New Course"}</h3>
              <button onClick={() => setShowAddCourse(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleAddCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-3 py-2 border border-(--border) rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Advanced React Patterns" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border border-(--border) rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Web Development</option>
                    <option>Backend Development</option>
                    <option>UI/UX Design</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                  <select name="level" value={formData.level} onChange={handleChange} className="w-full px-3 py-2 border border-(--border) rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input type="text" name="duration" value={formData.duration} onChange={handleChange} className="w-full px-3 py-2 border border-(--border) rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., 10 weeks" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (RM)</label>
                  <input type="text" name="price" value={formData.price} onChange={handleChange} required className="w-full px-3 py-2 border border-(--border) rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., RM 999" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full px-3 py-2 border border-(--border) rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Briefly describe the course..."></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowAddCourse(false)} className="px-4 py-2 border border-(--border) rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{editingCourse ? "Save Changes" : "Add Course"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Course Details Modal */}
      {showCourseModal && modalCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`${modalCourse.color} p-3 rounded-lg`}>
                    <span className="text-2xl font-bold text-white">
                      <img src={modalCourse.icon} className="w-23" alt={modalCourse.title} />
                    </span></div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{modalCourse.title}</h3>
                    <p className="text-sm text-gray-500">{modalCourse.category} • {modalCourse.level}</p>
                  </div>
                </div>
                <button onClick={() => setShowCourseModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4"> 
                <div className="flex items-center gap-2"><Clock size={18} className="text-blue-500" /><span className="text-sm text-gray-600">Duration: {modalCourse.duration}</span></div>
                <div className="flex items-center gap-2"><Users size={18} className="text-purple-500" /><span className="text-sm text-gray-600">Students: {modalCourse.students}</span></div>
                <div className="flex items-center gap-2"><Star size={18} className="text-yellow-500" /><span className="text-sm text-gray-600">Rating: {modalCourse.rating}</span></div>
                <div className="flex items-center gap-2"><BookOpen size={18} className="text-green-500" /><span className="text-sm text-gray-600">Lessons: {modalCourse.totalLessons}</span></div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">{modalCourse.description}</p>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Instructor</h4>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">{modalCourse.instructor.name.charAt(0)}</div>
                  <div>
                    <p className="font-medium">{modalCourse.instructor.name}</p>
                    <p className="text-sm text-gray-500">{modalCourse.instructor.title}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-gray-800">{modalCourse.price}</span>
                <button onClick={() => alert("Enrolled successfully!")} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Enroll Now</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}