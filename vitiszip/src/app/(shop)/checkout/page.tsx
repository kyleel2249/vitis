'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, CreditCard, Truck, Package, Check, ShieldCheck, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '@/lib/cart';
import { formatCurrency, generateOrderId } from '@/lib/utils';
import toast from 'react-hot-toast';

type Step = 'address' | 'shipping' | 'payment' | 'confirmation';

const SHIPPING_OPTIONS = [
  { id: 'standard', label: 'Standard Shipping', description: '5–7 business days', price: 0, badge: 'FREE' },
  { id: 'express', label: 'Express Shipping', description: '2–3 business days', price: 9.99 },
  { id: 'overnight', label: 'Overnight Shipping', description: 'Next business day', price: 24.99 },
];

// ── Inner form that uses Stripe hooks ───────────────────────────────────────
function StripePaymentForm({
  total,
  orderId,
  cartItems,
  address,
  shipping,
  shippingCost,
  tax,
  subtotal,
  paymentIntentId,
  onSuccess,
}: {
  total: number;
  orderId: string;
  cartItems: any[];
  address: any;
  shipping: string;
  shippingCost: number;
  tax: number;
  subtotal: number;
  paymentIntentId: string;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (error) {
        toast.error(error.message || 'Payment failed');
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        // Create the order now that payment is confirmed
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: cartItems,
            shipping_address: address,
            shipping_method: shipping,
            subtotal,
            shipping_cost: shippingCost,
            tax,
            total,
            order_number: orderId,
            stripe_payment_intent_id: paymentIntent.id,
            payment_status: 'paid',
          }),
        });
        const data = await res.json();
        if (data.success) {
          onSuccess();
        } else {
          toast.error(data.error || 'Order creation failed');
        }
      }
    } catch {
      toast.error('Payment error — please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PaymentElement />
      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={handlePay}
          disabled={!stripe || !elements || loading}
          className="btn-primary py-3 flex-1 sm:flex-none sm:px-8 justify-center disabled:opacity-50"
        >
          {loading ? 'Processing…' : `Pay ${formatCurrency(total)}`}
        </button>
      </div>
    </div>
  );
}

// ── Main checkout page ───────────────────────────────────────────────────────
export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCart();
  const [step, setStep] = useState<Step>('address');
  const [shipping, setShipping] = useState('standard');
  const [orderId] = useState(() => generateOrderId());

  const [address, setAddress] = useState({
    first_name: '', last_name: '', email: '', phone: '',
    line1: '', line2: '', city: '', state: '', postal_code: '', country: 'US',
  });

  // Stripe state
  const [stripePromise, setStripePromise] = useState<ReturnType<typeof loadStripe> | null>(null);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [stripeError, setStripeError] = useState('');

  const subtotal = cart.totalPrice();
  const shippingOption = SHIPPING_OPTIONS.find(o => o.id === shipping)!;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingOption.price + tax;

  // When the user reaches the payment step, create a PaymentIntent
  useEffect(() => {
    if (step !== 'payment') return;
    setStripeError('');

    Promise.all([
      fetch('/api/stripe/config').then(r => r.json()),
      fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }),
      }).then(r => r.json()),
    ])
      .then(([config, intent]) => {
        if (config.error || intent.error) {
          setStripeError(config.error || intent.error);
          return;
        }
        setStripePromise(loadStripe(config.publishableKey));
        setClientSecret(intent.clientSecret);
        setPaymentIntentId(intent.paymentIntentId);
      })
      .catch(() => setStripeError('Could not load payment — please refresh'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const steps: { id: Step; label: string; icon: React.ElementType }[] = [
    { id: 'address', label: 'Address', icon: Truck },
    { id: 'shipping', label: 'Shipping', icon: Package },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'confirmation', label: 'Confirm', icon: Check },
  ];
  const stepIdx = steps.findIndex(s => s.id === step);

  const handlePaymentSuccess = () => {
    cart.clearCart();
    setStep('confirmation');
  };

  if (cart.items.length === 0 && step !== 'confirmation') {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <Link href="/products" className="btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  if (step === 'confirmation') {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-12 h-12 text-green-600" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed! 🎉</h2>
          <p className="text-gray-500 mb-2">Your order <strong className="text-gray-900">{orderId}</strong> has been placed.</p>
          <p className="text-gray-500 mb-8">You'll receive a confirmation email shortly.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/account/orders" className="btn-primary">Track Order</Link>
            <Link href="/products" className="btn-secondary">Continue Shopping</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center mb-10">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1 last:flex-none">
            <div className={`flex items-center gap-2 ${i <= stepIdx ? 'text-primary-600' : 'text-gray-300'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
                i < stepIdx ? 'bg-primary-600 border-primary-600 text-white' :
                i === stepIdx ? 'border-primary-600 text-primary-600 bg-primary-50' :
                'border-gray-200 text-gray-300'
              }`}>
                {i < stepIdx ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${i <= stepIdx ? 'text-gray-900' : 'text-gray-400'}`}>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-3 ${i < stepIdx ? 'bg-primary-600' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {step === 'address' && (
              <motion.div key="address" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="card p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-5">Shipping Address</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'first_name', label: 'First Name', placeholder: 'John', span: 1 },
                    { key: 'last_name', label: 'Last Name', placeholder: 'Doe', span: 1 },
                    { key: 'email', label: 'Email Address', placeholder: 'john@example.com', span: 2 },
                    { key: 'phone', label: 'Phone Number', placeholder: '+1 (555) 000-0000', span: 2 },
                    { key: 'line1', label: 'Street Address', placeholder: '123 Main Street', span: 2 },
                    { key: 'line2', label: 'Apt/Suite (optional)', placeholder: 'Apt 4B', span: 2 },
                    { key: 'city', label: 'City', placeholder: 'New York', span: 1 },
                    { key: 'state', label: 'State', placeholder: 'NY', span: 1 },
                    { key: 'postal_code', label: 'ZIP Code', placeholder: '10001', span: 1 },
                  ].map(({ key, label, placeholder, span }) => (
                    <div key={key} className={span === 2 ? 'sm:col-span-2' : ''}>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                      <input
                        value={(address as any)[key]}
                        onChange={(e) => setAddress({ ...address, [key]: e.target.value })}
                        placeholder={placeholder}
                        className="input"
                      />
                    </div>
                  ))}
                </div>
                <button onClick={() => setStep('shipping')} className="btn-primary mt-6 w-full sm:w-auto justify-center py-3.5">
                  Continue to Shipping <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {step === 'shipping' && (
              <motion.div key="shipping" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="card p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-5">Shipping Method</h3>
                <div className="space-y-3">
                  {SHIPPING_OPTIONS.map((opt) => (
                    <label key={opt.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      shipping === opt.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input type="radio" name="shipping" value={opt.id} checked={shipping === opt.id}
                        onChange={() => setShipping(opt.id)} className="sr-only" />
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${shipping === opt.id ? 'border-primary-600' : 'border-gray-300'}`}>
                        {shipping === opt.id && <div className="w-2 h-2 bg-primary-600 rounded-full" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900">{opt.label}</p>
                          {opt.badge && <span className="badge-success">{opt.badge}</span>}
                        </div>
                        <p className="text-sm text-gray-500">{opt.description}</p>
                      </div>
                      <span className="font-bold text-gray-900">{opt.price === 0 ? 'Free' : formatCurrency(opt.price)}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep('address')} className="btn-secondary py-3 px-6">Back</button>
                  <button onClick={() => setStep('payment')} className="btn-primary py-3 flex-1 sm:flex-none sm:px-8 justify-center">
                    Continue to Payment <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="card p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Payment</h3>
                <div className="flex items-center gap-2 mb-5">
                  <Lock className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-500">Secured by Stripe — 256-bit SSL encryption</span>
                </div>

                {stripeError ? (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
                    <p className="text-sm text-red-700">{stripeError}</p>
                  </div>
                ) : !clientSecret ? (
                  <div className="py-12 text-center text-gray-400 text-sm">
                    <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    Setting up secure payment…
                  </div>
                ) : (
                  <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                    <StripePaymentForm
                      total={total}
                      orderId={orderId}
                      cartItems={cart.items}
                      address={address}
                      shipping={shipping}
                      shippingCost={shippingOption.price}
                      tax={tax}
                      subtotal={subtotal}
                      paymentIntentId={paymentIntentId}
                      onSuccess={handlePaymentSuccess}
                    />
                  </Elements>
                )}

                <div className="mt-4">
                  <button onClick={() => setStep('shipping')} className="btn-secondary py-3 px-6">Back</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order summary */}
        <div>
          <div className="card p-5 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto scrollbar-hide">
              {cart.items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <div className="relative w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={item.image || ''} alt={item.name} fill className="object-cover" sizes="48px" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gray-500 text-white text-xs rounded-full flex items-center justify-center font-bold">{item.quantity}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 line-clamp-2">{item.name}</p>
                    <p className="text-xs text-gray-500">{formatCurrency(item.price)}</p>
                  </div>
                  <p className="text-xs font-bold text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{shippingOption.price === 0 ? 'Free' : formatCurrency(shippingOption.price)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Tax</span><span>{formatCurrency(tax)}</span></div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
                <span>Total</span><span>{formatCurrency(total)}</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
              <ShieldCheck className="w-4 h-4 text-green-500" /> Secure checkout powered by Stripe
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
