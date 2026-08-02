import React from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenProposal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { id: 'services', label: 'Services & Deals' },
    { id: 'flights', label: 'Flights' },
    { id: 'visa', label: 'Visa Help' },
    { id: 'packages', label: 'Tour Packages' },
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
    <header className="no-print" style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 }}>
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
            <div style={{ fontWeight: 800, fontSize: '1.35rem', color: '#0f172a', lineHeight: 1.1, letterSpacing: '-0.5px' }}>
              Travelo
            </div>
            <div style={{ fontSize: '0.725rem', color: '#0284c7', fontWeight: 700, letterSpacing: '0.2px' }}>
              Travel Towards The Future
            </div>
          </div>
        </div>

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
                color: activeTab === link.id ? '#0284c7' : '#475569',
                cursor: 'pointer',
                padding: '0.4rem 0.6rem',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
                borderBottom: activeTab === link.id ? '2px solid #0284c7' : '2px solid transparent'
              }}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: '#0f172a', padding: '0.5rem' }}
          className="mobile-toggle"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

      </div>

      {/* Mobile Menu Dropdown Overlay */}
      {mobileMenuOpen && (
        <div style={{
          background: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          borderBottom: '1px solid #cbd5e1',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
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
                background: activeTab === link.id ? '#f0f9ff' : 'transparent',
                color: activeTab === link.id ? '#0284c7' : '#1e293b',
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
      `}</style>
    </header>
  );
};
