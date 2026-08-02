import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { LeadModel } from './models/Lead';
import { ReferrerModel, ReferralClickModel, ReferralConversionModel } from './models/Referral';
import { BannerModel } from './models/Banner';
import { FlightModel } from './models/Flight';
import { VisaModel } from './models/Visa';
import { PackageModel } from './models/Package';
import { SettingModel } from './models/Setting';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

const isDbConnected = () => mongoose.connection.readyState === 1;

// Connect to MongoDB
if (MONGODB_URI) {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log('✅ Successfully connected to MongoDB Atlas!');
    })
    .catch((err) => {
      console.error('❌ MongoDB Connection Error:', err.message);
    });
} else {
  console.warn('⚠️ MONGODB_URI is not set in .env file. Server running in disconnected demo mode.');
}

// 1. Health check & DB status
app.get('/api/health', (req, res) => {
  const connected = isDbConnected();
  res.json({
    status: 'online',
    dbConnected: connected,
    message: connected
      ? 'Connected to MongoDB Atlas'
      : 'MongoDB connecting or error. Please check MONGODB_URI & IP Access List in Atlas.'
  });
});

// 2. Settings & WhatsApp Numbers CRUD
app.get('/api/settings', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json({
        success: true,
        settings: {
          whatsappNumber: '8801700000000',
          phoneNumber: '8801700000000',
          agencyEmail: 'contact@travelo.com',
          agencyAddress: 'Dhaka, Bangladesh'
        }
      });
    }

    let settings = await SettingModel.findOne();
    if (!settings) {
      settings = new SettingModel({
        whatsappNumber: '8801700000000',
        phoneNumber: '8801700000000',
        agencyEmail: 'contact@travelo.com',
        agencyAddress: 'Dhaka, Bangladesh'
      });
      await settings.save();
    }

    return res.json({ success: true, settings });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    const { whatsappNumber, phoneNumber, agencyEmail, agencyAddress } = req.body;

    if (!isDbConnected()) {
      return res.json({
        success: true,
        message: 'Settings updated in demo mode',
        settings: { whatsappNumber, phoneNumber, agencyEmail, agencyAddress }
      });
    }

    let settings = await SettingModel.findOne();
    if (settings) {
      if (whatsappNumber) settings.whatsappNumber = whatsappNumber;
      if (phoneNumber) settings.phoneNumber = phoneNumber;
      if (agencyEmail) settings.agencyEmail = agencyEmail;
      if (agencyAddress) settings.agencyAddress = agencyAddress;
      settings.updatedAt = new Date();
      await settings.save();
    } else {
      settings = new SettingModel({
        whatsappNumber: whatsappNumber || '8801700000000',
        phoneNumber: phoneNumber || '8801700000000',
        agencyEmail: agencyEmail || 'contact@travelo.com',
        agencyAddress: agencyAddress || 'Dhaka, Bangladesh'
      });
      await settings.save();
    }

    return res.json({ success: true, settings, message: 'Settings saved successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Leads Endpoints
app.post('/api/leads', async (req, res) => {
  try {
    const { title, category, priceEstimate, customerName, customerPhone, notes } = req.body;
    
    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        message: 'Lead received (Demo mode - MongoDB not connected yet)',
        lead: { title, category, priceEstimate, customerName, customerPhone, notes }
      });
    }

    const newLead = new LeadModel({
      title,
      category,
      priceEstimate,
      customerName,
      customerPhone,
      notes
    });

    await newLead.save();
    return res.status(201).json({ success: true, lead: newLead });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/leads', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json({ success: true, leads: [] });
    }
    const leads = await LeadModel.find().sort({ createdAt: -1 });
    return res.json({ success: true, leads });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Referral System Endpoints
app.post('/api/referrals/add-referrer', async (req, res) => {
  try {
    const { name, phone, commissionRate } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }

    const base = name.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 8) || 'REF';
    const refCode = base + Math.floor(100 + Math.random() * 900);
    const rate = parseFloat(commissionRate) || 5.0;

    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        refCode,
        referrer: { name, phone, refCode, commissionRate: rate }
      });
    }

    const referrer = new ReferrerModel({
      name,
      phone: phone || '',
      refCode,
      commissionRate: rate
    });

    await referrer.save();
    return res.status(201).json({ success: true, refCode, referrer });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/referrals/get-all', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json({
        success: true,
        referrers: [
          { _id: 'demo-1', refCode: 'RAHIM482', name: 'Abdur Rahim', phone: '+8801700000000', commissionRate: 5, clicks: 24, conversions: 3, totalCommission: 4500, unpaidCommission: 1500 }
        ],
        conversions: [
          { _id: 'conv-1', refCode: 'RAHIM482', clientName: 'Tanvir Hossain', bookingValue: 30000, commissionAmount: 1500, status: 'Unpaid', note: 'Dhaka to Bangkok flight' }
        ]
      });
    }

    const referrersList = await ReferrerModel.find().sort({ createdAt: -1 });
    const referrersWithStats = await Promise.all(
      referrersList.map(async (ref) => {
        const clicks = await ReferralClickModel.countDocuments({ refCode: ref.refCode });
        const conversions = await ReferralConversionModel.find({ refCode: ref.refCode });
        const conversionsCount = conversions.length;
        const totalCommission = conversions.reduce((sum, c) => sum + (c.commissionAmount || 0), 0);
        const unpaidCommission = conversions
          .filter((c) => c.status === 'Unpaid')
          .reduce((sum, c) => sum + (c.commissionAmount || 0), 0);

        return {
          ...ref.toObject(),
          clicks,
          conversions: conversionsCount,
          totalCommission,
          unpaidCommission
        };
      })
    );

    const conversionsList = await ReferralConversionModel.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      referrers: referrersWithStats,
      conversions: conversionsList
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/referrals/track-click', async (req, res) => {
  try {
    const { refCode } = req.body;
    if (!refCode) {
      return res.status(400).json({ success: false, error: 'refCode is required' });
    }

    if (!isDbConnected()) {
      return res.json({ success: true, logged: true });
    }

    const referrer = await ReferrerModel.findOne({ refCode: refCode.trim() });
    if (!referrer) {
      return res.json({ success: true, logged: false, message: 'Invalid refCode' });
    }

    const click = new ReferralClickModel({ refCode: refCode.trim() });
    await click.save();

    return res.json({ success: true, logged: true });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/referrals/add-conversion', async (req, res) => {
  try {
    const { refCode, clientName, bookingValue, commissionAmount, note } = req.body;
    if (!refCode || !clientName) {
      return res.status(400).json({ success: false, error: 'refCode and clientName are required' });
    }

    if (!isDbConnected()) {
      return res.json({ success: true, message: 'Conversion logged in demo mode' });
    }

    const conversion = new ReferralConversionModel({
      refCode,
      clientName,
      bookingValue: Number(bookingValue) || 0,
      commissionAmount: Number(commissionAmount) || 0,
      note: note || '',
      status: 'Unpaid'
    });

    await conversion.save();
    return res.status(201).json({ success: true, conversion });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/referrals/update-conversion/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, error: 'Status is required' });
    }

    if (!isDbConnected()) {
      return res.json({ success: true, message: 'Updated in demo mode' });
    }

    const updated = await ReferralConversionModel.findByIdAndUpdate(req.params.id, { status }, { new: true });
    return res.json({ success: true, conversion: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/referrals/referrer/:id', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json({ success: true, message: 'Deleted in demo mode' });
    }
    await ReferrerModel.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Referrer deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Banner Slide Endpoints
const DEFAULT_BANNERS = [
  {
    _id: 'default-1',
    title: "Explore Cox's Bazar Beach Getaways",
    subtitle: 'Direct Flight Ticket + 4-Star Resort Stay starting from ৳8,900',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
    ctaText: 'Inquire Cox\'s Bazar',
    badge: 'Popular Destination',
    order: 1,
    active: true
  },
  {
    _id: 'default-2',
    title: 'Bangkok & Pattaya Tropical Escape',
    subtitle: 'Exclusive 5D4N Packages with Express Visa Assistance & Transfers',
    imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1600&q=80',
    ctaText: 'Inquire Thailand',
    badge: 'Best International Deal',
    order: 2,
    active: true
  },
  {
    _id: 'default-3',
    title: 'Holy Umrah & Saudi Arabia Packages',
    subtitle: 'Guaranteed Discounted Airline Fares, Visa Processing & Hotel Stay',
    imageUrl: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1600&q=80',
    ctaText: 'Inquire Umrah',
    badge: 'Umrah Special',
    order: 3,
    active: true
  }
];

app.get('/api/banners', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json({ success: true, banners: DEFAULT_BANNERS });
    }
    let banners = await BannerModel.find({ active: true }).sort({ order: 1 });
    if (banners.length === 0) {
      banners = await BannerModel.insertMany(DEFAULT_BANNERS.map(({ _id, ...rest }) => rest));
    }
    return res.json({ success: true, banners });
  } catch (error: any) {
    return res.json({ success: true, banners: DEFAULT_BANNERS });
  }
});

app.post('/api/banners', async (req, res) => {
  try {
    const { title, subtitle, imageUrl, ctaText, badge, order, active } = req.body;
    if (!isDbConnected()) {
      return res.status(200).json({ success: true, banner: { _id: Date.now().toString(), title, subtitle, imageUrl, ctaText, badge, order: order || 1, active: active ?? true } });
    }
    const banner = new BannerModel({ title, subtitle, imageUrl, ctaText, badge, order, active });
    await banner.save();
    return res.status(201).json({ success: true, banner });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/banners/:id', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json({ success: true, message: 'Deleted in demo mode' });
    }
    await BannerModel.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Banner deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Flight Deals Endpoints
const DEFAULT_FLIGHTS = [
  { _id: 'def-1', from: 'Dhaka (DAC)', to: "Cox's Bazar (CXB)", type: 'Domestic', airline: 'US-Bangla / Biman', priceEstimate: '৳4,200', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80', tag: 'Best Seller' },
  { _id: 'def-2', from: 'Dhaka (DAC)', to: 'Bangkok (BKK)', type: 'International', airline: 'Thai Airways / US-Bangla', priceEstimate: '৳28,500', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80', tag: 'Popular Route' },
  { _id: 'def-3', from: 'Dhaka (DAC)', to: 'Kuala Lumpur (KUL)', type: 'International', airline: 'Biman Bangladesh / AirAsia', priceEstimate: '৳32,000', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=600&q=80' },
  { _id: 'def-4', from: 'Dhaka (DAC)', to: 'Jeddah (JED) - Umrah', type: 'International', airline: 'Saudi Arabian / Biman', priceEstimate: '৳68,000', image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=600&q=80', tag: 'Umrah Special' },
  { _id: 'def-5', from: 'Dhaka (DAC)', to: 'Dubai (DXB)', type: 'International', airline: 'Emirates / FlyDubai', priceEstimate: '৳45,000', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80' },
  { _id: 'def-6', from: 'Dhaka (DAC)', to: 'Sylhet (ZYL)', type: 'Domestic', airline: 'Air Astra / Novoair', priceEstimate: '৳3,800', image: 'https://images.unsplash.com/photo-1586375100100-33433e215d2a?auto=format&fit=crop&w=600&q=80' }
];

app.get('/api/flights', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json({ success: true, flights: DEFAULT_FLIGHTS });
    }
    let flights = await FlightModel.find().sort({ createdAt: -1 });
    if (flights.length === 0) {
      flights = await FlightModel.insertMany(DEFAULT_FLIGHTS.map(({ _id, ...rest }) => rest));
    }
    return res.json({ success: true, flights });
  } catch (error: any) {
    return res.json({ success: true, flights: DEFAULT_FLIGHTS });
  }
});

app.post('/api/flights', async (req, res) => {
  try {
    const { from, to, type, airline, priceEstimate, image, tag } = req.body;
    if (!isDbConnected()) {
      return res.status(200).json({ success: true, flight: { _id: Date.now().toString(), from, to, type, airline, priceEstimate, image, tag } });
    }
    const flight = new FlightModel({ from, to, type, airline, priceEstimate, image, tag });
    await flight.save();
    return res.status(201).json({ success: true, flight });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/flights/:id', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json({ success: true, message: 'Deleted in demo mode' });
    }
    await FlightModel.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Flight deal deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 6. Visa Services Endpoints
const DEFAULT_VISAS = [
  { _id: 'v1', country: 'Thailand', flag: '🇹🇭', processingTime: '3-5 Working Days', requirements: ['Passport', '2 Photo 35x45mm', '6 Month Bank Statement (Min 60k BDT)', 'NID Copy'], price: '৳5,500', popular: true },
  { _id: 'v2', country: 'Malaysia (e-Visa)', flag: '🇲🇾', processingTime: '2-3 Working Days', requirements: ['Passport Scan', 'White Background Photo', 'Flight Reservation'], price: '৳4,800', popular: true },
  { _id: 'v3', country: 'Saudi Arabia (Umrah/Tourist)', flag: '🇸🇦', processingTime: '24-48 Hours', requirements: ['Original Passport', 'Bio Photo', 'Vaccine Certificate'], price: '৳14,500', popular: true },
  { _id: 'v4', country: 'UAE / Dubai (30 Days)', flag: '🇦🇪', processingTime: '2 Working Days', requirements: ['Passport Color Scan', 'Photo', 'Guarantor NID'], price: '৳11,000', popular: false },
  { _id: 'v5', country: 'Singapore', flag: '🇸🇬', processingTime: '4-6 Working Days', requirements: ['Invitation Letter / Hotel Booking', 'Bank Statement', 'Company NOC'], price: '৳6,200', popular: false },
  { _id: 'v6', country: 'United Kingdom (Consultancy)', flag: '🇬🇧', processingTime: '15-20 Days', requirements: ['Full Profile Evaluation', 'Asset Documentation', 'Sponsorship Letter'], price: '৳15,000', popular: false }
];

app.get('/api/visas', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json({ success: true, visas: DEFAULT_VISAS });
    }
    let visas = await VisaModel.find().sort({ createdAt: -1 });
    if (visas.length === 0) {
      visas = await VisaModel.insertMany(DEFAULT_VISAS.map(({ _id, ...rest }) => rest));
    }
    return res.json({ success: true, visas });
  } catch (error: any) {
    return res.json({ success: true, visas: DEFAULT_VISAS });
  }
});

app.post('/api/visas', async (req, res) => {
  try {
    const { country, flag, processingTime, requirements, price, popular } = req.body;
    if (!isDbConnected()) {
      return res.status(200).json({ success: true, visa: { _id: Date.now().toString(), country, flag, processingTime, requirements, price, popular } });
    }
    const visa = new VisaModel({ country, flag: flag || '🌐', processingTime, requirements: Array.isArray(requirements) ? requirements : [], price, popular: !!popular });
    await visa.save();
    return res.status(201).json({ success: true, visa });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/visas/:id', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json({ success: true, message: 'Deleted in demo mode' });
    }
    await VisaModel.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Visa card deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 7. Tour Packages Endpoints
const DEFAULT_PACKAGES = [
  { _id: 'p1', title: 'Sajek Valley Cloud Kingdom Escape', destination: 'Sajek Valley, Rangamati', duration: '3 Days 2 Nights', price: '৳7,500 / person', image: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=600&q=80', highlights: ['Resort Stay', 'Helipad Sunrise View', 'Konglak Pahar Trek', 'Chander Gari Transport'] },
  { _id: 'p2', title: "Cox's Bazar Beach Luxury Getaway", destination: "Cox's Bazar", duration: '3 Days 2 Nights', price: '৳8,900 / person', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80', highlights: ['4-Star Beachfront Hotel', 'Inani Beach Tour', 'Complimentary Breakfast', 'Private Airport Transfers'] },
  { _id: 'p3', title: 'Bangkok & Pattaya Tropical Fiesta', destination: 'Thailand', duration: '5 Days 4 Nights', price: '৳42,000 / person', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80', highlights: ['Coral Island Speedboat Tour', 'Bangkok City Tour', 'Daily Breakfast', 'Visa Assistance Included'] },
  { _id: 'p4', title: 'Sundarbans Wild Mangrove Expedition', destination: 'Sundarbans, Khulna', duration: '3 Days 2 Nights', price: '৳12,500 / person', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80', highlights: ['AC Cruise Vessel Stay', 'Forest Guard Security', 'Kotka Beach Visit', 'All Meal Buffet Included'] }
];

app.get('/api/packages', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json({ success: true, packages: DEFAULT_PACKAGES });
    }
    let packages = await PackageModel.find().sort({ createdAt: -1 });
    if (packages.length === 0) {
      packages = await PackageModel.insertMany(DEFAULT_PACKAGES.map(({ _id, ...rest }) => rest));
    }
    return res.json({ success: true, packages });
  } catch (error: any) {
    return res.json({ success: true, packages: DEFAULT_PACKAGES });
  }
});

app.post('/api/packages', async (req, res) => {
  try {
    const { title, destination, duration, price, image, highlights } = req.body;
    if (!isDbConnected()) {
      return res.status(200).json({ success: true, package: { _id: Date.now().toString(), title, destination, duration, price, image, highlights } });
    }
    const pkg = new PackageModel({ title, destination, duration, price, image, highlights: Array.isArray(highlights) ? highlights : [] });
    await pkg.save();
    return res.status(201).json({ success: true, package: pkg });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/packages/:id', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json({ success: true, message: 'Deleted in demo mode' });
    }
    await PackageModel.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Package deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Travelo Backend Server running on http://localhost:${PORT}`);
  });
}

export default app;
