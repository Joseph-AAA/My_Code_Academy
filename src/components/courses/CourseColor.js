const courseColors = {
  "bg-blue-400": "#60A5FA",
  "bg-blue-500": "#3B82F6",
  "bg-yellow-400": "#FACC15",
  "bg-green-400": "#4ADE80",
  "bg-green-500": "#22C55E",
  "bg-orange-500": "#F97316",
  "bg-pink-500": "#EC4899",
  "bg-purple-400": "#C084FC",
  "bg-cyan-400": "#22D3EE",
  "bg-gray-800": "#1F2937",
};

export function getCourseBackground(color) {
  if (!color) return "#DBEAFE";

  // Convert existing Tailwind color names to hex values
  if (courseColors[color]) {
    return courseColors[color];
  }

  // Support colors selected with the HTML color picker
  if (/^#[0-9a-fA-F]{6}$/.test(color)) {
    return color;
  }

  return "#DBEAFE";
}