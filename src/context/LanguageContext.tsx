import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const DICTIONARY: Translations = {
  // Top bar & Header
  liveFleet: {
    en: '42+ Commercial Tourist Cabs on Duty • All-India Permit • No Surge Pricing',
    hi: '42+ टूरिस्ट टैक्सियाँ ड्यूटी पर • ऑल इंडिया परमिट • कोई छुपा चार्ज नहीं',
  },
  dispatchDesk: {
    en: '24/7 Dispatch Desk',
    hi: '24/7 सहायता केंद्र',
  },
  chooseLanguage: {
    en: 'Language',
    hi: 'भाषा',
  },

  // Navbar
  navFleet: { en: 'Our Fleet', hi: 'हमारी गाड़ियाँ' },
  navPackages: { en: 'Tour Packages', hi: 'टूर पैकेज' },
  navAirports: { en: 'Airports & Routes', hi: 'एयरपोर्ट व रूट' },
  navReviews: { en: 'Reviews', hi: 'ग्राहकों के रिव्यू' },
  navFaqs: { en: 'FAQs', hi: 'सवाल-जवाब' },
  bookNowBtn: { en: 'Book Now', hi: 'अभी बुक करें' },

  // Hero Quick Booking
  quickTab: { en: '⚡ 1-Tap Quick Booking', hi: '⚡ 1-टैप आसान बुकिंग' },
  calcTab: { en: '📍 Route & Fare Calculator', hi: '📍 किराया कैलकुलेटर' },
  heroQuickHeading: {
    en: 'Call Directly or Leave Number — Get a Call in 5 Minutes',
    hi: 'सीधा कॉल करें या नंबर छोड़ें — 5 मिनट में कॉल पाएँ',
  },
  heroQuickSub: {
    en: 'No complicated forms! 1-Click direct call, WhatsApp, or instant callback',
    hi: 'कोई फॉर्म भरने का झंझट नहीं! 1-क्लिक में बात करें या व्हाट्सएप करें',
  },
  service247: { en: '24/7 Instant Dispatch', hi: '24/7 तुरंत सर्विस' },

  // Hero 3 Cards
  opt1Tag: { en: 'Option 1', hi: 'विकल्प 1' },
  opt1Title: { en: 'Call Directly', hi: 'सीधा कॉल करें' },
  opt1Sub: { en: '1-Tap to speak now', hi: '1-क्लिक में बात करें' },

  opt2Tag: { en: 'Option 2', hi: 'विकल्प 2' },
  opt2Title: { en: 'Book on WhatsApp', hi: 'व्हाट्सएप पर बुक' },
  opt2Sub: { en: 'Get car photos & price quote', hi: 'गाड़ी और फोटो मंगाएँ' },

  opt3Tag: { en: 'Option 3', hi: 'विकल्प 3' },
  opt3Title: { en: '5-Min Callback', hi: '5 मिनट में कॉल बैक' },
  opt3Sub: { en: 'Enter mobile, we will call you', hi: 'नंबर डालें, हम खुद कॉल करेंगे' },

  callbackRegistered: {
    en: 'Request Received! We will call you within 5 minutes.',
    hi: 'अनुरोध दर्ज! हम 5 मिनट में कॉल कर रहे हैं।',
  },
  enterAnotherNum: { en: 'Enter another number', hi: 'दूसरा नंबर डालें' },
  callMeBtn: { en: 'Request Instant Callback', hi: 'मुझे कॉल करें' },
  sending: { en: 'Submitting request...', hi: 'भेजा जा रहा है...' },
  chooseCar: { en: 'Choose Preferred Vehicle:', hi: 'पसंदीदा गाड़ी चुनें:' },

  // Mobile Bar
  mbCall: { en: 'Call Now', hi: 'कॉल करें' },
  mbWhatsApp: { en: 'WhatsApp', hi: 'व्हाट्सएप' },
  mbBook: { en: 'Book Cab', hi: 'गाड़ी बुक' },
  mbAI: { en: 'AI Desk', hi: 'AI सहायता' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('firstfly_lang');
      if (saved === 'hi' || saved === 'en') return saved;
    }
    return 'en'; // Clean English by default
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('firstfly_lang', lang);
    }
  };

  const t = (key: string): string => {
    const entry = DICTIONARY[key];
    if (!entry) return key;
    return entry[language] || entry.en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
