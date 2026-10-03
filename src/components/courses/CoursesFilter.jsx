
function CoursesFilter(){
   return(
     <div className="w-fullshrink-0 pb-5">
        <div className="bg-white border border-(--border) rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">Filters</h3>
            <button  className="text-blue-500 text-xs hover:underline">Clear all</button>
          {/* onClick={handleClearFilters} */}
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Category</label>
              <select  className="w-full appearance-none bg-white border border-(--border) rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                
                {/* value={draftFilters.category} onChange={(e) => setDraftFilters({ ...draftFilters, category: e.target.value })} */}
                <option>All Categories</option>
                <option>Web Development</option>
                <option>Backend Development</option>
                <option>UI/UX Design</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Level</label>
              <select className="w-full appearance-none bg-white border border-(--border) rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                {/* value={draftFilters.level} onChange={(e) => setDraftFilters({ ...draftFilters, level: e.target.value })}  */}
               
                <option>All Levels</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Status</label>
              <select  className="w-full appearance-none bg-white border border-(--border) rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
              {/* value={draftFilters.status} onChange={(e) => setDraftFilters({ ...draftFilters, status: e.target.value })}   */}
                
                <option>All Status</option>
                <option>Published</option>
                <option>In Progress</option>
                <option>Draft</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Price Range</label>
              <select   className="w-full appearance-none bg-white border border-(--border) rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
               {/* value={draftFilters.priceRange} onChange={(e) => setDraftFilters({ ...draftFilters, priceRange: e.target.value })} */}
               
                <option>Select price range</option>
                <option>RM 0 - RM 500</option>
                <option>RM 500 - RM 1000</option>
                <option>RM 1000+</option>
              </select>
            </div>
            <button  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">Apply Filters</button>
            {/* onClick={handleApplyFilters} */}
          </div>
        </div>
      </div>
   )
}

export default CoursesFilter;