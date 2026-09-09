'use client';

import Link from 'next/link';
import { Building2 } from 'lucide-react';
import { useState } from 'react';

import type { TrustedCompany } from '@/services/home.service';

interface TrustedCompaniesSectionProps {
  companies: TrustedCompany[];
}

export default function TrustedCompaniesSection({
  companies,
}: TrustedCompaniesSectionProps) {
  if (!companies || companies.length === 0) {
    return null;
  }

  // Duplicate the companies so the marquee can loop smoothly.
  const marqueeCompanies = [...companies, ...companies];

  const getImageUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${url}`;
  };

  return (
    <div className="mt-12 pt-4">
      {/* Label */}
      <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        Trusted by Leading Companies
      </p>

      {/* =====================================================
          LOGO MARQUEE
      ===================================================== */}

      <div className="relative overflow-hidden">
        {/* Left fade */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-white to-transparent sm:w-24 dark:from-slate-950" />

        {/* Right fade */}
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-white to-transparent sm:w-24 dark:from-slate-950" />

        {/* Moving container */}
        <div className="flex w-max animate-[trusted-marquee_30s_linear_infinite] hover:[animation-play-state:paused]">
          {marqueeCompanies.map((company, index) => (
            <Link
              key={`${company.id}-${index}`}
              href={`/companies/${company.id}`}
              aria-label={`View ${company.companyName}`}
              className="
                group
                mx-2
                flex
                h-20
                w-36
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-slate-100
                bg-white
                px-4
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-blue-200
                hover:shadow-lg
                sm:mx-3
                sm:h-24
                sm:w-44
                dark:border-slate-800
                dark:bg-slate-900
                dark:hover:border-blue-800
              "
            >
              {company.logoUrl ? (
                <CompanyLogo company={company} getImageUrl={getImageUrl} />
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <Building2
                    size={22}
                    className="
                      text-slate-400
                      transition-colors
                      group-hover:text-[#1671B9]
                      dark:text-slate-500
                      dark:group-hover:text-blue-400
                    "
                  />

                  <span
                    className="
                      max-w-[120px]
                      truncate
                      text-[11px]
                      font-semibold
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    {company.companyName}
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Small information */}
      <div className="mt-3 text-center">
        <span className="text-[10px] text-slate-400 dark:text-slate-500">
          Hover to pause
        </span>
      </div>
    </div>
  );
}

function CompanyLogo({
  company,
  getImageUrl,
}: {
  company: TrustedCompany;
  getImageUrl: (url?: string | null) => string | null;
}) {
  const [imgSrc, setImgSrc] = useState<string | null>(
    getImageUrl(company.logoUrl),
  );

  const handleError = () => {
    // Retry without protocol if the full URL failed
    const raw = company.logoUrl;
    if (raw && imgSrc !== raw) {
      setImgSrc(raw);
    } else {
      setImgSrc(null);
    }
  };

  if (!imgSrc) {
    return (
      <div className="flex flex-col items-center gap-1">
        <Building2
          size={22}
          className="text-slate-400 dark:text-slate-500"
        />
        <span className="max-w-[120px] truncate text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          {company.companyName}
        </span>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={`${company.companyName} logo`}
      onError={handleError}
      className="
        h-12 w-24
        object-contain
        transition-transform
        duration-300
        group-hover:scale-105
        sm:h-14
        sm:w-28
      "
    />
  );
}