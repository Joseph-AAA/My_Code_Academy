
import { Plus } from "lucide-react";
import { useState } from "react";

import { stats } from "../data/courseData";
import Search_Sortbar from "../components/courses/Search_Sortbar";
import CoursesController from "../components/courses/CoursesController";
import CoursesFilter from "../components/courses/CoursesFilter";
import AddCourseModal from "../components/courses/AddCourseModal";

function Courses() {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [viewMode, setViewMode] = useState("grid");

    const [showAddCourse, setShowAddCourse] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const initialFilters = {
      category: "",
      level: "",
      priceRange: "",
      duration: "",
    };

    const [draftFilters, setDraftFilters] = useState(initialFilters);
    const [appliedFilters, setAppliedFilters] = useState(initialFilters);

    const handleApplyFilters = () => {
      setAppliedFilters({ ...draftFilters });
    };

    const handleClearFilters = () => {
      setDraftFilters({ ...initialFilters });
      setAppliedFilters({ ...initialFilters });
    };

  return (
    <div className="w-full min-w-0">

{/*********************************************************** Page Header ****************************/}
      <div className="flex justify-between items-center gap-4 mb-4">
        <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Courses
            </h2>
            <p className="text-md text-gray-500 mt-1">
              Manage and organize all courses
            </p>
        </div>

        <button
          onClick={() => setShowAddCourse(true)}
          className="bg-blue-600 h-11 text-white px-5 py-2.5 rounded-lg
                     hover:bg-blue-700 flex items-center gap-2 font-medium
                     shrink-0 hover:cursor-pointer"
        >
          <Plus size={18} />
          Add Course
        </button>
      </div>

{/*********************************************************** Stats *************************************/}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;

            return (
                <div
                  key={idx}
                  className="bg-white border border-(--border) rounded-xl p-4
                            flex items-center gap-4"
                >
                  <div className={`p-3 rounded-lg ${stat.bg}`}>
                      <Icon size={24} className={stat.color} />
                  </div>

                  <div>
                      <p className="text-2xl font-bold text-gray-800">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {stat.change}
                      </p>
                  </div>
              </div>
            );
          })}
      </div>


{/***************************************Search, Sort, and Grid/List toggle ****************************/}
      
      <Search_Sortbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
      
      />


{/**************************************************** Filter Card **************************************/}

        <div className="mt-3 mb-4 bg-white border border-(--border)
                        rounded-2xl p-4">
          <div className="flex justify-between items-center mb-4">
              <h3 className="hover: font-semibold text-gray-800">Filters</h3>
          </div>

          <CoursesFilter
            draftFilters={draftFilters}
            setDraftFilters={setDraftFilters}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
          />
        </div>
      

{/******************************************************* Displayed Courses ****************************/}
        <div className="mt-4">
          <CoursesController
            appliedFilters={appliedFilters}
            searchQuery={searchQuery}
            sortBy={sortBy}
            viewMode={viewMode}
            refreshKey={refreshKey}
          />
        </div>

        {showAddCourse && (
  <AddCourseModal
    onClose={() => setShowAddCourse(false)}
    onCreated={() => setRefreshKey((prev) => prev + 1)}
  />
)}
    </div>
  );
}

export default Courses;
