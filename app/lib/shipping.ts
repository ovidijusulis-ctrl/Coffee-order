export interface ShippingRate {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
}

// First 3 digits of postcode → local delivery zone
// Replace with your actual area postcodes
const LOCAL_POSTCODES = [
  '100','101','102','103','104','105','106','107','108','109',
  '110','111','112','113','114','115','116','150','151','152',
  '153','154','155','156','160','161','162','163','164',
  '165','166','167','168','169','170','171','172','173',
];

export function getShippingRates(postcode: string, country: string, subtotal: number): ShippingRate[] {
  const prefix = postcode.replace(/[^0-9]/g, '').substring(0, 3);
  const isLocal = country === 'JP' && LOCAL_POSTCODES.includes(prefix);
  const FREE_THRESHOLD = 5000;

  const rates: ShippingRate[] = [];

  if (isLocal) {
    rates.push({
      id: 'local',
      name: 'Local Delivery',
      description: 'Hand-delivered by us',
      price: subtotal >= FREE_THRESHOLD ? 0 : 300,
      estimatedDays: 'Same or next day',
    });
  }

  rates.push({
    id: 'standard',
    name: 'Standard',
    description: country === 'JP' ? 'Japan Post' : 'International post',
    price: subtotal >= FREE_THRESHOLD ? 0 : country === 'JP' ? 550 : 2000,
    estimatedDays: country === 'JP' ? '2–4 days' : '7–14 days',
  });

  if (country === 'JP') {
    rates.push({
      id: 'express',
      name: 'Express',
      description: 'Yamato next day',
      price: 900,
      estimatedDays: 'Next day',
    });
  }

  return rates;
}

export const COUNTRIES = [
  { code: 'JP', name: 'Japan' },
  { code: 'AU', name: 'Australia' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'SG', name: 'Singapore' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'KR', name: 'South Korea' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'CH', name: 'Switzerland' },
];
