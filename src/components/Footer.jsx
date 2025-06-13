'use client';

import { useEffect, useState } from 'react';
import { PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  const [year, setYear] = useState(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-gradient-to-r from-blue-900 to-blue-800 py-6 mt-12">
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col items-center justify-center space-y-4 mb-4">
          <div className="flex items-center">
            <PhoneIcon className="h-5 w-5 text-white mr-2" />
            <a 
              href="tel:+917542960663" 
              className="text-white hover:text-gray-200 transition-colors"
            >
              (754) 296-0663
            </a>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="h-5 w-5 text-white mr-2" />
            <a 
              href="https://maps.google.com/?q=10/101+Munshipuliya+Lucknow+Uttar+Pradesh" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white hover:text-gray-200 transition-colors"
            >
              10/101 Munshipuliya, Lucknow, Uttar Pradesh, India
            </a>
          </div>
        </div>
        <p className="text-sm text-white">
          &copy; {year ? year : ''} Diabetes Health Hub. All rights reserved.
        </p>
        <div className="mt-2 flex justify-center space-x-4 text-sm">
          <a href="/privacy" className="text-white hover:text-gray-200">Privacy Policy</a>
          <a href="/terms" className="text-white hover:text-gray-200">Terms of Service</a>
          <a href="/contact" className="text-white hover:text-gray-200">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
