'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';

export default function ReviewsComingSoonPage() {
  const router = useRouter();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reviews Management</h1>
      </div>
      
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center space-x-2 mb-2">
            <FaExclamationTriangle className="text-yellow-500 h-6 w-6" />
            <CardTitle>Coming Soon</CardTitle>
          </div>
          <CardDescription>
            The reviews management feature is currently under development.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 text-center">
            <p className="text-lg mb-8">We're working on building a comprehensive system to manage customer reviews. This feature will be available in the next update.</p>
            
            <h3 className="text-xl font-semibold mb-4">Planned Features:</h3>
            <ul className="list-disc text-left max-w-md mx-auto mb-8 space-y-2">
              <li>Review moderation with approval workflows</li>
              <li>Rating system management</li>
              <li>Response templates for common review types</li>
              <li>Analytics on customer satisfaction</li>
              <li>Integration with the public-facing website</li>
            </ul>
            
            <Button 
              onClick={() => router.push('/admin/dashboard')}
              className="mt-4"
              size="lg"
            >
              <FaArrowLeft className="mr-2" /> Return to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 