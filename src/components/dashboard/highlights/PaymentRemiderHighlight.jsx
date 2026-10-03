import { Wallet, CreditCard, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import paymentReminder from "../../../assets/highlight-icons/paymentRemider.png";

function PaymentRemiderHighlight() {
  return (
    <div className="h-full">
          <div className="h-full gap-4 flex flex-col relative justify-center">
             {/* <div className="flex items-center justify-between">
                 <h3 className="text-2xl font-bold"> Highlights</h3>
                 <div className="flex gap-3">
                    <span className="w-5 h-5 bg-gray-400 rounded-full"></span>
                    <span className="w-5 h-5 bg-gray-400 rounded-full"></span>
                    <span className="w-5 h-5 bg-gray-400 rounded-full"></span>
                    <span className="w-5 h-5 bg-gray-400 rounded-full"></span>
                 </div>
             </div> */}
              <div className="flex gap-3">
                  <div className="flex h-15 w-15 sm:h-20 sm:w-20 shrink-0 
                        items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <CreditCard className="w-[60%] h-[60%]" />
                  </div>

                  <div className="w-full">
                    <h3 className="font-medium text-2xl  text-slate-900">
                      Payment Reminder
                    </h3>

                    <p className="w-full flex text-sm text-slate-500 z-10 text-wrap">
                      12 students have outstanding payments
                    </p>
                  </div>
              </div>

              <div className="grid gap-2">
                <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
                  RM 3,450
                </h2>

                <p className="text-lg text-slate-500">
                  Outstanding
                </p>
              </div>

              <button className="bg-blue-300 hover:cursor-pointer rounded-2xl h-8 sm:h-13 p-5 mt-auto  flex w-fit items-center gap-2 text-lg font-medium text-blue-600">
                View Payments
                <ArrowRight size={16} />
              </button>

              <div className="absolute right-0 top-1/2 -translate-y-1/3">
                <img src={paymentReminder}
                  className="w-25 sm:w-45 " />
              </div>
          </div>
    </div>
    
  );
};

export default PaymentRemiderHighlight;