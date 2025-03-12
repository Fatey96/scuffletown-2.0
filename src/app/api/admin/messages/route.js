import { NextResponse } from 'next/server';
import dbConnect from '../../../../../utils/dbConnect';
import Message from '../../../../../models/Message';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../../utils/auth';

// GET all messages (admin only)
export async function GET(request) {
  console.log('Messages API route called');
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions);
    console.log('Auth session:', session);
    
    if (!session || session.user.role !== 'admin') {
      console.log('Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    console.log('Database connected');
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let query = {};
    
    // Filter by status if provided
    if (status === 'read') {
      query.isRead = true;
    } else if (status === 'unread') {
      query.isRead = false;
    }
    
    console.log('Query:', query);
    
    // Get messages sorted by newest first
    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .populate('vehicleId', 'make model year')
      .lean();
    
    console.log(`Found ${messages.length} messages`);
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error in messages API route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 