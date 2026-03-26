'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../lib/cart';
import { getShippingRates, COUNTRIES, ShippingRate } from '../lib/shipping';
import { GRIND_LABELS, WEIGHT_LABELS } from '../lib/products';
import CheckoutPayment from '../components/CheckoutPayment';

type Step = 'cart' | 'shipping' | 'payment' | 'confirmed';

interface ShippingDetails {
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

const EMPTY_SHIPPING: ShippingDetails = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  postcode: '',
  country: 'JP',
};

function StepIndicator({ step }: { step: Step }) {
  const steps: { key: Step; label: string }[] = [
    { key: 'cart', label: 'Cart' },
    { key: 'shipping', label: 'Shipping' },
    { key: 'payment', label: 'Payment' },
    { key: 'confirmed', label: 'Confirmed' },
  ];
  const currentIdx = steps.findIndex(s => s.key === step);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: '48px' }}>
      {steps.map((s, i) => (
        <div key={s.key} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: i <= currentIdx ? 'var(--espresso)' : 'var(--cream-dark)',
                color: i <= currentIdx ? 'var(--cream)' : 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: '600',
                transition: 'all 0.2s',
              }}
            >
              {i < currentIdx ? '✓' : i + 1}
            </div>
            <span
              style={{
                fontSize: '10px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: i <= currentIdx ? 'var(--espresso)' : 'var(--text-muted)',
              }}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              style={{
                width: '60px',
                height: '1px',
                backgroundColor: i < currentIdx ? 'var(--espresso)' : 'var(--border)',
                margin: '0 4px',
                marginBottom: '18px',
                transition: 'background-color 0.2s',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function OrderPage() {
  const { items, updateQty, removeItem, clearCart, subtotal } = useCart();
  const [step, setStep] = useState<Step>('cart');
  const [shipping, setShipping] = useState<ShippingDetails>(EMPTY_SHIPPING);
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ShippingDetails, string>>>({});

  const total = subtotal + (selectedRate?.price ?? 0);

  function validateShipping(): boolean {
    const errors: Partial<Record<keyof ShippingDetails, string>> = {};
    if (!shipping.firstName.trim()) errors.firstName = 'Required';
    if (!shipping.lastName.trim()) errors.lastName = 'Required';
    if (!shipping.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.email))
      errors.email = 'Valid email required';
    if (!shipping.address1.trim()) errors.address1 = 'Required';
    if (!shipping.city.trim()) errors.city = 'Required';
    if (!shipping.postcode.trim()) errors.postcode = 'Required';
    if (!shipping.country) errors.country = 'Required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleShippingContinue() {
    if (!validateShipping()) return;
    const rates = getShippingRates(shipping.postcode, shipping.country, subtotal);
    setShippingRates(rates);
    setSelectedRate(rates[0]);
    setStep('payment');
  }

  const inputStyle = (error?: string): React.CSSProperties => ({
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: `1px solid ${error ? '#c0392b' : 'var(--border)'}`,
    borderRadius: '1px',
    backgroundColor: 'var(--cream)',
    color: 'var(--text)',
    fontFamily: 'Georgia, serif',
  });

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '10px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    marginBottom: '6px',
  };

  if (step === 'confirmed') {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '24px' }}>☕</div>
        <h1 style={{ fontSize: '32px', fontFamily: 'Georgia, serif', color: 'var(--espresso)', marginBottom: '16px' }}>
          Order Confirmed
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.7, marginBottom: '8px' }}>
          Thank you, {shipping.firstName}. Your order is in.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '40px' }}>
          We&apos;ll send a confirmation to <strong>{shipping.email}</strong> and roast your beans fresh before shipping.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            padding: '12px 32px',
            backgroundColor: 'var(--espresso)',
            color: 'var(--cream)',
            fontSize: '13px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            borderRadius: '1px',
          }}
          onClick={clearCart}
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px 80px' }}>
      <StepIndicator step={step} />

      {/* CART STEP */}
      {step === 'cart' && (
        <div>
          <h1 style={{ fontSize: '24px', fontFamily: 'Georgia, serif', color: 'var(--espresso)', marginBottom: '32px' }}>
            Your Cart
          </h1>

          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Your cart is empty.</p>
              <Link
                href="/"
                style={{
                  padding: '12px 28px',
                  backgroundColor: 'var(--espresso)',
                  color: 'var(--cream)',
                  fontSize: '13px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  borderRadius: '1px',
                }}
              >
                Shop Coffee
              </Link>
            </div>
          ) : (
            <div>
              {/* Cart items */}
              <div style={{ borderTop: '1px solid var(--border)' }}>
                {items.map(item => (
                  <div
                    key={`${item.product.id}-${item.weight}-${item.grind}`}
                    style={{
                      display: 'flex',
                      gap: '20px',
                      padding: '20px 0',
                      borderBottom: '1px solid var(--border)',
                      alignItems: 'flex-start',
                    }}
                  >
                    {/* Icon */}
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        backgroundColor: 'var(--cream-dark)',
                        borderRadius: '1px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
                        <ellipse cx="24" cy="24" rx="14" ry="8" stroke="var(--brown)" strokeWidth="1.5" fill="none" />
                        <path d="M24 16 Q28 24 24 32" stroke="var(--brown)" strokeWidth="1.5" fill="none" />
                      </svg>
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--espresso)', marginBottom: '4px' }}>
                        {item.product.name}
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {WEIGHT_LABELS[item.weight]}
                        {item.grind && ` · ${GRIND_LABELS[item.grind]}`}
                      </p>
                    </div>

                    {/* Qty */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => updateQty(item.product.id, item.weight, item.grind, item.quantity - 1)}
                        style={{
                          width: '28px', height: '28px',
                          border: '1px solid var(--border)',
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                          fontSize: '16px',
                          color: 'var(--text-muted)',
                          borderRadius: '1px',
                        }}
                      >
                        −
                      </button>
                      <span style={{ fontSize: '14px', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.product.id, item.weight, item.grind, item.quantity + 1)}
                        style={{
                          width: '28px', height: '28px',
                          border: '1px solid var(--border)',
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                          fontSize: '16px',
                          color: 'var(--text-muted)',
                          borderRadius: '1px',
                        }}
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div style={{ textAlign: 'right', minWidth: '80px' }}>
                      <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--espresso)' }}>
                        ¥{(item.product.price[item.weight] * item.quantity).toLocaleString()}
                      </p>
                      <button
                        onClick={() => removeItem(item.product.id, item.weight, item.grind)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '11px',
                          color: 'var(--text-muted)',
                          letterSpacing: '0.05em',
                          marginTop: '4px',
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ width: '280px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Subtotal</span>
                    <span style={{ fontSize: '13px', color: 'var(--text)' }}>¥{subtotal.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Shipping</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Calculated next</span>
                  </div>
                  <button
                    onClick={() => setStep('shipping')}
                    style={{
                      width: '100%',
                      padding: '14px',
                      backgroundColor: 'var(--espresso)',
                      color: 'var(--cream)',
                      fontSize: '13px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      border: 'none',
                      borderRadius: '1px',
                      cursor: 'pointer',
                    }}
                  >
                    Continue to Shipping →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SHIPPING STEP */}
      {step === 'shipping' && (
        <div>
          <h1 style={{ fontSize: '24px', fontFamily: 'Georgia, serif', color: 'var(--espresso)', marginBottom: '32px' }}>
            Shipping Details
          </h1>

          <div style={{ display: 'grid', gap: '20px', maxWidth: '600px' }}>
            {/* Name row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>First Name *</label>
                <input
                  type="text"
                  value={shipping.firstName}
                  onChange={e => setShipping(s => ({ ...s, firstName: e.target.value }))}
                  style={inputStyle(formErrors.firstName)}
                  autoComplete="given-name"
                />
                {formErrors.firstName && <p style={{ fontSize: '11px', color: '#c0392b', marginTop: '4px' }}>{formErrors.firstName}</p>}
              </div>
              <div>
                <label style={labelStyle}>Last Name *</label>
                <input
                  type="text"
                  value={shipping.lastName}
                  onChange={e => setShipping(s => ({ ...s, lastName: e.target.value }))}
                  style={inputStyle(formErrors.lastName)}
                  autoComplete="family-name"
                />
                {formErrors.lastName && <p style={{ fontSize: '11px', color: '#c0392b', marginTop: '4px' }}>{formErrors.lastName}</p>}
              </div>
            </div>

            {/* Email & Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Email *</label>
                <input
                  type="email"
                  value={shipping.email}
                  onChange={e => setShipping(s => ({ ...s, email: e.target.value }))}
                  style={inputStyle(formErrors.email)}
                  autoComplete="email"
                />
                {formErrors.email && <p style={{ fontSize: '11px', color: '#c0392b', marginTop: '4px' }}>{formErrors.email}</p>}
              </div>
              <div>
                <label style={labelStyle}>Phone</label>
                <input
                  type="tel"
                  value={shipping.phone}
                  onChange={e => setShipping(s => ({ ...s, phone: e.target.value }))}
                  style={inputStyle()}
                  autoComplete="tel"
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <label style={labelStyle}>Country *</label>
              <select
                value={shipping.country}
                onChange={e => setShipping(s => ({ ...s, country: e.target.value }))}
                style={{
                  ...inputStyle(formErrors.country),
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238b5e3c' strokeWidth='1.5' fill='none'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  cursor: 'pointer',
                }}
              >
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Address */}
            <div>
              <label style={labelStyle}>Address Line 1 *</label>
              <input
                type="text"
                value={shipping.address1}
                onChange={e => setShipping(s => ({ ...s, address1: e.target.value }))}
                style={inputStyle(formErrors.address1)}
                autoComplete="address-line1"
                placeholder="Street address, building name"
              />
              {formErrors.address1 && <p style={{ fontSize: '11px', color: '#c0392b', marginTop: '4px' }}>{formErrors.address1}</p>}
            </div>

            <div>
              <label style={labelStyle}>Address Line 2</label>
              <input
                type="text"
                value={shipping.address2}
                onChange={e => setShipping(s => ({ ...s, address2: e.target.value }))}
                style={inputStyle()}
                autoComplete="address-line2"
                placeholder="Room, floor, apartment number"
              />
            </div>

            {/* City / State / Postcode */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>City *</label>
                <input
                  type="text"
                  value={shipping.city}
                  onChange={e => setShipping(s => ({ ...s, city: e.target.value }))}
                  style={inputStyle(formErrors.city)}
                  autoComplete="address-level2"
                />
                {formErrors.city && <p style={{ fontSize: '11px', color: '#c0392b', marginTop: '4px' }}>{formErrors.city}</p>}
              </div>
              <div>
                <label style={labelStyle}>Prefecture / State</label>
                <input
                  type="text"
                  value={shipping.state}
                  onChange={e => setShipping(s => ({ ...s, state: e.target.value }))}
                  style={inputStyle()}
                  autoComplete="address-level1"
                />
              </div>
              <div>
                <label style={labelStyle}>Postcode *</label>
                <input
                  type="text"
                  value={shipping.postcode}
                  onChange={e => setShipping(s => ({ ...s, postcode: e.target.value }))}
                  style={inputStyle(formErrors.postcode)}
                  autoComplete="postal-code"
                  placeholder={shipping.country === 'JP' ? '000-0000' : ''}
                />
                {formErrors.postcode && <p style={{ fontSize: '11px', color: '#c0392b', marginTop: '4px' }}>{formErrors.postcode}</p>}
              </div>
            </div>

            {/* Note about freshness */}
            <div
              style={{
                padding: '14px 16px',
                backgroundColor: 'var(--cream-dark)',
                borderLeft: '3px solid var(--brown)',
                fontSize: '13px',
                color: 'var(--text-muted)',
                lineHeight: 1.6,
              }}
            >
              Your beans are roasted fresh after your order is placed. Please allow 1–2 days for roasting before dispatch.
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '32px', maxWidth: '600px' }}>
            <button
              onClick={() => setStep('cart')}
              style={{
                padding: '12px 20px',
                fontSize: '13px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                border: '1px solid var(--border)',
                backgroundColor: 'transparent',
                color: 'var(--text-muted)',
                borderRadius: '1px',
                cursor: 'pointer',
              }}
            >
              ← Back
            </button>
            <button
              onClick={handleShippingContinue}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: 'var(--espresso)',
                color: 'var(--cream)',
                fontSize: '13px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                border: 'none',
                borderRadius: '1px',
                cursor: 'pointer',
              }}
            >
              Continue to Payment →
            </button>
          </div>
        </div>
      )}

      {/* PAYMENT STEP */}
      {step === 'payment' && (
        <CheckoutPayment
          shipping={shipping}
          shippingRates={shippingRates}
          selectedRate={selectedRate}
          onSelectRate={setSelectedRate}
          subtotal={subtotal}
          total={total}
          onBack={() => setStep('shipping')}
          onConfirmed={() => setStep('confirmed')}
        />
      )}
    </div>
  );
}
