
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CreditCard,
  GraduationCap,
  UserRound,
  Code2,
  MessageCircle,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Explore Courses",
    description:
      "Discover coding courses and find topics that interest you.",
  },
  {
    icon: GraduationCap,
    title: "Learn Your Way",
    description:
      "Access your enrolled courses and learning materials.",
  },
  {
    icon: CreditCard,
    title: "Track Payments",
    description:
      "Review your payment history and successful transactions.",
  },
  {
    icon: UserRound,
    title: "Manage Your Account",
    description:
      "Update your profile, change your photo, and manage your password.",
  },
];

const steps = [
  {
    number: "01",
    title: "Explore",
    description: "Browse available courses and discover what to learn.",
  },
  {
    number: "02",
    title: "Enroll",
    description: "Choose a course and complete the enrollment process.",
  },
  {
    number: "03",
    title: "Start Learning",
    description: "Open your enrolled courses and access the tutorials.",
  },
];

export default function StudentAbout() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-8xl space-y-12 p-6 lg:p-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-900 px-7 py-12 text-white sm:px-10 lg:py-16">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">
            <Code2 size={17} />
            Welcome to My Code Academy
          </div>

          <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Learn. Build. Grow.
          </h1>

          <p className="mt-5 max-w-xl leading-7 text-blue-100">
            Your journey into coding starts here. Explore courses,
            build your skills, and take the next step in your
            learning journey.
          </p>

          <button
            type="button"
            onClick={() => navigate("/courses")}
            className="cursor-pointer mt-7 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Explore Courses
            <ArrowRight size={18} />
          </button>
        </div>

        <Code2
          aria-hidden="true"
          className="absolute -bottom-8 -right-5 h-48 w-48 text-white/10 sm:h-64 sm:w-64"
        />
      </section>

      {/* About */}
      <section className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            About Us
          </p>

          <h2 className="mt-3 text-2xl font-bold text-gray-800 sm:text-3xl">
            Your coding journey starts here
          </h2>

          <p className="mt-4 leading-7 text-gray-600">
            My Code Academy is a learning platform designed to help
            students discover coding courses and access their
            enrolled learning materials in one place.
          </p>

          <p className="mt-3 leading-7 text-gray-600">
            Whether you're exploring a new topic or developing your
            existing skills, you can manage your courses and keep
            track of your learning activity through your student account.
          </p>
        </div>

        <div className="flex min-h-64 items-center justify-center rounded-2xl bg-blue-50 p-8">
          <div className="text-center">
            <div className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
              <GraduationCap size={42} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-gray-800">
              Keep Learning
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Discover courses, practice your skills, and keep moving
              forward.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Everything you need to get started
          </h2>
          <p className="mt-2 text-gray-500">
            Your student account brings your learning activities together.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-xl border border-gray-200 bg-white p-6 transition hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon size={24} />
                </div>

                <h3 className="mt-4 font-semibold text-gray-800">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Learning steps */}
      <section className="rounded-2xl bg-gray-50 p-6 sm:p-8">
        <div className="mb-7 text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            How It Works
          </h2>
          <p className="mt-2 text-gray-500">
            Three simple steps to begin learning.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                {step.number}
              </div>

              <h3 className="mt-4 font-semibold text-gray-800">
                {step.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Get Started */}
        <section className="flex flex-col items-start justify-between gap-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white sm:flex-row sm:items-center sm:p-8">
        <div>
            <h2 className="text-xl font-bold sm:text-2xl">
            Ready to Start Learning?
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
            Explore our coding courses, discover new skills, and take
            the next step in your learning journey.
            </p>
        </div>

        <button
            type="button"
            onClick={() => navigate("/courses")}
            className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
        >
            Explore Courses
            <ArrowRight size={18} />
        </button>
        </section>
    </div>
  );
}
