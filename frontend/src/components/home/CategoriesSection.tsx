'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import type { HomeCategory } from '@/services/home.service';

interface CategoriesSectionProps {
  categories: HomeCategory[];
}

const CATEGORIES_PER_PAGE = 9;

export default function CategoriesSection({
  categories,
}: CategoriesSectionProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(
    categories.length / CATEGORIES_PER_PAGE,
  );

  const startIndex =
    currentPage * CATEGORIES_PER_PAGE;

  const visibleCategories = categories.slice(
    startIndex,
    startIndex + CATEGORIES_PER_PAGE,
  );

  const goToPrevious = () => {
    setCurrentPage((page) =>
      Math.max(page - 1, 0),
    );
  };

  const goToNext = () => {
    setCurrentPage((page) =>
      Math.min(page + 1, totalPages - 1),
    );
  };

  return (
    <section className="bg-slate-50 py-16 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div className="max-w-7xl">

            <div className="mb-2 flex items-center gap-2">
              <span className="h-1 w-7 rounded-full bg-[#1671B9]" />

              <span className="text-xs font-semibold uppercase tracking-wider text-[#1671B9]">
                Explore Opportunities
              </span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Explore Job Categories
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Find opportunities by exploring jobs across
              different career categories.
            </p>

          </div>

          {/* View all jobs */}

          <Link
            href="/jobs"
            className="
              group
              inline-flex
              shrink-0
              items-center
              gap-1.5
              text-sm
              font-semibold
              text-[#1671B9]
              transition-colors
              hover:text-[#125f9c]
            "
          >
            View all jobs

            <ArrowRight
              size={16}
              className="
                transition-transform
                duration-200
                group-hover:translate-x-1
              "
            />
          </Link>

        </div>

        {/* =====================================================
            CATEGORY INFORMATION + PAGINATION
        ===================================================== */}

        <div className="mt-6 flex items-center justify-between">

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">

            <BriefcaseBusiness
              size={15}
              className="text-[#1671B9]"
            />

            <span>
              <strong className="font-semibold text-slate-800 dark:text-slate-200">
                {categories.length}
              </strong>{' '}
              categories available
            </span>

          </div>

          {/* =================================================
              PAGINATION ARROWS
          ================================================= */}

          {totalPages > 1 && (
            <div className="flex items-center gap-2">

              <span className="mr-2 text-xs text-slate-400 dark:text-slate-500">
                {currentPage + 1} / {totalPages}
              </span>

              <button
                type="button"
                onClick={goToPrevious}
                disabled={currentPage === 0}
                aria-label="Previous categories"
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  text-slate-600
                  transition
                  hover:border-[#1671B9]
                  hover:text-[#1671B9]
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                  dark:border-slate-800
                  dark:bg-slate-900
                  dark:text-slate-400
                  dark:hover:border-blue-700
                  dark:hover:text-blue-400
                "
              >
                <ChevronLeft size={16} />
              </button>

              <button
                type="button"
                onClick={goToNext}
                disabled={
                  currentPage === totalPages - 1
                }
                aria-label="Next categories"
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  text-slate-600
                  transition
                  hover:border-[#1671B9]
                  hover:text-[#1671B9]
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                  dark:border-slate-800
                  dark:bg-slate-900
                  dark:text-slate-400
                  dark:hover:border-blue-700
                  dark:hover:text-blue-400
                "
              >
                <ChevronRight size={16} />
              </button>

            </div>
          )}

        </div>

        {/* =====================================================
            CATEGORIES
        ===================================================== */}

        {categories.length === 0 ? (

          <div
            className="
              mt-6
              rounded-xl
              border
              border-slate-200
              bg-white
              p-8
              text-center
              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#1671B9] dark:bg-blue-950/40">
              <BriefcaseBusiness size={22} />
            </div>

            <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
              No job categories available
            </h3>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Categories will appear here once they are added.
            </p>
          </div>

        ) : (

          /*
           * IMPORTANT:
           *
           * Desktop = exactly 3 columns
           * 9 categories = 3 × 3
           */

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

            {visibleCategories.map((category) => (

              <Link
                key={category.id}
                href={`/jobs?categoryId=${encodeURIComponent(
                  category.id,
                )}`}
                className="
                  group
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-3.5
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:border-[#1671B9]/40
                  hover:shadow-md
                  dark:border-slate-800
                  dark:bg-slate-900
                  dark:hover:border-blue-800
                  dark:hover:shadow-none
                "
              >

                <div className="flex items-center gap-3">

                  {/* Icon */}

                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-blue-50
                      text-[#1671B9]
                      transition-colors
                      duration-200
                      group-hover:bg-[#1671B9]
                      group-hover:text-white
                      dark:bg-blue-950/40
                      dark:text-blue-400
                      dark:group-hover:bg-[#1671B9]
                      dark:group-hover:text-white
                    "
                  >
                    <BriefcaseBusiness size={18} />
                  </div>

                  {/* Category */}

                  <div className="min-w-0 flex-1">

                    <h3
                      className="
                        truncate
                        text-sm
                        font-semibold
                        text-slate-900
                        transition-colors
                        group-hover:text-[#1671B9]
                        dark:text-white
                      "
                    >
                      {category.name}
                    </h3>

                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {category.jobCount}{' '}
                      {Number(category.jobCount) === 1
                        ? 'job'
                        : 'jobs'}{' '}
                      available
                    </p>

                  </div>

                  {/* Arrow */}

                  <ChevronRight
                    size={17}
                    className="
                      shrink-0
                      text-slate-300
                      transition-all
                      duration-200
                      group-hover:translate-x-0.5
                      group-hover:text-[#1671B9]
                      dark:text-slate-600
                    "
                  />

                </div>

              </Link>

            ))}

          </div>

        )}

      </div>
    </section>
  );
}