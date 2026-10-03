import { useState } from "react";
import { 
  ArrowLeft, BookOpen, Clock, DollarSign, Users, Star, 
  CheckCircle, ChevronDown, Award, PlayCircle, X
} from "lucide-react";

const curriculumData = [
  {
    section: "Introduction",
    lessons: [
      { title: "Welcome to the Course", duration: "5 min", preview: true },
      { title: "How to Get the Most Out of This Course", duration: "7 min", preview: true },
      { title: "Course Overview", duration: "4 min", preview: false },
    ],
  },
  {
    section: "Core Concepts",
    lessons: [
      { title: "Setting Up the Environment", duration: "12 min", preview: false },
      { title: "Understanding the Basics", duration: "15 min", preview: false },
      { title: "Working with Data", duration: "10 min", preview: false },
    ],
  },
  {
    section: "Advanced Topics",
    lessons: [
      { title: "State Management", duration: "20 min", preview: false },
      { title: "Performance Optimization", duration: "18 min", preview: false },
      { title: "Deployment", duration: "14 min", preview: false },
    ],
  },
];

export default function CourseDetails({ course, onBack }) {
  const [expandedSection, setExpandedSection] = useState(0);

  if (!course) return null;

  const {
    title,
    category,
    level,
    duration,
    price,
    students,
    icon,
    color,
    description,
    instructor,
    rating,
    totalLessons,
  } = course;

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? -1 : index);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6"
      >
        <ArrowLeft size={18} />
        Back to Courses
      </button>

      {/* Course Banner */}
      <div className={`${color} rounded-xl p-6 mb-6 relative overflow-hidden`}>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 rounded-lg p-4">
              <span className="text-5xl font-bold text-white">
                  <img className="w-23" src={course.icon} alt={course.title}/> 
              </span>
            </div>
            <div>
              <span className="inline-block bg-white/20 text-white text-xs font-medium px-2 py-1 rounded-full mb-2">
                {category}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
              <p className="text-white/80 mt-1">{level} • {duration}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2">
            <Star size={18} className="text-yellow-300 fill-yellow-300" />
            <span className="text-white font-bold">{rating}</span>
            <span className="text-white/80 text-sm">({students} students)</span>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full"></div>
        <div className="absolute -right-20 -top-20 w-60 h-60 bg-white/5 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Stats */}
          <div className="bg-white border border-(--border) rounded-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-semibold">{duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Lessons</p>
                <p className="font-semibold">{totalLessons} lessons</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users size={18} className="text-purple-500" />
              <div>
                <p className="text-sm text-gray-500">Students</p>
                <p className="font-semibold">{students} enrolled</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign size={18} className="text-yellow-500" />
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="font-semibold">{price}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white border border-(--border) rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3">About this Course</h2>
            <p className="text-gray-600 leading-relaxed">{description}</p>
          </div>

          {/* What you'll learn */}
          <div className="bg-white border border-(--border) rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">What you'll learn</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                "Build responsive web applications",
                "Master the core concepts of the framework",
                "Write clean and maintainable code",
                "Deploy applications to production",
                "Implement state management",
                "Optimize performance",
                "Understand best practices",
                "Work with APIs and external services",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-500 mt-0.5 shrink-0" />
                  <span className="text-gray-700 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Curriculum */}
          <div className="bg-white border border-(--border) rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Course Curriculum</h2>
            {curriculumData.map((section, index) => (
              <div key={index} className="border-b border-(--border) last:border-0">
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full flex items-center justify-between py-3 text-left"
                >
                  <span className="font-medium text-gray-800">{section.section}</span>
                  <ChevronDown
                    size={18}
                    className={`text-gray-400 transition-transform ${
                      expandedSection === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedSection === index && (
                  <ul className="pb-3 space-y-2">
                    {section.lessons.map((lesson, idx) => (
                      <li key={idx} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <PlayCircle size={16} className="text-blue-500" />
                          <span className="text-sm text-gray-700">{lesson.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {lesson.preview && (
                            <span className="text-xs text-green-600 font-medium">Preview</span>
                          )}
                          <span className="text-xs text-gray-400">{lesson.duration}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Enroll Card */}
          <div className="bg-white border border-(--border) rounded-xl p-6">
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 mb-4 font-semibold">
              Enroll Now
            </button>
            <p className="text-center text-sm text-gray-500 mb-4">
              30-Day Money-Back Guarantee
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Level</span>
                <span className="font-medium">{level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Duration</span>
                <span className="font-medium">{duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Lessons</span>
                <span className="font-medium">{totalLessons}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Students</span>
                <span className="font-medium">{students}</span>
              </div>
            </div>
          </div>

          {/* Instructor Card */}
          <div className="bg-white border border-(--border) rounded-xl p-6">
            <h3 className="font-bold text-gray-800 mb-4">Instructor</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                {instructor?.name?.charAt(0) || "A"}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{instructor?.name || "Admin"}</p>
                <p className="text-sm text-gray-500">{instructor?.title || "Instructor"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Award size={16} className="text-yellow-500" />
              <span>{rating} Rating</span>
              <span>•</span>
              <span>{Math.floor(students / 10)} Reviews</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <Users size={16} className="text-blue-500" />
              <span>{students} Students</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <PlayCircle size={16} className="text-green-500" />
              <span>{Math.ceil(totalLessons / 10)} Courses</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}