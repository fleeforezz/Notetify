/**
 * @file middleware.ts
 * @description Next.js middleware for route protection.
 * Checks for the 'auth-token' cookie to ensure only authenticated users can access /notes.
 * Also redirects authenticated users away from /auth pages back to /notes.
 */

import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
  const isNotesPage = request.nextUrl.pathname.startsWith('/notes')

  if (!token && isNotesPage) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/notes', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
