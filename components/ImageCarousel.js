'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const images = [
  {
    src: '/images/red_harley_davidson_motorcycle-wallpaper.jpg',
    alt: 'Red Harley Davidson Motorcycle',
  },
  {
    src: '/images/pranjal-choudhary-carshort-v002-0024-00-00-17-07-still006.jpg',
    alt: 'Luxury Sports Car',
  },
];

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto cycle through images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Manual navigation
  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // Dot indicators
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full h-[80vh] overflow-hidden">
      {/* Image Container with Transition */}
      <div 
        className="w-full h-full relative transition-opacity duration-1000 ease-in-out"
        style={{ opacity: 1 }}
      >
        {images.map((image, index) => (
          <div 
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="100vw"
              priority={index === 0}
              style={{ 
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
            {/* Gradient overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button 
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-300 z-10"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      
      <button 
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-300 z-10"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Slide content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white z-10">
        <h2 className="text-3xl md:text-5xl font-bold mb-2">Find Your Perfect Ride</h2>
        <p className="text-lg md:text-xl mb-6 max-w-2xl">
          Quality cars and motorcycles at unbeatable prices
        </p>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-primary w-8' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
} 