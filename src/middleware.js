import { NextResponse } from 'next/server';

export function middleware(request) {
    const url = request.nextUrl.clone();
    const hostname = request.headers.get('host') || '';

    // Check if request originates from the certificate subdomain
    // (e.g. certificate.cyberx.org.in or certificate.localhost:3000)
    if (hostname.startsWith('certificate.')) {
        // Exclude Next.js internal routes, static assets, and API routes from rewrite
        if (
            !url.pathname.startsWith('/_next') &&
            !url.pathname.startsWith('/assets') &&
            !url.pathname.startsWith('/favicon')
        ) {
            // Rewrite root "/" to "/certificates" transparently (no URL redirect)
            if (url.pathname === '/') {
                url.pathname = '/certificates';
                return NextResponse.rewrite(url);
            }

            // If user accesses /osint-researcher-digital-investigations on subdomain,
            // rewrite to /certificates/osint-researcher-digital-investigations
            if (!url.pathname.startsWith('/certificates') && !url.pathname.startsWith('/api')) {
                url.pathname = `/certificates${url.pathname}`;
                return NextResponse.rewrite(url);
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
