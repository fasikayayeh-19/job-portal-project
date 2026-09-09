'use client';

import Link from 'next/link';
import {
  UserPlus,
  Search,
  FileText,
  CheckCircle2,
  Building2,
  BriefcaseBusiness,
  Users,
  ArrowRight,
} from 'lucide-react';

export default function HowItWorksSection() {
  return (
    <section
      className="
        relative
        overflow-hidden
        bg-gradient-to-br
        from-[#0878A8]
        via-[#0788A5]
        to-[#10A8A5]
        py-16
        sm:py-20
        lg:py-24
        dark:from-[#06445F]
        dark:via-[#075D70]
        dark:to-[#087C7A]
      "
    >
      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-24
          -top-24
          h-72
          w-72
          rounded-full
          border-[28px]
          border-white/10
          dark:border-white/5
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-10
          -top-10
          h-52
          w-52
          rounded-full
          border-[18px]
          border-white/10
          dark:border-white/5
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-28
          -left-20
          h-72
          w-72
          rounded-full
          border-[28px]
          border-white/10
          dark:border-white/5
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-1/2
          h-32
          w-32
          -translate-x-1/2
          rounded-full
          border-[16px]
          border-white/5
        "
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mx-auto max-w-2xl text-center">

          <div
            className="
              mb-4
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-white/20
              bg-white/10
              px-4
              py-2
              backdrop-blur-md
              dark:border-white/10
              dark:bg-black/10
            "
          >
            <BriefcaseBusiness
              size={16}
              className="text-white"
            />

            <span className="text-xs font-bold uppercase tracking-[0.15em] text-white">
              Simple & Easy
            </span>
          </div>

          <h2
            className="
              text-3xl
              font-bold
              tracking-tight
              text-white
              sm:text-4xl
              lg:text-5xl
            "
          >
            How It Works
          </h2>

          <p
            className="
              mx-auto
              mt-4
              max-w-xl
              text-sm
              leading-7
              text-white/80
              sm:text-base
              dark:text-white/75
            "
          >
            Find your next opportunity or connect with talented
            professionals in just a few simple steps.
          </p>
        </div>

        {/* =====================================================
            JOB SEEKER
        ===================================================== */}

        <div className="mt-12 sm:mt-16">

          {/* Section title */}

          <div className="mb-6 flex items-center justify-center gap-3">

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-white
                text-[#0878A8]
                shadow-lg
                dark:bg-slate-100
                dark:text-[#075D70]
              "
            >
              <Users size={20} />
            </div>

            <h3 className="text-lg font-bold text-white sm:text-xl">
              For Job Seekers
            </h3>
          </div>

          <div className="grid gap-4 sm:gap-5 md:grid-cols-3">

            {/* Step 1 */}

            <HowItWorksCard
              number="01"
              icon={<UserPlus size={21} />}
              title="Create Your Account"
              description="Sign up and create your professional profile with your skills, experience and career information."
            />

            {/* Step 2 */}

            <HowItWorksCard
              number="02"
              icon={<Search size={21} />}
              title="Find the Right Job"
              description="Search jobs by category, location, employment type and other preferences."
            />

            {/* Step 3 */}

            <HowItWorksCard
              number="03"
              icon={<FileText size={21} />}
              title="Apply & Get Hired"
              description="Apply with your profile and resume, then track your application through the hiring process."
            />

          </div>
        </div>

        {/* =====================================================
            COMPANY
        ===================================================== */}

        <div className="mt-12 sm:mt-16">

          {/* Section title */}

          <div className="mb-6 flex items-center justify-center gap-3">

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-white
                text-[#0878A8]
                shadow-lg
                dark:bg-slate-100
                dark:text-[#075D70]
              "
            >
              <Building2 size={20} />
            </div>

            <h3 className="text-lg font-bold text-white sm:text-xl">
              For Companies
            </h3>
          </div>

          <div className="grid gap-4 sm:gap-5 md:grid-cols-3">

            {/* Step 1 */}

            <HowItWorksCard
              number="01"
              icon={<Building2 size={21} />}
              title="Create Company Profile"
              description="Register your company and provide the information needed to build your company profile."
            />

            {/* Step 2 */}

            <HowItWorksCard
              number="02"
              icon={<BriefcaseBusiness size={21} />}
              title="Publish Your Jobs"
              description="Create professional job postings and reach qualified candidates looking for new opportunities."
            />

            {/* Step 3 */}

            <HowItWorksCard
              number="03"
              icon={<CheckCircle2 size={21} />}
              title="Find Great Candidates"
              description="Review applications, manage candidates and connect with the right people for your team."
            />

          </div>
        </div>

        {/* =====================================================
            CTA
        ===================================================== */}

        <div
          className="
            mt-12
            flex
            flex-col
            items-center
            justify-center
            gap-3
            sm:mt-14
            sm:flex-row
          "
        >

          {/* Find Job */}

          <Link
            href="/jobs"
            className="
              group
              inline-flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-white
              px-6
              py-3
              text-sm
              font-bold
              text-[#0878A8]
              shadow-lg
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:shadow-xl
              sm:w-auto
              dark:bg-slate-100
              dark:text-[#075D70]
            "
          >
            Find a Job

            <ArrowRight
              size={16}
              className="
                transition-transform
                duration-200
                group-hover:translate-x-1
              "
            />
          </Link>

          {/* Company Register */}

          <Link
            href="/register"
            className="
              inline-flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-white/40
              bg-white/10
              px-6
              py-3
              text-sm
              font-bold
              text-white
              backdrop-blur-md
              transition-all
              duration-200
              hover:bg-white/20
              hover:border-white/60
              sm:w-auto
              dark:border-white/20
              dark:bg-black/10
              dark:hover:bg-white/10
            "
          >
            Register Your Company
          </Link>

        </div>

      </div>
    </section>
  );
}


/* =========================================================
   REUSABLE CARD
========================================================= */

interface HowItWorksCardProps {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

function HowItWorksCard({
  number,
  icon,
  title,
  description,
}: HowItWorksCardProps) {
  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-white/20
        bg-white/10
        p-5
        backdrop-blur-md
        transition-all
        duration-300

        hover:-translate-y-1
        hover:border-white/30
        hover:bg-white/15
        hover:shadow-xl

        sm:p-6

        dark:border-white/10
        dark:bg-slate-950/20
        dark:hover:border-white/20
        dark:hover:bg-slate-950/30
      "
    >

      {/* Subtle number background */}

      <span
        className="
          pointer-events-none
          absolute
          right-4
          top-2
          text-5xl
          font-black
          text-white/10
          transition-all
          duration-300
          group-hover:text-white/15
          dark:text-white/5
          dark:group-hover:text-white/10
        "
      >
        {number}
      </span>

      {/* Icon */}

      <div
        className="
          relative
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          bg-white
          text-[#0878A8]
          shadow-md
          transition-transform
          duration-300
          group-hover:scale-105
          dark:bg-slate-100
          dark:text-[#075D70]
        "
      >
        {icon}
      </div>

      {/* Content */}

      <div className="relative">

        <h4
          className="
            mt-5
            text-base
            font-bold
            text-white
            sm:text-lg
          "
        >
          {title}
        </h4>

        <p
          className="
            mt-2
            text-sm
            leading-6
            text-white/70
            dark:text-white/65
          "
        >
          {description}
        </p>

      </div>

    </div>
  );
}