'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AddMotorcycleRedirectPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/admin/vehicles/new?type=motorcycle');
  }, [router]);
  
  return (
    <div className="flex items-center justify-center h-full">
      <p>Redirecting to Add Vehicle form...</p>
    </div>
  );
} 