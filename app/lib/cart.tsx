'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Product, GrindOption, WeightOption } from './products';

export interface CartItem {
  product: Product;
  weight: WeightOption;
  grind: GrindOption | null;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD'; item: CartItem }
  | { type: 'REMOVE'; productId: string; weight: WeightOption; grind: GrindOption | null }
  | { type: 'UPDATE_QTY'; productId: string; weight: WeightOption; grind: GrindOption | null; quantity: number }
  | { type: 'CLEAR' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const key = `${action.item.product.id}-${action.item.weight}-${action.item.grind}`;
      const existing = state.items.find(
        i => `${i.product.id}-${i.weight}-${i.grind}` === key
      );
      if (existing) {
        return {
          items: state.items.map(i =>
            `${i.product.id}-${i.weight}-${i.grind}` === key
              ? { ...i, quantity: i.quantity + action.item.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, action.item] };
    }
    case 'REMOVE':
      return {
        items: state.items.filter(
          i => !(i.product.id === action.productId && i.weight === action.weight && i.grind === action.grind)
        ),
      };
    case 'UPDATE_QTY':
      if (action.quantity <= 0) {
        return {
          items: state.items.filter(
            i => !(i.product.id === action.productId && i.weight === action.weight && i.grind === action.grind)
          ),
        };
      }
      return {
        items: state.items.map(i =>
          i.product.id === action.productId && i.weight === action.weight && i.grind === action.grind
            ? { ...i, quantity: action.quantity }
            : i
        ),
      };
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, weight: WeightOption, grind: GrindOption | null) => void;
  updateQty: (productId: string, weight: WeightOption, grind: GrindOption | null, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce(
    (sum, i) => sum + i.product.price[i.weight] * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem: item => dispatch({ type: 'ADD', item }),
        removeItem: (productId, weight, grind) =>
          dispatch({ type: 'REMOVE', productId, weight, grind }),
        updateQty: (productId, weight, grind, quantity) =>
          dispatch({ type: 'UPDATE_QTY', productId, weight, grind, quantity }),
        clearCart: () => dispatch({ type: 'CLEAR' }),
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
