import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Phone,
  Bot,
  User,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { COMPANY_DETAILS, FLEET_DATA } from '../data/travelData';
import { useLanguage } from '../context/LanguageContext';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickActions?: { label: string; action: () => void }[];
}

interface RealTimeChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
}

export const RealTimeChatWidget: React.FC<RealTimeChatWidgetProps> = ({
  isOpen,
  onClose,
  onOpenBooking,
}) => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `👋 **Namaste & Welcome to FirstFly Tours & Travels!**\n\nI am your 24/7 AI Travel Concierge. I can assist you with:\n• Airport transfers (Delhi IGI, Bangalore BLR, Cochin COK, Goa MOPA)\n• Kerala tours (Munnar tea hills, Alleppey backwaters, Varkala cliff)\n• Himalayan hill stations (Manali, Shimla, Rishikesh, Mussoorie)\n• Fleet assignment (Toyota Innova Crysta, Ertiga Hybrid, Force Urbania 17-Seater)\n\nWhere would you like to travel today?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      const historyPayload = messages.slice(-8).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          history: historyPayload,
        }),
      });

      const data = await response.json();
      const replyText =
        data.reply ||
        'Our dispatch desk is active 24/7. Call +91 98771 24650 for instant vehicle assignment!';

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `Thank you for your message! Our dispatch desk is active 24/7 across all routes in India.\n\nFor guaranteed immediate confirmation, you can reach our manager directly on **+91 98771 24650** or tap below to chat on WhatsApp.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickChip = (chipText: string) => {
    handleSendMessage(chipText);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ${
        isExpanded
          ? 'inset-4 sm:inset-10'
          : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[420px] h-[580px] max-h-[85vh]'
      }`}
    >
      <div className="w-full h-full bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl shadow-slate-950 flex flex-col overflow-hidden backdrop-blur-xl">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white font-heading">
                  FirstFly AI Concierge
                </h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  LIVE 24/7
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Instant Fare Quotation & Vehicle Dispatch
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
              title={isExpanded ? 'Minimize' : 'Maximize'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
              title="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Status Bar */}
        <div className="bg-slate-950 px-4 py-2 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit Encrypted Chat</span>
          </div>
          <a
            href={`tel:${COMPANY_DETAILS.phone}`}
            className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <Phone className="w-3 h-3" /> {COMPANY_DETAILS.phone}
          </a>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-950/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'bot' && (
                <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                {/* Render markdown style linebreaks and bullets cleanly */}
                <div className="whitespace-pre-wrap space-y-1">
                  {msg.text.split('\n').map((line, i) => {
                    if (line.startsWith('• ') || line.startsWith('- ')) {
                      return (
                        <p key={i} className="pl-2 border-l-2 border-amber-400/40 my-0.5">
                          {line}
                        </p>
                      );
                    }
                    return <p key={i}>{line}</p>;
                  })}
                </div>

                <div
                  className={`text-[9px] mt-1.5 flex justify-end ${
                    msg.sender === 'user' ? 'text-slate-900/70' : 'text-slate-500'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-2.5 justify-start items-center">
              <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
          <span className="text-slate-500 font-semibold shrink-0">
            {language === 'hi' ? 'जल्दी पूछें:' : language === 'pa' ? 'ਤੁਰੰਤ ਪੁੱਛੋ:' : language === 'gu' ? 'ઝડપી પ્રશ્નો:' : 'Quick Ask:'}
          </span>
          {(
            language === 'hi'
              ? [
                  'दिल्ली एयरपोर्ट से आगरा / जयपुर',
                  'केरल मुन्नार व अल्लेप्पी पैकेज',
                  'इनोवा क्रिस्टा का रेट और बुकिंग',
                  'फोर्स अर्बानिया 17-सीटर गाड़ी',
                  'ऑल-इंडिया परमिट व ड्राइवर सुरक्षा',
                ]
              : language === 'pa'
              ? [
                  'ਦਿੱਲੀ ਏਅਰਪੋਰਟ ਤੋਂ ਆਗਰਾ / ਜੈਪੁਰ',
                  'ਹਿਮਾਚਲ ਮਨਾਲੀ ਟੂਰ ਪੈਕੇਜ',
                  'ਇਨੋਵਾ ਕ੍ਰਿਸਟਾ ਦਾ ਰੇਟ ਤੇ ਬੁਕਿੰਗ',
                  '17-ਸੀਟਰ ਅਰਬਾਨੀਆ ਗੱਡੀ',
                  'ਪੁਲਿਸ ਵੈਰੀਫਾਈਡ ਡਰਾਈਵਰ',
                ]
              : language === 'gu'
              ? [
                  'દિલ્હી એરપોર્ટથી આગ્રા / જયપુર',
                  'કેરળ મુન્નાર અને બેકવોટર્સ',
                  'ઇનોવા ક્રિસ્ટા રેટ અને બુકિંગ',
                  '17-સીટર અર્બાનિયા વાન',
                  'ઓલ ઇન્ડિયા પરમિટ અને સુરક્ષા',
                ]
              : [
                  'Delhi Airport to Agra/Jaipur',
                  'Kerala Munnar & Backwaters',
                  'Innova Crysta Availability',
                  'Force Urbania 17-Seater',
                  'Bangalore Airport to Coorg',
                  'All-India Permit & Safety',
                ]
          ).map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickChip(chip)}
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300 border border-slate-800 transition-colors whitespace-nowrap shrink-0"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Message Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              language === 'hi'
                ? 'अपना सवाल या रूट लिखें (जैसे "दिल्ली से मनाली इनोवा")...'
                : language === 'pa'
                ? 'ਆਪਣਾ ਸਫ਼ਰ ਜਾਂ ਸਵਾਲ ਲਿਖੋ (ਜਿਵੇਂ "ਦਿੱਲੀ ਤੋਂ ਆਗਰਾ")...'
                : language === 'gu'
                ? 'તમારો પ્રશ્ન અથવા રૂટ લખો (જેમ કે "દિલ્હીથી મનાલી")...'
                : 'Type your trip, route, or question...'
            }
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 font-bold transition-all shadow-md active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Action Bottom Bar */}
        <div className="bg-slate-950 px-4 py-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              onClose();
              onOpenBooking();
            }}
            className="text-amber-400 hover:underline font-bold flex items-center gap-1"
          >
            <span>Open Booking Engine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <a
            href={`https://wa.me/${COMPANY_DETAILS.cleanPhone}?text=Hello%20FirstFly,%20I%20am%20chatting%20on%20your%20website%20and%20need%20assistance.`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:underline font-bold flex items-center gap-1"
          >
            <span>Connect on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
