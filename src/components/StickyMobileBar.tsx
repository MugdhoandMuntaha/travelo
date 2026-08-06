'use client';

import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare } from 'lucide-react';
import { API_BASE_URL, safeFetchJson } from '../config';

function formatWaNumber(num: string): string {
  let clean = num.replace(/[^0-9]/g, '');
  if (clean.startsWith('01') && clean.length === 11) {
    clean = '88' + clean;
  }
  return clean || '8801700000000';
}

export const StickyMobileBar: React.FC = () => {
  const [whatsapp, setWhatsapp] = useState('8801700000000');
  const [phone, setPhone] = useState('8801700000000');

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
