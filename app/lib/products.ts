export type GrindOption = 'whole-bean' | 'espresso' | 'filter' | 'french-press' | 'aeropress';
export type WeightOption = '100g' | '250g' | '500g' | '1kg';

export interface FlavorProfile {
  acidity: number;    // 酸味
  sweetness: number;  // 甘み
  body: number;       // コク
  bitterness: number; // 苦味
  aroma: number;      // 香り
  aftertaste: number; // 余韻
}

export interface Product {
  id: string;
  name: string;
  nameJa: string;
  origin: string;
  region: string;
  notes: string[];
  notesJa: string[];
  process: string;
  processJa: string;
  roast: 1 | 2 | 3 | 4 | 5;
  roastLabel: string;
  roastLabelJa: string;
  price: Record<WeightOption, number>;
  category: 'beans' | 'merchandise';
  grindOptions?: GrindOption[];
  descriptionJa: string;
  flavor: FlavorProfile;
}

export interface RelatedItem {
  id: string;
  nameJa: string;
  descriptionJa: string;
  price: number;
  categoryJa: string;
}

export const COFFEES: Product[] = [
  {
    id: 'ethiopia',
    name: 'ETHIOPIA',
    nameJa: 'エチオピア',
    origin: 'Ethiopia',
    region: 'Yirgacheffe',
    notes: ['Jasmine', 'Bergamot', 'Peach'],
    notesJa: ['ジャスミン', 'ベルガモット', '桃'],
    process: 'Washed',
    processJa: 'ウォッシュド',
    roast: 1,
    roastLabel: 'Light',
    roastLabelJa: 'ライト',
    price: { '100g': 1200, '250g': 2600, '500g': 4800, '1kg': 8800 },
    category: 'beans',
    grindOptions: ['whole-bean', 'espresso', 'filter', 'french-press', 'aeropress'],
    descriptionJa: 'コーヒー発祥の地から。高地で栽培された豆は華やかな花香とフルーティーな酸味が特徴です。',
    flavor: { acidity: 5, sweetness: 4, body: 2, bitterness: 1, aroma: 5, aftertaste: 4 },
  },
  {
    id: 'kenya',
    name: 'KENYA',
    nameJa: 'ケニア',
    origin: 'Kenya',
    region: 'Kirinyaga',
    notes: ['Blackcurrant', 'Berry', 'Citrus'],
    notesJa: ['カシス', 'ベリー', 'シトラス'],
    process: 'Double Washed',
    processJa: 'ダブルウォッシュド',
    roast: 2,
    roastLabel: 'Light–Medium',
    roastLabelJa: 'ライト〜ミディアム',
    price: { '100g': 1400, '250g': 3000, '500g': 5500, '1kg': 10000 },
    category: 'beans',
    grindOptions: ['whole-bean', 'espresso', 'filter', 'french-press', 'aeropress'],
    descriptionJa: 'ワインのような複雑さと力強いボディ。ケニア伝統のダブルウォッシュで透明感ある一杯に。',
    flavor: { acidity: 4, sweetness: 3, body: 4, bitterness: 2, aroma: 4, aftertaste: 5 },
  },
  {
    id: 'india',
    name: 'INDIA',
    nameJa: 'インド',
    origin: 'India',
    region: 'Chikmagalur',
    notes: ['Dark Chocolate', 'Spice', 'Cedar'],
    notesJa: ['ダークチョコレート', 'スパイス', 'シダー'],
    process: 'Natural',
    processJa: 'ナチュラル',
    roast: 3,
    roastLabel: 'Medium',
    roastLabelJa: 'ミディアム',
    price: { '100g': 1000, '250g': 2200, '500g': 4000, '1kg': 7200 },
    category: 'beans',
    grindOptions: ['whole-bean', 'espresso', 'filter', 'french-press', 'aeropress'],
    descriptionJa: '南インドの農園から。チョコレートとスパイスの奥深い風味。エスプレッソにもおすすめです。',
    flavor: { acidity: 2, sweetness: 3, body: 5, bitterness: 4, aroma: 3, aftertaste: 4 },
  },
  {
    id: 'nicaragua',
    name: 'NICARAGUA',
    nameJa: 'ニカラグア',
    origin: 'Nicaragua',
    region: 'Jinotega',
    notes: ['Caramel', 'Hazelnut', 'Brown Sugar'],
    notesJa: ['キャラメル', 'ヘーゼルナッツ', '黒糖'],
    process: 'Washed',
    processJa: 'ウォッシュド',
    roast: 3,
    roastLabel: 'Medium',
    roastLabelJa: 'ミディアム',
    price: { '100g': 1300, '250g': 2800, '500g': 5000, '1kg': 9200 },
    category: 'beans',
    grindOptions: ['whole-bean', 'espresso', 'filter', 'french-press', 'aeropress'],
    descriptionJa: 'まろやかな甘みとナッツの余韻。日々のコーヒーに寄り添う、飲み飽きしない一杯。',
    flavor: { acidity: 2, sweetness: 5, body: 3, bitterness: 2, aroma: 4, aftertaste: 3 },
  },
  {
    id: 'guatemala',
    name: 'GUATEMALA',
    nameJa: 'グアテマラ',
    origin: 'Guatemala',
    region: 'Antigua',
    notes: ['Milk Chocolate', 'Walnut', 'Honey'],
    notesJa: ['ミルクチョコレート', 'くるみ', 'はちみつ'],
    process: 'Washed',
    processJa: 'ウォッシュド',
    roast: 3,
    roastLabel: 'Medium',
    roastLabelJa: 'ミディアム',
    price: { '100g': 1100, '250g': 2400, '500g': 4400, '1kg': 8000 },
    category: 'beans',
    grindOptions: ['whole-bean', 'espresso', 'filter', 'french-press', 'aeropress'],
    descriptionJa: '火山性土壌が育む豊かなコク。チョコレートのような甘さとはちみつの優しい後味。',
    flavor: { acidity: 3, sweetness: 4, body: 4, bitterness: 3, aroma: 3, aftertaste: 4 },
  },
  {
    id: 'espresso-blend',
    name: 'HOUSE BLEND',
    nameJa: 'ハウスブレンド',
    origin: 'Brazil & Colombia',
    region: 'ブレンド',
    notes: ['Caramel', 'Orange', 'Dark Chocolate'],
    notesJa: ['キャラメル', 'オレンジピール', 'ダークチョコ'],
    process: 'Blend',
    processJa: 'ブレンド',
    roast: 4,
    roastLabel: 'Medium–Dark',
    roastLabelJa: 'ミディアム〜ダーク',
    price: { '100g': 1000, '250g': 2200, '500g': 4000, '1kg': 7200 },
    category: 'beans',
    grindOptions: ['whole-bean', 'espresso', 'filter', 'french-press', 'aeropress'],
    descriptionJa: 'the;kokuboの定番ブレンド。エスプレッソにもドリップにも。毎日飲みたくなるバランス。',
    flavor: { acidity: 2, sweetness: 4, body: 4, bitterness: 3, aroma: 3, aftertaste: 4 },
  },
];

export const RELATED_ITEMS: RelatedItem[] = [
  { id: 'drip-bag-5pk', nameJa: 'ドリップバッグ 5袋セット', descriptionJa: '一杯分ずつ。どこでも手軽に。', price: 1200, categoryJa: 'ブリューイング' },
  { id: 'ceramic-cup', nameJa: 'セラミックカップ', descriptionJa: '手作り、250ml。一点ものです。', price: 3800, categoryJa: 'グッズ' },
  { id: 'tote-bag', nameJa: 'キャンバストート', descriptionJa: 'オーガニックコットン製。', price: 2800, categoryJa: 'グッズ' },
  { id: 'gift-set', nameJa: 'ギフトセット 2種', descriptionJa: '選べる2種 × 100g。贈り物に。', price: 2800, categoryJa: 'ギフト' },
  { id: 'subscription', nameJa: '定期便 250g', descriptionJa: '月1回、旬の豆をお届け。', price: 2800, categoryJa: '定期便' },
];

export const GRIND_LABELS_JA: Record<GrindOption, string> = {
  'whole-bean': '豆のまま',
  'espresso': 'エスプレッソ',
  'filter': 'ドリップ',
  'french-press': 'フレンチプレス',
  'aeropress': 'エアロプレス',
};

export const GRIND_SUBLABELS_JA: Record<GrindOption, string> = {
  'whole-bean': '鮮度最大',
  'espresso': '細挽き',
  'filter': '中挽き',
  'french-press': '粗挽き',
  'aeropress': '中細挽き',
};

export const WEIGHT_LABELS: Record<WeightOption, string> = {
  '100g': '100g',
  '250g': '250g',
  '500g': '500g',
  '1kg': '1kg',
};

export const FLAVOR_AXES: { key: keyof FlavorProfile; label: string }[] = [
  { key: 'acidity',    label: '酸味' },
  { key: 'aroma',      label: '香り' },
  { key: 'sweetness',  label: '甘み' },
  { key: 'aftertaste', label: '余韻' },
  { key: 'body',       label: 'コク' },
  { key: 'bitterness', label: '苦味' },
];
