'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function AdminDashboard() {
  const [articles, setArticles] = useState([]);
  const [foods, setFoods] = useState([]);
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    // Fetch all data on mount
    axios.get('/api/articles').then(res => setArticles(res.data)).catch(err => console.error('Articles error', err));
    axios.get('/api/foods').then(res => setFoods(res.data)).catch(err => console.error('Foods error', err));
    axios.get('/api/equipment').then(res => setEquipment(res.data)).catch(err => console.error('Equipment error', err));
  }, []);

  const renderTable = (data, type) => (
    <div className="bg-white p-4 rounded shadow mb-8">
      <h2 className="text-xl font-semibold mb-2 capitalize">{type}</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Title/Name</th>
            <th className="p-2">Category</th>
            <th className="p-2">Price</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item._id}>
              <td className="p-2">{item.title || item.name}</td>
              <td className="p-2">{item.category}</td>
              <td className="p-2">{item.price ? `$${item.price}` : 'N/A'}</td>
              <td className="p-2">
                <button className="text-blue-600 mr-2">Edit</button>
                <button className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-lg font-semibold mb-6">Admin Panel</h2>
        <ul className="space-y-4">
          <li><Link href="/admin/dashboard" className="hover:underline">Dashboard</Link></li>
          <li><Link href="/admin/article-management" className="hover:underline">Manage Articles</Link></li>
          <li><Link href="/admin/foods" className="hover:underline">Manage Food</Link></li>
          <li><Link href="/admin/equipment" className="hover:underline">Manage Equipment</Link></li>
        </ul>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 bg-gray-50">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

        {renderTable(articles, 'articles')}
        {renderTable(foods, 'foods')}
        {renderTable(equipment, 'equipment')}
      </main>
    </div>
  );
}
