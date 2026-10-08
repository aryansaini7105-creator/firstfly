import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'pa' | 'gu';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
    pa: string;
    gu: string;
  };
}

export const DICTIONARY: Translations = {
  // Top bar & Header
  liveFleet: {
    en: '42+ Commercial Tourist Cabs on Duty • All-India Permit • No Surge Pricing',
    hi: '42+ टूरिस्ट टैक्सियाँ ड्यूटी पर • ऑल इंडिया परमिट • कोई छुपा चार्ज नहीं',
    pa: '42+ ਕਮਰਸ਼ੀਅਲ ਟੂਰਿਸਟ ਟੈਕਸੀਆਂ ਡਿਊਟੀ  ਉੱਤੇ • ਆਲ-ਇੰਡੀਆ ਪਰਮਿਟ • ਕੋਈ ਲੁਕਵਾਂ ਖਰਚਾ ਨਹੀਂ',
    gu: '42+ પ્રવાસી કેબ ફરજ પર • ઓલ ઈન્ડિયા પરમિટ • કોઈ વધારાનો છુપો ચાર્જ નહીં',
  },
  dispatchDesk: {
    en: '24/7 Dispatch Desk',
    hi: '24/7 सहायता केंद्र',
    pa: '24/7 ਸਹਾਇਤਾ ਕੇਂਦਰ',
    gu: '24/7 હેલ્પ ડેસ્ક',
  },
  chooseLanguage: {
    en: 'Language',
    hi: 'भाषा',
    pa: 'ਭਾਸ਼ਾ',
    gu: 'ભાષા',
  },
  ownerPortalBtn: {
    en: 'Owner Dispatch Portal',
    hi: 'मालिक पोर्टल (Owner)',
    pa: 'ਮਾਲਕ ਪੋਰਟਲ (Owner)',
    gu: 'ઓનર પોર્ટલ (Owner)',
  },

  // Navbar
  navFleet: { en: 'Our Fleet', hi: 'हमारी गाड़ियाँ', pa: 'ਸਾਡੀਆਂ ਗੱਡੀਆਂ', gu: 'અમારી ગાડીઓ' },
  navPackages: { en: 'Tour Packages', hi: 'टूर पैकेज', pa: 'ਟੂਰ ਪੈਕੇਜ', gu: 'ટૂર પેકેજ' },
  navAirports: { en: 'Airports & Routes', hi: 'एयरपोर्ट व रूट', pa: 'ਏਅਰਪੋਰਟ ਅਤੇ ਰੂਟ', gu: 'એરપોર્ટ અને રૂટ્સ' },
  navSafety: { en: 'Safety Guarantee', hi: 'सुरक्षा गारंटी', pa: 'ਸੁਰੱਖਿਆ ਗਾਰੰਟੀ', gu: 'સુરક્ષા ગેરંટી' },
  navReviews: { en: 'Reviews', hi: 'ग्राहकों के रिव्यू', pa: 'ਗਾਹਕਾਂ ਦੇ ਰਿਵਿਊ', gu: 'ગ્રાહક રિવ્યૂ' },
  navFaqs: { en: 'FAQs', hi: 'सवाल-जवाब', pa: 'ਸਵਾਲ-ਜਵਾਬ', gu: 'પ્રશ્નોત્તરી' },
  bookNowBtn: { en: 'Book Vehicle', hi: 'गाड़ी बुक करें', pa: 'ਗੱਡੀ ਬੁੱਕ ਕਰੋ', gu: 'ગાડી બુક કરો' },
  allIndiaFleetTag: {
    en: 'Tours & Travels • All India Cab Fleet',
    hi: 'टूर्स एंड ट्रेवल्स • ऑल इंडिया कैब फ्लीट',
    pa: 'ਟੂਰਸ ਐਂਡ ਟ੍ਰੈਵਲਜ਼ • ਆਲ ਇੰਡੀਆ ਕੈਬ ਫਲੀਟ',
    gu: 'ટૂર્સ એન્ડ ટ્રાવેલ્સ • ઓલ ઇન્ડિયા કેબ ફ્લીટ',
  },

  // Hero Section
  heroTopBadge: {
    en: 'All-India Tourist Permit • 100% Commercial Yellow Plate Fleet',
    hi: 'ऑल-इंडिया टूरिस्ट परमिट • 100% अधिकृत येलो प्लेट गाड़ियाँ',
    pa: 'ਆਲ-ਇੰਡੀਆ ਟੂਰਿਸਟ ਪਰਮਿਟ • 100% ਕਮਰਸ਼ੀਅਲ ਪੀਲੀ ਪਲੇਟ ਗੱਡੀਆਂ',
    gu: 'ઓલ-ઇન્ડિયા ટૂરિસ્ટ પરમિટ • 100% કમર્શિયલ યલો પ્લેટ ગાડીઓ',
  },
  heroTitleMain: {
    en: 'Book Premium Travel Vehicles Across All Of India',
    hi: 'पूरे भारत में सुरक्षित व लक्ज़री गाड़ियाँ बुक करें',
    pa: 'ਪੂਰੇ ਭਾਰਤ ਵਿੱਚ ਸੁਰੱਖਿਅਤ ਅਤੇ ਲਗਜ਼ਰੀ ਗੱਡੀਆਂ ਬੁੱਕ ਕਰੋ',
    gu: 'સમગ્ર ભારતમાં સુરક્ષિત અને લક્ઝરી ગાડીઓ બુક કરો',
  },
  heroSubText: {
    en: 'Toyota Innova Crysta, Maruti Ertiga, Force Urbania 17-Seater, and Travellers for family trips, corporate tours, and airport transfers. Zero surge charges, verified polite drivers, and 24/7 dispatch.',
    hi: 'टोयोटा इनोवा क्रिस्टा, मारुति अर्टिगा, फोर्स अर्बानिया 17-सीटर और ट्रेवलर — फैमिली ट्रिप, कॉर्पोरेट टूर्स और एयरपोर्ट पिकअप के लिए। कोई सरचार्ज नहीं, पुलिस-वेरिफाइड ड्राइवर्स और 24/7 सहायता।',
    pa: 'ਟੋਇਟਾ ਇਨੋਵਾ ਕ੍ਰਿਸਟਾ, ਮਾਰੂਤੀ ਅਰਟਿਗਾ, ਫੋਰਸ ਅਰਬਾਨੀਆ 17-ਸੀਟਰ ਅਤੇ ਟ੍ਰੈਵਲਰ — ਪਰਿਵਾਰਕ ਟ੍ਰਿਪ, ਕਾਰਪੋਰੇਟ ਟੂਰ ਅਤੇ ਏਅਰਪੋਰਟ ਲਈ। ਕੋਈ ਵਾਧੂ ਚਾਰਜ ਨਹੀਂ, ਵੈਰੀਫਾਈਡ ਡਰਾਈਵਰ ਅਤੇ 24/7 ਮਦਦ।',
    gu: 'ટોયોટા ઇનોવા ક્રિસ્ટા, મારુતિ અર્ટિગા, ફોર્સ અર્બાનિયા 17-સીટર અને ટ્રાવેલર — ફેમિલી ટ્રીપ, કોર્પોરેટ ટૂર અને એરપોર્ટ માટે. કોઈ સરચાર્જ નહીં, વેરિફાઇડ ડ્રાઇવરો અને 24/7 સપોર્ટ.',
  },
  metricCommercial: { en: '100% Verified Commercial Plates', hi: '100% वेरिफाइड कमर्शियल प्लेट्स', pa: '100% ਵੈਰੀਫਾਈਡ ਕਮਰਸ਼ੀਅਲ ਪਲੇਟਾਂ', gu: '100% વેરિફાઇડ કમર્શિયલ પ્લેટો' },
  metricRated: { en: '4.9★ Rated (1,850+ Tours)', hi: '4.9★ रेटिंग (1,850+ यात्राएं)', pa: '4.9★ ਰੇਟਿੰਗ (1,850+ ਯਾਤਰਾਵਾਂ)', gu: '4.9★ રેટિંગ (1,850+ યાત્રાઓ)' },
  metricTolls: { en: 'Zero Hidden Toll Taxes', hi: 'शून्य छुपा टोल चार्ज', pa: 'ਕੋਈ ਲੁਕਵਾਂ ਟੋਲ ਟੈਕਸ ਨਹੀਂ', gu: 'કોઈ છુપો ટોલ ટેક્સ નહીં' },
  metricDrivers: { en: 'Police-Verified Drivers', hi: 'पुलिस-वेरिफाइड ड्राइवर्स', pa: 'ਪੁਲਿਸ-ਵੈਰੀਫਾਈਡ ਡਰਾਈਵਰ', gu: 'પોલીસ-વેરિફાઇડ ડ્રાઇવરો' },

  // Hero Quick Booking
  quickTab: { en: '⚡ 1-Tap Quick Booking', hi: '⚡ 1-टैप आसान बुकिंग', pa: '⚡ 1-ਟੈਪ ਤੁਰੰਤ ਬੁਕਿੰਗ', gu: '⚡ 1-ટેપ ઝડપી બુકિંગ' },
  calcTab: { en: '📍 Route & Fare Calculator', hi: '📍 रूट व किराया कैलकुलेटर', pa: '📍 ਰੂਟ ਤੇ ਕਿਰਾਇਆ ਕੈਲਕੁਲੇਟਰ', gu: '📍 રૂટ અને ભાડું કેલ્ક્યુલેટર' },
  heroQuickHeading: {
    en: 'Call Directly or Leave Number — Get a Call in 5 Minutes',
    hi: 'सीधा कॉल करें या नंबर छोड़ें — 5 मिनट में कॉल पाएँ',
    pa: 'ਸਿੱਧਾ ਕਾਲ ਕਰੋ ਜਾਂ ਨੰਬਰ ਛੱਡੋ — 5 ਮਿੰਟਾਂ  ਵਿੱਚ ਕਾਲ ਪਾਓ',
    gu: 'સીધો કૉલ કરો અથવા નંબર આપો — 5 મિનિટમાં કૉલ મેળવો',
  },
  heroQuickSub: {
    en: 'No complicated forms! 1-Click direct call, WhatsApp, or instant callback',
    hi: 'कोई फॉर्म भरने का झंझट नहीं! 1-क्लिक में बात करें या व्हाट्सएप करें',
    pa: 'ਕੋਈ ਫਾਰਮ ਭਰਨ ਦੀ ਲੋੜ ਨਹੀਂ! 1-ਕਲਿੱਕ  ਵਿੱਚ ਕਾਲ ਜਾਂ ਵਟਸਐਪ ਕਰੋ',
    gu: 'કોઈ ફોર્મ ભરવાની ઝંઝટ નહીં! 1-ક્લિકમાં કૉલ અથવા વોટ્સએપ કરો',
  },
  service247: { en: '24/7 Instant Dispatch', hi: '24/7 तुरंत सर्विस', pa: '24/7 ਤੁਰੰਤ ਸਰਵਿਸ', gu: '24/7 તાત્કાલિક સેવા' },

  // Hero 3 Cards
  opt1Tag: { en: 'Option 1', hi: 'विकल्प 1', pa: 'ਵਿਕਲਪ 1', gu: 'વિકલ્પ 1' },
  opt1Title: { en: 'Call Directly', hi: 'सीधा कॉल करें', pa: 'ਸਿੱਧਾ ਕਾਲ ਕਰੋ', gu: 'સીધો કૉલ કરો' },
  opt1Sub: { en: '1-Tap to speak now', hi: '1-क्लिक में बात करें', pa: '1-ਕਲਿੱਕ  ਵਿੱਚ ਗੱਲ ਕਰੋ', gu: '1-ક્લિકમાં વાત કરો' },

  opt2Tag: { en: 'Option 2', hi: 'विकल्प 2', pa: 'ਵਿਕਲਪ 2', gu: 'વિકલ્પ 2' },
  opt2Title: { en: 'Book on WhatsApp', hi: 'व्हाट्सएप पर बुक', pa: 'ਵਟਸਐਪ  ਉੱਤੇ ਬੁੱਕ ਕਰੋ', gu: 'વોટ્સએપ પર બુકિંગ' },
  opt2Sub: { en: 'Get car photos & price quote', hi: 'गाड़ी और फोटो मंगाएँ', pa: 'ਗੱਡੀ ਦੀਆਂ ਫੋਟੋਆਂ ਤੇ ਰੇਟ ਮੰਗਵਾਓ', gu: 'ગાડીના ફોટા અને ભાવ મેળવો' },

  opt3Tag: { en: 'Option 3', hi: 'विकल्प 3', pa: 'ਵਿਕਲਪ 3', gu: 'વિકલ્પ 3' },
  opt3Title: { en: '5-Min Callback', hi: '5 मिनट में कॉल बैक', pa: '5 ਮਿੰਟਾਂ  ਵਿੱਚ ਕਾਲ ਬੈਕ', gu: '5 મિનિટમાં કૉલ બેક' },
  opt3Sub: { en: 'Enter mobile, we will call you', hi: 'नंबर डालें, हम खुद कॉल करेंगे', pa: 'ਮੋਬਾਈਲ ਨੰਬਰ ਭਰੋ, ਅਸੀਂ ਕਾਲ ਕਰਾਂਗੇ', gu: 'નંબર નાખો, અમે સામેથી કૉલ કરીશું' },

  callbackRegistered: {
    en: 'Request Received! We will call you within 5 minutes.',
    hi: 'अनुरोध दर्ज! हम 5 मिनट में कॉल कर रहे हैं।',
    pa: 'ਬੇਨਤੀ ਦਰਜ! ਅਸੀਂ 5 ਮਿੰਟਾਂ ਅੰਦਰ ਕਾਲ ਕਰ ਰਹੇ ਹਾਂ।',
    gu: 'વિનંતી નોંધાઈ ગઈ! અમે 5 મિનિટમાં કૉલ કરીશું.',
  },
  enterAnotherNum: { en: 'Enter another number', hi: 'दूसरा नंबर डालें', pa: 'ਦੂਜਾ ਨੰਬਰ ਭਰੋ', gu: 'બીજો નંબર નાખો' },
  callMeBtn: { en: 'Request Instant Callback', hi: 'मुझे तुरंत कॉल करें', pa: 'ਮੈਨੂੰ ਤੁਰੰਤ ਕਾਲ ਕਰੋ', gu: 'મને તાત્કાલિક કૉલ કરો' },
  sending: { en: 'Submitting request...', hi: 'भेजा जा रहा है...', pa: 'ਬੇਨਤੀ ਭੇਜੀ ਜਾ ਰਹੀ ਹੈ...', gu: 'મોકલાઈ રહ્યું છે...' },
  chooseCar: { en: 'Choose Preferred Vehicle:', hi: 'पसंदीदा गाड़ी चुनें:', pa: 'ਮਨਪਸੰਦ ਗੱਡੀ ਚੁਣੋ:', gu: 'પસંદગીની ગાડી પસંદ કરો:' },

  // Fare Calculator Details
  tripOneWay: { en: 'One-Way', hi: 'वन-वे (एक तरफ)', pa: 'ਵਨ-ਵੇ (ਇੱਕ ਪਾਸੇ)', gu: 'વન-વે (એક તરફ)' },
  tripRound: { en: 'Round-Trip', hi: 'राउंड-ट्रिप (आना-जाना)', pa: 'ਰਾਊਂਡ-ਟ੍ਰਿਪ (ਆਉਣਾ-ਜਾਣਾ)', gu: 'રાઉન્ડ-ટ્રીપ (આવવા-જવાનું)' },
  tripAirport: { en: 'Airport Transfer', hi: 'एयरपोर्ट ट्रांसफर', pa: 'ਏਅਰਪੋਰਟ ਟ੍ਰਾਂਸਫਰ', gu: 'એરપોર્ટ ટ્રાન્સફર' },
  pickupCityLabel: { en: 'PICKUP CITY / AIRPORT', hi: 'पिकअप शहर या एयरपोर्ट', pa: 'ਪਿਕਅਪ ਸ਼ਹਿਰ ਜਾਂ ਏਅਰਪੋਰਟ', gu: 'પિકઅપ શહેર અથવા એરપોર્ટ' },
  dropCityLabel: { en: 'DROP DESTINATION', hi: 'ड्रॉप डेस्टिनेशन (गंतव्य)', pa: 'ਡ੍ਰੌਪ ਡੈਸਟੀਨੇਸ਼ਨ', gu: 'ડ્રોપ ડેસ્ટિનેશન' },
  travelDateLabel: { en: 'TRAVEL DATE', hi: 'यात्रा की तारीख', pa: 'ਸਫ਼ਰ ਦੀ ਮਿਤੀ', gu: 'પ્રવાસની તારીખ' },
  returnDateLabel: { en: 'RETURN DATE', hi: 'वापसी की तारीख', pa: 'ਵਾਪਸੀ ਦੀ ਮਿਤੀ', gu: 'પાછા ફરવાની તારીખ' },
  estDistanceLabel: { en: 'Est. Highway Distance', hi: 'अनुमानित दूरी', pa: 'ਅੰਦਾਜ਼ਨ ਦੂਰੀ', gu: 'અંદાજિત અંતર' },
  estDurationLabel: { en: 'Est. Journey Duration', hi: 'अनुमानित समय', pa: 'ਅੰਦਾਜ਼ਨ ਸਮਾਂ', gu: 'અંદાજિત સમય' },
  estFareLabel: { en: 'Guaranteed Flat Fare', hi: 'फिक्स्ड पारदर्शी किराया', pa: 'ਫਿਕਸਡ ਕਿਰਾਇਆ', gu: 'ચોક્કસ ફ્લેટ ભાડું' },
  zeroSurgeNote: { en: '100% Transparent Flat Fare • Zero Surge Pricing', hi: '100% पारदर्शी किराया • कोई सरचार्ज नहीं', pa: '100% ਪਾਰਦਰਸ਼ੀ ਕਿਰਾਇਆ • ਕੋਈ ਵਾਧੂ ਚਾਰਜ ਨਹੀਂ', gu: '100% પારદર્શક ભાડું • કોઈ સરચાર્જ નહીં' },
  bookNowDriverDirect: { en: 'Book Now — Pay Driver Directly', hi: 'अभी बुक करें — भुगतान ड्राइवर को करें', pa: 'ਹੁਣੇ ਬੁੱਕ ਕਰੋ — ਭੁਗਤਾਨ ਡਰਾਈਵਰ ਨੂੰ ਕਰੋ', gu: 'હમણાં બુક કરો — ડ્રાઇવરને ચૂકવો' },
  whatsappQuickQuote: { en: 'WhatsApp Quote', hi: 'व्हाट्सएप कोटेशन', pa: 'ਵਟਸਐਪ ਕੋਟੇਸ਼ਨ', gu: 'વોટ્સએપ ભાવ' },

  // Fleet Section
  fleetTag: {
    en: '100% Commercial Yellow-Plate Fleet',
    hi: '100% अधिकृत कमर्शियल येलो प्लेट गाड़ियाँ',
    pa: '100% ਕਮਰਸ਼ੀਅਲ ਪੀਲੀ ਪਲੇਟ ਗੱਡੀਆਂ',
    gu: '100% માન્ય કમર્શિયલ યલો પ્લેટ ગાડીઓ',
  },
  fleetTitle: { en: 'Our Premium Travel Fleet', hi: 'हमारी अधिकृत प्रीमियम गाड़ियाँ', pa: 'ਸਾਡੀਆਂ ਪ੍ਰੀਮੀਅਮ ਗੱਡੀਆਂ', gu: 'અમારી પ્રીમિયમ ગાડીઓ' },
  fleetSub: {
    en: 'From executive sedans to 17-seater luxury Urbania travellers. Every vehicle is GPS tracked, sanitized before every trip, and driven by an experienced mountain chauffeur.',
    hi: 'एग्जीक्यूटिव सेडान से लेकर 17-सीटर लक्ज़री अर्बानिया ट्रेवलर तक। हर गाड़ी जीपीएस से लैस, हर ट्रिप से पहले सैनिटाइज्ड और अनुभवी ड्राइवर द्वारा संचालित।',
    pa: 'ਐਗਜ਼ੀਕਿਊਟਿਵ ਸੇਡਾਨ ਤੋਂ ਲੈ ਕੇ 17-ਸੀਟਰ ਲਗਜ਼ਰੀ ਅਰਬਾਨੀਆ ਟ੍ਰੈਵਲਰ ਤੱਕ। ਹਰ ਗੱਡੀ GPS ਵਾਲੀ ਅਤੇ ਤਜਰਬੇਕਾਰ ਡਰਾਈਵਰ ਨਾਲ।',
    gu: 'સેડાનથી લઈને 17-સીટર લક્ઝરી અર્બાનિયા ટ્રાવેલર સુધી. દરેક વાહન GPS થી સજ્જ અને અનુભવી ડ્રાઇવર સાથે.',
  },
  filterAll: { en: 'All Fleet', hi: 'सभी गाड़ियाँ', pa: 'ਸਾਰੀਆਂ ਗੱਡੀਆਂ', gu: 'બધી ગાડીઓ' },
  filterSuv: { en: 'Luxury SUV (Innova)', hi: 'लक्ज़री एसयूवी (इनोवा)', pa: 'SUVs (ਇਨੋਵਾ)', gu: 'SUVs (ઇનોવા)' },
  filterMuv: { en: 'Family MUV (Ertiga)', hi: 'फैमिली एमयूवी (अर्टिगा)', pa: 'MUVs (ਅਰਟਿਗਾ)', gu: 'MUVs (અર્ટિગા)' },
  filterLuxury: { en: 'Luxury Vans (Urbania)', hi: 'लक्ज़री वैन्स (अर्बानिया)', pa: 'ਲਗਜ਼ਰੀ ਵੈਨਾਂ (ਅਰਬਾਨੀਆ)', gu: 'લક્ઝરી વાન (અર્બાનિયા)' },
  filterSedan: { en: 'Sedans (Dzire)', hi: 'सेडान (डिजायर)', pa: 'ਸੇਡਾਨ (ਡਿਜ਼ਾਇਰ)', gu: 'સેડાન (ડિઝાયર)' },
  slideControlsLabel: { en: 'Browse Cars:', hi: 'गाड़ियाँ देखें:', pa: 'ਗੱਡੀਆਂ ਦੇਖੋ:', gu: 'ગાડીઓ જુઓ:' },
  seatsLabel: { en: 'Seats', hi: 'सीटें', pa: 'ਸੀਟਾਂ', gu: 'સીટો' },
  luggageLabel: { en: 'Bags', hi: 'बैग', pa: 'ਬੈਗ', gu: 'બેગ' },
  acLabel: { en: 'Chilled Dual AC', hi: 'चिल्ड डुअल एसी', pa: 'ਡਿਊਲ ਏ.ਸੀ.', gu: 'ડ્યુઅલ એસી' },
  perKmRate: { en: 'Starting Flat Rate', hi: 'शुरुआती फ्लैट दर', pa: 'ਸ਼ੁਰੂਆਤੀ ਫਲੈਟ ਰੇਟ', gu: 'શરૂઆતી ફ્લેટ દર' },
  bookThisCar: { en: 'Book This Car', hi: 'यह गाड़ी बुक करें', pa: 'ਇਹ ਗੱਡੀ ਬੁੱਕ ਕਰੋ', gu: 'આ ગાડી બુક કરો' },
  viewSpecsAndPhotos: { en: 'Specs & Photos', hi: 'विवरण व फोटो', pa: 'ਵੇਰਵੇ ਅਤੇ ਫੋਟੋਆਂ', gu: 'વિગત અને ફોટો' },
  realPhotoTag: { en: 'Real On-Road Photo', hi: 'सफर की असली तस्वीर', pa: 'ਅਸਲ ਤਸਵੀਰ', gu: 'અસલી ફોટો' },
  photoCounterText: { en: 'Photo', hi: 'फोटो', pa: 'ਫੋਟੋ', gu: 'ફોટો' },
  ofText: { en: 'of', hi: 'का', pa: 'ਦਾ', gu: 'માંથી' },

  // Tour Packages Section
  packagesTag: {
    en: 'All-India Handpicked Holiday Packages',
    hi: 'ऑल-इंडिया विशेष हॉलिडे पैकेज',
    pa: 'ਆਲ-ਇੰਡੀਆ ਖਾਸ ਛੁੱਟੀਆਂ ਦੇ ਪੈਕੇਜ',
    gu: 'ઓલ-ઇન્ડિયા શ્રેષ્ઠ હોલીડે પેકેજ',
  },
  packagesTitle: { en: 'All-India Premium Tour Packages', hi: 'ऑल-इंडिया प्रीमियम टूर पैकेज', pa: 'ਆਲ-ਇੰਡੀਆ ਪ੍ਰੀਮੀਅਮ ਟੂਰ ਪੈਕੇਜ', gu: 'ઓલ-ઇન્ડિયા પ્રીમિયમ ટૂર પેકેજ' },
  packagesSub: {
    en: 'Handcrafted itineraries with dedicated vehicle and experienced hill & heritage chauffeurs.',
    hi: 'विशेष टूर प्लान, जिसमें गाड़ी और अनुभवी ड्राइवर आपके साथ पूरे सफर में रहते हैं।',
    pa: 'ਵਿਸ਼ੇਸ਼ ਟੂਰ ਪਲਾਨ, ਜਿਸ ਵਿੱਚ ਗੱਡੀ ਅਤੇ ਤਜਰਬੇਕਾਰ ਡਰਾਈਵਰ ਪੂਰੇ ਸਫ਼ਰ ਵਿੱਚ ਨਾਲ ਰਹਿੰਦੇ ਹਨ।',
    gu: 'વિશેષ ટૂર પ્લાન, જેમાં ગાડી અને અનુભવી ડ્રાઇવર આખી યાત્રા દરમિયાન તમારી સાથે રહે છે.',
  },
  searchPackagesPlaceholder: {
    en: 'Search holiday packages (e.g. Manali, Kerala, Agra, Shimla)...',
    hi: 'पैकेज खोजें (जैसे मनाली, केरल, आगरा, शिमला)...',
    pa: 'ਪੈਕੇਜ ਲੱਭੋ (ਜਿਵੇਂ ਮਨਾਲੀ, ਕੇਰਲਾ, ਆਗਰਾ)...',
    gu: 'પેકેજ શોધો (જેમ કે મનાલી, કેરળ, આગ્રા, શિમલા)...',
  },
  bookPackageBtn: { en: 'Book Tour Package', hi: 'यह टूर पैकेज बुक करें', pa: 'ਇਹ ਟੂਰ ਪੈਕੇਜ ਬੁੱਕ ਕਰੋ', gu: 'આ ટૂર પેકેજ બુક કરો' },
  viewItinerary: { en: 'View Day-by-Day Itinerary', hi: 'पूरा यात्रा कार्यक्रम देखें', pa: 'ਪੂਰਾ ਸ਼ਡਿਊਲ ਦੇਖੋ', gu: 'આખો પ્રવાસ કાર્યક્રમ જુઓ' },
  hideItinerary: { en: 'Hide Itinerary', hi: 'यात्रा कार्यक्रम छुपाएँ', pa: 'ਸ਼ਡਿਊਲ ਛੁਪਾਓ', gu: 'કાર્યક્રમ છુપાવો' },
  packageIncludes: { en: 'Package Inclusions:', hi: 'पैकेज में शामिल:', pa: 'ਪੈਕੇਜ  ਵਿੱਚ ਸ਼ਾਮਲ:', gu: 'પેકેજમાં સમાવિષ્ટ:' },
  freeCancellation: { en: 'Free Date Rescheduling • 24/7 Driver On Call', hi: 'तारीख बदलने की छूट • 24/7 ड्राइवर उपलब्ध', pa: 'ਮਿਤੀ ਬਦਲਣ ਦੀ ਛੋਟ • 24/7 ਡਰਾਈਵਰ ਹਾਜ਼ਰ', gu: 'તારીખ બદલવાની છૂટ • 24/7 ડ્રાઇવર હાજર' },
  keyDestinations: { en: 'Key Destinations', hi: 'प्रमुख दर्शनीय स्थल', pa: 'ਮੁੱਖ ਥਾਵਾਂ', gu: 'મુખ્ય જોવાલાયક સ્થળો' },

  // Airport & Kerala Hub
  airportHubTag: {
    en: 'Scenic Corridors & Flight Connections',
    hi: 'खूबसूरत रूट्स व फ्लाइट ट्रांसफर',
    pa: 'ਸੁੰਦਰ ਰੂਟਸ ਅਤੇ ਫਲਾਈਟ ਟ੍ਰਾਂਸਫਰ',
    gu: 'સુંદર રૂટ્સ અને ફ્લાઇટ ટ્રાન્સફર',
  },
  airportHubTitle: { en: 'Airports & Kerala Touring Hub', hi: 'एयरपोर्ट ट्रांसफर व केरल टूरिंग हब', pa: 'ਏਅਰਪੋਰਟ ਟ੍ਰਾਂਸਫਰ ਅਤੇ ਕੇਰਲਾ ਟੂਰਿੰਗ ਹੱਬ', gu: 'એરપોર્ટ ટ્રાન્સફર અને કેરળ ટૂરિંગ હબ' },
  airportHubSub: {
    en: 'Punctual flight pickups with flight tracking and scenic Western Ghats corridors.',
    hi: 'फ्लाइट ट्रैकिंग के साथ समय पर पिकअप और खूबसूरत केरल व वेस्टर्न घाट्स की यात्रा।',
    pa: 'ਫਲਾਈਟ ਟ੍ਰੈਕਿੰਗ ਨਾਲ ਸਮੇਂ ਸਿਰ ਪਿਕਅਪ ਅਤੇ ਖੂਬਸੂਰਤ ਕੇਰਲਾ ਰੂਟਸ।',
    gu: 'ફ્લાઇટ ટ્રેકિંગ સાથે સમયસર પિકઅપ અને સુંદર કેરળ તેમજ પશ્ચિમ ઘાટની યાત્રા.',
  },
  tabKerala: { en: '🌴 Kerala & South Corridors', hi: '🌴 केरल व दक्षिण भारत', pa: '🌴 ਕੇਰਲਾ ਅਤੇ ਦੱਖਣੀ ਭਾਰਤ', gu: '🌴 કેરળ અને દક્ષિણ ભારત' },
  tabAirports: { en: '✈️ Major Airport Drops', hi: '✈️ मुख्य एयरपोर्ट ट्रांसफर', pa: '✈️ ਮੁੱਖ ਏਅਰਪੋਰਟ ਟ੍ਰਾਂਸਫਰ', gu: '✈️ મુખ્ય એરપોર્ટ ટ્રાન્સફર' },
  tabHills: { en: '🏔️ Hill Stations & Pilgrimage', hi: '🏔️ पहाड़ी व धार्मिक स्थल', pa: '🏔️ ਪਹਾੜੀ ਅਤੇ ਤੀਰਥ ਸਥਾਨ', gu: '🏔️ પર્વતીય અને યાત્રાધામો' },
  reserveCorridorBtn: { en: 'Reserve Cab for this Route', hi: 'इस रूट के लिए कैब बुक करें', pa: 'ਇਸ ਰੂਟ ਲਈ ਕੈਬ ਬੁੱਕ ਕਰੋ', gu: 'આ રૂટ માટે કેબ બુક કરો' },

  // Security & Safety
  safetyTag: {
    en: 'Zero Compromise on Traveler Safety',
    hi: 'यात्री सुरक्षा से कोई समझौता नहीं',
    pa: 'ਯਾਤਰੀ ਸੁਰੱਖਿਆ ਨਾਲ ਕੋਈ ਸਮਝੌਤਾ ਨਹੀਂ',
    gu: 'મુસાફર સુરક્ષા સાથે કોઈ બાંધછોડ નહીં',
  },
  safetyTitle: { en: 'Your Safety Is Our Top Priority', hi: 'आपकी सुरक्षा हमारी सर्वोच्च प्राथमिकता', pa: 'ਤੁਹਾਡੀ ਸੁਰੱਖਿਆ ਸਾਡੀ ਪਹਿਲੀ ਤਰਜੀਹ', gu: 'તમારી સુરક્ષા અમારી પ્રથમ પ્રાથમિકતા' },
  safetySub: {
    en: '100% verified commercial operations with police-cleared drivers and live GPS monitoring.',
    hi: '100% अधिकृत कमर्शियल गाड़ियाँ, पुलिस-वेरिफाइड ड्राइवर्स और 24/7 लाइव जीपीएस मॉनिटरिंग।',
    pa: '100% ਅਧਿਕਾਰਤ ਕਮਰਸ਼ੀਅਲ ਗੱਡੀਆਂ, ਪੁਲਿਸ-ਵੈਰੀਫਾਈਡ ਡਰਾਈਵਰ ਅਤੇ ਲਾਈਵ ਜੀਪੀਐਸ ਨਿਗਰਾਨੀ।',
    gu: '100% અધિકૃત કમર્શિયલ વાહનો, પોલીસ-વેરિફાઇડ ડ્રાઇવરો અને 24/7 લાઇવ જીપીએસ મોનિટરિંગ.',
  },

  // Reviews & Stats
  reviewsTitle: { en: 'Trusted by 1,850+ Travelers Across India', hi: 'भारत भर में 1,850+ यात्रियों का भरोसा', pa: 'ਭਾਰਤ ਭਰ ਦੇ 1,850+ ਯਾਤਰੀਆਂ ਦਾ ਭਰੋਸਾ', gu: 'સમગ્ર ભારતમાં 1,850+ પ્રવાસીઓનો વિશ્વાસ' },
  reviewsSub: { en: 'Genuine feedback from families, corporate teams, and solo travelers.', hi: 'परिवारों, कॉर्पोरेट यात्रियों और पर्यटकों के असली रिव्यू।', pa: 'ਪਰਿਵਾਰਾਂ, ਕਾਰਪੋਰੇਟ ਟੀਮਾਂ ਅਤੇ ਸੈਲਾਨੀਆਂ ਦੇ ਅਸਲ ਰਿਵਿਊ।', gu: 'પરિવારો, કોર્પોરેટ પ્રવાસીઓ અને પ્રવાસીઓના સાચા રિવ્યૂ.' },

  // FAQ Section
  faqTitle: { en: 'Frequently Asked Questions', hi: 'अक्सर पूछे जाने वाले सवाल', pa: 'ਅਕਸਰ ਪੁੱਛੇ ਜਾਂਦੇ ਸਵਾਲ', gu: 'વારંવાર પૂછાતા પ્રશ્નો' },
  faqSub: { en: 'Clear, transparent answers about pricing, cars, permits, and booking.', hi: 'किराया, गाड़ियाँ, परमिट और बुकिंग से जुड़े साफ-सुथरे जवाब।', pa: 'ਕਿਰਾਇਆ, ਗੱਡੀਆਂ, ਪਰਮਿਟ ਅਤੇ ਬੁਕਿੰਗ ਬਾਰੇ ਸਪੱਸ਼ਟ ਜਵਾਬ।', gu: 'ભાડું, ગાડીઓ, પરમિટ અને બુકિંગ અંગે સ્પષ્ટ જવાબો.' },

  // Footer
  footerAbout: {
    en: 'FirstFly Tours & Travels is India’s premier verified commercial cab & luxury traveller service. Specialized in outstation family tours, airport drops, hill stations, and corporate travel.',
    hi: 'FirstFly Tours & Travels भारत की प्रमुख अधिकृत कमर्शियल कैब व लक्ज़री ट्रेवलर सेवा है। आउटस्टेशन फैमिली ट्रिप, एयरपोर्ट ट्रांसफर और हिल स्टेशन के लिए सबसे भरोसेमंद।',
    pa: 'FirstFly Tours & Travels ਭਾਰਤ ਦੀ ਪ੍ਰਮੁੱਖ ਅਧਿਕਾਰਤ ਕਮਰਸ਼ੀਅਲ ਕੈਬ ਤੇ ਲਗਜ਼ਰੀ ਟ੍ਰੈਵਲਰ ਸਰਵਿਸ ਹੈ। ਆਊਟਸਟੇਸ਼ਨ ਫੈਮਿਲੀ ਟੂਰ, ਏਅਰਪੋਰਟ ਅਤੇ ਹਿੱਲ ਸਟੇਸ਼ਨਾਂ ਲਈ ਸਭ ਤੋਂ ਭਰੋਸੇਮੰਦ।',
    gu: 'FirstFly Tours & Travels ભારતની અગ્રણી અધિકૃત કમર્શિયલ કેબ અને લક્ઝરી ટ્રાવેલર સેવા છે. આઉટસ્ટેશન ફેમિલી ટ્રીપ, એરપોર્ટ અને હિલ સ્ટેશન માટે સૌથી વિશ્વસનીય.',
  },
  footerQuickLinks: { en: 'Quick Links', hi: 'महत्वपूर्ण लिंक', pa: 'ਜ਼ਰੂਰੀ ਲਿੰਕ', gu: 'ઝડપી લિંક્સ' },
  footerPopularCorridors: { en: 'Popular Routes', hi: 'लोकप्रिय रूट', pa: 'ਮਸ਼ਹੂਰ ਰੂਟ', gu: 'લોકપ્રિય રૂટ્સ' },
  footerHelplineTitle: { en: '24/7 Live Helpline', hi: '24/7 हेल्पलाइन नंबर', pa: '24/7 ਹੈਲਪਲਾਈਨ ਨੰਬਰ', gu: '24/7 હેલ્પલાઇન નંબર' },
  footerEmergencyText: { en: 'Instant Dispatch Manager Available 24 Hours', hi: 'डिस्पैच मैनेजर 24 घंटे उपलब्ध', pa: 'ਡਿਸਪੈਚ ਮੈਨੇਜਰ 24 ਘੰਟੇ ਹਾਜ਼ਰ', gu: 'ડિસ્પેચ મેનેજર 24 કલાક ઉપલબ્ધ' },
  footerCopyright: {
    en: '© 2026 FirstFly Tours & Travels. All Rights Reserved. Commercial Tourist Permit Fleet.',
    hi: '© 2026 FirstFly Tours & Travels. सर्वाधिकार सुरक्षित। अधिकृत कमर्शियल टूरिस्ट परमिट फ्लीट।',
    pa: '© 2026 FirstFly Tours & Travels. ਸਾਰੇ ਹੱਕ ਰਾਖਵੇਂ ਹਨ। ਅਧਿਕਾਰਤ ਕਮਰਸ਼ੀਅਲ ਟੂਰਿਸਟ ਪਰਮਿਟ ਫਲੀਟ।',
    gu: '© 2026 FirstFly Tours & Travels. સર્વાધિકાર સુરક્ષિત. અધિકૃત કમર્શિયલ ટૂરિસ્ટ પરમિટ ફ્લીટ.',
  },

  // Mobile Bar
  mbCall: { en: 'Call Now', hi: 'कॉल करें', pa: 'ਕਾਲ ਕਰੋ', gu: 'કૉલ કરો' },
  mbWhatsApp: { en: 'WhatsApp', hi: 'व्हाट्सएप', pa: 'ਵਟਸਐਪ', gu: 'વોટ્સએપ' },
  mbBook: { en: 'Book Cab', hi: 'गाड़ी बुक', pa: 'ਗੱਡੀ ਬੁੱਕ', gu: 'ગાડી બુક' },
  mbAI: { en: 'AI Desk', hi: 'AI सहायता', pa: 'AI ਡੈਸਕ', gu: 'AI સહાય' },

  // Booking Modal
  bookingModalTitle: { en: 'Instant Booking & Price Confirmation', hi: 'तुरंत कैब बुकिंग व कन्फर्मेशन', pa: 'ਤੁਰੰਤ ਕੈਬ ਬੁਕਿੰਗ ਤੇ ਕਨਫਰਮੇਸ਼ਨ', gu: 'તાત્કાલિક કેબ બુકિંગ અને કન્ફર્મેશન' },
  bookingModalSub: { en: 'Zero advance payment required. Pay driver directly after your journey.', hi: 'कोई एडवांस पेमेंट जरूरी नहीं। यात्रा के बाद ड्राइवर को सीधे भुगतान करें।', pa: 'ਕੋਈ ਪੇਸ਼ਗੀ ਭੁਗਤਾਨ ਦੀ ਲੋੜ ਨਹੀਂ। ਸਫ਼ਰ ਤੋਂ ਬਾਅਦ ਡਰਾਈਵਰ ਨੂੰ ਸਿੱਧਾ ਭੁਗਤਾਨ ਕਰੋ।', gu: 'કોઈ એડવાન્સ ચુકવણી જરૂરી નથી. સફર પછી સીધા ડ્રાઇવરને ચૂકવો.' },
  fullNameLabel: { en: 'Your Full Name', hi: 'आपका पूरा नाम', pa: 'ਤੁਹਾਡਾ ਪੂਰਾ ਨਾਮ', gu: 'તમારું પૂરું નામ' },
  phoneLabel: { en: 'Mobile Number (WhatsApp)', hi: 'मोबाइल नंबर (व्हाट्सएप)', pa: 'ਮੋਬਾਈਲ ਨੰਬਰ (ਵਟਸਐਪ)', gu: 'મોબાઈલ નંબર (વોટ્સએપ)' },
  pickupLabel: { en: 'Pickup Location', hi: 'पिकअप स्थान / शहर', pa: 'ਪਿਕਅਪ ਸਥਾਨ', gu: 'પિકઅપ સ્થળ' },
  dropLabel: { en: 'Drop Destination', hi: 'ड्रॉप स्थान (गंतव्य)', pa: 'ਡ੍ਰੌਪ ਸਥਾਨ', gu: 'ડ્રોપ સ્થળ' },
  dateLabel: { en: 'Journey Date', hi: 'यात्रा की तारीख', pa: 'ਸਫ਼ਰ ਦੀ ਮਿਤੀ', gu: 'મુસાફરીની તારીખ' },
  vehicleLabel: { en: 'Select Vehicle', hi: 'गाड़ी चुनें', pa: 'ਗੱਡੀ ਚੁਣੋ', gu: 'ગાડી પસંદ કરો' },
  notesLabel: { en: 'Special Requests / Luggage Count', hi: 'विशेष अनुरोध / बैग की संख्या', pa: 'ਖਾਸ ਬੇਨਤੀ / ਬੈਗਾਂ ਦੀ ਗਿਣਤੀ', gu: 'ખાસ વિનંતી / સામાનની વિગત' },
  confirmBookingBtn: { en: 'Confirm Reservation (Zero Advance)', hi: 'बुकिंग कन्फर्म करें (शून्य एडवांस)', pa: 'ਬੁਕਿੰਗ ਕਨਫਰਮ ਕਰੋ (ਜ਼ੀਰੋ ਐਡਵਾਂਸ)', gu: 'બુકિંગ કન્ફર્મ કરો (ઝીરો એડવાન્સ)' },

  // Owner Portal
  ownerModalTitle: { en: 'FirstFly 24/7 Owner Dispatch & Leads Center', hi: 'FirstFly मालिक डिस्पैच व लीड्स केंद्र', pa: 'FirstFly ਮਾਲਕ ਡਿਸਪੈਚ ਅਤੇ ਲੀਡਸ ਸੈਂਟਰ', gu: 'FirstFly ઓનર ડિસ્પેચ અને લીડ્સ સેન્ટર' },
  ownerLiveConnected: { en: 'Live Backend Connected — Real-time customer tracking', hi: 'लाइव बैकएंड कनेक्टेड — ग्राहकों की सीधी जानकारी', pa: 'ਲਾਈਵ ਬੈਕਐਂਡ ਕਨੈਕਟਡ — ਗਾਹਕਾਂ ਦੀ ਸਿੱਧੀ ਜਾਣਕਾਰੀ', gu: 'લાઈવ બેકએન્ડ કનેક્ટેડ — ગ્રાહકોની સીધી વિગત' },
  ownerTabCallbacks: { en: 'Callbacks (Pending)', hi: 'कॉल बैक अनुरोध', pa: 'ਕਾਲ ਬੈਕ ਬੇਨਤੀਆਂ', gu: 'કૉલ બેક વિનંતીઓ' },
  ownerTabBookings: { en: 'Cab Bookings', hi: 'कैब बुकिंग्स', pa: 'ਕੈਬ ਬੁਕਿੰਗਾਂ', gu: 'કેબ બુકિંગ્સ' },
  ownerTabChats: { en: 'AI Inquiries & Hot Leads', hi: 'ग्राहक सवाल व चैट', pa: 'ਗਾਹਕ ਸਵਾਲ ਤੇ ਚੈਟ', gu: 'ગ્રાહક પ્રશ્નો અને ચેટ' },
  ownerActionCall: { en: 'Call Customer', hi: 'ग्राहक को कॉल करें', pa: 'ਗਾਹਕ ਨੂੰ ਕਾਲ ਕਰੋ', gu: 'ગ્રાહકને કૉલ કરો' },
  ownerActionWhatsApp: { en: 'WhatsApp Customer', hi: 'व्हाट्सएप भेजें', pa: 'ਵਟਸਐਪ ਭੇਜੋ', gu: 'વોટ્સએપ મોકલો' },
  ownerMarkContacted: { en: 'Mark Contacted', hi: 'संपर्क किया मार्क करें', pa: 'ਗੱਲ ਹੋ ਗਈ', gu: 'સંપર્ક થયો' },
  ownerMarkConfirmed: { en: 'Confirm Booking', hi: 'बुकिंग कन्फर्म करें', pa: 'ਬੁਕਿੰਗ ਕਨਫਰਮ', gu: 'બુકિંગ કન્ફર્મ' },
  ownerPinPrompt: { en: 'Enter Owner PIN (Default: 9877)', hi: 'मालिक पिन डालें (डिफ़ॉल्ट: 9877)', pa: 'ਮਾਲਕ ਪਿੰਨ ਭਰੋ (ਡਿਫਾਲਟ: 9877)', gu: 'ઓનર પિન નાખો (ડિફોલ્ટ: 9877)' },
  ownerUnlockBtn: { en: 'Access Owner Dashboard', hi: 'डैशबोर्ड खोलें', pa: 'ਡੈਸ਼ਬੋਰਡ ਖੋਲ੍ਹੋ', gu: 'ડેશબોર્ડ ખોલો' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('firstfly_lang');
      if (saved === 'hi' || saved === 'en' || saved === 'pa' || saved === 'gu') return saved as Language;
    }
    return 'en'; // Clean English by default
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('firstfly_lang', lang);
    }
  };

  const t = (key: string, fallback?: string): string => {
    const entry = DICTIONARY[key];
    if (!entry) return fallback || key;
    return entry[language] || entry.en || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
