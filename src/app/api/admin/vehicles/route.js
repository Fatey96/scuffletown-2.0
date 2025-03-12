import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../../utils/auth';
import dbConnect from '../../../../../utils/dbConnect';
import Vehicle from '../../../../../models/Vehicle';

// Get all vehicles
export async function GET(req) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get query parameters
    const url = new URL(req.url);
    const type = url.searchParams.get('type');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    if (type) query.type = type;

    // Execute query with pagination
    const vehicles = await Vehicle.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Vehicle.countDocuments(query);

    return NextResponse.json({
      vehicles,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create a new vehicle
export async function POST(req) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    // Get request body
    const data = await req.json();
    console.log('Admin API - Received data for new vehicle:', data);
    
    // Process features from string to array (if provided as string)
    if (typeof data.features === 'string') {
      data.features = data.features
        .split('\n')
        .map(feature => feature.trim())
        .filter(feature => feature.length > 0);
    }
    
    // Explicitly handle sold status
    if ('sold' in data) {
      data.sold = Boolean(data.sold);
      console.log('Processing sold flag for new vehicle:', data.sold, typeof data.sold);
    }
    
    console.log('Creating new vehicle with processed data:', data);
    
    // Validate required fields
    if (!data.make || !data.model || !data.price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Ensure createdAt is set to current time and sold is properly initialized
    const currentTime = new Date();
    const vehicleData = {
      ...data,
      createdAt: currentTime,
      sold: Boolean(data.sold || false)
    };
    
    console.log('Creating new vehicle with final data:', {
      ...vehicleData,
      createdAt: vehicleData.createdAt.toISOString(),
      sold: vehicleData.sold
    });
    
    // Create new vehicle
    const vehicle = new Vehicle(vehicleData);
    await vehicle.save();
    
    console.log('New vehicle created successfully:', {
      id: vehicle._id,
      createdAt: vehicle.createdAt,
      sold: vehicle.sold
    });
    
    return NextResponse.json(vehicle, { status: 201 });
    
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 