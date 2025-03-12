'use client';

import { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaCheck } from 'react-icons/fa';
import Layout from '../../../components/layout/Layout';
import { toast } from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    vehicle: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Send data to API
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to send message');
        }
        
        // Reset form and show success message
        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          vehicle: '',
        });
        
        toast.success('Message sent successfully!');
      } catch (error) {
        console.error('Error submitting form:', error);
        setIsSubmitting(false);
        toast.error(error.message || 'Failed to send message. Please try again.');
      }
    }
  };

  return (
    <Layout>
      <main className="pt-24 pb-16 dark:bg-gray-900">
        {/* Hero Section */}
        <section className="bg-secondary py-16 dark:bg-gray-800">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Contact Us</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Have questions or need assistance? We're here to help. Reach out to our team today.
            </p>
          </div>
        </section>

        {/* Contact Form and Info Section */}
        <section className="py-16 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Information */}
              <div className="lg:col-span-1">
                <div className="glass-card bg-white rounded-lg shadow-md border border-gray-200 p-6 h-full dark:bg-gray-800 dark:border-gray-700">
                  <h2 className="text-2xl font-bold mb-6 dark:text-gray-100">Get In Touch</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="text-primary mr-4 mt-1">
                        <FaMapMarkerAlt size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1 dark:text-gray-100">Visit Us</h3>
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
                        <h3 className="font-bold text-lg mb-1 dark:text-gray-100">Call Us</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          <a href="tel:+19103742058" className="hover:text-primary transition-colors duration-300 dark:text-gray-300 dark:hover:text-primary">
                            (910) 374-2058
                          </a>
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                          Monday - Friday: 9:00 AM - 6:00 PM<br />
                          Saturday: 10:00 AM - 4:00 PM<br />
                          Sunday: Closed
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="text-primary mr-4 mt-1">
                        <FaEnvelope size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1 dark:text-gray-100">Email Us</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          <a href="mailto:scuffletown2.0@gmail.com" className="hover:text-primary transition-colors duration-300 dark:text-gray-300 dark:hover:text-primary">
                            scuffletown2.0@gmail.com
                          </a>
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                          We'll respond as soon as possible
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="glass-card bg-white rounded-lg shadow-md border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
                  <h2 className="text-2xl font-bold mb-6 dark:text-gray-100">Send Us a Message</h2>
                  
                  {isSubmitted ? (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-6 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-800/30 rounded-full text-green-500 dark:text-green-400 mb-4">
                        <FaCheck size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-green-800 dark:text-green-400 mb-2">Message Sent Successfully!</h3>
                      <p className="text-green-700 dark:text-green-300 mb-4">
                        Thank you for contacting us. We'll get back to you as soon as possible.
                      </p>
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-md transition-colors duration-300"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label htmlFor="name" className="block text-gray-700 dark:text-gray-200 mb-2">
                            Full Name <span className="text-primary">*</span>
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white dark:bg-gray-700 ${
                              errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                            placeholder="John Doe"
                          />
                          {errors.name && (
                            <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.name}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-gray-700 dark:text-gray-200 mb-2">
                            Email Address <span className="text-primary">*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white dark:bg-gray-700 ${
                              errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                            placeholder="john@example.com"
                          />
                          {errors.email && (
                            <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.email}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label htmlFor="phone" className="block text-gray-700 dark:text-gray-200 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white dark:bg-gray-700"
                            placeholder="(123) 456-7890"
                          />
                        </div>
                        <div>
                          <label htmlFor="subject" className="block text-gray-700 dark:text-gray-200 mb-2">
                            Subject <span className="text-primary">*</span>
                          </label>
                          <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white dark:bg-gray-700 ${
                              errors.subject ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                            placeholder="Inquiry about..."
                          />
                          {errors.subject && (
                            <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.subject}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="vehicle" className="block text-gray-700 dark:text-gray-200 mb-2">
                          Interested in a specific vehicle?
                        </label>
                        <input
                          type="text"
                          id="vehicle"
                          name="vehicle"
                          value={formData.vehicle}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white dark:bg-gray-700"
                          placeholder="e.g., 2023 Honda Accord"
                        />
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="message" className="block text-gray-700 dark:text-gray-200 mb-2">
                          Message <span className="text-primary">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows="5"
                          className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white dark:bg-gray-700 ${
                            errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          }`}
                          placeholder="How can we help you?"
                        ></textarea>
                        {errors.message && (
                          <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.message}</p>
                        )}
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-md transition-colors duration-300 ${
                            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                          }`}
                        >
                          {isSubmitting ? 'Sending...' : 'Send Message'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default ContactPage; 