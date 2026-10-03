import { createContext, useContext, useMemo } from "react";
import { payments } from "../data/data";


const PaymentContext = createContext();
export function PaymentProvider ({children}){

    const totalRevenue = useMemo(()=>{
      return  payments.reduce((total,current)=>{
        return   (total+current.amountPaid)},0)
    },[]);
    // console.log(totalRevenue);

    const totalFee = useMemo(()=>{
      return payments.reduce((total, currentFee)=>{
          return (total + currentFee.totalFee);
      })
    },[])



      const chartData = useMemo(()=>{
           const monthlyRevenue = {};
            payments.forEach((payment)=>{
                if(!payment.paymentDate){   //checking any payment date exist or not
                  return;                   //if no, will skip
                }
                 //if exist, will assign as month short form. eg :"2026-04-03" → month = "Apr"
                 const month = new Date(payment.paymentDate).toLocaleDateString(
                    "en-US",
                    { month: "short" }
                  );
               
                //after that, checking this month ald exists in monthlyRevenue obj
                //if not yet, will create property and value of 0 and 
                //if ald existed, will add payment amount to existing total of that month 
                if(!monthlyRevenue[month]){
                    monthlyRevenue[month] = 0;
                }
                //for monthlyRevenue is declared as obj, 
               
                monthlyRevenue[month] += payment.amountPaid;  //this will create as obj eg.{ Apr : 500 }
                
                }
              )
              //Object.entries() converts the object into an array of [key, value] pairs
              //map convert that array as obj array
              return Object.entries(monthlyRevenue).map(([month, revenue])=>({month, revenue}))
      },[])

    return (
        <PaymentContext.Provider value={{payments,totalRevenue,chartData}}>
            {children}
        </PaymentContext.Provider>
    )
}


export function usePayment(){
        return useContext(PaymentContext);
}