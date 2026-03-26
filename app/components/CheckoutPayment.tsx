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
  fullName: string;
  email: string;
  phone: string;
  fullAddress: string;
  postcode: string;
  country: string;
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
      fontSize: '14px', color: '#f0efef',
      fontFamily: 'Inter, system-ui, sans-serif',
      '::placeholder': { color: '#666' },
      backgroundColor: 'transparent',
    },
    invalid: { color: '#ff7070' },
  },
};

const CARD_BOX: React.CSSProperties = {
  padding: '12px', border: '1px solid var(--border)',
  background: 'var(--surface-low)',
};

const LABEL: React.CSSProperties = {
  fontSize: '10px', textTransform: 'uppercase' as const,
  letterSpacing: '0.12em', fontWeight: 600,
  display: 'block', marginBottom: '6px', color: 'var(--text-muted)',
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
        body: JSON.stringify({ amount: total, currency: 'jpy', email: details.email }),
      });
      if (!res.ok) throw new Error('決済サーバーに接続できません。Vercelなどのサーバー環境でご利用ください。');
      const { clientSecret } = await res.json();
      const cardEl = elements.getElement(CardNumberElement);
      if (!cardEl) throw new Error('カード入力欄が見つかりません');
      const { error: se, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardEl,
          billing_details: { name: details.fullName, email: details.email },
        },
      });
      if (se) setError(se.message || '決済に失敗しました');
      else if (paymentIntent?.status === 'succeeded') onConfirmed();
    } catch (err) {
      setError(err instanceof Error ? err.message : '決済に失敗しました');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div>
        <label style={LABEL}>カード番号</label>
        <div style={CARD_BOX}><CardNumberElement options={CARD_STYLE} /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div>
          <label style={LABEL}>有効期限</label>
          <div style={CARD_BOX}><CardExpiryElement options={CARD_STYLE} /></div>
        </div>
        <div>
          <label style={LABEL}>セキュリティコード</label>
          <div style={CARD_BOX}><CardCvcElement options={CARD_STYLE} /></div>
        </div>
      </div>
      {error && (
        <div style={{ padding: '10px 12px', background: 'rgba(255,112,112,0.1)', border: '1px solid rgba(255,112,112,0.3)', fontSize: '12px', color: '#ff7070', lineHeight: 1.5 }}>
          {error}
        </div>
      )}
      <button type="submit" disabled={!stripe || loading} style={{
        padding: '17px', background: 'var(--primary)', color: 'var(--on-primary)',
        border: 'none', fontSize: '13px', fontWeight: 700, letterSpacing: '0.12em',
        opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s',
      }}>
        {loading ? '処理中...' : `¥${total.toLocaleString()} を支払う`}
      </button>
      <p style={{ textAlign: 'center', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
        🔒 Stripeによる安全な決済
      </p>
    </form>
  );
}

export default function CheckoutPayment({ details, shippingRates, selectedRate, onSelectRate, subtotal, total, onBack, onConfirmed }: Props) {
  const [method, setMethod] = useState<'card' | 'paypal'>('card');

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1, padding: '12px', background: 'none',
    borderBottom: `2px solid ${active ? 'var(--primary)' : 'var(--border-light)'}`,
    borderTop: 'none', borderLeft: 'none', borderRight: 'none',
    fontSize: '12px', fontWeight: active ? 700 : 400,
    letterSpacing: '0.1em', color: active ? 'var(--text)' : 'var(--text-muted)',
    transition: 'all 0.15s',
  });

  return (
    <div>
      <button onClick={onBack} style={{
        background: 'none', border: 'none', fontSize: '12px',
        letterSpacing: '0.08em', color: 'var(--text-muted)', padding: '4px 0', marginBottom: '20px',
      }}>← 配送先に戻る</button>

      <h2 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '26px', marginBottom: '24px' }}>
        お支払い
      </h2>

      {/* Shipping method */}
      {shippingRates.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <p style={{
            fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em',
            fontWeight: 600, marginBottom: '10px', color: 'var(--text-muted)',
          }}>配送方法</p>
          {shippingRates.map(rate => (
            <button key={rate.id} onClick={() => onSelectRate(rate)} style={{
              width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '13px 14px', marginBottom: '6px',
              background: selectedRate?.id === rate.id ? 'var(--surface-container)' : 'var(--surface-low)',
              border: `1px solid ${selectedRate?.id === rate.id ? 'var(--primary)' : 'var(--border)'}`,
              textAlign: 'left', transition: 'all 0.15s',
            }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '2px' }}>
                  {rate.nameJa}
                </p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {rate.descriptionJa} · {rate.estimatedDaysJa}
                </p>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', flexShrink: 0, marginLeft: '12px' }}>
                {rate.price === 0 ? '無料' : `¥${rate.price.toLocaleString()}`}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Order summary */}
      <div style={{
        background: 'var(--surface-low)', padding: '16px',
        border: '1px solid var(--border-light)', marginBottom: '24px',
      }}>
        <div style={{ marginBottom: '8px' }}>
          <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.05em' }}>
            お届け先
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text)', lineHeight: 1.6 }}>
            {details.fullName}<br />{details.fullAddress}
          </p>
        </div>
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '10px', marginTop: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>小計</span>
            <span style={{ fontSize: '13px', color: 'var(--text)' }}>¥{subtotal.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>送料</span>
            <span style={{ fontSize: '13px', color: 'var(--text)' }}>
              {selectedRate ? (selectedRate.price === 0 ? '無料' : `¥${selectedRate.price.toLocaleString()}`) : '—'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>合計</span>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>
              ¥{total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Payment method tabs */}
      <div style={{ display: 'flex', marginBottom: '20px', borderBottom: '1px solid var(--border-light)' }}>
        <button style={tabStyle(method === 'card')} onClick={() => setMethod('card')}>クレジットカード</button>
        <button style={tabStyle(method === 'paypal')} onClick={() => setMethod('paypal')}>PayPal</button>
      </div>

      {method === 'card' && (
        stripePromise ? (
          <Elements stripe={stripePromise}>
            <StripeForm total={total} details={details} onConfirmed={onConfirmed} />
          </Elements>
        ) : (
          <div style={{ padding: '20px', border: '1px dashed var(--border)', textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Stripeの設定が必要です
            </p>
            <p style={{ fontSize: '11px', color: 'var(--accent)', lineHeight: 1.6 }}>
              <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> と <code>STRIPE_SECRET_KEY</code> を<br />
              <code>.env.local</code> に設定してください
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
                description: 'the;kokubo coffee order',
                shipping: {
                  name: { full_name: details.fullName },
                  address: {
                    address_line_1: details.fullAddress,
                    postal_code: details.postcode,
                    country_code: details.country,
                  },
                },
              }],
            })}
            onApprove={async (_d, actions) => {
              if (actions.order) { await actions.order.capture(); onConfirmed(); }
            }}
          />
        </PayPalScriptProvider>
      )}
    </div>
  );
}
