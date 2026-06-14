import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const pathname = req.nextUrl.pathname;
    const token = req.nextauth.token;

    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    if (!token.isActive) {
      return NextResponse.redirect(new URL('/auth/login?error=Deactivated', req.url));
    }

    const role = token.role as string;

    if (pathname.startsWith('/admin/users') || pathname.startsWith('/admin/invites')) {
      if (role !== 'admin') {
        return NextResponse.redirect(new URL('/admin?error=Forbidden', req.url));
      }
    }

    if (pathname.startsWith('/admin/bookings')) {
      if (!['admin', 'subadmin'].includes(role)) {
        return NextResponse.redirect(new URL('/admin?error=Forbidden', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*'],
};
