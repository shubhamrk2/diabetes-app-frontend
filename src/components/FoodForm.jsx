import React, { useState } from 'react';
import axios from 'axios';

const FoodForm = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    imageUrl: '',
    price: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setMessage(null);

    if (isNaN(form.price) || Number(form.price) <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid positive number for price.' });
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/food/add`, form);
      setMessage({ type: 'success', text: 'Food item added successfully!' });
      setForm({ name: '', description: '', category: '', imageUrl: '', price: '' });
    } catch (error) {
      console.error('Error adding food item:', error);
      setMessage({ type: 'error', text: 'Failed to add food item. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2>Add Food</h2>

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        required
        style={{ width: '100%', padding: 8, marginBottom: 10 }}
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
        rows={4}
        style={{ width: '100%', padding: 8, marginBottom: 10 }}
      />

      <input
        type="text"
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
        required
        style={{ width: '100%', padding: 8, marginBottom: 10 }}
      />

      <input
        type="text"
        name="imageUrl"
        placeholder="Image URL"
        value={form.imageUrl}
        onChange={handleChange}
        required
        style={{ width: '100%', padding: 8, marginBottom: 10 }}
      />

      <input
        type="number"
        name="price"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        required
        min="0"
        step="0.01"
        style={{ width: '100%', padding: 8, marginBottom: 10 }}
      />

      <button type="submit" disabled={loading} style={{ padding: '10px 20px' }}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>

      {message && (
        <p
          style={{
            marginTop: 15,
            color: message.type === 'error' ? 'red' : 'green',
            fontWeight: 'bold',
          }}
        >
          {message.text}
        </p>
      )}
    </form>
  );
};

export default FoodForm;
