import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      email: string
      name: string | null
      role: string
      darkMode: boolean
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    email: string
    name: string | null
    role: string
    darkMode: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    name: string | null
    role: string
    darkMode: boolean
    refreshToken?: string
    accessTokenExpires?: number
    refreshTokenExpires?: number
    error?: string
  }
}
