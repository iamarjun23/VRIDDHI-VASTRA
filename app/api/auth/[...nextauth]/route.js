import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {

  providers: [

    CredentialsProvider({

      name: "Admin Login",

      credentials: {
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials) {

        const ADMIN_USER = "admin"
        const ADMIN_PASS = "vriddhivastra@123"

        if (credentials.password === ADMIN_PASS) {
          return {
            id: "1",
            name: "Admin"
          }
        }

        return null
      }

    })

  ],

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60 // 24 hours in seconds
  },

  pages: {
    signIn: "/login"
  },

  secret: "lyptron-super-secret-key"

}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }