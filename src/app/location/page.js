'use client';

import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import Layout from '../../../components/layout/Layout';
import dynamic from 'next/dynamic';

// Dynamically import the Map component with no SSR to avoid issues with window object
const MapComponent = dynamic(() => import('./map-component'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center">
      <p className="text-gray-600 dark:text-gray-300">Loading map...</p>
    </div>
  ),
});

const LocationPage = () => {
  return (
    <Layout>
      <main className="pt-24 pb-16 dark:bg-gray-900">
        {/* Hero Section */}
        <section className="bg-secondary py-16 dark:bg-gray-800">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Find Us</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Visit Scuffletown 2.0 Motorsports in Pembroke, NC to explore our inventory in person and meet our friendly team.
            </p>
          </div>
        </section>

        {/* Map and Contact Info Section */}
        <section className="py-16 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Information */}
              <div className="lg:col-span-1">
                <div className="glass-card bg-white rounded-lg shadow-md border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
                  <h2 className="text-2xl font-bold mb-6 dark:text-gray-100">Contact Information</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="text-primary mr-4 mt-1">
                        <FaMapMarkerAlt size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1 dark:text-gray-100">Address</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          220 Nova Rd<br />
                          Pembroke, NC 28372<br />
                          United States
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="text-primary mr-4 mt-1">
                        <FaPhone size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1 dark:text-gray-100">Phone</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          <a href="tel:+19103742058" className="hover:text-primary transition-colors duration-300 dark:text-gray-300 dark:hover:text-primary">
                            (910) 374-2058
                          </a>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="text-primary mr-4 mt-1">
                        <FaEnvelope size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1 dark:text-gray-100">Email</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          <a href="mailto:scuffletown2.0@gmail.com" className="hover:text-primary transition-colors duration-300 dark:text-gray-300 dark:hover:text-primary">
                            scuffletown2.0@gmail.com
                          </a>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="text-primary mr-4 mt-1">
                        <FaClock size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1 dark:text-gray-100">Business Hours</h3>
                        <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                          <li className="flex justify-between">
                            <span>Monday - Friday:</span>
                            <span>9:00 AM - 6:00 PM</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Saturday:</span>
                            <span>10:00 AM - 4:00 PM</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Sunday:</span>
                            <span>Closed</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="lg:col-span-2">
                <div className="glass-card bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden h-96 lg:h-full dark:bg-gray-800 dark:border-gray-700">
                  <MapComponent />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default LocationPage; 