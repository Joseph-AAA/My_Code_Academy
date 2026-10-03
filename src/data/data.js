import {
  Home,
  BookOpen,
  Users,
  CreditCard, 
  Settings,
  Info,
  BarChart3,
   WalletCards, UserPlus,Mail,UserRound,
} from "lucide-react";
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

import { courses } from "./courseData";

/******************************************************Data for sidebarLink**********************************/


export const sidebarLinks = [
  {
    label: "Dashboard",
    path: "/",
    icon: Home,
  },
  {
    label: "Courses",
    path: "/courses",
    icon: BookOpen,
  },
  {
    label: "Students",
    path: "/students",
    icon: Users,
  },
  {
    label: "Payments",
    path: "/payments",
    icon: CreditCard,
  },
  {
    label: "Setting",
    path: "/setting",
    icon: Settings,
  },
  {
    label: "About",
    path: "/about",
    icon: Info,
  },
];


/******************************************************Data for Courses**********************************/




/******************************************************Data for students**********************************/

export const students = [
  {
    id: "STU-001",
    name: "Sarah Lee",
    email: "sarah.lee@email.com",
    phone: "+60 12-345 6789",
    courseId: 1,
    status: "Active",
    enrolledDate: "2026-04-15",
  },
  {
    id: "STU-002",
    name: "John Tan",
    email: "john.tan@email.com",
    phone: "+60 13-456 7890",
    courseId: 3,
    status: "Active",
    enrolledDate: "2026-04-10",
  },
  {
    id: "STU-003",
    name: "Emily Chen",
    email: "emily.chen@email.com",
    phone: "+60 14-567 8901",
    courseId: 2,
    status: "Active",
    enrolledDate: "2026-04-05",
  },
  {
    id: "STU-004",
    name: "Daniel Lim",
    email: "daniel.lim@email.com",
    phone: "+60 16-234 5678",
    courseId: 1,
    status: "Active",
    enrolledDate: "2026-03-28",
  },
  {
    id: "STU-005",
    name: "Jessica Wong",
    email: "jessica.wong@email.com",
    phone: "+60 17-345 6789",
    courseId: 4,
    status: "Active",
    enrolledDate: "2026-03-20",
  },
  {
    id: "STU-006",
    name: "Michael Ng",
    email: "michael.ng@email.com",
    phone: "+60 18-456 7890",
    courseId: 5,
    status: "Inactive",
    enrolledDate: "2026-03-15",
  },
  {
    id: "STU-007",
    name: "Samantha Tan",
    email: "samantha.tan@email.com",
    phone: "+60 19-567 8901",
    courseId: 1,
    status: "Active",
    enrolledDate: "2026-03-10",
  },
  {
    id: "STU-008",
    name: "David Ho",
    email: "david.ho@email.com",
    phone: "+60 12-678 9012",
    courseId: 3,
    status: "Active",
    enrolledDate: "2026-03-05",
  },
];


/******************************************************Data for payments**********************************/

export const payments = [
  // April
  {
    id: "PAY-001",
    studentId: "STU-001",
    courseId: 1,
    totalFee: 1500,
    amountPaid: 1500,
    balance: 1500,
    status: "Pending",
    paymentDate: "",
  },
  {
    id: "PAY-002",
    studentId: "STU-002",
    courseId: 3,
    totalFee: 1400,
    amountPaid: 700,
    balance: 700,
    status: "Partial",
    paymentDate: "2026-04-10",
  },
  {
    id: "PAY-003",
    studentId: "STU-003",
    courseId: 2,
    totalFee: 1200,
    amountPaid: 1200,
    balance: 0,
    status: "Paid",
    paymentDate: "2026-04-05",
  },

  // May
  {
    id: "PAY-004",
    studentId: "STU-004",
    courseId: 1,
    totalFee: 1500,
    amountPaid: 1500,
    balance: 0,
    status: "Paid",
    paymentDate: "2026-05-12",
  },
  {
    id: "PAY-005",
    studentId: "STU-005",
    courseId: 4,
    totalFee: 1000,
    amountPaid: 500,
    balance: 500,
    status: "Partial",
    paymentDate: "2026-05-18",
  },

  // June
  {
    id: "PAY-006",
    studentId: "STU-006",
    courseId: 5,
    totalFee: 1600,
    amountPaid: 1600,
    balance: 0,
    status: "Paid",
    paymentDate: "2026-06-08",
  },
  {
    id: "PAY-007",
    studentId: "STU-007",
    courseId: 2,
    totalFee: 1200,
    amountPaid: 600,
    balance: 600,
    status: "Partial",
    paymentDate: "2026-06-20",
  },

  // July
  {
    id: "PAY-008",
    studentId: "STU-008",
    courseId: 1,
    totalFee: 1500,
    amountPaid: 1500,
    balance: 0,
    status: "Paid",
    paymentDate: "2026-07-05",
  },
  {
    id: "PAY-009",
    studentId: "STU-009",
    courseId: 3,
    totalFee: 1400,
    amountPaid: 1400,
    balance: 0,
    status: "Paid",
    paymentDate: "2026-07-14",
  },
  {
    id: "PAY-010",
    studentId: "STU-010",
    courseId: 4,
    totalFee: 1000,
    amountPaid: 500,
    balance: 500,
    status: "Partial",
    paymentDate: "2026-07-25",
  },

  // August
  {
    id: "PAY-011",
    studentId: "STU-011",
    courseId: 5,
    totalFee: 1600,
    amountPaid: 1600,
    balance: 0,
    status: "Paid",
    paymentDate: "2026-08-03",
  },
  {
    id: "PAY-012",
    studentId: "STU-012",
    courseId: 2,
    totalFee: 1200,
    amountPaid: 600,
    balance: 600,
    status: "Partial",
    paymentDate: "2026-08-19",
  },
];


/******************************************************Data for dashborad**********************************/

export const dashboardCards = [
  {
    icon: Users,
    value: students.length,
    label: "Total Students",
    bgColor : "bg-[#2563EB]",
    change: "↑ 12%",
    text : "from last month"
  },
  {
    icon: BookOpen,
    value: courses.length,
    label: "Total Courses",
    bgColor :"bg-[#16A34A]",
    change: "↑ 8%",
    text : "from last month"
  },
  {
    icon: BarChart3,
    value: `RM ${payments.reduce((total, payment) => total + payment.amountPaid, 0).toLocaleString()}`,
    label: "Total Revenue",
     bgColor : "bg-[#7C3AED]",
     change: "↑ 15%",
     text : "from last month"
  },
  {
    icon: WalletCards,
    value: `RM ${payments.reduce((total, payment) => total + payment.balance, 0).toLocaleString()}`,
    label: "Pending Payments",
    bgColor : "bg-[#EA580C]",
    change: "↓ 5%",
    text : "from last month"
  },
];


/******************************************************Data for Activity**********************************/

export const activity = [
  {
    id: 1,
    type: "student",
    name: "Sarah Lee",
    time: "2 minutes ago",
  },
  {
    id: 2,
    type: "payment",
    name: "John Tan",
    amount: 1500,
    time: "5 minutes ago",
  },
  {
    id: 3,
    type: "course",
    name: "React.js for Beginners",
    time: "1 hour ago",
  },
  {
    id: 4,
    type: "paymentReminder",
    count: 5,
    time: "2 hours ago",
  },
  {
    id: 5,
    type: "profileUpdate",
    name: "Daniel Lim",
    time: "3 hours ago",
  },
]

export const activityConfig = {
  student: {
    icon: UserPlus,
    bgColor :"bg-[#16A34A]/30",
    message: (activity) =>
      `New student ${activity.name} has been registered`,
  },

  payment: {
    icon: CreditCard,
    bgColor :"bg-[#16A34A]/30",
    message: (activity) =>
      `Payment received from ${activity.name}`,
  },

  course: {
    icon: BookOpen,
    bgColor : "bg-[#7C3AED]/30",
    message: (activity) =>
      `New course ${activity.name} has been added`,
  },

  paymentReminder: {
    icon: Mail,
    bgColor : "bg-[#EA580C]/30",
    message: (activity) =>
      `Payment reminder sent to ${activity.count} students`,
  },

  profileUpdate: {
    icon: UserRound,
    bgColor : "bg-[#2563EB]/30",
    message: (activity) =>
      `Student ${activity.name} updated his profile`,
  },
};





