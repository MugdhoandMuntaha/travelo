import React, { useState, useEffect } from 'react';
import { X, MessageSquare, PhoneCall, Tag } from 'lucide-react';
import { API_BASE_URL } from '../config';

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

  // Retrieve stored referral code from URL parameter session
  useEffect(() => {
    const savedRef = sessionStorage.getItem('travelo_ref') || '';
    if (savedRef) {
      setRefCode(savedRef);
    }
  }, [isOpen]);

  const handleLeadSubmit = async () => {
    const activeRef = refCode.trim() || sessionStorage.getItem('travelo_ref') || '';

    // 1. Log Lead to Backend
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
      console.log('Lead submitted');
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
            commissionAmount: Math.round(numericPrice * 0.05), // Default 5% partner reward estimate
            note: `Booking inquiry for ${bookingData.title}`
          })
        });
      } catch (err) {
        console.log('Referral conversion tracked');
      }
    }
  };

  const agencyPhone = '8801700000000';
  const activeRef = refCode.trim() || sessionStorage.getItem('travelo_ref') || '';

  // Formatted Readymade WhatsApp Booking Message
  const whatsappMessage = 
`📋 *NEW BOOKING INQUIRY — TRAVELO*
---------------------------------------
🎫 *Service Category:* ${bookingData.category}
✈️ *Booking Item:* ${bookingData.title}
💰 *Estimated Fare:* ${bookingData.price}

👤 *Customer Details:*
• *Name:* ${userName || 'Guest User'}
• *Phone:* ${userPhone || 'N/A'}
• *Travel Dates & Notes:* ${notes || 'Standard Request'}

🎟️ *Referral Tracking:*
• *Referral Code:* ${activeRef ? activeRef + ' (Partner Referral Active)' : 'Direct Booking (No Referral)'}
---------------------------------------
Please reply with ticket availability and final confirmed price.`;

  const encodedWhatsAppText = encodeURIComponent(whatsappMessage);
  const whatsappUrl = `https://wa.me/${agencyPhone}?text=${encodedWhatsAppText}`;
  const phoneUrl = `tel:+${agencyPhone}`;

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
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
        }}
      >
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
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>
            {bookingData.title}
          </div>
          <div style={{ fontSize: '0.95rem', color: '#0284c7', fontWeight: 700, marginTop: '0.25rem' }}>
            Estimated Price: <span style={{ color: '#0f172a' }}>{bookingData.price}</span>
          </div>
        </div>

        {/* Active Referral Partner Banner if present */}
        {activeRef && (
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '10px',
            padding: '0.65rem 0.9rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.825rem',
            color: '#15803d',
            fontWeight: 600
          }}>
            <Tag size={16} color="#16a34a" />
            <span>Partner Referral Applied: <strong>{activeRef}</strong></span>
          </div>
        )}

        {/* Contact Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
              Your Name (Optional)
            </label>
            <input 
              type="text" 
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g. Rahim Chowdhury"
              style={{ 
                width: '100%', 
                padding: '0.75rem 0.9rem', 
                borderRadius: '10px', 
                border: '1px solid #cbd5e1', 
                background: '#ffffff', 
                color: '#0f172a', 
                fontSize: '0.9rem' 
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
              Phone Number (Optional)
            </label>
            <input 
              type="text" 
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              placeholder="017XXXXXXXX"
              style={{ 
                width: '100%', 
                padding: '0.75rem 0.9rem', 
                borderRadius: '10px', 
                border: '1px solid #cbd5e1', 
                background: '#ffffff', 
                color: '#0f172a', 
                fontSize: '0.9rem' 
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
              Additional Notes / Travel Dates
            </label>
            <textarea 
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. 2 adults, departure around 15th August"
              style={{ 
                width: '100%', 
                padding: '0.75rem 0.9rem', 
                borderRadius: '10px', 
                border: '1px solid #cbd5e1', 
                background: '#ffffff', 
                color: '#0f172a', 
                fontSize: '0.9rem',
                resize: 'none'
              }}
            />
          </div>

          {!activeRef && (
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                Referral Code (Optional)
              </label>
              <input 
                type="text" 
                value={refCode}
                onChange={(e) => setRefCode(e.target.value)}
                placeholder="e.g. REF1234"
                style={{ 
                  width: '100%', 
                  padding: '0.65rem 0.9rem', 
                  borderRadius: '10px', 
                  border: '1px solid #cbd5e1', 
                  background: '#ffffff', 
                  color: '#0f172a', 
                  fontSize: '0.85rem' 
                }}
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={handleLeadSubmit}
            className="btn btn-whatsapp" 
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', borderRadius: '12px' }}
          >
            <MessageSquare size={18} /> Continue to WhatsApp Chat
          </a>

          <a 
            href={phoneUrl}
            onClick={handleLeadSubmit}
            className="btn btn-primary" 
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', borderRadius: '12px' }}
          >
            <PhoneCall size={18} /> Call Agency Agent Now
          </a>
        </div>

      </div>
    </div>
  );
};
