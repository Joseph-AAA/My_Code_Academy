
import javascript from "../assets/course-icons/javascript.png";
import reactIcon from "../assets/course-icons/react..png";
import node from "../assets/course-icons/node.png";
import typescript from "../assets/course-icons/typescript.png";
import html5 from "../assets/course-icons/html5.png";
import css3 from "../assets/course-icons/css3.png";
import python from "../assets/course-icons/python.png";
import ui_ux from "../assets/course-icons/ui-ux.png";
import nextjs from "../assets/course-icons/next.png";
import mongo from "../assets/course-icons/mongo.png";
import tailwindcss from "../assets/course-icons/tailwind.png";
import express from "../assets/course-icons/express.png";

import {
  Home,
  BookOpen,
  Users,
  CreditCard, 
  Settings,
  Info,
  BarChart3,CheckCircle,Clock,FileText,
   WalletCards, UserPlus,Mail,UserRound,
} from "lucide-react";



export const courses = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    category: "Web Development",
    level: "Beginner",
    duration: "8 weeks",
    price: "RM 899",
    students: 110,
    icon: javascript,
    color: "bg-yellow-400",
    bgcolor: "bg-yellow-400/30",
    textColor: "text-yellow-600",
    status: "Published",
    description:
      "Master JavaScript from the ground up. This course covers variables, functions, arrays, objects, and DOM manipulation.",
    rating: 4.8,
    totalLessons: 48,
    instructor: {
      name: "John Doe",
      title: "Senior Developer",
      image: "https://www.loremfaces.net/96/id/1.jpg",
    },
  },

  {
    id: 2,
    title: "React.js Bootcamp",
    category: "Web Development",
    level: "Intermediate",
    duration: "10 weeks",
    price: "RM 899",
    students: 85,
    icon: reactIcon,
    color: "bg-blue-400",
    bgcolor: "bg-blue-400/30",
    textColor: "text-blue-600",
    status: "Published",
    description:
      "Learn React from scratch and build real-world applications with modern tools and best practices.",
    rating: 4.9,
    totalLessons: 62,
    instructor: {
      name: "Jane Smith",
      title: "Frontend Architect",
      image: "https://www.loremfaces.net/96/id/2.jpg",
    },
  },

  {
    id: 3,
    title: "Node.js Complete Guide",
    category: "Backend Development",
    level: "Intermediate",
    duration: "9 weeks",
    price: "RM 899",
    students: 63,
    icon: node,
    color: "bg-green-400",
    bgcolor: "bg-green-400/30",
    textColor: "text-green-600",
    status: "Published",
    description:
      "Learn Node.js from scratch and build powerful backend applications with Express and MongoDB.",
    rating: 4.7,
    totalLessons: 55,
    instructor: {
      name: "Mike Johnson",
      title: "Backend Engineer",
      image: "https://www.loremfaces.net/96/id/3.jpg",
    },
  },

  {
    id: 4,
    title: "TypeScript Essentials",
    category: "Web Development",
    level: "Beginner",
    duration: "8 weeks",
    price: "RM 499",
    students: 45,
    icon: typescript,
    color: "bg-blue-500",
    bgcolor: "bg-blue-500/30",
    textColor: "text-blue-600",
    status: "Published",
    description:
      "Master TypeScript for safer, more maintainable JavaScript applications with static typing.",
    rating: 4.6,
    totalLessons: 40,
    instructor: {
      name: "Sarah Wilson",
      title: "Fullstack Developer",
      image: "https://www.loremfaces.net/96/id/4.jpg",
    },
  },

  {
    id: 5,
    title: "HTML5 Fundamentals",
    category: "Web Development",
    level: "Beginner",
    duration: "8 weeks",
    price: "RM 899",
    students: 110,
    icon: html5,
    color: "bg-orange-500",
    bgcolor: "bg-orange-500/30",
    textColor: "text-orange-600",
    status: "Published",
    description:
      "Build semantic, accessible web pages with HTML5 and modern web standards.",
    rating: 4.5,
    totalLessons: 35,
    instructor: {
      name: "David Lee",
      title: "Web Developer",
      image: "https://www.loremfaces.net/96/id/5.jpg",
    },
  },

{
  id: 6,
  title: "CSS3 Mastery",
  category: "Web Development",
  level: "Beginner",
  duration: "8 weeks",
  price: "RM 899",
  students: 110,
  icon: css3,
  color: "bg-pink-500",
  bgcolor: "bg-pink-500/30",
  textColor: "text-pink-600",
  status: "Published",
  description:
    "Take your CSS skills to the next level with Flexbox, Grid, animations, and responsive design.",
  rating: 4.8,
  totalLessons: 45,
  instructor: {
    name: "Emily Chen",
    title: "UI Designer",
    image: "https://i.pravatar.cc/150?img=47",
  },
},

{
  id: 7,
  title: "Python for Beginners",
  category: "Backend Development",
  level: "Beginner",
  duration: "8 weeks",
  price: "RM 899",
  students: 98,
  icon: python,
  color: "bg-yellow-600",
  bgcolor: "bg-yellow-600/30",
  textColor: "text-yellow-700",
  status: "Published",
  description:
    "Start your Python journey with practical examples and projects that build real skills.",
  rating: 4.7,
  totalLessons: 50,
  instructor: {
    name: "Alex Brown",
    title: "Data Scientist",
    image: "https://i.pravatar.cc/150?img=12",
  },
},

{
  id: 8,
  title: "UI/UX Design Principles",
  category: "UI/UX Design",
  level: "Intermediate",
  duration: "6 weeks",
  price: "RM 699",
  students: 56,
  icon: ui_ux,
  color: "bg-purple-400",
  bgcolor: "bg-purple-400/30",
  textColor: "text-purple-600",
  status: "Published",
  description:
    "Learn the fundamentals of user-centered design, wireframing, prototyping, and usability testing.",
  rating: 4.9,
  totalLessons: 42,
  instructor: {
    name: "Lisa Anderson",
    title: "UX Designer",
    image: "https://i.pravatar.cc/150?img=32",
  },
},

  /* Upcoming courses */
  {
    id: 101,
    title: "Next.js Advanced",
    category: "Web Development",
    level: "Intermediate",
    duration: "8 weeks",
    price: "RM 899",
    students: 0,
    icon: nextjs,
    color: "bg-black",
    bgcolor: "bg-gray-200",
    textColor: "text-gray-700",
    status: "Upcoming",
    releaseDate: "2026-10-15",
    description:
      "Build modern full-stack web applications with Next.js, App Router, server components, and advanced routing.",
    rating: 0,
    totalLessons: 0,
    instructor: {
      name: "John Doe",
      title: "Senior Full-Stack Developer",
      image: "https://www.loremfaces.net/96/id/1.jpg",
    },
  },

  {
    id: 102,
    title: "Tailwind CSS Mastery",
    category: "Web Development",
    level: "Beginner",
    duration: "6 weeks",
    price: "RM 599",
    students: 0,
    icon: tailwindcss,
    color: "bg-cyan-400",
    bgcolor: "bg-cyan-400/30",
    textColor: "text-cyan-600",
    status: "Upcoming",
    releaseDate: "2026-10-22",
    description:
      "Master Tailwind CSS and build responsive, modern user interfaces efficiently using utility-first styling.",
    rating: 0,
    totalLessons: 0,
    instructor: {
      name: "Jane Smith",
      title: "Frontend Developer",
      image: "https://www.loremfaces.net/96/id/2.jpg",
    },
  },

  {
    id: 103,
    title: "MongoDB Essentials",
    category: "Database",
    level: "Intermediate",
    duration: "7 weeks",
    price: "RM 699",
    students: 0,
    icon: mongo,
    color: "bg-green-500",
    bgcolor: "bg-green-500/30",
    textColor: "text-green-600",
    status: "Upcoming",
    releaseDate: "2026-10-29",
    description:
      "Learn MongoDB fundamentals, database design, queries, collections, and how to use MongoDB in modern applications.",
    rating: 0,
    totalLessons: 0,
    instructor: {
      name: "Michael Tan",
      title: "Backend Engineer",
      image: "https://www.loremfaces.net/96/id/3.jpg",
    },
  },

  {
    id: 104,
    title: "Express.js Backend Development",
    category: "Backend Development",
    level: "Intermediate",
    duration: "7 weeks",
    price: "RM 799",
    students: 0,
    icon: express,
    color: "bg-gray-700",
    bgcolor: "bg-gray-700/30",
    textColor: "text-gray-700",
    status: "Upcoming",
    releaseDate: "2026-11-05",
    description:
      "Build REST APIs and backend applications using Express.js, middleware, routing, authentication, and databases.",
    rating: 0,
    totalLessons: 0,
    instructor: {
      name: "David Lee",
      title: "Backend Developer",
      image: "https://www.loremfaces.net/96/id/5.jpg",
    },
  },
];


  export const stats = [
    { label: "Total Courses", value: courses.length, change: "+2 this month", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Published", value: courses.filter(c => c.status === "Published").length, change: "75% of total", icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
    { label: "In Progress", value: courses.filter(c => c.status === "In Progress").length, change: "21% of total", icon: Clock, color: "text-yellow-500", bg: "bg-yellow-50" },
    { label: "Draft", value: courses.filter(c => c.status === "Draft").length, change: "4% of total", icon: FileText, color: "text-purple-500", bg: "bg-purple-50" },
  ];
