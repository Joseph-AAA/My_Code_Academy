
import { ChevronDown } from "lucide-react";
function CoursesFilter({
  draftFilters,
  setDraftFilters,
  onApply,
  onClear,
}) {
  const handleChange = (field, value) => {
    setDraftFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

const selectClass =
  "w-full appearance-none relative rounded-lg border border-(--border) bg-white pl-3 pr-10 py-2 text-sm outline-none focus:border-blue-500 hover:cursor-pointer";
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

{/******************************************* Category ***********************************************/}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>

          <div className="relative">
            <select
              className={`${selectClass} appearance-none pr-10 `}
              value={draftFilters.category}
              onChange={(e) => handleChange("category", e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Web Development">Web Development</option>
              <option value="Backend Development">Backend Development</option>
              <option value="UI/UX Design">UI/UX Design</option>
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
          </div>
        </div>

{/******************************************* Level ***********************************************/}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Level
        </label>

        <div className="relative">
          <select
              className={selectClass}
              value={draftFilters.level}
              onChange={(e) => handleChange("level", e.target.value)}
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
            </div>
      </div>

{/******************************************* Price Range ***********************************************/}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range
        </label>
         <div className="relative">
            <select
              className={selectClass}
              value={draftFilters.priceRange}
              onChange={(e) =>
                handleChange("priceRange", e.target.value)
              }
            >
            <option value="">All Prices</option>
            <option value="0-500">RM 0 - RM 500</option>
            <option value="500-1000">RM 500 - RM 1,000</option>
            <option value="1000+">RM 1,000+</option>
          </select>
          <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
        </div>
        
      </div>


{/******************************************* Duration ***********************************************/}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Duration
        </label>
          <div className="relative">
            <select
              className={selectClass}
              value={draftFilters.duration}
              onChange={(e) => handleChange("duration", e.target.value)}
            >
              <option value="">All Durations</option>
              <option value="under-4">Under 4 weeks</option>
              <option value="4-8">4–8 weeks</option>
              <option value="9-12">9–12 weeks</option>
              <option value="over-12">More than 12 weeks</option>
            </select>
            <ChevronDown
                        size={16}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
          </div>
      </div>


{/******************************************* Action ***********************************************/}
      <div className="sm:col-span-2 xl:col-span-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClear}
          className="px-4 py-2 rounded-lg border border-(--border)
                     text-sm text-gray-700 hover:bg-gray-50"
        >
          Reset
        </button>

        <button
          type="button"
          onClick={onApply}
          className="px-5 py-2 rounded-lg bg-blue-600 text-white
                     text-sm font-medium hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}

export default CoursesFilter;
