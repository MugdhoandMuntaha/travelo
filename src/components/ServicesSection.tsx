'use client';

import React, { useState, useEffect } from 'react';
import { Plane, Building2, FileText, Compass, Headphones, Stamp, MessageSquare } from 'lucide-react';
import type { FlightDeal } from '../types';
import { API_BASE_URL, safeFetchJson } from '../config';
import { useTheme } from '../context/ThemeContext';

interface ServicesSectionProps {
  activeTab?: string;
  onSelectBooking: (item: { title: string; price: string; category: string }) => void;
}

const DEFAULT_FLIGHT_DEALS: FlightDeal[] = [
  { id: '1', from: 'Dhaka (DAC)', to: "Cox's Bazar (CXB)", type: 'Domestic', airline: 'US-Bangla / Biman', priceEstimate: '৳4,200', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80', tag: 'Best Seller' },
  { id: '2', from: 'Dhaka (DAC)', to: 'Bangkok (BKK)', type: 'International', airline: 'Thai Airways / US-Bangla', priceEstimate: '৳28,500', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80', tag: 'Popular Route' },
  { id: '3', from: 'Dhaka (DAC)', to: 'Kuala Lumpur (KUL)', type: 'International', airline: 'Biman Bangladesh / AirAsia', priceEstimate: '৳32,000', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=600&q=80' },
  { id: '4', from: 'Dhaka (DAC)', to: 'Jeddah (JED) - Umrah', type: 'International', airline: 'Saudi Arabian / Biman', priceEstimate: '৳68,000', image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=600&q=80', tag: 'Umrah Special' },
  { id: '5', from: 'Dhaka (DAC)', to: 'Dubai (DXB)', type: 'International', airline: 'Emirates / FlyDubai', priceEstimate: '৳45,000', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80' },
  { id: '6', from: 'Dhaka (DAC)', to: 'Sylhet (ZYL)', type: 'Domestic', airline: 'Air Astra / Novoair', priceEstimate: '৳3,800', image: 'https://images.unsplash.com/photo-1586375100100-33433e215d2a?auto=format&fit=crop&w=600&q=80' },
];

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectBooking }) => {
  const [flightDeals, setFlightDeals] = useState<FlightDeal[]>(DEFAULT_FLIGHT_DEALS);
  const { isDark, t } = useTheme();

  useEffect(() => {
    // Fetch Flights
    safeFetchJson(`${API_BASE_URL}/api/flights`).then((data) => {
      if (data && data.success && data.flights && data.flights.length > 0) {
        setFlightDeals(data.flights.map((f: any) => ({
          id: f._id || f.id,
          from: f.from,
          to: f.to,
          type: f.type,
          airline: f.airline,
          priceEstimate: f.priceEstimate,
          image: f.image,
          tag: f.tag
        })));
      }
    });
  }, []);

  const coreServices = [
    {
      icon: <Plane size={24} color={t.accent} />,
      title: 'Air Ticketing',
      desc: 'Instant booking for domestic & international flights with exclusive agent discounts.',
      category: 'Flight Ticket'
    },
    {
      icon: <FileText size={24} color={t.accent} />,
      title: 'Visa Assistance',
      desc: 'Expert document processing, e-Visa applications, and high-approval consultancy.',
      category: 'Visa Support'
    },
    {
      icon: <Compass size={24} color={t.accent} />,
      title: 'Tour Packages',
      desc: 'Customized holiday packages for Sajek, Cox’s Bazar, Thailand, Malaysia & more.',
      category: 'Tour Package'
    },
    {
      icon: <Building2 size={24} color={t.accent} />,
      title: 'Hotel Reservations',
      desc: 'Handpicked luxury resorts and budget hotels worldwide at competitive prices.',
      category: 'Hotel Booking'
    },
    {
      icon: <Stamp size={24} color={t.accent} />,
      title: 'Umrah & Hajj Packages',
      desc: 'Dedicated spiritual journeys with premium hotel options close to Haramain.',
      category: 'Umrah Package'
    },
    {
      icon: <Headphones size={24} color={t.accent} />,
      title: '24/7 Travel Support',
      desc: "We're here for you before, during and after your trip — anytime.",
      category: 'Travel Support'
    }
  ];

  return (
    <section id="services" className="no-print" style={{ padding: '4.5rem 0', background: t.bg, color: t.titleText, transition: 'all 0.2s ease' }}>
      <div className="container">
        
        {/* Core Services Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            fontSize: '11.5px',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: t.accent,
            fontWeight: 700,
            marginBottom: '8px'
          }}>
            WHAT WE OFFER
          </div>
          
          <h2 style={{
            fontFamily: 'var(--font-head)',
            fontWeight: 800,
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            color: t.titleText,
            marginBottom: '8px'
          }}>
            Our Services
          </h2>

          <p style={{ color: t.subText, fontSize: '0.95rem', maxWidth: '440px', margin: '0 auto' }}>
            Everything you need for a perfect journey.
          </p>
        </div>

        {/* 6 Core Services Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.25rem',
          marginBottom: '5rem'
        }}>
          {coreServices.map((service, idx) => (
            <div
              key={idx}
              onClick={() => onSelectBooking({ title: service.title, price: 'Custom Quote', category: service.category })}
              style={{
                background: t.cardBg,
                border: `1px solid ${t.cardBorder}`,
                borderRadius: '16px',
                padding: '1.5rem',
                cursor: 'pointer',
                boxShadow: t.shadow,
                transition: 'all 0.25s ease',
              }}
            >
              <div style={{
                background: isDark ? 'rgba(91, 147, 255, 0.12)' : '#f0f9ff',
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                {service.icon}
              </div>

              <h3 style={{
                fontFamily: 'var(--font-head)',
                fontWeight: 700,
                fontSize: '1.1rem',
                color: t.titleText,
                marginBottom: '0.5rem'
              }}>
                {service.title}
              </h3>

              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                color: t.subText,
                lineHeight: 1.6
              }}>
                {service.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Interactive Deals & Booking Explorer */}
        <div id="deals-section" style={{ textAlign: 'center', marginBottom: '2.5rem', scrollMarginTop: '90px' }}>
          <div style={{
            fontSize: '11.5px',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: t.accent,
            fontWeight: 700,
            marginBottom: '8px'
          }}>
            INSTANT QUOTES & PACKAGES
          </div>
          
          <h3 style={{
            fontFamily: 'var(--font-head)',
            fontWeight: 800,
            fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)',
            color: t.titleText,
            marginBottom: '0.5rem'
          }}>
            Featured Travel Deals
          </h3>

          <p style={{ color: t.subText, fontSize: '0.9rem', maxWidth: '520px', margin: '0 auto 1.5rem auto' }}>
            Browse popular flight routes available today.
          </p>
        </div>

        {/* FLIGHT DEALS CATEGORY */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.25rem' }}>
          {flightDeals.map((flight) => (
            <div 
              key={flight.id} 
              className="animate-fade-in"
              style={{
                background: t.cardBg,
                borderRadius: '16px',
                overflow: 'hidden',
                border: `1px solid ${t.cardBorder}`,
                boxShadow: t.shadow
              }}
            >
              <div style={{ position: 'relative', height: '150px' }}>
                <img src={flight.image} alt={flight.to} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {flight.tag && (
                  <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                    <span className="badge badge-accent">{flight.tag}</span>
                  </div>
                )}
                <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(15, 23, 42, 0.8)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.725rem', fontWeight: 600 }}>
                  {flight.type}
                </div>
              </div>

              <div style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: t.titleText }}>{flight.from}</div>
                  <div style={{ color: t.accent, fontWeight: 700 }}>✈️</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: t.titleText }}>{flight.to}</div>
                </div>

                <div style={{ fontSize: '0.775rem', color: t.subText, marginBottom: '1rem' }}>
                  Airline: <span style={{ fontWeight: 600, color: t.inputText }}>{flight.airline}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: `1px solid ${t.tableRowBorder}` }}>
                  <div>
                    <div style={{ fontSize: '0.725rem', color: t.subText }}>Fares From</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: t.priceColor }}>{flight.priceEstimate}</div>
                  </div>
                  <button 
                    onClick={() => onSelectBooking({ title: `Flight: ${flight.from} to ${flight.to}`, price: flight.priceEstimate, category: 'Flight Ticket' })}
                    className="btn btn-whatsapp" 
                    style={{ fontSize: '0.825rem', padding: '0.5rem 0.9rem', borderRadius: '20px' }}
                  >
                    <MessageSquare size={14} /> Book Flight
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
