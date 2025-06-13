'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  HomeIcon,
  UserPlusIcon,
  ArrowRightOnRectangleIcon,
  InformationCircleIcon,
  PhoneIcon,
  DocumentTextIcon,
  ShoppingCartIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

const getNavLinks = (isAuthenticated, user) => {
  const baseLinks = [
    { href: '/', label: 'Home', icon: HomeIcon },
    { href: '/article-list', label: 'Articles', icon: DocumentTextIcon },
    { href: '/contact', label: 'Contact', icon: PhoneIcon },
    // Removed "Purchase" link from navigation menu
    // { href: '/purchase', label: 'Purchase' },
    { href: '/about', label: 'About Us', icon: InformationCircleIcon },
  ];

  const authLinks = isAuthenticated
    ? [
        { href: '/user/cart', label: 'Cart', icon: ShoppingCartIcon },
        { 
          href: '#', 
          label: user?.name || 'Profile', 
          icon: UserCircleIcon 
        },
        { 
          href: '#', 
          label: 'Logout', 
          icon: ArrowRightOnRectangleIcon, 
          isLogout: true 
        },
      ]
    : [
        { href: '/signup', label: 'Sign Up', icon: UserPlusIcon },
        { href: '/login', label: 'Login', icon: ArrowRightOnRectangleIcon },
      ];

  return [...baseLinks, ...authLinks];
};

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navLinks = getNavLinks(!!user, user);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Home Link */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo.jpg"
              alt="Diabetes Health Hub Logo"
              width={60}
              height={60}
              className="rounded-full bg-white"
              priority
            />
            <span className="text-2xl font-bold tracking-tight">
              Diabetes Health Hub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              link.isLogout ? (
                <button
                  key="logout"
                  onClick={logout}
                  className="hover:text-gray-200 transition-colors font-medium flex items-center gap-1 cursor-pointer"
                >
                  {link.icon && <link.icon className="h-5 w-5" />}
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-gray-200 transition-colors font-medium flex items-center gap-1"
                >
                  {link.icon && <link.icon className="h-5 w-5" />}
                  {link.label}
                </Link>
              )
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden py-4">
            {navLinks.map((link) => (
              link.isLogout ? (
                <button
                  key="logout"
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 hover:text-gray-200 transition-colors"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-2 hover:text-gray-200 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
