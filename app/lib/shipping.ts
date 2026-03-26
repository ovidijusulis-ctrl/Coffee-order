export interface ShippingRate {
  id: string;
  nameJa: string;
  descriptionJa: string;
  price: number;
  estimatedDaysJa: string;
}

// 甲府市・山梨県内の主要郵便番号（ローカル配達エリア）
const LOCAL_POSTCODES = [
  '400', '401', '402', '403', '404', '405', '406', '407', '408', '409',
  '410', '411', '412', '413', '414', '415',
];

export function getShippingRates(postcode: string, country: string, subtotal: number): ShippingRate[] {
  const prefix = postcode.replace(/[^0-9]/g, '').substring(0, 3);
  const isLocal = country === 'JP' && LOCAL_POSTCODES.includes(prefix);
  const FREE_THRESHOLD = 5000;

  const rates: ShippingRate[] = [];

  if (isLocal) {
    rates.push({
      id: 'local',
      nameJa: '手渡し配達（山梨県内）',
      descriptionJa: 'スタッフが直接お届けします',
      price: subtotal >= FREE_THRESHOLD ? 0 : 300,
      estimatedDaysJa: '当日〜翌日',
    });
  }

  rates.push({
    id: 'standard',
    nameJa: country === 'JP' ? '通常配送（ゆうパック）' : '国際通常便',
    descriptionJa: country === 'JP' ? '日本郵便' : '国際郵便',
    price: subtotal >= FREE_THRESHOLD ? 0 : country === 'JP' ? 600 : 2500,
    estimatedDaysJa: country === 'JP' ? '2〜4営業日' : '7〜14営業日',
  });

  if (country === 'JP') {
    rates.push({
      id: 'express',
      nameJa: '速達配送（ヤマト宅急便）',
      descriptionJa: '翌日お届け',
      price: 900,
      estimatedDaysJa: '翌営業日',
    });
  }

  return rates;
}

export const COUNTRIES = [
  { code: 'JP', name: '日本' },
  { code: 'AU', name: 'Australia' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'SG', name: 'Singapore' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'KR', name: '韓国' },
  { code: 'TW', name: '台湾' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' },
];
