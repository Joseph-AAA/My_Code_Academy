
import {
  Users,
  UserRoundPlus,
  ArrowUpRight,
  GraduationCap,
} from "lucide-react";
import { Link } from "react-router-dom";

function StudentUpdateHighlight({ recentActivities }) {
  const recentStudents = (recentActivities ?? [])
    .filter((activity) => activity.type === "student")
    .slice(0, 2);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-MY", {
      day: "2-digit",
      month: "short",
    });

  return (
    <div className="h-full rounded-2xl bg-pink-200 p-6">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-700">
          STUDENT UPDATES
        </span>

        <div className="rounded-xl bg-pink-100 p-3">
          <Users size={26} className="text-pink-600" />
        </div>
      </div>

      <div className="mt-5">
        <h3 className="text-xl font-bold text-pink-950">
          Growing together!
        </h3>

        <p className="mt-1 text-sm text-pink-700">
          Welcome new students to our learning community.
        </p>
      </div>

      <div className="mt-5 flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
        <div className="rounded-xl bg-pink-100 p-3">
          <UserRoundPlus size={25} className="text-pink-600" />
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Recent registrations
          </p>
          <h4 className="text-2xl font-bold text-gray-800">
            {recentStudents.length}
          </h4>
        </div>

        <div className="ml-auto text-xs font-semibold text-pink-600">
          Latest
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {recentStudents.length > 0 ? (
          recentStudents.map((student) => {
            const name = student.message.replace(
              " registered as a new student",
              ""
            );

            const initials = name
              .trim()
              .split(/\s+/)
              .map((word) => word[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={student.id}
                className="flex items-center gap-3 rounded-xl bg-white p-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-sm font-bold text-pink-700">
                  {initials}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-800">
                    {name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Registered {formatDate(student.createdAt)}
                  </p>
                </div>

                <GraduationCap size={19} className="text-pink-500" />
              </div>
            );
          })
        ) : (
          <div className="rounded-xl bg-white p-5 text-center text-sm text-gray-500">
            No recent student registrations.
          </div>
        )}
      </div>

      <Link
        className="mt-4 flex items-center justify-between text-sm"
        to="/students"
      >
        <span className="font-medium text-pink-700">
          View student records
        </span>
        <ArrowUpRight size={18} className="text-pink-600" />
      </Link>
    </div>
  );
}

export default StudentUpdateHighlight;
