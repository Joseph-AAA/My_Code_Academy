function PaymentTable({ students }) {
  return (
    <div className="dashboard-card overflow-hidden">

      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-900">
          Student Payments
        </h2>

        <p className="mt-1 text-xs text-slate-400">
          Payment information for registered students
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr className="text-left">
              <th className="px-5 py-3 text-xs text-slate-500">
                Student
              </th>
              <th className="px-5 py-3 text-xs text-slate-500">
                Course
              </th>

        <th className="px-5 py-3 text-xs text-slate-500">
                Total Fee
              </th>

              <th className="px-5 py-3 text-xs text-slate-500">
                Paid
              </th>
              <th className="px-5 py-3 text-xs text-slate-500">
                Balance
              </th>
              <th className="px-5 py-3 text-xs text-slate-500">
                Status
              </th>
            </tr>
          </thead>
          <tbody>

            {students.map((student) => {
              const balance =
                Number(student.totalFee) -
                Number(student.amountPaid);

              return (
                <tr
                  key={student.id}
                  className="border-t border-slate-100"
                >
                  <td className="px-5 py-4 text-sm font-medium">
                    {student.name}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-500">
                    {student.courseName}
                  </td>

                  <td className="px-5 py-4 text-sm">
                    RM {student.totalFee}
                  </td>
                  <td className="px-5 py-4 text-sm text-green-600">
                    RM {student.amountPaid}
                  </td>
                  <td className="px-5 py-4 text-sm text-red-500">
                    RM {balance}
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-600">
                      {student.paymentStatus}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default PaymentTable;