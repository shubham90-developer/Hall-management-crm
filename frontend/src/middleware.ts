import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  const isAuthPage = pathname.startsWith('/auth')

  // No token and not on auth page → redirect to sign in
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url))
  }

  // Token exists and on auth page → redirect to dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/apps/calendar', request.url))
  }

  // Root path redirect
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/apps/calendar', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets).*)'],
}
