'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Heart, HeartOff, List, Grid } from 'lucide-react';

const FoodList = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  const [sortOrder, setSortOrder] = useState('asc');
  const { addToCart } = useCart();
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/food/getall');
        setFoodItems(response.data);
        setFilteredItems(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch food items:', err);
        setError('Failed to load food items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, []);

  const handleAddToCart = async (item) => {
    if (!user || !token) {
      router.push('/login');
      return;
    }

    try {
      await addToCart(item, 'Food');
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const handleSort = () => {
    const sorted = [...filteredItems].sort((a, b) => {
      return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    });
    setFilteredItems(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-center text-gray-600">Loading food items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-center text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Diabetic-Friendly Food
      </h1>

      {/* Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="space-x-2">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded ${view === 'grid' ? 'bg-gray-200' : ''}`}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded ${view === 'list' ? 'bg-gray-200' : ''}`}
          >
            <List size={18} />
          </button>
        </div>
        <button
          onClick={handleSort}
          className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
        >
          Sort by Price ({sortOrder === 'asc' ? 'Low → High' : 'High → Low'})
        </button>
      </div>

      {/* Food Items */}
      <div className={`${view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}`}>
        {filteredItems.map((item) => (
          <div
            key={item._id}
            className={`bg-white rounded-lg shadow-md transition hover:shadow-lg overflow-hidden ${
              view === 'list' ? 'flex' : ''
            }`}
          >
            {item.imageUrl && (
              <div className={`relative ${view === 'list' ? 'w-1/3' : 'h-48 w-full'}`}>
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className={`object-cover ${view === 'list' ? 'h-full w-full' : 'absolute inset-0 w-full h-full'}`}
                />
              </div>
            )}
            <div className="p-4 flex flex-col justify-between w-full">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                  <button onClick={() => toggleFavorite(item._id)} className="text-red-500">
                    {favorites.includes(item._id) ? <Heart fill="currentColor" /> : <HeartOff />}
                  </button>
                </div>
                <p className="text-gray-600 line-clamp-3 text-sm">{item.description}</p>
              </div>

              <div className="flex justify-between items-center mt-4">
                <span className="text-base font-medium text-gray-900">₹{item.price}</span>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-sm transition"
                >
                  {user && token ? 'Add to Cart' : 'Login to Add'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodList;
