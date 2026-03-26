export type GrindOption = 'whole-bean' | 'espresso' | 'filter' | 'french-press' | 'aeropress';
export type WeightOption = '100g' | '250g' | '500g' | '1kg';

export interface Product {
  id: string;
  name: string;
  origin: string;
  region: string;
  notes: string[];
  process: string;
  roast: 1 | 2 | 3 | 4 | 5; // 1=light, 5=dark (out of 5)
  roastLabel: string;
  price: Record<WeightOption, number>;
  category: 'beans' | 'merchandise';
  grindOptions?: GrindOption[];
  description: string;
}

export interface RelatedItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

export const COFFEES: Product[] = [
  {
    id: 'ethiopia-yirgacheffe',
    name: 'Yirgacheffe',
    origin: 'Ethiopia',
    region: 'Gedeo Zone',
    notes: ['Jasmine', 'Bergamot', 'Peach'],
    process: 'Washed',
    roast: 1,
    roastLabel: 'Light',
    price: { '100g': 10, '250g': 22, '500g': 38, '1kg': 68 },
    category: 'beans' as const, grindOptions: ['whole-bean', 'espresso', 'filter', 'french-press', 'aeropress'],
    description: 'Bright and floral, grown at altitude in the birthplace of coffee.',
  },
  {
    id: 'kenya-aa',
    name: 'Kenya AA',
    origin: 'Kenya',
    region: 'Kirinyaga County',
    notes: ['Blackcurrant', 'Tomato', 'Dark Berry'],
    process: 'Double Washed',
    roast: 2,
    roastLabel: 'Light–Medium',
    price: { '100g': 11, '250g': 24, '500g': 42, '1kg': 75 },
    category: 'beans' as const, grindOptions: ['whole-bean', 'espresso', 'filter', 'french-press', 'aeropress'],
    description: 'Complex and wine-like with a bold, juicy body and exceptional clarity.',
  },
  {
    id: 'colombia-huila',
    name: 'Huila',
    origin: 'Colombia',
    region: 'Huila Department',
    notes: ['Dark Chocolate', 'Caramel', 'Red Apple'],
    process: 'Washed',
    roast: 2,
    roastLabel: 'Medium',
    price: { '100g': 9, '250g': 20, '500g': 35, '1kg': 62 },
    category: 'beans' as const, grindOptions: ['whole-bean', 'espresso', 'filter', 'french-press', 'aeropress'],
    description: 'Rich and chocolatey from small family farms alongside fruit trees.',
  },
  {
    id: 'guatemala-antigua',
    name: 'Antigua',
    origin: 'Guatemala',
    region: 'Sacatepéquez',
    notes: ['Milk Chocolate', 'Walnut', 'Honey'],
    process: 'Washed',
    roast: 3,
    roastLabel: 'Medium',
    price: { '100g': 9, '250g': 19, '500g': 33, '1kg': 58 },
    category: 'beans' as const, grindOptions: ['whole-bean', 'espresso', 'filter', 'french-press', 'aeropress'],
    description: 'Full-bodied sweetness grown in volcanic soil at 1,500m.',
  },
  {
    id: 'espresso-blend',
    name: 'House Espresso',
    origin: 'Brazil & Colombia',
    region: 'House Blend',
    notes: ['Hazelnut', 'Caramel', 'Orange Peel'],
    process: 'Blend',
    roast: 3,
    roastLabel: 'Medium–Dark',
    price: { '100g': 8, '250g': 18, '500g': 30, '1kg': 54 },
    category: 'beans' as const, grindOptions: ['whole-bean', 'espresso', 'filter', 'french-press', 'aeropress'],
    description: 'Our signature blend. Sweet and consistent for milk drinks and straight shots.',
  },
  {
    id: 'sumatra-mandheling',
    name: 'Mandheling',
    origin: 'Sumatra',
    region: 'North Sumatra',
    notes: ['Dark Chocolate', 'Cedar', 'Earth'],
    process: 'Wet Hulled',
    roast: 4,
    roastLabel: 'Dark',
    price: { '100g': 9, '250g': 20, '500g': 34, '1kg': 60 },
    category: 'beans' as const, grindOptions: ['whole-bean', 'espresso', 'filter', 'french-press', 'aeropress'],
    description: 'Bold and earthy with a heavy syrupy body. Wet-hulled in the Giling Basah tradition.',
  },
];

export const RELATED_ITEMS: RelatedItem[] = [
  { id: 'drip-bag-5pk', name: 'Drip Bag Pack', description: 'Single-serve pour-over bags. 5 pack.', price: 12, category: 'Brewing' },
  { id: 'ceramic-cup', name: 'Ceramic Cup', description: 'Hand-thrown, 250ml.', price: 28, category: 'Goods' },
  { id: 'tote-bag', name: 'Canvas Tote', description: 'Heavy-duty organic cotton.', price: 22, category: 'Goods' },
  { id: 'coffee-canister', name: 'Storage Canister', description: 'Airtight, UV-blocking glass.', price: 35, category: 'Brewing' },
  { id: 'subscription-250g', name: 'Monthly Sub — 250g', description: 'Our pick, roasted fresh, monthly.', price: 20, category: 'Subscription' },
];

export const GRIND_LABELS: Record<GrindOption, string> = {
  'whole-bean': 'Whole Bean',
  'espresso': 'Espresso',
  'filter': 'Drip / Filter',
  'french-press': 'French Press',
  'aeropress': 'AeroPress',
};

export const GRIND_SUBLABELS: Record<GrindOption, string> = {
  'whole-bean': 'Maximum freshness',
  'espresso': 'Fine grind',
  'filter': 'Medium grind',
  'french-press': 'Coarse grind',
  'aeropress': 'Medium-fine',
};

export const WEIGHT_LABELS: Record<WeightOption, string> = {
  '100g': '100G',
  '250g': '250G',
  '500g': '500G',
  '1kg': '1KG',
};
