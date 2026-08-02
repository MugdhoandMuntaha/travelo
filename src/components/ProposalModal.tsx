import React from 'react';
import { X, Printer, CheckCircle, AlertTriangle, Cpu, Globe } from 'lucide-react';

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProposalModal: React.FC<ProposalModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          maxWidth: '850px', 
          padding: '2.5rem', 
          borderRadius: '20px',
          background: '#ffffff',
          color: '#0f172a',
          border: '1px solid #e2e8f0',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
        }}
      >
        
        {/* Header bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0369a1' }}>
              ✈️ Travelo Digital Platform Proposal
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
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
                background: '#f1f5f9', 
                color: '#64748b',
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
        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Cpu size={16} color="#0284c7" /> Core Architecture & Reality Check
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '1rem' }}>
            <h5 style={{ fontSize: '0.9rem', color: '#991b1b', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <AlertTriangle size={16} /> Full GDS Live API Search
            </h5>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.8rem', color: '#7f1d1d' }}>
              <li style={{ marginBottom: '0.3rem' }}>Expensive monthly GDS API licenses (BDFare, Sabre, Duffel).</li>
              <li style={{ marginBottom: '0.3rem' }}>Requires large security deposits & complex developer maintenance.</li>
              <li>Scraping violates ToS and sends clients to book on competitor sites.</li>
            </ul>
          </div>

          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '1rem' }}>
            <h5 style={{ fontSize: '0.9rem', color: '#166534', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckCircle size={16} /> Smart "Call-to-Book" Model
            </h5>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.8rem', color: '#14532d' }}>
              <li style={{ marginBottom: '0.3rem' }}><strong>Zero API costs</strong> or subscription fees — 100% profit retention.</li>
              <li style={{ marginBottom: '0.3rem' }}>Funnels 100% of mobile visitors directly to Call / WhatsApp.</li>
              <li>Fits existing offline manual booking routine seamlessly.</li>
            </ul>
          </div>

        </div>

        {/* Technical Stack */}
        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Globe size={16} color="#0f766e" /> Tech Stack & Hostinger Deployment
        </h4>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>Modern React & Vite SPA / Plain PHP Hostinger Setup</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>Deployable on Hostinger by choosing "Custom PHP/HTML Website" in hPanel.</div>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span className="badge badge-primary">React 18</span>
            <span className="badge badge-success">Vite</span>
            <span className="badge badge-accent">Hostinger Ready</span>
          </div>
        </div>

        {/* Bottom Line */}
        <div style={{ background: '#f0f9ff', border: '1.5px dashed #0284c7', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0369a1' }}>
            💡 Summary: Instead of building an unneeded, expensive booking engine, this solution gives your agency a high-converting digital portal that funnels every visitor straight into a direct conversation—backed by a built-in referral tracker.
          </p>
        </div>

      </div>
    </div>
  );
};
