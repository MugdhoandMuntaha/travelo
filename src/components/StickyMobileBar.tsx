import React from 'react';
import { Phone, MessageSquare } from 'lucide-react';

export const StickyMobileBar: React.FC = () => {
  const agencyPhone = '8801623312405';

  return (
    <div className="sticky-mobile-bar no-print">
      <a 
        href={`tel:+${agencyPhone}`}
        className="sticky-glass-btn call-glass"
      >
        <Phone size={17} /> Call Now
      </a>

      <a 
        href={`https://wa.me/${agencyPhone}?text=Hello%20Travelo!%20I%20want%20to%20inquire%20about%20a%20travel%20booking.`}
        target="_blank"
        rel="noopener noreferrer"
        className="sticky-glass-btn wa-glass"
      >
        <MessageSquare size={17} /> WhatsApp
      </a>
    </div>
  );
};
