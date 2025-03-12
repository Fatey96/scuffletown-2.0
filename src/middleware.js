import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const path = req.nextUrl.pathname;
  
  // Define paths that should be protected (all admin paths except login)
  const isAdminPath = path.startsWith('/admin') && path !== '/admin/login';
  
  // Get the session token
  const token = await getToken({ 
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  // If trying to access protected admin route and not authenticated or not an admin
  if (isAdminPath && (!token || token.role !== 'admin')) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }
  
  // If already logged in as admin and trying to access login page
  if (path === '/admin/login' && token && token.role === 'admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url));
  }
  
  return NextResponse.next();
}

// See "Matching Paths" below
export const config = {
  matcher: ['/admin/:path*'],
}; 