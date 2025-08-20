import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Bloquer les requêtes vers les fichiers de debug Next.js
  if (pathname.includes('__nextjs_original-stack-frames') || 
      pathname.includes('_next/static/chunks/') ||
      pathname === '/sw.js') {
    return new NextResponse(null, { status: 404 });
  }

  // Gestion admin simplifiée
  if (pathname.startsWith('/admin')) {
    const providedToken = url.searchParams.get('t');
    const hasCookie = request.cookies.get('admin_auth')?.value === '1';
    const validToken = process.env.ADMIN_TOKEN || 'AFRIQUADIS-ADMIN-2024';

    if (providedToken && providedToken === validToken) {
      url.searchParams.delete('t');
      const response = NextResponse.redirect(url);
      response.cookies.set('admin_auth', '1', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      });
      return response;
    }

    if (hasCookie) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
