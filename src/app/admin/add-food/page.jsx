'use client';

import React, { useState, useRef } from 'react';
import axios from 'axios';

const FoodForm = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    imageUrl: '',
    price: '',
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || 'Image upload failed');
      }
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleChange = async (e) => {
    if (e.target.name === 'image') {
      const file = e.target.files[0];
      if (file) {
        setImagePreview(URL.createObjectURL(file));
        setLoading(true);
        try {
          const imageUrl = await uploadImage(file);
          setForm((prev) => ({ ...prev, imageUrl }));
        } catch (error) {
          alert('Failed to upload image');
          setImagePreview(null);
        } finally {
          setLoading(false);
        }
      }
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.imageUrl) {
      alert('Please upload an image');
      return;
    }

    const payload = { ...form, price: parseFloat(form.price) };

    try {
      await axios.post('http://localhost:5000/food/add', payload);
      alert('Food item added successfully!');
      setForm({
        name: '',
        description: '',
        category: '',
        imageUrl: '',
        price: '',
      });
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error adding food item:', error);
      alert('Failed to add food');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-8 w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Add a Food Item
        </h2>

        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-600 mb-2">
            Food Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Enter food name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-green-300"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-600 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows="3"
            placeholder="Enter food description"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-green-300"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-600 mb-2">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            placeholder="Enter price"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-green-300"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="category" className="block text-gray-600 mb-2">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-green-300"
          >
            <option value="">Select a category</option>
            <option value="Fruits">Fruits</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Proteins">Proteins</option>
            <option value="Grains">Grains</option>
            <option value="Dairy">Dairy</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="image" className="block text-gray-600 mb-2">
            Food Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleChange}
            required
            ref={fileInputRef}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-green-300"
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          } text-white py-2 rounded-lg transition`}
        >
          {loading ? 'Uploading...' : 'Add Food'}
        </button>
      </form>
    </div>
  );
};

export default FoodForm;
