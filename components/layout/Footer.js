'use client';

import Link from 'next/link';
import { FaFacebook, FaInstagram, FaPhone, FaMapMarkerAlt, FaEnvelope, FaCar, FaMotorcycle, FaCreditCard } from 'react-icons/fa';
import { Button } from '../../src/components/ui/button';
import { Separator } from '../../src/components/ui/separator';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary">About Scuffletown 2.0</h3>
            <Separator className="mb-4 bg-primary/30" />
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              Scuffletown 2.0 Motorsports & Sales is your trusted source for quality vehicles and motorcycles in Pembroke, NC. We pride ourselves on exceptional service and customer satisfaction.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/scuffletown2.0/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors duration-200"
                aria-label="Facebook"
              >
                <FaFacebook size={24} />
              </a>
              <a 
                href="https://www.instagram.com/scuffletown2.0/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors duration-200"
                aria-label="Instagram"
              >
                <FaInstagram size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary">Quick Links</h3>
            <Separator className="mb-4 bg-primary/30" />
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors duration-200 flex items-center">
                  <span className="mr-2">›</span> Home
                </Link>
              </li>
              <li>
                <Link href="/inventory" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors duration-200 flex items-center">
                  <span className="mr-2">›</span> Inventory
                </Link>
              </li>
              <li>
                <Link href="/financing" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors duration-200 flex items-center">
                  <span className="mr-2">›</span> Financing
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors duration-200 flex items-center">
                  <span className="mr-2">›</span> Reviews
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors duration-200 flex items-center">
                  <span className="mr-2">›</span> Contact
                </Link>
              </li>
              <li>
                <Link href="/location" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors duration-200 flex items-center">
                  <span className="mr-2">›</span> Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary">Our Services</h3>
            <Separator className="mb-4 bg-primary/30" />
            <ul className="space-y-2">
              <li className="flex items-center text-gray-600 dark:text-gray-300">
                <FaCar className="mr-2 text-primary" /> Used Car Sales
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-300">
                <FaMotorcycle className="mr-2 text-primary" /> Motorcycle Sales
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-300">
                <FaCreditCard className="mr-2 text-primary" /> In-House Financing
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary">Contact Us</h3>
            <Separator className="mb-4 bg-primary/30" />
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mr-3 mt-1 text-primary" />
                <div>
                  <p className="text-gray-600 dark:text-gray-300">
                    220 Nova Rd<br />
                    Pembroke, NC 28372
                  </p>
                </div>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-3 text-primary" />
                <a href="tel:+19103742058" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors duration-200">
                  (910) 374-2058
                </a>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 text-primary" />
                <a href="mailto:scuffletown2.0@gmail.com" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors duration-200">
                  scuffletown2.0@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-gray-200 dark:bg-gray-900 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:items-start">
              <p className="text-gray-700 dark:text-gray-400 text-sm mb-2 md:mb-0">
                &copy; {new Date().getFullYear()} Scuffletown 2.0 Motorsports & Sales. All rights reserved.
              </p>
              <p className="text-gray-600 dark:text-gray-500 text-xs mb-4 md:mb-0">
                Developed by <a href="https://github.com/rajwardhanshinde" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Rajwardhan Shinde</a>
              </p>
            </div>
            <div className="flex space-x-4">
              <Link href="/privacy-policy" className="text-gray-700 hover:text-primary dark:text-gray-400 dark:hover:text-primary text-sm transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-gray-700 hover:text-primary dark:text-gray-400 dark:hover:text-primary text-sm transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="/admin/login" className="text-gray-700 hover:text-primary dark:text-gray-400 dark:hover:text-primary text-sm transition-colors duration-200">
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 