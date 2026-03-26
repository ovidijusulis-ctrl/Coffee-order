export interface ShippingRate {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
}

// Postcodes for local delivery zone (customize for your area)
const LOCAL_POSTCODES = [
  // Example: Central Tokyo postcodes (100-xxx to 169-xxx range)
  // Replace with your actual local delivery zone
  '100', '101', '102', '103', '104', '105', '106', '107', '108', '109',
  '110', '111', '112', '113', '114', '115', '116', '117', '118', '119',
  '120', '130', '131', '132', '140', '141', '142', '150', '151', '152',
  '153', '154', '155', '156', '157', '160', '161', '162', '163', '164',
  '165', '166', '167', '168', '169', '170', '171', '172', '173',
];

export function getShippingRates(postcode: string, country: string, subtotal: number): ShippingRate[] {
  const prefix3 = postcode.replace(/[^0-9]/g, '').substring(0, 3);
  const isLocal = country === 'JP' && LOCAL_POSTCODES.includes(prefix3);
  const freeShippingThreshold = 5000; // ¥5,000 or equivalent

  const rates: ShippingRate[] = [];

  if (isLocal) {
    rates.push({
      id: 'local-delivery',
      name: 'Local Delivery',
      description: 'Hand-delivered by us. Same day if ordered before 12pm.',
      price: subtotal >= freeShippingThreshold ? 0 : 300,
      estimatedDays: 'Same day / Next day',
    });
  }

  rates.push({
    id: 'standard',
    name: 'Standard Shipping',
    description: 'Japan Post Compact / Yu-packet',
    price: subtotal >= freeShippingThreshold ? 0 : country === 'JP' ? 550 : 2000,
    estimatedDays: country === 'JP' ? '2–4 business days' : '7–14 business days',
  });

  if (country === 'JP') {
    rates.push({
      id: 'express',
      name: 'Express',
      description: 'Yamato TA-Q-BIN next day delivery',
      price: 900,
      estimatedDays: 'Next business day',
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
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'CH', name: 'Switzerland' },
];
