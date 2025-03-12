import { NextResponse } from 'next/server';
import dbConnect from '../../../../utils/dbConnect';
import Vehicle from '../../../../models/Vehicle';

export async function GET(req) {
  try {
    await dbConnect();

    // Get URL parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const type = searchParams.get('type');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minYear = searchParams.get('minYear');
    const maxYear = searchParams.get('maxYear');
    const search = searchParams.get('search');
    const includeSold = searchParams.get('includeSold') === 'true';
    const featured = searchParams.get('featured') === 'true';
    
    // Reduce logging to essential information only
    console.log(`API Request: ${type || 'All'} vehicles, page ${page}, limit ${limit}`);
    
    // Build query
    const query = {};
    
    // Filter out sold vehicles by default for public view, unless includeSold is true
    if (!includeSold) {
      query.sold = { $ne: true };
    }
    
    // For featured requests, we're getting the newest vehicles instead of checking the featured flag
    // So we don't add any special condition to the query for featured
    
    // Filter by type if specified
    if (type && type !== 'all') {
      query.type = type;
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }
    
    // Year range filter
    if (minYear || maxYear) {
      query.year = {};
      if (minYear) query.year.$gte = parseInt(minYear);
      if (maxYear) query.year.$lte = parseInt(maxYear);
    }
    
    // Search term
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { make: searchRegex },
        { model: searchRegex },
        { description: searchRegex }
      ];
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // For featured requests, override the limit to 4 most recent vehicles
    const actualLimit = featured ? 4 : limit;
    
    // Add timestamp for cache busting
    const timestamp = new Date().toISOString();
    
    // Fetch vehicles with pagination
    const vehicles = await Vehicle.find(query)
      .sort({ createdAt: -1 }) // Always sort by newest first in the database query
      .skip(featured ? 0 : skip) // Skip pagination for featured requests
      .limit(actualLimit)
      .lean();
    
    // Get total count for pagination before trying to use it
    const total = await Vehicle.countDocuments(query);
    
    // Now log with the total variable properly defined
    console.log(`Found ${vehicles.length} vehicles of ${total} total`);
    
    // Calculate total pages
    const pages = Math.ceil(total / limit);
    
    // Add debug information for each vehicle and ensure createdAt is present
    const vehiclesWithDebugInfo = vehicles.map(vehicle => {
      // Ensure each vehicle has a creation date (use current date as fallback)
      const createdAt = vehicle.createdAt || new Date().toISOString();
      
      return {
        ...vehicle,
        createdAt
      };
    });
    
    // Return response
    return NextResponse.json({
      vehicles: vehiclesWithDebugInfo,
      pagination: {
        total,
        page,
        pages,
        limit
      }
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
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