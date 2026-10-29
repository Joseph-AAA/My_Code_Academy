

import {
  Search,
  Users,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";

function formatDate(date) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kuala_Lumpur",
  }).format(new Date(date));
}

function getInitials(name) {
  return (name || "Student")
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function StudentsTable({
  students,
  loading,
  search,
  onSearchChange,
  pagination,
  onPageChange,
  onViewDetails,
  error,
  onRetry,
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            All Students
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            View registered students and their learning activity.
          </p>
        </div>

        <div className="relative w-full sm:max-w-sm">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search name or email..."
            aria-label="Search students by name or email"
            className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {error ? (
        <div className="p-10 text-center">
          <p className="text-sm text-red-600">{error}</p>

          <button
            type="button"
            onClick={onRetry}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-gray-50">
                <tr className="text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-5 py-4 font-medium">Student</th>
                  <th className="px-5 py-4 font-medium">Registered</th>
                  <th className="px-5 py-4 font-medium">
                    Active Courses
                  </th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 text-right font-medium">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-12 text-center text-sm text-gray-500"
                    >
                      Loading students...
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-12 text-center"
                    >
                      <Users
                        size={32}
                        className="mx-auto text-gray-300"
                      />

                      <p className="mt-3 font-medium text-gray-700">
                        No students found
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Try another name or email.
                      </p>
                    </td>
                  </tr>
                ) : (
                  students.map((student) => {
                    const isEnrolled =
                      student.activeEnrollmentCount > 0;

                    return (
                      <tr
                        key={student.id}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
                              {student.profileImageUrl ? (
                                <img
                                  src={student.profileImageUrl}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                getInitials(student.name)
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-medium text-gray-800">
                                {student.name}
                              </p>

                              <p className="mt-1 max-w-[240px] truncate text-sm text-gray-500">
                                {student.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                          {formatDate(student.createdAt)}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {student.activeEnrollmentCount}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                              isEnrolled
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {isEnrolled
                              ? "Enrolled"
                              : "Not enrolled"}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => onViewDetails(student.id)}
                            className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-blue-600 transition hover:border-blue-200 hover:bg-blue-50"
                          >
                            <Eye size={16} />
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              {loading
                ? "Loading records..."
                : `${pagination.totalRecords} student(s) found · ${pagination.limit} per page`}
            </p>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <button
                type="button"
                disabled={
                  loading || pagination.currentPage <= 1
                }
                onClick={() =>
                  onPageChange(pagination.currentPage - 1)
                }
                className="cursor-pointer  inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <span className="whitespace-nowrap text-sm text-gray-600">
                Page {pagination.currentPage} of{" "}
                {pagination.totalPages}
              </span>

              <button
                type="button"
                disabled={
                  loading ||
                  pagination.currentPage >= pagination.totalPages
                }
                onClick={() =>
                  onPageChange(pagination.currentPage + 1)
                }
                className="cursor-pointer inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}








// function StudentTable({
//   students,
//   onView,
//   onEdit,
//   onDelete,
//   getCourseName,
// }) {
//   const getInitial = (name) => {
//     return name ? name.charAt(0).toUpperCase() : "?";
//   };
//   const getPaymentStyle = (status) => {
//     if (status === "Paid") {
//       return "bg-emerald-50 text-emerald-600";
//     }
//     if (status === "Partial") {
//       return "bg-amber-50 text-amber-600";
//     }
//     return "bg-red-50 text-red-600";
//   };
//   const getStatusStyle = (status) => {
//     if (status === "Active") {
//       return "bg-emerald-50 text-emerald-600";
//     }
//     if (status === "Inactive") {
//       return "bg-slate-100 text-slate-500";
//     }
//     return "bg-amber-50 text-amber-600";
//   };

//   return (
//     <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

//       <div className="border-b border-slate-100 px-5 py-4">
//         <h2 className="font-semibold text-slate-900">
//           Student List
//         </h2>

//         <p className="mt-1 text-xs text-slate-400">
//           Manage registered students
//         </p>
//       </div>
//       <div className="overflow-x-auto">

//         <table className="w-full min-w-[900px]">

//           <thead className="bg-slate-50">
//             <tr className="border-b border-slate-100">

//               {/* Number */}
//               <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
//                 #
//               </th>

//               {/* Student */}
//               <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500">
//                 Student
//               </th>

//               {/* Email */}
//               <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500">
//                 Email
//               </th>

//               {/* Course */}
//               <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500">
//                 Course
//               </th>

//               {/* Status */}
//               <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500">
//                 Status
//               </th>

//               {/* Payment */}
//               <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500">
//                 Payment
//               </th>

//               {/* Actions */}
//               <th className="px-3 py-3 text-center text-xs font-semibold text-slate-500">
//                 Actions
//               </th>

//             </tr>
//           </thead>

//           <tbody>

//             {students.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan="7"
//                   className="px-4 py-12 text-center text-sm text-slate-400"
//                 >
//                   No students found.
//                 </td>
//               </tr>
//             ) : (
//               students.map((student, index) => {

//                 const studentStatus = student.status || "Active";

//                 return (
//                   <tr
//                     key={student.id}
//                     className="border-b border-slate-100 transition hover:bg-slate-50"
//                   >
//                     <td className="px-4 py-4 text-sm text-slate-500">
//                       {index + 1}
//                     </td>
//                     <td className="px-3 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
//                           {getInitial(student.name)}
//                         </div>
//                         <div>
//                           <p className="text-sm font-semibold text-slate-800">
//                             {student.name}
//                           </p>

//                           <p className="text-xs text-slate-400">
//                             STU-{String(student.id).padStart(3, "0")}
//                           </p>
//                         </div>

//                       </div>
//                     </td>
//                     <td className="px-3 py-4 text-sm text-slate-500">
//                       {student.email}
//                     </td>
//                     <td className="px-3 py-4">

//                       <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
//                         {getCourseName
//                           ? getCourseName(student.courseId)
//                           : `Course ${student.courseId}`}
//                       </span>

//                     </td>
//                     <td className="px-3 py-4">

//                       <span
//                         className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
//                           studentStatus
//                         )}`}
//                       >
//                         {studentStatus}
//                       </span>

//                     </td>
//                     <td className="px-3 py-4">

//                       <span
//                         className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getPaymentStyle(
//                           student.paymentStatus
//                         )}`}
//                       >
//                         {student.paymentStatus}
//                       </span>

//                     </td>
//                     <td className="px-3 py-4">

//                       <div className="flex justify-center gap-2">
//                         <button
//                           onClick={() => onView(student)}
//                           title="View Student"
//                           className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"
//                         >
//                           👁
//                         </button>

//                         {/* Edit */}
//                         <button
//                           onClick={() => onEdit(student)}
//                           title="Edit Student"
//                           className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-600"
//                         >
//                           ✎
//                         </button>


//                         <button
//                           onClick={() => onDelete(student.id)}
//                           title="Delete Student"
//                           className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
//                         >
//                           🗑
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })
//             )}
//           </tbody>
//         </table>
//       </div>

//       <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

//         <p className="text-xs text-slate-400">
//           Showing {students.length} students
//         </p>

//         <div className="flex items-center gap-1">

//           <button
//             className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-sm text-slate-500 hover:bg-slate-50"
//           >
//             ‹
//           </button>

//           <button
//             className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-medium text-white"
//           >
//             1
//           </button>

//           <button
//             className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-sm text-slate-500 hover:bg-slate-50"
//           >
//             2
//           </button>

//           <button
//             className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-sm text-slate-500 hover:bg-slate-50"
//           >
//             3
//           </button>

//           <button
//             className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-sm text-slate-500 hover:bg-slate-50"
//           >
//             ›
//           </button>

//         </div>

//       </div>

//     </div>
//   );
// }

// export default StudentTable;