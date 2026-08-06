'use client';

import React from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/src/context/ThemeContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenProposal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { isDark, toggleTheme, t } = useTheme();

  const navLinks = [
    { id: 'services', label: 'Services' },
    { id: 'flights', label: 'Flight Deals' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);

    // Perform smooth scrolling to target section
    setTimeout(() => {
      if (id === 'services') {
        const el = document.getElementById('services');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        const el = document.getElementById('deals-section') || document.getElementById('services');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <header className="no-print" style={{ background: t.headerBg, backdropFilter: 'blur(12px)', borderBottom: `1px solid ${t.headerBorder}`, position: 'sticky', top: 0, zIndex: 100, transition: 'all 0.2s ease' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        
        {/* Official Brand Logo */}
        <div 
          onClick={() => {
            setActiveTab('services');
            setMobileMenuOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
        >
          <img 
            src="/logo.png" 
            alt="Travelo Logo" 
            style={{ 
              height: '44px', 
              width: 'auto', 
              borderRadius: '8px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)' 
            }} 
          />
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.35rem', color: t.titleText, lineHeight: 1.1, letterSpacing: '-0.5px' }}>
              Travelo
            </div>
            <div style={{ fontSize: '0.725rem', color: t.accent, fontWeight: 700, letterSpacing: '0.2px' }}>
              Travel Towards The Future
            </div>
          </div>
        </div>

        {/* Navigation & Theme Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Desktop Navigation */}
          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '0.9rem',
                  fontWeight: activeTab === link.id ? 700 : 500,
                  color: activeTab === link.id ? t.navLinkActiveText : t.navLinkText,
                  cursor: 'pointer',
                  padding: '0.4rem 0.6rem',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease',
                  borderBottom: activeTab === link.id ? `2px solid ${t.accent}` : '2px solid transparent'
                }}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Sun / Moon Theme Toggler */}
          <button
            onClick={toggleTheme}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.8rem',
              borderRadius: '20px',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : '#cbd5e1'}`,
              background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#f1f5f9',
              color: t.titleText,
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 700,
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDark ? (
              <>
                <Sun size={15} color="#fbbf24" /> <span className="theme-text">Light</span>
              </>
            ) : (
              <>
                <Moon size={15} color="#0284c7" /> <span className="theme-text">Dark</span>
              </>
            )}
          </button>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: t.titleText, padding: '0.5rem' }}
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown Overlay */}
      {mobileMenuOpen && (
        <div style={{
          background: t.cardBg,
          borderTop: `1px solid ${t.cardBorder}`,
          borderBottom: `1px solid ${t.cardBorder}`,
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          boxShadow: t.shadow
        }}>
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              style={{
                textAlign: 'left',
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === link.id ? (isDark ? 'rgba(91, 147, 255, 0.15)' : '#f0f9ff') : 'transparent',
                color: activeTab === link.id ? t.accent : t.titleText,
                fontWeight: activeTab === link.id ? 700 : 500,
                fontSize: '0.95rem',
                cursor: 'pointer'
              }}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
        @media (max-width: 480px) {
          .theme-text { display: none; }
        }
      `}</style>
    </header>
  );
};
