function CoursesEnrollCard() {
    return(
           <div className="space-y-6">
          {/* Enroll Card */}
          <div className="bg-white border border-(--border) rounded-xl p-6">
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 mb-4 font-semibold">
              Enroll Now
            </button>
            <p className="text-center text-sm text-gray-500 mb-4">
              30-Day Money-Back Guarantee
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Level</span>
                <span className="font-medium"></span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Duration</span>
                <span className="font-medium"></span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Lessons</span>
                <span className="font-medium"></span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Students</span>
                <span className="font-medium"></span>
              </div>
            </div>
          </div>

          {/* Instructor Card */}
          {/* <div className="bg-white border border-(--border) rounded-xl p-6">
            <h3 className="font-bold text-gray-800 mb-4">Instructor</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                {instructor?.name?.charAt(0) || "A"}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{instructor?.name || "Admin"}</p>
                <p className="text-sm text-gray-500">{instructor?.title || "Instructor"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Award size={16} className="text-yellow-500" />
              <span>{rating} Rating</span>
              <span>•</span>
              <span>{Math.floor(students / 10)} Reviews</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <Users size={16} className="text-blue-500" />
              <span>{students} Students</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <PlayCircle size={16} className="text-green-500" />
              <span>{Math.ceil(totalLessons / 10)} Courses</span>
            </div>
          </div> */}
        </div>
    )

}

export default CoursesEnrollCard;