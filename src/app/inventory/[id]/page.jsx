'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import Layout from '../../../../components/layout/Layout';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FaCar, 
  FaMotorcycle, 
  FaTachometerAlt, 
  FaCalendarAlt, 
  FaPaintBrush, 
  FaVrCardboard, 
  FaCheckCircle, 
  FaArrowLeft 
} from 'react-icons/fa';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

// SWR fetcher
const fetcher = (url) => fetch(url).then(res => {
  if (!res.ok) throw new Error('An error occurred while fetching the data');
  return res.json();
});

export default function VehicleDetailsPage({ params }) {
  const router = useRouter();
  // Using React.use to unwrap params
  const id = use(params).id;
  
  // Use React.useEffect to log the id for debugging
  useEffect(() => {
    console.log("Viewing vehicle with ID:", id);
  }, [id]);

  // Fetch vehicle data with SWR
  const { data, error, isLoading } = useSWR(`/api/vehicles/${id}`, fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 30000, // Refresh every 30 seconds
  });

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
    return new Intl.NumberFormat('en-US').format(mileage || 0);
  };

  // If page is loading
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <div className="mb-6">
            <Button variant="outline" onClick={() => router.back()} className="mb-4">
              <FaArrowLeft className="mr-2" /> Back to Inventory
            </Button>
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-[400px] w-full mb-4 rounded-lg" />
              <div className="grid grid-cols-4 gap-2 mt-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-md" />
                ))}
              </div>
            </div>
            
            <div>
              <Skeleton className="h-[500px] w-full rounded-lg" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // If there's an error
  if (error) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Vehicle</h2>
          <p className="mb-6 dark:text-gray-300">Unable to load vehicle details. The vehicle may have been removed or is no longer available.</p>
          <Button asChild variant="outline">
            <Link href="/inventory">
              <FaArrowLeft className="mr-2" /> Return to Inventory
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // If vehicle not found
  if (!data || !data.vehicle) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4 text-center">
          <h2 className="text-2xl font-bold mb-4 dark:text-gray-100">Vehicle Not Found</h2>
          <p className="mb-6 dark:text-gray-300">The vehicle you are looking for does not exist or has been removed.</p>
          <Button asChild variant="outline">
            <Link href="/inventory">
              <FaArrowLeft className="mr-2" /> Return to Inventory
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const vehicle = data.vehicle;

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 dark:bg-gray-900">
        <div className="mb-6">
          <Button asChild variant="outline" className="mb-4">
            <Link href="/inventory">
              <FaArrowLeft className="mr-2" /> Back to Inventory
            </Link>
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold dark:text-gray-100">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="capitalize dark:text-gray-200 dark:border-gray-600">
              {vehicle.type}
            </Badge>
            {vehicle.featured && (
              <Badge variant="secondary">
                Featured
              </Badge>
            )}
            {vehicle.sold && (
              <Badge variant="destructive">
                Sold
              </Badge>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vehicle Images */}
          <div className="lg:col-span-2">
            {vehicle.images && vehicle.images.length > 0 ? (
              <>
                <div className="rounded-lg overflow-hidden border border-border dark:border-gray-700 mb-2 bg-accent dark:bg-gray-800">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {vehicle.images.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="flex items-center justify-center h-[400px]">
                            <img 
                              src={image} 
                              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model} - Image ${index + 1}`}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {vehicle.images.map((image, index) => (
                    <div 
                      key={index}
                      className="h-20 border border-border dark:border-gray-700 rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <img 
                        src={image} 
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-lg border border-border dark:border-gray-700 h-[400px] flex items-center justify-center bg-accent dark:bg-gray-800">
                {vehicle.type === 'car' ? (
                  <FaCar size={100} className="text-accent-400 dark:text-gray-500" />
                ) : (
                  <FaMotorcycle size={100} className="text-accent-400 dark:text-gray-500" />
                )}
              </div>
            )}
          </div>
          
          {/* Vehicle Details */}
          <div>
            <Card className="glass-card dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-gray-100">Vehicle Details</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Detailed information about this {vehicle.make} {vehicle.model}
                </CardDescription>
                <div className="text-3xl font-bold text-primary mt-2">
                  {formatPrice(vehicle.price)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-primary mr-2" />
                    <div>
                      <div className="text-sm text-muted-foreground dark:text-gray-400">Year</div>
                      <div className="dark:text-gray-200">{vehicle.year}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <FaTachometerAlt className="text-primary mr-2" />
                    <div>
                      <div className="text-sm text-muted-foreground dark:text-gray-400">Mileage</div>
                      <div className="dark:text-gray-200">{formatMileage(vehicle.mileage)} miles</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <FaPaintBrush className="text-primary mr-2" />
                    <div>
                      <div className="text-sm text-muted-foreground dark:text-gray-400">Color</div>
                      <div className="dark:text-gray-200">{vehicle.color}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <FaVrCardboard className="text-primary mr-2" />
                    <div>
                      <div className="text-sm text-muted-foreground dark:text-gray-400">VIN</div>
                      <div className="truncate max-w-[120px] dark:text-gray-200">{vehicle.vin}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2 dark:text-gray-200">Description</h3>
                  <p className="text-muted-foreground dark:text-gray-300">{vehicle.description}</p>
                </div>
                
                {vehicle.features && vehicle.features.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2 dark:text-gray-200">Features</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {vehicle.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <FaCheckCircle className="text-primary mr-2 flex-shrink-0" />
                          <span className="dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="pt-4 flex flex-col gap-3">
                  <Button className="w-full" asChild>
                    <Link href={`/contact?vehicle=${vehicle._id}`}>
                      Inquire About This Vehicle
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full">
                    Schedule a Test Drive
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
} 