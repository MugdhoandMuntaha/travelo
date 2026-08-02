import React, { useState, useEffect } from 'react';
import { X, MessageSquare, PhoneCall, Tag, CheckCircle } from 'lucide-react';
import { API_BASE_URL, safeFetchJson } from '../config';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: { title: string; price: string; category: string } | null;
}

export const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose, bookingData }) => {
  if (!isOpen || !bookingData) return null;

  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [refCode, setRefCode] = useState('');

  const [agencyWhatsapp, setAgencyWhatsapp] = useState('8801700000000');
  const [agencyPhone, setAgencyPhone] = useState('8801700000000');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Retrieve stored referral code and live agency contact settings
  useEffect(() => {
    const savedRef = sessionStorage.getItem('travelo_ref') || '';
    if (savedRef) {
      setRefCode(savedRef);
    }

    safeFetchJson(`${API_BASE_URL}/api/settings`).then((data) => {
      if (data && data.success && data.settings) {
        if (data.settings.whatsappNumber) setAgencyWhatsapp(data.settings.whatsappNumber);
        if (data.settings.phoneNumber) setAgencyPhone(data.settings.phoneNumber);
      }
    });
  }, [isOpen]);

  const activeRef = refCode.trim() || sessionStorage.getItem('travelo_ref') || '';

  const cleanWhatsapp = agencyWhatsapp.replace(/[^0-9]/g, '') || '8801700000000';
  const cleanPhone = agencyPhone.replace(/[^0-9]/g, '') || '8801700000000';

  // Ideal Professional WhatsApp Booking Message Template
  const whatsappMessage = 
`✈️ *NEW TRAVEL BOOKING INQUIRY*
━━━━━━━━━━━━━━━━━━━━━━
🎫 *Service Category:* ${bookingData.category}
📌 *Booking Item:* ${bookingData.title}
💰 *Estimated Fare:* ${bookingData.price}

👤 *Passenger Information:*
• *Name:* ${userName || 'Guest User'}
• *Contact:* ${userPhone || 'N/A'}
• *Travel Dates & Notes:* ${notes || 'Standard Booking Inquiry'}

🎟️ *Affiliate Tracking:*
• *Referral Code:* ${activeRef ? activeRef + ' (Partner Referral Active)' : 'Direct Booking (No Referral)'}
━━━━━━━━━━━━━━━━━━━━━━
Please confirm availability and reply with the final confirmed ticket fare. Thank you!`;

  const encodedWhatsAppText = encodeURIComponent(whatsappMessage);
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodedWhatsAppText}`;
  const phoneUrl = `tel:+${cleanPhone}`;

  const handleLeadSubmit = async (type: 'whatsapp' | 'phone') => {
    const activeRef = refCode.trim() || sessionStorage.getItem('travelo_ref') || '';

    // 1. Log Lead to Backend / Database
    try {
      await fetch(`${API_BASE_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: bookingData.title,
          category: bookingData.category,
          priceEstimate: bookingData.price,
          customerName: userName || 'Guest',
          customerPhone: userPhone || 'N/A',
          notes: notes ? `${notes} (Ref: ${activeRef || 'None'})` : `Ref: ${activeRef || 'None'}`
        })
      });
    } catch (e) {
      console.log('Lead logged');
    }

    // 2. Log Referral Conversion if Referral Code is active
    if (activeRef) {
      try {
        const numericPrice = parseInt(bookingData.price.replace(/[^0-9]/g, '')) || 0;
        await fetch(`${API_BASE_URL}/api/referrals/add-conversion`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            refCode: activeRef,
            clientName: userName || 'Guest User',
            bookingValue: numericPrice,
            commissionAmount: Math.round(numericPrice * 0.05),
            note: `Booking inquiry for ${bookingData.title}`
          })
        });
      } catch (err) {
        console.log('Referral conversion tracked');
      }
    }

    setIsSubmitted(true);

    if (type === 'whatsapp') {
      window.open(whatsappUrl, '_blank');
    } else {
      window.location.href = phoneUrl;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          background: '#ffffff',
          color: '#0f172a',
          border: '1px solid #e2e8f0',
          padding: '2rem',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          maxWidth: '500px',
          width: '90%'
        }}
      >
        {/* If Submitted, Show Visual Confirmation Screen */}
        {isSubmitted ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ display: 'inline-flex', background: '#dcfce7', borderRadius: '50%', padding: '1rem', marginBottom: '1rem' }}>
              <CheckCircle size={56} color="#16a34a" />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              Inquiry Saved & Sent!
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Your booking inquiry for <strong>{bookingData.title}</strong> has been logged to the Travelo system. 
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '0.5rem',
                  background: '#22c55e', 
                  color: 'white',
                  padding: '0.85rem',
                  borderRadius: '12px',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                <MessageSquare size={18} /> Open WhatsApp Chat Again
              </a>

              <button 
                onClick={() => {
                  setIsSubmitted(false);
                  onClose();
                }}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  color: '#475569',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>{bookingData.category}</span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
                  Direct Agent Contact
                </h3>
              </div>
              <button 
                onClick={onClose}
                style={{ 
                  background: '#f1f5f9', 
                  color: '#64748b',
                  border: 'none', 
                  borderRadius: '50%', 
                  width: '34px', 
                  height: '34px', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  transition: 'background 0.2s ease'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Selected Service Light Card Box */}
            <div style={{ 
              background: '#f0f9ff', 
              border: '1px solid #bae6fd', 
              borderRadius: '12px', 
              padding: '1.1rem', 
              marginBottom: '1.25rem' 
            }}>
              <div style={{ fontSize: '0.775rem', color: '#0369a1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Selected Service
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0369a1', margin: '0.2rem 0' }}>
                {bookingData.title}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#0284c7', fontWeight: 700 }}>
                Est. Fare: {bookingData.price}
              </div>
            </div>

            {/* Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem', display: 'block' }}>
                  Your Name (Optional)
                </label>
                <input 
                  type="text" 
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Rahim Chowdhury"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem', display: 'block' }}>
                  Your Phone Number (Optional)
                </label>
                <input 
                  type="tel" 
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  placeholder="e.g. 01712345678"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem', display: 'block' }}>
                  Travel Dates / Custom Requests
                </label>
                <textarea 
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Departure 15th Aug, 2 Adults 1 Child"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Tag size={14} color="#0284c7" /> Partner Referral Code
                </label>
                <input 
                  type="text" 
                  value={refCode}
                  onChange={(e) => setRefCode(e.target.value)}
                  placeholder="e.g. REF12345"
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    borderRadius: '10px', 
                    border: activeRef ? '1.5px solid #22c55e' : '1px solid #cbd5e1', 
                    fontSize: '0.9rem',
                    background: activeRef ? '#f0fdf4' : '#ffffff',
                    fontWeight: activeRef ? 700 : 400
                  }}
                />
                {activeRef && (
                  <div style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 700, marginTop: '0.2rem' }}>
                    ✓ Active Referral Code Applied ({activeRef})
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={() => handleLeadSubmit('whatsapp')}
                className="btn btn-primary"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '0.5rem',
                  background: '#22c55e', 
                  color: 'white',
                  padding: '0.85rem',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <MessageSquare size={18} /> Continue to WhatsApp Chat
              </button>

              <button 
                onClick={() => handleLeadSubmit('phone')}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '0.5rem',
                  background: '#f8fafc', 
                  color: '#0f172a',
                  border: '1px solid #cbd5e1',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <PhoneCall size={16} /> Call Agency Agent Now
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
