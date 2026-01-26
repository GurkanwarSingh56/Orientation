import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Define protected routes
  const isProtectedRoute =
    path.startsWith('/dashboard') || path.startsWith('/admin')

  // For now, we'll handle auth checks on the client side
  // In a full implementation, you'd check for a session cookie here
  
  // You can add server-side token verification here
  // const token = request.cookies.get('auth-token')?.value

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
}
