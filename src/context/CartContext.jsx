import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  fetchCart,
  addToCartApi,
  updateCartApi,
  removeCartItemApi,
  syncCartApi,
} from "../api/cart";
import {
  getGuestCart,
  setGuestCart,
  clearGuestCart,
} from "../Utils/cartStorage";
import { useAuth } from "./AuthContext";
import { showError } from "../Utils/toast";
import { CART_KEY } from "../variables";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- LOAD CART ---------------- */

  useEffect(() => {
    if (user) {
      loadUserCart();
    } else {
      setItems(getGuestCart());
    }
  }, [user]);

  /* ---------------- USER CART ---------------- */

  const loadUserCart = async () => {
    try {
      setLoading(true);
      const res = await fetchCart();
      setItems(res.data.data.items || []);
    } catch {
      showError("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- ADD TO CART ---------------- */

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      const guestCart = getGuestCart();
      const existing = guestCart.find((i) => i.productId === product._id);

      if (existing) {
        existing.quantity += quantity;
      } else {
        guestCart.push({
          productId: product._id,
          product,
          quantity,
        });
      }

      setGuestCart(guestCart);
      setItems(guestCart);
      return;
    }

    await addToCartApi({ productId: product._id, quantity });
    loadUserCart();
  };

  /* ---------------- UPDATE QTY ---------------- */

  const updateQuantity = async (productId, quantity) => {
    setItems((prev) => {
      const updated = prev.map((item) => {
        const id = item.productId || item.product?._id;
        if (id !== productId) return item;

        const stock = item.product?.stock ?? Infinity;

        return {
          ...item,
          quantity: Math.max(1, Math.min(quantity, stock)),
        };
      });

      // SAVE GUEST CART
      if (!user) {
        setGuestCart(updated);
      }

      return updated;
    });

    // SAVE USER CART
    if (user) {
      try {
        await updateCartApi({ productId, quantity });
      } catch {
        showError("Failed to update cart");
      }
    }
  };

  /* ---------------- REMOVE ITEM ---------------- */

  const removeItem = async (productId) => {
    if (!user) {
      const guestCart = getGuestCart().filter(
        (item) => item.productId !== productId,
      );
      setGuestCart(guestCart);
      setItems(guestCart);
      return;
    }

    await removeCartItemApi(productId);
    loadUserCart();
  };

  /* ---------------- SYNC AFTER LOGIN ---------------- */

  const syncGuestCart = async () => {
    const guestCart = getGuestCart();
    if (!guestCart.length) return;

    const payload = guestCart.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    await syncCartApi(payload);
    clearGuestCart();
    loadUserCart();
  };

  /* ---------------- REMOVE CART ---------------- */

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(CART_KEY);
  };

  /* ---------------- AUTO SYNC ---------------- */

  useEffect(() => {
    if (user) syncGuestCart();
    // eslint-disable-next-line
  }, [user]);

  const value = useMemo(
    () => ({
      items,
      loading,
      addToCart,
      updateQuantity,
      removeItem,
      syncGuestCart,
      clearCart,
    }),
    [items, loading],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
