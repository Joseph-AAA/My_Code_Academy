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

        </div>
    )

}

export default CoursesEnrollCard;