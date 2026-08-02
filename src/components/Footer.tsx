import React from 'react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenProposal?: () => void;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer 
      className="no-print" 
      style={{ 
        background: '#ffffff', 
        borderTop: '1px solid #e2e8f0', 
        padding: '1.5rem 0',
        color: '#64748b',
        fontSize: '0.85rem'
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
          <span style={{ color: '#0f172a', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.3px' }}>Travelo</span>
        </div>

        <div style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 700 }}>
          Travel Towards The Future
        </div>

        <div style={{ fontSize: '0.775rem', color: '#94a3b8', marginTop: '0.2rem' }}>
          © {new Date().getFullYear()} Travelo. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
