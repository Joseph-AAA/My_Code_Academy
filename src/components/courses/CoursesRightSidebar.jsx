import CoursesEnrollCard from "./CoursesEnrollCard";
import CoursesFilter  from "./CoursesFilter";
import CoursesPreview from "./CoursesPreview";
function CoursesRightSidebar({draftFilters, setDraftFilters, onApply, onClear}) {
    return(
          <div>
            <CoursesFilter  draftFilters={draftFilters}
                            setDraftFilters={setDraftFilters}
                            onApply={onApply}
                            onClear={onClear}/>
            <CoursesPreview />
            <CoursesEnrollCard />

          </div>
    )
}

export default CoursesRightSidebar;