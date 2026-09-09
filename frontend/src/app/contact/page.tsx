'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import { useCreateContactMessage } from '@/hooks/useContact';

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

const faqs = [
  {
    question: 'How do I create an account?',
    answer:
      'Choose the registration option from the navigation menu and complete the registration form. After creating your account, you can access the features available for your role.',
  },
  {
    question: 'How can I apply for a job?',
    answer:
      'Browse available jobs from the Find Jobs page, open a job that interests you, and use the application option to submit your application.',
  },
  {
    question: 'Can companies post jobs?',
    answer:
      'Yes. Companies can create a company account, complete their company profile, and publish job opportunities through their company dashboard.',
  },
  {
    question: 'How can I track my application?',
    answer:
      'Job seekers can view their submitted applications from their dashboard and follow the progress of each application.',
  },
  {
    question: 'How can I contact support?',
    answer:
      'You can contact our support team using the contact form on this page. Your message will be received by the platform administrators.',
  },
];

const helpOptions = [
  {
    icon: MessageCircle,
    title: 'Job Seekers',
    description:
      'Need help finding jobs, applying, or managing your applications?',
  },
  {
    icon: MapPin,
    title: 'Companies',
    description:
      'Need assistance managing your company profile or job postings?',
  },
  {
    icon: ShieldCheck,
    title: 'Account & Support',
    description:
      'Having an issue with your account or need technical assistance?',
  },
];

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [submitted, setSubmitted] = useState(false);

  const {
    mutateAsync,
    isPending,
    isError,
    error,
  } = useCreateContactMessage();

  const hero = useScrollReveal(0.1);
  const contact = useScrollReveal(0.15);
  const help = useScrollReveal(0.15);
  const faq = useScrollReveal(0.15);
  const cta = useScrollReveal(0.15);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      await mutateAsync({
        name: String(formData.get('name') || ''),
        email: String(formData.get('email') || ''),
        subject: String(formData.get('subject') || ''),
        message: String(formData.get('message') || ''),
      });

      form.reset();
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to send contact message:', error);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-[#070d18] dark:text-white">
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#075985] via-[#0878A8] to-[#10A8A5]" />

        <div className="absolute inset-0 -z-10 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)',
              backgroundSize: '42px 42px',
            }}
          />
        </div>

        <div className="absolute -right-32 top-20 -z-10 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl" />

        <div
          ref={hero.ref}
          className={`mx-auto max-w-[1440px] px-5 py-24 transition-all duration-1000 sm:px-8 lg:px-12 lg:py-32 ${
            hero.visible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
              <MessageCircle className="h-4 w-4" />
              We are here to help
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Let&apos;s talk about
              <span className="block text-cyan-100">
                how we can help.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
              Have a question about finding a job, managing your
              company, or using the platform? Send us a message and
              our team will be happy to help.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          CONTACT INFORMATION + FORM
      ========================================================= */}
      <section className="relative py-20 sm:py-24 lg:py-28">
        <div
          ref={contact.ref}
          className={`mx-auto grid max-w-[1440px] gap-10 px-5 transition-all duration-1000 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12 ${
            contact.visible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-16 opacity-0'
          }`}
        >
          {/* LEFT */}
          <div>
            <div className="mb-8">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
                Contact us
              </span>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                We&apos;d love to hear from you.
              </h2>

              <p className="mt-4 max-w-xl leading-7 text-slate-600 dark:text-slate-400">
                Whether you are a job seeker looking for your next
                opportunity or a company looking for talented people,
                our team is ready to assist you.
              </p>
            </div>

            <div className="space-y-4">
              {/* EMAIL */}
              <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-100/40 dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-cyan-900 dark:hover:shadow-cyan-950/20">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400">
                    <Mail className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-semibold">Email us</h3>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      support@yourjobportal.com
                    </p>
                  </div>
                </div>
              </div>

              {/* PHONE */}
              <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-100/40 dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-cyan-900 dark:hover:shadow-cyan-950/20">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                    <Phone className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-semibold">Call us</h3>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      +251 900 000 000
                    </p>
                  </div>
                </div>
              </div>

              {/* LOCATION */}
              <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-100/40 dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-cyan-900 dark:hover:shadow-cyan-950/20">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
                    <MapPin className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-semibold">Our location</h3>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Ethiopia
                    </p>
                  </div>
                </div>
              </div>

              {/* RESPONSE */}
              <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-100/40 dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-cyan-900 dark:hover:shadow-cyan-950/20">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                    <Clock3 className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Response time
                    </h3>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      We aim to respond as soon as possible.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-8 lg:p-10 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-black/20">
            {submitted ? (
              <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <h3 className="mt-6 text-2xl font-bold">
                  Message sent successfully!
                </h3>

                <p className="mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Thank you for contacting us. Your message has been
                  received by our support team.
                </p>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-8 rounded-xl bg-gradient-to-r from-[#0878A8] to-[#10A8A5] px-6 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                    <Send className="h-5 w-5" />
                  </div>

                  <h2 className="text-2xl font-bold">
                    Send us a message
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Fill out the form below and our team will review
                    your message.
                  </p>
                </div>

                {isError && (
                  <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                    {error instanceof Error
                      ? error.message
                      : 'Something went wrong while sending your message. Please try again.'}
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="grid gap-6 sm:grid-cols-2">
                    {/* NAME */}
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-medium"
                      >
                        Your name
                      </label>

                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        maxLength={100}
                        placeholder="Enter your name"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-700 dark:bg-slate-800 dark:placeholder:text-slate-500"
                      />
                    </div>

                    {/* EMAIL */}
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium"
                      >
                        Email address
                      </label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        maxLength={255}
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-700 dark:bg-slate-800 dark:placeholder:text-slate-500"
                      />
                    </div>
                  </div>

                  {/* SUBJECT */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="mb-2 block text-sm font-medium"
                    >
                      Subject
                    </label>

                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      maxLength={255}
                      placeholder="What can we help you with?"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-700 dark:bg-slate-800 dark:placeholder:text-slate-500"
                    />
                  </div>

                  {/* MESSAGE */}
                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm font-medium"
                    >
                      Message
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      required
                      maxLength={5000}
                      rows={6}
                      placeholder="Tell us how we can help..."
                      className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-700 dark:bg-slate-800 dark:placeholder:text-slate-500"
                    />
                  </div>

                  {/* SUBMIT */}
                  <button
                    type="submit"
                    disabled={isPending}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0878A8] to-[#10A8A5] px-6 py-4 font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {isPending ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send message

                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-slate-400">
                    Your message will be securely stored and reviewed
                    by our administrators.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================
          HOW CAN WE HELP
      ========================================================= */}
      <section className="border-y border-slate-200 bg-white py-20 sm:py-24 dark:border-slate-800 dark:bg-slate-900/30">
        <div
          ref={help.ref}
          className={`mx-auto max-w-[1440px] px-5 transition-all duration-1000 sm:px-8 lg:px-12 ${
            help.visible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-16 opacity-0'
          }`}
        >
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
              How can we help?
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Choose the support you need
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              Whatever you are trying to accomplish, we are here to
              make your experience easier.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {helpOptions.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  style={{
                    transitionDelay: `${index * 120}ms`,
                  }}
                  className="group rounded-3xl border border-slate-200 bg-slate-50 p-7 transition-all duration-500 hover:-translate-y-2 hover:border-cyan-200 hover:bg-white hover:shadow-xl hover:shadow-cyan-100/40 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-cyan-900 dark:hover:bg-slate-800 dark:hover:shadow-cyan-950/20"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-6 text-xl font-bold">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-cyan-600 dark:text-cyan-400">
                    Get support

                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          FAQ
      ========================================================= */}
      <section className="py-20 sm:py-24 lg:py-28">
        <div
          ref={faq.ref}
          className={`mx-auto max-w-4xl px-5 transition-all duration-1000 sm:px-8 ${
            faq.visible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-16 opacity-0'
          }`}
        >
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
              FAQ
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Frequently asked questions
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600 dark:text-slate-400">
              Find quick answers to some of the most common questions
              about the platform.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            {faqs.map((item, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={item.question}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:border-cyan-200 dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-cyan-900"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaq(isOpen ? null : index)
                    }
                    className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-6"
                  >
                    <span className="font-semibold">
                      {item.question}
                    </span>

                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen
                        ? 'grid-rows-[1fr] opacity-100'
                        : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm leading-7 text-slate-600 sm:px-6 dark:text-slate-400">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-24 lg:px-12 lg:pb-28">
        <div
          ref={cta.ref}
          className={`mx-auto max-w-[1440px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#075985] via-[#0878A8] to-[#10A8A5] transition-all duration-1000 ${
            cta.visible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-16 opacity-0'
          }`}
        >
          <div className="relative px-6 py-16 text-center sm:px-10 lg:px-20 lg:py-20">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

            <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-cyan-300/10 blur-3xl" />

            <div className="relative">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-md">
                <Sparkles className="h-6 w-6" />
              </div>

              <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Ready to take the next step?
              </h2>

              <p className="mx-auto mt-5 max-w-2xl leading-7 text-white/75">
                Find your next opportunity or connect with talented
                people through our job portal.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/jobs"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-[#075985] transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-100"
                >
                  Find jobs

                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/15"
                >
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}