
import { 
  Search, BookOpen, Clock, CheckCircle, FileText, 
  Plus, ChevronDown, LayoutGrid, List, X, Star, Users, 
  MoreVertical, Trash2, Pencil, CalendarDays
} from "lucide-react";

function Search_Sortbar({setViewMode, viewMode, sortBy, setSortBy, searchQuery, setSearchQuery}){


    return(
        <div>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">

{/* *************************************************Search Bar******************************************/}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)" size={18} />
                    <input
                    type="text"
                    placeholder="Search courses..."
                    
                    className="w-full pl-10 pr-4 py-2.5 border border-(--border) rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-(--surface) text-(--text-primary) placeholder:text-(--text-muted)"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

{/* ************************************************* Sorting ******************************************/}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="appearance-none bg-(--surface) text-(--text-primary) border border-(--border) rounded-lg px-4 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="newest">Sort by: Newest</option>
                            <option value="oldest">Sort by: Oldest</option>
                            <option value="price">Sort by: Price</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={16} />
                    </div>
                </div>

{/* *************************************************** Grid ******************************************/}

                <div className="flex border border-(--border) rounded-lg overflow-hidden">
                    <button onClick={() => setViewMode("grid")} className={`p-2.5 ${
                                                                                    viewMode === "grid"
                                                                                        ? "bg-(--primary-soft) text-(--primary)"
                                                                                        : "text-(--text-muted) hover:bg-(--surface-secondary)"
                                                                                    } cursor-pointer transition`}>
                        <LayoutGrid size={18} />
                    </button>
                    <button  onClick={() => setViewMode("list")} className={`p-2.5 ${
                                                                                    viewMode === "list"
                                                                                        ? "bg-(--primary-soft) text-(--primary)"
                                                                                        : "text-(--text-muted) hover:bg-(--surface-secondary)"
                                                                                    } cursor-pointer transition`}>
                        <List size={18} />
                    </button>
                </div>
             </div>
        </div>
    )
}


export default Search_Sortbar;