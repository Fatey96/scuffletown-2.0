import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../../utils/auth';
import dbConnect from '../../../../../utils/dbConnect';
import Vehicle from '../../../../../models/Vehicle';

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

    // Get total vehicles
    const totalVehicles = await Vehicle.countDocuments();
    
    // Get cars count
    const totalCars = await Vehicle.countDocuments({ type: 'car' });
    
    // Get motorcycles count
    const totalMotorcycles = await Vehicle.countDocuments({ type: 'motorcycle' });
    
    // Get featured vehicles
    const featuredVehicles = await Vehicle.countDocuments({ featured: true });
    
    // Get recent sales (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentSales = await Vehicle.countDocuments({
      sold: true,
      updatedAt: { $gte: thirtyDaysAgo }
    });

    return NextResponse.json({
      totalVehicles,
      totalCars,
      totalMotorcycles,
      featuredVehicles,
      recentSales
    });
    
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 