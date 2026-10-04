import { activity, activityConfig } from "../../../data/data";

function ActivitiesModal({ closeModal }) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-4">
      <div
        className="w-full max-w-xl rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
{/**********************************************Activity Modal Header*****************************************************/}
        <div className="flex items-center justify-between border-b p-5">
            <div>
                <h2 className="text-xl font-bold">All Activities</h2>
                <p className="text-sm text-(--text-secondary)">
                Recent activity
                </p>
            </div>

             <button className="hover:cursor-pointer  hover:text-red-500 hover:font-extrabold" onClick={closeModal}>✕</button>
        </div>

{/*********************************************************Activities******************************************************/}
    
        <div className="max-h-[65vh] overflow-y-auto p-5">
          <div className="space-y-2">
            {activity.map((item) => {
              const config = activityConfig[item.type];
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
                      {config.message(item)}
                    </p>

                    <p className="mt-1 text-xs text-(--text-secondary)">
                      {item.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

{/****************************************************Activity Modal Footer***********************************************/}

        <div className="border-t p-4 text-right">
            <button
                onClick={closeModal}
                className="rounded-lg hover:cursor-pointer 
                           hover:bg-blue-700 bg-blue-600 px-4 py-2 text-sm font-medium text-white"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
}

export default ActivitiesModal;