
'use client';

import HeroSection from '@/components/home/HeroSection';
import { useHome } from '@/hooks/useHome';
import CategoriesSection from '@/components/home/CategoriesSection';
import LatestJobsSection from '@/components/home/LatestJobsSection';
import HowItWorksSection from '@/components/home/HowItWorks';
import TrustedCompaniesSection from '@/components/home/TrustedCompaniesSection';
import FinalCTASection from '@/components/home/FinalCTASection';
export default function HomePage() {
  const {
    data,
    isLoading,
    isError,
  } = useHome();

  if (isLoading) {
    return (
      <main className="min-h-screen">
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-slate-500">
            Loading...
          </p>
        </div>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="min-h-screen">
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-red-500">
            Failed to load home page.
          </p>
        </div>
      </main>
    );
  }
return (
  <main>
    {/* Hero */}
    <HeroSection stats={data.stats} />

    {/* Categories */}
    <CategoriesSection
      categories={data.categories}
    />

    {/* Latest Jobs */}
   


<HowItWorksSection />
{/* <TrustedCompaniesSection
  companies={data?.trustedCompanies ?? []}
/>  */}
 <LatestJobsSection
      jobs={data.latestJobs}
    />

<FinalCTASection />

 </main>
);

}
