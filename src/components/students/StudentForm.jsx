import { useEffect, useState } from "react";

function StudentForm({
  onAddStudent,
  onUpdateStudent,
  onClose,
  editingStudent,
}) {
  // =========================
  // FORM DATA
  // =========================
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    courseId: "",
    enrollmentDate: "",
    paymentStatus: "Pending",
    status: "Active",
    totalFee: "",
    amountPaid: "",
  });

  // =========================
  // COURSE NAMES
  // =========================
  const courseNames = {
    1: "Web Development",
    2: "Data Science",
    3: "UI/UX Design",
    4: "JavaScript",
    5: "Python",
    6: "React",
  };

  // =========================
  // RESET FORM
  // =========================
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      courseId: "",
      enrollmentDate: "",
      paymentStatus: "Pending",
      status: "Active",
      totalFee: "",
      amountPaid: "",
    });
  };

  // =========================
  // LOAD STUDENT FOR EDIT
  // =========================
  useEffect(() => {
    if (editingStudent) {
      setFormData({
        name: editingStudent.name || "",
        email: editingStudent.email || "",
        phone: editingStudent.phone || "",
        courseId: editingStudent.courseId || "",
        enrollmentDate: editingStudent.enrollmentDate || "",
        paymentStatus: editingStudent.paymentStatus || "Pending",
        status: editingStudent.status || "Active",
        totalFee: editingStudent.totalFee || "",
        amountPaid: editingStudent.amountPaid || "",
      });
    } else {
      resetForm();
    }
  }, [editingStudent]);

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  };

  // =========================
  // HANDLE FORM SUBMIT
  // =========================
  const handleSubmit = (e) => {
    e.preventDefault();

    // =========================
    // EDIT EXISTING STUDENT
    // =========================
    if (editingStudent) {
      onUpdateStudent({
        ...formData,
        id: editingStudent.id,
      });

      onClose();
      return;
    }

    // =========================
    // ADD NEW STUDENT
    // =========================
    // IMPORTANT:
    // Do NOT create an ID here.
    //
    // Students.jsx creates the next ID automatically.
    //
    // Example:
    // Existing IDs: 1, 2, 3, 4
    // New ID: 5
    //
    onAddStudent(formData);

    onClose();
  };

  return (
    // =========================
    // OVERLAY
    // =========================
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6">

      {/* =========================
          MODAL
      ========================= */}
      <div className="w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl">

        {/* =========================
            HEADER
        ========================= */}
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {editingStudent ? "Edit Student" : "Add New Student"}
            </h2>

            <p className="mt-0.5 text-xs text-slate-400">
              {editingStudent
                ? "Update student information"
                : "Add a new student to the system"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-sm text-slate-400 transition hover:text-slate-700"
            aria-label="Close"
          >
            ✕
          </button>

        </div>

        {/* =========================
            FORM
        ========================= */}
        <form onSubmit={handleSubmit}>

          <div className="grid grid-cols-1 gap-x-5 gap-y-3 px-5 py-5 md:grid-cols-2">

            {/* =========================
                STUDENT NAME
            ========================= */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Student Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter student name"
                required
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100"
              />
            </div>

            {/* =========================
                EMAIL
            ========================= */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100"
              />
            </div>

            {/* =========================
                PHONE
            ========================= */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Phone
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100"
              />
            </div>

            {/* =========================
                COURSE
            ========================= */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Course
              </label>

              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100"
              >
                <option value="">Select course</option>

                {Object.entries(courseNames).map(
                  ([courseId, courseName]) => (
                    <option key={courseId} value={courseId}>
                      {courseName}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* =========================
                COURSE ID
            ========================= */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Course ID
              </label>

              <input
                type="text"
                value={formData.courseId}
                readOnly
                placeholder="Select a course"
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500 outline-none"
              />
            </div>

            {/* =========================
                ENROLLMENT DATE
            ========================= */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Enrollment Date
              </label>

              <input
                type="date"
                name="enrollmentDate"
                value={formData.enrollmentDate}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100"
              />
            </div>

            {/* =========================
                PAYMENT STATUS
            ========================= */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Payment Status
              </label>

              <select
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100"
              >
                <option value="Pending">Pending</option>
                <option value="Partial">Partial</option>
                <option value="Paid">Paid</option>
              </select>
            </div>

            {/* =========================
                STUDENT STATUS
            ========================= */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Student Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            {/* =========================
                TOTAL FEE
            ========================= */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Total Fee
              </label>

              <input
                type="number"
                name="totalFee"
                value={formData.totalFee}
                onChange={handleChange}
                placeholder="Enter total fee"
                min="0"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100"
              />
            </div>

            {/* =========================
                AMOUNT PAID
            ========================= */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Amount Paid
              </label>

              <input
                type="number"
                name="amountPaid"
                value={formData.amountPaid}
                onChange={handleChange}
                placeholder="Enter amount paid"
                min="0"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100"
              />
            </div>

          </div>

          {/* =========================
              FOOTER BUTTONS
          ========================= */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-5 py-3">

            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs font-medium text-slate-600 transition hover:text-slate-900"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              {editingStudent ? "Update Student" : "Add Student"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default StudentForm;