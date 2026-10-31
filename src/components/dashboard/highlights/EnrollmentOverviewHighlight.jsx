
import {
  GraduationCap,
  Users,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";

function EnrollmentOverviewHighlight({ statistics }) {
  const activeEnrollments =
    statistics?.totalActiveEnrollments ?? 0;

  const newEnrollments = statistics?.newEnrollments ?? 0;

  return (
    <div className="h-full rounded-2xl bg-orange-200 p-6">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
          ENROLLMENT OVERVIEW
        </span>

        <div className="rounded-xl bg-orange-100 p-3">
          <GraduationCap size={26} className="text-orange-600" />
        </div>
      </div>

      <div className="mt-5">
        <h3 className="text-xl font-bold text-orange-950">
          Academy growth
        </h3>

        <p className="mt-1 text-sm text-orange-700">
          Track student enrollment and learning progress.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
            <Users size={21} className="text-orange-600" />
          </div>

          <p className="text-2xl font-bold text-gray-800">
            {activeEnrollments}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Active Enrollments
          </p>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
            <TrendingUp size={21} className="text-emerald-600" />
          </div>

          <p className="text-2xl font-bold text-gray-800">
            {newEnrollments}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            New This Month
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-orange-100 p-4">
        <p className="text-sm font-medium text-orange-800">
          Current active enrollments
        </p>

        <p className="mt-2 text-2xl font-bold text-orange-900">
          {activeEnrollments}
        </p>

        <p className="mt-1 text-xs text-orange-700">
          Students currently enrolled in active courses
        </p>
      </div>

      <Link
        className="mt-4 flex items-center justify-between text-sm"
        to="/students"
      >
        <span className="font-medium text-orange-700">
          View enrollment details
        </span>
        <ArrowUpRight size={18} className="text-orange-600" />
      </Link>
    </div>
  );
}

export default EnrollmentOverviewHighlight;
