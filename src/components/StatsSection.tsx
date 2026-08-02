import React, { useState, useEffect, useRef } from 'react';

export const StatsSection: React.FC = () => {
  const [happyTravelers, setHappyTravelers] = useState<number>(0);
  const [destinations, setDestinations] = useState<number>(0);
  const [supportHours, setSupportHours] = useState<number>(0);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounters();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Trigger animation fallback
    const timer = setTimeout(() => {
      if (!hasAnimated) {
        setHasAnimated(true);
        animateCounters();
      }
    }, 500);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [hasAnimated]);

  const animateCounters = () => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const intervalTime = duration / steps;

    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      // Easing out cubic function for smooth acceleration & deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setHappyTravelers(Math.floor(easeOut * 500));
      setDestinations(Math.floor(easeOut * 15));
      setSupportHours(Math.floor(easeOut * 24));

      if (step >= steps) {
        setHappyTravelers(500);
        setDestinations(15);
        setSupportHours(24);
        clearInterval(interval);
      }
    }, intervalTime);
  };

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#ffffff',
        padding: '3.5rem 0',
        borderTop: '1px solid #e2e8f0',
        borderBottom: '1px solid #e2e8f0',
        color: '#0f172a',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem',
            textAlign: 'center',
            alignItems: 'center'
          }}
        >
          {/* Stat 1: Happy Travelers */}
          <div>
            <div
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
                fontWeight: 900,
                color: '#2563eb',
                fontFamily: 'var(--font-head)',
                lineHeight: 1.1,
                letterSpacing: '-1px'
              }}
            >
              {happyTravelers}+
            </div>
            <div
              style={{
                fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
                color: '#475569',
                fontWeight: 600,
                marginTop: '0.5rem',
                letterSpacing: '0.2px'
              }}
            >
              Happy Travelers
            </div>
          </div>

          {/* Stat 2: Destinations */}
          <div>
            <div
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
                fontWeight: 900,
                color: '#2563eb',
                fontFamily: 'var(--font-head)',
                lineHeight: 1.1,
                letterSpacing: '-1px'
              }}
            >
              {destinations}+
            </div>
            <div
              style={{
                fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
                color: '#475569',
                fontWeight: 600,
                marginTop: '0.5rem',
                letterSpacing: '0.2px'
              }}
            >
              Destinations
            </div>
          </div>

          {/* Stat 3: 24/7 Support */}
          <div>
            <div
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
                fontWeight: 900,
                color: '#2563eb',
                fontFamily: 'var(--font-head)',
                lineHeight: 1.1,
                letterSpacing: '-1px'
              }}
            >
              {supportHours}/7
            </div>
            <div
              style={{
                fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
                color: '#475569',
                fontWeight: 600,
                marginTop: '0.5rem',
                letterSpacing: '0.2px'
              }}
            >
              Support
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
