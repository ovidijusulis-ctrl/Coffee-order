export type GrindOption = 'whole-bean' | 'espresso' | 'filter' | 'french-press' | 'aeropress';
export type WeightOption = '250g' | '500g' | '1kg';

export interface Product {
  id: string;
  name: string;
  origin: string;
  description: string;
  notes: string[];
  process: string;
  roast: 'light' | 'medium' | 'dark';
  price: Record<WeightOption, number>;
  image: string;
  category: 'beans' | 'merchandise' | 'equipment';
  grindOptions?: GrindOption[];
  featured?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: 'ethiopia-yirgacheffe',
    name: 'Ethiopia Yirgacheffe',
    origin: 'Ethiopia',
    description: 'A bright and floral single origin from the birthplace of coffee. Grown at high altitude, washed and dried on raised beds.',
    notes: ['Jasmine', 'Bergamot', 'Peach', 'Lemon Zest'],
    process: 'Washed',
    roast: 'light',
    price: { '250g': 18, '500g': 32, '1kg': 58 },
    image: '/images/ethiopia.jpg',
    category: 'beans',
    grindOptions: ['whole-bean', 'espresso', 'filter', 'french-press', 'aeropress'],
    featured: true,
  },
  {
    id: 'colombia-huila',
    name: 'Colombia Huila',
    origin: 'Colombia',
    description: 'Rich and chocolatey with a smooth body. Grown by small family farms in the Huila department alongside fruit trees.',
    notes: ['Dark Chocolate', 'Caramel', 'Red Apple', 'Brown Sugar'],
    process: 'Washed',
    roast: 'medium',
    price: { '250g': 16, '500g': 28, '1kg': 50 },
    image: '/images/colombia.jpg',
    category: 'beans',
    grindOptions: ['whole-bean', 'espresso', 'filter', 'french-press', 'aeropress'],
    featured: true,
  },
  {
    id: 'kenya-aa',
    name: 'Kenya AA',
    origin: 'Kenya',
    description: 'Complex and wine-like with a bold, juicy body. Double-washed using the traditional Kenyan method for exceptional clarity.',
    notes: ['Blackcurrant', 'Tomato', 'Dark Berry', 'Citrus Peel'],
    process: 'Double Washed',
    roast: 'medium',
    price: { '250g': 20, '500g': 36, '1kg': 64 },
    image: '/images/kenya.jpg',
    category: 'beans',
    grindOptions: ['whole-bean', 'espresso', 'filter', 'french-press', 'aeropress'],
    featured: true,
  },
  {
    id: 'guatemala-antigua',
    name: 'Guatemala Antigua',
    origin: 'Guatemala',
    description: 'A classic Central American coffee with full body and gentle sweetness. Grown in volcanic soil at 1,500m elevation.',
    notes: ['Milk Chocolate', 'Walnut', 'Honey', 'Spice'],
    process: 'Washed',
    roast: 'medium',
    price: { '250g': 15, '500g': 26, '1kg': 46 },
    image: '/images/guatemala.jpg',
    category: 'beans',
    grindOptions: ['whole-bean', 'espresso', 'filter', 'french-press', 'aeropress'],
  },
  {
    id: 'sumatra-mandheling',
    name: 'Sumatra Mandheling',
    origin: 'Indonesia',
    description: 'Bold and earthy with a heavy syrupy body. Wet-hulled using the traditional Giling Basah method unique to Sumatra.',
    notes: ['Dark Chocolate', 'Cedar', 'Tobacco', 'Earth'],
    process: 'Wet Hulled',
    roast: 'dark',
    price: { '250g': 16, '500g': 28, '1kg': 50 },
    image: '/images/sumatra.jpg',
    category: 'beans',
    grindOptions: ['whole-bean', 'espresso', 'filter', 'french-press', 'aeropress'],
  },
  {
    id: 'espresso-blend',
    name: 'House Espresso Blend',
    origin: 'Brazil & Colombia',
    description: 'Our signature espresso blend. Balanced, sweet, and consistent — crafted for milk-based drinks and straight shots alike.',
    notes: ['Hazelnut', 'Caramel', 'Dark Chocolate', 'Orange Peel'],
    process: 'Blend',
    roast: 'medium',
    price: { '250g': 15, '500g': 26, '1kg': 46 },
    image: '/images/espresso-blend.jpg',
    category: 'beans',
    grindOptions: ['whole-bean', 'espresso', 'filter', 'french-press', 'aeropress'],
    featured: true,
  },
  {
    id: 'ceramic-cup',
    name: 'Kokubo Ceramic Cup',
    origin: 'Handmade',
    description: 'Hand-thrown ceramic cup with a natural glaze finish. Each piece is unique. Holds 250ml.',
    notes: [],
    process: '',
    roast: 'light',
    price: { '250g': 28, '500g': 28, '1kg': 28 },
    image: '/images/ceramic-cup.jpg',
    category: 'merchandise',
  },
  {
    id: 'tote-bag',
    name: 'Kokubo Canvas Tote',
    origin: 'Organic Cotton',
    description: 'Heavy-duty canvas tote with the Kokubo mark. Carries your coffee and your values.',
    notes: [],
    process: '',
    roast: 'light',
    price: { '250g': 22, '500g': 22, '1kg': 22 },
    image: '/images/tote-bag.jpg',
    category: 'merchandise',
  },
];

export const GRIND_LABELS: Record<GrindOption, string> = {
  'whole-bean': 'Whole Bean',
  'espresso': 'Espresso',
  'filter': 'Filter / Pour Over',
  'french-press': 'French Press',
  'aeropress': 'AeroPress',
};

export const WEIGHT_LABELS: Record<WeightOption, string> = {
  '250g': '250g',
  '500g': '500g',
  '1kg': '1kg',
};
