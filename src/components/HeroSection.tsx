'use client';

import React, { useState } from 'react';
import { Plane, Calendar, MapPin, Send, PhoneCall, ShieldCheck, Award } from 'lucide-react';

interface HeroSectionProps {
  onQuickInquire: (details: { origin: string; destination: string; service: string; date: string }) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onQuickInquire }) => {
  const [origin, setOrigin] = useState('Dhaka (DAC)');
  const [destination, setDestination] = useState("Cox's Bazar (CXB)");
  const [service, setService] = useState('Flight');
  const [date, setDate] = useState('2026-08-15');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickInquire({ origin, destination, service, date });
  };

  return (
    <section className="no-print" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #0369a1 50%, #0f766e 100%)',
      color: 'white',
      padding: '3.5rem 0 4rem 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Glow elements */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'rgba(2, 132, 199, 0.25)',
        filter: 'blur(80px)'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center', marginBottom: '2.5rem' }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            padding: '0.4rem 1rem',
            borderRadius: '30px',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1.25rem',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <span>⚡ #1 Call-to-Book Travel Solution in Bangladesh</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.1rem, 4vw, 3.2rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.5px',
            marginBottom: '1rem',
            textShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}>
            Your Personal Travel & Ticketing Agency in Bangladesh
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
            opacity: 0.9,
            lineHeight: 1.6,
            fontWeight: 400,
            maxWidth: '640px',
            margin: '0 auto'
          }}>
            Skip automated error-prone search engines. Speak directly with our dedicated travel experts for discounted manual flight quotes, hotel packages, & fast visa processing.
          </p>

        </div>

        {/* Quick Inquiry Form */}
        <div className="glass-panel" style={{
          borderRadius: '18px',
          padding: '1.75rem',
          maxWidth: '920px',
          margin: '0 auto',
          color: '#0f172a',
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.4rem' }}>
                  <Plane size={14} color="#0284c7" /> Service Type
                </label>
                <select 
                  value={service} 
                  onChange={(e) => setService(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 600 }}
                >
                  <option value="Flight">Flight Ticket</option>
                  <option value="Visa">Visa Assistance</option>
                  <option value="Tour Package">Tour Package</option>
                  <option value="Hotel">Hotel Booking</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.4rem' }}>
                  <MapPin size={14} color="#0284c7" /> From / Origin
                </label>
                <input 
                  type="text" 
                  value={origin} 
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g. Dhaka (DAC)"
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 600 }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.4rem' }}>
                  <MapPin size={14} color="#0f766e" /> Destination / Country
                </label>
                <input 
                  type="text" 
                  value={destination} 
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Bangkok, Thailand"
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 600 }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.4rem' }}>
                  <Calendar size={14} color="#0284c7" /> Travel Date
                </label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 600 }}
                />
              </div>

            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button 
                type="submit" 
                className="btn btn-whatsapp"
                style={{ width: '100%', maxWidth: '400px', fontSize: '1.05rem', padding: '0.85rem 1.5rem', borderRadius: '10px' }}
              >
                <Send size={18} /> Inquire Best Rates via WhatsApp
              </button>
            </div>
          </form>
        </div>

        {/* Feature Badges Below */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          marginTop: '2.5rem',
          maxWidth: '860px',
          margin: '2.5rem auto 0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.08)', padding: '0.85rem 1rem', borderRadius: '10px' }}>
            <PhoneCall size={24} color="#25d366" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Direct Call Booking</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Talk directly with your agent</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.08)', padding: '0.85rem 1rem', borderRadius: '10px' }}>
            <ShieldCheck size={24} color="#38bdf8" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>100% Verified Quotes</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>No hidden fees or surprises</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.08)', padding: '0.85rem 1rem', borderRadius: '10px' }}>
            <Award size={24} color="#fbbf24" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Earn Commission</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Join our partner referral program</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
