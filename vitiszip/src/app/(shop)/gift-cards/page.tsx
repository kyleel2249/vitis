'use client';
import { useState } from 'react';
import { Gift, CreditCard, Mail, User, MessageSquare, Check, ChevronRight, ShieldCheck, Zap, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const DENOMINATIONS = [
  { value: 25, label: '$25', popular: false },
  { value: 50, label: '$50', popular: false },
  { value: 100, label: '$100', popular: true },
  { value: 150, label: '$150', popular: false },
  { value: 200, label: '$200', popular: false },
  { value: 500, label: '$500', popular: false },
];

const CARD_THEMES = [
  {
    id: 'classic',
    label: 'Classic',
    gradient: 'from-indigo-600 via-purple-600 to-pink-500',
    accent: 'bg-white/20',
  },
  {
    id: 'birthday',
    label: '🎂 Birthday',
    gradient: 'from-yellow-400 via-orange-500 to-red-500',
    accent: 'bg-white/20',
  },
  {
    id: 'holiday',
    label: '🎄 Holiday',
    gradient: 'from-green-500 via-emerald-600 to-teal-700',
    accent: 'bg-white/20',
  },
  {
    id: 'celebration',
    label: '🥂 Celebration',
    gradient: 'from-yellow-300 via-yellow-500 to-amber-600',
    accent: 'bg-black/20',
  },
  {
    id: 'love',
    label: '❤️ Love',
    gradient: 'from-rose-400 via-pink-500 to-red-500',
    accent: 'bg-white/20',
  },
  {
    id: 'midnight',
    label: '🌙 Midnight',
    gradient: 'from-gray-900 via-slate-800 to-gray-900',
    accent: 'bg-white/10',
  },
];

const PERKS = [
  { icon: Zap, title: 'Instant delivery', desc: 'Sent to your inbox within seconds of purchase.' },
  { icon: ShieldCheck, title: 'Never expires', desc: 'Vitis gift cards have no expiry date — ever.' },
  { icon: Gift, title: 'Any occasion', desc: 'Birthdays, holidays, thank-yous, or just because.' },
  { icon: Smile, title: 'Easy to redeem', desc: 'Enter the code at checkout — no account required.' },
];

export default function GiftCardsPage() {
  const [amount, setAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState('');
  const [theme, setTheme] = useState('classic');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState<'design' | 'details' | 'confirm'>('design');
  const [purchased, setPurchased] = useState(false);

  const selectedTheme = CARD_THEMES.find((t) => t.id === theme) || CARD_THEMES[0];
  const finalAmount = customAmount ? parseFloat(customAmount) || 0 : amount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail) { toast.error('Recipient email is required'); return; }
    if (!senderName) { toast.error('Your name is required'); return; }
    if (finalAmount < 5) { toast.error('Minimum gift card amount is $5'); return; }
    setPurchased(true);
    toast.success('Gift card sent successfully!');
  };

  if (purchased) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Gift Card Sent! 🎉</h2>
          <p className="text-gray-600 mb-1">
            Your <strong>${finalAmount}</strong> gift card has been sent to{' '}
            <strong>{recipientEmail}</strong>.
          </p>
          {recipientName && <p className="text-gray-500 text-sm mb-6">A personal message from {senderName} has been included.</p>}
          <button
            onClick={() => { setPurchased(false); setStep('design'); setRecipientEmail(''); setRecipientName(''); setSenderName(''); setMessage(''); }}
            className="w-full py-3 bg-black text-white font-semibold rounded-2xl hover:bg-gray-800 transition-colors"
          >
            Send Another Gift Card
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-sm font-semibold px-3 py-1.5 rounded-full mb-4">
              <Gift className="w-3.5 h-3.5 text-yellow-300" />
              The perfect gift, every time
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-3">Gift Cards</h1>
            <p className="text-white/75 text-lg max-w-xl">
              Give the freedom to choose. Vitis gift cards are delivered instantly by email and never expire.
            </p>
          </div>

          {/* Perks */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/10">
            {PERKS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4.5 h-4.5 text-yellow-300" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{title}</p>
                  <p className="text-white/55 text-xs mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Left — card preview */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-5">Card Preview</h2>

            {/* Animated preview card */}
            <motion.div
              key={theme}
              initial={{ opacity: 0, rotateY: -10, scale: 0.95 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              transition={{ duration: 0.35 }}
              className={`relative w-full aspect-[1.6] rounded-3xl bg-gradient-to-br ${selectedTheme.gradient} p-7 shadow-2xl overflow-hidden select-none`}
            >
              {/* Decorative circles */}
              <div className={`absolute -top-10 -right-10 w-48 h-48 ${selectedTheme.accent} rounded-full`} />
              <div className={`absolute -bottom-10 -left-10 w-32 h-32 ${selectedTheme.accent} rounded-full`} />

              <div className="relative flex flex-col h-full justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-white/90 font-bold text-lg tracking-wide">Vitis</span>
                  <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
                    <Gift className="w-3.5 h-3.5 text-white" />
                    <span className="text-white text-xs font-semibold">Gift Card</span>
                  </div>
                </div>

                <div>
                  {recipientName && (
                    <p className="text-white/70 text-sm mb-0.5">For {recipientName}</p>
                  )}
                  <p className="text-white font-extrabold text-5xl leading-none">
                    ${finalAmount > 0 ? finalAmount : '?'}
                  </p>
                  {message && (
                    <p className="text-white/70 text-sm mt-2 line-clamp-2 italic">"{message}"</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    {senderName && <p className="text-white/60 text-xs">From {senderName}</p>}
                    <p className="text-white/40 text-xs font-mono tracking-widest">**** **** **** ••••</p>
                  </div>
                  <CreditCard className="w-7 h-7 text-white/40" />
                </div>
              </div>
            </motion.div>

            {/* Theme selector */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">Choose a Design</p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {CARD_THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all ${
                      theme === t.id ? 'border-black scale-105 shadow-md' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-full h-full bg-gradient-to-br ${t.gradient}`} />
                    {theme === t.id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {CARD_THEMES.map((t) => (
                  <button key={t.id} onClick={() => setTheme(t.id)}
                    className={`text-xs px-2.5 py-1 rounded-full transition-all ${theme === t.id ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div>
            {/* Steps */}
            <div className="flex items-center gap-2 mb-7">
              {(['design', 'details', 'confirm'] as const).map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <button
                    onClick={() => step !== 'design' || s === 'design' ? setStep(s) : undefined}
                    className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all ${
                      step === s ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {i + 1}
                  </button>
                  <span className={`text-sm font-medium capitalize ${step === s ? 'text-gray-900' : 'text-gray-400'}`}>{s}</span>
                  {i < 2 && <ChevronRight className="w-4 h-4 text-gray-300" />}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 'design' && (
                <motion.div key="design" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 className="text-lg font-bold text-gray-900 mb-5">Choose Amount</h3>

                  {/* Preset amounts */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {DENOMINATIONS.map((d) => (
                      <button
                        key={d.value}
                        onClick={() => { setAmount(d.value); setCustomAmount(''); }}
                        className={`relative py-4 rounded-2xl border-2 text-center font-bold transition-all ${
                          amount === d.value && !customAmount
                            ? 'border-black bg-black text-white'
                            : 'border-gray-200 bg-white text-gray-900 hover:border-gray-400'
                        }`}
                      >
                        {d.popular && (
                          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                            Most popular
                          </span>
                        )}
                        <span className="text-xl">{d.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Custom amount */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Or enter a custom amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                      <input
                        type="number"
                        min={5}
                        max={2000}
                        placeholder="e.g. 75"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        onFocus={() => setAmount(0)}
                        className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black text-base"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">Minimum $5, maximum $2,000</p>
                  </div>

                  <button
                    disabled={finalAmount < 5}
                    onClick={() => setStep('details')}
                    className="w-full py-4 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Continue — ${finalAmount || '?'} gift card
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}

              {step === 'details' && (
                <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 className="text-lg font-bold text-gray-900 mb-5">Recipient Details</h3>
                  <form onSubmit={(e) => { e.preventDefault(); setStep('confirm'); }} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        <User className="w-3.5 h-3.5 inline mr-1" />
                        Recipient's Name <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Sarah"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        <Mail className="w-3.5 h-3.5 inline mr-1" />
                        Recipient's Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="sarah@example.com"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        <User className="w-3.5 h-3.5 inline mr-1" />
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        <MessageSquare className="w-3.5 h-3.5 inline mr-1" />
                        Personal Message <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Add a heartfelt message…"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black resize-none"
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button type="button" onClick={() => setStep('design')}
                        className="flex-1 py-3.5 border border-gray-200 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-colors">
                        Back
                      </button>
                      <button type="submit"
                        className="flex-1 py-3.5 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                        Review Order <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {step === 'confirm' && (
                <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 className="text-lg font-bold text-gray-900 mb-5">Review & Purchase</h3>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-3 mb-6">
                    {[
                      { label: 'Amount', value: `$${finalAmount}` },
                      { label: 'Design', value: CARD_THEMES.find(t => t.id === theme)?.label || theme },
                      { label: 'To', value: recipientEmail },
                      { label: 'Recipient', value: recipientName || '—' },
                      { label: 'From', value: senderName },
                      { label: 'Message', value: message || '—' },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-start gap-4 text-sm">
                        <span className="text-gray-500 shrink-0">{label}</span>
                        <span className="font-semibold text-gray-900 text-right">{value}</span>
                      </div>
                    ))}
                    <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="font-extrabold text-xl text-gray-900">${finalAmount}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-5">
                    <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
                    Secure checkout · Gift card delivered instantly · Never expires
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep('details')}
                      className="flex-1 py-3.5 border border-gray-200 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-colors">
                      Back
                    </button>
                    <button onClick={handleSubmit}
                      className="flex-1 py-3.5 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                      <Gift className="w-4 h-4" />
                      Send Gift Card
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-10">How Gift Cards Work</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {[
              { step: '1', icon: Gift, title: 'Choose an amount', desc: 'Pick from preset values or enter a custom amount.' },
              { step: '2', icon: Mail, title: 'Add a personal touch', desc: 'Include a name and heartfelt message.' },
              { step: '3', icon: Zap, title: 'Instant delivery', desc: 'The gift card lands in their inbox immediately.' },
              { step: '4', icon: CreditCard, title: 'Easy to redeem', desc: 'They enter the code at checkout on any order.' },
            ].map(({ step: s, icon: Icon, title, desc }) => (
              <div key={s} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-gray-400 mb-1">STEP {s}</span>
                <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
