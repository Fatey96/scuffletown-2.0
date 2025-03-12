'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaCar, FaMotorcycle, FaUser, FaChartLine, FaPlus } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    totalCars: 0,
    totalMotorcycles: 0,
    recentSales: 0,
    featuredVehicles: 0,
  });

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold dark:text-gray-100">Dashboard</h1>
        <div className="flex space-x-2">
          <Button asChild>
            <Link href="/admin/vehicles/new">
              <FaPlus className="mr-2" /> Add New Vehicle
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-400">Total Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold dark:text-gray-100">{stats.totalVehicles}</div>
              <FaChartLine className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-400">Cars</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold dark:text-gray-100">{stats.totalCars}</div>
              <FaCar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-400">Motorcycles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold dark:text-gray-100">{stats.totalMotorcycles}</div>
              <FaMotorcycle className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-400">Featured Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold dark:text-gray-100">{stats.featuredVehicles}</div>
              <FaUser className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card className="glass-card dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-gray-100">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button asChild variant="outline" className="h-auto py-4 justify-start dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
              <Link href="/admin/vehicles/new" className="flex flex-col items-center">
                <FaCar className="h-8 w-8 mb-2" />
                <span>Add Car</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 justify-start dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
              <Link href="/admin/vehicles" className="flex flex-col items-center">
                <FaChartLine className="h-8 w-8 mb-2" />
                <span>View All Inventory</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="glass-card dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-gray-100">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground dark:text-gray-400 text-center py-4">
              No recent activity to display
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 