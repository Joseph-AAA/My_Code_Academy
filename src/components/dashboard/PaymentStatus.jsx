import PaymentStatusPieChart from './PaymentStatusPieChart'
function PaymentStatus(){
    return(
        <div className="w-full bg-white h-85 shadow-sm rounded-xl flex justify-center p-2 items-center">
            <div className="w-[90%]   rounded-2xl">
                    <PaymentStatusPieChart />
            </div>
        </div>
    )
}
export default PaymentStatus;