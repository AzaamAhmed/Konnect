import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simplified middleware for MVP - can be enhanced with i18n later
export function middleware(request: NextRequest) {
    // Add any global middleware logic here
    return NextResponse.next();
}

export const config = {
    // Match all paths except static files and API routes
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
