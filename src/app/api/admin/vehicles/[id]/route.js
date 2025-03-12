import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../../../utils/auth';
import dbConnect from '../../../../../../utils/dbConnect';
import Vehicle from '../../../../../../models/Vehicle';

// Get a specific vehicle by ID
export async function GET(req, { params }) {
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
    
    // Get the ID directly from params
    const { id } = params;
    console.log("Fetching vehicle with ID:", id);
    
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
    
    console.log("Vehicle fetched successfully:", vehicle);
    return NextResponse.json(vehicle);
    
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update a vehicle
export async function PUT(req, { params }) {
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
    
    // Get the ID from params
    const { id } = params;
    console.log("Updating vehicle with ID:", id);
    
    // Validate ID
    if (!id) {
      return NextResponse.json(
        { error: 'Vehicle ID is required' },
        { status: 400 }
      );
    }
    
    // Get request body
    const data = await req.json();
    console.log("Update data received:", data);
    
    // Process features from string to array (if provided as string)
    if (typeof data.features === 'string') {
      data.features = data.features
        .split('\n')
        .map(feature => feature.trim())
        .filter(feature => feature.length > 0);
    }
    
    // Ensure featured and sold are boolean values
    if ('featured' in data) {
      data.featured = Boolean(data.featured);
      console.log("Setting featured to:", data.featured);
    }
    
    if ('sold' in data) {
      data.sold = Boolean(data.sold);
      console.log("Setting sold to:", data.sold);
    }

    // Find and update vehicle
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );
    
    if (!updatedVehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }
    
    // Force a save to ensure all middleware runs and the document is properly updated
    await updatedVehicle.save();
    
    console.log("Vehicle updated successfully:", updatedVehicle);
    return NextResponse.json(updatedVehicle, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      }
    });
    
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete a vehicle
export async function DELETE(req, { params }) {
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
    
    // Get the ID from params
    const { id } = params;
    console.log("Deleting vehicle with ID:", id);
    
    // Validate ID
    if (!id) {
      return NextResponse.json(
        { error: 'Vehicle ID is required' },
        { status: 400 }
      );
    }
    
    // Find and delete vehicle
    const deletedVehicle = await Vehicle.findByIdAndDelete(id);
    
    if (!deletedVehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }
    
    console.log("Vehicle deleted successfully");
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 