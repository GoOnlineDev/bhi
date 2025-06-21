"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const news = useQuery(api.news.getPublishedNews);
  const featuredPrograms = useQuery(api.programs.getFeaturedApprovedPrograms);

  return (
    <main className="mt-20 flex-1 w-full flex flex-col items-center px-2 md:px-5 py-5">
      <div className="flex flex-col gap-6 md:gap-8 md:flex-row w-full max-w-[960px]">
        {/* Hero Image */}
        <div
          className="w-full aspect-video bg-center bg-no-repeat bg-cover rounded-lg md:min-w-[400px] md:w-1/2"
          style={{
            backgroundImage:
              'url(/img/dr7.jpg)',
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
      {/* Impact Card */}
      <div className="p-4 w-full max-w-[960px]">
        <div
          className="bg-cover bg-center flex flex-col items-stretch justify-end rounded-lg pt-[132px] min-h-[220px]"
          style={{
            backgroundImage:
              'linear-gradient(0deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 100%), url(/img/dr6.jpg)',
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

      {/* Latest Updates Section - Combined News and Programs */}
      <div className="w-full max-w-[960px] mt-12">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1c140d]">Latest Updates</h2>
            <div className="flex gap-4">
              <Link 
                href="/news" 
                className="text-[#f37c1b] hover:text-[#ff9d4d] font-semibold text-sm md:text-base transition-colors"
              >
                All News →
              </Link>
              <Link 
                href="/programs" 
                className="text-[#f37c1b] hover:text-[#ff9d4d] font-semibold text-sm md:text-base transition-colors"
              >
                All Programs →
              </Link>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Latest News Column */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-[#1c140d] mb-4">Latest News</h3>
              <div className="flex flex-col gap-4">
                {news?.slice(0, 3).map((item) => (
                  <Link 
                    key={item._id} 
                    href={`/news/${item._id}`}
                    className="group flex gap-4 bg-white rounded-lg p-3 hover:shadow-md transition-all duration-300 cursor-pointer"
                  >
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden">
                      {item.images && item.images[0] ? (
                        <Image
                          src={item.images[0]}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100" />
                      )}
                    </div>
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="text-xs font-medium text-[#f37c1b]">
                        {item.category}
                      </span>
                      <h4 className="font-semibold text-[#1c140d] line-clamp-2 group-hover:text-[#f37c1b] transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {item.summary}
                      </p>
                      <span className="text-xs text-gray-500 mt-auto">
                        {formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}
                      </span>
                    </div>
                  </Link>
                ))}
                {(!news || news.length === 0) && (
                  <p className="text-gray-500 text-center py-4">No news available at the moment.</p>
                )}
              </div>
            </div>

            {/* Featured Programs Column */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-[#1c140d] mb-4">Featured Programs</h3>
              <div className="flex flex-col gap-4">
                {featuredPrograms?.slice(0, 2).map((program) => (
                  <Link 
                    key={program._id} 
                    href={`/programs/${program._id}`}
                    className="group flex flex-col bg-white rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
                  >
                    <div className="relative w-full aspect-[16/9]">
                      {program.images && program.images[0] ? (
                        <Image
                          src={program.images[0]}
                          alt={program.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            program.status === "Active" 
                              ? "bg-green-500 text-white" 
                              : program.status === "Upcoming" 
                              ? "bg-blue-500 text-white"
                              : "bg-gray-500 text-white"
                          }`}>
                            {program.status}
                          </span>
                          {program.location && (
                            <span className="text-white text-xs flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {program.location}
                            </span>
                          )}
                        </div>
                        <h4 className="font-semibold text-white text-base line-clamp-1">
                          {program.name}
                        </h4>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {program.description}
                      </p>
                      {program.goal && (
                        <p className="text-xs text-gray-500 line-clamp-1 flex items-center gap-1">
                          <svg className="w-3 h-3 text-[#f37c1b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {program.goal}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
                {(!featuredPrograms || featuredPrograms.length === 0) && (
                  <p className="text-gray-500 text-center py-4">No featured programs available at the moment.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>




    </main>
  );
}