'use client';

import Link from 'next/link';
import {
  HeartIcon,
  DevicePhoneMobileIcon,
  BookOpenIcon,
} from '@heroicons/react/24/solid';
import Image from 'next/image';
import Head from 'next/head';
import { useState } from 'react';
import RecipeSlider from '@/components/RecipeSlider';

export default function HomePage() {
  const features = [
    {
      Icon: HeartIcon,
      title: 'Health Monitoring',
      text: 'Track your blood sugar levels and health metrics with easy-to-use tools.',
      color: 'text-red-600' // Changed from text-indigo-500
    },
    {
      Icon: DevicePhoneMobileIcon,
      title: 'Smart Equipment',
      text: 'Access modern diabetes care equipment and supplies for better management.',
      color: 'text-blue-500'
    },
    {
      Icon: BookOpenIcon,
      title: 'Educational Resources',
      text: 'Learn from our comprehensive collection of articles and guides.',
      color: 'text-green-500'
    },
  ];

  const testimonials = [
    {
      quote:
        'This platform has transformed how I manage my diabetes. The food recommendations are incredibly helpful!',
      name: 'Sarah Johnson',
      color: 'blue',
    },
    {
      quote:
        'The equipment suggestions and educational resources have made a real difference in my daily routine.',
      name: 'Michael Chen',
      color: 'green',
    },
    {
      quote:
        'I feel more confident managing my diabetes thanks to the comprehensive information provided here.',
      name: 'Emma Davis',
      color: 'purple',
    },
  ];

  const colorClasses = {
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-600',
    },
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-600',
    },
  };

  return (
    <>
      <Head>
        <title>Diabetes Care Platform</title>
        <meta
          name="description"
          content="A comprehensive solution for managing diabetes through nutrition, equipment, and education."
        />
        <meta property="og:title" content="Diabetes Care Platform" />
        <meta
          property="og:description"
          content="A comprehensive solution for managing diabetes through nutrition, equipment, and education."
        />
        <meta property="og:image" content="/images/diabetes-hero.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background image overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/diabetic-main.jpeg"
            alt="Decorative image showing diabetes care"
            fill
            style={{ objectFit: 'cover' }}
            className="opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-white bg-opacity-60 backdrop-blur-sm" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Hero Image */}
          <div className="mb-10">
            <Image
              src="/images/diabetic-main.jpeg"
              alt="Diabetes Care Illustration"
              width={320}
              height={320}
              className="mx-auto rounded-2xl shadow-lg"
              priority
            />
          </div>

          {/* Hero Text */}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-purple-600 mb-6 shadow-lg bg-white bg-opacity-60 inline-block px-4 py-2 rounded-xl backdrop-blur-sm">
            Welcome to Diabetes Health Hub
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 mb-10">
            Your all-in-one solution for managing diabetes through nutrition, smart
            equipment, and expert education.
          </p>

          {/* Navigation Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <Link
              href="/food-list"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition duration-300 transform hover:scale-105"
            >
              🍎 View Food List
            </Link>
            <Link
              href="/equipment-list"
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition duration-300 transform hover:scale-105"
            >
              🔧 View Equipment
            </Link>
            <Link
              href="/article-list"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md transition duration-300 transform hover:scale-105"
            >
              📘 Read Articles
            </Link>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {features.map(({ Icon, title, text, color }) => (
              <div
                key={title}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transform transition-transform hover:-translate-y-1"
              >
                <Icon className={`w-12 h-12 mx-auto ${color} mb-4`} />
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-600">{text}</p>
              </div>
            ))}
          </div>

          {/* Testimonials Section */}
          <section className="space-y-12 mb-20">
            {testimonials.map(({ quote, name, color }) => {
              const { bg, text } = colorClasses[color] || {};
              return (
                <blockquote
                  key={name}
                  className={`${bg} rounded-xl p-6 sm:p-8 shadow-md transition-all duration-300 transform hover:scale-105`}
                >
                  <p className="text-lg italic text-gray-700 mb-3">"{quote}"</p>
                  <footer className={`${text} font-medium`}>— {name}</footer>
                </blockquote>
              );
            })}
          </section>

          {/* Call to Action */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Ready to take control of your diabetes?
            </h2>
            <p className="text-gray-600 mb-6">
              Join thousands of users managing their health with our platform.
            </p>
            <Link
              href="/article-list"
              className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition transform hover:scale-105"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </div>

      <RecipeSlider />
    </>
  );
}
