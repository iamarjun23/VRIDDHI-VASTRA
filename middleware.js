import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Explicit middleware function for Next.js compatibility
  },
  {
    pages: {
      signIn: "/login",
    },
  }
)

export const config = { matcher: ["/admin/:path*"] }
