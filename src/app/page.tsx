'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCar, FaMotorcycle, FaSearch, FaMapMarkerAlt, FaPhone, FaStar, FaArrowRight, FaCheckCircle, FaMoneyBillWave } from 'react-icons/fa';
import Layout from '../../components/layout/Layout';
import ImageCarousel from '../../components/ImageCarousel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import useSWR from 'swr';

// Define Vehicle type interface
interface Vehicle {
  _id: string;
  type: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  description: string;
  images: string[];
  featured?: boolean;
  sold?: boolean;
}

// SWR fetcher function
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Home() {
  // Fetch featured vehicles with SWR for auto-refresh
  const { data, error, isLoading } = useSWR<{vehicles: Vehicle[]}>('/api/vehicles?featured=true&limit=4', fetcher, {
    refreshInterval: 10000, // Auto-refresh every 10 seconds
    revalidateOnFocus: true,
    dedupingInterval: 2000,
    revalidateOnMount: true,
  });

  // Format price as currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format mileage with commas
  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-US').format(mileage || 0);
  };

  // Get featured vehicles
  const featuredVehicles = data?.vehicles || [];

  return (
    <Layout>
      {/* Hero Section with Image Carousel */}
      <section className="relative">
        <ImageCarousel />
      </section>

      {/* Featured Vehicles Section */}
      <section className="py-16 bg-accent dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-text-dark dark:text-gray-100">Our Newest Vehicles</h2>
              <p className="text-text-light dark:text-gray-300 mt-2">Check out our latest additions to the inventory</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button asChild variant="outline" className="flex items-center dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-800">
                <Link href="/inventory">
                  View All Inventory <FaArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Featured Vehicles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              // Loading skeletons while data is loading
              Array(4).fill(0).map((_, index) => (
                <Card key={index} className="glass-card animate-pulse dark:bg-gray-800">
                  <CardHeader className="p-0 relative h-48 bg-accent-200 dark:bg-gray-700"></CardHeader>
                  <CardContent className="pt-4">
                    <div className="h-6 bg-accent-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-accent-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-accent-200 dark:bg-gray-700 rounded w-5/6"></div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="h-6 bg-accent-200 dark:bg-gray-700 rounded w-1/3"></div>
                      <div className="h-4 bg-accent-200 dark:bg-gray-700 rounded w-1/4"></div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t border-border dark:border-gray-700 pt-4">
                    <div className="h-10 bg-accent-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-10 bg-accent-200 dark:bg-gray-700 rounded w-1/3"></div>
                  </CardFooter>
                </Card>
              ))
            ) : error ? (
              <div className="col-span-full p-8 text-center dark:text-gray-200">
                <p className="text-red-500 dark:text-red-400">Unable to load featured vehicles. Please try again later.</p>
              </div>
            ) : featuredVehicles.length === 0 ? (
              <div className="col-span-full p-8 text-center dark:text-gray-200">
                <p>No featured vehicles available at the moment. Check back soon!</p>
              </div>
            ) : (
              featuredVehicles.map((vehicle: Vehicle) => (
                <Card key={vehicle._id} className="glass-card hover:translate-y-[-5px] transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader className="p-0 relative h-48">
                    {vehicle.images && vehicle.images.length > 0 ? (
                      <img 
                        src={vehicle.images[0]} 
                        alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-accent-200 dark:bg-gray-700 rounded-t-lg">
                        {vehicle.type === 'car' ? (
                          <FaCar size={48} className="text-accent-400 dark:text-gray-400" />
                        ) : (
                          <FaMotorcycle size={48} className="text-accent-400 dark:text-gray-400" />
                        )}
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-primary text-white py-1 px-3 rounded-full text-sm font-medium capitalize">
                      {vehicle.type}
                    </div>
                    <div className="absolute top-2 left-2 bg-secondary text-white py-1 px-3 rounded-full text-sm font-medium">
                      NEW
                    </div>
                    {vehicle.sold && (
                      <div className="absolute bottom-2 right-2 bg-destructive text-white py-1 px-6 rounded-full text-sm font-bold transform rotate-0 shadow-lg">
                        SOLD
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="pt-4">
                    <CardTitle className="dark:text-gray-100">{vehicle.year} {vehicle.make} {vehicle.model}</CardTitle>
                    <CardDescription className="mt-2 text-text-light dark:text-gray-300 line-clamp-2">
                      {vehicle.description}
                    </CardDescription>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xl font-bold text-text-dark dark:text-gray-100">{formatPrice(vehicle.price)}</span>
                      <div className="flex items-center text-text-light dark:text-gray-400 text-sm">
                        {vehicle.mileage > 0 && `${formatMileage(vehicle.mileage)} miles`}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t border-border dark:border-gray-700 pt-4">
                    <Button variant="outline" size="sm" asChild className="dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700">
                      <Link href={`/inventory/${vehicle._id}`}>
                        Details
                      </Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href={`/contact?vehicle=${vehicle._id}`}>
                        Inquire Now
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Recent News Section */}
      <section className="py-16 bg-accent dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-gray-100">Recent News!</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 glass-card dark:bg-gray-800 dark:border-gray-700">
              <div className="relative h-48 rounded-t-lg overflow-hidden">
                <Image 
                  src="/images/sale-history-5.jpg"
                  alt="Toyota Corolla Sale"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="dark:text-gray-100">Toyota Corolla 2020</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-light dark:text-gray-300">
                  Congratulations and thank you Mr. Victor Barreto on your 2020 Toyota Corolla!
                </p>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 glass-card dark:bg-gray-800 dark:border-gray-700">
              <div className="relative h-48 rounded-t-lg overflow-hidden">
                <Image 
                  src="/images/sale-history-4.jpg"
                  alt="Chevy Van Sale"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="dark:text-gray-100">2014 Chevy Van 6.0 V8</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-light dark:text-gray-300">
                  Thank you Mrs Mary for choosing Scuffletown 2.0! Enjoy the journey ahead!
                </p>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 glass-card dark:bg-gray-800 dark:border-gray-700">
              <div className="relative h-48 rounded-t-lg overflow-hidden">
                <Image 
                  src="/images/sale-history-2.jpg"
                  alt="Chevy Silverado Sale"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="dark:text-gray-100">Chevy Silverado 1500 4 Wheel</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-light dark:text-gray-300">
                  Thank Mr Echols for your purchase! We appreciate not just your business but also your service!
                </p>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 glass-card dark:bg-gray-800 dark:border-gray-700">
              <div className="relative h-48 rounded-t-lg overflow-hidden">
                <Image 
                  src="/images/sale-history-1.jpg"
                  alt="Harley Davidson Road King"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="dark:text-gray-100">2022 Road King Upgrade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-light dark:text-gray-300">
                  Thank you Chloe Locklear for allowing us to upgrade your 2022 road king!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Financing Announcement Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <Card className="max-w-4xl mx-auto bg-secondary dark:bg-gray-800 p-8 shadow-lg">
            <div className="text-white mb-4">
              <FaMoneyBillWave size={48} className="mx-auto" />
            </div>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-white dark:text-gray-100">Financing Options Available!</CardTitle>
              <CardDescription className="text-xl text-white opacity-90 dark:text-gray-300">
                Exciting News from Scuffletown 2.0 Motorsports & Sales!
              </CardDescription>
            </CardHeader>
            <CardContent className="text-white opacity-90 dark:text-gray-300 space-y-4">
              <p>
                We are thrilled to announce our partnership with Credit Acceptance Finance Services, bringing a whole new level of convenience to our valued customers!
              </p>
              <p>
                Starting December 10, 2024, Scuffletown 2.0 will officially offer in-house financing options to help make your dream vehicle a reality. Whether you're looking for reliable used cars, powerful V-twin motorcycles, or any of our quality vehicles, financing is now simpler, faster, and easier than ever before.
              </p>
              <p>
                At Scuffletown 2.0, we're committed to helping our community find the right vehicle with flexible payment options. So, why wait? Stop by, shop local, and experience the Scuffletown difference today!
              </p>
            </CardContent>
            <CardFooter className="justify-center pt-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold transition-colors">
                <Link href="/financing">
                  Get Pre-Qualified
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-accent dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-gray-100">What People Are Saying</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial Cards */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <div className="flex items-center text-primary">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-text dark:text-gray-300">
                  "Jody made buying my first car a fantastic experience. The no-pressure approach and honest advice helped me find exactly what I needed within my budget. His attention to detail and thorough vehicle inspections gave me complete confidence in my purchase."
                </p>
                <div className="flex items-center">
                  <div>
                    <h4 className="font-semibold dark:text-gray-100">Raj S.</h4>
                    <p className="text-sm text-text-light dark:text-gray-400">UNCP Student</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <div className="flex items-center text-primary">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-text dark:text-gray-300">
                  "After visiting several dealers, I found exactly what I was looking for here. Jody's knowledge of each vehicle in his inventory was impressive. As a student in UNCP, I was looking for something cheap and reliable, Jody made things very easier. 5/5 Customer Service"
                </p>
                <div className="flex items-center">
                  <div>
                    <h4 className="font-semibold dark:text-gray-100">Kai & Tan.</h4>
                    <p className="text-sm text-text-light dark:text-gray-400">UNCP Student</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <div className="flex items-center text-primary">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-text dark:text-gray-300">
                  "What sets this dealership apart is the personal attention. Jody took the time to understand exactly what I was looking for and helped me find the perfect motorcycle. His passion for vehicles and commitment to customer satisfaction is evident in everything he does."
                </p>
                <div className="flex items-center">
                  <div>
                    <h4 className="font-semibold dark:text-gray-100">Michael R.</h4>
                    <p className="text-sm text-text-light dark:text-gray-400">Motorcycle Enthusiast</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-gray-100">Why Choose Scuffletown 2.0</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <div className="mx-auto text-primary mb-4">
                  <FaCheckCircle size={48} />
                </div>
                <CardTitle className="dark:text-gray-100">Quality Vehicles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-light dark:text-gray-300">
                  Every vehicle in our inventory undergoes a thorough inspection to ensure quality and reliability.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <div className="mx-auto text-primary mb-4">
                  <FaMoneyBillWave size={48} />
                </div>
                <CardTitle className="dark:text-gray-100">Flexible Financing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-light dark:text-gray-300">
                  Our in-house financing options make it easier than ever to drive away in your dream vehicle.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <div className="mx-auto text-primary mb-4">
                  <FaMotorcycle size={48} />
                </div>
                <CardTitle className="dark:text-gray-100">Motorcycle Specialists</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-light dark:text-gray-300">
                  From sales to service, our team has the expertise to help with all your motorcycle needs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-secondary dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Find Your Perfect Ride?</h2>
          <p className="text-xl text-white dark:text-gray-300 mb-8 max-w-3xl mx-auto opacity-90">
            Visit our dealership today or browse our inventory online. We're here to help you find the perfect vehicle for your needs and budget.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-primary text-white hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90">
              <Link href="/inventory">
                Browse Inventory
              </Link>
            </Button>
            <Button asChild size="lg" className="bg-primary text-white hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90">
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
