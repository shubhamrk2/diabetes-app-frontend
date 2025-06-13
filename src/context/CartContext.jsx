'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import apiClient from '../api/apiClient';
import { useAuth } from '@/context/AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { logout, token } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const logError = (fnName, err) => {
    if (!err || Object.keys(err).length === 0) {
      console.error(`${fnName} unknown or empty error:`, err);
      return;
    }

    if (err.response) {
      console.error(
        `${fnName} response error: status=${err.response.status}, data=`,
        err.response.data
      );
    } else if (err.request) {
      console.error(`${fnName} request error:`, err.request);
    } else if (err.message) {
      console.error(`${fnName} message error:`, err.message);
    } else {
      console.error(`${fnName} unexpected error shape:`, err);
    }
  };

  const handleAuthError = (err) => {
    if (err.response?.status === 401) {
      logout();
      return true; // signal handled
    }
    return false; // not auth error
  };

  const loadCart = useCallback(async () => {
    if (!token) {
      setCartItems([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/cart');
      const items = response?.data?.items;
      if (!Array.isArray(items)) {
        console.warn('Invalid cart items format:', items);
        setCartItems([]);
        return;
      }
      setCartItems(items);
    } catch (err) {
      if (handleAuthError(err)) return;
      setError('Failed to load cart');
      logError('loadCart', err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 0),
      0
    );
  }, [cartItems]);

  const addToCart = useCallback(
    async (product) => {
      if (!product?.quantity || product.quantity <= 0) return;

      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.post('/cart', {
          items: [product],
        });
        setCartItems(response.data.cart.items || []);
      } catch (err) {
        if (handleAuthError(err)) return;
        setError('Failed to add item to cart');
        logError('addToCart', err);
      } finally {
        setLoading(false);
      }
    },
    [logout]
  );

  const updateQuantity = useCallback(
    async (productId, quantity) => {
      if (quantity < 0) return;

      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.put(`/cart/${productId}`, { quantity });
        setCartItems(response.data.cart.items || []);
      } catch (err) {
        if (handleAuthError(err)) return;
        setError('Failed to update item quantity');
        logError('updateQuantity', err);
      } finally {
        setLoading(false);
      }
    },
    [logout]
  );

  const removeFromCart = useCallback(
    async (productId) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.delete(`/cart/${productId}`);
        setCartItems(response.data.cart.items || []);
      } catch (err) {
        if (handleAuthError(err)) return;
        setError('Failed to remove item from cart');
        logError('removeFromCart', err);
      } finally {
        setLoading(false);
      }
    },
    [logout]
  );

  const clearCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.delete('/cart');
      setCartItems([]);
    } catch (err) {
      if (handleAuthError(err)) return;
      setError('Failed to clear cart');
      logError('clearCart', err);
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const value = useMemo(
    () => ({
      cartItems,
      loading,
      error,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getCartTotal,
      reloadCart: loadCart,
    }),
    [
      cartItems,
      loading,
      error,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getCartTotal,
      loadCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
