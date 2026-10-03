import { PieChart, Pie } from "recharts";

const data = [
  { name: "Paid", value: 7250, fill: "#22c55e"},
  { name: "Partial", value: 3450 , fill: "#f59e0b"},
  { name: "Pending", value: 1750,  fill: "#ef4444" },
];

export default function PaymentStatusPieChart() {
  return (
    <div className="w-full h-full rounded-xl  ">
      <div className="h-10 w-full flex ">
        <h2 className=" text-lg font-semibold">Payment Status</h2>
      </div>
      

      <div className="grid items-center justify-center h-full grid-cols-[1.5fr_1.5fr]">
          <div className="max-w-56  relative flex items-center justify-center">
                  <PieChart
                    responsive
                    style={{
                      width: "100%",
                      maxWidth: "300px",
                      aspectRatio: 1,
                    }}
                  >
                    <Pie
                      data={data}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="60%"
                      outerRadius="90%"
                      isAnimationActive={false}
                    /> 
                  </PieChart>
                  
                  <div className="absolute  flex flex-col items-center justify-center">
                      <span className="text-md font-bold">RM 12,450</span>
                      <span className="text-md font-medium text-black">Total</span>
                  </div>
                
          </div>

          <div className="flex flex-col justify-center gap-5  ">
                <div className="flex flex-wrap  items-center">
                    <div className="flex gap-3 items-center">
                      <span className="w-5 h-5  rounded-md bg-green-500"></span>
                       <p>Paid</p>
                    </div>
                    <p className="ml-8">RM 7,250 (58%)</p>
                </div>
                <div className="flex flex-wrap  items-center">
                    <div className="flex gap-3 items-center">
                      <span className="w-5 h-5  rounded-md bg-green-500"></span>
                       <p>Paid</p>
                    </div>
                    <p className="ml-8">RM 7,250 (58%)</p>
                </div>
              <div className="flex flex-wrap  items-center">
                    <div className="flex gap-3 items-center">
                      <span className="w-5 h-5  rounded-md bg-green-500"></span>
                       <p>Paid</p>
                    </div>
                    <p className="ml-8">RM 7,250 (58%)</p>
                </div>
          </div>
      </div>
      
    </div>
  );
}