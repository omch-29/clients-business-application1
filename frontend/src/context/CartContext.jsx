import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "broom_store_cart";

function loadInitialCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadInitialCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addToCart(product, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product._id);
      const maxQty = product.stock ?? Infinity;

      if (existing) {
        const nextQty = Math.min(existing.quantity + quantity, maxQty);
        return prev.map((i) =>
          i.productId === product._id ? { ...i, quantity: nextQty } : i
        );
      }

      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0]?.url,
          stock: product.stock,
          quantity: Math.min(quantity, maxQty),
        },
      ];
    });
  }

  function removeFromCart(productId) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function updateQuantity(productId, quantity) {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId
          ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock ?? Infinity)) }
          : i
      )
    );
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity * i.price, 0),
    [items]
  );

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
