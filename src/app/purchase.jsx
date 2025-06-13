"use client";

import { useState } from "react";

export default function PurchasePage() {
  const [form, setForm] = useState({
    productType: "food",
    productName: "",
    quantity: 1,
    address: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Order placed for ${form.quantity} ${form.productType}(s): ${form.productName}`);
    // You can later replace this with a POST to your backend
    setForm({
      productType: "food",
      productName: "",
      quantity: 1,
      address: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl">
        <h2 className="text-2xl font-bold text-center mb-6">Purchase Food / Equipment</h2>

        {/* Product Type */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Product Type</label>
          <select
            name="productType"
            value={form.productType}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg"
          >
            <option value="food">Food</option>
            <option value="equipment">Equipment</option>
          </select>
        </div>

        {/* Product Name */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Product Name</label>
          <input
            type="text"
            name="productName"
            value={form.productName}
            onChange={handleChange}
            placeholder="e.g. Glucose Monitor or Oats"
            required
            className="w-full border px-4 py-2 rounded-lg"
          />
        </div>

        {/* Quantity */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Quantity</label>
          <input
            type="number"
            name="quantity"
            min="1"
            value={form.quantity}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded-lg"
          />
        </div>

        {/* Shipping Address */}
        <div className="mb-6">
          <label className="block text-gray-600 mb-2">Shipping Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            rows={4}
            className="w-full border px-4 py-2 rounded-lg"
            placeholder="Enter your full address"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Confirm Purchase
        </button>
      </form>
    </div>
  );
}
