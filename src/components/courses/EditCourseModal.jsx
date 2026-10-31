import { useState } from "react";
import { X } from "lucide-react";
import ImageUpload from "./ImageUpload";

const API_URL = import.meta.env.VITE_API_URL;

function EditCourseModal({ courseToEdit, onClose, onUpdated }) {
  const [formData, setFormData] = useState(() => ({
    title: courseToEdit.title || "",
    category: courseToEdit.category || "Web Development",
    level: courseToEdit.level || "Beginner",
    duration: courseToEdit.duration || "",
    price: String(courseToEdit.price ?? ""),
    description: courseToEdit.description || "",
    status: courseToEdit.status || "Draft",
    releaseDate: courseToEdit.releaseDate
      ? String(courseToEdit.releaseDate).slice(0, 10)
      : "",
    icon:
      typeof courseToEdit.icon === "string"
        ? courseToEdit.icon
        : "Code2",
    color: courseToEdit.color || "#FACC15",
    instructorName: courseToEdit.instructor?.name || "",
    instructorTitle: courseToEdit.instructor?.title || "",
  }));

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courseImage, setCourseImage] = useState(null);
  const [instructorImage, setInstructorImage] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "instructorName" && key !== "instructorTitle") {
          payload.append(key, String(value ?? ""));
        }
      });

      payload.append("instructorName", formData.instructorName.trim());
      payload.append("instructorTitle", formData.instructorTitle.trim());

      if (courseImage) {
        payload.append("courseImage", courseImage);
      }

      if (instructorImage) {
        payload.append("instructorImage", instructorImage);
      }

      const response = await fetch(
        `${API_URL}/api/courses/${courseToEdit.id}`,
        {
          method: "PUT",
          body: payload,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update course.");
      }

      onUpdated(data.course);
      onClose();
    } catch (err) {
      console.error("Update course error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  
    const inputClass =
          "mt-1 w-full rounded-lg border border-(--border) bg-(--surface) px-3 py-2.5 text-(--text-primary) outline-none placeholder:text-(--text-muted) focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20";

return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-course-title"
      className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-(--border) bg-(--surface) text-(--text-primary) shadow-xl"
      onClick={(event) => event.stopPropagation()}
    >
      {/* Header */}
      <div className="sticky top-0 flex items-center justify-between border-b border-(--border) bg-(--surface) px-6 py-4">
        <div>
          <h2
            id="edit-course-title"
            className="text-xl font-bold text-(--text-primary)"
          >
            Edit Course
          </h2>
          <p className="mt-1 text-sm text-(--text-secondary)">
            Update the course and instructor details.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Close form"
          className="cursor-pointer rounded-lg p-2 text-(--text-secondary) transition hover:bg-(--surface-secondary) hover:text-(--text-primary) disabled:opacity-50"
        >
          <X size={22} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="title"
              className="text-sm font-medium text-(--text-primary)"
            >
              Course Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. React for Beginners"
              required
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="text-sm font-medium text-(--text-primary)"
            >
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option>Web Development</option>
              <option>Backend Development</option>
              <option>Frontend Development</option>
              <option>Mobile Development</option>
              <option>Database</option>
              <option>UI/UX Design</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="level"
              className="text-sm font-medium text-(--text-primary)"
            >
              Level <span className="text-red-500">*</span>
            </label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="duration"
              className="text-sm font-medium text-(--text-primary)"
            >
              Duration <span className="text-red-500">*</span>
            </label>
            <input
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. 8 weeks"
              required
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="text-sm font-medium text-(--text-primary)"
            >
              Price (RM) <span className="text-red-500">*</span>
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className={inputClass}
              placeholder="899.00"
              required
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="text-sm font-medium text-(--text-primary)"
            >
              Status <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Upcoming">Upcoming</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="releaseDate"
              className="text-sm font-medium text-(--text-primary)"
            >
              Release Date
            </label>
            <input
              id="releaseDate"
              name="releaseDate"
              type="date"
              value={formData.releaseDate}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="description"
              className="text-sm font-medium text-(--text-primary)"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={inputClass}
              rows={4}
              placeholder="Describe what students will learn..."
              required
            />
          </div>

          {/* Course Logo */}
          <div className="sm:col-span-2 border-t border-(--border) pt-5">
            <h3 className="mb-4 font-semibold text-(--text-primary)">
              Course Logo
            </h3>

            <div>
              <label
                htmlFor="color"
                className="text-sm font-medium text-(--text-primary)"
              >
                Course Background Color
              </label>

              <div className="mt-2 flex items-center gap-3">
                <input
                  id="color"
                  name="color"
                  type="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="h-11 w-14 cursor-pointer rounded border border-(--border) p-1"
                />
                <span className="text-sm text-(--text-secondary)">
                  {formData.color}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <ImageUpload
                label="Course Image"
                value={courseImage}
                onChange={setCourseImage}
                existingImageUrl={courseToEdit.imageUrl || ""}
              />
            </div>
          </div>
        </div>

        {/* Instructor */}
        <div className="border-t border-(--border) pt-5">
          <h3 className="mb-3 font-semibold text-(--text-primary)">
            Instructor (Optional)
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="instructorName"
                className="text-sm font-medium text-(--text-primary)"
              >
                Instructor Name
              </label>
              <input
                id="instructorName"
                name="instructorName"
                value={formData.instructorName}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. Mike Johnson"
              />
            </div>

            <div>
              <label
                htmlFor="instructorTitle"
                className="text-sm font-medium text-(--text-primary)"
              >
                Job Title
              </label>
              <input
                id="instructorTitle"
                name="instructorTitle"
                value={formData.instructorTitle}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. Backend Engineer"
              />
            </div>
          </div>

          <div className="mt-4">
            <ImageUpload
              label="Instructor Profile Picture"
              value={instructorImage}
              onChange={setInstructorImage}
              existingImageUrl={courseToEdit.instructor?.imageUrl || ""}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        )}

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 border-t border-(--border) pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="cursor-pointer rounded-lg border border-(--border) px-4 py-2.5 text-(--text-secondary) transition hover:bg-(--surface-secondary) disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer rounded-lg bg-(--primary) px-5 py-2.5 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Updating..." : "Update Course"}
          </button>
        </div>
      </form>
    </div>
  </div>
);

}

export default EditCourseModal;


