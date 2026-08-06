'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/src/components/Navbar';
import { HeroCarousel } from '@/src/components/HeroCarousel';
import { StatsSection } from '@/src/components/StatsSection';
import { ServicesSection } from '@/src/components/ServicesSection';
import { TestimonialsSection } from '@/src/components/TestimonialsSection';
import { CtaSection } from '@/src/components/CtaSection';
import { ProposalModal } from '@/src/components/ProposalModal';
import { LeadModal } from '@/src/components/LeadModal';
import { StickyMobileBar } from '@/src/components/StickyMobileBar';
import { Footer } from '@/src/components/Footer';
import { API_BASE_URL } from '@/src/config';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<string>('services');
  const [isProposalOpen, setIsProposalOpen] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<{ title: string; price: string; category: string } | null>(null);

  useEffect(() => {
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

        {/* Testimonials Review Section */}
        <TestimonialsSection />

        {/* Pre-Footer Call to Action Section */}
        <CtaSection onOpenProposal={() => setIsProposalOpen(true)} />
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
