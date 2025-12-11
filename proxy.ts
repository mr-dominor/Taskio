import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextRequest,NextResponse } from 'next/server';

 const isPublicRoute = createRouteMatcher([
   '/sign-in(.*)',
   '/sign-up(.*)',
   '/',
   '/api/webhook'
 ])

 export default clerkMiddleware(async (auth, req:NextRequest) => {
  const {isAuthenticated, redirectToSignIn} = await auth();
  if (!isPublicRoute(req)) {
     await auth.protect()
   }
  
  const url = req.nextUrl.clone()
  if(isAuthenticated && isPublicRoute(req)){
    url.pathname = '/select-org'
    return NextResponse.redirect(url)
  }

 })

//export default clerkMiddleware()

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}