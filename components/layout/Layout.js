'use client';

import Header from './Header';
import Footer from './Footer';
import { Toaster } from "../../src/components/ui/sonner";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900">
      <Header />
      <main className="flex-grow dark:text-gray-200">{children}</main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Layout; 