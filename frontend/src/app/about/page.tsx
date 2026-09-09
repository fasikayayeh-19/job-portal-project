'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  FileSearch,
  FileText,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  Users,
  Zap,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* Scroll Reveal Hook                                                         */
/* -------------------------------------------------------------------------- */

function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -60px 0px',
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function AboutPage() {
  const whoWeAre = useScrollReveal();
  const solutions = useScrollReveal();
  const process = useScrollReveal();
  const seekers = useScrollReveal();
  const employers = useScrollReveal();
  const whyUs = useScrollReveal();
  const mission = useScrollReveal();
  const cta = useScrollReveal();

  return (
    <main className="overflow-hidden bg-white text-slate-900 dark:bg-slate-950 dark:text-white">
      {/* ================================================================== */}
      {/* HERO                                                               */}
      {/* ================================================================== */}

      <section className="relative isolate">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[-10%] top-[-20%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute right-[-10%] top-[10%] h-[450px] w-[450px] rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:60px_60px] opacity-30 dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] dark:opacity-20" />
        </div>

        <div className="mx-auto max-w-[1440px] px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
            {/* Hero content */}
            <div className="max-w-3xl">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
                <Sparkles className="h-4 w-4" />
                Building better connections
              </div>

              <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                Where talent meets{' '}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  opportunity.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl dark:text-slate-300">
                Our job platform connects talented people with companies
                looking for the skills, experience, and ideas that move
                businesses forward.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/jobs"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30"
                >
                  Explore Jobs
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white/70 px-7 py-3.5 font-semibold text-slate-700 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-400"
                >
                  Join the Platform
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  For job seekers
                </span>

                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  For employers
                </span>

                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  Built for growth
                </span>
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative">
              <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-r from-blue-500/20 to-cyan-400/20 blur-2xl" />

              <div className="relative rounded-[2rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30">
                <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 p-8 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-100">
                        Career journey
                      </p>

                      <h2 className="mt-1 text-2xl font-bold">
                        Find your next move
                      </h2>
                    </div>

                    <div className="rounded-xl bg-white/15 p-3 backdrop-blur">
                      <BriefcaseBusiness className="h-7 w-7" />
                    </div>
                  </div>

                  <div className="mt-10 space-y-4">
                    {[
                      {
                        icon: UserRound,
                        title: 'Create your profile',
                        text: 'Showcase your skills and experience.',
                      },
                      {
                        icon: Search,
                        title: 'Discover opportunities',
                        text: 'Find roles that match your goals.',
                      },
                      {
                        icon: FileText,
                        title: 'Apply with confidence',
                        text: 'Submit applications and track progress.',
                      },
                    ].map((item, index) => {
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.title}
                          className="flex items-center gap-4 rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur transition-all duration-300 hover:translate-x-2 hover:bg-white/15"
                          style={{
                            transitionDelay: `${index * 100}ms`,
                          }}
                        >
                          <div className="rounded-lg bg-white/15 p-2.5">
                            <Icon className="h-5 w-5" />
                          </div>

                          <div>
                            <p className="font-semibold">
                              {item.title}
                            </p>

                            <p className="mt-1 text-sm text-blue-100">
                              {item.text}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 p-3">
                  {[
                    ['Discover', Search],
                    ['Connect', Users],
                    ['Grow', TrendingUp],
                  ].map(([label, Icon]) => {
                    const LucideIcon =
                      Icon as typeof Search;

                    return (
                      <div
                        key={label as string}
                        className="rounded-xl bg-slate-50 p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-500/10"
                      >
                        <LucideIcon className="mx-auto h-5 w-5 text-blue-600 dark:text-blue-400" />

                        <p className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                          {label as string}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* WHO WE ARE                                                         */}
      {/* ================================================================== */}

      <section className="border-y border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
        <div
          ref={whoWeAre.ref}
          className={`mx-auto max-w-[1440px] px-6 py-24 transition-all duration-1000 sm:px-8 lg:px-12 ${
            whoWeAre.visible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-16 opacity-0'
          }`}
        >
          <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                Who We Are
              </span>

              <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                More than a job board.
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
                We are creating a connected recruitment experience where
                people can discover opportunities and organizations can
                discover the people who can help them grow.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {[
                {
                  icon: Target,
                  title: 'Purpose-driven',
                  text: 'We focus on making the connection between talent and opportunity simpler and more meaningful.',
                },
                {
                  icon: Users,
                  title: 'People-first',
                  text: 'The platform is designed around the needs of both candidates and employers.',
                },
                {
                  icon: Zap,
                  title: 'Simple experience',
                  text: 'From discovering a job to managing applications, every step should feel straightforward.',
                },
                {
                  icon: TrendingUp,
                  title: 'Built for growth',
                  text: 'We help candidates move forward in their careers and businesses build stronger teams.',
                },
              ].map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-blue-400 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500"
                    style={{
                      transitionDelay: `${index * 120}ms`,
                    }}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 dark:bg-blue-500/10 dark:text-blue-400">
                      <Icon className="h-6 w-6" />
                    </div>

                    <h3 className="mt-6 text-xl font-bold">
                      {item.title}
                    </h3>

                    <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* PLATFORM SOLUTIONS                                                 */}
      {/* ================================================================== */}

      <section>
        <div
          ref={solutions.ref}
          className={`mx-auto max-w-[1440px] px-6 py-24 transition-all duration-1000 sm:px-8 lg:px-12 ${
            solutions.visible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-16 opacity-0'
          }`}
        >
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              What We Offer
            </span>

            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Everything needed to move forward
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
              One platform designed to support the entire journey from
              discovering an opportunity to building a successful team.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Search,
                title: 'Smart Job Discovery',
                text: 'Search opportunities by title, category, location, experience, and employment type.',
              },
              {
                icon: UserRound,
                title: 'Professional Profiles',
                text: 'Create a profile that presents your experience, skills, resume, and career goals.',
              },
              {
                icon: FileText,
                title: 'Simple Applications',
                text: 'Apply to relevant positions without unnecessary steps and keep your applications organized.',
              },
              {
                icon: FileSearch,
                title: 'Application Tracking',
                text: 'Follow the progress of your applications and stay informed throughout the recruitment journey.',
              },
              {
                icon: Building2,
                title: 'Company Presence',
                text: 'Companies can create professional profiles that help candidates understand their organization.',
              },
              {
                icon: Users,
                title: 'Applicant Management',
                text: 'Employers can review candidates and manage applicants throughout the hiring process.',
              },
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:border-blue-400 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500"
                  style={{
                    transitionDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-blue-500/5 transition-transform duration-500 group-hover:scale-[2]" />

                  <div className="relative">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 transition-all duration-300 group-hover:scale-110 dark:bg-blue-500/10 dark:text-blue-400">
                      <Icon className="h-7 w-7" />
                    </div>

                    <h3 className="mt-7 text-xl font-bold">
                      {item.title}
                    </h3>

                    <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
                      {item.text}
                    </p>

                    <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-blue-600 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 dark:text-blue-400">
                      Learn more
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* HOW IT WORKS                                                       */}
      {/* ================================================================== */}

      <section className="bg-slate-50 dark:bg-slate-900/50">
        <div
          ref={process.ref}
          className={`mx-auto max-w-[1440px] px-6 py-24 transition-all duration-1000 sm:px-8 lg:px-12 ${
            process.visible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-16 opacity-0'
          }`}
        >
          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              How It Works
            </span>

            <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
              From opportunity to outcome
            </h2>
          </div>

          <div className="relative mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Connecting line */}
            <div className="absolute left-[12%] right-[12%] top-10 hidden h-px bg-slate-300 lg:block dark:bg-slate-700" />

            {[
              {
                number: '01',
                icon: UserRound,
                title: 'Create your profile',
                text: 'Build a professional profile that represents your experience and skills.',
              },
              {
                number: '02',
                icon: Search,
                title: 'Discover opportunities',
                text: 'Explore jobs that match your skills, interests, and career goals.',
              },
              {
                number: '03',
                icon: FileText,
                title: 'Apply',
                text: 'Submit applications and keep track of where you stand.',
              },
              {
                number: '04',
                icon: TrendingUp,
                title: 'Move forward',
                text: 'Connect with employers and take the next step in your career.',
              },
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.number}
                  className="group relative text-center"
                  style={{
                    transitionDelay: `${index * 150}ms`,
                  }}
                >
                  <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-slate-50 bg-blue-600 text-white shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl dark:border-slate-900/50">
                    <Icon className="h-8 w-8" />

                    <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-blue-600 shadow-md dark:bg-slate-800 dark:text-blue-400">
                      {item.number}
                    </span>
                  </div>

                  <h3 className="mt-7 text-xl font-bold">
                    {item.title}
                  </h3>

                  <p className="mx-auto mt-3 max-w-xs leading-7 text-slate-600 dark:text-slate-400">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FOR JOB SEEKERS                                                    */}
      {/* ================================================================== */}

      <section>
        <div
          ref={seekers.ref}
          className={`mx-auto max-w-[1440px] px-6 py-24 transition-all duration-1000 sm:px-8 lg:px-12 ${
            seekers.visible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-16 opacity-0'
          }`}
        >
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <div className="inline-flex rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <UserRound className="h-7 w-7" />
              </div>

              <span className="ml-3 text-sm font-bold uppercase tracking-[0.15em] text-blue-600 dark:text-blue-400">
                For Job Seekers
              </span>

              <h2 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
                Your career deserves better opportunities.
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
                Find relevant positions, present yourself professionally,
                apply with confidence, and keep your career journey
                organized.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  'Search relevant jobs',
                  'Create your professional profile',
                  'Upload your resume',
                  'Track applications',
                  'Save opportunities',
                  'Discover companies',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition-all duration-300 hover:border-blue-300 hover:bg-blue-50 dark:border-slate-800 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/5"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />

                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href="/jobs"
                className="group mt-8 inline-flex items-center gap-2 font-semibold text-blue-600 dark:text-blue-400"
              >
                Start exploring jobs
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative rounded-[2rem] bg-gradient-to-br from-blue-600 to-cyan-500 p-8 shadow-2xl shadow-blue-600/20 sm:p-12">
                <div className="absolute right-8 top-8 rounded-full bg-white/10 p-4 backdrop-blur">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>

                <p className="text-sm font-semibold text-blue-100">
                  Career growth
                </p>

                <h3 className="mt-4 max-w-md text-3xl font-bold text-white sm:text-4xl">
                  Turn your skills into your next opportunity.
                </h3>

                <div className="mt-12 space-y-4">
                  {[
                    'Build your professional identity',
                    'Discover opportunities',
                    'Connect with companies',
                  ].map((item, index) => (
                    <div
                      key={item}
                      className="flex items-center gap-4 rounded-xl bg-white/10 p-4 text-white backdrop-blur transition-all duration-300 hover:translate-x-2 hover:bg-white/15"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 text-sm font-bold">
                        {index + 1}
                      </span>

                      <span className="font-medium">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FOR EMPLOYERS                                                      */}
      {/* ================================================================== */}

      <section className="border-y border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
        <div
          ref={employers.ref}
          className={`mx-auto max-w-[1440px] px-6 py-24 transition-all duration-1000 sm:px-8 lg:px-12 ${
            employers.visible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-16 opacity-0'
          }`}
        >
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <div className="inline-flex rounded-xl bg-cyan-100 p-3 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                <Building2 className="h-7 w-7" />
              </div>

              <span className="ml-3 text-sm font-bold uppercase tracking-[0.15em] text-cyan-600 dark:text-cyan-400">
                For Companies
              </span>

              <h2 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
                Build your team with the right talent.
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
                Create your company presence, publish opportunities, reach
                candidates, and manage the hiring process from one platform.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  'Create a professional company profile',
                  'Publish job opportunities',
                  'Reach qualified candidates',
                  'Review applications',
                  'Manage applicant progress',
                ].map((item) => (
                  <div
                    key={item}
                    className="group flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:translate-x-2 hover:ring-cyan-300 dark:bg-slate-900 dark:ring-slate-800 dark:hover:ring-cyan-500/40"
                  >
                    <CheckCircle2 className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />

                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <div className="rounded-2xl bg-slate-50 p-6 dark:bg-slate-800/70">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Recruitment workflow
                    </p>

                    <h3 className="mt-1 text-xl font-bold">
                      Find great candidates
                    </h3>
                  </div>

                  <div className="rounded-xl bg-cyan-100 p-3 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                    <Users className="h-6 w-6" />
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  {[
                    ['01', 'Create company profile'],
                    ['02', 'Publish your opportunity'],
                    ['03', 'Review applications'],
                    ['04', 'Select the right candidate'],
                  ].map(([number, title], index) => (
                    <div
                      key={number}
                      className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:border-cyan-400 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-cyan-500"
                      style={{
                        transitionDelay: `${index * 100}ms`,
                      }}
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-100 text-sm font-bold text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400">
                        {number}
                      </span>

                      <span className="font-medium">
                        {title}
                      </span>

                      <ArrowRight className="ml-auto h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-cyan-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* WHY US                                                             */}
      {/* ================================================================== */}

      <section>
        <div
          ref={whyUs.ref}
          className={`mx-auto max-w-[1440px] px-6 py-24 transition-all duration-1000 sm:px-8 lg:px-12 ${
            whyUs.visible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-16 opacity-0'
          }`}
        >
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Why Choose Us
            </span>

            <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
              Designed around real recruitment needs
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: ShieldCheck,
                title: 'Trusted experience',
                text: 'A structured platform designed to support professional recruitment.',
              },
              {
                icon: Search,
                title: 'Better discovery',
                text: 'Relevant search and filtering make finding opportunities easier.',
              },
              {
                icon: Zap,
                title: 'Simple process',
                text: 'Less friction means candidates and employers can focus on what matters.',
              },
              {
                icon: TrendingUp,
                title: 'Career growth',
                text: 'Helping people discover opportunities that support their next step.',
              },
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-7 text-center transition-all duration-500 hover:-translate-y-2 hover:border-blue-400 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500"
                  style={{
                    transitionDelay: `${index * 120}ms`,
                  }}
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 transition-all duration-300 group-hover:scale-110 dark:bg-blue-500/10 dark:text-blue-400">
                    <Icon className="h-7 w-7" />
                  </div>

                  <h3 className="mt-6 text-lg font-bold">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* MISSION / VISION                                                   */}
      {/* ================================================================== */}

      <section className="bg-slate-50 dark:bg-slate-900/50">
        <div
          ref={mission.ref}
          className={`mx-auto max-w-[1440px] px-6 py-24 transition-all duration-1000 sm:px-8 lg:px-12 ${
            mission.visible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-16 opacity-0'
          }`}
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="group rounded-[2rem] border border-slate-200 bg-white p-9 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-12">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 transition-transform duration-300 group-hover:scale-110 dark:bg-blue-500/10 dark:text-blue-400">
                <Target className="h-7 w-7" />
              </div>

              <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                Our Mission
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Make meaningful opportunities easier to find.
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
                We aim to simplify the recruitment experience by giving job
                seekers and companies the tools they need to discover,
                connect, and move forward.
              </p>
            </div>

            <div className="group rounded-[2rem] border border-slate-200 bg-gradient-to-br from-blue-600 to-cyan-500 p-9 text-white shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl sm:p-12">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 transition-transform duration-300 group-hover:scale-110">
                <TrendingUp className="h-7 w-7" />
              </div>

              <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-blue-100">
                Our Vision
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                A stronger connection between talent and business.
              </h2>

              <p className="mt-5 text-lg leading-8 text-blue-50">
                We envision a recruitment ecosystem where talented people can
                build meaningful careers and companies can build stronger,
                more capable teams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* CTA                                                                */}
      {/* ================================================================== */}

      <section>
        <div
          ref={cta.ref}
          className={`mx-auto max-w-[1440px] px-6 py-24 transition-all duration-1000 sm:px-8 lg:px-12 ${
            cta.visible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-16 opacity-0'
          }`}
        >
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 px-8 py-16 text-center text-white shadow-2xl sm:px-12 lg:py-20">
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

            <div className="relative">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                <BriefcaseBusiness className="h-8 w-8" />
              </div>

              <h2 className="mx-auto mt-7 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
                Your next opportunity starts here.
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-50">
                Explore opportunities, discover companies, and take the next
                step in your professional journey.
              </p>

              <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  href="/jobs"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-blue-700 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-50 hover:shadow-xl"
                >
                  Explore Jobs
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
                >
                  Create an Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}