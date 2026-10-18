
function CoursesFilter({draftFilters,setDraftFilters,onApply,onClear,}) {

        const handleChange = (field, value) => {
          setDraftFilters((prev) => ({
            ...prev,
            [field]: value,
          }));
        };

    return (
      <div className="w-full shrink-0 pb-5">
        <div className="bg-white border border-(--border) rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">
              Filters
            </h3>

{/***************************************************** Clear All Button *****************************************/}

            <button
              type="button"
              onClick={onClear}
              className="hover:cursor-pointer text-blue-500 text-xs hover:underline"
            >
              Clear all
            </button>
          </div>

          <div className="space-y-4">
{/***************************************************** Category *****************************************/}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Category
              </label>

              <select
                value={draftFilters.category}
                onChange={(e) =>
                  handleChange("category", e.target.value)
                }
                className="w-full appearance-none bg-white border border-(--border) rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All Categories</option>
                <option value="Web Development">Web Development</option>
                <option value="Backend Development">Backend Development</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Database">Database</option>
                <option value="Developer Tools">Developer Tools</option>
              </select>
            </div>

{/***************************************************** Level *****************************************/}

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Level
              </label>

              <select
                value={draftFilters.level}
                onChange={(e) =>
                  handleChange("level", e.target.value)
                }
                className="w-full appearance-none bg-white border border-(--border) rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

{/***************************************************** Price Range *****************************************/}

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Price Range
              </label>

              <select
                value={draftFilters.priceRange}
                onChange={(e) =>
                  handleChange("priceRange", e.target.value)
                }
                className="w-full appearance-none bg-white border border-(--border) rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All Prices</option>
                <option value="0-500">RM 0 - RM 500</option>
                <option value="500-1000">RM 500 - RM 1000</option>
                <option value="1000+">RM 1000+</option>
              </select>
            </div>

{/***************************************************** Apply Button *****************************************/}

            <button
              type="button"
              onClick={onApply}
              className="w-full bg-blue-600 text-white py-2 rounded-lg
                        hover:cursor-pointer hover:bg-blue-700 text-sm font-medium"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    );
}

export default CoursesFilter;
