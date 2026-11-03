# MyCode Academy

A full-stack online learning management platform built to connect students with courses and provide administrators with tools to oversee and manage the learning platform.

# Overview

My Code Academy is an online learning platform with separate experiences for administrators and students. It supports course management, student enrollment, online payments, and course learning.

The platform uses role-based access control to provide different features and permissions depending on the user's account role.

User Roles

# Admin

Administrators have access to an Admin Dashboard that provides an overall view of the platform.

Admin features include:

Overview of platform activities and statistics.

Course management.

Student management.

Payment monitoring and management.

Profile & Account Settings.



# Student

Students do not have access to the Admin Dashboard. Instead, they have a dedicated student experience.

Student features include:

Browse available courses.

View course details.

Enroll in courses.

Secure online checkout.

Access enrolled courses.

View learning content.

View payment history.

Manage account settings and profile information.

# Key Features

User registration and authentication.

Email verification.

Forgot password and password reset.

Role-based authorization (Admin and Student).

Course management and published course listings.

Student enrollment management.

Stripe payment integration.

Payment and enrollment status tracking.

Student learning area.

Profile management and profile image uploads.

Responsive interface.

Light and dark themes.

# Technology Stack

# Frontend

React
Vite
JavaScript
Tailwind CSS
React Router
Recharts
Lucide React

# Backend

Node.js
Express.js
Prisma ORM
PostgreSQL (Neon)
JSON Web Tokens (JWT)
Bcrypt
Resend
Third-Party Services
Neon PostgreSQL – Database hosting
Stripe – Online payment processing
Resend – Transactional email delivery
Cloudinary – Image storage

# Project Structure
My_Code_Academy/
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   │
│   │   ├── assets/
│   │   │
│   │   ├── components/
│   │   │   ├── Background/
│   │   │   ├── courses/
│   │   │   ├── dashboard/
│   │   │   ├── layout/
│   │   │   ├── payments/
│   │   │   ├── studentPayment/
│   │   │   ├── students/
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── context/
│   │   │   ├── DashboardContext.jsx
│   │   │   └── PaymentContext.jsx
│   │   │
│   │   ├── data/
│   │   ├── pages/
│   │   ├── utils/
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   │
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   ├── controllers/
│   │   ├── lib/
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   │
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── clearEnrollments.js
│   ├── clearOtherStudents.js
│   ├── clearPayments.js
│   ├── package.json
│   ├── package-lock.json
│   └── prisma7.config.ts
│
├── .gitignore
└── README.md

# Getting Started

1. Clone the repository

git clone https://github.com/Joseph-AAA/My_Code_Academy.git
cd My_Code_Academy

2. Install frontend dependencies

cd frontend
npm install

Configure the frontend environment variables in .env.

3. Install backend dependencies

cd ../backend
npm install

Configure the backend environment variables in .env, including the database connection and required service credentials.

4. Set up the database

npx prisma migrate dev
npx prisma generate

5. Run the application

Start the backend and frontend using their respective development scripts.

Check each directory's package.json for the available scripts.

# Security

Password hashing with bcrypt.
JWT-based authentication.
Role-based route protection.
Email verification.
Password reset with secure tokens.
Protected backend API endpoints.
Environment variables for sensitive credentials.

# Project Goals

My Code Academy aims to provide an organized and accessible online learning environment, making course discovery, enrollment, payment, and learning easier for students while giving administrators an overview of platform operations.

# Developer

Joseph AAA

GitHub: 
