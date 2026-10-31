import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { IMPACT_STATS } from "@/lib/site-content";

export default function ImpactSection() {
  return (
    <section className="bg-primary text-white" aria-labelledby="impact-heading">
      <div className="container mx-auto px-4 py-10 sm:py-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-white/70 mb-2">Our Impact</p>
            <h2 id="impact-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              Making a Difference in Communities
            </h2>
            <p className="text-white/80 mt-3">
              Selected achievements from BHI&apos;s previous community health interventions.
            </p>
          </div>
          <Link href="/about#impact" className="inline-flex items-center gap-1 text-sm font-semibold hover:underline">
            More about our impact <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
        </div>
        <dl className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {IMPACT_STATS.map(({ value, label }, i) => (
            <div
              key={label}
              className={`flex flex-col-reverse justify-end rounded-2xl bg-white/10 border border-white/20 p-5 ${i === IMPACT_STATS.length - 1 ? "col-span-2 lg:col-span-1" : ""}`}
            >
              <dt className="text-sm text-white/80 mt-2 leading-snug">{label}</dt>
              <dd className="text-3xl sm:text-4xl font-bold leading-none">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
