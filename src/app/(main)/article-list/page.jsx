'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${API}/api/articles`);
        setArticles(res.data);
      } catch (err) {
        console.error('Failed to fetch articles:', err);
        setError('Unable to load articles. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-center px-4">
        <p className="text-red-600 text-lg font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-green-700 mb-4">Diabetes Care Articles</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Expert-written articles to help you understand and manage diabetes effectively.
        </p>
      </div>

      {/* Article Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <div
            key={article._id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
          >
            <div className="h-48 bg-gray-100 overflow-hidden">
              <img
                src={article.image || '/images/article-placeholder.jpg'}
                alt={article.title || 'Article Image'}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6">
              {/* Meta info */}
              <div className="flex justify-between items-center text-sm mb-3">
                <span className="bg-green-100 text-green-800 font-medium px-2 py-1 rounded">
                  {article.category || 'General'}
                </span>
                <span className="text-gray-500">
                  {article.createdAt
                    ? new Date(article.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'Date unknown'}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                {article.title || 'Untitled'}
              </h3>

              {/* Content preview */}
              <p className="text-gray-600 mb-4 line-clamp-3">
                {article.content?.slice(0, 150) || 'No content available.'}
              </p>

              {/* Read more link */}
              <Link
                href={`/articles/${article._id}`}
                className="text-green-600 hover:text-green-800 font-semibold inline-flex items-center transition"
              >
                Read more
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleList;
