import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import PropertySearchBar from "./PropertySearchBar";

interface HeroSlide {
  title: string;
  subtitle: string;
  image: string;
}

const heroSlides: HeroSlide[] = [
  {
    title: "Find your perfect stay, anywhere.",
    subtitle:
      "Explore comfortable properties for your next stay.",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85",
  },
  {
    title: "Stay somewhere you'll love.",
    subtitle:
      "Discover properties selected for comfort and convenience.",
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1800&q=85",
  },
  {
    title: "Your next stay starts here.",
    subtitle:
      "Browse properties and find the right place for you.",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=85",
  },
];

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeSlide = heroSlides[activeIndex];

  const goToPrevious = () => {
    setActiveIndex((current) =>
      current === 0
        ? heroSlides.length - 1
        : current - 1,
    );
  };

  const goToNext = () => {
    setActiveIndex((current) =>
      current === heroSlides.length - 1
        ? 0
        : current + 1,
    );
  };

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) =>
        current === heroSlides.length - 1
          ? 0
          : current + 1,
      );
    }, 6000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[520px] overflow-hidden sm:min-h-[430px] lg:h-[320px] lg:min-h-0">
      {/* Background images */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide.title}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === activeIndex
              ? "opacity-100"
              : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1200px] flex-col items-center justify-center px-5 py-10 sm:px-6 lg:py-0">
        {/* Label */}
        <div className="mb-3 rounded-full bg-sunrise-amber px-3 py-1 text-[9px] font-bold uppercase tracking-wide text-slate-text">
          Discover your next stay
        </div>

        {/* Title */}
        <h1 className="max-w-[700px] text-center font-headline-lg text-[28px] font-bold leading-tight text-white sm:text-[32px]">
          {activeSlide.title}
        </h1>

        {/* Subtitle */}
        <p className="mt-2 max-w-[600px] text-center text-sm text-white/90">
          {activeSlide.subtitle}
        </p>

        {/* Search */}
        <PropertySearchBar />

        {/* Previous */}
        <button
          type="button"
          onClick={goToPrevious}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-slate-text transition hover:bg-white sm:left-5 lg:left-0"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Next */}
        <button
          type="button"
          onClick={goToNext}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-slate-text transition hover:bg-white sm:right-5 lg:right-0"
        >
          <ChevronRight size={20} />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-1.5">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === activeIndex
                  ? "w-5 bg-white"
                  : "w-1.5 bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}