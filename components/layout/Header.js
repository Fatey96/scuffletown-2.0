'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaCar, FaMotorcycle, FaMapMarkerAlt, FaPhone, FaBars, FaTimes, FaFacebook, FaInstagram } from 'react-icons/fa';
import { Button } from '../../src/components/ui/button';
import { ThemeToggle } from '../../src/components/ui/theme-toggle';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../src/components/ui/sheet";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    return pathname === path ? 'text-primary font-bold' : 'text-white hover:text-primary';
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'glass-effect py-2 bg-black/90 backdrop-blur-md shadow-lg border-b border-gray-700 dark:bg-gray-900/95 dark:backdrop-blur-md dark:border-gray-800' 
          : 'bg-black/75 py-4 backdrop-blur-md shadow-md border-b border-gray-700 dark:bg-black/80 dark:backdrop-blur-md dark:border-gray-800'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-primary text-3xl font-bold filter drop-shadow-md">SCUFFLETOWN 2.0</span>
            <span className="text-white text-3xl font-bold ml-2 filter drop-shadow-md dark:text-white">MOTORSPORTS</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`${isActive('/')} transition-colors duration-200 text-lg font-medium dark:text-gray-100 dark:hover:text-primary`}>
              Home
            </Link>
            <Link href="/inventory" className={`${isActive('/inventory')} transition-colors duration-200 text-lg font-medium dark:text-gray-100 dark:hover:text-primary`}>
              Inventory
            </Link>
            <Link href="/financing" className={`${isActive('/financing')} transition-colors duration-200 text-lg font-medium dark:text-gray-100 dark:hover:text-primary`}>
              Financing
            </Link>
            <Link href="/reviews" className={`${isActive('/reviews')} transition-colors duration-200 text-lg font-medium dark:text-gray-100 dark:hover:text-primary`}>
              Reviews
            </Link>
            <Link href="/contact" className={`${isActive('/contact')} transition-colors duration-200 text-lg font-medium dark:text-gray-100 dark:hover:text-primary`}>
              Contact
            </Link>
            <Link href="/location" className={`${isActive('/location')} transition-colors duration-200 text-lg font-medium dark:text-gray-100 dark:hover:text-primary`}>
              Location
            </Link>
          </nav>

          {/* Social & Contact Info - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="https://www.facebook.com/scuffletown2.0motorsports" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors duration-200">
              <FaFacebook size={20} />
            </a>
            <a href="https://www.instagram.com/scuffletown2.0motorsports" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors duration-200">
              <FaInstagram size={20} />
            </a>
            <Link href="/location" className="flex items-center text-white hover:text-primary transition-colors duration-200 ml-2">
              <FaMapMarkerAlt className="mr-2" />
              <span>Find Us</span>
            </Link>
            <ThemeToggle />
            <Button asChild variant="default" className="ml-2 bg-primary hover:bg-primary-dark text-white">
              <Link href="/financing">
                Get Pre-Qualified
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <FaBars size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="glass-effect w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="text-foreground">Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-6">
                  <Link 
                    href="/" 
                    className={`${isActive('/')} py-2 transition-colors duration-200`}
                  >
                    Home
                  </Link>
                  <Link 
                    href="/inventory" 
                    className={`${isActive('/inventory')} py-2 transition-colors duration-200`}
                  >
                    Inventory
                  </Link>
                  <Link 
                    href="/financing" 
                    className={`${isActive('/financing')} py-2 transition-colors duration-200`}
                  >
                    Financing
                  </Link>
                  <Link 
                    href="/reviews" 
                    className={`${isActive('/reviews')} py-2 transition-colors duration-200`}
                  >
                    Reviews
                  </Link>
                  <Link 
                    href="/contact" 
                    className={`${isActive('/contact')} py-2 transition-colors duration-200`}
                  >
                    Contact
                  </Link>
                  <div className="flex items-center space-x-4 py-2">
                    <a 
                      href="https://www.facebook.com/scuffletown2.0motorsports" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-text-white hover:text-primary transition-colors duration-200"
                    >
                      <FaFacebook size={20} />
                    </a>
                    <a 
                      href="https://www.instagram.com/scuffletown2.0motorsports" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-text-white hover:text-primary transition-colors duration-200"
                    >
                      <FaInstagram size={20} />
                    </a>
                    <Link 
                      href="/location" 
                      className="flex items-center text-text-white hover:text-primary transition-colors duration-200"
                    >
                      <FaMapMarkerAlt className="mr-2" />
                      <span>Find Us</span>
                    </Link>
                  </div>
                  <Button asChild className="w-full mt-4 bg-primary hover:bg-primary-dark text-white">
                    <Link href="/financing">
                      Get Pre-Qualified
                    </Link>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 