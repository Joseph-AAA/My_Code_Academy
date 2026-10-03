import {Bell, ChevronDown,Menu } from "lucide-react";


function Navbar({sidebarOpen, setSidebarOpen}) {
    console.log(sidebarOpen)
  return <>
              <form className="page-container flex justify-between lg:justify-end items-center gap-4 w-[95%]
                               h-full  ">
                    {/* <input
                    placeholder = "Search Students..."
                        className="h-9 w-[45%] rounded-md border border-gray-300 text-sm 
                                    focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-e-blue-300 px-2"
                    /> */}

                     <button className="flex justify-center items-center lg:hidden w-10 h-10 
                                     border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200"
                          onClick={()=>{setSidebarOpen(!sidebarOpen)}}
                           type="button">
                          
                         <Menu />
                    </button>   
                    <div className="w-auto flex items-center gap-4 h-full">
                        <Bell className="size-5 text-gray-500 cursor-pointer" />
                        <div className="flex h-full items-center justify-end">
                                <div className="flex items-center gap-3 cursor-pointer">

                                    {/* Profile Image */}
                                    <img
                                        src="https://i.pravatar.cc/100?img=12"
                                        alt="Admin User"
                                        className="size-10 rounded-full object-cover"
                                    />

                                    {/* Name */}
                                    <span className="text-sm font-semibold text-gray-700">
                                        Admin User
                                    </span>

                                    {/* Down Arrow */}
                                    <ChevronDown className="size-5 text-gray-500" />
                                </div>
                        </div>
                    </div>
              
              </form>  
         </>
}
export default Navbar;