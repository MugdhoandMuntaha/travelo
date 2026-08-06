'use client';

import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenProposal?: () => void;
}

export const Footer: React.FC<FooterProps> = () => {
  const { t } = useTheme();

  return (
    <footer 
      className="no-print" 
      style={{ 
        background: t.cardBg, 
        borderTop: `1px solid ${t.cardBorder}`, 
        padding: '1.5rem 0',
        color: t.subText,
        fontSize: '0.85rem',
        transition: 'all 0.2s ease'
      }}
    >
      <div 
        className="container" 
        style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          textAlign: 'center',
          gap: '0.4rem' 
        }}
      >
        {/* Center-aligned Official Brand Logo & Slogan */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <img src="/logo.png" alt="Travelo Logo" style={{ height: '32px', width: 'auto', borderRadius: '6px' }} />
          <span style={{ color: t.titleText, fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.3px' }}>Travelo</span>
        </div>

        <div style={{ fontSize: '0.8rem', color: t.accent, fontWeight: 700 }}>
          Travel Towards The Future
        </div>

        <div style={{ fontSize: '0.775rem', color: t.subText, marginTop: '0.2rem' }}>
          © {new Date().getFullYear()} Travelo. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
