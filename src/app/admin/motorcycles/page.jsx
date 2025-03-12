'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MotorcyclesRedirectPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/admin/vehicles');
  }, [router]);
  
  return (
    <div className="flex items-center justify-center h-full">
      <p>Redirecting to Vehicles management...</p>
    </div>
  );
} 