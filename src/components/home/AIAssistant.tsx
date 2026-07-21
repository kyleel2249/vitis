'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Bot, User, Loader2 } from 'lucide-react';

type Message = { role: 'user' | 'assistant'; content: string; timestamp: Date };

const SUGGESTIONS = [
  'Find me wireless headphones under $100',
  'What are the best deals today?',
  'I need a gift for a 10-year-old',
  'Compare iPhone 16 vs Galaxy S25',
];

const RESPONSES: Record<string, string> = {
  default: "Hi! I'm your AI shopping assistant. I can help you find products, compare options, track orders, and discover deals. What are you looking for today?",
  headphones: "Great choice! Here are my top wireless headphone picks under $100:\n\n1. **SoundCore Life Q30** - $59.99 (Best value, ANC)\n2. **Sony WH-CH520** - $49.99 (Excellent battery life)\n3. **JBL Tune 770NC** - $79.99 (Premium sound)\n\nWould you like more details on any of these?",
  deals: "🔥 Today's hottest deals:\n\n• Up to 70% off Summer Fashion\n• Flash Sale: Electronics (4h left)\n• Buy 2 Get 1 Free on Beauty\n• Free shipping on orders over $50\n\nCheck the Flash Sale section below for time-limited offers!",
  gift: "Perfect! For a 10-year-old, I recommend:\n\n🎮 **LEGO Technic Sets** - $39-89\n🎨 **Art & Craft Kit** - $24.99\n📚 **Adventure Book Series** - $14.99\n🚀 **Coding Robot Kit** - $49.99\n\nShall I filter by your budget?",
};

function getResponse(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes('headphone') || lower.includes('wireless')) return RESPONSES.headphones;
  if (lower.includes('deal') || lower.includes('sale') || lower.includes('offer')) return RESPONSES.deals;
  if (lower.includes('gift') || lower.includes('kid') || lower.includes('child') || lower.includes('year-old')) return RESPONSES.gift;
  return "That's a great question! Let me search our catalog for you...\n\nBased on your query, I found **247 relevant products** across multiple categories. The top results include highly-rated items from verified vendors with fast shipping options.\n\nWould you like me to narrow down by price range, brand, or category?";
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: RESPONSES.default, timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: 'user', content: text, timestamp: new Date() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);
    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 500));
    setTyping(false);
    setMessages((m) => [...m, { role: 'assistant', content: getResponse(text), timestamp: new Date() }]);
  };

  return (
    <>
      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary-600 text-white shadow-glow flex items-center justify-center transition-all ${open ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="Open AI Assistant"
      >
        <Sparkles className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
            style={{ height: '500px' }}
          >
            {/* Header */}
            <div className="bg-primary-600 px-5 py-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">Vitis AI</p>
                <p className="text-white/70 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                  Always here to help
                </p>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-hide">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${
                    msg.role === 'assistant' ? 'bg-primary-100' : 'bg-gray-200'
                  }`}>
                    {msg.role === 'assistant' ? <Bot className="w-4 h-4 text-primary-600" /> : <User className="w-4 h-4 text-gray-600" />}
                  </div>
                  <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === 'assistant'
                      ? 'bg-gray-100 text-gray-800 rounded-tl-sm'
                      : 'bg-primary-600 text-white rounded-tr-sm'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm">
                    <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)}
                    className="flex-shrink-0 text-xs bg-gray-100 hover:bg-primary-50 hover:text-primary-600 text-gray-600 px-3 py-1.5 rounded-full transition-colors border border-gray-200 hover:border-primary-200">
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="border-t border-gray-100 px-4 py-3 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send(input)}
                placeholder="Ask me anything…"
                className="flex-1 text-sm bg-gray-50 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
              />
              <button onClick={() => send(input)} disabled={!input.trim() || typing}
                className="w-9 h-9 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
