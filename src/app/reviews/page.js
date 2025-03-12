'use client';

import { useState } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar, FaQuoteLeft, FaCheck } from 'react-icons/fa';
import Layout from '../../../components/layout/Layout';

const ReviewsPage = () => {
  // Mock reviews data
  const reviewsData = [
    {
      id: 1,
      name: 'John Smith',
      date: 'October 15, 2023',
      rating: 5,
      title: 'Excellent Service and Selection',
      comment: 'I had an amazing experience at this dealership. The staff was friendly and knowledgeable, and they helped me find the perfect car for my needs. The financing process was smooth, and I drove off the lot the same day. Highly recommend!',
      vehicle: '2023 Honda Accord',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      date: 'September 3, 2023',
      rating: 4.5,
      title: 'Great Buying Experience',
      comment: 'The team at Auto Dealer made buying a car stress-free. They were transparent about pricing and didn\'t pressure me into making a decision. The only reason I\'m not giving 5 stars is because the paperwork took a bit longer than expected, but overall it was a great experience.',
      vehicle: '2022 Toyota Camry',
    },
    {
      id: 3,
      name: 'Michael Brown',
      date: 'August 22, 2023',
      rating: 5,
      title: 'Top-Notch Customer Service',
      comment: 'From the moment I walked in, I was treated with respect and given personalized attention. The sales team listened to my needs and showed me options within my budget. The follow-up service has been excellent as well. I couldn\'t be happier with my purchase!',
      vehicle: '2023 Ford Mustang',
    },
    {
      id: 4,
      name: 'Emily Davis',
      date: 'July 10, 2023',
      rating: 4,
      title: 'Good Selection, Fair Prices',
      comment: 'I visited several dealerships before coming here, and Auto Dealer had the best selection of vehicles in my price range. The negotiation process was straightforward, and I felt like I got a fair deal. The only improvement could be in the facility itself, which could use some updating.',
      vehicle: '2021 Chevrolet Equinox',
    },
    {
      id: 5,
      name: 'David Wilson',
      date: 'June 28, 2023',
      rating: 5,
      title: 'Exceptional Motorcycle Purchase',
      comment: 'As a first-time motorcycle buyer, I was nervous about the process. The team at Auto Dealer was patient, educational, and helped me find the perfect bike for a beginner. They even followed up a week later to make sure everything was going well. Outstanding service!',
      vehicle: '2023 Honda CBR500R',
    },
    {
      id: 6,
      name: 'Jennifer Martinez',
      date: 'May 15, 2023',
      rating: 4.5,
      title: 'Smooth Trade-In Process',
      comment: 'I was worried about trading in my old vehicle, but Auto Dealer made it painless. They gave me a fair value for my trade-in and helped me find a newer model that fit my budget. The sales consultant was knowledgeable and not pushy at all.',
      vehicle: '2022 Nissan Rogue',
    },
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    title: '',
    comment: '',
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

  const handleRatingChange = (rating) => {
    setFormData({
      ...formData,
      rating,
    });
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
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.comment.trim()) {
      newErrors.comment = 'Review comment is required';
    } else if (formData.comment.length < 20) {
      newErrors.comment = 'Review comment must be at least 20 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          rating: 5,
          title: '',
          comment: '',
          vehicle: '',
        });
      }, 1500);
    }
  };

  // Render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    
    return stars;
  };

  return (
    <Layout>
      <main className="pt-24 pb-16 dark:bg-gray-900">
        {/* Hero Section */}
        <section className="bg-secondary py-16 dark:bg-gray-800">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Customer Reviews</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See what our customers have to say about their experience with us.
            </p>
          </div>
        </section>

        {/* Overall Rating Section */}
        <section className="py-16 dark:bg-gray-900 border-y border-gray-300 dark:border-gray-700">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto glass-card bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-center md:text-left mb-6 md:mb-0">
                  <h2 className="text-3xl font-bold mb-2 dark:text-gray-100">Customer Satisfaction</h2>
                  <p className="text-gray-600 dark:text-gray-300">Based on {reviewsData.length} reviews</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary mb-2">4.7</div>
                  <div className="flex justify-center mb-2">
                    {renderStars(4.7)}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">Overall Rating</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews List Section */}
        <section className="py-16 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 dark:text-gray-100">What Our Customers Say</h2>
            <div className="max-w-5xl mx-auto grid grid-cols-1 gap-8">
              {reviewsData.map((review) => (
                <div key={review.id} className="glass-card bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1 dark:text-gray-100">{review.title}</h3>
                      <div className="flex items-center mb-2">
                        <div className="flex mr-2">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-gray-600 dark:text-gray-300">{review.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm mt-2 md:mt-0">
                      {review.date}
                    </div>
                  </div>
                  <div className="mb-4 relative pl-8">
                    <FaQuoteLeft className="absolute left-0 top-0 text-primary opacity-30" size={20} />
                    <p className="text-gray-600 dark:text-gray-300">{review.comment}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="font-semibold mb-2 sm:mb-0 dark:text-gray-200">{review.name}</div>
                    {review.vehicle && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Purchased: {review.vehicle}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Write a Review Section */}
        <section className="py-16 dark:bg-gray-800 border-y border-gray-300 dark:border-gray-700">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8 dark:text-gray-100">Share Your Experience</h2>
              
              {isSubmitted ? (
                <div className="glass-card bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-800/50 rounded-full text-green-500 dark:text-green-300 mb-4">
                    <FaCheck size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">Thank You for Your Review!</h3>
                  <p className="text-green-700 dark:text-green-300 mb-6 max-w-md mx-auto">
                    Your review has been submitted and will be published after moderation.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-md transition-colors duration-300"
                  >
                    Write Another Review
                  </button>
                </div>
              ) : (
                <div className="glass-card bg-white dark:bg-gray-700 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 p-6">
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="name" className="block text-gray-700 dark:text-gray-200 mb-2">
                          Your Name <span className="text-primary">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 ${
                            errors.name ? 'border-red-500 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
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
                          className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 ${
                            errors.email ? 'border-red-500 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                          }`}
                          placeholder="john@example.com"
                        />
                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Your email will not be published</p>
                        {errors.email && (
                          <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.email}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-gray-700 dark:text-gray-200 mb-2">
                        Your Rating <span className="text-primary">*</span>
                      </label>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingChange(star)}
                            className="text-2xl mr-1 focus:outline-none"
                          >
                            {star <= formData.rating ? (
                              <FaStar className="text-yellow-400" />
                            ) : (
                              <FaRegStar className="text-yellow-400" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="title" className="block text-gray-700 dark:text-gray-200 mb-2">
                        Review Title <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 ${
                          errors.title ? 'border-red-500 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="Summarize your experience"
                      />
                      {errors.title && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.title}</p>
                      )}
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="vehicle" className="block text-gray-700 dark:text-gray-200 mb-2">
                        Vehicle Purchased (Optional)
                      </label>
                      <input
                        type="text"
                        id="vehicle"
                        name="vehicle"
                        value={formData.vehicle}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-gray-100"
                        placeholder="e.g., 2023 Honda Accord"
                      />
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="comment" className="block text-gray-700 dark:text-gray-200 mb-2">
                        Your Review <span className="text-primary">*</span>
                      </label>
                      <textarea
                        id="comment"
                        name="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        rows="5"
                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 ${
                          errors.comment ? 'border-red-500 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="Tell us about your experience..."
                      ></textarea>
                      {errors.comment && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.comment}</p>
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
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default ReviewsPage; 