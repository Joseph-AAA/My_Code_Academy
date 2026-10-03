import CoursesEnrollCard from "./CoursesEnrollCard";
import CoursesFilter  from "./CoursesFilter";
import CoursesPreview from "./CoursesPreview";
function CoursesRightSidebar() {
    return(
          <div>
            <CoursesFilter />
            <CoursesPreview />
            <CoursesEnrollCard />

          </div>
    )
}

export default CoursesRightSidebar;