import { CalendarDays} from "lucide-react";
import { useState } from "react";
import {
  MoreVertical,
  Pencil,
  Trash2,
  Clock3,
  BookOpen,
} from "lucide-react";
function CourseCard({coursesData}){

        const [showMenu, setShowMenu] = useState(false);

    return(
         <div className="relative w-full overflow-visible rounded-2xl bg-white shadow-md cursor-pointer">

{/*************************************************************  Image / Header ********************************************************/}

                <div className={`${coursesData.bgcolor} flex justify-center overflow-visible items-center shadow-sm relative h-32 rounded-t-2xl bg-black`}>
                    <img
                        src={coursesData.icon}
                        alt={coursesData.title}
                        className="w-25 object-cover"
                    />


{/************************************************************* Three-dot button  ********************************************************/}
    
                    <button
                        type="button"
                        aria-label="Course options"
                        onClick={() => setShowMenu((prev) => !prev)}
                        className="absolute right-3 top-3 z-1 cursor-pointer rounded-full p-1 text-white transition hover:bg-white/10"
                    >
                        <MoreVertical size={24} />
                    </button>

{/******************************************************************* Dropdown ************************************************************/}
               
                    {showMenu && (
                    <div className="absolute right-3 top-12 z-30 w-48 overflow-hidden 
                                    rounded-2xl bg-white py-2 shadow-xl">
                        <button
                            type="button"
                            onClick={() => {
                                console.log("Edit", coursesData.id);
                                setShowMenu(false);
                                 }}
                            className="flex w-full cursor-pointer items-center gap-4 px-5 py-3 text-left 
                                        text-lg text-gray-700 transition hover:bg-gray-100"
                        >
                            <Pencil size={20} />
                            <span>Edit</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                console.log("Delete", coursesData.id);
                                setShowMenu(false);
                            }}
                            className="flex w-full cursor-pointer items-center gap-4 px-5 py-3 text-left 
                                        text-lg text-red-500 transition hover:bg-red-50"
                        >
                                <Trash2 size={20} />
                                 <span>Delete</span>
                            </button>
                    </div>
                    )}
                       {showMenu && (
                                <div
                                    className="fixed inset-0 z-3 "
                                    onClick={() => setShowMenu(false)}
                                    
                                    />
                        )}
                </div>

{/******************************************************************* Course information ************************************************************/}
        
                <div className="px-5 pb-5 pt-4 z-2">

{/************************************************************************** Category ***************************************************************/}
                    <p className="mb-4 text-sm font-medium text-blue-900">
                         {coursesData.category}
                    </p>

{/************************************************************************** Title *******************************************************************/}
                    <h3 className="mb-5 text-xl font-medium text-gray-900">
                        {coursesData.title}
                    </h3>

{/************************************************************************** Level *******************************************************************/}
              
                    <span className="inline-flex rounded-full border border-gray-400 px-3 py-1 text-sm text-gray-700">
                         {coursesData.level}
                    </span>


{/************************************************************************** Divider Line ************************************************************/}
                   
                            <div className="my-5 border-t border-gray-200" />

{/**********************************************************************Bottom information************************************************************/}
                
                            <div className="flex items-center justify-between text-gray-600">

                                {/* Duration */}
                                    <div className="flex items-center gap-2">
                                        <Clock3 size={17} />
                                        <span>{coursesData.duration}</span>
                                    </div>

                                {/* Price */}
                                    <span className="font-medium text-gray-700">
                                        {coursesData.price}
                                    </span>

                                {/* Students */}
                                    <div className="flex items-center gap-2">
                                        <BookOpen size={17} />
                                        <span>{coursesData.students} students</span>
                                    </div>
                             </div>
                    </div>
            </div>
    )

    
}

export default CourseCard;