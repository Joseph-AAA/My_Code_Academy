import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { ChevronDown } from "lucide-react";
import { usePayment } from "../../context/PaymentContext";

function RevenueOverviewChart(){
     const {chartData,payments,totalRevenue} = usePayment();

    
//    console.log(payments);

   

    return(
        <div className="w-full flex flex-col items-center rounded-xl h-96
                         bg-white shadow-sm">
                <div className="w-full flex  items-cente p-5 py-5 justify-between">             
                        <div>
                            <h3 className="font-bold">Revenue Overview</h3>
                        </div>

                        <div className="relative w-32 h-12 flex">
                            <select className="appearance-none cursor-pointer border border-gray-300 px-2  w-full rounded-md">
                                <option value="this-month">
                                    This month
                                </option>

                                <option value="last-month">
                                    Last month
                                </option>

                                <option value="last-3-months">
                                    Last 3 months
                                </option>

                                <option value="this-year">
                                    This year
                                </option>
                             </select>
                             <ChevronDown  className="pointer-events-none absolute size-4  right-2 top-1/2 -translate-y-1/2"/>
                        </div>
                        
                </div>                
                <div className="flex flex-col justify-start w-full px-5 font-bold">
                    <h1 className="text-lg md:text-2xl">{totalRevenue}  </h1>   
                    <p className="text-sm md:text-xl px-1 font-medium">Totoal Revenue</p>
                </div>  
                <div className="w-full min-w-0 overflow-hidden pr-5">
                    <ResponsiveContainer width="100%" height={240}>
                        <AreaChart  data={chartData}>
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />

                                <Area
                                type="monotone"
                                dataKey="revenue"
                                fill="#2563eb"
                                stroke="#2563eb"
                                fillOpacity={0.15}
                                />
                         </AreaChart>
                     </ResponsiveContainer>
                </div>
            </div>
    )
}

export default RevenueOverviewChart;