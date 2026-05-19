"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("919000000000");

  const isDev = typeof window !== "undefined" && window.location.hostname === "localhost";

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } catch (e) {
        if (isDev) console.error("Failed to parse cart from localStorage", e);
      } finally {
        setIsInitialized(true);
      }
    }
  }, [isDev]);

  useEffect(() => {
    let isMounted = true;
    // Fetch WhatsApp number from settings
    fetch("/api/settings", { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.whatsappNumber) setWhatsappNumber(data.whatsappNumber);
      })
      .catch(err => {
        if (isDev) console.error("Failed to fetch WhatsApp number", err);
      });
      
    return () => {
      isMounted = false;
    };
  }, [isDev]);

  // Save cart to localStorage whenever it changes, but only after initial load
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized]);

  // Refresh settings when cart opens to ensure latest WhatsApp number
  useEffect(() => {
    let isMounted = true;
    
    const fetchSettings = () => {
      fetch("/api/settings", { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          if (isMounted && data.whatsappNumber) setWhatsappNumber(data.whatsappNumber);
        })
        .catch(err => {
          if (isDev) console.error("Failed to refresh WhatsApp number", err);
        });
    };

    if (isCartOpen) {
      fetchSettings();
    }

    // Also refresh on window focus to sync across tabs (Admin -> Storefront)
    window.addEventListener('focus', fetchSettings);
    return () => {
      isMounted = false;
      window.removeEventListener('focus', fetchSettings);
    };
  }, [isCartOpen, isDev]);

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

  const clearCart = () => {
    setCartItems([]);
  };

  const updateCartPrices = (validatedItems) => {
    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        const match = validatedItems.find((vi) => vi.serial === item.serial);
        if (match) {
          return {
            ...item,
            price: match.price,
            name: match.name,
            originalPrice: match.originalPrice,
            image1: match.image1
          };
        }
        return item;
      });
    });
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        updateCartPrices,
        cartTotal,
        cartCount,
        whatsappNumber,
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
