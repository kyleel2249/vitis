'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Bot, User, Loader2, ChevronDown } from 'lucide-react';

type Message = { role: 'user' | 'assistant'; content: string; timestamp: Date };

// Suggestion chips covering the full AI Company capability set
const SUGGESTION_GROUPS = [
  { label: '🔍 Find products', query: 'Find me wireless headphones under $100' },
  { label: '🔥 Deals today', query: 'What are the best deals today?' },
  { label: '⚡ Flash sales', query: 'Are there any flash sales right now?' },
  { label: '🗂️ Categories', query: 'Show me all categories' },
  { label: '🎟️ Coupons', query: 'Do you have any active coupon codes?' },
  { label: '👑 Loyalty rewards', query: 'How do loyalty points and rewards work?' },
  { label: '👫 Refer a friend', query: 'Tell me about the referral program' },
  { label: '💎 VIP perks', query: 'What are VIP member benefits?' },
  { label: '⭐ Recommendations', query: 'Show me trending and popular products' },
  { label: '🎂 Birthday offers', query: 'Do you have birthday rewards?' },
  { label: '📦 Order help', query: 'How do I track my order?' },
  { label: '🔄 Returns', query: 'How do I return an item?' },
  { label: '🚚 Shipping info', query: 'What are your shipping options and costs?' },
  { label: '❤️ Wishlist', query: 'How does the wishlist work?' },
  { label: '🔔 Back in stock', query: 'Can I get notified when an item is back in stock?' },
  { label: '📉 Price drops', query: 'How do I get price drop alerts?' },
  { label: '🏪 Sell on Vitis', query: 'How do I become a vendor and sell on Vitis?' },
  { label: '⭐ Leave a review', query: 'How do I leave a product review?' },
];

const WELCOME: Message = {
  role: 'assistant',
  content:
    "Hi! 👋 I'm **Vitis Assistant** — your AI-powered shopping companion.\n\nI'm backed by a full team of AI specialists covering shopping, deals, loyalty, customer success, and more.\n\nWhat can I help you with today?",
  timestamp: new Date(),
};

// Render basic markdown: **bold**, ~~strikethrough~~, *italic*, bullet lines
function renderContent(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    const parts = line
      .split(/(\*\*[^*]+\*\*|~~[^~]+~~|\*[^*]+\*)/)
      .map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('~~') && part.endsWith('~~')) {
          return <span key={j} className="line-through text-gray-400">{part.slice(2, -2)}</span>;
        }
        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
          return <em key={j} className="text-primary-600 not-italic font-medium text-xs">{part.slice(1, -1)}</em>;
        }
        return part;
      });
    return (
      <span key={i}>
        {parts}
        {i < lines.length - 1 && <br />}
      </span>
    );
  });
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: 'user', content: trimmed, timestamp: new Date() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);
    setError(null);
    setShowAllSuggestions(false);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((m) => [
          ...m,
          { role: 'assistant', content: data.reply, timestamp: new Date() },
        ]);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Connection error. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  const visibleSuggestions = showAllSuggestions
    ? SUGGESTION_GROUPS
    : SUGGESTION_GROUPS.slice(0, 6);

  return (
    <>
      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary-600 text-white shadow-glow flex items-center justify-center transition-all ${open ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        aria-label="Open Vitis AI Assistant"
      >
        <Sparkles className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col"
            style={{ height: '560px' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-5 py-3.5 flex items-center gap-3 flex-shrink-0">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm">Vitis AI Assistant</p>
                <p className="text-white/70 text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse" />
                  Multi-specialist AI · Live catalog
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/70 hover:text-white transition-colors flex-shrink-0 p-1 rounded-lg hover:bg-white/10"
                aria-label="Close assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-hide">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${
                    msg.role === 'assistant' ? 'bg-primary-100 dark:bg-primary-900' : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    {msg.role === 'assistant'
                      ? <Bot className="w-4 h-4 text-primary-600" />
                      : <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />}
                  </div>
                  <div className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'assistant'
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm'
                      : 'bg-primary-600 text-white rounded-tr-sm'
                  }`}>
                    {renderContent(msg.content)}
                  </div>
                </motion.div>
              ))}

              {/* Loading indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2.5"
                >
                  <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-tl-sm">
                    <div className="flex gap-1 items-center">
                      <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Error */}
              {error && (
                <div className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-xl border border-red-100 dark:border-red-800">
                  {error}
                </div>
              )}

              <div ref={endRef} />
            </div>

            {/* Quick suggestions (shown only at start) */}
            {messages.length === 1 && (
              <div className="px-3 pb-2 flex-shrink-0">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium px-1 mb-1.5">
                  What can I help with?
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {visibleSuggestions.map((s) => (
                    <button
                      key={s.query}
                      onClick={() => send(s.query)}
                      className="text-xs bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 text-gray-600 dark:text-gray-400 px-2.5 py-1.5 rounded-full transition-colors border border-gray-200 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-700"
                    >
                      {s.label}
                    </button>
                  ))}
                  {!showAllSuggestions && (
                    <button
                      onClick={() => setShowAllSuggestions(true)}
                      className="text-xs bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 text-gray-500 px-2.5 py-1.5 rounded-full transition-colors border border-gray-200 dark:border-gray-700 flex items-center gap-1"
                    >
                      More <ChevronDown className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-3 flex gap-2 flex-shrink-0 bg-white dark:bg-gray-900">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send(input)}
                placeholder="Ask about products, deals, orders…"
                maxLength={500}
                className="flex-1 text-sm bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-gray-700 transition-all"
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || loading}
                className="w-9 h-9 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
