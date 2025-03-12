import { NextResponse } from 'next/server';

export async function GET() {
  console.log('Test message API route called');
  try {
    // Return a simple test response
    return NextResponse.json({ 
      success: true, 
      message: 'API route is working', 
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Error in test message API route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 