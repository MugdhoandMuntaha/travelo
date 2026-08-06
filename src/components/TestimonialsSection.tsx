'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialItem {
  id: number;
  stars: number;
  quote: string;
  author: string;
  location: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 1,
    stars: 5,
    quote: "Booked our Cox's Bazar trip through Travelo — everything from tickets to hotel was sorted in one call. Very smooth.",
    author: "Tanvir Hossain",
    location: "Dhaka"
  },
  {
    id: 2,
    stars: 5,
    quote: "Quick response on WhatsApp and honest advice on fares. Will book again.",
    author: "Nusrat Jahan",
    location: "Chittagong"
  },
  {
    id: 3,
    stars: 5,
    quote: "Got my Thailand visa assistance done within 4 days with zero hassle. Extremely reliable service!",
    author: "Mahmudur Rahman",
    location: "Sylhet"
  }
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section 
      className="no-print"
      style={{ 
        background: '#f8fafc', 
        color: '#0f172a', 
        padding: '4.5rem 1rem',
        position: 'relative',
        borderTop: '1px solid #f1f5f9'
      }}
    >
      <div className="container" style={{ maxWidth: '920px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div 
            style={{ 
              color: '#0284c7', 
              fontSize: '0.8rem', 
              fontWeight: 800, 
              letterSpacing: '2px', 
              textTransform: 'uppercase',
              marginBottom: '0.5rem' 
            }}
          >
            TESTIMONIALS
          </div>

          <h2 
            style={{ 
              fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', 
              fontWeight: 800, 
              color: '#0f172a',
              letterSpacing: '-0.5px'
            }}
          >
            What Travelers Say
          </h2>
        </div>

        {/* Testimonial Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {TESTIMONIALS.map((item) => (
            <div 
              key={item.id}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.5rem 1.75rem',
                transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.04)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = '#0284c7';
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(2, 132, 199, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = '0 4px 20px -2px rgba(0, 0, 0, 0.04)';
              }}
            >
              {/* Star Rating Icons */}
              <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.85rem' }}>
                {[1, 2, 3, 4, 5].slice(0, item.stars).map((starNum) => (
                  <Star key={starNum} size={16} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>

              {/* Quote Text */}
              <p 
                style={{ 
                  fontSize: '1rem', 
                  color: '#334155', 
                  lineHeight: 1.6, 
                  fontWeight: 500,
                  marginBottom: '0.85rem' 
                }}
              >
                "{item.quote}"
              </p>

              {/* Author & Location */}
              <div style={{ fontSize: '0.875rem', color: '#0284c7', fontWeight: 700 }}>
                — {item.author}, <span style={{ color: '#64748b', fontWeight: 500 }}>{item.location}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
