'use client';

import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  FileSpreadsheet, 
  Plane, 
  Users, 
  DollarSign, 
  Copy, 
  Stamp, 
  Compass, 
  Phone, 
  MessageSquare, 
  Settings, 
  CheckCircle, 
  Upload, 
  Link as LinkIcon, 
  Save, 
  ShieldCheck,
  ExternalLink,
  Sun,
  Moon,
  Star,
  LogOut
} from 'lucide-react';
import { API_BASE_URL, safeFetchJson } from '../config';

interface TestimonialItem {
  _id?: string;
  stars: number;
  quote: string;
  author: string;
  location: string;
  order?: number;
  active?: boolean;
}

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
  onLogout?: () => void;
}

/* ==========================================================================
   REUSABLE FILE UPLOADER COMPONENT (Upload from computer or paste URL)
   ========================================================================== */
interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  isDark?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  value, 
  onChange, 
  label = "Card Photo / Cover Image",
  isDark = true
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file: File) => {
    if (!file) return;
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        onChange(data.url);
      } else {
        // Fallback to Base64 FileReader client-side
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            onChange(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.warn('Upload API endpoint unreachable, fallback to client-side data URL:', err);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onChange(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const accentColor = isDark ? '#5B93FF' : '#0284c7';
  const labelColor = isDark ? '#e2e8f0' : '#334155';
  const inputBg = isDark ? '#11254B' : '#ffffff';
  const inputBorder = isDark ? 'rgba(255, 255, 255, 0.2)' : '#cbd5e1';
  const textColor = isDark ? '#ffffff' : '#0f172a';
  const subtextColor = isDark ? '#93A5C4' : '#64748b';
  const containerBg = isDark ? '#11254B' : '#f8fafc';

  return (
    <div>
      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: labelColor, display: 'block', marginBottom: '0.4rem' }}>
        {label} *
      </label>

      {value ? (
        <div style={{ position: 'relative', width: '100%', height: '140px', borderRadius: '12px', overflow: 'hidden', border: `1px solid ${accentColor}`, background: containerBg, boxShadow: isDark ? '0 4px 15px rgba(0,0,0,0.3)' : '0 4px 15px rgba(0,0,0,0.05)' }}>
          <img 
            src={value} 
            alt="Preview" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80';
            }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, transparent 60%)', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckCircle size={14} color="#34d399" /> Image Loaded & Ready
            </span>
            <button
              type="button"
              onClick={() => onChange('')}
              style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Remove / Change
            </button>
          </div>
        </div>
      ) : (
        <div>
          {!showUrlInput ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
              }}
              style={{
                border: `2px dashed ${dragOver ? accentColor : inputBorder}`,
                background: dragOver ? (isDark ? 'rgba(46, 111, 242, 0.15)' : '#f0f9ff') : containerBg,
                padding: '1.4rem 1rem',
                borderRadius: '12px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                <Upload size={24} color={accentColor} />
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: textColor }}>
                  {isUploading ? 'Uploading Image...' : 'Upload Image File from Device'}
                </div>
                <div style={{ fontSize: '0.775rem', color: subtextColor }}>
                  Click to choose file or drag & drop (JPG, PNG, WebP)
                </div>
              </div>
            </div>
          ) : (
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: `1px solid ${inputBorder}`, background: inputBg, color: textColor, fontSize: '0.9rem' }}
            />
          )}

          <div style={{ marginTop: '0.4rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              style={{ background: 'none', border: 'none', color: accentColor, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <LinkIcon size={12} /> {showUrlInput ? 'Switch to Upload Image File' : 'Or paste web image URL'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToSite, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'visas' | 'flights' | 'packages' | 'banners' | 'testimonials' | 'referrals' | 'leads' | 'settings'>('visas');

  // Testimonials state & form
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [testimonialQuote, setTestimonialQuote] = useState('');
  const [testimonialAuthor, setTestimonialAuthor] = useState('');
  const [testimonialLocation, setTestimonialLocation] = useState('');
  const [testimonialStars, setTestimonialStars] = useState(5);

  // Fetch Testimonials
  const fetchTestimonials = () => {
    safeFetchJson(`${API_BASE_URL}/api/testimonials`).then((data) => {
      if (data && data.testimonials) setTestimonials(data.testimonials);
    });
  };
  
  // Theme State (Dark Theme Default)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('travelo_admin_theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('travelo_admin_theme', nextTheme);
  };

  const isDark = theme === 'dark';

  const t = {
    bg: isDark ? '#060F22' : '#f8fafc',
    headerBg: isDark ? 'rgba(11, 27, 58, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    headerBorder: isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0',
    titleText: isDark ? '#ffffff' : '#0f172a',
    subText: isDark ? '#93A5C4' : '#64748b',
    label: isDark ? '#e2e8f0' : '#334155',
    inputBg: isDark ? '#11254B' : '#ffffff',
    inputBorder: isDark ? 'rgba(255, 255, 255, 0.2)' : '#cbd5e1',
    inputText: isDark ? '#ffffff' : '#0f172a',
    cardBg: isDark ? '#0B1B3A' : '#ffffff',
    cardBorder: isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0',
    cardItemBg: isDark ? '#0E2248' : '#ffffff',
    cardItemBorder: isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0',
    accent: isDark ? '#5B93FF' : '#0284c7',
    accentGradient: isDark ? 'linear-gradient(135deg, #2E6FF2 0%, #1b53c7 100%)' : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
    accentShadow: isDark ? '0 4px 14px rgba(46, 111, 242, 0.4)' : '0 4px 14px rgba(2, 132, 199, 0.25)',
    tabBarBg: isDark ? '#0B1B3A' : '#ffffff',
    tabBarBorder: isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0',
    tabInactiveBg: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f1f5f9',
    tabInactiveText: isDark ? '#93A5C4' : '#64748b',
    tableHeaderBg: isDark ? '#060F22' : '#f8fafc',
    tableRowBorder: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f1f5f9',
    priceColor: isDark ? '#5B93FF' : '#059669',
    shadow: isDark ? '0 10px 30px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.04)',
    badgeGreenBg: isDark ? 'rgba(74, 222, 128, 0.15)' : '#ecfdf5',
    badgeGreenText: isDark ? '#4ade80' : '#059669',
    badgeGreenBorder: isDark ? 'rgba(74, 222, 128, 0.3)' : '#a7f3d0',
    badgeYellowBg: isDark ? 'rgba(251, 191, 36, 0.15)' : '#fffbeb',
    badgeYellowText: isDark ? '#fbbf24' : '#d97706',
    badgeYellowBorder: isDark ? 'rgba(251, 191, 36, 0.3)' : '#fde68a',
  };

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
        showToast('Settings saved & synced to all website buttons!');
      } else {
        showToast('Settings updated locally!');
      }
    });
  };

  // Fetch Visas
  const fetchVisas = () => {
    safeFetchJson(`${API_BASE_URL}/api/visas`).then((data) => {
      if (data && data.visas) setVisas(data.visas);
    });
  };

  // Fetch Packages
  const fetchPackages = () => {
    safeFetchJson(`${API_BASE_URL}/api/packages`).then((data) => {
      if (data && data.packages) setPackages(data.packages);
    });
  };

  // Fetch Banners
  const fetchBanners = () => {
    safeFetchJson(`${API_BASE_URL}/api/banners`).then((data) => {
      if (data && data.banners) setBanners(data.banners);
    });
  };

  // Fetch Flights
  const fetchFlights = () => {
    safeFetchJson(`${API_BASE_URL}/api/flights`).then((data) => {
      if (data && data.flights) setFlights(data.flights);
    });
  };

  // Fetch Leads
  const fetchLeads = () => {
    safeFetchJson(`${API_BASE_URL}/api/leads`).then((data) => {
      if (data && data.leads) setLeads(data.leads);
    });
  };

  // Fetch Referrals Data
  const fetchReferrals = () => {
    safeFetchJson(`${API_BASE_URL}/api/referrals/get-all`).then((data) => {
      if (data && data.success) {
        if (data.referrers) setReferrers(data.referrers);
        if (data.conversions) setConversions(data.conversions);
      }
    });
  };

  useEffect(() => {
    fetchSettings();
    fetchVisas();
    fetchPackages();
    fetchBanners();
    fetchFlights();
    fetchTestimonials();
    fetchLeads();
    fetchReferrals();
  }, []);

  // Handle Add Testimonial
  const handleAddTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialQuote.trim() || !testimonialAuthor.trim()) {
      alert('Please enter both quote and author name.');
      return;
    }

    const newTestimonial = {
      stars: Number(testimonialStars),
      quote: testimonialQuote,
      author: testimonialAuthor,
      location: testimonialLocation || 'Bangladesh',
      order: testimonials.length + 1
    };

    fetch(`${API_BASE_URL}/api/testimonials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTestimonial)
    })
      .then((res) => res.json())
      .then(() => {
        setTestimonialQuote('');
        setTestimonialAuthor('');
        setTestimonialLocation('');
        setTestimonialStars(5);
        fetchTestimonials();
        showToast('New traveler testimonial added to website!');
      });
  };

  // Handle Delete Testimonial
  const handleDeleteTestimonial = (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    fetch(`${API_BASE_URL}/api/testimonials/${id}`, { method: 'DELETE' })
      .then((res) => res.json())
      .then(() => {
        fetchTestimonials();
        showToast('Testimonial deleted.');
      });
  };

  // Handle Visa Add
  const handleAddVisa = (e: React.FormEvent) => {
    e.preventDefault();
    const reqArray = visaRequirementsText.split(',').map((s) => s.trim()).filter(Boolean);
    const newVisa = {
      country: visaCountry,
      flag: visaFlag,
      processingTime: visaProcessingTime,
      requirements: reqArray,
      price: visaPrice,
      popular: visaPopular
    };

    fetch(`${API_BASE_URL}/api/visas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newVisa)
    })
      .then((res) => res.json())
      .then(() => {
        setVisaCountry('');
        fetchVisas();
        showToast('Visa processing service added to site!');
      });
  };

  // Handle Delete Visa
  const handleDeleteVisa = (id: string) => {
    if (!confirm('Are you sure you want to remove this visa service from the site?')) return;
    fetch(`${API_BASE_URL}/api/visas/${id}`, { method: 'DELETE' })
      .then((res) => res.json())
      .then(() => {
        fetchVisas();
        showToast('Visa service deleted.');
      });
  };

  // Handle Add Package
  const handleAddPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgImage) {
      alert('Please upload or select an image for the tour package.');
      return;
    }

    const hlArray = pkgHighlightsText.split(',').map((s) => s.trim()).filter(Boolean);
    const newPkg = {
      title: pkgTitle,
      destination: pkgDestination,
      duration: pkgDuration,
      price: pkgPrice,
      image: pkgImage,
      highlights: hlArray
    };

    fetch(`${API_BASE_URL}/api/packages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPkg)
    })
      .then((res) => res.json())
      .then(() => {
        setPkgTitle('');
        setPkgDestination('');
        setPkgImage('');
        fetchPackages();
        showToast('Tour package added to site!');
      });
  };

  // Handle Delete Package
  const handleDeletePackage = (id: string) => {
    if (!confirm('Are you sure you want to remove this tour package?')) return;
    fetch(`${API_BASE_URL}/api/packages/${id}`, { method: 'DELETE' })
      .then((res) => res.json())
      .then(() => {
        fetchPackages();
        showToast('Package deleted.');
      });
  };

  // Handle Add Flight
  const handleAddFlight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flightImage) {
      alert('Please upload or select a photo for the destination.');
      return;
    }

    const newFlight = {
      from: flightFrom,
      to: flightTo,
      type: flightType,
      airline: flightAirline,
      priceEstimate: flightPrice,
      image: flightImage,
      tag: flightTag
    };

    fetch(`${API_BASE_URL}/api/flights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newFlight)
    })
      .then((res) => res.json())
      .then(() => {
        setFlightTo('');
        setFlightImage('');
        fetchFlights();
        showToast('Flight deal card added to site!');
      });
  };

  // Handle Delete Flight
  const handleDeleteFlight = (id: string) => {
    if (!confirm('Are you sure you want to remove this flight deal card?')) return;
    fetch(`${API_BASE_URL}/api/flights/${id}`, { method: 'DELETE' })
      .then((res) => res.json())
      .then(() => {
        fetchFlights();
        showToast('Flight card deleted.');
      });
  };

  // Handle Add Banner Slide
  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl) {
      alert('Please upload or select an image for the hero banner.');
      return;
    }

    const newBanner = {
      title: newTitle,
      subtitle: newSubtitle,
      imageUrl: newImageUrl,
      ctaText: newCtaText,
      badge: newBadge,
      active: true
    };

    fetch(`${API_BASE_URL}/api/banners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBanner)
    })
      .then((res) => res.json())
      .then(() => {
        setNewTitle('');
        setNewSubtitle('');
        setNewImageUrl('');
        fetchBanners();
        showToast('Hero slide added to website!');
      });
  };

  // Handle Delete Banner
  const handleDeleteBanner = (id: string) => {
    if (!confirm('Are you sure you want to delete this hero slide?')) return;
    fetch(`${API_BASE_URL}/api/banners/${id}`, { method: 'DELETE' })
      .then((res) => res.json())
      .then(() => {
        fetchBanners();
        showToast('Hero slide deleted.');
      });
  };

  // Handle Add Referrer
  const handleAddReferrer = (e: React.FormEvent) => {
    e.preventDefault();
    fetch(`${API_BASE_URL}/api/referrals/add-referrer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: refName,
        phone: refPhone,
        commissionRate: parseFloat(refRate) || 5.0
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRefName('');
          setRefPhone('');
          setCreatedRefCode(data.referrer.refCode);
          fetchReferrals();
          showToast(`Referral Partner registered! Code: ${data.referrer.refCode}`);
        }
      });
  };

  // Handle Delete Referrer
  const handleDeleteReferrer = (id: string) => {
    if (!confirm('Are you sure you want to delete this referral partner?')) return;
    fetch(`${API_BASE_URL}/api/referrals/referrer/${id}`, { method: 'DELETE' })
      .then((res) => res.json())
      .then(() => {
        fetchReferrals();
        showToast('Referral partner deleted.');
      });
  };

  // Handle Add Conversion
  const handleAddConversion = (e: React.FormEvent) => {
    e.preventDefault();
    fetch(`${API_BASE_URL}/api/referrals/add-conversion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        refCode: convRefCode,
        clientName: convClientName,
        bookingValue: parseFloat(convBookingValue) || 0,
        commissionAmount: parseFloat(convCommission) || 0,
        note: convNote
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setConvRefCode('');
          setConvClientName('');
          setConvBookingValue('');
          setConvCommission('');
          setConvNote('');
          fetchReferrals();
          showToast('Partner Conversion & Commission recorded!');
        } else {
          alert(data.error || 'Failed to record conversion');
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
        showToast(`Conversion payment status changed to ${nextStatus}!`);
      });
  };

  return (
    <div className="admin-panel-root" style={{ background: t.bg, minHeight: '100vh', color: t.titleText, paddingBottom: '3rem', fontFamily: "'Inter', system-ui, -apple-system, sans-serif", transition: 'background 0.2s ease, color 0.2s ease' }}>
      <style>{`
        .admin-panel-root input::placeholder,
        .admin-panel-root textarea::placeholder {
          color: ${isDark ? '#93A5C4' : '#64748b'} !important;
          opacity: 0.85 !important;
        }
        .admin-panel-root input:focus,
        .admin-panel-root textarea:focus,
        .admin-panel-root select:focus {
          outline: none !important;
          border-color: ${t.accent} !important;
          box-shadow: 0 0 0 3px ${isDark ? 'rgba(91, 147, 255, 0.25)' : 'rgba(2, 132, 199, 0.2)'} !important;
        }
        .admin-panel-root select option {
          background-color: ${isDark ? '#0B1B3A' : '#ffffff'} !important;
          color: ${isDark ? '#ffffff' : '#0f172a'} !important;
        }
      `}</style>
      
      {/* Floating Action Confirmation Toast */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 99999,
          background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
          color: '#ecfdf5',
          border: '1px solid #10b981',
          padding: '1rem 1.5rem',
          borderRadius: '14px',
          boxShadow: '0 12px 35px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontWeight: 700,
          fontSize: '0.95rem'
        }}>
          <CheckCircle size={20} color="#34d399" />
          {toastMsg}
        </div>
      )}

      {/* STICKY GLASS HEADER NAVBAR */}
      <div style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000, 
        background: t.headerBg, 
        backdropFilter: 'blur(12px)', 
        borderBottom: `1px solid ${t.headerBorder}`, 
        padding: '1rem 0',
        transition: 'background 0.2s ease, border-color 0.2s ease'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img src="/logo.png" alt="Travelo Logo" style={{ height: '42px', width: 'auto', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: t.titleText, letterSpacing: '-0.02em', margin: 0 }}>Travelo Admin Portal</h1>
                <span style={{ fontSize: '0.7rem', background: t.badgeGreenBg, color: t.badgeGreenText, border: `1px solid ${t.badgeGreenBorder}`, padding: '0.15rem 0.55rem', borderRadius: '20px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span> System Live
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: t.subText, margin: 0, marginTop: '0.15rem' }}>
                Control center for packages, flight deals, visa services & WhatsApp settings
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* DARK / LIGHT THEME TOGGLER */}
            <button 
              onClick={toggleTheme}
              type="button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.1rem',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.85rem',
                color: isDark ? '#fbbf24' : '#0284c7',
                border: `1px solid ${isDark ? 'rgba(251, 191, 36, 0.35)' : '#cbd5e1'}`,
                background: isDark ? 'rgba(251, 191, 36, 0.12)' : '#f0f9ff',
                cursor: 'pointer',
                boxShadow: isDark ? '0 2px 10px rgba(251, 191, 36, 0.1)' : '0 2px 8px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease'
              }}
              title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
            >
              {isDark ? <Sun size={16} color="#fbbf24" /> : <Moon size={16} color="#0284c7" />}
              <span>{isDark ? 'Light Theme' : 'Dark Theme'}</span>
            </button>

            <button 
              onClick={onBackToSite}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.65rem 1.25rem',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.85rem',
                color: isDark ? '#ffffff' : '#0284c7',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : '#0284c7'}`,
                background: isDark ? 'rgba(255,255,255,0.06)' : '#f0f9ff',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.15s ease'
              }}
            >
              <ExternalLink size={15} /> Back to Website
            </button>

            {onLogout && (
              <button 
                onClick={onLogout}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.65rem 1.1rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  background: 'rgba(239, 68, 68, 0.12)',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.15)',
                  transition: 'all 0.15s ease'
                }}
                title="Log out of Admin Portal"
              >
                <LogOut size={15} /> Log Out
              </button>
            )}
          </div>

        </div>
      </div>

      <div className="container" style={{ marginTop: '1.75rem' }}>

        {/* NAVIGATION TAB BAR */}
        <div style={{ 
          background: t.tabBarBg, 
          padding: '0.5rem', 
          borderRadius: '16px', 
          border: `1px solid ${t.tabBarBorder}`, 
          display: 'flex', 
          gap: '0.4rem', 
          marginBottom: '2rem', 
          flexWrap: 'wrap', 
          boxShadow: t.shadow,
          transition: 'all 0.2s ease' 
        }}>
          
          <button
            onClick={() => setActiveTab('visas')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.1rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              border: activeTab === 'visas' ? `1px solid ${t.accent}` : '1px solid transparent',
              background: activeTab === 'visas' ? t.accentGradient : t.tabInactiveBg,
              color: activeTab === 'visas' ? '#ffffff' : t.tabInactiveText,
              cursor: 'pointer',
              boxShadow: activeTab === 'visas' ? t.accentShadow : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Stamp size={16} /> Visa Services ({visas.length})
          </button>

          <button
            onClick={() => setActiveTab('packages')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.1rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              border: activeTab === 'packages' ? `1px solid ${t.accent}` : '1px solid transparent',
              background: activeTab === 'packages' ? t.accentGradient : t.tabInactiveBg,
              color: activeTab === 'packages' ? '#ffffff' : t.tabInactiveText,
              cursor: 'pointer',
              boxShadow: activeTab === 'packages' ? t.accentShadow : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Compass size={16} /> Tour Packages ({packages.length})
          </button>

          <button
            onClick={() => setActiveTab('flights')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.1rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              border: activeTab === 'flights' ? `1px solid ${t.accent}` : '1px solid transparent',
              background: activeTab === 'flights' ? t.accentGradient : t.tabInactiveBg,
              color: activeTab === 'flights' ? '#ffffff' : t.tabInactiveText,
              cursor: 'pointer',
              boxShadow: activeTab === 'flights' ? t.accentShadow : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Plane size={16} /> Flight Deals ({flights.length})
          </button>

          <button
            onClick={() => setActiveTab('banners')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.1rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              border: activeTab === 'banners' ? `1px solid ${t.accent}` : '1px solid transparent',
              background: activeTab === 'banners' ? t.accentGradient : t.tabInactiveBg,
              color: activeTab === 'banners' ? '#ffffff' : t.tabInactiveText,
              cursor: 'pointer',
              boxShadow: activeTab === 'banners' ? t.accentShadow : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <ImageIcon size={16} /> Hero Slides ({banners.length})
          </button>

          <button
            onClick={() => setActiveTab('testimonials')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.1rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              border: activeTab === 'testimonials' ? `1px solid ${t.accent}` : '1px solid transparent',
              background: activeTab === 'testimonials' ? t.accentGradient : t.tabInactiveBg,
              color: activeTab === 'testimonials' ? '#ffffff' : t.tabInactiveText,
              cursor: 'pointer',
              boxShadow: activeTab === 'testimonials' ? t.accentShadow : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Star size={16} /> Testimonials ({testimonials.length})
          </button>

          <button
            onClick={() => setActiveTab('referrals')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.1rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              border: activeTab === 'referrals' ? `1px solid ${t.accent}` : '1px solid transparent',
              background: activeTab === 'referrals' ? t.accentGradient : t.tabInactiveBg,
              color: activeTab === 'referrals' ? '#ffffff' : t.tabInactiveText,
              cursor: 'pointer',
              boxShadow: activeTab === 'referrals' ? t.accentShadow : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Users size={16} /> Referral Engine ({referrers.length})
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.1rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              border: activeTab === 'leads' ? `1px solid ${t.accent}` : '1px solid transparent',
              background: activeTab === 'leads' ? t.accentGradient : t.tabInactiveBg,
              color: activeTab === 'leads' ? '#ffffff' : t.tabInactiveText,
              cursor: 'pointer',
              boxShadow: activeTab === 'leads' ? t.accentShadow : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <FileSpreadsheet size={16} /> Booking Inquiries ({leads.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.1rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              border: activeTab === 'settings' ? `1px solid ${t.accent}` : '1px solid transparent',
              background: activeTab === 'settings' ? t.accentGradient : t.tabInactiveBg,
              color: activeTab === 'settings' ? '#ffffff' : t.tabInactiveText,
              cursor: 'pointer',
              boxShadow: activeTab === 'settings' ? t.accentShadow : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Settings size={16} /> Agency Contact
          </button>
        </div>

        {/* VISA CARDS TAB */}
        {activeTab === 'visas' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* Add Visa Form */}
            <div style={{ background: t.cardBg, padding: '1.75rem', borderRadius: '16px', border: `1px solid ${t.cardBorder}`, boxShadow: t.shadow }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', color: t.titleText, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={18} color={t.accent} /> Add New Visa Processing Service
              </h3>

              <form onSubmit={handleAddVisa} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: t.label }}>Country Name *</label>
                    <input 
                      type="text" 
                      required
                      value={visaCountry}
                      onChange={(e) => setVisaCountry(e.target.value)}
                      placeholder="e.g. Thailand"
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, marginTop: '0.35rem', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: t.label }}>Flag Emoji</label>
                    <input 
                      type="text" 
                      value={visaFlag}
                      onChange={(e) => setVisaFlag(e.target.value)}
                      placeholder="🇹🇭"
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, marginTop: '0.35rem', textAlign: 'center', fontSize: '1.25rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: t.label }}>Processing Time *</label>
                    <input 
                      type="text" 
                      required
                      value={visaProcessingTime}
                      onChange={(e) => setVisaProcessingTime(e.target.value)}
                      placeholder="e.g. 3-5 Working Days"
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, marginTop: '0.35rem', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: t.label }}>Service Fee *</label>
                    <input 
                      type="text" 
                      required
                      value={visaPrice}
                      onChange={(e) => setVisaPrice(e.target.value)}
                      placeholder="e.g. ৳5,500"
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, marginTop: '0.35rem', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: t.label }}>Required Documents (Comma Separated) *</label>
                  <textarea 
                    required
                    rows={3}
                    value={visaRequirementsText}
                    onChange={(e) => setVisaRequirementsText(e.target.value)}
                    placeholder="Passport, 2 Photo 35x45mm, Bank Statement"
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, marginTop: '0.35rem', fontSize: '0.9rem', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.25rem' }}>
                  <input 
                    type="checkbox"
                    id="visaPopular"
                    checked={visaPopular}
                    onChange={(e) => setVisaPopular(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: t.accent, cursor: 'pointer' }}
                  />
                  <label htmlFor="visaPopular" style={{ fontSize: '0.875rem', color: t.label, cursor: 'pointer', fontWeight: 500 }}>
                    Highlight with &quot;HIGH APPROVAL RATE&quot; Badge
                  </label>
                </div>

                <button 
                  type="submit" 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.85rem 1.5rem',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: '#ffffff',
                    background: t.accentGradient,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: t.accentShadow,
                    marginTop: '0.5rem',
                    fontFamily: 'inherit',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Save size={16} /> Save Visa Service to Website
                </button>
              </form>
            </div>

            {/* Visa List */}
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', color: t.titleText }}>Active Visa Services on Site</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
                {visas.map((item, idx) => (
                  <div key={item._id || idx} style={{ background: t.cardItemBg, borderRadius: '14px', padding: '1.25rem', border: `1px solid ${t.cardItemBorder}`, position: 'relative', boxShadow: t.shadow }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontSize: '1.8rem' }}>{item.flag}</span>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '1rem', color: t.titleText }}>{item.country}</div>
                          <div style={{ fontSize: '0.775rem', color: t.subText, marginTop: '0.1rem' }}>{item.processingTime}</div>
                        </div>
                      </div>

                      <button 
                        onClick={() => item._id && handleDeleteVisa(item._id)}
                        style={{
                          background: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2',
                          color: '#ef4444',
                          border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.3)' : '#fecaca'}`,
                          padding: '0.35rem 0.65rem',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          transition: 'all 0.15s ease'
                        }}
                        title="Delete Visa Card"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>

                    {item.popular && (
                      <div style={{ fontSize: '0.7rem', background: t.badgeGreenBg, color: t.badgeGreenText, border: `1px solid ${t.badgeGreenBorder}`, padding: '0.2rem 0.6rem', borderRadius: '20px', display: 'inline-block', marginBottom: '0.6rem', fontWeight: 700 }}>
                        HIGH APPROVAL RATE
                      </div>
                    )}

                    <div style={{ fontSize: '0.8rem', color: t.subText, margin: '0.5rem 0', lineHeight: 1.4 }}>
                      <strong style={{ color: t.titleText }}>Required:</strong> {item.requirements.slice(0, 3).join(', ')}{item.requirements.length > 3 ? '...' : ''}
                    </div>

                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: t.priceColor, marginTop: '0.75rem', borderTop: `1px dashed ${t.cardBorder}`, paddingTop: '0.6rem' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* Add Package Form */}
            <div style={{ background: t.cardBg, padding: '1.75rem', borderRadius: '16px', border: `1px solid ${t.cardBorder}`, boxShadow: t.shadow }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', color: t.titleText, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={18} color={t.accent} /> Add New Holiday Tour Package
              </h3>

              <form onSubmit={handleAddPackage} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: t.label }}>Package Title *</label>
                  <input 
                    type="text" 
                    required
                    value={pkgTitle}
                    onChange={(e) => setPkgTitle(e.target.value)}
                    placeholder="e.g. Sajek Valley Cloud Kingdom Escape"
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, marginTop: '0.35rem', fontSize: '0.9rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: t.label }}>Destination *</label>
                    <input 
                      type="text" 
                      required
                      value={pkgDestination}
                      onChange={(e) => setPkgDestination(e.target.value)}
                      placeholder="e.g. Sajek Valley"
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, marginTop: '0.35rem', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: t.label }}>Duration *</label>
                    <input 
                      type="text" 
                      required
                      value={pkgDuration}
                      onChange={(e) => setPkgDuration(e.target.value)}
                      placeholder="e.g. 3 Days 2 Nights"
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, marginTop: '0.35rem', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: t.label }}>Package Price *</label>
                  <input 
                    type="text" 
                    required
                    value={pkgPrice}
                    onChange={(e) => setPkgPrice(e.target.value)}
                    placeholder="e.g. ৳8,900 / person"
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, marginTop: '0.35rem', fontSize: '0.9rem' }}
                  />
                </div>

                {/* Direct Image File Upload System */}
                <ImageUploader 
                  value={pkgImage}
                  onChange={setPkgImage}
                  label="Package Cover Photo"
                  isDark={isDark}
                />

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: t.label }}>Package Highlights (Comma Separated)</label>
                  <textarea 
                    rows={2}
                    value={pkgHighlightsText}
                    onChange={(e) => setPkgHighlightsText(e.target.value)}
                    placeholder="Hotel Stay, Sightseeing Tour, Daily Breakfast"
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, marginTop: '0.35rem', fontSize: '0.9rem', resize: 'vertical' }}
                  />
                </div>

                <button 
                  type="submit" 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.85rem 1.5rem',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: '#ffffff',
                    background: t.accentGradient,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: t.accentShadow,
                    marginTop: '0.5rem',
                    fontFamily: 'inherit',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Save size={16} /> Save Tour Package to Website
                </button>
              </form>
            </div>

            {/* Package Cards List */}
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', color: t.titleText }}>Active Tour Packages on Site</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {packages.map((item, idx) => (
                  <div key={item._id || idx} style={{ background: t.cardItemBg, borderRadius: '16px', overflow: 'hidden', border: `1px solid ${t.cardItemBorder}`, position: 'relative', boxShadow: t.shadow }}>
                    <div style={{ height: '150px', position: 'relative', overflow: 'hidden', background: t.bg }}>
                      <img 
                        src={item.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'} 
                        alt={item.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                      <button 
                        onClick={() => item._id && handleDeletePackage(item._id)}
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          background: 'rgba(239, 68, 68, 0.9)',
                          color: '#ffffff',
                          border: 'none',
                          padding: '0.35rem 0.65rem',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          backdropFilter: 'blur(4px)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          transition: 'all 0.15s ease'
                        }}
                        title="Delete Package"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>

                    <div style={{ padding: '1.1rem' }}>
                      <div style={{ fontSize: '0.775rem', color: t.accent, fontWeight: 700, marginBottom: '0.35rem' }}>
                        {item.destination} • {item.duration}
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: t.titleText, lineHeight: 1.35, minHeight: '2.7em' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#059669', marginTop: '0.75rem', borderTop: '1px dashed #e2e8f0', paddingTop: '0.6rem' }}>
                        {item.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* FLIGHT CARDS TAB */}
        {activeTab === 'flights' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* Add Flight Form */}
            <div style={{ background: t.cardBg, padding: '1.75rem', borderRadius: '16px', border: `1px solid ${t.cardBorder}`, boxShadow: t.shadow }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', color: t.titleText, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={18} color={t.accent} /> Add New Flight Ticket Deal
              </h3>

              <form onSubmit={handleAddFlight} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: t.label }}>From Departure *</label>
                    <input 
                      type="text" 
                      required
                      value={flightFrom}
                      onChange={(e) => setFlightFrom(e.target.value)}
                      placeholder="e.g. Dhaka (DAC)"
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, marginTop: '0.35rem', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: t.label }}>To Destination *</label>
                    <input 
                      type="text" 
                      required
                      value={flightTo}
                      onChange={(e) => setFlightTo(e.target.value)}
                      placeholder="e.g. Bangkok (BKK)"
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, marginTop: '0.35rem', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: t.label }}>Flight Category *</label>
                    <select
                      value={flightType}
                      onChange={(e) => setFlightType(e.target.value as any)}
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, marginTop: '0.35rem', fontSize: '0.9rem' }}
                    >
                      <option value="Domestic">Domestic Flight</option>
                      <option value="International">International Flight</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: t.label }}>Airlines / Carrier</label>
                    <input 
                      type="text" 
                      required
                      value={flightAirline}
                      onChange={(e) => setFlightAirline(e.target.value)}
                      placeholder="e.g. Biman Bangladesh / US-Bangla"
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, marginTop: '0.35rem', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: t.label }}>Starting Price *</label>
                    <input 
                      type="text" 
                      required
                      value={flightPrice}
                      onChange={(e) => setFlightPrice(e.target.value)}
                      placeholder="e.g. ৳28,500"
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, marginTop: '0.35rem', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: t.label }}>Badge Tag (Optional)</label>
                    <input 
                      type="text" 
                      value={flightTag}
                      onChange={(e) => setFlightTag(e.target.value)}
                      placeholder="e.g. Best Seller"
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, marginTop: '0.35rem', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                {/* Direct Image Upload */}
                <ImageUploader 
                  value={flightImage}
                  onChange={setFlightImage}
                  label="Destination Photo"
                  isDark={isDark}
                />

                <button 
                  type="submit" 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.85rem 1.5rem',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: '#ffffff',
                    background: t.accentGradient,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: t.accentShadow,
                    marginTop: '0.5rem',
                    fontFamily: 'inherit',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Save size={16} /> Save Flight Deal to Website
                </button>
              </form>
            </div>

            {/* Flight Cards List */}
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', color: t.titleText }}>Active Flight Deals on Site</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {flights.map((item, idx) => (
                  <div key={item._id || idx} style={{ background: t.cardItemBg, borderRadius: '16px', overflow: 'hidden', border: `1px solid ${t.cardItemBorder}`, position: 'relative', boxShadow: t.shadow }}>
                    <div style={{ height: '140px', position: 'relative', overflow: 'hidden', background: t.bg }}>
                      <img 
                        src={item.image || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80'} 
                        alt={item.to} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                      <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.7rem', background: t.accent, color: 'white', padding: '0.2rem 0.55rem', borderRadius: '20px', fontWeight: 700 }}>
                          {item.type}
                        </span>
                        {item.tag && (
                          <span style={{ fontSize: '0.7rem', background: '#f59e0b', color: '#fff', padding: '0.2rem 0.55rem', borderRadius: '20px', fontWeight: 800 }}>
                            {item.tag}
                          </span>
                        )}
                      </div>

                      <button 
                        onClick={() => item._id && handleDeleteFlight(item._id)}
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          background: 'rgba(239, 68, 68, 0.9)',
                          color: '#ffffff',
                          border: 'none',
                          padding: '0.35rem 0.65rem',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          backdropFilter: 'blur(4px)',
                          transition: 'all 0.15s ease'
                        }}
                        title="Delete Card"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>

                    <div style={{ padding: '1.1rem' }}>
                      <div style={{ fontSize: '0.775rem', color: t.subText, fontWeight: 600 }}>{item.airline}</div>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: t.titleText, margin: '0.25rem 0' }}>
                        {item.from} → {item.to}
                      </div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: t.priceColor, marginTop: '0.6rem', borderTop: `1px dashed ${t.cardBorder}`, paddingTop: '0.5rem' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* Add Slide Form */}
            <div style={{ background: t.cardBg, padding: '1.75rem', borderRadius: '16px', border: `1px solid ${t.cardBorder}`, boxShadow: t.shadow }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: t.titleText, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={18} color={t.accent} /> Add New Hero Slide
              </h3>

              <form onSubmit={handleAddBanner} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: t.label }}>Slide Title *</label>
                  <input 
                    type="text" 
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Dubai Luxury Desert Safari"
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, marginTop: '0.35rem', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: t.label }}>Subtitle / Offer Description</label>
                  <input 
                    type="text" 
                    value={newSubtitle}
                    onChange={(e) => setNewSubtitle(e.target.value)}
                    placeholder="e.g. 5 Days 4 Nights starting from ৳45,000"
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, marginTop: '0.35rem', fontSize: '0.9rem' }}
                  />
                </div>

                {/* Direct Image Upload */}
                <ImageUploader 
                  value={newImageUrl}
                  onChange={setNewImageUrl}
                  label="Hero Banner Slide Image"
                  isDark={isDark}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: t.label }}>CTA Button Text</label>
                    <input 
                      type="text" 
                      value={newCtaText}
                      onChange={(e) => setNewCtaText(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, marginTop: '0.35rem', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: t.label }}>Badge Tag</label>
                    <input 
                      type="text" 
                      value={newBadge}
                      onChange={(e) => setNewBadge(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, marginTop: '0.35rem', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <button type="submit" style={{ marginTop: '0.5rem', width: '100%', padding: '0.85rem', borderRadius: '12px', background: t.accentGradient, color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', boxShadow: t.accentShadow }}>
                  <Save size={16} /> Save Slide to Database
                </button>
              </form>
            </div>

            {/* Slide List */}
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: t.titleText }}>Live Hero Slides</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {banners.map((item, idx) => (
                  <div key={item._id || idx} style={{ background: t.cardItemBg, borderRadius: '12px', overflow: 'hidden', border: `1px solid ${t.cardItemBorder}`, display: 'flex', gap: '1rem', padding: '1rem', alignItems: 'center', boxShadow: t.shadow }}>
                    <img src={item.imageUrl} alt={item.title} style={{ width: '100px', height: '70px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.75rem', color: t.accent, fontWeight: 700 }}>{item.badge || 'Slide ' + (idx + 1)}</div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: t.titleText }}>{item.title}</div>
                      <div style={{ fontSize: '0.8rem', color: t.subText }}>{item.subtitle}</div>
                    </div>

                    <button 
                      onClick={() => item._id && handleDeleteBanner(item._id)}
                      style={{ background: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2', color: '#ef4444', border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.3)' : '#fecaca'}`, padding: '0.35rem 0.65rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                      title="Delete Slide"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* LEADS TAB */}
        {activeTab === 'leads' && (
          <div style={{ background: t.cardBg, borderRadius: '16px', padding: '1.5rem', border: `1px solid ${t.cardBorder}`, boxShadow: t.shadow }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: t.titleText }}>Saved Lead Inquiries (MongoDB)</h3>
            
            {leads.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: t.subText }}>No customer inquiries saved yet.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${t.cardBorder}`, background: t.tableHeaderBg, color: t.accent }}>
                      <th style={{ padding: '0.75rem' }}>Customer</th>
                      <th style={{ padding: '0.75rem' }}>Phone</th>
                      <th style={{ padding: '0.75rem' }}>Category</th>
                      <th style={{ padding: '0.75rem' }}>Requested Package</th>
                      <th style={{ padding: '0.75rem' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead._id} style={{ borderBottom: `1px solid ${t.tableRowBorder}`, color: t.inputText }}>
                        <td style={{ padding: '0.75rem', fontWeight: 700 }}>{lead.customerName || 'Guest'}</td>
                        <td style={{ padding: '0.75rem', color: '#10b981', fontWeight: 600 }}>{lead.customerPhone || 'N/A'}</td>
                        <td style={{ padding: '0.75rem' }}>{lead.category}</td>
                        <td style={{ padding: '0.75rem' }}>{lead.title}</td>
                        <td style={{ padding: '0.75rem', color: t.subText }}>{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Today'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* REFERRALS TAB */}
        {activeTab === 'referrals' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
              
              {/* Add Referrer Form */}
              <div style={{ background: t.cardBg, padding: '1.5rem', borderRadius: '16px', border: `1px solid ${t.cardBorder}`, boxShadow: t.shadow }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: t.titleText, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Plus size={16} color={t.accent} /> Register Referral Partner
                </h3>

                <form onSubmit={handleAddReferrer} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: t.label }}>Partner Full Name *</label>
                    <input 
                      type="text" 
                      required
                      value={refName}
                      onChange={(e) => setRefName(e.target.value)}
                      placeholder="e.g. Abdur Rahim"
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, marginTop: '0.25rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: t.label }}>Phone / Mobile Number</label>
                    <input 
                      type="text" 
                      value={refPhone}
                      onChange={(e) => setRefPhone(e.target.value)}
                      placeholder="e.g. +880 1712-345678"
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, marginTop: '0.25rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: t.label }}>Commission Rate (%)</label>
                    <input 
                      type="number" 
                      step="0.5"
                      value={refRate}
                      onChange={(e) => setRefRate(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, marginTop: '0.25rem' }}
                    />
                  </div>

                  <button type="submit" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: t.accentGradient, color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', boxShadow: t.accentShadow }}>
                    <Plus size={16} /> Generate Referral Link
                  </button>
                </form>

                {createdRefCode && (
                  <div style={{ marginTop: '1rem', background: isDark ? 'rgba(59, 130, 246, 0.15)' : '#f0f9ff', border: `1px solid ${isDark ? 'rgba(59, 130, 246, 0.3)' : '#7dd3fc'}`, padding: '0.9rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.75rem', color: t.accent, fontWeight: 700 }}>PARTNER CREATED!</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: t.titleText }}>Code: {createdRefCode}</div>
                    <div style={{ fontSize: '0.775rem', color: t.subText, wordBreak: 'break-all', marginTop: '0.2rem' }}>
                      Link: {typeof window !== 'undefined' ? window.location.origin : ''}/?ref={createdRefCode}
                    </div>
                  </div>
                )}
              </div>

              {/* Log Conversion Form */}
              <div style={{ background: t.cardBg, padding: '1.5rem', borderRadius: '16px', border: `1px solid ${t.cardBorder}`, boxShadow: t.shadow }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: t.titleText, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <DollarSign size={16} color="#10b981" /> Log Conversion / Booking
                </h3>

                <form onSubmit={handleAddConversion} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: t.label }}>Referral Code *</label>
                    <input 
                      type="text" 
                      required
                      value={convRefCode}
                      onChange={(e) => setConvRefCode(e.target.value.toUpperCase())}
                      placeholder="e.g. RAHIM482"
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, marginTop: '0.25rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: t.label }}>Client / Passenger Name *</label>
                    <input 
                      type="text" 
                      required
                      value={convClientName}
                      onChange={(e) => setConvClientName(e.target.value)}
                      placeholder="e.g. Tanvir Hossain"
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, marginTop: '0.25rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: t.label }}>Booking Value (৳)</label>
                      <input 
                        type="number" 
                        value={convBookingValue}
                        onChange={(e) => setConvBookingValue(e.target.value)}
                        placeholder="e.g. 30000"
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, marginTop: '0.25rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: t.label }}>Commission (৳)</label>
                      <input 
                        type="number" 
                        value={convCommission}
                        onChange={(e) => setConvCommission(e.target.value)}
                        placeholder="e.g. 1500"
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, marginTop: '0.25rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: t.label }}>Note / Package Detail</label>
                    <input 
                      type="text" 
                      value={convNote}
                      onChange={(e) => setConvNote(e.target.value)}
                      placeholder="e.g. Dhaka to Bangkok Flight"
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, marginTop: '0.25rem' }}
                    />
                  </div>

                  <button type="submit" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#10b981', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)' }}>
                    <Save size={16} /> Save Conversion Booking
                  </button>
                </form>
              </div>

            </div>

            {/* Referrers Table */}
            <div style={{ background: t.cardBg, borderRadius: '16px', padding: '1.5rem', border: `1px solid ${t.cardBorder}`, boxShadow: t.shadow }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: t.titleText }}>Active Referral Partners ({referrers.length})</h3>
              
              {referrers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: t.subText }}>No referral partners registered yet.</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${t.cardBorder}`, background: t.tableHeaderBg, color: t.accent }}>
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
                        <tr key={ref._id || ref.refCode} style={{ borderBottom: `1px solid ${t.tableRowBorder}`, color: t.inputText }}>
                          <td style={{ padding: '0.75rem', fontWeight: 800, color: t.accent }}>{ref.refCode}</td>
                          <td style={{ padding: '0.75rem', fontWeight: 700 }}>{ref.name}</td>
                          <td style={{ padding: '0.75rem', color: t.subText }}>{ref.phone || 'N/A'}</td>
                          <td style={{ padding: '0.75rem' }}>{ref.commissionRate}%</td>
                          <td style={{ padding: '0.75rem', fontWeight: 700 }}>{ref.clicks || 0}</td>
                          <td style={{ padding: '0.75rem', fontWeight: 700, color: '#10b981' }}>{ref.conversions || 0}</td>
                          <td style={{ padding: '0.75rem', fontWeight: 700 }}>৳{(ref.totalCommission || 0).toLocaleString()}</td>
                          <td style={{ padding: '0.75rem', fontWeight: 700, color: '#f59e0b' }}>৳{(ref.unpaidCommission || 0).toLocaleString()}</td>
                          <td style={{ padding: '0.75rem', display: 'flex', gap: '0.4rem' }}>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/?ref=${ref.refCode}`);
                                showToast(`Copied referral link for ${ref.name}!`);
                              }}
                              style={{ background: t.inputBg, color: t.inputText, border: `1px solid ${t.inputBorder}`, padding: '0.35rem 0.6rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                            >
                              <Copy size={12} /> Link
                            </button>
                            <button
                              onClick={() => ref._id && handleDeleteReferrer(ref._id)}
                              style={{ background: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2', color: '#ef4444', border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.3)' : '#fecaca'}`, padding: '0.35rem 0.5rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                            >
                              <Trash2 size={12} /> Delete
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
            <div style={{ background: t.cardBg, borderRadius: '16px', padding: '1.5rem', border: `1px solid ${t.cardBorder}`, boxShadow: t.shadow }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: t.titleText }}>Recorded Conversions / Client Bookings ({conversions.length})</h3>
              
              {conversions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: t.subText }}>No referral conversions logged yet.</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${t.cardBorder}`, background: t.tableHeaderBg, color: t.accent }}>
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
                        <tr key={conv._id} style={{ borderBottom: `1px solid ${t.tableRowBorder}`, color: t.inputText }}>
                          <td style={{ padding: '0.75rem', fontWeight: 800, color: t.accent }}>{conv.refCode}</td>
                          <td style={{ padding: '0.75rem', fontWeight: 700 }}>{conv.clientName}</td>
                          <td style={{ padding: '0.75rem' }}>৳{conv.bookingValue.toLocaleString()}</td>
                          <td style={{ padding: '0.75rem', fontWeight: 800, color: '#10b981' }}>৳{conv.commissionAmount.toLocaleString()}</td>
                          <td style={{ padding: '0.75rem' }}>
                            <span style={{
                              background: conv.status === 'Paid' ? t.badgeGreenBg : t.badgeYellowBg,
                              color: conv.status === 'Paid' ? t.badgeGreenText : t.badgeYellowText,
                              border: `1px solid ${conv.status === 'Paid' ? t.badgeGreenBorder : t.badgeYellowBorder}`,
                              padding: '0.2rem 0.5rem',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              fontWeight: 700
                            }}>
                              {conv.status}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem', color: t.subText }}>{conv.note || 'N/A'}</td>
                          <td style={{ padding: '0.75rem' }}>
                            <button
                              onClick={() => conv._id && handleToggleConversionStatus(conv._id, conv.status)}
                              style={{
                                background: conv.status === 'Unpaid' ? '#10b981' : t.subText,
                                color: 'white',
                                border: 'none',
                                padding: '0.35rem 0.75rem',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: 700
                              }}
                            >
                              {conv.status === 'Unpaid' ? 'Mark Paid' : 'Mark Unpaid'}
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

        {/* TESTIMONIALS MANAGEMENT TAB */}
        {activeTab === 'testimonials' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* Form Column: Add New Testimonial */}
            <div style={{ background: t.cardBg, padding: '1.75rem', borderRadius: '16px', border: `1px solid ${t.cardBorder}`, boxShadow: t.shadow }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem', color: t.titleText, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={18} color={t.accent} /> Add New Traveler Testimonial
              </h3>
              <p style={{ fontSize: '0.85rem', color: t.subText, marginBottom: '1.25rem' }}>
                Add real customer reviews and testimonials to showcase on the homepage.
              </p>

              <form onSubmit={handleAddTestimonial} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: t.label, display: 'block', marginBottom: '0.4rem' }}>
                    Traveler Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={testimonialAuthor}
                    onChange={(e) => setTestimonialAuthor(e.target.value)}
                    placeholder="e.g. Tanvir Hossain"
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: t.label, display: 'block', marginBottom: '0.4rem' }}>
                    Traveler Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={testimonialLocation}
                    onChange={(e) => setTestimonialLocation(e.target.value)}
                    placeholder="e.g. Dhaka, Bangladesh"
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: t.label, display: 'block', marginBottom: '0.4rem' }}>
                    Star Rating (1 to 5) *
                  </label>
                  <select
                    value={testimonialStars}
                    onChange={(e) => setTestimonialStars(Number(e.target.value))}
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, fontSize: '0.9rem' }}
                  >
                    <option value={5}>5 Stars (★★★★★ - Excellent)</option>
                    <option value={4}>4 Stars (★★★★☆ - Very Good)</option>
                    <option value={3}>3 Stars (★★★☆☆ - Good)</option>
                    <option value={2}>2 Stars (★★☆☆☆ - Average)</option>
                    <option value={1}>1 Star (★☆☆☆☆ - Poor)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: t.label, display: 'block', marginBottom: '0.4rem' }}>
                    Customer Review / Quote *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={testimonialQuote}
                    onChange={(e) => setTestimonialQuote(e.target.value)}
                    placeholder="e.g. Booked our Cox's Bazar trip through Travelo — everything was sorted smoothly!"
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, fontSize: '0.9rem', resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.85rem 1.25rem',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: '#ffffff',
                    background: t.accentGradient,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: t.accentShadow,
                    marginTop: '0.5rem'
                  }}
                >
                  <Plus size={18} /> Publish Testimonial
                </button>
              </form>
            </div>

            {/* List Column: Manage & Delete Testimonials */}
            <div style={{ background: t.cardBg, padding: '1.75rem', borderRadius: '16px', border: `1px solid ${t.cardBorder}`, boxShadow: t.shadow }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem', color: t.titleText, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Star size={18} color="#f59e0b" /> Active Website Testimonials ({testimonials.length})
              </h3>
              <p style={{ fontSize: '0.85rem', color: t.subText, marginBottom: '1.25rem' }}>
                All traveler testimonials currently displayed on the main website homepage.
              </p>

              {testimonials.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: t.subText }}>
                  No testimonials found. Add your first customer review using the form!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {testimonials.map((item, idx) => (
                    <div
                      key={item._id || idx}
                      style={{
                        background: t.cardItemBg,
                        border: `1px solid ${t.cardItemBorder}`,
                        borderRadius: '12px',
                        padding: '1.25rem',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.2rem' }}>
                          {[1, 2, 3, 4, 5].slice(0, item.stars || 5).map((starNum) => (
                            <Star key={starNum} size={15} fill="#f59e0b" color="#f59e0b" />
                          ))}
                        </div>

                        {item._id && (
                          <button
                            onClick={() => handleDeleteTestimonial(item._id!)}
                            style={{
                              background: 'rgba(239, 68, 68, 0.12)',
                              color: '#ef4444',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              padding: '0.35rem 0.65rem',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              fontSize: '0.775rem',
                              fontWeight: 700
                            }}
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        )}
                      </div>

                      <p style={{ fontSize: '0.9rem', color: t.label, lineHeight: 1.5, marginBottom: '0.65rem', fontStyle: 'italic' }}>
                        &quot;{item.quote}&quot;
                      </p>

                      <div style={{ fontSize: '0.825rem', fontWeight: 700, color: t.accent }}>
                        — {item.author}, <span style={{ color: t.subText, fontWeight: 500 }}>{item.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* SETTINGS / WHATSAPP MANAGEMENT TAB */}
        {activeTab === 'settings' && (
          <div style={{ maxWidth: '650px', background: t.cardBg, padding: '2rem', borderRadius: '16px', border: `1px solid ${t.cardBorder}`, boxShadow: t.shadow }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.4rem', color: t.titleText, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={20} color={t.accent} /> Agency Phone & WhatsApp Numbers
            </h3>
            <p style={{ fontSize: '0.875rem', color: t.subText, marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Update your agency&apos;s contact numbers here. Any changes saved here will immediately update all &quot;Call Now&quot; and &quot;WhatsApp&quot; buttons across the website!
            </p>

            <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 700, color: t.label, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                  <MessageSquare size={16} color="#10b981" /> Agency WhatsApp Number
                </label>
                <input 
                  type="text" 
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="e.g. 01700000000"
                  style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, fontSize: '0.95rem', fontFamily: 'inherit' }}
                />
                <div style={{ fontSize: '0.8rem', color: t.accent, marginTop: '0.35rem', fontWeight: 500 }}>
                  Enter your 11-digit mobile number (e.g. 01700000000). The website formats it automatically for WhatsApp!
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 700, color: t.label, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                  <Phone size={16} color={t.accent} /> Agency Direct Call Phone Number
                </label>
                <input 
                  type="text" 
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. 01700000000"
                  style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, fontSize: '0.95rem', fontFamily: 'inherit' }}
                />
                <div style={{ fontSize: '0.8rem', color: t.subText, marginTop: '0.35rem' }}>
                  This number is dialed when visitors tap &quot;Call Now&quot; on mobile phones.
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 700, color: t.label, display: 'block', marginBottom: '0.4rem' }}>
                  Agency Email Address
                </label>
                <input 
                  type="email" 
                  value={agencyEmail}
                  onChange={(e) => setAgencyEmail(e.target.value)}
                  placeholder="contact@travelo.com"
                  style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, fontSize: '0.95rem', fontFamily: 'inherit' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 700, color: t.label, display: 'block', marginBottom: '0.4rem' }}>
                  Office Address
                </label>
                <input 
                  type="text" 
                  value={agencyAddress}
                  onChange={(e) => setAgencyAddress(e.target.value)}
                  placeholder="Dhaka, Bangladesh"
                  style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, fontSize: '0.95rem', fontFamily: 'inherit' }}
                />
              </div>

              <button 
                type="submit" 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 1.5rem',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: '#ffffff',
                  background: '#10b981',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                  marginTop: '0.5rem',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s ease'
                }}
              >
                <Save size={18} /> Save Contact Numbers
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
