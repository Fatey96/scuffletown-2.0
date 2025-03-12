'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaLock } from 'react-icons/fa';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result.error) {
        toast.error(result.error);
        setIsLoading(false);
        return;
      }

      // Successful login
      toast.success('Login successful!');
      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-accent dark:bg-gray-900">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md glass-card dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="p-2 bg-primary rounded-full">
              <FaLock className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center dark:text-gray-100">Admin Login</CardTitle>
          <CardDescription className="text-center dark:text-gray-300">
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium dark:text-gray-200">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 border border-border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium dark:text-gray-200">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 border border-border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary-dark"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="border-t dark:border-gray-700 pt-4">
          <p className="text-center text-sm text-muted-foreground dark:text-gray-400 w-full">
            This area is restricted to authorized administrators only.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 