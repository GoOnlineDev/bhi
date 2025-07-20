"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const slides = [
  {
    src: "/img/dr7.jpg",
    alt: "A healthcare worker smiling with a community member.",
  },
  {
    src: "/img/dr6.jpg",
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
    <section className="relative min-h-[70vh] h-[80vh] md:h-screen flex items-center justify-center text-center text-white overflow-hidden">
      <div className="container mx-auto px-4 h-full">
        {/* Carousel */}
        <div className="relative w-full h-full rounded-xl overflow-hidden">
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
              aria-hidden={idx !== current}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover"
                priority={idx === 0}
                sizes="100vw"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />
            </div>
          ))}
        </div>
        
        {/* Hero Content */}
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <div className="max-w-3xl mx-auto px-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-lg">
              Empowering Kayunga Communities Through Health
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-200 max-w-2xl mx-auto drop-shadow">
              Boost Health Initiative is dedicated to improving health outcomes and empowering women in rural Uganda through comprehensive programs and community engagement.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/programs">
                  Explore Our Programs
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30">
                <Link href="/contact">Get Involved</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
