"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const slides = [
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
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance slides every 7 seconds
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <section
      className="
        relative w-full
        min-h-[60vh] h-[70vh] md:h-[80vh] lg:h-[85vh]
        flex items-center justify-center text-center text-white overflow-hidden
        "
    >
      {/* Carousel Background */}
      <div className="absolute inset-0 w-full h-full">
        <div className="relative w-full h-full">
          {slides.map((slide, idx) => (
            <div
              key={idx}
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
              {/* Overlay for better text contrast */}
              <div
                className="
                  absolute inset-0
                  bg-black/30
                  sm:bg-black/20
                  transition-colors
                  pointer-events-none
                "
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Hero Content */}
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
            Boosting Health. Empowering Communities. Changing Lives.
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
            We improve health outcomes in Uganda through community-driven programs and sustainable solutions that impact lives where it matters most.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Link href="/programs">
                Explore Our Programs
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
            >
              <Link href="/contact">Get Involved</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
