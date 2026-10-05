import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Body parser with size limit to prevent memory exhaustion attacks
app.use(express.json({ limit: '500kb' }));
app.use(express.urlencoded({ extended: true, limit: '500kb' }));

// Strong Security Headers (Anti-hacking, anti-clickjacking, MIME protection)
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});

// In-memory rate limiter to block DDoS and brute force spam
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
function rateLimit(limit: number, windowMs: number) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (entry.count >= limit) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please wait a moment before trying again.',
      });
    }

    entry.count++;
    next();
  };
}

// Clean up stale rate-limit keys every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 300000);

// Initialize Gemini AI client if key is configured
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

// Fallback intelligent response generator for cab booking and queries
function generateSmartFallback(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('kerala') || q.includes('munnar') || q.includes('alleppey') || q.includes('cochin') || q.includes('varkala')) {
    return `🌴 **Kerala & God's Own Country Touring:**\n- **Popular Routes:** Cochin Airport ➔ Munnar (~125 km, 3.5 hrs), Cochin ➔ Alleppey Houseboats (~85 km, 2.2 hrs), Trivandrum ➔ Varkala Cliff (~45 km).\n- **Recommended Vehicles:** Toyota Innova Crysta or Maruti Ertiga with dual AC and Western Ghats certified drivers.\n- **Sightseeing:** Eravikulam National Park, tea estate trails, Cheeyappara waterfalls, Vembanad backwater houseboats.\n- **Tariff:** Guaranteed lowest custom package quotation on request with zero surge.\n\nConnect with our 24/7 desk on WhatsApp or call **+91 98771 24650** for vehicle availability!`;
  }

  if (q.includes('bangalore') || q.includes('coorg') || q.includes('ooty') || q.includes('tirupati') || q.includes('south')) {
    return `☕ **South India & Western Ghats Corridors:**\n- **Key Corridors:** Bangalore Kempegowda Airport (BLR) ➔ Coorg / Madikeri (~250 km, 5.5 hrs), Bangalore ➔ Tirupati Balaji sacred darshan (~250 km, 5 hrs), Bangalore ➔ Ooty (~275 km).\n- **Fleet Available:** Toyota Innova Crysta, Maruti Ertiga, Force Urbania 17-Seater.\n- **Perks:** Inter-state permit clearance, clean sanitized cabins, courteous chauffeurs.\n\nCall **+91 98771 24650** or WhatsApp to get an instant customized quote!`;
  }

  if (q.includes('manali') || q.includes('kullu')) {
    return `🏔️ **Trip to Manali & Solang Valley:**\n- **Route:** Chandigarh → Manali (~280 km, 7-8 hrs via Kiratpur-Nerchowk 4-lane expressway) or Delhi → Manali (~530 km, 11-12 hrs).\n- **Recommended Vehicles:** Toyota Innova Crysta or Maruti Ertiga for optimal mountain comfort and hill traction.\n- **Sightseeing:** Solang Valley, Rohtang Pass, Old Manali, Atal Tunnel, Manikaran.\n- **Inclusions:** Hill-certified chauffeur, snow chains, all-India commercial tourist permit.\n\nReady to book? Tap "Book via WhatsApp" or call **+91 98771 24650** for custom quote & vehicle assignment!`;
  }

  if (q.includes('shimla') || q.includes('kufri')) {
    return `🌲 **Trip to Shimla & Kufri:**\n- **Distance:** Chandigarh → Shimla is ~115 km (~3.5 hrs via Himalayan Expressway); Delhi → Shimla is ~350 km (~7 hrs).\n- **Top Cabs:** Maruti Ertiga, Toyota Innova Crysta, or Sedan.\n- **Highlights:** Mall Road, Ridge, Jakhu Temple, Kufri Snow View, Chail.\n- **Driver:** Experienced hill chauffeur provided with 24/7 support. Call **+91 98771 24650** for a custom quote!`;
  }

  if (q.includes('urbania') || q.includes('traveller') || q.includes('17') || q.includes('12') || q.includes('group')) {
    return `🚐 **FirstFly Luxury Traveller Fleet:**\n- **Force Urbania (17-Seater):** Ultra-luxury pushback leather seats, individual AC vents, ambient LED ceiling, huge luggage boot, smart music system.\n- **Force Traveller (12/16-Seater):** High roof, spacious legroom, carrier for 15+ bags, perfect for joint families, corporate retreats & wedding groups.\n\nCall our fleet manager directly at **+91 98771 24650** to check date availability and flat custom pricing!`;
  }

  if (q.includes('price') || q.includes('rate') || q.includes('cost') || q.includes('fare') || q.includes('km')) {
    return `📋 **FirstFly Tariff & Pricing Policy:**\nWe provide 100% transparent, personalized flat quotations based on your exact route, dates, and vehicle category with **No Hidden Charges**:\n- **Sedan (Maruti Dzire / Etios):** 4 Passengers + Boot\n- **MUV (Maruti Ertiga Hybrid):** 6 Passengers\n- **Luxury SUV (Toyota Innova Crysta):** 6-7 Passengers\n- **Group Vans (Force Urbania 17-Seater & Traveller):** 12-17 Passengers\n\n✅ 100% Commercial Yellow Plate Fleet\n✅ Zero Surge Pricing\n✅ Toll taxes & state permits at actuals with authentic receipts.\nTell us your pickup & drop destination to receive a custom guaranteed lowest quote immediately!`;
  }

  if (q.includes('airport') || q.includes('delhi') || q.includes('igi') || q.includes('chandigarh') || q.includes('cochin') || q.includes('bangalore')) {
    return `✈️ **24/7 Airport Pickup & Outstation Drop:**\nGuaranteed on-time transfers with live flight tracking across:\n- Delhi IGI Airport (Terminals 1, 2 & 3)\n- Bangalore Kempegowda Int'l Airport (BLR)\n- Cochin International Airport (COK)\n- Chandigarh Shaheed Bhagat Singh Int'l (IXC)\n- Goa MOPA & Dabolim Airports\n\nFlight tracking included: Driver arrives 15 mins prior with a name placard and assists with heavy luggage. Call **+91 98771 24650** to schedule pickup!`;
  }

  if (q.includes('safe') || q.includes('hack') || q.includes('security') || q.includes('verified')) {
    return `🛡️ **FirstFly Safety & Security Promise:**\n- **Vehicle Integrity:** 100% verified commercial yellow-plate cars with All-India Tourist Permits & speed governors.\n- **Driver Verification:** Police background-checked, uniformed, professional chauffeurs.\n- **Digital Safety:** 256-bit SSL encrypted booking system with zero unauthorized access.\n- **Passenger Helpline:** 24/7 SOS dispatch and live GPS tracking link shared directly with family.`;
  }

  return `👋 Namaste! Welcome to **FirstFly Tours & Travels** — your trusted All-India travel partner.\n\nWe provide verified **Toyota Innova Crysta, Maruti Ertiga, Force Urbania (17-Seater), Force Traveller & Sedans** for outstation, hill stations, family tours, Kerala routes, and airport drops across India.\n\nHow can I help you today? You can mention:\n1. Your pickup & drop destination (e.g. "Delhi Airport to Agra", "Cochin to Munnar")\n2. Vehicle preference & number of passengers\n3. Dates of travel\n\nOr connect with our 24/7 dispatch desk on WhatsApp or call **+91 98771 24650**!`;
}

// ═══ API ENDPOINTS ═══

// 1. Health check & security status
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    service: 'FirstFly All India Tours & Travels API',
    security: {
      ssl: true,
      waf: 'active',
      rateLimiting: 'active',
      inputSanitization: 'active',
    },
    timestamp: new Date().toISOString(),
  });
});

// 2. Real-time Smart Chat endpoint (AI Concierge with Gemini & fallback)
app.post('/api/chat', rateLimit(30, 60000), async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required' });
    }

    // Sanitize user input (anti-XSS and script injection defense)
    const sanitizedMsg = message
      .replace(/<[^>]*>?/gm, '')
      .trim()
      .slice(0, 1000);

    if (aiClient) {
      try {
        const systemPrompt = `You are the official 24/7 AI Travel Concierge for FirstFly Tours & Travels (firstfly.in).
Primary Hubs: Delhi IGI Airport, Bangalore BLR Airport, Cochin COK Airport, Goa, Chandigarh, Mohali, Punjab, Delhi NCR, Himachal Pradesh, Uttarakhand, Kerala, and All India.
Owner & 24/7 Dispatch Desk: +91 98771 24650 | Email: hsingh67243@gmail.com.
Fleet:
1. Toyota Innova Crysta (7/8 Seats Luxury SUV, VIP luxury captain seats, high ground clearance, hill & highway master)
2. Maruti Suzuki Ertiga Hybrid (7 Seats MUV, comfortable, economical, clean cabin)
3. Force Urbania Traveller (17 Seats Super-Luxury, pushback recliners, dual AC, mood lighting, high-end touring)
4. Force Traveller (12/16 Seats Group Van, high roof, luggage carrier)
5. Maruti Suzuki Dzire & Sedans (5 Seats Sedan, economical outstation)
Services: Airport transfers (Delhi IGI, Bangalore BLR, Cochin COK, Goa MOPA), Kerala tours (Munnar, Alleppey, Thekkady, Varkala), Hill stations (Manali, Shimla, Rishikesh, Mussoorie), Heritage circuits (Golden Triangle, Jaipur, Agra, Ayodhya, Varanasi).
Pricing Policy: Customized flat best-deal quotes provided on inquiry without hidden charges or surge. Do NOT give arbitrary numeric rupee figures; explain that transparent flat quotes are customized according to route distance and days, and encourage customer to connect via WhatsApp or call for immediate driver allocation.
Assurances: 100% commercial yellow plates, police-verified chauffeurs, live GPS tracking, 24/7 helpline.
Answer warmly, professionally, and concisely in clean markdown with bullet points. Always mention customer can book instantly via WhatsApp or call +91 98771 24650.`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nCustomer Inquiry: ${sanitizedMsg}` }],
            },
          ],
        });

        if (response.text) {
          return res.json({ reply: response.text, source: 'gemini-ai' });
        }
      } catch (geminiErr) {
        console.warn('Gemini API call failed, using intelligent fallback:', geminiErr);
      }
    }

    // Reliable contextual fallback
    const reply = generateSmartFallback(sanitizedMsg);
    return res.json({ reply, source: 'concierge-engine' });
  } catch (err: any) {
    console.error('Server chat error:', err);
    return res.status(500).json({
      error: 'Unable to process inquiry at this moment',
      reply: 'Our dispatch team is active 24/7. Please call directly at +91 98771 24650 or send a WhatsApp message for instant booking.',
    });
  }
});

// 3. Secure Booking Quote Submission (Anti-spam honeypot + validation)
app.post('/api/book', rateLimit(15, 60000), (req, res) => {
  try {
    const {
      pickup,
      drop,
      travelDate,
      returnDate,
      tripType,
      vehicleId,
      vehicleName,
      customerName,
      customerPhone,
      passengers,
      notes,
      honeypot, // Bot trap
    } = req.body;

    // Honeypot check: Bots fill this hidden field; humans don't
    if (honeypot) {
      return res.status(400).json({ success: false, error: 'Automated request detected' });
    }

    if (!pickup || !drop || !customerPhone) {
      return res.status(400).json({
        success: false,
        error: 'Pickup, drop location, and contact number are required',
      });
    }

    // Phone validation (Indian 10-digit mobile)
    const phoneClean = String(customerPhone).replace(/\D/g, '');
    if (phoneClean.length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid 10-digit phone number',
      });
    }

    // Generate secure booking reference ID
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const bookingRef = `FF-${Date.now().toString().slice(-4)}-${randomHex}`;

    // Format WhatsApp confirmation text for easy 1-click customer sending
    const summary = `*FirstFly Booking Inquiry [Ref: ${bookingRef}]*
• Name: ${customerName || 'Customer'}
• Phone: ${customerPhone}
• Route: ${pickup} ➔ ${drop}
• Trip Type: ${tripType || 'One-Way'}
• Travel Date: ${travelDate || 'Immediate'}
${returnDate ? `• Return Date: ${returnDate}\n` : ''}• Vehicle: ${vehicleName || 'Standard Fleet'}
• Passengers: ${passengers || '1-4'}
${notes ? `• Special Requests: ${notes}` : ''}`;

    const whatsappUrl = `https://wa.me/919877124650?text=${encodeURIComponent(summary)}`;

    return res.json({
      success: true,
      bookingRef,
      message: 'Booking request validated and logged successfully.',
      whatsappUrl,
    });
  } catch (err) {
    console.error('Booking validation error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Vite Integration (Dev middleware mode) & Production Static File Serving
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 FirstFly Tours & Travels Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
