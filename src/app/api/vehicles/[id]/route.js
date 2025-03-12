import { NextResponse } from 'next/server';
import dbConnect from '../../../../../utils/dbConnect';
import Vehicle from '../../../../../models/Vehicle';

export async function GET(req, { params }) {
  try {
    await dbConnect();
    
    // Get the ID from params
    const { id } = params;
    console.log("Fetching public vehicle with ID:", id);
    
    // Validate ID
    if (!id) {
      return NextResponse.json(
        { error: 'Vehicle ID is required' },
        { status: 400 }
      );
    }
    
    // Find vehicle
    const vehicle = await Vehicle.findById(id);
    
    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }
    
    // Only return available vehicles for public access
    if (vehicle.sold) {
      return NextResponse.json(
        { error: 'Vehicle is no longer available' },
        { status: 410 }
      );
    }
    
    return NextResponse.json({ vehicle }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      }
    });
    
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 