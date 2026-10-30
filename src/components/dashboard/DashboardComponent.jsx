
import { dashboardCards } from "../../data/data";
import { useDashboard } from "../../context/DashboardContext";
import DashboardCard from "../dashboard/DashboardCard";

function DashboardComponent() {
  const { dashboardData, loading, error } = useDashboard();

  if (loading) {
    return <p className="mt-6">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="mt-6 text-red-500">{error}</p>;
  }

  if (!dashboardData) return null;

  const statistics = dashboardData.statistics;

  const cards = [
    {
      ...dashboardCards[0],
      value: statistics.totalStudents,
    },
    {
      ...dashboardCards[1],
      value: statistics.totalCourses,
    },
    {
      ...dashboardCards[2],
      value: `RM ${Number(statistics.totalRevenue).toLocaleString("en-MY")}`,
    },
    {
      ...dashboardCards[3],
      label: "New Enrollments",
      value: statistics.newEnrollments,
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-4 gap-3 flex-wrap mt-6">
      {cards.map((card) => (
        <DashboardCard
          key={card.label}
          icon={card.icon}
          value={card.value}
          label={card.label}
          bgColor={card.bgColor}
          Icon={card.icon}
          change={card.change}
          text={card.text}
        />
      ))}
    </div>
  );
}

export default DashboardComponent;
