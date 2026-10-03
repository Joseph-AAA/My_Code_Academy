
import {sidebarLinks} from "../../data/data.js";  
import { GraduationCap, X } from "lucide-react";
import { NavLink,Link } from "react-router-dom";
function Sidebar({sidebarOpen,setSidebarOpen}) {
  return <div className="flex flex-col w-[89%] min-h-80  gap-1">

                      <Link to="/" className="flex items-center gap-2 h-20 
                                    justify-between lg:justify-center ">
                        <div className="flex items-center gap-5">
                          <GraduationCap className="size-16 " />
                        
                          <div>
                              <h2 className="text-sm font-bold">MyCode Academy</h2>
                              <p>Student Portal</p>
                          </div>
                        </div>
                         <button className="flex justify-center items-center lg:hidden w-10 h-10 
                                         border border-gray-500 rounded-md cursor-pointer hover:bg-red-400"
                                onClick={()=>{setSidebarOpen(!sidebarOpen)}}
                                type="button">
                          
                             <X />
                        </button>   
                      </Link>

                      {sidebarLinks.map((link) => (
                          <NavLink
                              onClick={() => setSidebarOpen(false)}
                              key={link.path}
                              to={link.path}
                            //   className={`${(isActive)=>{isActive ? 'bg-red-600 text-white' : 'hover:bg-gray-200'}} flex  items-center gap-3 h-12  pl-3 rounded-md cursor-pointer hover:bg-(--primary-hover)`}
                            className={({ isActive }) =>isActive ? 'flex items-center gap-3 h-12 pl-3 rounded-md bg-blue-600 hover:bg-(--primary-hover) text-white' 
                                                                  : 'flex items-center gap-3 h-12 pl-3 rounded-md hover:bg-white/10'}>             
                                <link.icon className="size-5 " />
                                <span className="text-sm font-medium">
                                  {link.label}
                                </span>
                          </NavLink>
                    
                        ))}
            </div>
}
export default Sidebar;