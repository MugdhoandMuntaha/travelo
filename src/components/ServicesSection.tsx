import React, { useState, useEffect } from 'react';
import { Plane, Building2, FileText, Compass, Headphones, Stamp, MessageSquare } from 'lucide-react';
import type { FlightDeal, VisaService, TourPackage } from '../types';
import { API_BASE_URL } from '../config';

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

const DEFAULT_VISA_SERVICES: VisaService[] = [
  { country: 'Thailand', flag: '🇹🇭', processingTime: '3-5 Working Days', requirements: ['Passport', '2 Photo 35x45mm', '6 Month Bank Statement (Min 60k BDT)', 'NID Copy'], price: '৳5,500', popular: true },
  { country: 'Malaysia (e-Visa)', flag: '🇲🇾', processingTime: '2-3 Working Days', requirements: ['Passport Scan', 'White Background Photo', 'Flight Reservation'], price: '৳4,800', popular: true },
  { country: 'Saudi Arabia (Umrah/Tourist)', flag: '🇸🇦', processingTime: '24-48 Hours', requirements: ['Original Passport', 'Bio Photo', 'Vaccine Certificate'], price: '৳14,500', popular: true },
  { country: 'UAE / Dubai (30 Days)', flag: '🇦🇪', processingTime: '2 Working Days', requirements: ['Passport Color Scan', 'Photo', 'Guarantor NID'], price: '৳11,000' },
  { country: 'Singapore', flag: '🇸🇬', processingTime: '4-6 Working Days', requirements: ['Invitation Letter / Hotel Booking', 'Bank Statement', 'Company NOC'], price: '৳6,200' },
  { country: 'United Kingdom (Consultancy)', flag: '🇬🇧', processingTime: '15-20 Days', requirements: ['Full Profile Evaluation', 'Asset Documentation', 'Sponsorship Letter'], price: '৳15,000' },
];

const DEFAULT_TOUR_PACKAGES: TourPackage[] = [
  { id: '1', title: 'Sajek Valley Cloud Kingdom Escape', destination: 'Sajek Valley, Rangamati', duration: '3 Days 2 Nights', price: '৳7,500 / person', image: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=600&q=80', highlights: ['Resort Stay', 'Helipad Sunrise View', 'Konglak Pahar Trek', 'Chander Gari Transport'] },
  { id: '2', title: "Cox's Bazar Beach Luxury Getaway", destination: "Cox's Bazar", duration: '3 Days 2 Nights', price: '৳8,900 / person', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80', highlights: ['4-Star Beachfront Hotel', 'Inani Beach Tour', 'Complimentary Breakfast', 'Private Airport Transfers'] },
  { id: '3', title: 'Bangkok & Pattaya Tropical Fiesta', destination: 'Thailand', duration: '5 Days 4 Nights', price: '৳42,000 / person', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80', highlights: ['Coral Island Speedboat Tour', 'Bangkok City Tour', 'Daily Breakfast', 'Visa Assistance Included'] },
  { id: '4', title: 'Sundarbans Wild Mangrove Expedition', destination: 'Sundarbans, Khulna', duration: '3 Days 2 Nights', price: '৳12,500 / person', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80', highlights: ['AC Cruise Vessel Stay', 'Forest Guard Security', 'Kotka Beach Visit', 'All Meal Buffet Included'] },
];

export const ServicesSection: React.FC<ServicesSectionProps> = ({ activeTab, onSelectBooking }) => {
  const [activeCategory, setActiveCategory] = useState<'flights' | 'visa' | 'packages'>('visa');
  const [flightDeals, setFlightDeals] = useState<FlightDeal[]>(DEFAULT_FLIGHT_DEALS);
  const [visaServices, setVisaServices] = useState<VisaService[]>(DEFAULT_VISA_SERVICES);
  const [tourPackages, setTourPackages] = useState<TourPackage[]>(DEFAULT_TOUR_PACKAGES);

  // Sync activeTab prop with internal activeCategory tab state
  useEffect(() => {
    if (activeTab === 'flights' || activeTab === 'visa' || activeTab === 'packages') {
      setActiveCategory(activeTab);
    }
  }, [activeTab]);

  useEffect(() => {
    // Fetch Flights
    fetch(`${API_BASE_URL}/api/flights`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.flights && data.flights.length > 0) {
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
      })
      .catch(() => {});

    // Fetch Visas
    fetch(`${API_BASE_URL}/api/visas`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.visas && data.visas.length > 0) {
          setVisaServices(data.visas);
        }
      })
      .catch(() => {});

    // Fetch Tour Packages
    fetch(`${API_BASE_URL}/api/packages`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.packages && data.packages.length > 0) {
          setTourPackages(data.packages.map((p: any) => ({
            id: p._id || p.id,
            title: p.title,
            destination: p.destination,
            duration: p.duration,
            price: p.price,
            image: p.image,
            highlights: p.highlights || []
          })));
        }
      })
      .catch(() => {});
  }, []);

  const coreServices = [
    {
      icon: <Plane size={24} color="#0284c7" />,
      title: 'Air Ticketing',
      desc: 'Instant booking for domestic & international flights with exclusive agent discounts.',
      category: 'Flight Ticket'
    },
    {
      icon: <FileText size={24} color="#0284c7" />,
      title: 'Visa Assistance',
      desc: 'Expert document processing, e-Visa applications, and high-approval consultancy.',
      category: 'Visa Support'
    },
    {
      icon: <Compass size={24} color="#0284c7" />,
      title: 'Tour Packages',
      desc: 'Customized holiday packages for Sajek, Cox’s Bazar, Thailand, Malaysia & more.',
      category: 'Tour Package'
    },
    {
      icon: <Building2 size={24} color="#0284c7" />,
      title: 'Hotel Reservations',
      desc: 'Handpicked luxury resorts and budget hotels worldwide at competitive prices.',
      category: 'Hotel Booking'
    },
    {
      icon: <Stamp size={24} color="#0284c7" />,
      title: 'Umrah & Hajj Packages',
      desc: 'Dedicated spiritual journeys with premium hotel options close to Haramain.',
      category: 'Umrah Package'
    },
    {
      icon: <Headphones size={24} color="#0284c7" />,
      title: '24/7 Travel Support',
      desc: "We're here for you before, during and after your trip — anytime.",
      category: 'Travel Support'
    }
  ];

  return (
    <section id="services" className="no-print" style={{ padding: '4.5rem 0', background: '#f8fafc', color: '#0f172a' }}>
      <div className="container">
        
        {/* Core Services Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            fontSize: '11.5px',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: '#0284c7',
            fontWeight: 700,
            marginBottom: '8px'
          }}>
            WHAT WE OFFER
          </div>
          
          <h2 style={{
            fontFamily: 'var(--font-head)',
            fontWeight: 800,
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            color: '#0f172a',
            marginBottom: '8px'
          }}>
            Our Services
          </h2>

          <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '440px', margin: '0 auto' }}>
            Everything you need for a perfect journey.
          </p>
        </div>

        {/* 6 Core Services Grid matching original project clean white background */}
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
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.5rem',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                transition: 'all 0.25s ease',
              }}
            >
              <div style={{
                background: '#f0f9ff',
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
                color: '#0f172a',
                marginBottom: '0.5rem'
              }}>
                {service.title}
              </h3>

              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                color: '#64748b',
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
            color: '#0284c7',
            fontWeight: 700,
            marginBottom: '8px'
          }}>
            INSTANT QUOTES & PACKAGES
          </div>
          
          <h3 style={{
            fontFamily: 'var(--font-head)',
            fontWeight: 800,
            fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)',
            color: '#0f172a',
            marginBottom: '0.5rem'
          }}>
            Featured Travel Deals
          </h3>

          <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '520px', margin: '0 auto 1.5rem auto' }}>
            Browse popular flight routes, visa support, and tour packages available today.
          </p>

          {/* Service Category Tabs */}
          <div style={{ display: 'inline-flex', background: '#e2e8f0', padding: '0.35rem', borderRadius: '30px', gap: '0.35rem' }}>
            <button
              onClick={() => setActiveCategory('visa')}
              style={{
                background: activeCategory === 'visa' ? '#0284c7' : 'transparent',
                color: activeCategory === 'visa' ? '#ffffff' : '#475569',
                border: 'none',
                padding: '0.55rem 1.25rem',
                borderRadius: '24px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: activeCategory === 'visa' ? '0 2px 8px rgba(2, 132, 199, 0.3)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <FileText size={15} /> Visa Help
            </button>

            <button
              onClick={() => setActiveCategory('flights')}
              style={{
                background: activeCategory === 'flights' ? '#0284c7' : 'transparent',
                color: activeCategory === 'flights' ? '#ffffff' : '#475569',
                border: 'none',
                padding: '0.55rem 1.25rem',
                borderRadius: '24px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: activeCategory === 'flights' ? '0 2px 8px rgba(2, 132, 199, 0.3)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Plane size={15} /> Flight Tickets
            </button>

            <button
              onClick={() => setActiveCategory('packages')}
              style={{
                background: activeCategory === 'packages' ? '#0284c7' : 'transparent',
                color: activeCategory === 'packages' ? '#ffffff' : '#475569',
                border: 'none',
                padding: '0.55rem 1.25rem',
                borderRadius: '24px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: activeCategory === 'packages' ? '0 2px 8px rgba(2, 132, 199, 0.3)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Compass size={15} /> Tour Packages
            </button>
          </div>
        </div>

        {/* VISA CATEGORY */}
        {activeCategory === 'visa' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.25rem' }}>
            {visaServices.map((visa, idx) => (
              <div 
                key={(visa as any)._id || idx} 
                className="animate-fade-in"
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  padding: '1.35rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '2rem' }}>{visa.flag}</span>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{visa.country} Visa</h3>
                      <div style={{ fontSize: '0.725rem', color: '#64748b' }}>⏱️ {visa.processingTime}</div>
                    </div>
                  </div>
                  {visa.popular && <span className="badge badge-success">High Approval</span>}
                </div>

                <div style={{ margin: '1rem 0' }}>
                  <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#475569', marginBottom: '0.4rem' }}>Required Documents:</div>
                  <ul style={{ paddingLeft: '1.1rem', fontSize: '0.8rem', color: '#475569' }}>
                    {visa.requirements.map((req, rIdx) => (
                      <li key={rIdx} style={{ marginBottom: '0.2rem' }}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.2rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                  <div>
                    <div style={{ fontSize: '0.725rem', color: '#64748b' }}>Processing Fee</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0284c7' }}>{visa.price}</div>
                  </div>
                  <button 
                    onClick={() => onSelectBooking({ title: `${visa.country} Visa Assistance`, price: visa.price, category: 'Visa Processing' })}
                    className="btn btn-primary" 
                    style={{ fontSize: '0.825rem', padding: '0.5rem 0.9rem', borderRadius: '20px' }}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FLIGHT DEALS CATEGORY */}
        {activeCategory === 'flights' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.25rem' }}>
            {flightDeals.map((flight) => (
              <div 
                key={flight.id} 
                className="animate-fade-in"
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.04)'
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
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>{flight.from}</div>
                    <div style={{ color: '#0284c7', fontWeight: 700 }}>✈️</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>{flight.to}</div>
                  </div>

                  <div style={{ fontSize: '0.775rem', color: '#64748b', marginBottom: '1rem' }}>
                    Airline: <span style={{ fontWeight: 600, color: '#334155' }}>{flight.airline}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                    <div>
                      <div style={{ fontSize: '0.725rem', color: '#64748b' }}>Fares From</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#059669' }}>{flight.priceEstimate}</div>
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
        )}

        {/* TOUR PACKAGES CATEGORY */}
        {activeCategory === 'packages' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
            {tourPackages.map((pkg) => (
              <div 
                key={pkg.id} 
                className="animate-fade-in"
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ position: 'relative', height: '170px' }}>
                  <img src={pkg.image} alt={pkg.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(15, 23, 42, 0.8)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.775rem', fontWeight: 600 }}>
                    📍 {pkg.destination} • {pkg.duration}
                  </div>
                </div>

                <div style={{ padding: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.6rem' }}>
                    {pkg.title}
                  </h3>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                    {pkg.highlights.map((hl, idx) => (
                      <span key={idx} style={{ background: '#f1f5f9', color: '#334155', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.725rem', fontWeight: 600 }}>
                        ✓ {hl}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                    <div>
                      <div style={{ fontSize: '0.725rem', color: '#64748b' }}>Package Price</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#d97706' }}>{pkg.price}</div>
                    </div>
                    <button 
                      onClick={() => onSelectBooking({ title: pkg.title, price: pkg.price, category: 'Tour Package' })}
                      className="btn btn-whatsapp" 
                      style={{ fontSize: '0.825rem', padding: '0.5rem 0.9rem', borderRadius: '20px' }}
                    >
                      <MessageSquare size={14} /> Book Package
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
