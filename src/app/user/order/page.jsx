'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const OrderList = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [equipmentItems, setEquipmentItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useAuth();
  const router = useRouter();

  // Cache ref to store fetched data
  const cacheRef = useRef({
    food: { data: null, timestamp: 0 },
    equipment: { data: null, timestamp: 0 }
  });

  // Constants for cache management
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // 2 seconds

  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  });

  // Function to check if cache is valid
  const isCacheValid = (type) => {
    const cache = cacheRef.current[type];
    return cache.data && (Date.now() - cache.timestamp) < CACHE_DURATION;
  };

  // Function to fetch data with retry logic
  const fetchWithRetry = useCallback(async (url, type, retryCount = 0) => {
    try {
      // Check cache first
      if (isCacheValid(type)) {
        return cacheRef.current[type].data;
      }

      const response = await api.get(url);
      
      // Update cache
      cacheRef.current[type] = {
        data: response.data,
        timestamp: Date.now()
      };
      
      return response.data;
    } catch (error) {
      if (error.response?.status === 429 && retryCount < MAX_RETRIES) {
        // Wait for retry delay
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
        // Retry with incremented count
        return fetchWithRetry(url, type, retryCount + 1);
      }
      throw error;
    }
  }, [api]);

  // Main fetch function
  const fetchItems = useCallback(async () => {
    if (!user || !token) {
      router.push('/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [foodData, equipmentData] = await Promise.all([
        fetchWithRetry('/food/getall', 'food'),
        fetchWithRetry('/equipment/getall', 'equipment')
      ]);

      setFoodItems(foodData);
      setEquipmentItems(equipmentData);
    } catch (error) {
      console.error('Failed to fetch items:', error);
      setError('Failed to load items. Please try again later.');
      
      // Clear invalid cache
      if (error.response?.status === 429) {
        cacheRef.current = {
          food: { data: null, timestamp: 0 },
          equipment: { data: null, timestamp: 0 }
        };
      }
    } finally {
      setLoading(false);
    }
  }, [user, token, router, fetchWithRetry]);

  useEffect(() => {
    if (!user || !token) {
      router.push('/login');
      return;
    }

    fetchItems();
  }, [user, fetchItems, router]);

  const addToCart = useCallback((item, type) => {
    setCart(prev => [...prev, {
      itemId: item._id,
      itemType: type,
      quantity: 1,
      price: item.price,
      title: item.title
    }]);
  }, []);

  const handleQuantityChange = useCallback((index, value) => {
    setCart(prev => {
      const newCart = [...prev];
      newCart[index].quantity = Math.max(1, parseInt(value) || 1);
      return newCart;
    });
  }, []);

  const calculateTotal = useCallback(() => 
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const handleSubmit = useCallback(async () => {
    if (!user || !token) {
      router.push('/login');
      return;
    }

    const orderPayload = {
      userId: user._id,
      items: cart.map(({ itemId, itemType, quantity }) => ({ itemId, itemType, quantity })),
      totalPrice: calculateTotal(),
      status: 'Pending'
    };

    try {
      await api.post('/orders/add', orderPayload);
      setCart([]);
      alert('Order placed successfully!');
      router.push('/user/orders');
    } catch (error) {
      console.error('Failed to place order:', error);
      const message = error.response?.data?.message || 'Failed to place order';
      alert(message);
    }
  }, [user, token, cart, calculateTotal, api, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
        Place Your Order
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Food Items */}
        {foodItems.map((item) => (
          <div key={item._id} className="bg-white shadow-md rounded-lg p-4 border">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
            <p className="text-gray-600 mb-1"><strong>Category:</strong> {item.category}</p>
            <p className="text-gray-700">{item.content}</p>
            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                className="mt-4 w-full h-48 object-cover rounded"
              />
            )}
            <div className="flex justify-between items-center mt-4">
              <span className="text-gray-700">Price: ₹{item.price}</span>
              <button
                onClick={() => addToCart(item, 'Food')}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}

        {/* Equipment Items */}
        {equipmentItems.map((item) => (
          <div key={item._id} className="bg-white shadow-md rounded-lg p-4 border">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
            <p className="text-gray-600 mb-1"><strong>Category:</strong> {item.category}</p>
            <p className="text-gray-700">{item.content}</p>
            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                className="mt-4 w-full h-48 object-cover rounded"
              />
            )}
            <div className="flex justify-between items-center mt-4">
              <span className="text-gray-700">Price: ₹{item.price}</span>
              <button
                onClick={() => addToCart(item, 'Equipment')}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold text-center text-green-700">Your Cart</h3>
        {cart.length === 0 ? (
          <p className="text-center text-gray-500 mt-4">Your cart is empty</p>
        ) : (
          <>
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between items-center border p-4 mb-2">
                <span>{item.title} ({item.itemType})</span>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                    className="w-16 border p-1"
                    min="1"
                  />
                  <span className="ml-2">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))}
            <div className="text-xl font-semibold text-right mt-4">
              Total: ₹{calculateTotal().toFixed(2)}
            </div>
            <div className="text-center mt-6">
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-800 transition-colors"
              >
                Place Order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderList;
