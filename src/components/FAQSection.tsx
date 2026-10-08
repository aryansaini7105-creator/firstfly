import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Phone, MessageSquare } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/travelData';
import { useLanguage } from '../context/LanguageContext';

export const FAQSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const MULTILINGUAL_FAQS = [
    {
      q: {
        en: 'How do I book a vehicle with FirstFly?',
        hi: 'FirstFly के साथ गाड़ी कैसे बुक करें?',
        pa: 'FirstFly ਨਾਲ ਗੱਡੀ ਕਿਵੇਂ ਬੁੱਕ ਕਰੀਏ?',
        gu: 'FirstFly સાથે ગાડી કેવી રીતે બુક કરવી?',
      },
      a: {
        en: 'You can select your pickup and drop city, travel date, and preferred vehicle using our calculator or 1-tap booking options. You can immediately send a WhatsApp request to +91 98771 24650 or submit our online form. Our 24/7 travel desk confirms driver details and vehicle number within 5 minutes.',
        hi: 'आप ऊपर दिए गए 1-टैप बुकिंग विकल्पों या कैलकुलेटर से अपनी गाड़ी चुन सकते हैं। सीधा +91 98771 24650 पर कॉल या व्हाट्सएप करें। हमारा 24/7 सहायता डेस्क 5 मिनट में ड्राइवर और गाड़ी की डिटेल्स भेज देता है।',
        pa: 'ਤੁਸੀਂ 1-ਟੈਪ ਬੁਕਿੰਗ ਜਾਂ ਕੈਲਕੁਲੇਟਰ ਰਾਹੀਂ ਗੱਡੀ ਚੁਣ ਸਕਦੇ ਹੋ। ਸਿੱਧਾ +91 98771 24650  ਉੱਤੇ ਕਾਲ ਜਾਂ ਵਟਸਐਪ ਕਰੋ। ਸਾਡਾ ਡੈਸਕ 5 ਮਿੰਟਾਂ  ਵਿੱਚ ਡਰਾਈਵਰ ਦਾ ਨੰਬਰ ਤੇ ਫੋਟੋ ਭੇਜ ਦੇਵੇਗਾ।',
        gu: 'તમે 1-ટેપ બુકિંગ અથવા કેલ્ક્યુલેટર દ્વારા ગાડી પસંદ કરી શકો છો. સીધો +91 98771 24650 પર કૉલ અથવા વોટ્સએપ કરો. અમારું હેલ્પ ડેસ્ક 5 મિનિટમાં ડ્રાઇવર અને ગાડીની વિગતો મોકલી આપશે.',
      },
    },
    {
      q: {
        en: 'Are all FirstFly vehicles commercially registered?',
        hi: 'क्या FirstFly की सभी गाड़ियाँ कमर्शियल अधिकृत हैं?',
        pa: 'ਕੀ FirstFly ਦੀਆਂ ਸਾਰੀਆਂ ਗੱਡੀਆਂ ਕਮਰਸ਼ੀਅਲ ਰਜਿਸਟਰਡ ਹਨ?',
        gu: 'શું FirstFly ની બધી ગાડીઓ કમર્શિયલ અધિકૃત છે?',
      },
      a: {
        en: 'Yes, 100% of our fleet (including our Innova Crysta PB 01 B 0051 and Ertiga PB 01 G 3601) carry valid All-India Tourist Commercial Yellow Plates, speed governors, fitness certificates, and comprehensive passenger insurance.',
        hi: 'हाँ, हमारी 100% गाड़ियाँ (इनोवा क्रिस्टा PB 01 B 0051, अर्टिगा PB 01 G 3601 आदि) वैध ऑल-इंडिया टूरिस्ट कमर्शियल येलो प्लेट, स्पीड गवर्नर, फिटनेस सर्टिफिकेट और सवारी बीमा के साथ चलती हैं।',
        pa: 'ਹਾਂਜੀ, ਸਾਡੀਆਂ 100% ਗੱਡੀਆਂ ਅਧਿਕਾਰਤ ਕਮਰਸ਼ੀਅਲ ਪੀਲੀ ਪਲੇਟ (Yellow Plate), ਆਲ-ਇੰਡੀਆ ਟੂਰਿਸਟ ਪਰਮਿਟ ਅਤੇ ਸਵਾਰੀ ਬੀਮੇ ਨਾਲ ਚਲਦੀਆਂ ਹਨ।',
        gu: 'હા, અમારી 100% ગાડીઓ અધિકૃત કમર્શિયલ યલો પ્લેટ, ઓલ-ઇન્ડિયા ટૂરિસ્ટ પરમિટ અને મુસાફર વીમા સાથે ચાલે છે.',
      },
    },
    {
      q: {
        en: 'Are toll taxes, state border permits, and parking charges included?',
        hi: 'क्या टोल टैक्स, स्टेट बॉर्डर टैक्स और पार्किंग किराया में शामिल है?',
        pa: 'ਕੀ ਟੋਲ ਟੈਕਸ, ਬਾਰਡਰ ਟੈਕਸ ਅਤੇ ਪਾਰਕਿੰਗ ਕਿਰਾਏ ਵਿੱਚ ਸ਼ਾਮਲ ਹਨ?',
        gu: 'શું ટોલ ટેક્સ, બોર્ડર ટેક્સ અને પાર્કિંગ ભાડામાં સામેલ છે?',
      },
      a: {
        en: 'We believe in 100% billing transparency. You can choose an all-inclusive flat pricing package or pay exact FASTag tolls at actuals with valid receipts. No hidden surprises.',
        hi: 'हम 100% पारदर्शी बिलिंग में विश्वास करते हैं। आप ऑल-इनक्लूसिव फिक्स्ड रेट चुन सकते हैं या असली फास्टैग रसीद के अनुसार टोल दे सकते हैं। कोई छुपा हुआ चार्ज नहीं लिया जाता।',
        pa: 'ਅਸੀਂ 100% ਪਾਰਦਰਸ਼ੀ ਬਿਲਿੰਗ ਦਿੰਦੇ ਹਾਂ। ਤੁਸੀਂ ਆਲ-ਇਨਕਲੂਸਿਵ ਫਲੈਟ ਰੇਟ ਲੈ ਸਕਦੇ ਹੋ ਜਾਂ ਅਸਲ ਫਾਸਟੈਗ ਪਰਚੀ ਮੁਤਾਬਕ ਭੁਗਤਾਨ ਕਰ ਸਕਦੇ ਹੋ। ਕੋਈ ਲੁਕਵਾਂ ਚਾਰਜ ਨਹੀਂ।',
        gu: 'અમે 100% પારદર્શક બિલિંગ આપીએ છીએ. તમે ઓલ-ઇનક્લુસિવ ફ્લેટ રેટ લઈ શકો છો અથવા ફાસ્ટેગ રસીદ મુજબ ચૂકવી શકો છો. કોઈ છુપો ખર્ચ નહીં.',
      },
    },
    {
      q: {
        en: 'Can I book one-way outstation cabs across India?',
        hi: 'क्या मैं वन-वे (एक तरफा) आउटस्टेशन कैब बुक कर सकता हूँ?',
        pa: 'ਕੀ ਮੈਂ ਵਨ-ਵੇ (ਇੱਕ ਪਾਸੜ) ਆਊਟਸਟੇਸ਼ਨ ਕੈਬ ਬੁੱਕ ਕਰ ਸਕਦਾ ਹਾਂ?',
        gu: 'શું હું વન-વે (એક તરફી) આઉટસ્ટેશન કેબ બુક કરી શકું?',
      },
      a: {
        en: 'Yes! We specialize in one-way outstation drops as well as round trips. Popular routes include Delhi-Chandigarh, Chandigarh-Manali, Delhi-Agra, Delhi-Jaipur, Cochin-Munnar, and Bangalore-Coorg.',
        hi: 'हाँ! हम वन-वे ड्रॉप और राउंड ट्रिप दोनों में विशेषज्ञ हैं। लोकप्रिय रूट्स में दिल्ली-चंडीगढ़, चंडीगढ़-मनाली, दिल्ली-आगरा, दिल्ली-जयपुर, कोचीन-मुन्नार और बैंगलोर-कूर्ગ शामिल हैं।',
        pa: 'ਹਾਂਜੀ! ਅਸੀਂ ਵਨ-ਵੇ ਅਤੇ ਰਾਊਂਡ-ਟ੍ਰਿਪ ਦੋਵਾਂ  ਵਿੱਚ ਸਰਵਿਸ ਦਿੰਦੇ ਹਾਂ। ਦਿੱਲੀ-ਚੰਡੀਗੜ੍ਹ, ਮਨਾਲੀ, ਆਗਰਾ, ਜੈਪੁਰ, ਕੇਰਲਾ ਅਤੇ ਹਿਮਾਚਲ ਸਾਡੇ ਮੁੱਖ ਰੂਟ ਹਨ।',
        gu: 'હા! અમે વન-વે અને રાઉન્ડ-ટ્રીપ બંનેમાં સેવા આપીએ છીએ. દિલ્હી-ચંડીગઢ, મનાલી, આગ્રા, જયપુર, કેરળ અને બેંગલોર અમારા મુખ્ય રૂટ્સ છે.',
      },
    },
    {
      q: {
        en: 'What is the cancellation and payment policy?',
        hi: 'कैंसिलेशन और भुगतान की क्या नीति है?',
        pa: 'ਕੈਂਸਲੇਸ਼ਨ ਅਤੇ ਭੁਗਤਾਨ ਦਾ ਕੀ ਨਿਯਮ ਹੈ?',
        gu: 'કેન્સલેશન અને ચુકવણીની શું નીતિ છે?',
      },
      a: {
        en: 'Zero advance payment required to book! You can pay the driver directly at the end of the trip via cash or UPI. Free rescheduling anytime before driver dispatch.',
        hi: 'बुकिंग के लिए कोई एडवांस पेमेंट जरूरी नहीं! आप अपनी यात्रा खत्म होने पर ड्राइवर को सीधे कैश या UPI से भुगतान कर सकते हैं। यात्रा की तारीख बदलना बिल्कुल मुफ्त है।',
        pa: 'ਬੁਕਿੰਗ ਲਈ ਕੋਈ ਐਡਵਾਂਸ ਪੈਸੇ ਨਹੀਂ ਦੇਣੇ! ਸਫ਼ਰ ਖਤਮ ਹੋਣ  ਉੱਤੇ ਡਰਾਈਵਰ ਨੂੰ ਸਿੱਧਾ ਕੈਸ਼ ਜਾਂ UPI ਰਾਹੀਂ ਭੁਗਤਾਨ ਕਰੋ। ਤਾਰੀਖ ਬਦਲਣਾ ਬਿਲਕੁਲ ਮੁਫਤ ਹੈ।',
        gu: 'બુકિંગ માટે કોઈ એડવાન્સ ચુકવણી જરૂરી નથી! મુસાફરી પૂરી થયા પછી ડ્રાઇવરને સીધા રોકડ અથવા UPI થી ચૂકવણી કરી શકો છો. તારીખ બદલવી બિલકુલ મફત છે.',
      },
    },
  ];

  return (
    <section id="faqs" className="py-20 bg-slate-950 relative border-t border-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-3">
            <HelpCircle className="w-3.5 h-3.5" /> {t('faqTitle')}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-heading tracking-tight">
            {t('faqTitle')}
          </h2>
          <p className="mt-2 text-slate-400 text-sm sm:text-base">
            {t('faqSub')}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {MULTILINGUAL_FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const questionText = faq.q[language] || faq.q.en;
            const answerText = faq.a[language] || faq.a.en;

            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 text-white hover:text-amber-400 transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold font-heading">{questionText}</span>
                  <div className="p-1 rounded-lg bg-slate-950 text-slate-400 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-800/80 animate-in fade-in duration-200">
                    {answerText}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions card */}
        <div className="mt-10 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="text-sm font-bold text-white">
              {language === 'hi'
                ? 'अभी भी कोई सवाल या विशेष रूट का प्लान है?'
                : language === 'pa'
                ? 'ਕੋਈ ਹੋਰ ਸਵਾਲ ਜਾਂ ਖਾਸ ਰੂਟ ਦੀ ਜਾਣਕਾਰੀ ਚਾਹੀਦੀ ਹੈ?'
                : language === 'gu'
                ? 'હજી કોઈ પ્રશ્ન અથવા ખાસ રૂટનું આયોજન છે?'
                : 'Still have custom route questions?'}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'hi'
                ? 'हमारे 24/7 फ्लीट मैनेजर से सीधा फोन या व्हाट्सएप पर बात करें।'
                : language === 'pa'
                ? 'ਸਾਡੇ 24/7 ਡਿਸਪੈਚ ਮੈਨੇਜਰ ਨਾਲ ਸਿੱਧਾ ਫੋਨ ਜਾਂ ਵਟਸਐਪ  ਉੱਤੇ ਗੱਲ ਕਰੋ।'
                : language === 'gu'
                ? 'અમારા 24/7 ફ્લીટ મેનેજર સાથે સીધો ફોન અથવા વોટ્સએપ પર સંપર્ક કરો.'
                : 'Our 24/7 fleet manager is available directly on call and WhatsApp.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${COMPANY_DETAILS.phone}`}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{COMPANY_DETAILS.phone}</span>
            </a>
            <a
              href={`https://wa.me/${COMPANY_DETAILS.cleanPhone}?text=Hello%20FirstFly,%20I%20have%20a%20question%20regarding%20cab%20booking.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
