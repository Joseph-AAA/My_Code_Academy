import {CalendarDays} from 'lucide-react';
import DashboardComponent from '../components/dashboard/DashboardComponent';
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
// import ActivityComponent from '../components/dashboard/ActivityComponent';
import ActivityCard from '../components/dashboard/ActivityCard';
import RevenueOverviewChart from '../components/dashboard/RevenueOverviewChart';
import TopCourses from '../components/dashboard/TopCourses';
import UpcomingCourses from '../components/dashboard/UpcomingCourses';
import PaymentStatus from '../components/dashboard/PaymentStatus';
import ShowHighlights from '../components/dashboard/ShowHighlights';
import { useState,useRef } from 'react';



function Dashboard (){
    const[showCalendar , setShowCalendar] = useState(false);
    const day = new Date().toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' });
    
   
    
    return  <div className=" grid w-full min-w-0 grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]
                             2xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]
                             gap-3 border-(--border) rounded-xl ">

                    <section className='min-w-0 grid gap-3'>
{/*****************************************************header**********************************************/}
                        <header className ="flex flex-wrap gap-5 justify-between items-center ">
                            <span className="min-w-0 md:w-[50%] w-full flex flex-col gap-2  ">
                                <h1 className=" font-bold text-xl sm:text-2xl lg:text-3xl text-[#21295e]">
                                    Welcome back, Admin!👋
                                </h1>
                                <p className="text-sm text-(--text-primary)">
                                    Here's what's happening with MyCodeAcademy today.
                                </p>
                            </span>

                            <span  className="hover:cursor-pointer relative shrink-0 border-2 border-(--border) rounded-xl 
                                              w-40 h-10 flex justify-center items-center gap-2 
                                              text-(--text-primary) text-sm"
                                onClick={()=>setShowCalendar((prev)=>!prev)}>
                                
                                <CalendarDays />
                                {day}
                                <div className='w-full h-full absolute mt-13 ' >
                                    {
                                    showCalendar &&  <div className="absolute top-5  md:right-0 z-6  w-72" onClick={(e) => e.stopPropagation()}>
                                        <Calendar className="w-full rounded-md" />
                                    </div>   
                                }  
                                </div>
                            </span>
                            {showCalendar && (
                                <div
                                    className="fixed inset-0 z-3 bg-black/30"
                                    onClick={() => setShowCalendar(false)}
                                    
                                    />
                                )}
                            
                        </header>

{/****************************************************Total View Card***********************************************/}
                        <DashboardComponent />
                        
                      <div className="grid min-w-0 grid-cols-1 2xl:grid-cols-2 gap-3 ">
                            <div className="min-w-0">
                                <ActivityCard />
                            </div>

                            <div className="min-w-0">
                                <RevenueOverviewChart />
                            </div>
                        </div>  
                        <div className='min-w-0'>
                            <UpcomingCourses />    
                        </div>                
                    </section>
{/******************************************************Top Courses***********************************************/}
                    <section className='min-w-0  flex flex-col gap-3'>
                        <div className=''>
                            <TopCourses />
                        </div>
                        
                        <div>
                            <PaymentStatus />
                        </div>
                         <div className='min-h-96 2xl:flex-1'>
                            <ShowHighlights />
                        </div>
                    </section>

            </div>
}
export default Dashboard;