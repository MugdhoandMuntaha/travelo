import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare } from 'lucide-react';
import { API_BASE_URL, safeFetchJson } from '../config';

export const StickyMobileBar: React.FC = () => {
  const [whatsapp, setWhatsapp] = useState('8801700000000');
  const [phone, setPhone] = useState('8801700000000');

  useEffect(() => {
    safeFetchJson(`${API_BASE_URL}/api/settings`).then((data) => {
      if (data && data.success && data.settings) {
        if (data.settings.whatsappNumber) setWhatsapp(data.settings.whatsappNumber.replace(/[^0-9]/g, ''));
        if (data.settings.phoneNumber) setPhone(data.settings.phoneNumber.replace(/[^0-9]/g, ''));
      }
    });
  }, []);

  return (
    <div className="sticky-mobile-bar no-print">
      <a 
        href={`tel:+${phone}`}
        className="sticky-glass-btn call-glass"
      >
        <Phone size={17} /> Call Now
      </a>

      <a 
        href={`https://wa.me/${whatsapp}?text=Hello%20Travelo!%20I%20want%20to%20inquire%20about%20a%20travel%20booking.`}
        target="_blank"
        rel="noopener noreferrer"
        className="sticky-glass-btn wa-glass"
      >
        <MessageSquare size={17} /> WhatsApp
      </a>
    </div>
  );
};
