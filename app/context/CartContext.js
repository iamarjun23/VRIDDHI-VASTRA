"use client";

import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

const CartContext = createContext();

const SETTINGS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("919000000000");

  const settingsCache = useRef({ data: null, fetchedAt: 0 });

  const fetchSettings = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && settingsCache.current.data && (now - settingsCache.current.fetchedAt) < SETTINGS_CACHE_TTL) {
      return;
    }
    try {
      const res = await fetch("/api/settings", { cache: 'no-store' });
      const data = await res.json();
      settingsCache.current = { data, fetchedAt: now };
      if (data.whatsappNumber) setWhatsappNumber(data.whatsappNumber);
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) setCartItems(JSON.parse(savedCart));
      } catch {}
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized]);

  useEffect(() => {
    if (isCartOpen) fetchSettings(true);

    const onFocus = () => fetchSettings(true);
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [isCartOpen, fetchSettings]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.serial === product.serial);
      if (existingItem) {
        return prevItems.map((item) =>
          item.serial === product.serial
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (serial) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.serial !== serial));
  };

  const updateQuantity = (serial, quantity) => {
    if (quantity < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.serial === serial ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const updateCartPrices = (validatedItems) => {
    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        const match = validatedItems.find((vi) => vi.serial === item.serial);
        if (match) {
          return { ...item, price: match.price, name: match.name, originalPrice: match.originalPrice, image1: match.image1 };
        }
        return item;
      });
    });
  };

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems, isCartOpen, setIsCartOpen, addToCart, removeFromCart,
        updateQuantity, clearCart, updateCartPrices, cartTotal, cartCount, whatsappNumber,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
