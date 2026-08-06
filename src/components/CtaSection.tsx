'use client';

import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, Send } from 'lucide-react';
import { API_BASE_URL, safeFetchJson } from '../config';
import { useTheme } from '../context/ThemeContext';

interface CtaSectionProps {
  onOpenProposal?: () => void;
}

function formatWaNumber(num: string): string {
  let clean = num.replace(/[^0-9]/g, '');
  if (clean.startsWith('01') && clean.length === 11) {
    clean = '88' + clean;
  }
  return clean || '8801700000000';
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onOpenProposal }) => {
  const [whatsapp, setWhatsapp] = useState('8801700000000');
  const [phone, setPhone] = useState('8801700000000');
  const { t } = useTheme();

  useEffect(() => {
    try {
      const cached = localStorage.getItem('travelo_settings');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.whatsappNumber) setWhatsapp(formatWaNumber(parsed.whatsappNumber));
        if (parsed.phoneNumber) setPhone(formatWaNumber(parsed.phoneNumber));
      }
    } catch (e) {}

    safeFetchJson(`${API_BASE_URL}/api/settings`).then((data) => {
      if (data && data.success && data.settings) {
        if (data.settings.whatsappNumber) setWhatsapp(formatWaNumber(data.settings.whatsappNumber));
        if (data.settings.phoneNumber) setPhone(formatWaNumber(data.settings.phoneNumber));
        try {
          localStorage.setItem('travelo_settings', JSON.stringify(data.settings));
        } catch (e) {}
      }
    });
  }, []);

  return (
    <section 
      className="no-print" 
      style={{ 
        background: t.bg, 
        padding: '3rem 1rem 4rem 1rem', 
        position: 'relative',
        transition: 'all 0.2s ease'
      }}
    >
      <div className="container" style={{ maxWidth: '980px', margin: '0 auto' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            borderRadius: '24px',
            padding: '3rem 2rem',
            textAlign: 'center',
            color: '#ffffff',
            boxShadow: '0 20px 40px -15px rgba(37, 99, 235, 0.4)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle Accent Glow Elements */}
          <div 
            style={{
              position: 'absolute',
              top: '-40%',
              left: '-10%',
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.12)',
              filter: 'blur(50px)',
              pointerEvents: 'none'
            }} 
          />
          <div 
            style={{
              position: 'absolute',
              bottom: '-40%',
              right: '-10%',
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              background: 'rgba(96, 165, 250, 0.25)',
              filter: 'blur(50px)',
              pointerEvents: 'none'
            }} 
          />

          <h2
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.3rem)',
              fontWeight: 800,
              letterSpacing: '-0.4px',
              marginBottom: '0.6rem',
              lineHeight: 1.25,
              color: '#ffffff'
            }}
          >
            Ready to Plan Your Next Trip?
          </h2>

          <p
            style={{
              fontSize: 'clamp(0.9rem, 1.6vw, 1.05rem)',
              opacity: 0.9,
              maxWidth: '520px',
              margin: '0 auto 2rem auto',
              lineHeight: 1.5,
              fontWeight: 400,
              color: '#e0f2fe'
            }}
          >
            Reach out however's easiest — we'll take it from there.
          </p>

          {/* Action Buttons Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.85rem',
              flexWrap: 'wrap'
            }}
          >
            {/* Call Now Button */}
            <a
              href={`tel:+${phone}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                background: '#ffffff',
                color: '#1d4ed8',
                padding: '0.75rem 1.6rem',
                borderRadius: '50px',
                fontWeight: 700,
                fontSize: '0.925rem',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.15s ease, boxShadow 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.18)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
            >
              <Phone size={17} color="#1d4ed8" /> Call Now
            </a>

            {/* WhatsApp Button */}
            <a
              href={`https://wa.me/${whatsapp}?text=Hello%20Travelo!%20I%20want%20to%20plan%20my%20next%20trip.`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                background: 'rgba(255, 255, 255, 0.18)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                backdropFilter: 'blur(8px)',
                padding: '0.75rem 1.6rem',
                borderRadius: '50px',
                fontWeight: 700,
                fontSize: '0.925rem',
                textDecoration: 'none',
                transition: 'background 0.15s ease, transform 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.32)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <MessageSquare size={17} color="#ffffff" /> WhatsApp
            </a>

            {/* Messenger / Get Proposal Button */}
            <button
              onClick={() => onOpenProposal && onOpenProposal()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                background: 'rgba(255, 255, 255, 0.18)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                backdropFilter: 'blur(8px)',
                padding: '0.75rem 1.6rem',
                borderRadius: '50px',
                fontWeight: 700,
                fontSize: '0.925rem',
                cursor: 'pointer',
                transition: 'background 0.15s ease, transform 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.32)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Send size={17} color="#ffffff" /> Messenger
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
