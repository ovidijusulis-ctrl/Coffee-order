'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../lib/cart';
import { getShippingRates, COUNTRIES, ShippingRate } from '../lib/shipping';
import { GRIND_LABELS_JA, WEIGHT_LABELS } from '../lib/products';
import CheckoutPayment from '../components/CheckoutPayment';

type Step = 'cart' | 'details' | 'payment' | 'confirmed';

interface Details {
  lastName: string; firstName: string;
  lastNameKana: string; firstNameKana: string;
  email: string; phone: string;
  postcode: string; prefecture: string;
  address1: string; address2: string;
  country: string;
}

const EMPTY: Details = {
  lastName: '', firstName: '',
  lastNameKana: '', firstNameKana: '',
  email: '', phone: '',
  postcode: '', prefecture: '',
  address1: '', address2: '',
  country: 'JP',
};

const LABEL: React.CSSProperties = {
  fontSize: '10px', textTransform: 'uppercase' as const,
  letterSpacing: '0.12em', fontWeight: 600, display: 'block',
  marginBottom: '6px', color: 'var(--text-muted)',
};
const INPUT: React.CSSProperties = {
  width: '100%', padding: '12px', fontSize: '14px',
  border: '1px solid var(--border)', background: 'var(--surface-low)',
  color: 'var(--text)',
};
const ERR: React.CSSProperties = { fontSize: '11px', color: '#ff7070', marginTop: '4px' };

const HEADER: React.CSSProperties = {
  position: 'sticky', top: 0, zIndex: 50,
  background: 'rgba(46,45,45,0.92)', backdropFilter: 'blur(12px)',
  borderBottom: '1px solid var(--border-light)',
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '0 20px', height: '56px',
};
const BTN_PRIMARY: React.CSSProperties = {
  width: '100%', padding: '17px', background: 'var(--primary)',
  color: 'var(--on-primary)', border: 'none', fontSize: '13px',
  fontWeight: 700, letterSpacing: '0.15em',
};
const BTN_BACK: React.CSSProperties = {
  background: 'none', border: 'none', fontSize: '12px',
  letterSpacing: '0.08em', color: 'var(--text-muted)', padding: '4px 0',
};

// Step dots
function Steps({ step }: { step: Step }) {
  const steps: Step[] = ['cart', 'details', 'payment'];
  const labels = ['カート', '配送先', 'お支払い'];
  const cur = steps.indexOf(step);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{
            width: '22px', height: '22px', borderRadius: '50%',
            background: cur > i ? 'var(--accent)' : cur === i ? 'var(--primary)' : 'var(--surface-high)',
            color: cur > i ? 'var(--on-primary)' : cur === i ? 'var(--on-primary)' : 'var(--text-muted)',
            fontSize: '9px', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {cur > i ? '✓' : i + 1}
          </div>
          <span style={{ fontSize: '9px', color: cur === i ? 'var(--text)' : 'var(--text-muted)', letterSpacing: '0.05em', marginRight: '4px' }}>
            {labels[i]}
          </span>
          {i < steps.length - 1 && (
            <div style={{ width: '10px', height: '1px', background: 'var(--border)', marginRight: '4px' }} />
          )}
        </div>
      ))}
    </div>
  );
}

const PREFECTURES = [
  '北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県',
  '茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県',
  '新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県',
  '静岡県','愛知県','三重県','滋賀県','京都府','大阪府','兵庫県',
  '奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県',
  '徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県',
  '熊本県','大分県','宮崎県','鹿児島県','沖縄県',
];

export default function OrderPage() {
  const { items, relatedItems, updateQty, removeItem, clearCart, subtotal } = useCart();
  const [step, setStep] = useState<Step>('cart');
  const [details, setDetails] = useState<Details>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Details, string>>>({});
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);

  const total = subtotal + (selectedRate?.price ?? 0);
  const isJP = details.country === 'JP';

  function set(f: keyof Details, v: string) {
    setDetails(d => ({ ...d, [f]: v }));
    if (errors[f]) setErrors(e => ({ ...e, [f]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof Details, string>> = {};
    if (!details.lastName.trim()) e.lastName = '入力してください';
    if (!details.firstName.trim()) e.firstName = '入力してください';
    if (!details.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) e.email = '正しいメールアドレスを入力してください';
    if (!details.phone.trim()) e.phone = '入力してください';
    if (!details.postcode.trim()) e.postcode = '入力してください';
    if (!details.address1.trim()) e.address1 = '入力してください';
    if (isJP && !details.prefecture.trim()) e.prefecture = '選択してください';
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

  const fullAddress = isJP
    ? `${details.postcode ? '〒' + details.postcode + ' ' : ''}${details.prefecture}${details.address1}${details.address2 ? ' ' + details.address2 : ''}`
    : `${details.address1}${details.address2 ? ', ' + details.address2 : ''}`;

  if (step === 'confirmed') {
    return (
      <>
        <header style={HEADER}>
          <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '18px' }}>the;kokubo</p>
        </header>
        <div style={{ maxWidth: '480px', margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
          <p style={{ fontSize: '40px', marginBottom: '20px' }}>☕</p>
          <h1 style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            fontSize: '28px', marginBottom: '16px', color: 'var(--text)',
          }}>
            ご注文ありがとうございます
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '6px' }}>
            {details.lastName} {details.firstName} 様のご注文を受け付けました。
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            確認メールを <strong style={{ color: 'var(--text)' }}>{details.email}</strong> にお送りします。
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '40px', lineHeight: 1.7 }}>
            ご注文後に手回し焙煎を行い、2日以内に発送いたします。
          </p>
          <Link href="/" onClick={clearCart} style={{
            display: 'inline-block', padding: '15px 36px',
            background: 'var(--primary)', color: 'var(--on-primary)',
            fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em',
            textDecoration: 'none',
          }}>
            ← ショップに戻る
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <header style={HEADER}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '18px', color: 'var(--text)' }}>
            the;kokubo
          </p>
        </Link>
        <Steps step={step} />
      </header>

      <main style={{ maxWidth: '520px', margin: '0 auto', padding: '32px 20px 80px' }}>

        {/* ── カート ── */}
        {step === 'cart' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '26px', marginBottom: '24px' }}>
              ご注文内容
            </h2>

            {items.length === 0 && relatedItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>カートに商品がありません。</p>
                <Link href="/" style={{
                  display: 'inline-block', padding: '14px 32px',
                  background: 'var(--primary)', color: 'var(--on-primary)',
                  textDecoration: 'none', fontSize: '12px', letterSpacing: '0.12em',
                }}>
                  豆を選ぶ
                </Link>
              </div>
            ) : (
              <>
                {items.map(item => (
                  <div key={`${item.product.id}-${item.weight}-${item.grind}`} style={{
                    display: 'flex', gap: '12px', padding: '14px 0',
                    borderBottom: '1px solid var(--border-light)', alignItems: 'center',
                  }}>
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontSize: '15px', fontFamily: 'var(--font-serif)', fontStyle: 'italic',
                        color: 'var(--text)', marginBottom: '3px',
                      }}>
                        {item.product.name}
                      </p>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {WEIGHT_LABELS[item.weight]} · {GRIND_LABELS_JA[item.grind]}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button onClick={() => updateQty(item.product.id, item.weight, item.grind, item.quantity - 1)} style={{
                        width: '28px', height: '28px', border: '1px solid var(--border)',
                        background: 'none', fontSize: '14px', color: 'var(--text)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>−</button>
                      <span style={{ fontSize: '13px', minWidth: '18px', textAlign: 'center', color: 'var(--text)' }}>
                        {item.quantity}
                      </span>
                      <button onClick={() => updateQty(item.product.id, item.weight, item.grind, item.quantity + 1)} style={{
                        width: '28px', height: '28px', border: '1px solid var(--border)',
                        background: 'none', fontSize: '14px', color: 'var(--text)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>+</button>
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: 600, minWidth: '70px', textAlign: 'right', color: 'var(--text)' }}>
                      ¥{(item.product.price[item.weight] * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}

                {relatedItems.map(r => (
                  <div key={r.item.id} style={{
                    display: 'flex', gap: '12px', padding: '14px 0',
                    borderBottom: '1px solid var(--border-light)', alignItems: 'center',
                  }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '14px', color: 'var(--text)', marginBottom: '2px' }}>{r.item.nameJa}</p>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{r.item.categoryJa}</p>
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                      ¥{r.item.price.toLocaleString()}
                    </p>
                  </div>
                ))}

                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '16px 0', borderBottom: '1px solid var(--border-light)',
                }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>小計</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>¥{subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 28px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>送料</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>次のステップで確定</span>
                </div>

                <button onClick={() => setStep('details')} style={BTN_PRIMARY}>
                  次へ：配送先の入力 →
                </button>
                <Link href="/" style={{
                  display: 'block', textAlign: 'center', marginTop: '14px',
                  fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'none',
                }}>
                  ← 豆を追加する
                </Link>
              </>
            )}
          </div>
        )}

        {/* ── 配送先 ── */}
        {step === 'details' && (
          <div>
            <button onClick={() => setStep('cart')} style={BTN_BACK}>← カートに戻る</button>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '26px', margin: '16px 0 24px' }}>
              配送先情報
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Country */}
              <div>
                <label style={LABEL}>国・地域</label>
                <select value={details.country} onChange={e => set('country', e.target.value)} style={{
                  ...INPUT, appearance: 'none' as const,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239e9b9b' strokeWidth='1.5' fill='none'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
                }}>
                  {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
              </div>

              {/* Name */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={LABEL}>姓</label>
                  <input value={details.lastName} onChange={e => set('lastName', e.target.value)}
                    style={{ ...INPUT, borderColor: errors.lastName ? '#ff7070' : 'var(--border)' }}
                    autoComplete="family-name" placeholder="山田" />
                  {errors.lastName && <p style={ERR}>{errors.lastName}</p>}
                </div>
                <div>
                  <label style={LABEL}>名</label>
                  <input value={details.firstName} onChange={e => set('firstName', e.target.value)}
                    style={{ ...INPUT, borderColor: errors.firstName ? '#ff7070' : 'var(--border)' }}
                    autoComplete="given-name" placeholder="太郎" />
                  {errors.firstName && <p style={ERR}>{errors.firstName}</p>}
                </div>
              </div>

              {/* Kana (JP only) */}
              {isJP && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={LABEL}>姓（カナ）</label>
                    <input value={details.lastNameKana} onChange={e => set('lastNameKana', e.target.value)}
                      style={INPUT} placeholder="ヤマダ" />
                  </div>
                  <div>
                    <label style={LABEL}>名（カナ）</label>
                    <input value={details.firstNameKana} onChange={e => set('firstNameKana', e.target.value)}
                      style={INPUT} placeholder="タロウ" />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label style={LABEL}>メールアドレス</label>
                <input type="email" value={details.email} onChange={e => set('email', e.target.value)}
                  style={{ ...INPUT, borderColor: errors.email ? '#ff7070' : 'var(--border)' }}
                  autoComplete="email" placeholder="example@email.com" />
                {errors.email && <p style={ERR}>{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label style={LABEL}>電話番号</label>
                <input type="tel" value={details.phone} onChange={e => set('phone', e.target.value)}
                  style={{ ...INPUT, borderColor: errors.phone ? '#ff7070' : 'var(--border)' }}
                  autoComplete="tel" placeholder={isJP ? '090-0000-0000' : ''} />
                {errors.phone && <p style={ERR}>{errors.phone}</p>}
              </div>

              {/* Postcode */}
              <div style={{ display: 'grid', gridTemplateColumns: isJP ? '1fr 1fr' : '1fr', gap: '10px' }}>
                <div>
                  <label style={LABEL}>郵便番号</label>
                  <input value={details.postcode} onChange={e => set('postcode', e.target.value)}
                    style={{ ...INPUT, borderColor: errors.postcode ? '#ff7070' : 'var(--border)' }}
                    autoComplete="postal-code" placeholder={isJP ? '400-0043' : ''} />
                  {errors.postcode && <p style={ERR}>{errors.postcode}</p>}
                </div>
                {isJP && (
                  <div>
                    <label style={LABEL}>都道府県</label>
                    <select value={details.prefecture} onChange={e => set('prefecture', e.target.value)} style={{
                      ...INPUT, borderColor: errors.prefecture ? '#ff7070' : 'var(--border)',
                      appearance: 'none' as const,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239e9b9b' strokeWidth='1.5' fill='none'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
                    }}>
                      <option value="">選択してください</option>
                      {PREFECTURES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    {errors.prefecture && <p style={ERR}>{errors.prefecture}</p>}
                  </div>
                )}
              </div>

              {/* Address */}
              <div>
                <label style={LABEL}>{isJP ? '市区町村・番地' : 'Address'}</label>
                <input value={details.address1} onChange={e => set('address1', e.target.value)}
                  style={{ ...INPUT, borderColor: errors.address1 ? '#ff7070' : 'var(--border)', marginBottom: '8px' }}
                  autoComplete="address-line1"
                  placeholder={isJP ? '甲府市国母4-21-10' : 'Street address'} />
                {errors.address1 && <p style={{ ...ERR, marginTop: '-4px', marginBottom: '8px' }}>{errors.address1}</p>}
                <input value={details.address2} onChange={e => set('address2', e.target.value)}
                  style={INPUT} autoComplete="address-line2"
                  placeholder={isJP ? 'マンション名・部屋番号（任意）' : 'Apartment, floor (optional)'} />
              </div>

              <div style={{
                padding: '12px 14px', borderLeft: '2px solid var(--accent)',
                background: 'var(--surface-low)', fontSize: '12px',
                color: 'var(--text-muted)', lineHeight: 1.7, marginTop: '4px',
              }}>
                ご注文を受けてから手回しで焙煎します。焙煎・発送まで2日ほどお待ちください。
              </div>

              <button onClick={goToPayment} style={{ ...BTN_PRIMARY, marginTop: '4px' }}>
                次へ：お支払い →
              </button>
            </div>
          </div>
        )}

        {/* ── お支払い ── */}
        {step === 'payment' && (
          <CheckoutPayment
            details={{ ...details, fullName: `${details.lastName} ${details.firstName}`, fullAddress }}
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
