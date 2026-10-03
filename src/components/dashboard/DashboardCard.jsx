
function DashboardCard({ label, value, icon, Icon, change,bgColor,text}) {
  return (
        <div className="flex h-26  w-full  rounded-xl bg-white shadow-sm">
            <div className={`flex w-15 shrink-0  pt-5 justify-center rounded-xl ${bgColor}`}>
              <Icon className="size-7 text-white" />
            </div>

            <div className="flex flex-col  justify-center h-full items  px-4">
                <h2 className="text-md md:text-xl font-bold">{value}</h2>
                <p className="text-sm text-gray-500">{label}</p>

                <p className="text-sm md:text-xs">
                  <span className="text-green-800">{change}</span> {text}
                </p>
            </div>
        </div>

  );
}   
export default DashboardCard;