import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { Book, CartItem } from '../types';

/* ──────────────────────────────────────────────
 *  Types
 * ────────────────────────────────────────────── */

interface CartContextType {
  cart: CartItem[];
  addToCart: (book: Book) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isEmpty: boolean;
}

/* ──────────────────────────────────────────────
 *  Constants & helpers
 * ────────────────────────────────────────────── */

const STORAGE_KEY = 'app_cart_v1';
const MAX_QTY = 99;
const isBrowser = typeof window !== 'undefined';

function loadCart(): CartItem[] {
  if (!isBrowser) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    console.warn('[CartProvider] Failed to parse cart from localStorage.');
    return [];
  }
}

function persistCart(cart: CartItem[]): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch {
    console.warn('[CartProvider] Failed to persist cart.');
  }
}

/** Fire a custom DOM event so toasts / analytics can listen */
function emitCartEvent(
  action: 'add' | 'remove' | 'update' | 'clear',
  detail?: Record<string, unknown>,
) {
  if (!isBrowser) return;
  window.dispatchEvent(
    new CustomEvent('cart:change', { detail: { action, ...detail } }),
  );
}

/* ──────────────────────────────────────────────
 *  Context
 * ────────────────────────────────────────────── */

const CartContext = createContext<CartContextType | undefined>(undefined);

/* ──────────────────────────────────────────────
 *  Provider
 * ────────────────────────────────────────────── */

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>(loadCart);

  // Always holds the latest cart, so callbacks can read it
  // without changing their identity.
  const cartRef = useRef(cart);
  cartRef.current = cart;

  useEffect(() => {
    persistCart(cart);
  }, [cart]);

  const addToCart = useCallback((book: Book) => {
    const existing = cartRef.current.find((i) => i.id === book.id);
    if (existing && existing.quantity >= MAX_QTY) return;

    // Updater stays pure (no side effects inside)
    setCart((prev) =>
      prev.some((i) => i.id === book.id)
        ? prev.map((i) =>
            i.id === book.id
              ? { ...i, quantity: Math.min(i.quantity + 1, MAX_QTY) }
              : i,
          )
        : [...prev, { ...book, quantity: 1 }],
    );
    emitCartEvent('add', { id: book.id, title: book.title });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    const target = cartRef.current.find((i) => i.id === id);
    if (!target) return;

    setCart((prev) => prev.filter((i) => i.id !== id));
    emitCartEvent('remove', { id, title: target.title });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (!cartRef.current.some((i) => i.id === id)) return;
    const clamped = Math.max(1, Math.min(quantity, MAX_QTY));

    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: clamped } : i)),
    );
    emitCartEvent('update', { id, quantity: clamped });
  }, []);

  const clearCart = useCallback(() => {
    if (cartRef.current.length === 0) return;
    setCart([]);
    emitCartEvent('clear');
  }, []);

  const totalItems = useMemo(
    () => cart.reduce((sum, i) => sum + i.quantity, 0),
    [cart],
  );
  const totalPrice = useMemo(
    () => cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [cart],
  );
  const isEmpty = cart.length === 0;

  const value = useMemo<CartContextType>(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      isEmpty,
    }),
    [cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, isEmpty],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

/* ──────────────────────────────────────────────
 *  Hook
 * ────────────────────────────────────────────── */

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a <CartProvider>');
  }
  return ctx;
};