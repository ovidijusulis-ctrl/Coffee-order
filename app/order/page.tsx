'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../lib/cart';
import { getShippingRates, COUNTRIES, ShippingRate } from '../lib/shipping';
import { GRIND_LABELS, WEIGHT_LABELS } from '../lib/products';
import CheckoutPayment from '../components/CheckoutPayment';

type Step = 'cart' | 'details' | 'payment' | 'confirmed';

interface Details {
  firstName: string; lastName: string;
  email: string; phone: string;
  address1: string; address2: string;
  city: string; state: string; postcode: string; country: string;
}

const EMPTY: Details = {
  firstName: '', lastName: '', email: '', phone: '',
  address1: '', address2: '', city: '', state: '', postcode: '', country: 'JP',
};

const S: React.CSSProperties = {
  fontSize: '10px', textTransform: 'uppercase' as const,
  letterSpacing: '0.15em', fontWeight: 600,
  display: 'block', marginBottom: '6px', color: 'var(--text-muted)',
};

const INPUT: React.CSSProperties = {
  width: '100%', padding: '12px', fontSize: '14px',
  border: '1px solid var(--border)', background: 'var(--surface)',
  color: 'var(--text)', fontFamily: 'var(--font-sans)',
};

const ERR: React.CSSProperties = {
  fontSize: '11px', color: '#ba1a1a', marginTop: '4px',
};

export default function OrderPage() {
  const { items, relatedItems, updateQty, removeItem, clearCart, subtotal } = useCart();
  const [step, setStep] = useState<Step>('cart');
  const [details, setDetails] = useState<Details>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Details, string>>>({});
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);

  const total = subtotal + (selectedRate?.price ?? 0);
  const allItems = items.length + relatedItems.length;

  function set(field: keyof Details, val: string) {
    setDetails(d => ({ ...d, [field]: val }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof Details, string>> = {};
    if (!details.firstName.trim()) e.firstName = 'Required';
    if (!details.lastName.trim()) e.lastName = 'Required';
    if (!details.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) e.email = 'Valid email required';
    if (!details.address1.trim()) e.address1 = 'Required';
    if (!details.city.trim()) e.city = 'Required';
    if (!details.postcode.trim()) e.postcode = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function goToPayment() {
    if (!validate()) return;
    const rates = getShippingRates(details.postcode, details.country, subtotal);
    setShippingRates(rates);
    setSelectedRate(rates[0]);
    setStep('payment');
  }

  const headerStyle: React.CSSProperties = {
    position: 'sticky', top: 0, zIndex: 50,
    background: 'rgba(249,249,249,0.9)', backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--border-light)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 20px', height: '56px',
  };

  const btnPrimary: React.CSSProperties = {
    width: '100%', padding: '18px',
    background: 'var(--primary)', color: 'var(--on-primary)',
    border: 'none', fontSize: '12px', fontWeight: 700,
    letterSpacing: '0.2em', textTransform: 'uppercase',
  };

  const btnBack: React.CSSProperties = {
    background: 'none', border: 'none', fontSize: '12px',
    letterSpacing: '0.1em', textTransform: 'uppercase',
    color: 'var(--text-muted)', padding: '4px 0',
  };

  if (step === 'confirmed') {
    return (
      <>
        <header style={headerStyle}>
          <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '18px' }}>Kokubo</p>
        </header>
        <div style={{ maxWidth: '480px', margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
          <p style={{ fontSize: '40px', marginBottom: '24px' }}>☕</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '32px', marginBottom: '12px' }}>
            Order confirmed.
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '6px' }}>
            Thank you, {details.firstName}. We&apos;ll roast your beans fresh and ship to <strong>{details.email}</strong>.
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '40px' }}>
            Expect a confirmation email shortly.
          </p>
          <Link
            href="/"
            onClick={clearCart}
            style={{
              display: 'inline-block', padding: '16px 40px',
              background: 'var(--primary)', color: 'var(--on-primary)',
              fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            ← Back to Shop
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <header style={headerStyle}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '18px', color: 'var(--primary)' }}>
            Kokubo
          </p>
        </Link>
        {/* Step indicator */}
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {(['cart', 'details', 'payment'] as Step[]).map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%',
                background: step === s ? 'var(--primary)' : ['cart','details','payment'].indexOf(step) > i ? 'var(--primary)' : 'var(--border)',
                color: 'white', fontSize: '10px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {['cart','details','payment'].indexOf(step) > i ? '✓' : i + 1}
              </div>
              {i < 2 && <div style={{ width: '12px', height: '1px', background: 'var(--border)' }} />}
            </div>
          ))}
        </div>
      </header>

      <main style={{ maxWidth: '520px', margin: '0 auto', padding: '32px 20px 80px' }}>

        {/* ── CART ── */}
        {step === 'cart' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '28px', marginBottom: '28px' }}>
              Your Order
            </h2>

            {allItems === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Nothing here yet.</p>
                <Link href="/" style={{
                  display: 'inline-block', padding: '14px 32px',
                  background: 'var(--primary)', color: 'var(--on-primary)',
                  textDecoration: 'none', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase',
                }}>
                  Shop Coffee
                </Link>
              </div>
            ) : (
              <>
                {items.map(item => (
                  <div key={`${item.product.id}-${item.weight}-${item.grind}`} style={{
                    display: 'flex', gap: '14px', padding: '16px 0',
                    borderBottom: '1px solid var(--border-light)', alignItems: 'center',
                  }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '15px', fontFamily: 'var(--font-serif)', fontStyle: 'italic', marginBottom: '2px' }}>
                        {item.product.name}
                      </p>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {WEIGHT_LABELS[item.weight]} · {GRIND_LABELS[item.grind]}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button onClick={() => updateQty(item.product.id, item.weight, item.grind, item.quantity - 1)} style={{
                        width: '26px', height: '26px', border: '1px solid var(--border)',
                        background: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>−</button>
                      <span style={{ fontSize: '13px', minWidth: '16px', textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateQty(item.product.id, item.weight, item.grind, item.quantity + 1)} style={{
                        width: '26px', height: '26px', border: '1px solid var(--border)',
                        background: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>+</button>
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: 600, minWidth: '60px', textAlign: 'right' }}>
                      ¥{(item.product.price[item.weight] * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}

                {relatedItems.map(r => (
                  <div key={r.item.id} style={{
                    display: 'flex', gap: '14px', padding: '16px 0',
                    borderBottom: '1px solid var(--border-light)', alignItems: 'center',
                  }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '15px', fontFamily: 'var(--font-serif)', fontStyle: 'italic', marginBottom: '2px' }}>
                        {r.item.name}
                      </p>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{r.item.category}</p>
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: 600 }}>¥{r.item.price}</p>
                  </div>
                ))}

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Subtotal</span>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>¥{subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 28px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Shipping</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Calculated next</span>
                </div>

                <button onClick={() => setStep('details')} style={btnPrimary}>
                  Continue → Delivery Details
                </button>
                <Link href="/" style={{
                  display: 'block', textAlign: 'center', marginTop: '16px',
                  fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em',
                  textTransform: 'uppercase', textDecoration: 'none',
                }}>
                  ← Add more items
                </Link>
              </>
            )}
          </div>
        )}

        {/* ── DETAILS ── */}
        {step === 'details' && (
          <div>
            <button onClick={() => setStep('cart')} style={btnBack}>← Cart</button>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '28px', margin: '16px 0 28px' }}>
              Delivery Details
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={S}>First Name</label>
                  <input value={details.firstName} onChange={e => set('firstName', e.target.value)}
                    style={{ ...INPUT, borderColor: errors.firstName ? '#ba1a1a' : 'var(--border)' }}
                    autoComplete="given-name" />
                  {errors.firstName && <p style={ERR}>{errors.firstName}</p>}
                </div>
                <div>
                  <label style={S}>Last Name</label>
                  <input value={details.lastName} onChange={e => set('lastName', e.target.value)}
                    style={{ ...INPUT, borderColor: errors.lastName ? '#ba1a1a' : 'var(--border)' }}
                    autoComplete="family-name" />
                  {errors.lastName && <p style={ERR}>{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label style={S}>Email</label>
                <input type="email" value={details.email} onChange={e => set('email', e.target.value)}
                  style={{ ...INPUT, borderColor: errors.email ? '#ba1a1a' : 'var(--border)' }}
                  autoComplete="email" />
                {errors.email && <p style={ERR}>{errors.email}</p>}
              </div>

              <div>
                <label style={S}>Phone (optional)</label>
                <input type="tel" value={details.phone} onChange={e => set('phone', e.target.value)}
                  style={INPUT} autoComplete="tel" />
              </div>

              <div>
                <label style={S}>Country</label>
                <select value={details.country} onChange={e => set('country', e.target.value)}
                  style={{ ...INPUT, appearance: 'none' as const,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2349464a' strokeWidth='1.5' fill='none'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
                  }}>
                  {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label style={S}>Address</label>
                <input value={details.address1} onChange={e => set('address1', e.target.value)}
                  style={{ ...INPUT, borderColor: errors.address1 ? '#ba1a1a' : 'var(--border)', marginBottom: '8px' }}
                  autoComplete="address-line1" placeholder="Street address" />
                {errors.address1 && <p style={ERR}>{errors.address1}</p>}
                <input value={details.address2} onChange={e => set('address2', e.target.value)}
                  style={INPUT} autoComplete="address-line2" placeholder="Apartment, floor (optional)" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={S}>City</label>
                  <input value={details.city} onChange={e => set('city', e.target.value)}
                    style={{ ...INPUT, borderColor: errors.city ? '#ba1a1a' : 'var(--border)' }}
                    autoComplete="address-level2" />
                  {errors.city && <p style={ERR}>{errors.city}</p>}
                </div>
                <div>
                  <label style={S}>State / Pref.</label>
                  <input value={details.state} onChange={e => set('state', e.target.value)}
                    style={INPUT} autoComplete="address-level1" />
                </div>
                <div>
                  <label style={S}>Postcode</label>
                  <input value={details.postcode} onChange={e => set('postcode', e.target.value)}
                    style={{ ...INPUT, borderColor: errors.postcode ? '#ba1a1a' : 'var(--border)' }}
                    autoComplete="postal-code" />
                  {errors.postcode && <p style={ERR}>{errors.postcode}</p>}
                </div>
              </div>

              <div style={{
                padding: '12px 14px', borderLeft: '2px solid var(--primary)',
                background: 'var(--surface-low)', fontSize: '12px',
                color: 'var(--text-muted)', lineHeight: 1.6, marginTop: '4px',
              }}>
                Beans are roasted fresh after your order. Allow 1–2 days before dispatch.
              </div>

              <button onClick={goToPayment} style={{ ...btnPrimary, marginTop: '8px' }}>
                Continue → Payment
              </button>
            </div>
          </div>
        )}

        {/* ── PAYMENT ── */}
        {step === 'payment' && (
          <CheckoutPayment
            details={details}
            shippingRates={shippingRates}
            selectedRate={selectedRate}
            onSelectRate={setSelectedRate}
            subtotal={subtotal}
            total={total}
            onBack={() => setStep('details')}
            onConfirmed={() => setStep('confirmed')}
          />
        )}
      </main>
    </>
  );
}
