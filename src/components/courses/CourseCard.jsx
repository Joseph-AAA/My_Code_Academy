import { useEffect, useRef, useState } from "react";
import {
  MoreVertical,
  Pencil,
  Trash2,
  Clock3,
  BookOpen,
  Code2,
  ArrowRight,
} from "lucide-react";
import { getCourseBackground } from "../../components/courses/CourseColor";
function CourseCard({ coursesData,onDelete,onEdit,isAdmin = true,actionLabel,onAction, }){

        const [showMenu, setShowMenu] = useState(false);
        const menuRef = useRef(null);
        const menuButtonRef = useRef(null);

// *************************************** Close Three Dots Menu **********************************
        useEffect(() => {
        const handleOutsideClick = (event) => {
          if (
            menuRef.current?.contains(event.target) ||
            menuButtonRef.current?.contains(event.target)
          ) {
            return;
          }

          setShowMenu(false);
        };

      document.addEventListener("mousedown", handleOutsideClick);

      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
}, []);

 //****************************** Support both database prices and old courseData.js prices **************

      const price = Number(
          String(coursesData.price ?? "").replace(/[^0-9.-]/g, "")
        );

        const formattedPrice = Number.isFinite(price)
          ? price.toLocaleString("en-MY", {
              style: "currency",
              currency: "MYR",
              maximumFractionDigits: 2,
            })
          : "Price unavailable";



    return(
         <div className="relative w-full overflow-visible
           rounded-2xl bg-(--surface) text-(--text-primary)
           border border-(--border) shadow-md cursor-pointer
           transition-all duration-300 ease-in-out
           hover:-translate-y-1 hover:shadow-lg
           hover:border-(--primary)">

{/******************************************  Image / Header *****************************************/}
                    <div
                          style={{
                            backgroundColor: getCourseBackground(coursesData.color),
                          }}
                          className="relative flex h-32 items-center justify-center overflow-visible rounded-t-2xl"
                        >

        {/************************************ Course image or fallback icon ********************************/}
                        {coursesData.imageUrl ? (
                          <img
                              src={coursesData.imageUrl}
                              alt={coursesData.title}
                              className="h-25 w-25 rounded-xl object-contain"
                          />
                        ) : typeof coursesData.icon === "string" ? (
                          <img
                              src={coursesData.icon}
                              alt={coursesData.title}
                              className="h-25 w-25 object-contain"
                          />
                        ) : (
                          (() => {
                            const Icon = coursesData.icon || Code2;

                            return (
                              <Icon
                                  size={48}
                                  strokeWidth={1.5}
                                  className={coursesData.textColor}
                                  aria-hidden="true"
                              />
                            );
                          })()
                        )}

        {/************************************************ Three-dot button *********************************/}
                            {
                              isAdmin && (
                                  <button
                                    ref={menuButtonRef}
                                    type="button"
                                    aria-label="Course options"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowMenu((prev) => !prev);
                                    
                                    }}
                                    className="absolute right-3 top-3 z-10 cursor-pointer rounded-full bg-white/80 p-1 text-gray-700 shadow-sm transition hover:bg-white"
                                    >
                                    <MoreVertical size={22} />
                                </button>
                              )
                            }
              

        {/**************************************************** Dropdown *************************************/}
                          {showMenu && (
                            <div
                              ref={menuRef}
                              className="absolute right-3 top-12 z-70 w-48 rounded-xl border border-(--border) bg-(--surface) py-2 text-(--text-primary) shadow-xl"
                            >
                  {/************************************************** Edit*********************************************/}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setShowMenu(false);
                                          onEdit(coursesData);
                                        }}
                                        className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm text-(--text-primary) transition hover:bg-(--surface-secondary)"
                                      >
                                        <Pencil size={18} />
                                        <span>Edit</span>
                                    </button>

                  {/********************************************* Delete Button***************************************/}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setShowMenu(false);
                                        onDelete(coursesData);
                                      }}
                                      className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm text-red-500 transition hover:bg-(--surface-secondary)"
                                    >
                                        <Trash2 size={18} />
                                        <span>Delete</span>
                                    </button>
                              </div>
                          )}
                    </div>


{/******************************************************************* Course information ************************************************************/}
        
                <div className="px-5 pb-5 pt-4 z-2">

{/************************************************************************** Category ***************************************************************/}
                        <p className="mb-4 text-sm font-medium text-(--primary)">
                             {coursesData.category}
                        </p>

{/************************************************************************** Title *******************************************************************/}
                        <h3 className="mb-5 text-xl font-semibold text-(--text-primary)">
                            {coursesData.title}
                        </h3>

{/************************************************************************** Level *******************************************************************/}
              
                        <span className="inline-flex rounded-full border border-(--border) px-3 py-1 text-sm font-medium text-(--text-secondary)">
                            {coursesData.level}
                        </span>


{/************************************************************************** Divider Line ************************************************************/}
                   
                         <div className="my-5 border-t border-(--border)" />

{/**********************************************************************Bottom information************************************************************/}
                
                       <div className="flex items-center justify-between text-(--text-secondary)">

{/*************************************** Duration ****************************************************/}
                                        
                                        <div className="flex items-center gap-2">
                                            <Clock3 size={17} />
                                            <span>{coursesData.duration}</span>
                                        </div>

                                 
{/*******************************************  Price *************************************************/}
                                      <span className="font-semibold text-(--text-primary)">
                                        {formattedPrice}
                                      </span>

{/******************************************* Students *************************************************/}

                                        <div className="flex items-center gap-2">
                                            <BookOpen size={17} />
                                            <span>{coursesData.students} students</span>
                                        </div>
                        </div>
                        {actionLabel && onAction && (
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              onAction(coursesData);
                            }}
                            className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-(--primary) px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-(--primary) focus:ring-offset-2"
                          >
                            {actionLabel}
                            <ArrowRight size={16} />
                          </button>
                        )}
                </div>
        </div>
    )

    
}

export default CourseCard;