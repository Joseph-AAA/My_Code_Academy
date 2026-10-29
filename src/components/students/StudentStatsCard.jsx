import { Users, GraduationCap, UserPlus } from "lucide-react";

const statItems = [
  {
    key: "totalStudents",
    title: "Total Students",
    description: "Registered student accounts",
    icon: Users,
    iconStyle: "bg-blue-50 text-blue-600",
  },
  {
    key: "activeLearners",
    title: "Active Learners",
    description: "Students with active courses",
    icon: GraduationCap,
    iconStyle: "bg-green-50 text-green-600",
  },
  {
    key: "newThisMonth",
    title: "New This Month",
    description: "Registrations this month",
    icon: UserPlus,
    iconStyle: "bg-purple-50 text-purple-600",
  },
];

export default function StudentStatsCard({ stats, loading }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {statItems.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.key}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500">
                  {item.title}
                </p>

                <p className="mt-3 text-3xl font-bold text-gray-800">
                  {loading
                    ? "—"
                    : (stats[item.key] ?? 0).toLocaleString()}
                </p>
              </div>

              <div
                className={`flex size-12 items-center justify-center rounded-xl ${item.iconStyle}`}
              >
                <Icon size={24} />
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              {item.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}