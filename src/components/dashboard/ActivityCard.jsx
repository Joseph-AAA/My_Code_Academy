
import { useState } from "react";
import { Activity, ArrowRight } from "lucide-react";
import { activityConfig } from "../../data/data";
import { useDashboard } from "../../context/DashboardContext";
import ActivitiesModal from "./modals/ActivitiesModal";

function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();

  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`;

  return date.toLocaleDateString("en-MY");
}

function ActivityCard() {
  const [showActivities, setShowActivities] = useState(false);

  const { dashboardData } = useDashboard();

  const activities = dashboardData?.recentActivities || [];

  const configMap = {
    student: activityConfig.student,
    enrollment: activityConfig.course,
    payment: activityConfig.payment,
  };

  return (
    <div className="w-full flex flex-col items-center h-96 rounded-xl bg-white shadow-sm">

      {/* Activity Header */}
      <div className="w-[95%] h-16 flex items-center justify-between">
        <h3 className="text-xs md:text-md font-bold flex flex-col sm:flex-row gap-3 text-(--text-darks)">
          <Activity />
          Recent Activities
        </h3>

        <button
          onClick={() => setShowActivities(true)}
          className="flex text-sm md:text-md gap-3 cursor-pointer hover:underline underline-offset-4 text-blue-600"
        >
          View All Activities <ArrowRight />
        </button>
      </div>

      {/* Activity Modal */}
      {showActivities && (
        <ActivitiesModal
          activities={activities}
          closeModal={() => setShowActivities(false)}
        />
      )}

      {/* Activity Data */}
      {activities.length === 0 ? (
        <p className="mt-6 text-sm text-gray-500">
          No recent activities yet.
        </p>
      ) : (
        activities.slice(0, 5).map((activityData) => {
          const config = configMap[activityData.type];

          if (!config) return null;

          const Icon = config.icon;

          return (
            <div
              key={activityData.id}
              className="w-[95%] min-h-15 items-center flex border-b border-gray-200 last:border-b-0 gap-4"
            >
              <span
                className={`${config.bgColor} w-12 h-12 shrink-0 shadow-md rounded-full flex justify-center items-center`}
              >
                <Icon />
              </span>

              <div>
                <p className="text-xs md:text-sm">
                  {activityData.message}
                </p>

                <span className="text-xs md:text-sm text-gray-500">
                  {formatTimeAgo(activityData.createdAt)}
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default ActivityCard;
