import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { signOut } from "next-auth/react";




export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};


// RegExp for public files
const PUBLIC_FILE = /\.(.*)$/; // Files


export default async function middleware(req: NextRequest, res : NextResponse) {
  const url = req.nextUrl;
   
  // Skip public files
  if (PUBLIC_FILE.test(url.pathname) || url.pathname.includes('_next')) return;


  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:7000)
  let hostname = req.headers
    .get("host")!
    .replace(`.${process.env.NEXT_PUBLIC_APP_HOSTNAME}`, `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

  // special case for Vercel preview deployment URLs
  if (
    hostname.includes("---") &&
    hostname.endsWith(`.${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)
  ) {
    console.log('---------herher sdfsdfsdfnsdffsdf');
    
    hostname = `${hostname.split("---")[0]}.${
      process.env.NEXT_PUBLIC_ROOT_DOMAIN
    }`;
  }

  const searchParams = req.nextUrl.searchParams.toString();
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  console.log(hostname,'-----------hostname');
  
  // rewrites for app pages
  if (hostname == `admin.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    const session = await getToken({ req });

    console.log(session,path, ' ==== session session session session session session session session session ====')
    let role : unknown  = session?.role;

    if (!session && !path.includes("/login")) {
      return NextResponse.redirect(new URL("/login", req.url));
    } else if (session && path == "/login") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.rewrite(
      new URL(`/admin${path === "/" ? "" : path}`, req.url),
    );
  }

  // special case for `vercel.pub` domain
  if (hostname === "vercel.pub") {
    return NextResponse.redirect(
      "https://vercel.com/blog/platforms-starter-kit",
    );
  }
  // console.log(path,"==path");
  // rewrite root application to `/home` folder
  if (
    hostname === process.env.NEXT_PUBLIC_APP_HOSTNAME ||
    hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ) {
 
    
    return NextResponse.rewrite(
      new URL(`/customer${path === "/" ? "" : path}`, req.url),
    );
  }

  // rewrite everything else to `/[domain]/[slug] dynamic route
  return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
}

