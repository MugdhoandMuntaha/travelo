'use client';

import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Trash2, FileSpreadsheet, Plane, Users, DollarSign, Copy, Stamp, Compass, Phone, MessageSquare, Settings, CheckCircle } from 'lucide-react';
import { API_BASE_URL, safeFetchJson } from '../config';

interface BannerItem {
  _id?: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  badge?: string;
  order?: number;
  active?: boolean;
}

interface FlightItem {
  _id?: string;
  from: string;
  to: string;
  type: 'Domestic' | 'International';
  airline: string;
  priceEstimate: string;
  image: string;
  tag?: string;
}

interface VisaItem {
  _id?: string;
  country: string;
  flag: string;
  processingTime: string;
  requirements: string[];
  price: string;
  popular?: boolean;
}

interface PackageItem {
  _id?: string;
  title: string;
  destination: string;
  duration: string;
  price: string;
  image: string;
  highlights: string[];
}

interface LeadItem {
  _id: string;
  title: string;
  category: string;
  priceEstimate?: string;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  createdAt?: string;
}

interface ReferrerItem {
  _id?: string;
  refCode: string;
  name: string;
  phone?: string;
  commissionRate: number;
  clicks?: number;
  conversions?: number;
  totalCommission?: number;
  unpaidCommission?: number;
  createdAt?: string;
}

interface ConversionItem {
  _id?: string;
  refCode: string;
  clientName: string;
  bookingValue: number;
  commissionAmount: number;
  status: 'Unpaid' | 'Paid';
  note?: string;
  createdAt?: string;
}

interface AdminPanelProps {
  onBackToSite: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToSite }) => {
  const [activeTab, setActiveTab] = useState<'visas' | 'flights' | 'packages' | 'banners' | 'referrals' | 'leads' | 'settings'>('visas');
  
  // Visas state & form
  const [visas, setVisas] = useState<VisaItem[]>([]);
  const [visaCountry, setVisaCountry] = useState('');
  const [visaFlag, setVisaFlag] = useState('🇹🇭');
  const [visaProcessingTime, setVisaProcessingTime] = useState('3-5 Working Days');
  const [visaRequirementsText, setVisaRequirementsText] = useState('Passport, 2 Photo 35x45mm, Bank Statement');
  const [visaPrice, setVisaPrice] = useState('৳5,500');
  const [visaPopular, setVisaPopular] = useState(true);

  // Packages state & form
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [pkgTitle, setPkgTitle] = useState('');
  const [pkgDestination, setPkgDestination] = useState('');
  const [pkgDuration, setPkgDuration] = useState('3 Days 2 Nights');
  const [pkgPrice, setPkgPrice] = useState('৳8,900 / person');
  const [pkgImage, setPkgImage] = useState('');
  const [pkgHighlightsText, setPkgHighlightsText] = useState('Hotel Stay, Sightseeing Tour, Daily Breakfast');

  // Banners state & form
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newCtaText, setNewCtaText] = useState('Book via WhatsApp');
  const [newBadge, setNewBadge] = useState('Special Offer');

  // Flights state & form
  const [flights, setFlights] = useState<FlightItem[]>([]);
  const [flightFrom, setFlightFrom] = useState('Dhaka (DAC)');
  const [flightTo, setFlightTo] = useState('');
  const [flightType, setFlightType] = useState<'Domestic' | 'International'>('Domestic');
  const [flightAirline, setFlightAirline] = useState('US-Bangla / Biman');
  const [flightPrice, setFlightPrice] = useState('৳4,500');
  const [flightImage, setFlightImage] = useState('');
  const [flightTag, setFlightTag] = useState('Best Seller');

  // Referrals state & forms
  const [referrers, setReferrers] = useState<ReferrerItem[]>([]);
  const [conversions, setConversions] = useState<ConversionItem[]>([]);
  const [refName, setRefName] = useState('');
  const [refPhone, setRefPhone] = useState('');
  const [refRate, setRefRate] = useState('5.0');
  const [createdRefCode, setCreatedRefCode] = useState('');

  const [convRefCode, setConvRefCode] = useState('');
  const [convClientName, setConvClientName] = useState('');
  const [convBookingValue, setConvBookingValue] = useState('');
  const [convCommission, setConvCommission] = useState('');
  const [convNote, setConvNote] = useState('');

  // Leads State
  const [leads, setLeads] = useState<LeadItem[]>([]);

  // Agency Settings State
  const [whatsappNumber, setWhatsappNumber] = useState('8801700000000');
  const [phoneNumber, setPhoneNumber] = useState('8801700000000');
  const [agencyEmail, setAgencyEmail] = useState('contact@travelo.com');
  const [agencyAddress, setAgencyAddress] = useState('Dhaka, Bangladesh');

  // Global Toast Notification State
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4500);
  };

  // Fetch Settings
  const fetchSettings = () => {
    try {
      const cached = localStorage.getItem('travelo_settings');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.whatsappNumber) setWhatsappNumber(parsed.whatsappNumber);
        if (parsed.phoneNumber) setPhoneNumber(parsed.phoneNumber);
        if (parsed.agencyEmail) setAgencyEmail(parsed.agencyEmail);
        if (parsed.agencyAddress) setAgencyAddress(parsed.agencyAddress);
      }
    } catch (e) {}

    safeFetchJson(`${API_BASE_URL}/api/settings`).then((data) => {
      if (data && data.success && data.settings) {
        if (data.settings.whatsappNumber) setWhatsappNumber(data.settings.whatsappNumber);
        if (data.settings.phoneNumber) setPhoneNumber(data.settings.phoneNumber);
        if (data.settings.agencyEmail) setAgencyEmail(data.settings.agencyEmail);
        if (data.settings.agencyAddress) setAgencyAddress(data.settings.agencyAddress);
        try {
          localStorage.setItem('travelo_settings', JSON.stringify(data.settings));
        } catch (e) {}
      }
    });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const newSettings = {
      whatsappNumber,
      phoneNumber,
      agencyEmail,
      agencyAddress
    };
    try {
      localStorage.setItem('travelo_settings', JSON.stringify(newSettings));
    } catch (e) {}

    safeFetchJson(`${API_BASE_URL}/api/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings)
    }).then((data) => {
      if (data && data.success) {
        showToast('✅ Agency WhatsApp & Phone Numbers updated successfully!');
      }
    });
  };

  // Fetch Visas
  const fetchVisas = () => {
    safeFetchJson(`${API_BASE_URL}/api/visas`).then((data) => {
      if (data && data.success && data.visas) {
        setVisas(data.visas);
      }
    });
  };

  // Fetch Packages
  const fetchPackages = () => {
    safeFetchJson(`${API_BASE_URL}/api/packages`).then((data) => {
      if (data && data.success && data.packages) {
        setPackages(data.packages);
      }
    });
  };

  // Fetch Banners
  const fetchBanners = () => {
    safeFetchJson(`${API_BASE_URL}/api/banners`).then((data) => {
      if (data && data.success && data.banners) {
        setBanners(data.banners);
      }
    });
  };

  // Fetch Flights
  const fetchFlights = () => {
    safeFetchJson(`${API_BASE_URL}/api/flights`).then((data) => {
      if (data && data.success && data.flights) {
        setFlights(data.flights);
      }
    });
  };

  // Fetch Referrals Data
  const fetchReferrals = () => {
    safeFetchJson(`${API_BASE_URL}/api/referrals/get-all`).then((data) => {
      if (data && data.success) {
        setReferrers(data.referrers || []);
        setConversions(data.conversions || []);
      }
    });
  };

  // Fetch Leads
  const fetchLeads = () => {
    safeFetchJson(`${API_BASE_URL}/api/leads`).then((data) => {
      if (data && data.success && data.leads) {
        setLeads(data.leads);
      }
    });
  };

  useEffect(() => {
    fetchVisas();
    fetchPackages();
    fetchBanners();
    fetchFlights();
    fetchReferrals();
    fetchLeads();
    fetchSettings();
  }, []);

  // Handle Add Visa Card
  const handleAddVisa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visaCountry || !visaPrice) return;

    const reqs = visaRequirementsText
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    fetch(`${API_BASE_URL}/api/visas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        country: visaCountry,
        flag: visaFlag,
        processingTime: visaProcessingTime,
        requirements: reqs,
        price: visaPrice,
        popular: visaPopular
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          fetchVisas();
          setVisaCountry('');
          setVisaRequirementsText('');
          showToast('✅ Visa Assistance Card saved to MongoDB!');
        }
      });
  };

  // Handle Delete Visa Card
  const handleDeleteVisa = (id: string) => {
    if (!confirm('Are you sure you want to delete this Visa Assistance Card?')) return;
    fetch(`${API_BASE_URL}/api/visas/${id}`, { method: 'DELETE' })
      .then((res) => res.json())
      .then(() => {
        fetchVisas();
        showToast('🗑️ Visa Assistance Card deleted!');
      });
  };

  // Handle Add Package Card
  const handleAddPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgTitle || !pkgImage) return;

    const hls = pkgHighlightsText
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    fetch(`${API_BASE_URL}/api/packages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: pkgTitle,
        destination: pkgDestination,
        duration: pkgDuration,
        price: pkgPrice,
        image: pkgImage,
        highlights: hls
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          fetchPackages();
          setPkgTitle('');
          setPkgDestination('');
          setPkgImage('');
          showToast('✅ Tour Package saved to MongoDB!');
        }
      });
  };

  // Handle Delete Package Card
  const handleDeletePackage = (id: string) => {
    if (!confirm('Are you sure you want to delete this Tour Package Card?')) return;
    fetch(`${API_BASE_URL}/api/packages/${id}`, { method: 'DELETE' })
      .then((res) => res.json())
      .then(() => {
        fetchPackages();
        showToast('🗑️ Tour Package deleted!');
      });
  };

  // Handle Add Banner
  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newImageUrl) return;

    fetch(`${API_BASE_URL}/api/banners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newTitle,
        subtitle: newSubtitle,
        imageUrl: newImageUrl,
        ctaText: newCtaText,
        badge: newBadge,
        order: banners.length + 1,
        active: true
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          fetchBanners();
          setNewTitle('');
          setNewSubtitle('');
          setNewImageUrl('');
          showToast('✅ Hero Banner slide saved to MongoDB!');
        }
      });
  };

  // Handle Delete Banner
  const handleDeleteBanner = (id: string) => {
    if (!confirm('Are you sure you want to delete this hero banner slide?')) return;
    fetch(`${API_BASE_URL}/api/banners/${id}`, { method: 'DELETE' })
      .then((res) => res.json())
      .then(() => {
        fetchBanners();
        showToast('🗑️ Hero Banner slide deleted!');
      });
  };

  // Handle Add Flight Card
  const handleAddFlight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flightFrom || !flightTo || !flightImage) return;

    fetch(`${API_BASE_URL}/api/flights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: flightFrom,
        to: flightTo,
        type: flightType,
        airline: flightAirline,
        priceEstimate: flightPrice,
        image: flightImage,
        tag: flightTag
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          fetchFlights();
          setFlightTo('');
          setFlightImage('');
          showToast('✅ Flight Card saved to MongoDB!');
        }
      });
  };

  // Handle Delete Flight Card
  const handleDeleteFlight = (id: string) => {
    if (!confirm('Are you sure you want to delete this Flight Card?')) return;
    fetch(`${API_BASE_URL}/api/flights/${id}`, { method: 'DELETE' })
      .then((res) => res.json())
      .then(() => {
        fetchFlights();
        showToast('🗑️ Flight Card deleted!');
      });
  };

  // Handle Add Referrer
  const handleAddReferrer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refName) return;

    fetch(`${API_BASE_URL}/api/referrals/add-referrer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: refName,
        phone: refPhone,
        commissionRate: refRate
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          fetchReferrals();
          setCreatedRefCode(data.refCode);
          setRefName('');
          setRefPhone('');
          showToast(`✅ Partner Referral Code ${data.refCode} generated & saved!`);
        }
      });
  };

  // Handle Delete Referrer
  const handleDeleteReferrer = (id: string) => {
    if (!confirm('Are you sure you want to delete this Referrer Partner?')) return;
    fetch(`${API_BASE_URL}/api/referrals/referrer/${id}`, { method: 'DELETE' })
      .then((res) => res.json())
      .then(() => {
        fetchReferrals();
        showToast('🗑️ Referral Partner deleted!');
      });
  };

  // Handle Add Conversion
  const handleAddConversion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!convRefCode || !convClientName) return;

    fetch(`${API_BASE_URL}/api/referrals/add-conversion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        refCode: convRefCode,
        clientName: convClientName,
        bookingValue: convBookingValue,
        commissionAmount: convCommission,
        note: convNote
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          fetchReferrals();
          setConvClientName('');
          setConvBookingValue('');
          setConvCommission('');
          setConvNote('');
          showToast('✅ Partner Conversion & Commission recorded!');
        }
      });
  };

  // Handle Toggle Conversion Status (Paid / Unpaid)
  const handleToggleConversionStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Unpaid' ? 'Paid' : 'Unpaid';
    fetch(`${API_BASE_URL}/api/referrals/update-conversion/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus })
    })
      .then((res) => res.json())
      .then(() => {
        fetchReferrals();
        showToast(`🔄 Conversion payment status changed to ${nextStatus}!`);
      });
  };

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', color: 'white', padding: '2rem 0' }}>
      <div className="container">
        
        {/* Floating Action Confirmation Toast */}
        {toastMsg && (
          <div style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 99999,
            background: '#065f46',
            color: '#ecfdf5',
            border: '1px solid #10b981',
            padding: '1rem 1.5rem',
            borderRadius: '14px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.45)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontWeight: 700,
            fontSize: '0.95rem'
          }}>
            <CheckCircle size={22} color="#34d399" />
            {toastMsg}
          </div>
        )}

        {/* Admin Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img src="/logo.png" alt="Travelo Logo" style={{ height: '36px', width: 'auto', borderRadius: '6px' }} />
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Agency Admin Portal</h1>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Manage dynamic Visa assistance cards, flight tickets, tour packages, hero banners, and referral links.</p>
          </div>

          <button 
            onClick={onBackToSite}
            className="btn btn-outline"
            style={{ color: 'white', borderColor: '#334155' }}
          >
            ← Return to Main Website
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('visas')}
            className="btn"
            style={{
              background: activeTab === 'visas' ? '#0284c7' : '#1e293b',
              color: 'white',
              fontSize: '0.9rem'
            }}
          >
            <Stamp size={16} /> Visa Cards ({visas.length})
          </button>

          <button
            onClick={() => setActiveTab('flights')}
            className="btn"
            style={{
              background: activeTab === 'flights' ? '#0284c7' : '#1e293b',
              color: 'white',
              fontSize: '0.9rem'
            }}
          >
            <Plane size={16} /> Flight Cards ({flights.length})
          </button>

          <button
            onClick={() => setActiveTab('packages')}
            className="btn"
            style={{
              background: activeTab === 'packages' ? '#0284c7' : '#1e293b',
              color: 'white',
              fontSize: '0.9rem'
            }}
          >
            <Compass size={16} /> Tour Packages ({packages.length})
          </button>

          <button
            onClick={() => setActiveTab('referrals')}
            className="btn"
            style={{
              background: activeTab === 'referrals' ? '#0284c7' : '#1e293b',
              color: 'white',
              fontSize: '0.9rem'
            }}
          >
            <Users size={16} /> Referral Engine ({referrers.length})
          </button>

          <button
            onClick={() => setActiveTab('banners')}
            className="btn"
            style={{
              background: activeTab === 'banners' ? '#0284c7' : '#1e293b',
              color: 'white',
              fontSize: '0.9rem'
            }}
          >
            <ImageIcon size={16} /> Hero Slides ({banners.length})
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className="btn"
            style={{
              background: activeTab === 'leads' ? '#0284c7' : '#1e293b',
              color: 'white',
              fontSize: '0.9rem'
            }}
          >
            <FileSpreadsheet size={16} /> Incoming Leads ({leads.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className="btn"
            style={{
              background: activeTab === 'settings' ? '#0284c7' : '#1e293b',
              color: 'white',
              fontSize: '0.9rem'
            }}
          >
            <MessageSquare size={16} /> WhatsApp & Phone Numbers
          </button>
        </div>

        {/* VISA CARDS TAB */}
        {activeTab === 'visas' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            
            {/* Add Visa Form */}
            <div style={{ background: '#1e293b', padding: '1.75rem', borderRadius: '16px', border: '1px solid #334155' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Plus size={18} color="#38bdf8" /> Create Visa Service Card
              </h3>

              <form onSubmit={handleAddVisa} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', opacity: 0.9 }}>Country Name *</label>
                    <input 
                      type="text" 
                      required
                      value={visaCountry}
                      onChange={(e) => setVisaCountry(e.target.value)}
                      placeholder="e.g. Thailand"
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', marginTop: '0.3rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', opacity: 0.9 }}>Flag</label>
                    <input 
                      type="text" 
                      value={visaFlag}
                      onChange={(e) => setVisaFlag(e.target.value)}
                      placeholder="🇹🇭"
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', marginTop: '0.3rem', textAlign: 'center', fontSize: '1.2rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', opacity: 0.9 }}>Processing Time *</label>
                    <input 
                      type="text" 
                      required
                      value={visaProcessingTime}
                      onChange={(e) => setVisaProcessingTime(e.target.value)}
                      placeholder="e.g. 3-5 Working Days"
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', marginTop: '0.3rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', opacity: 0.9 }}>Processing Fee *</label>
                    <input 
                      type="text" 
                      required
                      value={visaPrice}
                      onChange={(e) => setVisaPrice(e.target.value)}
                      placeholder="e.g. ৳5,500"
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', marginTop: '0.3rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', opacity: 0.9 }}>Required Documents (Comma Separated) *</label>
                  <textarea 
                    required
                    rows={3}
                    value={visaRequirementsText}
                    onChange={(e) => setVisaRequirementsText(e.target.value)}
                    placeholder="Passport, 2 Photo 35x45mm, 6 Month Bank Statement (Min 60k BDT), NID Copy"
                    style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', marginTop: '0.3rem' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input 
                    type="checkbox"
                    id="visaPopular"
                    checked={visaPopular}
                    onChange={(e) => setVisaPopular(e.target.checked)}
                  />
                  <label htmlFor="visaPopular" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>Show "HIGH APPROVAL" Badge</label>
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%' }}>
                  Save Visa Card to Database 🛂
                </button>
              </form>
            </div>

            {/* Visa List */}
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>Live Visa Cards</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                {visas.map((item, idx) => (
                  <div key={item._id || idx} style={{ background: '#1e293b', borderRadius: '12px', padding: '1rem', border: '1px solid #334155', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.6rem' }}>{item.flag}</span>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'white' }}>{item.country}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>⏱️ {item.processingTime}</div>
                        </div>
                      </div>

                      <button 
                        onClick={() => item._id && handleDeleteVisa(item._id)}
                        style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.35rem', borderRadius: '6px', cursor: 'pointer' }}
                        title="Delete Visa Card"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {item.popular && (
                      <div style={{ fontSize: '0.65rem', background: 'rgba(74, 222, 128, 0.2)', color: '#4ade80', border: '1px solid #4ade80', padding: '0.15rem 0.4rem', borderRadius: '8px', display: 'inline-block', marginBottom: '0.5rem', fontWeight: 700 }}>
                        HIGH APPROVAL
                      </div>
                    )}

                    <div style={{ fontSize: '0.775rem', color: '#cbd5e1', margin: '0.4rem 0' }}>
                      <strong>Docs:</strong> {item.requirements.slice(0, 3).join(', ')}{item.requirements.length > 3 ? '...' : ''}
                    </div>

                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.6rem' }}>
                      {item.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TOUR PACKAGES TAB */}
        {activeTab === 'packages' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            
            {/* Add Package Form */}
            <div style={{ background: '#1e293b', padding: '1.75rem', borderRadius: '16px', border: '1px solid #334155' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Plus size={18} color="#38bdf8" /> Create Tour Package Card
              </h3>

              <form onSubmit={handleAddPackage} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', opacity: 0.9 }}>Package Title *</label>
                  <input 
                    type="text" 
                    required
                    value={pkgTitle}
                    onChange={(e) => setPkgTitle(e.target.value)}
                    placeholder="e.g. Sajek Valley Cloud Kingdom Escape"
                    style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', marginTop: '0.3rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', opacity: 0.9 }}>Destination *</label>
                    <input 
                      type="text" 
                      required
                      value={pkgDestination}
                      onChange={(e) => setPkgDestination(e.target.value)}
                      placeholder="e.g. Sajek Valley"
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', marginTop: '0.3rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', opacity: 0.9 }}>Duration *</label>
                    <input 
                      type="text" 
                      required
                      value={pkgDuration}
                      onChange={(e) => setPkgDuration(e.target.value)}
                      placeholder="e.g. 3 Days 2 Nights"
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', marginTop: '0.3rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', opacity: 0.9 }}>Package Price *</label>
                    <input 
                      type="text" 
                      required
                      value={pkgPrice}
                      onChange={(e) => setPkgPrice(e.target.value)}
                      placeholder="e.g. ৳7,500 / person"
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', marginTop: '0.3rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', opacity: 0.9 }}>Image URL *</label>
                    <input 
                      type="url" 
                      required
                      value={pkgImage}
                      onChange={(e) => setPkgImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', marginTop: '0.3rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', opacity: 0.9 }}>Package Highlights (Comma Separated)</label>
                  <textarea 
                    rows={2}
                    value={pkgHighlightsText}
                    onChange={(e) => setPkgHighlightsText(e.target.value)}
                    placeholder="Resort Stay, Sunrise View, Jeep Transport"
                    style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', marginTop: '0.3rem' }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%' }}>
                  Create Tour Package 🏖️
                </button>
              </form>
            </div>

            {/* Package Cards List */}
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>Live Tour Packages</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                {packages.map((item, idx) => (
                  <div key={item._id || idx} style={{ background: '#1e293b', borderRadius: '12px', overflow: 'hidden', border: '1px solid #334155', position: 'relative' }}>
                    <div style={{ height: '110px', position: 'relative' }}>
                      <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button 
                        onClick={() => item._id && handleDeletePackage(item._id)}
                        style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer' }}
                        title="Delete Package"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div style={{ padding: '0.9rem' }}>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>📍 {item.destination} • {item.duration}</div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'white', margin: '0.2rem 0' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.4rem' }}>
                        {item.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* REFERRALS TAB */}
        {activeTab === 'referrals' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Referrers Registration & Overview Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
              
              {/* Add Referrer Form */}
              <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '16px', border: '1px solid #334155' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Plus size={18} color="#38bdf8" /> Register Referral Partner
                </h3>

                <form onSubmit={handleAddReferrer} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', opacity: 0.9 }}>Partner Full Name *</label>
                    <input 
                      type="text" 
                      required
                      value={refName}
                      onChange={(e) => setRefName(e.target.value)}
                      placeholder="e.g. Abdur Rahim"
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', marginTop: '0.25rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', opacity: 0.9 }}>Phone / Mobile Number</label>
                    <input 
                      type="text" 
                      value={refPhone}
                      onChange={(e) => setRefPhone(e.target.value)}
                      placeholder="e.g. +880 1712-345678"
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', marginTop: '0.25rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', opacity: 0.9 }}>Commission Rate (%)</label>
                    <input 
                      type="number" 
                      step="0.5"
                      value={refRate}
                      onChange={(e) => setRefRate(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', marginTop: '0.25rem' }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', borderRadius: '8px' }}>
                    Generate Referral Code & Link 🔗
                  </button>
                </form>

                {createdRefCode && (
                  <div style={{ marginTop: '1rem', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '0.9rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700 }}>PARTNER CREATED!</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: 'white' }}>Code: {createdRefCode}</div>
                    <div style={{ fontSize: '0.775rem', color: '#94a3b8', wordBreak: 'break-all', marginTop: '0.2rem' }}>
                      Link: {window.location.origin}/?ref={createdRefCode}
                    </div>
                  </div>
                )}
              </div>

              {/* Log Conversion Form */}
              <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '16px', border: '1px solid #334155' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <DollarSign size={18} color="#4ade80" /> Log Conversion / Booking
                </h3>

                <form onSubmit={handleAddConversion} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', opacity: 0.9 }}>Referral Code *</label>
                    <input 
                      type="text" 
                      required
                      value={convRefCode}
                      onChange={(e) => setConvRefCode(e.target.value.toUpperCase())}
                      placeholder="e.g. RAHIM482"
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', marginTop: '0.25rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', opacity: 0.9 }}>Client / Passenger Name *</label>
                    <input 
                      type="text" 
                      required
                      value={convClientName}
                      onChange={(e) => setConvClientName(e.target.value)}
                      placeholder="e.g. Tanvir Hossain"
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', marginTop: '0.25rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', opacity: 0.9 }}>Booking Value (৳)</label>
                      <input 
                        type="number" 
                        value={convBookingValue}
                        onChange={(e) => setConvBookingValue(e.target.value)}
                        placeholder="e.g. 30000"
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', marginTop: '0.25rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', opacity: 0.9 }}>Commission (৳)</label>
                      <input 
                        type="number" 
                        value={convCommission}
                        onChange={(e) => setConvCommission(e.target.value)}
                        placeholder="e.g. 1500"
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', marginTop: '0.25rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', opacity: 0.9 }}>Note / Package Detail</label>
                    <input 
                      type="text" 
                      value={convNote}
                      onChange={(e) => setConvNote(e.target.value)}
                      placeholder="e.g. Dhaka to Bangkok Flight"
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', marginTop: '0.25rem' }}
                    />
                  </div>

                  <button type="submit" className="btn btn-whatsapp" style={{ width: '100%', borderRadius: '8px' }}>
                    Save Conversion Booking 💰
                  </button>
                </form>
              </div>

            </div>

            {/* Referrers Table */}
            <div style={{ background: '#1e293b', borderRadius: '16px', padding: '1.5rem', border: '1px solid #334155' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Active Referral Partners ({referrers.length})</h3>
              
              {referrers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No referral partners registered yet.</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #334155', color: '#38bdf8' }}>
                        <th style={{ padding: '0.75rem' }}>Code</th>
                        <th style={{ padding: '0.75rem' }}>Partner Name</th>
                        <th style={{ padding: '0.75rem' }}>Phone</th>
                        <th style={{ padding: '0.75rem' }}>Rate</th>
                        <th style={{ padding: '0.75rem' }}>Clicks</th>
                        <th style={{ padding: '0.75rem' }}>Conversions</th>
                        <th style={{ padding: '0.75rem' }}>Total Earned</th>
                        <th style={{ padding: '0.75rem' }}>Unpaid</th>
                        <th style={{ padding: '0.75rem' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referrers.map((ref) => (
                        <tr key={ref._id || ref.refCode} style={{ borderBottom: '1px solid #334155' }}>
                          <td style={{ padding: '0.75rem', fontWeight: 800, color: '#38bdf8' }}>{ref.refCode}</td>
                          <td style={{ padding: '0.75rem', fontWeight: 700 }}>{ref.name}</td>
                          <td style={{ padding: '0.75rem', opacity: 0.85 }}>{ref.phone || 'N/A'}</td>
                          <td style={{ padding: '0.75rem' }}>{ref.commissionRate}%</td>
                          <td style={{ padding: '0.75rem', fontWeight: 700 }}>{ref.clicks || 0}</td>
                          <td style={{ padding: '0.75rem', fontWeight: 700, color: '#4ade80' }}>{ref.conversions || 0}</td>
                          <td style={{ padding: '0.75rem', fontWeight: 700 }}>৳{(ref.totalCommission || 0).toLocaleString()}</td>
                          <td style={{ padding: '0.75rem', fontWeight: 700, color: '#f59e0b' }}>৳{(ref.unpaidCommission || 0).toLocaleString()}</td>
                          <td style={{ padding: '0.75rem', display: 'flex', gap: '0.4rem' }}>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/?ref=${ref.refCode}`);
                                alert(`Copied referral link for ${ref.name}!`);
                              }}
                              style={{ background: '#334155', color: 'white', border: 'none', padding: '0.35rem 0.6rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                            >
                              <Copy size={13} /> Link
                            </button>
                            <button
                              onClick={() => ref._id && handleDeleteReferrer(ref._id)}
                              style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.35rem 0.5rem', borderRadius: '6px', cursor: 'pointer' }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Conversions Table */}
            <div style={{ background: '#1e293b', borderRadius: '16px', padding: '1.5rem', border: '1px solid #334155' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Recorded Conversions / Client Bookings ({conversions.length})</h3>
              
              {conversions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No referral conversions logged yet.</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #334155', color: '#38bdf8' }}>
                        <th style={{ padding: '0.75rem' }}>Ref Code</th>
                        <th style={{ padding: '0.75rem' }}>Client Name</th>
                        <th style={{ padding: '0.75rem' }}>Booking Value</th>
                        <th style={{ padding: '0.75rem' }}>Commission</th>
                        <th style={{ padding: '0.75rem' }}>Status</th>
                        <th style={{ padding: '0.75rem' }}>Note</th>
                        <th style={{ padding: '0.75rem' }}>Payout Toggle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {conversions.map((conv) => (
                        <tr key={conv._id} style={{ borderBottom: '1px solid #334155' }}>
                          <td style={{ padding: '0.75rem', fontWeight: 800, color: '#38bdf8' }}>{conv.refCode}</td>
                          <td style={{ padding: '0.75rem', fontWeight: 700 }}>{conv.clientName}</td>
                          <td style={{ padding: '0.75rem' }}>৳{conv.bookingValue.toLocaleString()}</td>
                          <td style={{ padding: '0.75rem', fontWeight: 800, color: '#4ade80' }}>৳{conv.commissionAmount.toLocaleString()}</td>
                          <td style={{ padding: '0.75rem' }}>
                            <span style={{
                              background: conv.status === 'Paid' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                              color: conv.status === 'Paid' ? '#4ade80' : '#f59e0b',
                              border: `1px solid ${conv.status === 'Paid' ? '#4ade80' : '#f59e0b'}`,
                              padding: '0.2rem 0.5rem',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              fontWeight: 700
                            }}>
                              {conv.status}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem', opacity: 0.8 }}>{conv.note || 'N/A'}</td>
                          <td style={{ padding: '0.75rem' }}>
                            <button
                              onClick={() => conv._id && handleToggleConversionStatus(conv._id, conv.status)}
                              style={{
                                background: conv.status === 'Unpaid' ? '#10b981' : '#64748b',
                                color: 'white',
                                border: 'none',
                                padding: '0.35rem 0.75rem',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: 700
                              }}
                            >
                              {conv.status === 'Unpaid' ? 'Mark Paid ✓' : 'Mark Unpaid ↺'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* FLIGHT CARDS TAB */}
        {activeTab === 'flights' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
            
            {/* Add Flight Form */}
            <div style={{ background: '#1e293b', padding: '1.75rem', borderRadius: '16px', border: '1px solid #334155' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Plus size={18} color="#38bdf8" /> Create Flight Deal Card
              </h3>

              <form onSubmit={handleAddFlight} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', opacity: 0.9 }}>From Departure *</label>
                    <input 
                      type="text" 
                      required
                      value={flightFrom}
                      onChange={(e) => setFlightFrom(e.target.value)}
                      placeholder="e.g. Dhaka (DAC)"
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', marginTop: '0.3rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', opacity: 0.9 }}>To Destination *</label>
                    <input 
                      type="text" 
                      required
                      value={flightTo}
                      onChange={(e) => setFlightTo(e.target.value)}
                      placeholder="e.g. Bangkok (BKK)"
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', marginTop: '0.3rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', opacity: 0.9 }}>Flight Type *</label>
                    <select
                      value={flightType}
                      onChange={(e) => setFlightType(e.target.value as any)}
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', marginTop: '0.3rem' }}
                    >
                      <option value="Domestic">Domestic</option>
                      <option value="International">International</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', opacity: 0.9 }}>Airlines / Carrier</label>
                    <input 
                      type="text" 
                      required
                      value={flightAirline}
                      onChange={(e) => setFlightAirline(e.target.value)}
                      placeholder="e.g. Thai Airways / US-Bangla"
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', marginTop: '0.3rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', opacity: 0.9 }}>Starting Price *</label>
                    <input 
                      type="text" 
                      required
                      value={flightPrice}
                      onChange={(e) => setFlightPrice(e.target.value)}
                      placeholder="e.g. ৳28,500"
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', marginTop: '0.3rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', opacity: 0.9 }}>Badge Tag (Optional)</label>
                    <input 
                      type="text" 
                      value={flightTag}
                      onChange={(e) => setFlightTag(e.target.value)}
                      placeholder="e.g. Best Seller / Popular"
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', marginTop: '0.3rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', opacity: 0.9 }}>Card Destination Image URL *</label>
                  <input 
                    type="url" 
                    required
                    value={flightImage}
                    onChange={(e) => setFlightImage(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', marginTop: '0.3rem' }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%' }}>
                  Create Flight Card ✈️
                </button>
              </form>
            </div>

            {/* Flight Cards List */}
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>Live Flight Cards</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                {flights.map((item, idx) => (
                  <div key={item._id || idx} style={{ background: '#1e293b', borderRadius: '12px', overflow: 'hidden', border: '1px solid #334155', position: 'relative' }}>
                    <div style={{ height: '110px', position: 'relative' }}>
                      <img src={item.image} alt={item.to} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', gap: '0.3rem' }}>
                        <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>{item.type}</span>
                        {item.tag && <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>{item.tag}</span>}
                      </div>

                      <button 
                        onClick={() => item._id && handleDeleteFlight(item._id)}
                        style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer' }}
                        title="Delete Card"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div style={{ padding: '0.9rem' }}>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.airline}</div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'white', margin: '0.2rem 0' }}>
                        {item.from} ✈️ {item.to}
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.4rem' }}>
                        {item.priceEstimate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* BANNERS TAB */}
        {activeTab === 'banners' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
            
            {/* Add Slide Form */}
            <div style={{ background: '#1e293b', padding: '1.75rem', borderRadius: '16px', border: '1px solid #334155' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Plus size={18} color="#38bdf8" /> Add New Hero Slide
              </h3>

              <form onSubmit={handleAddBanner} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', opacity: 0.9 }}>Slide Title *</label>
                  <input 
                    type="text" 
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Dubai Luxury Desert Safari"
                    style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', marginTop: '0.3rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', opacity: 0.9 }}>Subtitle / Offer Description</label>
                  <input 
                    type="text" 
                    value={newSubtitle}
                    onChange={(e) => setNewSubtitle(e.target.value)}
                    placeholder="e.g. 5 Days 4 Nights starting from ৳45,000"
                    style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', marginTop: '0.3rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', opacity: 0.9 }}>Image URL *</label>
                  <input 
                    type="url" 
                    required
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', marginTop: '0.3rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', opacity: 0.9 }}>CTA Button Text</label>
                    <input 
                      type="text" 
                      value={newCtaText}
                      onChange={(e) => setNewCtaText(e.target.value)}
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', marginTop: '0.3rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', opacity: 0.9 }}>Badge Tag</label>
                    <input 
                      type="text" 
                      value={newBadge}
                      onChange={(e) => setNewBadge(e.target.value)}
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', marginTop: '0.3rem' }}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%' }}>
                  Save Slide to Database 🚀
                </button>
              </form>
            </div>

            {/* Slide List */}
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>Live Hero Slides</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {banners.map((item, idx) => (
                  <div key={item._id || idx} style={{ background: '#1e293b', borderRadius: '12px', overflow: 'hidden', border: '1px solid #334155', display: 'flex', gap: '1rem', padding: '1rem', alignItems: 'center' }}>
                    <img src={item.imageUrl} alt={item.title} style={{ width: '100px', height: '70px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700 }}>{item.badge || 'Slide ' + (idx + 1)}</div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'white' }}>{item.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{item.subtitle}</div>
                    </div>

                    <button 
                      onClick={() => item._id && handleDeleteBanner(item._id)}
                      style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer' }}
                      title="Delete Slide"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* LEADS TAB */}
        {activeTab === 'leads' && (
          <div style={{ background: '#1e293b', borderRadius: '16px', padding: '1.5rem', border: '1px solid #334155' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Saved Lead Inquiries (MongoDB)</h3>
            
            {leads.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No customer inquiries saved yet.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #334155', color: '#38bdf8' }}>
                      <th style={{ padding: '0.75rem' }}>Customer</th>
                      <th style={{ padding: '0.75rem' }}>Phone</th>
                      <th style={{ padding: '0.75rem' }}>Category</th>
                      <th style={{ padding: '0.75rem' }}>Requested Package</th>
                      <th style={{ padding: '0.75rem' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead._id} style={{ borderBottom: '1px solid #334155' }}>
                        <td style={{ padding: '0.75rem', fontWeight: 700 }}>{lead.customerName || 'Guest'}</td>
                        <td style={{ padding: '0.75rem', color: '#4ade80' }}>{lead.customerPhone || 'N/A'}</td>
                        <td style={{ padding: '0.75rem' }}>{lead.category}</td>
                        <td style={{ padding: '0.75rem' }}>{lead.title}</td>
                        <td style={{ padding: '0.75rem', opacity: 0.7 }}>{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Today'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SETTINGS / WHATSAPP MANAGEMENT TAB */}
        {activeTab === 'settings' && (
          <div style={{ maxWidth: '650px', background: '#1e293b', padding: '2rem', borderRadius: '16px', border: '1px solid #334155' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Settings size={22} color="#38bdf8" /> WhatsApp & Agency Phone Numbers CRUD
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
              Update the official WhatsApp number and direct agency call line used for bookings, floating bars, and customer inquiries across the site.
            </p>



            <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                  <MessageSquare size={16} color="#22c55e" /> Primary WhatsApp Business Number
                </label>
                <input 
                  type="text" 
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="e.g. 8801700000000 (Include Country Code without +)"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', fontSize: '0.95rem' }}
                />
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                  Used for pre-filled booking chats on WhatsApp. Enter digits with country code (e.g. 8801700000000).
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                  <Phone size={16} color="#38bdf8" /> Direct Phone Line for Calls
                </label>
                <input 
                  type="text" 
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. 8801700000000 or +8801700000000"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', fontSize: '0.95rem' }}
                />
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                  Used when customers tap &quot;Call Agency Agent Now&quot; or mobile floating call buttons.
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', display: 'block', marginBottom: '0.4rem' }}>
                  Agency Official Email (Optional)
                </label>
                <input 
                  type="email" 
                  value={agencyEmail}
                  onChange={(e) => setAgencyEmail(e.target.value)}
                  placeholder="e.g. support@travelo.com"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', fontSize: '0.95rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', display: 'block', marginBottom: '0.4rem' }}>
                  Agency Office Address (Optional)
                </label>
                <input 
                  type="text" 
                  value={agencyAddress}
                  onChange={(e) => setAgencyAddress(e.target.value)}
                  placeholder="e.g. Dhaka, Bangladesh"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', fontSize: '0.95rem' }}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ padding: '0.85rem', fontSize: '0.95rem', borderRadius: '10px', marginTop: '0.5rem' }}
              >
                Save Phone & WhatsApp Settings
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
