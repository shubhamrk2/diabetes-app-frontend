import React, { useState } from 'react';
import axios from 'axios';

const EquipmentForm = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    imageUrl: '',
    price: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/equipment`, {
        ...form,
        price: Number(form.price), // ensure price is a number
      });
      alert('Equipment added!');
      setForm({ name: '', description: '', category: '', imageUrl: '', price: '' });
    } catch (error) {
      console.error(error);
      alert('Error adding equipment');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Equipment</h2>

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="imageUrl"
        placeholder="Image URL"
        value={form.imageUrl}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="price"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        required
      />

      <button type="submit">Submit</button>
    </form>
  );
};

export default EquipmentForm;
