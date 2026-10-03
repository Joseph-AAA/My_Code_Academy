
import {dashboardCards} from '../../data/data';
import DashboardCard from '../dashboard/DashboardCard';

function DashboardComponent() {
    return(  
              <div className='grid  sm:grid-cols-2  md:grid-cols-3  xl:grid-cols-2  2xl:grid-cols-4 gap-3 flex-wrap mt-6'>
                 {
                        dashboardCards.map((card) => {
                            return  (<DashboardCard
                                        key={card.label}
                                        icon={card.icon}
                                        value={card.value}
                                        label={card.label}
                                        bgColor={card.bgColor}
                                        Icon={card.icon}
                                        change = {card.change}
                                        text={card.text}
                                    />)
                        })
                    }
              </div>         
    );
    
        }
    export default DashboardComponent;