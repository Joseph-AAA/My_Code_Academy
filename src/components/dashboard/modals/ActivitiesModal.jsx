
import { activityConfig } from "../../../data/data";

function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();

  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }

  return date.toLocaleDateString("en-MY");
}

function ActivitiesModal({ activities = [], closeModal }) {
  const configMap = {
    student: activityConfig.student,
    enrollment: activityConfig.course,
    payment: activityConfig.payment,
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-4">
      <div
        className="w-full max-w-xl rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Activity Modal Header */}
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="text-xl font-bold">All Activities</h2>
            <p className="text-sm text-(--text-secondary)">
              Recent activity
            </p>
          </div>

          <button
            className="hover:cursor-pointer hover:text-red-500 hover:font-extrabold"
            onClick={closeModal}
          >
            ✕
          </button>
        </div>

        {/* Activities */}
        <div className="max-h-[65vh] overflow-y-auto p-5">
          <div className="space-y-2">
            {activities.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">
                No activities available.
              </p>
            ) : (
              activities.map((item) => {
                const config = configMap[item.type];

                if (!config) return null;

                const Icon = config.icon;

                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-xl p-4 hover:bg-gray-50"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.bgColor}`}
                    >
                      <Icon size={20} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-(--text-primary)">
                        {item.message}
                      </p>

                      <p className="mt-1 text-xs text-(--text-secondary)">
                        {formatTimeAgo(item.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Activity Modal Footer */}
        <div className="border-t p-4 text-right">
          <button
            onClick={closeModal}
            className="rounded-lg hover:cursor-pointer hover:bg-blue-700 bg-blue-600 px-4 py-2 text-sm font-medium text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActivitiesModal;
