import { activity,activityConfig } from "../../data/data";
import { useState } from "react";
import { Activity , ArrowRight} from "lucide-react";
import ActivitiesModal from "./modals/ActivitiesModal";
function ActivityCard(){
  
     const [showActivities, setShowActivities] = useState(false);

    // console.log(activities)

    return(
        <div className="w-full flex flex-col items-center h-96 rounded-xl bg-white shadow-sm">

{/****************************************************Activity Headerl*************************************************/}
            <div className="w-[95%] h-16  flex items-center justify-between">
                <h3 className="text-xs md:text-md font-bold flex flex-col sm:flex-row gap-3 text-(--text-darks)">
                    <Activity />
                     Recent Activites
                </h3>
                <button  onClick={() => setShowActivities(true)} 
                        className="flex text-sm md:text-md gap-3 cursor-pointer hover:underline underline-offset-4
                          text-blue-600">
                    View All Activites <ArrowRight />

                </button>
            </div>
{/****************************************************Activity Modal****************************************************/}
                {showActivities && (
                        <ActivitiesModal
                            closeModal={() => setShowActivities(false)}
                        />
                 )}

{/****************************************************Activity Datas****************************************************/}
            {activity.map((activityData)=>{
                    const config = activityConfig[activityData.type];
                    

                    if(!config) return null;
                    const Icon = config.icon;

                return <div key={activityData.id} className=" w-[95%] 
                                             h-15 items-center  flex  border-b border-gray-200 
                                             last:border-b-0 gap-4 ">
                            
                            <span className={`w-12 h-12 shrink-0 ${config.bgColor} shadow-md rounded-full flex
                                            justify-center items-center`}>
                                 <Icon />
                            </span>                     
                           
                            <div>
                                <p className="text-xs md:text-sm">{config.message(activityData)}</p>
                                <span className="text-xs md:text-sm">{activityData.time}</span>
                            </div>

                        </div>
            })}
        </div>
    )
}

export default ActivityCard;