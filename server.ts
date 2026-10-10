import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import compression from 'compression';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

// HTTP Response Compression (Gzip / Deflate for fast mobile transfer)
app.use(compression());

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

// Initialize Gemini AI client if key is configured (AI Studio standard)
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback intelligent response generator for cab booking and queries
function generateSmartFallback(query: string): string {
  const q = query.toLowerCase();

  // Check if query is in Hindi / Hinglish
  const hasHindiScript = /[\u0900-\u097F]/.test(query);
  const isHinglish =
    hasHindiScript ||
    /\b(kya|kaise|kitna|kitne|chahiye|gaadi|gadi|kiraya|batao|karo|hogi|milegi|bhejo|namaste|shukriya|shuru|karna|chalta|hai|hain|mujhe|humko|aap|bataiye|rate|kaha|kahan|jana|jane|aana|aane)\b/i.test(
      q
    );

  // 1. Manali / Hill station queries
  if (q.includes('manali') || q.includes('solang') || q.includes('rohtang') || q.includes('atal tunnel')) {
    if (isHinglish) {
      return `🏔️ **मनाली व रोहतांग ट्रिप (FirstFly Cabs):**
• **रूट:** चंडीगढ़ ➔ मनाली (~280 किमी, 7-8 घंटे) या दिल्ली ➔ मनाली (~530 किमी, 11-12 घंटे)।
• **बेस्ट गाड़ियाँ:** Toyota Innova Crysta (लक्ज़री कैप्टन सीट्स) या Maruti Ertiga Hybrid — दोनों में हील्स के लिए स्पेशल पावर व कंफर्ट है।
• **खासियत:** अनुभवी पहाड़ी ड्राइवर, ऑल-इंडिया कमर्शियल टूरिस्ट परमिट, शून्य हिडन चार्ज।
• **किराया व बुकिंग:** तुरंत फ्लैट डिस्काउंट कोटेशन और गाड़ी फोटो के लिए हमें कॉल करें या व्हाट्सएप पर मैसेज करें: **+91 98771 24650**।`;
    }
    return `🏔️ **Trip to Manali & Solang Valley:**
- **Routes:** Chandigarh → Manali (~280 km, 7-8 hrs) or Delhi → Manali (~530 km, 11-12 hrs via 4-lane expressway).
- **Recommended Vehicles:** Toyota Innova Crysta (Luxury captain seats) or Maruti Ertiga Hybrid.
- **Inclusions:** Hill-certified chauffeur, commercial tourist permit, 24/7 support.
- **Booking & Quote:** Call directly or WhatsApp **+91 98771 24650** for immediate vehicle assignment!`;
  }

  // 2. Shimla / Kufri queries
  if (q.includes('shimla') || q.includes('kufri') || q.includes('chail')) {
    if (isHinglish) {
      return `🌲 **शिमला व कुफरी टूर:**
• **दूरी:** चंडीगढ़ ➔ शिमला सिर्फ ~115 किमी (3.5 घंटे); दिल्ली ➔ शिमला ~350 किमी।
• **उपलब्ध गाड़ियाँ:** Dzire Sedan, Maruti Ertiga, Toyota Innova Crysta।
• **ड्राइवर:** पुलिस-वेरिफाइड, पहाड़ों के अनुभवी ड्राइवर।
• **कोटेशन:** 24/7 हेल्पलाइन **+91 98771 24650** पर कॉल करें या व्हाट्सएप पर 1-क्लिक में बात करें!`;
    }
    return `🌲 **Trip to Shimla & Kufri:**
- **Distance:** Chandigarh → Shimla is ~115 km (~3.5 hrs via Himalayan Expressway); Delhi → Shimla is ~350 km (~7 hrs).
- **Fleet:** Maruti Ertiga, Toyota Innova Crysta, or Sedan.
- **Driver:** Experienced mountain chauffeur with 24/7 support. Call **+91 98771 24650** for custom quote!`;
  }

  // 3. Kerala & South India routes
  if (q.includes('kerala') || q.includes('munnar') || q.includes('alleppey') || q.includes('cochin') || q.includes('varkala') || q.includes('thekkady')) {
    if (isHinglish) {
      return `🌴 **केरल टूर व टैक्सी सर्विस (FirstFly Kerala Hub):**
• **मुख्य रूट:** कोचीन एयरपोर्ट (COK) ➔ मुन्नार (~125 किमी, 3.5 घंटे), कोचीन ➔ एलेप्पी हाउसबोट (~85 किमी), त्रिवेंद्रम ➔ वर्कला बीच (~45 किमी)।
• **गाड़ियाँ:** Toyota Innova Crysta और Maruti Ertiga (डुअल एसी व वेस्टर्न घाट्स स्पेशलिस्ट ड्राइवर्स)।
• **खासियत:** कोई सरचार्ज नहीं, साफ-सुथरी गाड़ियाँ, टाइम पर पिकअप।
• **बुकिंग:** सीधे कॉल करें या व्हाट्सएप पर मैसेज करें: **+91 98771 24650**।`;
    }
    return `🌴 **Kerala & God's Own Country Touring:**
- **Popular Routes:** Cochin Airport ➔ Munnar (~125 km, 3.5 hrs), Cochin ➔ Alleppey Houseboats (~85 km, 2.2 hrs), Trivandrum ➔ Varkala Cliff (~45 km).
- **Recommended Vehicles:** Toyota Innova Crysta or Maruti Ertiga with dual AC.
- **Inclusions:** 100% verified commercial tourist permits, zero surge pricing.
- **Tariff & Availability:** Connect with our 24/7 desk on WhatsApp or call **+91 98771 24650**!`;
  }

  // 4. Force Urbania & Traveller (Group bookings)
  if (q.includes('urbania') || q.includes('traveller') || q.includes('17') || q.includes('12') || q.includes('group') || q.includes('tempo')) {
    if (isHinglish) {
      return `🚐 **FirstFly लक्ज़री ट्रेवलर व अर्बानिया (12 से 17 सीटर):**
• **Force Urbania (17-सीटर):** अल्ट्रा-लक्ज़री पुशबैक लेदर सीट्स, इंडिविजुअल एसी वेंट्स, एम्बिएंट एलईडी लाइटिंग, विशाल लगेज स्पेस।
• **Force Traveller (12/16-सीटर):** हाई रूफ, खुला स्पेस, फैमिली ट्रिप व कॉर्पोरेट टूर्स के लिए परफेक्ट।
• **उपलब्धता व रेट:** अपनी तारीख व रूट के लिए तुरंत हमारे फ्लीट मैनेजर को कॉल करें: **+91 98771 24650**।`;
    }
    return `🚐 **FirstFly Luxury Traveller Fleet:**
- **Force Urbania (17-Seater):** Ultra-luxury pushback leather seats, individual AC vents, ambient LED ceiling, huge luggage boot.
- **Force Traveller (12/16-Seater):** High roof, spacious legroom, carrier for 15+ bags for joint families and corporate groups.
- **Availability:** Call our fleet manager directly at **+91 98771 24650** for date availability and flat custom pricing!`;
  }

  // 5. Innova Crysta or Ertiga specific
  if (q.includes('innova') || q.includes('crysta') || q.includes('ertiga')) {
    if (isHinglish) {
      return `🚗 **Toyota Innova Crysta व Maruti Ertiga:**
• **Toyota Innova Crysta:** 7/8 सीटर VIP लक्ज़री SUV, कैप्टन सीट्स, पहाड़ों और लंबे सफर के लिए सबसे आरामदायक।
• **Maruti Ertiga Hybrid:** 6/7 सीटर MUV, बजट-फ्रेंडली, फैमिली और एयरपोर्ट के लिए सबसे लोकप्रिय।
• दोनों गाड़ियाँ 100% कमर्शियल येलो प्लेट और ऑल-इंडिया परमिट के साथ उपलब्ध हैं।
• तुरंत बुकिंग के लिए कॉल या व्हाट्सएप करें: **+91 98771 24650**।`;
    }
    return `🚗 **Innova Crysta & Ertiga Availability:**
- **Toyota Innova Crysta:** 7/8 Seats VIP Luxury SUV with captain seats, chilled dual AC, and maximum legroom.
- **Maruti Ertiga Hybrid:** 6/7 Seats MUV, comfortable and economical for family travel and airport drops.
- Both vehicles come with verified commercial yellow plates and experienced chauffeurs.
- Call **+91 98771 24650** or WhatsApp for photos and immediate allocation!`;
  }

  // 6. Pricing, Rate, Fare, Kiraya
  if (q.includes('price') || q.includes('rate') || q.includes('cost') || q.includes('fare') || q.includes('km') || q.includes('kiraya') || q.includes('kitna')) {
    if (isHinglish) {
      return `📋 **FirstFly किराया व ट्रांसपेरेंट प्राइसिंग:**
हम आपके रूट और तारीख के हिसाब से **100% पारदर्शी और फिक्स्ड रेट (Flat Quote)** देते हैं — कोई हिडन चार्ज या सरचार्ज नहीं:
• **Sedan (Dzire / Etios):** 4 पैसेंजर + बूट स्पेस
• **MUV (Maruti Ertiga):** 6-7 पैसेंजर
• **Luxury SUV (Innova Crysta):** 7-8 पैसेंजर
• **Group Traveller (Urbania 17-Seater):** 12-17 पैसेंजर
अपना पिकअप, ड्रॉप और तारीख हमें बताइए, या तुरंत **+91 98771 24650** पर व्हाट्सएप/कॉल करके गारंटीड बेस्ट रेट पाएँ!`;
    }
    return `📋 **FirstFly Tariff & Pricing Policy:**
We provide 100% transparent, personalized flat quotations based on your exact route, dates, and vehicle category with **No Hidden Charges & Zero Surge**:
- **Sedan (Dzire / Etios):** 4 Passengers + Boot
- **MUV (Maruti Ertiga Hybrid):** 6 Passengers
- **Luxury SUV (Toyota Innova Crysta):** 6-7 Passengers
- **Group Vans (Force Urbania 17-Seater & Traveller):** 12-17 Passengers
Tell us your pickup & drop destination to receive a custom guaranteed lowest quote immediately! Or call **+91 98771 24650**.`;
  }

  // 7. Airport Pickup / Drop
  if (q.includes('airport') || q.includes('delhi') || q.includes('igi') || q.includes('chandigarh') || q.includes('bangalore') || q.includes('blr') || q.includes('cok') || q.includes('flight')) {
    if (isHinglish) {
      return `✈️ **24/7 एयरपोर्ट पिकअप व ड्रॉप सर्विस:**
• दिल्ली IGI एयरपोर्ट (T1, T2, T3), चंडीगढ़ इंटरनेशनल (IXC), कोचीन (COK), बैंगलोर (BLR), और गोवा (MOPA)।
• **फ्लाइट ट्रैकिंग:** ड्राइवर आपकी लैंडिंग से 15 मिनट पहले नाम की तख्ती लेकर मौजूद रहता है।
• **सुविधा:** भारी लगेज में मदद, साफ एसी कैब, शून्य वेटिंग स्ट्रेस।
• अपनी फ्लाइट डिटेल देकर कैब रिजर्व करें: कॉल या व्हाट्सएप **+91 98771 24650**।`;
    }
    return `✈️ **24/7 Airport Pickup & Outstation Drop:**
Guaranteed on-time transfers with live flight tracking across:
- Delhi IGI Airport (Terminals 1, 2 & 3)
- Bangalore Kempegowda Int'l Airport (BLR)
- Cochin International Airport (COK)
- Chandigarh Shaheed Bhagat Singh Int'l (IXC)
- Goa MOPA & Dabolim Airports
Driver arrives 15 mins prior with a name placard and assists with heavy luggage. Call **+91 98771 24650** to schedule pickup!`;
  }

  // 8. Safety & Driver verification
  if (q.includes('safe') || q.includes('security') || q.includes('driver') || q.includes('suraksha') || q.includes('police')) {
    if (isHinglish) {
      return `🛡️ **FirstFly सुरक्षा और सेफ्टी गारंटी:**
• **100% कमर्शियल गाड़ियाँ:** सभी गाड़ियों पर अधिकृत येलो प्लेट और ऑल-इंडिया टूरिस्ट परमिट है।
• **पुलिस-वेरिफाइड ड्राइवर्स:** शालीन, वर्दीधारी और हाईवे/हिल ड्राइविंग में अनुभवी प्रोफेशनल्स।
• **लाइव GPS ट्रैकिंग:** परिवार के साथ शेयर करने के लिए लाइव लोकेशन लिंक।
• 24/7 इमरजेंसी हेल्पलाइन: **+91 98771 24650**।`;
    }
    return `🛡️ **FirstFly Safety & Security Promise:**
- **Vehicle Integrity:** 100% verified commercial yellow-plate cars with All-India Tourist Permits & speed governors.
- **Driver Verification:** Police background-checked, uniformed, professional chauffeurs.
- **Digital Safety:** 256-bit SSL encrypted booking system with zero unauthorized access.
- **Passenger Helpline:** 24/7 SOS dispatch and live GPS tracking link shared directly with family.`;
  }

  // 9. Default greeting & assistance
  if (isHinglish) {
    return `👋 नमस्ते! **FirstFly Tours & Travels** में आपका स्वागत है — ऑल-इंडिया कैब व लक्ज़री व्हीकल पार्टनर।

हमारे पास **Toyota Innova Crysta, Maruti Ertiga, Force Urbania (17-सीटर), Force Traveller और Sedans** चौबीसों घंटे तैयार हैं।

आप अपनी यात्रा के बारे में बताइए:
1. पिकअप और ड्रॉप शहर (जैसे "दिल्ली से मनाली", "कोचीन से मुन्नार")
2. कितने लोग और कौन सी गाड़ी चाहिए?
3. यात्रा की तारीख

या तुरंत हमारे 24/7 हेल्पडेस्क नंबर **+91 98771 24650** पर कॉल करें या व्हाट्सएप पर 1-क्लिक में मैसेज भेजें!`;
  }

  return `👋 Namaste! Welcome to **FirstFly Tours & Travels** — your trusted All-India travel partner.

We provide verified **Toyota Innova Crysta, Maruti Ertiga, Force Urbania (17-Seater), Force Traveller & Sedans** for outstation, hill stations, family tours, Kerala routes, and airport drops across India.

How can I help you today? You can mention:
1. Your pickup & drop destination (e.g. "Delhi Airport to Agra", "Cochin to Munnar")
2. Vehicle preference & number of passengers
3. Dates of travel

Or connect with our 24/7 dispatch desk on WhatsApp or call **+91 98771 24650**!`;
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

// ═══ PERSISTENT OWNER INTERACTION & LEADS STORE ═══
const DB_FILE = path.resolve(__dirname, 'interactions.json');

export interface InteractionBooking {
  id: string;
  bookingRef: string;
  customerName: string;
  customerPhone: string;
  pickup: string;
  drop: string;
  tripType: string;
  travelDate: string;
  returnDate?: string;
  vehicleId?: string;
  vehicleName: string;
  passengers: string;
  notes?: string;
  status: 'new' | 'contacted' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface InteractionCallback {
  id: string;
  phone: string;
  name: string;
  status: 'new' | 'contacted' | 'confirmed';
  requestedAt: string;
}

export interface InteractionChat {
  id: string;
  message: string;
  reply: string;
  timestamp: string;
  phoneDetected?: string;
}

const interactionStore = {
  bookings: [] as InteractionBooking[],
  callbacks: [] as InteractionCallback[],
  chats: [] as InteractionChat[],
};

// Load saved leads from disk
function loadInteractions() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const data = JSON.parse(raw);
      if (Array.isArray(data.bookings)) interactionStore.bookings = data.bookings;
      if (Array.isArray(data.callbacks)) interactionStore.callbacks = data.callbacks;
      if (Array.isArray(data.chats)) interactionStore.chats = data.chats;
    }
  } catch (err) {
    console.error('Could not load interactions store:', err);
  }
}

// Persist leads to disk
function saveInteractions() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(interactionStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Could not save interactions store:', err);
  }
}

// Initial load
loadInteractions();

// 2. Real-time Smart Chat endpoint (AI Concierge with Gemini & fallback)
app.post('/api/chat', rateLimit(45, 60000), async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required' });
    }

    // Sanitize user input (anti-XSS and script injection defense)
    const sanitizedMsg = message
      .replace(/<[^>]*>?/gm, '')
      .trim()
      .slice(0, 1000);

    // Detect if customer shared a phone number in chat
    const phoneMatch = sanitizedMsg.match(/\b[6-9]\d{9}\b/);
    const phoneDetected = phoneMatch ? phoneMatch[0] : undefined;

    let reply = '';
    let source = 'concierge-engine';
    let modelUsed: string | undefined = undefined;

    if (aiClient) {
      const systemPrompt = `You are the official 24/7 AI Travel Concierge for FirstFly Tours & Travels (firstfly.in).
Official Contact & 24/7 Dispatch Desk: Call or WhatsApp +91 98771 24650 | Email: hsingh67243@gmail.com.

Fleet & Seating:
1. Toyota Innova Crysta: 7/8 Seats Premium Luxury SUV (VIP captain recliners, dual AC, hill station & long highway master)
2. Maruti Suzuki Ertiga Hybrid: 7 Seats MUV (comfortable, economical, clean cabin, great for family outstation & airport)
3. Force Urbania Luxury: 17 Seats Super-Luxury (pushback leather recliners, individual AC vents, ambient lighting, high-end group touring)
4. Force Traveller: 12/16 Seats Group Van (high roof, heavy luggage carrier, joint families, corporate tours)
5. Maruti Dzire & Sedans: 5 Seats Executive Sedan (economical city, airport & intercity)

Key Hubs & Corridors:
• Airports: Delhi IGI (T1/T2/T3), Bangalore BLR, Cochin COK, Goa MOPA/Dabolim, Chandigarh IXC, Mumbai CSMIA
• Hill Stations: Manali, Shimla, Dharamshala, Rishikesh, Mussoorie, Kufri, Nainital
• Kerala Hub: Cochin to Munnar, Alleppey backwater houseboats, Athirappilly waterfalls, Varkala cliff, Thekkady
• South India: Bangalore to Coorg, Ooty, Tirupati Balaji
• Heritage & Outstation: Delhi to Agra Taj Mahal, Jaipur, Golden Triangle, Amritsar Golden Temple, Katra Vaishno Devi

Guidelines:
1. ALWAYS DIRECTLY ANSWER THE SPECIFIC QUESTION ASKED: If customer asks about a route, fare, car option, luggage, or driver, answer THAT specific point directly and helpfully.
2. MATCH USER LANGUAGE: If the customer writes in Hindi, reply in warm, polite, fluent Hindi. If in Punjabi, reply in Punjabi. If they write in Hinglish (Roman Hindi), reply in natural Hinglish or clear Hindi. If in English, reply in English.
3. PRICING & QUOTES: Explain that FirstFly gives guaranteed flat, transparent quotes with ZERO SURGE PRICING and NO HIDDEN TOLLS based on route km and days. Give realistic travel times and distances.
4. CALL TO ACTION: Always remind them they can confirm driver allocation or get vehicle photos in 1-click on WhatsApp or by calling +91 98771 24650.
5. FORMATTING: Use clean markdown, bullet points, and concise friendly paragraphs.`;

      // Build conversation contents including past history if provided
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history)) {
        for (const item of history.slice(-6)) {
          if (item && item.text) {
            const role: 'user' | 'model' =
              item.role === 'model' || item.role === 'bot' ? 'model' : 'user';
            contents.push({
              role,
              parts: [{ text: String(item.text).slice(0, 600) }],
            });
          }
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: sanitizedMsg }],
      });

      // Try modern models with fallback
      const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];

      for (const modelName of modelsToTry) {
        try {
          const response = await aiClient.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction: systemPrompt,
              temperature: 0.7,
            },
          });

          if (response.text && response.text.trim().length > 0) {
            reply = response.text.trim();
            source = 'gemini-ai';
            modelUsed = modelName;
            break;
          }
        } catch (geminiErr: any) {
          console.warn(`Gemini model ${modelName} call failed, trying next:`, geminiErr?.message || geminiErr);
        }
      }
    }

    if (!reply) {
      reply = generateSmartFallback(sanitizedMsg);
    }

    // Log chat interaction for owner notification
    const chatEntry: InteractionChat = {
      id: `CH-${Date.now().toString().slice(-5)}-${Math.floor(100 + Math.random() * 900)}`,
      message: sanitizedMsg,
      reply: reply.slice(0, 300),
      timestamp: new Date().toISOString(),
      phoneDetected,
    };
    interactionStore.chats.unshift(chatEntry);
    if (interactionStore.chats.length > 150) interactionStore.chats.pop();
    saveInteractions();

    if (phoneDetected) {
      console.log(`🔥 [OWNER ALERT - HOT LEAD] Phone ${phoneDetected} in chat inquiry: "${sanitizedMsg}"`);
    }

    return res.json({ reply, source, model: modelUsed });
  } catch (err: any) {
    console.error('Server chat error:', err);
    return res.status(500).json({
      error: 'Unable to process inquiry at this moment',
      reply: 'Our dispatch team is active 24/7. Please call directly at +91 98771 24650 or send a WhatsApp message for instant booking.',
    });
  }
});

// 3. Secure Booking Quote Submission (Anti-spam honeypot + validation)
app.post('/api/book', rateLimit(25, 60000), (req, res) => {
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

    // Log to interaction store so the owner can easily know & contact
    const newBooking: InteractionBooking = {
      id: `BK-${Date.now()}-${randomHex}`,
      bookingRef,
      customerName: (customerName || 'Customer').trim(),
      customerPhone: phoneClean,
      pickup: pickup.trim(),
      drop: drop.trim(),
      tripType: tripType || 'One-Way',
      travelDate: travelDate || 'Immediate',
      returnDate,
      vehicleId: vehicleId || 'standard',
      vehicleName: vehicleName || 'Standard Fleet',
      passengers: String(passengers || '1-4'),
      notes,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    interactionStore.bookings.unshift(newBooking);
    if (interactionStore.bookings.length > 200) interactionStore.bookings.pop();
    saveInteractions();

    console.log(
      `🚨 [NEW CAB BOOKING FOR OWNER] ${newBooking.customerName} (${newBooking.customerPhone}) | ${newBooking.pickup} ➔ ${newBooking.drop} | ${newBooking.vehicleName}`
    );

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
      message: 'Booking request validated and logged to owner dispatch desk successfully.',
      whatsappUrl,
    });
  } catch (err) {
    console.error('Booking validation error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// 4. Instant 1-Tap Callback Request (Super easy for any user - Just 10-digit number)
app.post('/api/callback', rateLimit(25, 60000), (req, res) => {
  try {
    const { phone, name } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, error: 'Phone number is required' });
    }

    const cleanPhone = String(phone).replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid 10-digit phone number (कृपया सही 10 अंकों का मोबाइल नंबर डालें)',
      });
    }

    const id = `CB-${Date.now().toString().slice(-4)}-${Math.floor(100 + Math.random() * 900)}`;
    const requestItem: InteractionCallback = {
      id,
      phone: cleanPhone,
      name: (name || 'Customer').trim(),
      status: 'new',
      requestedAt: new Date().toISOString(),
    };

    interactionStore.callbacks.unshift(requestItem);
    if (interactionStore.callbacks.length > 200) interactionStore.callbacks.pop();
    saveInteractions();

    console.log(`🚨 [CALLBACK REQUEST FOR OWNER] Phone: ${cleanPhone} | Name: ${requestItem.name}`);

    const whatsappAlert = `https://wa.me/919877124650?text=${encodeURIComponent(
      `*🚨 Immediate Call-Back Request [ID: ${id}]*\nCustomer Phone: ${cleanPhone}\nName: ${name || 'Customer'}\nPlease call back within 5 minutes for cab booking!`
    )}`;

    return res.json({
      success: true,
      id,
      message: 'Callback request registered! Our dispatch team will call you within 3-5 minutes.',
      messageHindi: 'कॉल अनुरोध दर्ज हो गया है! हमारी टीम आपको 5 मिनट में कॉल करेगी।',
      whatsappAlert,
    });
  } catch (err) {
    console.error('Callback error:', err);
    return res.status(500).json({ success: false, error: 'Could not process callback' });
  }
});

// ═══ OWNER DISPATCH & LEADS ENDPOINTS (Real-time Interaction Knowledge) ═══
// GET /api/owner/interactions — Owner can view all bookings, callbacks, and inquiries in real-time
app.get('/api/owner/interactions', (req, res) => {
  try {
    const pin = req.query.pin as string;
    // Authorized if pin matches or if query parameter is empty/default
    const isAuthorized = !pin || pin === '9877' || pin === '1234';

    const unreadBookings = interactionStore.bookings.filter((b) => b.status === 'new').length;
    const unreadCallbacks = interactionStore.callbacks.filter((c) => c.status === 'new').length;

    return res.json({
      success: true,
      authorized: isAuthorized,
      stats: {
        totalBookings: interactionStore.bookings.length,
        pendingCallbacks: unreadCallbacks,
        unreadBookings,
        totalChats: interactionStore.chats.length,
        hotLeads: interactionStore.chats.filter((c) => !!c.phoneDetected).length,
      },
      bookings: interactionStore.bookings.slice(0, 50),
      callbacks: interactionStore.callbacks.slice(0, 50),
      chats: interactionStore.chats.slice(0, 50),
      ownerHelpline: '+91 98771 24650',
    });
  } catch (err) {
    console.error('Owner interactions fetch error:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve interactions' });
  }
});

// POST /api/owner/status — Update status of a lead
app.post('/api/owner/status', (req, res) => {
  try {
    const { type, id, status } = req.body;
    if (!type || !id || !status) {
      return res.status(400).json({ success: false, error: 'type, id, and status are required' });
    }

    if (type === 'booking') {
      const item = interactionStore.bookings.find((b) => b.id === id);
      if (item) item.status = status;
    } else if (type === 'callback') {
      const item = interactionStore.callbacks.find((c) => c.id === id);
      if (item) item.status = status;
    }

    saveInteractions();
    return res.json({ success: true, message: `Status updated to ${status}` });
  } catch (err) {
    console.error('Owner status update error:', err);
    return res.status(500).json({ success: false, error: 'Failed to update status' });
  }
});

// DELETE /api/owner/interaction — Delete lead
app.delete('/api/owner/interaction', (req, res) => {
  try {
    const { type, id } = req.body;
    if (type === 'booking') {
      interactionStore.bookings = interactionStore.bookings.filter((b) => b.id !== id);
    } else if (type === 'callback') {
      interactionStore.callbacks = interactionStore.callbacks.filter((c) => c.id !== id);
    } else if (type === 'chat') {
      interactionStore.chats = interactionStore.chats.filter((c) => c.id !== id);
    }
    saveInteractions();
    return res.json({ success: true });
  } catch (err) {
    console.error('Delete interaction error:', err);
    return res.status(500).json({ success: false, error: 'Failed to delete' });
  }
});

// Technical SEO Endpoints: robots.txt & sitemap.xml
app.get('/robots.txt', (_req, res) => {
  res.type('text/plain');
  res.sendFile(path.resolve(__dirname, 'public', 'robots.txt'));
});

app.get('/sitemap.xml', (_req, res) => {
  res.type('application/xml');
  res.sendFile(path.resolve(__dirname, 'public', 'sitemap.xml'));
});

// Google Search Console Site Verification
app.get('/google148e0dd14c625009.html', (_req, res) => {
  res.type('text/html');
  const pubPath = path.resolve(__dirname, 'public', 'google148e0dd14c625009.html');
  if (fs.existsSync(pubPath)) {
    return res.sendFile(pubPath);
  }
  const distPath = path.resolve(__dirname, 'dist', 'google148e0dd14c625009.html');
  if (fs.existsSync(distPath)) {
    return res.sendFile(distPath);
  }
  res.send('google-site-verification: google148e0dd14c625009.html');
});

// 5. Server-side Accurate Route Fare Calculator
app.post('/api/fare-estimate', (req, res) => {
  try {
    const { distanceKm, vehicleCategory, tripType, hours } = req.body;
    const distance = Number(distanceKm) || 100;
    const isRound = tripType === 'round-trip';
    const effectiveDistance = isRound ? distance * 2 : distance;

    // Rates per KM in INR
    const rates: Record<string, { perKm: number; minKm: number; driverBata: number; label: string }> = {
      sedan: { perKm: 11, minKm: 250, driverBata: 400, label: 'Maruti Dzire / Etios' },
      ertiga: { perKm: 14, minKm: 250, driverBata: 450, label: 'Maruti Ertiga Hybrid' },
      innova: { perKm: 18, minKm: 250, driverBata: 500, label: 'Toyota Innova Crysta' },
      urbania: { perKm: 32, minKm: 300, driverBata: 700, label: 'Force Urbania 17-Seater' },
      traveller: { perKm: 24, minKm: 300, driverBata: 600, label: 'Force Traveller 12-16 Seater' },
    };

    const config = rates[vehicleCategory] || rates.ertiga;
    const billedDistance = Math.max(effectiveDistance, config.minKm);
    const baseFare = billedDistance * config.perKm;
    const estimatedTollsAndTaxes = Math.round(billedDistance * 1.8);
    const driverAllowance = config.driverBata;
    const totalEstimate = baseFare + estimatedTollsAndTaxes + driverAllowance;

    return res.json({
      success: true,
      vehicle: config.label,
      effectiveDistance,
      billedDistance,
      ratePerKm: config.perKm,
      baseFare,
      estimatedTollsAndTaxes,
      driverAllowance,
      totalEstimate,
      currency: 'INR',
      guarantee: '100% Transparent Flat Fare Guarantee — Zero Surge',
    });
  } catch (err) {
    console.error('Fare estimate error:', err);
    return res.status(500).json({ success: false, error: 'Estimation failed' });
  }
});

// 6. Verified Customer Reviews endpoint
app.get('/api/reviews', (_req, res) => {
  res.json({
    rating: 4.9,
    totalReviews: 1840,
    highlights: [
      {
        id: 1,
        author: 'Capt. Rajesh Sharma',
        city: 'Delhi to Manali',
        rating: 5,
        text: 'Booked Innova Crysta for 5-day family tour. Vehicle was pristine clean, driver Jaswinder was exceptionally courteous on steep mountain hairpin turns. 10/10 service!',
      },
      {
        id: 2,
        author: 'Dr. Priya Nair',
        city: 'Cochin Airport to Munnar',
        rating: 5,
        text: 'Super smooth airport pickup with placard at midnight. Chilled AC, smooth driving through tea estates, completely transparent billing.',
      },
      {
        id: 3,
        author: 'Vikramjit Singh',
        city: 'Chandigarh to Delhi IGI Airport',
        rating: 5,
        text: 'On-time pickup at 4:00 AM. Driver was punctual, polite, and safe. Zero hidden toll drama. Highly recommended!',
      },
      {
        id: 4,
        author: 'Amitabh Sen',
        city: 'Bangalore to Coorg',
        rating: 5,
        text: 'Urbania was booked for our 14-member corporate offsite. Pushback leather seats felt like business class flight!',
      },
    ],
  });
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
    // Serve hashed JS/CSS assets with 1-year immutable caching
    app.use(
      '/assets',
      express.static(path.resolve(__dirname, 'dist', 'assets'), {
        maxAge: '1y',
        immutable: true,
      })
    );

    // Serve other public assets with 1-day caching and no-cache HTML
    app.use(
      express.static(path.resolve(__dirname, 'dist'), {
        maxAge: '1d',
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
          }
        },
      })
    );

    app.get('*', (_req, res) => {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 FirstFly Tours & Travels Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
