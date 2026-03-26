'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Product, RelatedItem, GrindOption, WeightOption } from './products';

export interface CartItem {
  product: Product;
  weight: WeightOption;
  grind: GrindOption;
  quantity: number;
}

export interface CartRelatedItem {
  item: RelatedItem;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  relatedItems: CartRelatedItem[];
}

type CartAction =
  | { type: 'ADD'; item: CartItem }
  | { type: 'REMOVE'; productId: string; weight: WeightOption; grind: GrindOption }
  | { type: 'UPDATE_QTY'; productId: string; weight: WeightOption; grind: GrindOption; quantity: number }
  | { type: 'ADD_RELATED'; item: RelatedItem }
  | { type: 'REMOVE_RELATED'; itemId: string }
  | { type: 'CLEAR' };

function key(productId: string, weight: WeightOption, grind: GrindOption) {
  return `${productId}-${weight}-${grind}`;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const k = key(action.item.product.id, action.item.weight, action.item.grind);
      const existing = state.items.find(i => key(i.product.id, i.weight, i.grind) === k);
      if (existing) {
        return { ...state, items: state.items.map(i => key(i.product.id, i.weight, i.grind) === k ? { ...i, quantity: i.quantity + 1 } : i) };
      }
      return { ...state, items: [...state.items, action.item] };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => key(i.product.id, i.weight, i.grind) !== key(action.productId, action.weight, action.grind)) };
    case 'UPDATE_QTY':
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter(i => key(i.product.id, i.weight, i.grind) !== key(action.productId, action.weight, action.grind)) };
      }
      return { ...state, items: state.items.map(i => key(i.product.id, i.weight, i.grind) === key(action.productId, action.weight, action.grind) ? { ...i, quantity: action.quantity } : i) };
    case 'ADD_RELATED': {
      const existing = state.relatedItems.find(r => r.item.id === action.item.id);
      if (existing) {
        return { ...state, relatedItems: state.relatedItems.map(r => r.item.id === action.item.id ? { ...r, quantity: r.quantity + 1 } : r) };
      }
      return { ...state, relatedItems: [...state.relatedItems, { item: action.item, quantity: 1 }] };
    }
    case 'REMOVE_RELATED':
      return { ...state, relatedItems: state.relatedItems.filter(r => r.item.id !== action.itemId) };
    case 'CLEAR':
      return { items: [], relatedItems: [] };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  relatedItems: CartRelatedItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, weight: WeightOption, grind: GrindOption) => void;
  updateQty: (productId: string, weight: WeightOption, grind: GrindOption, quantity: number) => void;
  addRelated: (item: RelatedItem) => void;
  removeRelated: (itemId: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], relatedItems: [] });

  const totalItems = state.items.reduce((s, i) => s + i.quantity, 0) + state.relatedItems.reduce((s, r) => s + r.quantity, 0);
  const subtotal =
    state.items.reduce((s, i) => s + i.product.price[i.weight] * i.quantity, 0) +
    state.relatedItems.reduce((s, r) => s + r.item.price * r.quantity, 0);

  return (
    <CartContext.Provider value={{
      items: state.items,
      relatedItems: state.relatedItems,
      addItem: item => dispatch({ type: 'ADD', item }),
      removeItem: (id, w, g) => dispatch({ type: 'REMOVE', productId: id, weight: w, grind: g }),
      updateQty: (id, w, g, qty) => dispatch({ type: 'UPDATE_QTY', productId: id, weight: w, grind: g, quantity: qty }),
      addRelated: item => dispatch({ type: 'ADD_RELATED', item }),
      removeRelated: id => dispatch({ type: 'REMOVE_RELATED', itemId: id }),
      clearCart: () => dispatch({ type: 'CLEAR' }),
      totalItems,
      subtotal,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
