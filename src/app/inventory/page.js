'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaSearch, FaCar, FaMotorcycle, FaFilter, FaSortAmountDown, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Layout from '../../../components/layout/Layout';
import useSWR from 'swr';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// SWR fetcher function
const fetcher = (...args) => fetch(...args).then(res => res.json());

// Vehicle Card Skeleton Component
const VehicleCardSkeleton = () => (
  <Card className="glass-card h-full animate-pulse">
    <CardHeader className="p-0 relative h-48 bg-accent-200 rounded-t-lg" />
    <CardContent className="pt-4">
      <div className="h-6 bg-accent-200 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-accent-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-accent-200 rounded w-5/6"></div>
      <div className="flex justify-between items-center mt-4">
        <div className="h-6 bg-accent-200 rounded w-1/3"></div>
        <div className="h-4 bg-accent-200 rounded w-1/4"></div>
      </div>
    </CardContent>
  </Card>
);

// Vehicle Card Component
const VehicleCard = ({ vehicle }) => {
  const { make, model, year, price, mileage, images, sold } = vehicle;
  
  // Format price as currency
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
  
  // Format mileage with commas
  const formattedMileage = new Intl.NumberFormat('en-US').format(mileage);
  
  return (
    <Link href={`/inventory/${vehicle._id}`}>
      <Card className="glass-card h-full hover:shadow-md transition-shadow duration-300 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="p-0 relative aspect-video">
          {images && images.length > 0 ? (
            <img
              src={images[0]}
              alt={`${year} ${make} ${model}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-accent dark:bg-gray-700 flex items-center justify-center">
              <span className="text-text-light dark:text-gray-300">No Image</span>
            </div>
          )}
          
          {sold && (
            <div className="absolute top-0 right-0 m-2 bg-destructive text-destructive-foreground py-1 px-3 rounded-md font-bold text-sm">
              SOLD
            </div>
          )}
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="text-lg font-bold mb-1 dark:text-gray-100">{year} {make} {model}</h3>
          <div className="text-xl font-semibold text-primary mb-2">{formattedPrice}</div>
          <div className="text-sm text-text-light dark:text-gray-300">
            {formattedMileage} miles
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const InventoryPage = () => {
  // State for filters
  const [vehicleType, setVehicleType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [yearRange, setYearRange] = useState({ min: 2000, max: new Date().getFullYear() + 1 });
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [includeSold, setIncludeSold] = useState(false);

  // Build API URL with filters
  const getApiUrl = () => {
    let url = `/api/vehicles?page=${currentPage}`;
    
    if (vehicleType !== 'all') {
      url += `&type=${vehicleType}`;
    }
    
    if (searchTerm) {
      url += `&search=${encodeURIComponent(searchTerm)}`;
    }
    
    url += `&minPrice=${priceRange.min}&maxPrice=${priceRange.max}`;
    url += `&minYear=${yearRange.min}&maxYear=${yearRange.max}`;
    
    if (includeSold) {
      url += `&includeSold=true`;
    }
    
    return url;
  };

  // Fetch data with SWR for automatic revalidation
  const { data, error, isLoading, mutate } = useSWR(getApiUrl, fetcher, {
    refreshInterval: 15000,  // Refresh every 15 seconds instead of every second
    revalidateOnFocus: true, // Refresh when tab gets focus
    dedupingInterval: 5000,  // Deduplicate requests within 5 seconds to reduce API calls
    revalidateOnMount: true, // Always revalidate on component mount
    shouldRetryOnError: true, // Retry on error
    errorRetryCount: 3,      // Retry 3 times
    focusThrottleInterval: 5000, // Throttle focus events to 5 seconds
    revalidateIfStale: true, // Revalidate if the data is stale
    revalidateOnReconnect: true, // Revalidate when browser regains connection
    refreshWhenHidden: false, // Don't refresh when tab is not visible to reduce load
  });

  // Force a refresh when the component mounts but remove the aggressive interval
  useEffect(() => {
    console.log("Inventory page mounted - fetching latest vehicles");
    
    // Initial fetch
    mutate();
    
    // No need for an additional interval since SWR's refreshInterval handles this
    // This removes the duplicate refresh mechanism
  }, [mutate]);

  // Handle search form submit
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page
    mutate(); // Manually trigger a revalidation
  };

  // Apply filters
  const handleApplyFilters = () => {
    setCurrentPage(1); // Reset to first page
    mutate(); // Manually trigger a revalidation
  };

  // Reset filters
  const handleResetFilters = () => {
    setVehicleType('all');
    setSearchTerm('');
    setPriceRange({ min: 0, max: 100000 });
    setYearRange({ min: 2000, max: new Date().getFullYear() + 1 });
    setSortBy('newest');
    setCurrentPage(1);
    mutate(); // Manually trigger a revalidation
  };

  // Sort inventory based on current sort option
  const getSortedInventory = () => {
    if (!data || !data.vehicles) return [];
    
    return [...data.vehicles].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          // Sort by createdAt date (newest first)
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'featured':
          return b.featured - a.featured;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'year-new':
          return b.year - a.year;
        case 'year-old':
          return a.year - b.year;
        case 'mileage-low':
          return a.mileage - b.mileage;
        default:
          return 0;
      }
    });
  };

  // Format price as currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format mileage with commas
  const formatMileage = (mileage) => {
    return new Intl.NumberFormat('en-US').format(mileage);
  };

  // Get sorted inventory
  const sortedInventory = getSortedInventory();

  return (
    <Layout>
      <section className="pt-24 pb-12 bg-accent-100 dark:bg-gray-900">
        {/* Hero Section */}
        <section className="bg-secondary py-16 dark:bg-gray-800">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Inventory</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Browse our selection of quality cars and motorcycles.
            </p>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 bg-white dark:bg-gray-800 border-y border-card-border dark:border-gray-700 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative flex-grow max-w-2xl">
                <input
                  type="text"
                  placeholder="Search by make, model, or year..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-100"
                />
                <button 
                  type="submit"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-primary"
                >
                  <FaSearch />
                </button>
              </form>

              {/* Vehicle Type Tabs */}
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setVehicleType('all');
                    handleApplyFilters();
                  }}
                  className={`px-4 py-2 rounded-md transition-colors duration-300 ${
                    vehicleType === 'all'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  All Vehicles
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVehicleType('car');
                    handleApplyFilters();
                  }}
                  className={`px-4 py-2 rounded-md transition-colors duration-300 ${
                    vehicleType === 'car'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Cars
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVehicleType('motorcycle');
                    handleApplyFilters();
                  }}
                  className={`px-4 py-2 rounded-md transition-colors duration-300 ${
                    vehicleType === 'motorcycle'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Motorcycles
                </button>
              </div>

              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors duration-300 flex items-center shadow-sm"
              >
                <FaFilter className="mr-2" /> Filters {showFilters ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
              </button>
            </div>

            {/* Filter Panel (expandable) */}
            {showFilters && (
              <div className="mt-6 bg-card dark:bg-gray-700 p-6 rounded-md border border-card-border dark:border-gray-600">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Price Range */}
                  <div>
                    <h3 className="font-medium mb-3 dark:text-gray-200">Price Range</h3>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center">
                        <span className="text-text-light dark:text-gray-300 min-w-[60px]">Min:</span>
                        <input
                          type="number"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-accent-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-gray-100"
                        />
                      </div>
                      <div className="flex items-center">
                        <span className="text-text-light dark:text-gray-300 min-w-[60px]">Max:</span>
                        <input
                          type="number"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-accent-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-gray-100"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Year Range */}
                  <div>
                    <h3 className="font-medium mb-3 dark:text-gray-200">Year Range</h3>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center">
                        <span className="text-text-light dark:text-gray-300 min-w-[60px]">Min:</span>
                        <input
                          type="number"
                          value={yearRange.min}
                          onChange={(e) => setYearRange({ ...yearRange, min: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-accent-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-gray-100"
                        />
                      </div>
                      <div className="flex items-center">
                        <span className="text-text-light dark:text-gray-300 min-w-[60px]">Max:</span>
                        <input
                          type="number"
                          value={yearRange.max}
                          onChange={(e) => setYearRange({ ...yearRange, max: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-accent-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-gray-100"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sort By */}
                  <div>
                    <h3 className="font-medium mb-3 dark:text-gray-200">Sort By</h3>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 border border-accent-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-gray-100"
                    >
                      <option value="newest">Newest First</option>
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="year-new">Year: Newest First</option>
                      <option value="year-old">Year: Oldest First</option>
                      <option value="mileage-low">Mileage: Low to High</option>
                    </select>
                  </div>
                </div>

                {/* Show Sold Vehicles Checkbox */}
                <div className="mt-4">
                  <div className="flex items-center mt-4">
                    <input
                      type="checkbox"
                      id="includeSold"
                      checked={includeSold}
                      onChange={(e) => setIncludeSold(e.target.checked)}
                      className="mr-2 h-4 w-4 text-primary border-accent-300 dark:border-gray-600 rounded focus:ring-primary"
                    />
                    <label htmlFor="includeSold" className="text-sm text-text dark:text-gray-200">
                      Include sold vehicles
                    </label>
                  </div>
                </div>

                {/* Filter Action Buttons */}
                <div className="mt-6 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-accent-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm"
                  >
                    Reset Filters
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyFilters}
                    className="px-4 py-2 bg-primary text-text-white rounded-md hover:bg-primary-dark transition-colors duration-300"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Vehicle Results Section */}
        <section className="py-12 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            {/* Results Count and Loading State */}
            <div className="mb-6 flex items-center">
              {isLoading ? (
                <p className="text-gray-600 dark:text-gray-300">Loading vehicles...</p>
              ) : error ? (
                <p className="text-red-500">Error loading vehicles. Please try again.</p>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">
                  Showing {sortedInventory.length} of {data?.pagination?.total || 0} vehicles
                </p>
              )}
              <button 
                onClick={() => {
                  console.log("Manual refresh requested");
                  mutate();
                }}
                className="ml-4 p-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors rounded-full"
                title="Refresh inventory"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Vehicle Grid */}
            {isLoading ? (
              Array(6).fill(0).map((_, index) => (
                <VehicleCardSkeleton key={index} />
              ))
            ) : error ? (
              <div className="col-span-full p-8 text-center">
                <p className="text-red-500">Unable to load vehicles. Please try again later.</p>
              </div>
            ) : sortedInventory.length === 0 ? (
              <div className="col-span-full p-8 text-center">
                <p className="dark:text-gray-300">No vehicles match your search criteria. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedInventory.map((vehicle) => (
                  <VehicleCard key={vehicle._id} vehicle={vehicle} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {data?.pagination?.pages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-3 py-2 rounded-l-md border border-card-border bg-card dark:bg-gray-700 dark:border-gray-600 text-sm font-medium ${
                      currentPage === 1 ? 'text-accent-400 dark:text-gray-500 cursor-not-allowed' : 'text-text-light dark:text-gray-300 hover:bg-accent dark:hover:bg-gray-600'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: data.pagination.pages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border border-card-border dark:border-gray-600 text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-primary border-primary text-white'
                          : 'bg-card dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(data.pagination.pages, currentPage + 1))}
                    disabled={currentPage === data.pagination.pages}
                    className={`relative inline-flex items-center px-3 py-2 rounded-r-md border border-card-border bg-card dark:bg-gray-700 dark:border-gray-600 text-sm font-medium ${
                      currentPage === data.pagination.pages ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </section>
      </section>
    </Layout>
  );
};

export default InventoryPage;