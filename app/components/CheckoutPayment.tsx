'use client';

import { useState } from 'react';
import { ShippingRate } from '../lib/shipping';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements, CardNumberElement, CardExpiryElement, CardCvcElement,
  useStripe, useElements,
} from '@stripe/react-stripe-js';

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
const paypalId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test';
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

interface Details {
  firstName: string; lastName: string; email: string; phone: string;
  address1: string; address2: string; city: string; state: string;
  postcode: string; country: string;
}

interface Props {
  details: Details;
  shippingRates: ShippingRate[];
  selectedRate: ShippingRate | null;
  onSelectRate: (r: ShippingRate) => void;
  subtotal: number;
  total: number;
  onBack: () => void;
  onConfirmed: () => void;
}

const CARD_STYLE = {
  style: {
    base: {
      fontSize: '14px', color: '#1a1c1c', fontFamily: 'Inter, sans-serif',
      '::placeholder': { color: '#aaa' },
    },
    invalid: { color: '#ba1a1a' },
  },
};

const INPUT_BOX: React.CSSProperties = {
  padding: '12px', border: '1px solid var(--border)',
  background: 'var(--surface)', marginBottom: '0',
};

function StripeForm({ total, details, onConfirmed }: { total: number; details: Details; onConfirmed: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || '';
      const res = await fetch(`${apiBase}/api/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(total * 100), currency: 'jpy', email: details.email }),
      });
      if (!res.ok) throw new Error('Payment server not available. Deploy to Vercel or a Node.js host to enable live payments.');
      const { clientSecret } = await res.json();
      const cardEl = elements.getElement(CardNumberElement);
      if (!cardEl) throw new Error('Card element missing');
      const { error: se, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardEl,
          billing_details: {
            name: `${details.firstName} ${details.lastName}`,
            email: details.email,
            address: {
              line1: details.address1, line2: details.address2,
              city: details.city, state: details.state,
              postal_code: details.postcode, country: details.country,
            },
          },
        },
      });
      if (se) setError(se.message || 'Payment failed');
      else if (paymentIntent?.status === 'succeeded') onConfirmed();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div>
        <label style={{ fontSize: '10px', textTransform: 'uppercase' as const, letterSpacing: '0.15em', fontWeight: 600, display: 'block', marginBottom: '6px', color: 'var(--text-muted)' }}>
          Card Number
        </label>
        <div style={INPUT_BOX}><CardNumberElement options={CARD_STYLE} /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div>
          <label style={{ fontSize: '10px', textTransform: 'uppercase' as const, letterSpacing: '0.15em', fontWeight: 600, display: 'block', marginBottom: '6px', color: 'var(--text-muted)' }}>Expiry</label>
          <div style={INPUT_BOX}><CardExpiryElement options={CARD_STYLE} /></div>
        </div>
        <div>
          <label style={{ fontSize: '10px', textTransform: 'uppercase' as const, letterSpacing: '0.15em', fontWeight: 600, display: 'block', marginBottom: '6px', color: 'var(--text-muted)' }}>CVC</label>
          <div style={INPUT_BOX}><CardCvcElement options={CARD_STYLE} /></div>
        </div>
      </div>
      {error && (
        <div style={{ padding: '10px 12px', background: '#fff0f0', border: '1px solid #f5c6c6', fontSize: '12px', color: '#ba1a1a' }}>
          {error}
        </div>
      )}
      <button type="submit" disabled={!stripe || loading} style={{
        padding: '18px', background: 'var(--primary)', color: 'var(--on-primary)',
        border: 'none', fontSize: '12px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
        opacity: loading ? 0.7 : 1,
      }}>
        {loading ? 'Processing...' : `Pay ¥${total.toLocaleString()}`}
      </button>
      <p style={{ textAlign: 'center', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
        🔒 Secured by Stripe
      </p>
    </form>
  );
}

export default function CheckoutPayment({ details, shippingRates, selectedRate, onSelectRate, subtotal, total, onBack, onConfirmed }: Props) {
  const [method, setMethod] = useState<'card' | 'paypal'>('card');

  const tabBtn = (active: boolean): React.CSSProperties => ({
    flex: 1, padding: '12px', background: 'none',
    borderBottom: `2px solid ${active ? 'var(--primary)' : 'var(--border-light)'}`,
    borderTop: 'none', borderLeft: 'none', borderRight: 'none',
    fontSize: '11px', fontWeight: active ? 700 : 400,
    letterSpacing: '0.15em', textTransform: 'uppercase',
    color: active ? 'var(--primary)' : 'var(--text-muted)',
    transition: 'all 0.15s',
  });

  return (
    <div>
      <button onClick={onBack} style={{
        background: 'none', border: 'none', fontSize: '11px',
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: 'var(--text-muted)', padding: '4px 0', marginBottom: '20px',
      }}>
        ← Details
      </button>
      <h2 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '28px', marginBottom: '28px' }}>
        Payment
      </h2>

      {/* Shipping method */}
      {shippingRates.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, marginBottom: '10px', color: 'var(--text-muted)' }}>
            Delivery
          </p>
          {shippingRates.map(rate => (
            <button key={rate.id} onClick={() => onSelectRate(rate)} style={{
              width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 16px', marginBottom: '6px', background: 'none',
              border: `1px solid ${selectedRate?.id === rate.id ? 'var(--primary)' : 'var(--border)'}`,
              textAlign: 'left', transition: 'border-color 0.15s',
            }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>{rate.name}</p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{rate.description} · {rate.estimatedDays}</p>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>
                {rate.price === 0 ? 'Free' : `¥${rate.price}`}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Order summary */}
      <div style={{ background: 'var(--surface-low)', padding: '16px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Subtotal</span>
          <span style={{ fontSize: '13px' }}>¥{subtotal.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Shipping</span>
          <span style={{ fontSize: '13px' }}>{selectedRate ? (selectedRate.price === 0 ? 'Free' : `¥${selectedRate.price}`) : '—'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
          <span style={{ fontSize: '14px', fontWeight: 700 }}>Total</span>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 700 }}>¥{total.toLocaleString()}</span>
        </div>
      </div>

      {/* Payment tabs */}
      <div style={{ display: 'flex', marginBottom: '20px', borderBottom: '1px solid var(--border-light)' }}>
        <button style={tabBtn(method === 'card')} onClick={() => setMethod('card')}>Card</button>
        <button style={tabBtn(method === 'paypal')} onClick={() => setMethod('paypal')}>PayPal</button>
      </div>

      {method === 'card' && (
        stripePromise ? (
          <Elements stripe={stripePromise}>
            <StripeForm total={total} details={details} onConfirmed={onConfirmed} />
          </Elements>
        ) : (
          <div style={{ padding: '20px', border: '1px dashed var(--border)', textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Stripe not configured.</p>
            <p style={{ fontSize: '11px', color: 'var(--primary)', lineHeight: 1.6 }}>
              Add <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> + <code>STRIPE_SECRET_KEY</code> to <code>.env.local</code>
            </p>
          </div>
        )
      )}

      {method === 'paypal' && (
        <PayPalScriptProvider options={{ clientId: paypalId, currency: 'JPY', intent: 'capture' }}>
          <PayPalButtons
            style={{ layout: 'vertical', color: 'black', shape: 'rect', label: 'pay', height: 48 }}
            createOrder={(_d, actions) => actions.order.create({
              intent: 'CAPTURE',
              purchase_units: [{
                amount: { currency_code: 'JPY', value: String(total) },
                description: 'Kokubo Coffee Order',
                shipping: {
                  name: { full_name: `${details.firstName} ${details.lastName}` },
                  address: {
                    address_line_1: details.address1, address_line_2: details.address2,
                    admin_area_2: details.city, admin_area_1: details.state,
                    postal_code: details.postcode, country_code: details.country,
                  },
                },
              }],
            })}
            onApprove={async (_d, actions) => { if (actions.order) { await actions.order.capture(); onConfirmed(); } }}
          />
        </PayPalScriptProvider>
      )}
    </div>
  );
}
