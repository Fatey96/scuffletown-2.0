import { NextResponse } from 'next/server';
import dbConnect from '../../../../../../../utils/dbConnect';
import Message from '../../../../../../../models/Message';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../../../../utils/auth';

// PUT to mark message as read
export async function PUT(request, { params }) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    await dbConnect();
    
    const message = await Message.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true, runValidators: true }
    );
    
    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }
    
    return NextResponse.json(message);
  } catch (error) {
    console.error('Error marking message as read:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 