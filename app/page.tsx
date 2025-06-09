"use client";

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="mt-20 flex-1 w-full flex flex-col items-center px-2 md:px-40 py-5">
      <div className="flex flex-col gap-6 md:gap-8 md:flex-row w-full max-w-[960px]">
        {/* Hero Image */}
        <div
          className="w-full aspect-video bg-center bg-no-repeat bg-cover rounded-lg md:min-w-[400px] md:w-1/2"
          style={{
            backgroundImage:
              'url(/img/dr1.jpg)',
          }}
        ></div>
        {/* Hero Text */}
        <div className="flex flex-col gap-6 md:gap-8 md:justify-center md:w-1/2">
          <div className="flex flex-col gap-2 text-left">
            <h1 className="text-[#1c140d] text-4xl font-black leading-tight tracking-[-0.033em] md:text-5xl md:font-black md:leading-tight md:tracking-[-0.033em]">
              Empowering Communities Through Health
            </h1>
            <h2 className="text-[#1c140d] text-sm font-normal md:text-base md:font-normal md:leading-normal">
              Boost Health Initiative is dedicated to improving health outcomes and empowering women in rural Uganda through comprehensive programs and community engagement.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/programs"
              className="flex min-w-[84px] max-w-[480px] items-center justify-center rounded-lg h-10 px-4 md:h-12 md:px-5 bg-[#f37c1b] text-[#1c140d] text-sm font-bold tracking-[0.015em] md:text-base md:font-bold md:leading-normal md:tracking-[0.015em]"
            >
              <span className="truncate">Explore Our Programs</span>
            </Link>
            <Link
              href="/contact"
              className="flex min-w-[84px] max-w-[480px] items-center justify-center rounded-lg h-10 px-4 md:h-12 md:px-5 bg-[#f4ede7] text-[#1c140d] text-sm font-bold tracking-[0.015em] md:text-base md:font-bold md:leading-normal md:tracking-[0.015em]"
            >
              <span className="truncate">Get Involved</span>
            </Link>
          </div>
        </div>
      </div>
      {/* Suubi Medical Centre Button */}
      <div className="flex w-full max-w-[960px] px-4 py-3 justify-start">
        <a
          href="https://suubi.com"
          target="_blank"
          rel="noopener"
          className="flex min-w-[84px] max-w-[480px] items-center justify-center rounded-lg h-10 px-4 bg-[#f4ede7] text-[#1c140d] text-sm font-bold tracking-[0.015em]"
        >
          <span className="relative w-7 h-7 mr-2">
            <Image src="/SUUBI LOGO ICON PNG Bckd TRANS.png" alt="Suubi Medical Centre Logo" fill className="object-contain" />
          </span>
          <span className="truncate">Visit Suubi Medical Centre</span>
        </a>
      </div>
      {/* Impact Card */}
      <div className="p-4 w-full max-w-[960px]">
        <div
          className="bg-cover bg-center flex flex-col items-stretch justify-end rounded-lg pt-[132px] min-h-[220px]"
          style={{
            backgroundImage:
              'linear-gradient(0deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 100%), url(/img/dr1.jpg)',
          }}
        >
          <div className="flex w-full items-end justify-between gap-4 p-4">
            <div className="flex max-w-[440px] flex-1 flex-col gap-1">
              <p className="text-white tracking-light text-2xl font-bold leading-tight max-w-[440px]">15M+ Lives Impacted</p>
              <p className="text-white text-base font-medium leading-normal">Across 4 Districts</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}