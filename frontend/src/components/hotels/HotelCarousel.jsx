import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import HotelCard from './HotelCard';

const HotelCarousel = ({ hotels, title, subtitle }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 340, behavior: 'smooth' });
    setTimeout(checkScroll, 400);
  };

  return (
    <section className="py-16">
      <div className="section-container">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            {subtitle && (
              <p className="text-sm font-medium text-violet-400 mb-1 flex items-center gap-1.5">
                <span className="w-4 h-px bg-violet-400 inline-block" />
                {subtitle}
              </p>
            )}
            <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
          </div>
          {/* Scroll controls */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll(-1)}
              disabled={!canScrollLeft}
              className={`w-10 h-10 glass rounded-full flex items-center justify-center transition-all duration-200 ${
                canScrollLeft
                  ? 'text-white hover:bg-white/10 hover:border-white/20'
                  : 'text-white/20 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll(1)}
              disabled={!canScrollRight}
              className={`w-10 h-10 glass rounded-full flex items-center justify-center transition-all duration-200 ${
                canScrollRight
                  ? 'text-white hover:bg-white/10 hover:border-white/20'
                  : 'text-white/20 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-5 overflow-x-auto no-scrollbar pb-2"
        >
          {hotels.map((hotel, i) => (
            <div key={hotel._id} className="flex-shrink-0 w-[300px] sm:w-[320px]">
              <HotelCard hotel={hotel} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HotelCarousel;
