import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import logger from "@/lib/logger"

export default withAuth(
  function middleware(req) {
    logger.info(`Middleware processing: ${req.nextUrl.pathname}`, {
      component: 'Middleware',
      path: req.nextUrl.pathname,
    })
    if (req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.role !== "ADMIN") {
      logger.warn(`Unauthorized access attempt to admin area`, {
        component: 'Middleware',
        email: req.nextauth.token?.email,
        path: req.nextUrl.pathname,
      })
      return NextResponse.rewrite(new URL("/auth/signin", req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        if (token) {
          logger.info(`Authorized access`, {
            component: 'Middleware',
            email: token.email,
          })
          return true
        }
        logger.warn(`Unauthorized access attempt`, {
          component: 'Middleware',
        })
        return false
      },
    },
  }
)

export const config = { matcher: ["/dashboard/:path*"] }
