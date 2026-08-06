'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MessageSquare, PhoneCall, Sparkles } from 'lucide-react';
import { API_BASE_URL, safeFetchJson } from '../config';
import { useTheme } from '../context/ThemeContext';

export interface BannerSlide {
  _id?: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  badge?: string;
  order?: number;
}

interface HeroCarouselProps {
  onSelectBooking: (item: { title: string; price: string; category: string }) => void;
}

const DEFAULT_SLIDES: BannerSlide[] = [
  {
    _id: '1',
    title: "Explore Cox's Bazar Beach Getaways",
    subtitle: 'Direct Flight Ticket + 4-Star Resort Stay starting from ৳8,900',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
    ctaText: 'Inquire Cox\'s Bazar',
    badge: 'Popular Destination'
  },
  {
    _id: '2',
    title: 'Bangkok & Pattaya Tropical Escape',
    subtitle: 'Exclusive 5D4N Packages with Express Visa Assistance & Transfers',
    imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1600&q=80',
    ctaText: 'Inquire Thailand',
    badge: 'Best International Deal'
  },
  {
    _id: '3',
    title: 'Holy Umrah & Saudi Arabia Packages',
    subtitle: 'Guaranteed Discounted Airline Fares, Visa Processing & Hotel Stay',
    imageUrl: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1600&q=80',
    ctaText: 'Inquire Umrah',
    badge: 'Umrah Special'
  }
];

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onSelectBooking }) => {
  const [slides, setSlides] = useState<BannerSlide[]>(DEFAULT_SLIDES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { t } = useTheme();

  useEffect(() => {
    safeFetchJson(`${API_BASE_URL}/api/banners`).then((data) => {
      if (data && data.success && data.banners && data.banners.length > 0) {
        setSlides(data.banners);
      }
    });
  }, []);

  // Automatic slide interval
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const activeSlide = slides[currentIndex] || DEFAULT_SLIDES[0];

  return (
    <section 
      className="no-print hero-carousel-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        position: 'relative',
        minHeight: '420px',
        maxHeight: '580px',
        height: 'clamp(420px, 58vh, 560px)',
        overflow: 'hidden',
        background: '#0f172a'
      }}
    >
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide._id || index}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: index === currentIndex ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
            zIndex: index === currentIndex ? 1 : 0,
            backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.65) 60%, rgba(15, 23, 42, 0.4) 100%), url(${slide.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      ))}

      {/* Slide Content Overlay */}
      <div 
        className="container hero-content-container" 
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          color: 'white',
          paddingTop: '2rem',
          paddingBottom: '3rem'
        }}
      >
        <div style={{ maxWidth: '640px' }} className="animate-fade-in" key={currentIndex}>
          {activeSlide.badge && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(2, 132, 199, 0.9)',
              backdropFilter: 'blur(8px)',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.3rem 0.85rem',
              borderRadius: '30px',
              marginBottom: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <Sparkles size={13} /> {activeSlide.badge}
            </div>
          )}

          <h1 style={{
            fontSize: 'clamp(1.6rem, 4vw, 3rem)',
            fontWeight: 800,
            lineHeight: 1.18,
            marginBottom: '0.75rem',
            letterSpacing: '-0.5px',
            textShadow: '0 4px 20px rgba(0,0,0,0.5)'
          }}>
            {activeSlide.title}
          </h1>

          <p style={{
            fontSize: 'clamp(0.9rem, 1.7vw, 1.15rem)',
            opacity: 0.92,
            lineHeight: 1.5,
            marginBottom: '1.5rem',
            textShadow: '0 2px 10px rgba(0,0,0,0.4)'
          }}>
            {activeSlide.subtitle}
          </p>

          {/* Premium Modern Buttons */}
          <div className="hero-cta-buttons" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={() => onSelectBooking({ title: activeSlide.title, price: 'Special Offer', category: 'Banner Package' })}
              className="hero-btn-primary"
            >
              <MessageSquare size={17} /> {activeSlide.ctaText || 'Inquire WhatsApp'}
            </button>

            <a
              href="tel:+8801623312405"
              className="hero-btn-glass"
            >
              <PhoneCall size={17} /> Call Agent
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="carousel-nav-btn prev-btn"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={handleNext}
            className="carousel-nav-btn next-btn"
            aria-label="Next Slide"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Indicators */}
      {slides.length > 1 && (
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          display: 'flex',
          gap: '0.5rem'
        }}>
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              style={{
                width: idx === currentIndex ? '26px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: idx === currentIndex ? t.accent : 'rgba(255,255,255,0.4)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      <style>{`
        .hero-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #ffffff;
          font-weight: 700;
          font-size: 0.9rem;
          padding: 0.7rem 1.4rem;
          border-radius: 30px;
          border: none;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.35);
          transition: all 0.25 ease;
          text-decoration: none;
        }
        .hero-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(16, 185, 129, 0.5);
        }

        .hero-btn-glass {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          color: #ffffff;
          font-weight: 700;
          font-size: 0.9rem;
          padding: 0.7rem 1.4rem;
          border-radius: 30px;
          border: 1.5px solid rgba(255, 255, 255, 0.35);
          cursor: pointer;
          transition: all 0.25s ease;
          text-decoration: none;
        }
        .hero-btn-glass:hover {
          background: rgba(255, 255, 255, 0.28);
          border-color: rgba(255, 255, 255, 0.6);
          transform: translateY(-2px);
        }

        .carousel-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 3;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(4px);
          color: white;
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .carousel-nav-btn:hover {
          background: #0284c7;
          border-color: #0284c7;
        }
        .prev-btn { left: 16px; }
        .next-btn { right: 16px; }

        @media (max-width: 640px) {
          .hero-content-container {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          .hero-cta-buttons {
            display: flex !important;
            flex-direction: row !important;
          }
          .hero-btn-primary, .hero-btn-glass {
            flex: 1 !important;
            padding: 0.65rem 0.85rem !important;
            font-size: 0.825rem !important;
            white-space: nowrap !important;
          }
          .carousel-nav-btn {
            width: 32px;
            height: 32px;
            top: auto;
            bottom: 14px;
            transform: none;
          }
          .prev-btn { left: 12px; }
          .next-btn { right: 12px; }
        }
      `}</style>
    </section>
  );
};
