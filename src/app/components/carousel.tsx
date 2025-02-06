"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Carousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = [
    {
      image: "/images/drone.jpg",
      title: "Best Deal Online on Smart Watches",
      subtitle: "SMART WEARABLE",
      discount: "UP to 80% OFF",
    },
    {
      image: "/images/gadgets.jpg",
      title: "Premium Smart Watches",
      subtitle: "LATEST TECHNOLOGY",
      discount: "UP to 70% OFF",
    },
    {
      image: "/images/keyboard.jpg",
      title: "Fitness Trackers",
      subtitle: "HEALTH MONITORING",
      discount: "UP to 65% OFF",
    },
  ];

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const autoPlay = setInterval(nextSlide, 5000);
    return () => clearInterval(autoPlay);
  }, [activeIndex]);

  return (
    <div className="flex w-full container">
      <div className="relative w-full h-[200px] md:h-[300px] overflow-hidden group my-10 rounded-lg">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover rounded-lg"
            />
            {/* Content Overlay */}
            <div className="absolute container inset-0 bg-black/40 flex items-center">
              <div className="container mx-auto px-4 text-white">
                <div className="max-w-2xl">
                  <h2 className="md:text-3xl text-2xl font-bold animate-fadeIn">
                    {slide.title}
                  </h2>
                  <p className="md:text-xl text-lg font-medium text-blue-400">
                    {slide.subtitle}
                  </p>
                  <p className="md:text-3xl text-xl font-bold text-yellow-400 mb-6">
                    {slide.discount}
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg transition-all duration-300">
                    Shop Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full transition-all duration-300 group-hover:opacity-100 md:opacity-0"
        >
          <FiChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full transition-all duration-300 group-hover:opacity-100 md:opacity-0"
        >
          <FiChevronRight size={24} />
        </button>
        {/* Dots Navigation */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === activeIndex ? "bg-white w-6" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
