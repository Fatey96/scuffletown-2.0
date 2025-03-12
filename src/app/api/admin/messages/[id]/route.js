import { NextResponse } from 'next/server';
import dbConnect from '../../../../../../utils/dbConnect';
import Message from '../../../../../../models/Message';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../../../utils/auth';

// GET a single message by ID (admin only)
export async function GET(request, { params }) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    await dbConnect();
    
    const message = await Message.findById(id)
      .populate('vehicleId', 'make model year')
      .lean();
    
    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }
    
    // Mark as read when viewed
    if (!message.isRead) {
      await Message.findByIdAndUpdate(id, { isRead: true });
    }
    
    return NextResponse.json(message);
  } catch (error) {
    console.error('Error fetching message:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE a message (admin only)
export async function DELETE(request, { params }) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    await dbConnect();
    
    const message = await Message.findByIdAndDelete(id);
    
    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 