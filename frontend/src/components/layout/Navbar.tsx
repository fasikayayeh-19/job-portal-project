'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState ,useEffect} from 'react';
import Image from 'next/image';
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
 const pathname = usePathname();
const [isNavigating, setIsNavigating] = useState(false);

useEffect(() => {
  setIsNavigating(false);
}, [pathname]);

const handleNavigation = () => {
  setIsNavigating(true);
};
  return (
    <header className="sticky top-0 z-50 w-full border-b shadow-2xl border-slate-200 bg-white dark:border-slate-800 dark:bg-[#020817]">
      <nav className="ml-5  flex h-30  items-center justify-between  sm:px-6 lg:px-10">

    
        {/* Logo */}
<Link
  href="/"
  className="flex items-center"
>
  <Image
    src={process.env.NEXT_PUBLIC_LOGO_URL!}
    alt="Job Portal"
    width={90}
    height={30}
    priority
    className="h-auto w-auto object-contain"
  />
</Link>
<div className="hidden items-center gap-7 md:flex">

  {/* Find Jobs */}
  <Link
    href="/jobs"
    onClick={handleNavigation}
    className={`group relative text-lg font-medium transition-colors duration-200 ${
      pathname === '/jobs'
        ? 'text-[#1671B9] dark:text-[#4da3e8]'
        : 'text-slate-800 hover:text-[#1671B9] dark:text-slate-200 dark:hover:text-[#4da3e8]'
    }`}
  >
    Find Jobs

    <span
      className={`absolute -bottom-[2px] left-0 h-[2px] rounded-full bg-[#1671B9] dark:bg-[#4da3e8] ${
        pathname === '/jobs' && !isNavigating
          ? 'w-full opacity-100'
          : 'w-0 opacity-0'
      }`}
    />

    {!isNavigating && pathname !== '/jobs' && (
      <span className="absolute -bottom-[2px] left-0 h-[2px] w-0 rounded-full bg-[#1671B9] opacity-0 transition-all duration-200 group-hover:w-full group-hover:opacity-100 dark:bg-[#4da3e8]" />
    )}
  </Link>


  {/* Find Companies */}
  <Link
    href="/companies"
    onClick={handleNavigation}
    className={`group relative text-lg font-medium transition-colors duration-200 ${
      pathname === '/companies'
        ? 'text-[#1671B9] dark:text-[#4da3e8]'
        : 'text-slate-800 hover:text-[#1671B9] dark:text-slate-200 dark:hover:text-[#4da3e8]'
    }`}
  >
    Find Companies

    <span
      className={`absolute -bottom-[2px] left-0 h-[2px] rounded-full bg-[#1671B9] dark:bg-[#4da3e8] ${
        pathname === '/companies' && !isNavigating
          ? 'w-full opacity-100'
          : 'w-0 opacity-0'
      }`}
    />

    {!isNavigating && pathname !== '/companies' && (
      <span className="absolute -bottom-[2px] left-0 h-[2px] w-0 rounded-full bg-[#1671B9] opacity-0 transition-all duration-200 group-hover:w-full group-hover:opacity-100 dark:bg-[#4da3e8]" />
    )}
  </Link>


  {/* About Us */}
  <Link
    href="/about"
    onClick={handleNavigation}
    className={`group relative text-lg font-medium transition-colors duration-200 ${
      pathname === '/about'
        ? 'text-[#1671B9] dark:text-[#4da3e8]'
        : 'text-slate-800 hover:text-[#1671B9] dark:text-slate-200 dark:hover:text-[#4da3e8]'
    }`}
  >
    About Us

    <span
      className={`absolute -bottom-[2px] left-0 h-[2px] rounded-full bg-[#1671B9] dark:bg-[#4da3e8] ${
        pathname === '/about' && !isNavigating
          ? 'w-full opacity-100'
          : 'w-0 opacity-0'
      }`}
    />

    {!isNavigating && pathname !== '/about' && (
      <span className="absolute -bottom-[2px] left-0 h-[2px] w-0 rounded-full bg-[#1671B9] opacity-0 transition-all duration-200 group-hover:w-full group-hover:opacity-100 dark:bg-[#4da3e8]" />
    )}
  </Link>


  {/* Contact */}
  <Link
    href="/contact"
    onClick={handleNavigation}
    className={`group relative text-lg font-medium transition-colors duration-200 ${
      pathname === '/contact'
        ? 'text-[#1671B9] dark:text-[#4da3e8]'
        : 'text-slate-800 hover:text-[#1671B9] dark:text-slate-200 dark:hover:text-[#4da3e8]'
    }`}
  >
    Contact

    <span
      className={`absolute -bottom-[2px] left-0 h-[2px] rounded-full bg-[#1671B9] dark:bg-[#4da3e8] ${
        pathname === '/contact' && !isNavigating
          ? 'w-full opacity-100'
          : 'w-0 opacity-0'
      }`}
    />

    {!isNavigating && pathname !== '/contact' && (
      <span className="absolute -bottom-[2px] left-0 h-[2px] w-0 rounded-full bg-[#1671B9] opacity-0 transition-all duration-200 group-hover:w-full group-hover:opacity-100 dark:bg-[#4da3e8]" />
    )}
  </Link>

</div>

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-3 md:flex">

          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-lg font-medium text-slate-800 transition-colors hover:bg-blue-50 hover:text-[#1671B9] dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-[#4da3e8]"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-lg bg-[#1671B9] px-5 py-2.5 text-lg font-medium text-white transition-all hover:bg-[#0F5F9E] hover:shadow-md"
          >
            Sign Up
          </Link>
           <div className="ml-5 flex items-center whitespace-nowrap text-[12px] text-slate-400">
              <span className="mr-2 ">|</span>

              <span className="mr-2 text-lg">
                Employers:
              </span>

              <Link
                href="/register"
                className="text-lg text-primary transition hover:text-secondary hover:underline"
              >
                Are you recruiting?
              </Link>
            </div>

        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-800 transition-colors hover:bg-blue-50 hover:text-[#1671B9] dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-[#4da3e8] md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-[#020817] md:hidden">

          <div className="flex flex-col gap-2">

            <Link
              href="/jobs"
              onClick={() => setIsOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-slate-800 transition-colors hover:bg-blue-50 hover:text-[#1671B9] dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-[#4da3e8]"
            >
              Find Jobs
            </Link>

            <Link
              href="/companies"
              onClick={() => setIsOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-slate-800 transition-colors hover:bg-blue-50 hover:text-[#1671B9] dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-[#4da3e8]"
            >
              Find Companies
            </Link>

            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-slate-800 transition-colors hover:bg-blue-50 hover:text-[#1671B9] dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-[#4da3e8]"
            >
              About Us
            </Link>

            <Link
            href="/contact"
            className="text-sm font-medium text-slate-800 transition-colors hover:text-[#1671B9] dark:text-slate-200 dark:hover:text-[#4da3e8]"
          >
            Contact
          </Link>

            <div className="my-2 border-t border-slate-200 dark:border-slate-800" />

            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-slate-800 transition-colors hover:bg-blue-50 hover:text-[#1671B9] dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-[#4da3e8]"
            >
              Login
            </Link>

            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="rounded-lg bg-[#1671B9] px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-[#0F5F9E]"
            >
              Sign Up
            </Link>
             <div className="ml-2 flex items-center whitespace-nowrap text-[12px] text-slate-400">
              <span className="mr-2">|</span>

              <span className="mr-1">
                Employers:
              </span>

              <Link
                href="/register"
                className="font-medium text-primary transition hover:text-secondary hover:underline"
              >
                Are you recruiting?
              </Link>
            </div>

          </div>

        </div>
      )}
    </header>
  );
}