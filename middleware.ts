import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getValidSubdomain } from '@/libs/subdomain';

// RegExp for public files
const PUBLIC_FILE = /\.(.*)$/; // Files

export async function middleware(req: NextRequest) {
  // Clone the URL
  // const requestHeaders = new Headers(req.headers);
  // requestHeaders.set("Access-Control-Allow-Origin", "*");
  // requestHeaders.set("Access-Control-Allow-Methods","GET,DELETE,PATCH,POST,PUT")
  // requestHeaders.set("Access-Control-Allow-Credentials","true");

  const url = req.nextUrl.clone();
  // Skip public files
  if (PUBLIC_FILE.test(url.pathname) || url.pathname.includes('_next')) return;

  if (url.pathname.startsWith(`/admin`)) {
    return new Response(null, { status: 404 });
  }
  const host = req.headers.get('host');
  const subdomain = getValidSubdomain(host);
  if (subdomain) {
    url.pathname = `/${subdomain}${url.pathname}`;
  }

  return NextResponse.rewrite(url);
}

