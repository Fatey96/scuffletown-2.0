'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ApiTestPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testApi = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/test-message');
      console.log('Test API response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API error: ${errorData.error || response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Test API response data:', data);
      setResult(data);
    } catch (err) {
      console.error('Error testing API:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">API Connection Test</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test API Connection</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={testApi} 
            disabled={loading}
          >
            {loading ? 'Testing...' : 'Test API Connection'}
          </Button>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}
          
          {result && (
            <div className="mt-4 p-4 bg-green-50 text-green-600 rounded-md">
              <p className="font-semibold">Success!</p>
              <pre className="mt-2 whitespace-pre-wrap">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 