'use client';

import { useState } from 'react';
import { ShippingRate } from '../lib/shipping';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test';

const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

interface Props {
  shipping: ShippingInfo;
  shippingRates: ShippingRate[];
  selectedRate: ShippingRate | null;
  onSelectRate: (rate: ShippingRate) => void;
  subtotal: number;
  total: number;
  onBack: () => void;
  onConfirmed: () => void;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '14px',
      color: '#2c1a0e',
      fontFamily: 'Georgia, serif',
      '::placeholder': { color: '#b0957e' },
    },
    invalid: { color: '#c0392b' },
  },
};

function StripeCardForm({
  total,
  shipping,
  onConfirmed,
}: {
  total: number;
  shipping: ShippingInfo;
  onConfirmed: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cardInputStyle: React.CSSProperties = {
    padding: '11px 12px',
    border: '1px solid var(--border)',
    borderRadius: '1px',
    backgroundColor: 'var(--cream)',
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      // Create payment intent on the server
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(total * 100), // in smallest currency unit
          currency: 'jpy',
          email: shipping.email,
        }),
      });

      if (!res.ok) throw new Error('Failed to create payment intent');
      const { clientSecret } = await res.json();

      const cardNumber = elements.getElement(CardNumberElement);
      if (!cardNumber) throw new Error('Card element not found');

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumber,
          billing_details: {
            name: `${shipping.firstName} ${shipping.lastName}`,
            email: shipping.email,
            address: {
              line1: shipping.address1,
              line2: shipping.address2,
              city: shipping.city,
              state: shipping.state,
              postal_code: shipping.postcode,
              country: shipping.country,
            },
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
      } else if (paymentIntent?.status === 'succeeded') {
        onConfirmed();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
          Card Number
        </label>
        <div style={cardInputStyle}>
          <CardNumberElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
            Expiry
          </label>
          <div style={cardInputStyle}>
            <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
            CVC
          </label>
          <div style={cardInputStyle}>
            <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </div>
      </div>

      {error && (
        <div style={{ padding: '10px 12px', backgroundColor: '#fdf0f0', border: '1px solid #f5c6c6', borderRadius: '1px', fontSize: '13px', color: '#c0392b' }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        style={{
          padding: '14px',
          backgroundColor: loading ? 'var(--brown)' : 'var(--espresso)',
          color: 'var(--cream)',
          fontSize: '13px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          border: 'none',
          borderRadius: '1px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.8 : 1,
          transition: 'background-color 0.2s',
        }}
      >
        {loading ? 'Processing...' : `Pay ¥${total.toLocaleString()}`}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
          Secured by Stripe · SSL encrypted
        </span>
      </div>
    </form>
  );
}

export default function CheckoutPayment({
  shipping,
  shippingRates,
  selectedRate,
  onSelectRate,
  subtotal,
  total,
  onBack,
  onConfirmed,
}: Props) {
  const [payMethod, setPayMethod] = useState<'card' | 'paypal'>('card');

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '10px',
    fontSize: '13px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    border: `1px solid ${active ? 'var(--espresso)' : 'var(--border)'}`,
    backgroundColor: active ? 'var(--espresso)' : 'transparent',
    color: active ? 'var(--cream)' : 'var(--text-muted)',
    cursor: 'pointer',
    borderRadius: '1px',
    transition: 'all 0.15s',
  });

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontFamily: 'Georgia, serif', color: 'var(--espresso)', marginBottom: '32px' }}>
        Payment
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '40px', alignItems: 'start' }}>
        {/* Left: shipping rate + payment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Shipping rate selection */}
          {shippingRates.length > 0 && (
            <div>
              <p style={{ fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Delivery Method
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {shippingRates.map(rate => (
                  <button
                    key={rate.id}
                    onClick={() => onSelectRate(rate)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '14px 16px',
                      border: `1px solid ${selectedRate?.id === rate.id ? 'var(--brown)' : 'var(--border)'}`,
                      backgroundColor: selectedRate?.id === rate.id ? 'rgba(139,94,60,0.06)' : 'transparent',
                      borderRadius: '1px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--espresso)', marginBottom: '2px' }}>
                        {rate.name}
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {rate.description} · {rate.estimatedDays}
                      </p>
                    </div>
                    <span style={{ fontSize: '15px', fontWeight: '600', color: 'var(--espresso)', marginLeft: '16px' }}>
                      {rate.price === 0 ? 'Free' : `¥${rate.price.toLocaleString()}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Payment method tabs */}
          <div>
            <p style={{ fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Payment Method
            </p>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <button onClick={() => setPayMethod('card')} style={tabStyle(payMethod === 'card')}>
                Credit / Debit Card
              </button>
              <button onClick={() => setPayMethod('paypal')} style={tabStyle(payMethod === 'paypal')}>
                PayPal
              </button>
            </div>

            {/* Card payment */}
            {payMethod === 'card' && (
              <>
                {stripePromise ? (
                  <Elements stripe={stripePromise}>
                    <StripeCardForm total={total} shipping={shipping} onConfirmed={onConfirmed} />
                  </Elements>
                ) : (
                  <div
                    style={{
                      padding: '20px',
                      border: '1px dashed var(--border)',
                      borderRadius: '1px',
                      textAlign: 'center',
                    }}
                  >
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      Stripe not configured yet.
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--brown)', lineHeight: 1.6 }}>
                      Add <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> and{' '}
                      <code>STRIPE_SECRET_KEY</code> to your <code>.env.local</code> file.
                    </p>
                  </div>
                )}
              </>
            )}

            {/* PayPal */}
            {payMethod === 'paypal' && (
              <PayPalScriptProvider
                options={{
                  clientId: paypalClientId,
                  currency: 'JPY',
                  intent: 'capture',
                }}
              >
                <PayPalButtons
                  style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay' }}
                  createOrder={(_data, actions) => {
                    return actions.order.create({
                      intent: 'CAPTURE',
                      purchase_units: [
                        {
                          amount: {
                            currency_code: 'JPY',
                            value: String(total),
                          },
                          description: 'Kokubo Coffee Order',
                          shipping: {
                            name: { full_name: `${shipping.firstName} ${shipping.lastName}` },
                            address: {
                              address_line_1: shipping.address1,
                              address_line_2: shipping.address2,
                              admin_area_2: shipping.city,
                              admin_area_1: shipping.state,
                              postal_code: shipping.postcode,
                              country_code: shipping.country,
                            },
                          },
                        },
                      ],
                    });
                  }}
                  onApprove={async (_data, actions) => {
                    if (actions.order) {
                      await actions.order.capture();
                      onConfirmed();
                    }
                  }}
                  onError={() => {
                    // PayPal handles error display internally
                  }}
                />
              </PayPalScriptProvider>
            )}
          </div>

          {/* Back button */}
          <button
            onClick={onBack}
            style={{
              alignSelf: 'flex-start',
              padding: '10px 16px',
              fontSize: '12px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              border: '1px solid var(--border)',
              backgroundColor: 'transparent',
              color: 'var(--text-muted)',
              borderRadius: '1px',
              cursor: 'pointer',
            }}
          >
            ← Back to Shipping
          </button>
        </div>

        {/* Right: Order summary */}
        <div
          style={{
            backgroundColor: 'var(--cream-dark)',
            border: '1px solid var(--border)',
            borderRadius: '1px',
            padding: '24px',
          }}
        >
          <p style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Order Summary
          </p>

          {/* Shipping address */}
          <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', letterSpacing: '0.05em' }}>Delivering to</p>
            <p style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.5 }}>
              {shipping.firstName} {shipping.lastName}<br />
              {shipping.address1}{shipping.address2 ? `, ${shipping.address2}` : ''}<br />
              {shipping.city}{shipping.state ? `, ${shipping.state}` : ''} {shipping.postcode}<br />
              {shipping.country}
            </p>
          </div>

          {/* Totals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Subtotal</span>
              <span style={{ fontSize: '13px', color: 'var(--text)' }}>¥{subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Shipping</span>
              <span style={{ fontSize: '13px', color: 'var(--text)' }}>
                {selectedRate
                  ? selectedRate.price === 0
                    ? 'Free'
                    : `¥${selectedRate.price.toLocaleString()}`
                  : '—'}
              </span>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '15px', fontWeight: '600', color: 'var(--espresso)', fontFamily: 'Georgia, serif' }}>Total</span>
              <span style={{ fontSize: '17px', fontWeight: '700', color: 'var(--espresso)', fontFamily: 'Georgia, serif' }}>¥{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
