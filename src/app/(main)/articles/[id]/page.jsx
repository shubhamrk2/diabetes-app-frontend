'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

const ArticleDetailPage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return; // If no id in URL, skip fetching

    const fetchArticle = async () => {
      try {
        const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${API}/api/articles/${id}`);
        setArticle(response.data);
      } catch (err) {
        console.error('Failed to fetch article:', err);
        setError('Unable to load article. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

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
        <div className="space-y-4">
          <p className="text-red-600 text-lg font-medium">{error}</p>
          <Link
            href="/article-list"
            className="text-green-600 hover:text-green-800 font-medium inline-flex items-center"
          >
            ← Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  if (!article) return null; // Return nothing if no article

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <article className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Link
          href="/article-list"
          className="text-green-600 hover:text-green-800 font-medium inline-flex items-center mb-8"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Articles
        </Link>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded">
              {article.category || 'General'}
            </span>
            <time className="text-gray-500 text-sm">
              {new Date(article.date || article.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
          <p className="text-xl text-gray-600">{article.description}</p>
        </header>

        {/* Article Image */}
        {article.image && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-[400px] object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          {article.content.split('\n').map((paragraph, idx) => (
            <p key={idx} className="mb-4 text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </div>
  );
};

export default ArticleDetailPage;
