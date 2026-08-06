'use client';

import React from 'react';
import { X, Printer, CheckCircle, AlertTriangle, Cpu, Globe } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProposalModal: React.FC<ProposalModalProps> = ({ isOpen, onClose }) => {
  const { t, isDark } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ background: t.modalOverlayBg }} onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          maxWidth: '850px', 
          padding: '2.5rem', 
          borderRadius: '20px',
          background: t.modalBg,
          color: t.titleText,
          border: `1px solid ${t.modalBorder}`,
          boxShadow: t.shadow
        }}
      >
        
        {/* Header bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `2px solid ${t.tableRowBorder}`, paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: t.accent }}>
              ✈️ Travelo Digital Platform Proposal
            </div>
            <div style={{ fontSize: '0.85rem', color: t.subText, marginTop: '0.2rem' }}>
              One-Page Client Strategy & Technical Architecture Summary
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button 
              onClick={() => window.print()}
              className="btn btn-primary no-print"
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem', borderRadius: '8px' }}
            >
              <Printer size={14} /> Print / PDF
            </button>
            <button 
              onClick={onClose}
              className="no-print"
              style={{ 
                background: isDark ? 'rgba(255, 255, 255, 0.1)' : '#f1f5f9', 
                color: t.subText,
                border: 'none', 
                borderRadius: '50%', 
                width: '34px', 
                height: '34px', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Hero Concept */}
        <div style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0f766e 100%)', color: 'white', padding: '1.25rem 1.5rem', borderRadius: '14px', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.3rem' }}>
            High-Impact Digital Hub for Independent Travel Agencies
          </h3>
          <p style={{ fontSize: '0.9rem', opacity: 0.95, lineHeight: 1.5 }}>
            A mobile-optimized web solution designed specifically for ticketing operations in Bangladesh to capture 100% of prospective clients straight to WhatsApp & Direct Call — with zero recurring GDS API costs.
          </p>
        </div>

        {/* Strategic Comparison */}
        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: t.titleText, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Cpu size={16} color={t.accent} /> Core Architecture & Reality Check
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          
          <div style={{ background: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2', border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.3)' : '#fecaca'}`, borderRadius: '12px', padding: '1rem' }}>
            <h5 style={{ fontSize: '0.9rem', color: isDark ? '#fca5a5' : '#991b1b', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <AlertTriangle size={16} /> Full GDS Live API Search
            </h5>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.8rem', color: isDark ? '#f87171' : '#7f1d1d' }}>
              <li style={{ marginBottom: '0.3rem' }}>Expensive monthly GDS API licenses (BDFare, Sabre, Duffel).</li>
              <li style={{ marginBottom: '0.3rem' }}>Requires large security deposits & complex developer maintenance.</li>
              <li>Scraping violates ToS and sends clients to book on competitor sites.</li>
            </ul>
          </div>

          <div style={{ background: t.badgeGreenBg, border: `1px solid ${t.badgeGreenBorder}`, borderRadius: '12px', padding: '1rem' }}>
            <h5 style={{ fontSize: '0.9rem', color: t.badgeGreenText, fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckCircle size={16} /> Smart &quot;Call-to-Book&quot; Model
            </h5>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.8rem', color: t.badgeGreenText }}>
              <li style={{ marginBottom: '0.3rem' }}><strong>Zero API costs</strong> or subscription fees — 100% profit retention.</li>
              <li style={{ marginBottom: '0.3rem' }}>Funnels 100% of mobile visitors directly to Call / WhatsApp.</li>
              <li>Fits existing offline manual booking routine seamlessly.</li>
            </ul>
          </div>

        </div>

        {/* Technical Stack */}
        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: t.titleText, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Globe size={16} color="#0f766e" /> Full-Stack Next.js Architecture
        </h4>
        <div style={{ background: t.cardItemBg, border: `1px solid ${t.cardItemBorder}`, borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: t.titleText }}>Next.js App Router + Mongoose &amp; MongoDB Atlas</div>
            <div style={{ fontSize: '0.8rem', color: t.subText, marginTop: '0.2rem' }}>Serverless API Route Handlers with explicit database management.</div>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span className="badge badge-primary">Next.js 15</span>
            <span className="badge badge-success">React 19</span>
            <span className="badge badge-accent">MongoDB Atlas</span>
          </div>
        </div>

        {/* Bottom Line */}
        <div style={{ background: isDark ? 'rgba(91, 147, 255, 0.12)' : '#f0f9ff', border: `1.5px dashed ${t.accent}`, borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', fontWeight: 700, color: t.accent }}>
            💡 Summary: Instead of building an unneeded, expensive booking engine, this solution gives your agency a high-converting digital portal that funnels every visitor straight into a direct conversation—backed by a built-in referral tracker.
          </p>
        </div>

      </div>
    </div>
  );
};
