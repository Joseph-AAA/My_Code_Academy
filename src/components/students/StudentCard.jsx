function StudentCard({
  student,
  onView,
  onEdit,
  onDelete,
}) {
  const balance =
    Number(student.totalFee) - Number(student.amountPaid);

  return (
    <div className="dashboard-card p-5">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">
            {student.name.charAt(0)}
          </div>

          <div>
            <h3 className="font-semibold text-slate-800">
              {student.name}
            </h3>

            <p className="text-xs text-slate-400">
              STU-{String(student.id).padStart(3, "0")}
            </p>
          </div>

        </div>

        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-600">
          {student.status}
        </span>

      </div>

      <div className="mt-4 space-y-2 text-sm">

        <p className="text-slate-500">
          <span className="font-medium text-slate-700">
            Email:
          </span>{" "}
          {student.email}
        </p>

        <p className="text-slate-500">
          <span className="font-medium text-slate-700">
            Course:
          </span>{" "}
          {student.courseName}
        </p>

        <p className="text-slate-500">
          <span className="font-medium text-slate-700">
            Phone:
          </span>{" "}
          {student.phone}
        </p>

      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">

        <div>
          <p className="text-xs text-slate-400">
            Total
          </p>
          <p className="mt-1 text-sm font-semibold">
            RM {student.totalFee}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400">
            Paid
          </p>
          <p className="mt-1 text-sm font-semibold text-green-600">
            RM {student.amountPaid}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400">
            Balance
          </p>
          <p className="mt-1 text-sm font-semibold text-red-500">
            RM {balance}
          </p>
        </div>

      </div>

      <div className="mt-4 flex gap-2">

        <button
          onClick={() => onView(student)}
          className="secondary-button flex-1"
        >
          View
        </button>

        <button
          onClick={() => onEdit(student)}
          className="secondary-button flex-1"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(student.id)}
          className="rounded-lg border border-red-200 px-3 text-red-500 hover:bg-red-50"
        >
          🗑
        </button>

      </div>

    </div>
  );
}

export default StudentCard;