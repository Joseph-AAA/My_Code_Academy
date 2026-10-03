import { useState } from "react";

function StudentDetails({
  student,
  onClose,
  onEdit,
  onDelete,
  getCourseName,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  if (!student) return null;
  const totalFee = Number(student.totalFee) || 0;
  const amountPaid = Number(student.amountPaid) || 0;
  const balance = totalFee - amountPaid;
  const studentStatus = student.status || "Active";
  const getStatusStyle = () => {
    if (studentStatus === "Active") {
      return "bg-emerald-50 text-emerald-600";
    }
    if (studentStatus === "Inactive") {
      return "bg-slate-100 text-slate-500";
    }
    return "bg-amber-50 text-amber-600";
  };

  const courseName = getCourseName
    ? getCourseName(student.courseId)
    : `Course ${student.courseId}`;
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  return (
    <div className="overflow-hidden  rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="relative border-b border-slate-100 p-5">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700"
          title="Close"
        >
          ✕
        </button>
        <div className="flex items-center gap-4 pr-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-600">
            {student.name?.charAt(0).toUpperCase()}
          </div>

         
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-900">
                {student.name}
              </h2>
              <span
                className={`rounded-full px-2 py-1 text-[10px] font-medium ${getStatusStyle()}`}
              >
                {studentStatus}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              STU-{String(student.id).padStart(3, "0")}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {student.email}
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 border-b border-slate-100">
        <button
          onClick={() => handleTabChange("overview")}
          className={`border-b-2 px-2 py-3 text-xs font-medium transition ${
            activeTab === "overview"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-400 hover:text-indigo-600"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => handleTabChange("courses")}
          className={`border-b-2 px-2 py-3 text-xs font-medium transition ${
            activeTab === "courses"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-400 hover:text-indigo-600"
          }`}
        >
          Courses
        </button>
        <button
          onClick={() => handleTabChange("payments")}
          className={`border-b-2 px-2 py-3 text-xs font-medium transition ${
            activeTab === "payments"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-400 hover:text-indigo-600"
          }`}
        >
          Payments
        </button>
        <button
          onClick={() => handleTabChange("history")}
          className={`border-b-2 px-2 py-3 text-xs font-medium transition ${
            activeTab === "history"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-400 hover:text-indigo-600"
          }`}
        >
          History
        </button>
      </div>
      <div className="space-y-6 p-5">
        {activeTab === "overview" && (
          <>
            <section>
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
                👤
              </h3>
              <div className="space-y-3 text-sm">
               <div className="flex justify-between gap-4">
                  <span className="text-slate-400">
                  </span>
                  <span className="text-right font-medium text-slate-700">
                    {student.name}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400">
                    Student ID
                  </span>
                  <span className="font-medium text-slate-700">
                    STU-{String(student.id).padStart(3, "0")}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400">
                    Email
                  </span>
                  <span className="max-w-[190px] truncate font-medium text-slate-700">
                    {student.email}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400">
                    Phone
                  </span>
                  <span className="font-medium text-slate-700">
                    {student.phone}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400">
                    Enrollment Date
                  </span>
                  <span className="font-medium text-slate-700">
                    {student.enrollmentDate}
                  </span>
                </div>
              </div>
            </section>
            <section>
              <div className="mb-3 flex items-center justify-between">

                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  📚
                  Enrolled Course
                </h3>
              <button
                  onClick={() => handleTabChange("courses")}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                >
                  View All
                </button>
              </div>
              <div className="rounded-lg border border-slate-100 p-3">
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      🎓
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        {courseName}
                      </p>
                      <p className="text-xs text-slate-400">
                        Enrolled course
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-medium text-indigo-600">
                    Active
                  </span>
                </div>
              </div>
            </section>
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  💳
                  Payment Summary
                </h3>
                <button
                  onClick={() => handleTabChange("payments")}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">
                    Total Fee
                  </span>
                  <span className="font-semibold text-slate-700">
                    {totalFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">
                    Amount Paid
                  </span>
                  <span className="font-semibold text-emerald-600">
                    {amountPaid.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">
                    Balance
                  </span>
                  <span className="font-semibold text-red-500">
                    {balance.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">
                    Payment Status
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      student.paymentStatus === "Paid"
                        ? "bg-emerald-50 text-emerald-600"
                        : student.paymentStatus === "Partial"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {student.paymentStatus}
                  </span>
                </div>
              </div>
            </section>
          </>
        )}
        {activeTab === "courses" && (
          <section>
            <h3 className="mb-4 text-sm font-semibold text-slate-800">
              📚 Enrolled Courses
            </h3>
            <div className="rounded-lg border border-slate-100 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                  🎓
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    {courseName}
                  </p>
                  <p className="text-xs text-slate-400">
                    Course ID: {student.courseId}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-xs text-slate-400">
                  Enrollment Date
                </span>
                <span className="text-xs font-medium text-slate-700">
                  {student.enrollmentDate}
                </span>
              </div>
            <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Status
                </span>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-600">
                  Active
                </span>
              </div>
            </div>
          </section>
        )}
        {activeTab === "payments" && (
          <section>
            <h3 className="mb-4 text-sm font-semibold text-slate-800">
              💳 Payment Details
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between rounded-lg bg-slate-50 p-3">
                <span className="text-sm text-slate-500">
                  Total Fee
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {totalFee.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between rounded-lg bg-emerald-50 p-3">
                <span className="text-sm text-slate-500">
                  Amount Paid
                </span>
                <span className="text-sm font-semibold text-emerald-600">
                  {amountPaid.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between rounded-lg bg-red-50 p-3">
                <span className="text-sm text-slate-500">
                  Remaining Balance
                </span>
                <span className="text-sm font-semibold text-red-500">
                  {balance.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">
                  Payment Status
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    student.paymentStatus === "Paid"
                      ? "bg-emerald-50 text-emerald-600"
                      : student.paymentStatus === "Partial"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {student.paymentStatus}
               </span>
              </div>
            </div>
          </section>
        )}
        {activeTab === "history" && (
          <section>
            <h3 className="mb-4 text-sm font-semibold text-slate-800">
              🕒 Student History
            </h3>
            <div className="rounded-lg border border-slate-100 p-4">
             <div className="border-l-2 border-indigo-200 pl-4">
                <p className="text-sm font-medium text-slate-700">
                  Student enrolled
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {student.enrollmentDate}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {student.name} was enrolled in {courseName}.
                </p>
              </div>
            </div>
            <div className="mt-3 rounded-lg border border-slate-100 p-4">
             <div className="border-l-2 border-emerald-200 pl-4">
                <p className="text-sm font-medium text-slate-700">
                  Payment status
              </p>
              <p className="mt-1 text-xs text-slate-500">
                  Current payment status: {student.paymentStatus}
                </p>
              </div>
            </div>
          </section>
        )}
        <div className="space-y-2 border-t border-slate-100 pt-4">
          <button
            onClick={() => onEdit(student)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            ✎
            Edit Student
          </button>
          <button
            onClick={() => onDelete(student.id)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
          >
            🗑
            Delete Student
          </button>
        </div>
      </div>
    </div>
  );a
}
export default StudentDetails;