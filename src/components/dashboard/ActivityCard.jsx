import { activity,activityConfig } from "../../data/data";
import { useState } from "react";
import { Activity , ArrowRight} from "lucide-react";
function ActivityCard(){
    const [activities, setActivities] = useState(activity);
    
    // console.log(activities)

    return(
        <div className="w-full flex flex-col items-center h-96 rounded-xl bg-white shadow-sm">
            <div className="w-[95%] h-16  flex items-center justify-between">
                <h3 className="text-xs md:text-md font-bold flex flex-col sm:flex-row gap-3 text-blue-600">
                    <Activity />
                     Recent Activites
                </h3>
                <a href="#" className="flex text-sm md:text-md gap-3  text-blue-600">
                    View All Activites <ArrowRight />
                </a>
            </div>
            {activities.map((activity)=>{
                    const config = activityConfig[activity.type];
                    

                    if(!config) return null;
                    const Icon = config.icon;

                return <div key={activity.id} className=" w-[95%] 
                                             h-15 items-center  flex  border-b border-gray-200 
                                             last:border-b-0 gap-4 ">
                            
                            <span className={`w-12 h-12 shrink-0 ${config.bgColor}  rounded-full flex
                                            justify-center items-center`}>
                                 <Icon />
                            </span>                     
                           
                            <div>
                                <p className="text-xs md:text-sm">{config.message(activity)}</p>
                                <span className="text-xs md:text-sm">{activity.time}</span>
                            </div>

                        </div>
            })}
        </div>
    )
}

export default ActivityCard;