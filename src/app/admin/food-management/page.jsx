'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function FoodDashboard() {
  const [foodList, setFoodList] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    category: '',
    image: '',
    price: '',
    url: '',
  });

  // Fetch all foods from backend
  const fetchFoods = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/foods`);
      setFoodList(res.data);
    } catch (error) {
      console.error('Error fetching foods:', error);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert price to number before sending
      const payload = { ...formData, price: Number(formData.price) };
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/foods`, payload);
      setFormData({
        title: '',
        description: '',
        author: '',
        category: '',
        image: '',
        price: '',
        url: '',
      });
      fetchFoods();
    } catch (err) {
      console.error('Error adding food:', err);
    }
  };

  // Handle delete food item
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/foods/${id}`);
      fetchFoods();
    } catch (err) {
      console.error('Error deleting food:', err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Food Management</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        {Object.entries(formData).map(([field, value]) => (
          <input
            key={field}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={value}
            onChange={handleChange}
            className="block border border-gray-300 p-2 rounded w-full"
            type={field === 'price' ? 'number' : 'text'}
            step={field === 'price' ? '0.01' : undefined}
            min={field === 'price' ? '0' : undefined}
          />
        ))}
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          Add Food
        </button>
      </form>

      <ul>
        {foodList.map((item) => (
          <li key={item._id} className="mb-6 border border-gray-200 rounded p-4 shadow-sm">
            <h2 className="text-xl font-semibold">{item.title}</h2>
            <p className="mb-1">{item.description}</p>
            <p className="mb-1 text-sm text-gray-600">Author: {item.author}</p>
            <p className="mb-1 text-sm text-gray-600">Category: {item.category}</p>
            <p className="mb-1 font-medium">Price: ${item.price.toFixed(2)}</p>
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all"
              >
                {item.url}
              </a>
            )}
            <button
              onClick={() => handleDelete(item._id)}
              className="text-red-600 mt-3 hover:text-red-800 transition"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
