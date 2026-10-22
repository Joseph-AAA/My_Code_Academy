
import { useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";

function ImageUpload({
  label,
  value,
  onChange,
  existingImageUrl = "",
}) {
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!value) {
      setPreview(existingImageUrl || "");
      return;
    }

    const objectUrl = URL.createObjectURL(value);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [value, existingImageUrl]);

  const handleChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be 5 MB or less.");
      event.target.value = "";
      return;
    }

    onChange(file);
  };

  const handleRemove = () => {
    onChange(null);
  };

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-gray-700">
        {label}
      </p>

      <div className="flex items-center gap-4">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-gray-300 bg-gray-50">
          {preview ? (
            <img
              src={preview}
              alt={`${label} preview`}
              className="h-full w-full object-cover"
            />
          ) : (
            <ImagePlus className="text-gray-400" size={30} />
          )}
        </div>

        <div className="flex flex-col items-start gap-2">
          <label className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50">
            Choose Image

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleChange}
            />
          </label>

          <p className="text-xs text-gray-500">
            PNG, JPG or WebP · Max 5 MB
          </p>

          {value && (
            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
            >
              <X size={14} />
              Remove selected image
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageUpload;
