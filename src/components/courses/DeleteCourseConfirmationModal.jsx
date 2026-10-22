import { Trash2, X, CheckCircle2 } from "lucide-react";

function DeleteCourseConfirmationModal({
                                        isOpen,
                                        courseTitle,
                                        onCancel,
                                        onConfirm,
                                        isDeleting,
                                        error,
                                        isSuccess,
                                      }) {
                                            if (!isOpen) return null;

  const handleBackdropClick = (event) => {

//************************* Close only when clicking the backdrop itself ***************************
          if (event.target === event.currentTarget && !isDeleting) {
            onCancel();
          }
        };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-course-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onMouseDown={(event) => event.stopPropagation()}
      >

{/********************************************* Check and Trash Icon ***********************************************/}
          <div className="mb-4 flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${
                      isSuccess ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                          {isSuccess ? (
                            <CheckCircle2 size={24} className="text-green-600" />
                          ) : (
                            <Trash2 size={24} className="text-red-600" />
                          )}
                  </div>

                  <button
                    type="button"
                    onClick={onCancel}
                    disabled={isDeleting}
                    aria-label="Close modal"
                    className="hover:cursor-pointer rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                  >
                      <X size={20} />
                  </button>
          </div>

{/**************************************** Delete Successfully ***************************************/}
 
        {isSuccess ? (
          <>
           <h2
              id="delete-course-title"
              className="text-lg font-semibold text-gray-900"
            >
              Course Successfully Deleted!
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              "{courseTitle}" has been successfully deleted.
            </p>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="hover:cursor-pointer rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                  Close
              </button>
            </div>
          </>
        ) : (
          <>
{/* ******************************************* Delete Course? *****************************************/}
                <h2
                  id="delete-course-title"
                  className="text-lg font-semibold text-gray-900"
                >
                  Delete Course?
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-gray-900">
                    "{courseTitle}"
                  </span>
                  ? This action cannot be undone.
                </p>

                {error && (
                    <p
                      role="alert"
                      className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600"
                    >
                      {error}
                    </p>
                )}

{/****************************************** Delete and Cancel Button ********************************/}
            <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onCancel}
                    disabled={isDeleting}
                    className="hover:cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={onConfirm}
                    disabled={isDeleting}
                    className="hover:cursor-pointer inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                      {isDeleting ? "Deleting..." : "Delete"}
                  </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DeleteCourseConfirmationModal;
