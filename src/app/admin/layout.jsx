'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { FaCar, FaTachometerAlt, FaComments, FaSignOutAlt, FaBars, FaTimes, FaEnvelope } from 'react-icons/fa';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';

// Skip the admin layout for login page
export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Don't apply this layout to the login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }
  
  return (
    <div className="flex h-screen bg-background dark:bg-gray-950">
      {/* Sidebar for desktop */}
      <aside className={`fixed inset-y-0 z-50 flex flex-col w-64 overflow-y-auto bg-secondary dark:bg-gray-800 text-white transition-all lg:static 
        ${sidebarOpen ? 'left-0' : '-left-64 lg:left-0'}`}>
        <div className="p-4 border-b border-secondary-light dark:border-gray-700 flex justify-between items-center">
          <h1 className="text-xl font-bold dark:text-gray-100">Admin Dashboard</h1>
          <button 
            className="p-1 lg:hidden dark:text-gray-300 dark:hover:text-white" 
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/admin/dashboard" className={`flex items-center p-2 rounded-md hover:bg-secondary-light dark:hover:bg-gray-700 transition-colors ${
            pathname === '/admin/dashboard' ? 'bg-primary text-white' : 'dark:text-gray-300'
          }`}>
            <FaTachometerAlt className="mr-2" /> Dashboard
          </Link>
          <Link href="/admin/vehicles" className={`flex items-center p-2 rounded-md hover:bg-secondary-light dark:hover:bg-gray-700 transition-colors ${
            pathname.startsWith('/admin/vehicles') ? 'bg-primary text-white' : 'dark:text-gray-300'
          }`}>
            <FaCar className="mr-2" /> Vehicles
          </Link>
          <Link href="/admin/messages" className={`flex items-center p-2 rounded-md hover:bg-secondary-light dark:hover:bg-gray-700 transition-colors ${
            pathname.startsWith('/admin/messages') ? 'bg-primary text-white' : 'dark:text-gray-300'
          }`}>
            <FaEnvelope className="mr-2" /> Messages
          </Link>
          <Link href="/admin/reviews" className={`flex items-center p-2 rounded-md hover:bg-secondary-light dark:hover:bg-gray-700 transition-colors ${
            pathname.startsWith('/admin/reviews') ? 'bg-primary text-white' : 'dark:text-gray-300'
          }`}>
            <FaComments className="mr-2" /> Reviews
          </Link>
        </nav>
        
        <div className="p-4 border-t border-secondary-light dark:border-gray-700">
          <Button
            onClick={() => signOut({ callbackUrl: '/' })}
            variant="destructive"
            className="w-full justify-start"
          >
            <FaSignOutAlt className="mr-2" /> Sign Out
          </Button>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="bg-card dark:bg-gray-800 border-b border-border dark:border-gray-700 flex items-center justify-between p-4">
          <div className="flex items-center">
            <button 
              className="p-2 mr-2 lg:hidden dark:text-gray-300" 
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <FaBars />
            </button>
            <h2 className="text-xl font-semibold dark:text-gray-100">
              {pathname === '/admin/dashboard' && 'Dashboard'}
              {pathname.startsWith('/admin/vehicles') && 'Vehicles Management'}
              {pathname.startsWith('/admin/messages') && 'Message Center'}
              {pathname.startsWith('/admin/reviews') && 'Reviews Management'}
            </h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm" className="dark:text-gray-300 dark:hover:bg-gray-700">
              <Link href="/" target="_blank">View Site</Link>
            </Button>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 dark:bg-gray-900">
          {children}
        </main>
      </div>
      
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
} 