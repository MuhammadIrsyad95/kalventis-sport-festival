import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

// Helper untuk membuat redirect URL absolut
function makeRedirectUrl(baseUrl: string, path: string): URL {
  return new URL(path, baseUrl);
}

// Fungsi middleware yang akan dijalankan untuk setiap request
export async function middleware(request: NextRequest) {
  console.log(`[Middleware] Processing: ${request.nextUrl.pathname}`);

  // Jika bukan halaman admin, lewati saja
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Jika halaman login atau register admin, lewati saja
  if (
    request.nextUrl.pathname === '/admin/login' || 
    request.nextUrl.pathname === '/admin/register'
  ) {
    console.log('[Middleware] Login/Register page, skipping auth check');
    return NextResponse.next();
  }

  try {
    // Buat instance dari supabase client menggunakan cookies dari request
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res });
    
    // Cek apakah ada session di cookies
    const { data: { session } } = await supabase.auth.getSession();
    
    // Jika tidak ada session, redirect ke halaman login
    if (!session) {
      console.log('[Middleware] No session found, redirecting to login page');
      
      // Buat URL absolut untuk redirect
      const origin = request.headers.get('origin') || request.nextUrl.origin;
      const redirectUrl = new URL('/admin/login', origin);
      
      // Simpan URL yang dicoba akses sebagai returnUrl
      redirectUrl.searchParams.set('returnUrl', request.nextUrl.pathname);
      
      console.log(`[Middleware] Redirecting to: ${redirectUrl.toString()}`);
      return NextResponse.redirect(redirectUrl.toString());
    }
    
    // Jika ada session, lanjutkan request
    console.log('[Middleware] Session found for', session.user.email);
    return res;
  } catch (error) {
    // Tangkap error dan tetap jalankan next() untuk menghindari middleware error
    console.error('[Middleware] Error checking session:', error);
    
    // Pada error, lebih baik redirect ke login untuk keamanan
    const origin = request.headers.get('origin') || request.nextUrl.origin;
    const redirectUrl = new URL('/admin/login', origin);
    return NextResponse.redirect(redirectUrl.toString());
  }
}

// Konfigurasi matcher agar middleware hanya berjalan untuk path yang sesuai
export const config = {
  matcher: [
    '/admin',
    '/admin/:path*'
  ]
} 