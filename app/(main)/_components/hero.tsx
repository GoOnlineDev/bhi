"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

/** Client-side fallback while Convex is loading (matches `DEFAULT_HERO` in convex/heroSettings.ts). */
const FALLBACK_HERO = {
  headline: "Boosting Health. Empowering Communities. Changing Lives.",
  subheadline:
    "We improve health outcomes in Uganda through community-driven programs and sustainable solutions that impact lives where it matters most.",
  primaryCtaLabel: "Explore Our Programs",
  secondaryCtaLabel: "Get Involved",
  primaryCtaHref: "/programs",
  secondaryCtaHref: "/contact",
  slides: [
    {
      src: "/img/dr7i.jpg",
      alt: "A healthcare worker smiling with a community member.",
    },
    {
      src: "/img/dr5i.jpg",
      alt: "A healthcare worker smiling with a community member.",
    },
    {
      src: "/img/dr8i.jpg",
      alt: "A healthcare worker smiling with a community member.",
    },
    {
      src: "/img/dr6i.jpg",
      alt: "Children in Kayunga village smiling.",
    },
  ],
};

export default function Hero() {
  const remote = useQuery(api.heroSettings.getPublicHero);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const slides = useMemo(() => {
    if (!remote) {
      return FALLBACK_HERO.slides;
    }
    return remote.slides.map((s) => ({ src: s.url, alt: s.alt }));
  }, [remote]);

  const headline = remote?.headline ?? FALLBACK_HERO.headline;
  const subheadline = remote?.subheadline ?? FALLBACK_HERO.subheadline;
  const primaryCtaLabel = remote?.primaryCtaLabel ?? FALLBACK_HERO.primaryCtaLabel;
  const secondaryCtaLabel =
    remote?.secondaryCtaLabel ?? FALLBACK_HERO.secondaryCtaLabel;
  const primaryCtaHref = remote?.primaryCtaHref ?? FALLBACK_HERO.primaryCtaHref;
  const secondaryCtaHref =
    remote?.secondaryCtaHref ?? FALLBACK_HERO.secondaryCtaHref;

  useEffect(() => {
    setCurrent((c) => (slides.length === 0 ? 0 : c % slides.length));
  }, [slides.length]);

  useEffect(() => {
    if (slides.length === 0) return;
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [slides.length]);

  return (
    <section
      className="
        relative w-full
        min-h-[60vh] h-[70vh] md:h-[80vh] lg:h-[85vh]
        flex items-center justify-center text-center text-white overflow-hidden
        "
    >
      <div className="absolute inset-0 w-full h-full">
        <div className="relative w-full h-full">
          {slides.map((slide, idx) => (
            <div
              key={`${slide.src}-${idx}`}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                idx === current
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
              aria-hidden={idx !== current}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover"
                priority={idx === 0}
                sizes="100vw"
                style={{
                  objectPosition: "center 70%",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div
        className="
          relative z-30 w-full flex items-center justify-center h-full
          px-4 py-16
          "
      >
        <div
          className="
            max-w-3xl mx-auto
            flex flex-col items-center justify-center
            "
        >
          <h1
            className="
              text-2xl
              xs:text-3xl
              sm:text-4xl
              lg:text-5xl
              font-extrabold
              leading-tight
              tracking-tight
              drop-shadow-lg
              "
          >
            {headline}
          </h1>
          <p
            className="
              mt-4
              text-base
              xs:text-lg
              sm:text-xl
              text-slate-200
              max-w-2xl
              mx-auto
              drop-shadow
              "
          >
            {subheadline}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Link href={primaryCtaHref}>
                {primaryCtaLabel}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
            >
              <Link href={secondaryCtaHref}>{secondaryCtaLabel}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
