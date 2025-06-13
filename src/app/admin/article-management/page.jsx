'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ArticleDashboard() {
  const [articleList, setArticleList] = useState([]);
  const [formData, setFormData] = useState({
    title: '', content: '', author: '', category: '', image: '', date: ''
  });
  const [error, setError] = useState('');

  const fetchArticles = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/getall`);
      setArticleList(res.data);
    } catch (err) {
      setError('Error fetching articles');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.author || !formData.category) {
      setError('All fields are required!');
      return;
    }
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`, formData);
      setFormData({ title: '', content: '', author: '', category: '', image: '', date: '' }); // clear form
      setError('');
      fetchArticles();
    } catch (err) {
      setError('Error adding article');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${id}`);
      fetchArticles();
    } catch (err) {
      setError('Error deleting article');
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Article Management</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        {Object.keys(formData).map((field) => (
          <input
            key={field}
            placeholder={field}
            value={formData[field]}
            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
            className="block border p-2 w-full"
          />
        ))}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2">Add Article</button>
      </form>
      <ul>
        {articleList.map(item => (
          <li key={item._id} className="mb-4 border p-4 rounded">
            <h2 className="text-lg font-bold">{item.title}</h2>
            <p>{item.content}</p>
            <p>{item.author}</p>
            <p>{item.category}</p>
            <p>{new Date(item.date).toLocaleDateString()}</p>
            <button onClick={() => handleDelete(item._id)} className="text-red-600">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
