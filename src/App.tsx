import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroCarousel } from './components/HeroCarousel';
import { StatsSection } from './components/StatsSection';
import { ServicesSection } from './components/ServicesSection';
import { AdminPanel } from './components/AdminPanel';
import { ProposalModal } from './components/ProposalModal';
import { LeadModal } from './components/LeadModal';
import { StickyMobileBar } from './components/StickyMobileBar';
import { Footer } from './components/Footer';
import { API_BASE_URL } from './config';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('services');
  const [isAdminView, setIsAdminView] = useState<boolean>(false);
  const [isProposalOpen, setIsProposalOpen] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<{ title: string; price: string; category: string } | null>(null);

  // Check URL pathname for /admin & track referral click if ?ref= parameter is present
  useEffect(() => {
    if (window.location.pathname === '/admin') {
      setIsAdminView(true);
    }

    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');
    if (refCode) {
      sessionStorage.setItem('travelo_ref', refCode);
      fetch(`${API_BASE_URL}/api/referrals/track-click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refCode })
      }).catch(() => {});
    }
  }, []);

  const handleSelectBooking = (item: { title: string; price: string; category: string }) => {
    setSelectedBooking(item);
  };

  if (isAdminView || activeTab === 'admin') {
    return (
      <AdminPanel 
        onBackToSite={() => {
          setIsAdminView(false);
          setActiveTab('services');
          if (window.location.pathname === '/admin') {
            window.history.pushState({}, '', '/');
          }
        }} 
      />
    );
  }

  return (
    <div className="app-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenProposal={() => setIsProposalOpen(true)} 
      />

      {/* Main Content Body */}
      <main style={{ flex: 1 }}>
        {/* Dynamic Sliding Hero Carousel */}
        <HeroCarousel onSelectBooking={handleSelectBooking} />

        {/* Dynamic Services & Deals Section */}
        <ServicesSection activeTab={activeTab} onSelectBooking={handleSelectBooking} />

        {/* Animated Statistics Counter Banner */}
        <StatsSection />
      </main>

      {/* Footer */}
      <Footer 
        onOpenProposal={() => setIsProposalOpen(true)} 
        setActiveTab={setActiveTab} 
      />

      {/* Modals & Mobile Floating CTA */}
      <ProposalModal 
        isOpen={isProposalOpen} 
        onClose={() => setIsProposalOpen(false)} 
      />

      <LeadModal 
        isOpen={!!selectedBooking} 
        onClose={() => setSelectedBooking(null)} 
        bookingData={selectedBooking} 
      />

      <StickyMobileBar />
    </div>
  );
}

export default App;
