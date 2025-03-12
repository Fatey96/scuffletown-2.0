import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../utils/auth';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    console.log('Upload API route called');
    
    // Log Cloudinary config (without secret)
    console.log('Cloudinary config:', {
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key_configured: Boolean(process.env.CLOUDINARY_API_KEY),
      api_secret_configured: Boolean(process.env.CLOUDINARY_API_SECRET),
      upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '(none)',
    });
    
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      console.log('Upload rejected: Unauthorized access');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get form data (image as base64)
    const data = await req.json();
    const { image } = data;
    
    if (!image) {
      console.log('Upload rejected: No image provided');
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }
    
    console.log('Uploading image to Cloudinary...');
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(image, {
      upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || undefined,
    });
    
    console.log('Upload successful:', result.secure_url);
    
    // Return the Cloudinary URL
    return NextResponse.json({
      secure_url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error.message);
    if (error.http_code) {
      console.error('Cloudinary HTTP error:', {
        code: error.http_code,
        message: error.message,
      });
    }
    return NextResponse.json(
      { error: error.message || 'Error uploading image' },
      { status: error.http_code || 500 }
    );
  }
} 