import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions, getServerSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "./prisma"
import logger from "./logger"
import { GetServerSidePropsContext } from "next"
import { JWT } from "next-auth/jwt"

interface ExtendedJWT extends JWT {
  id: string;
  email: string;
  name: string | null;
  role: string;
  darkMode: boolean;
  refreshToken?: string;
  accessTokenExpires?: number;
  refreshTokenExpires?: number;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 15 * 60,
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          logger.warn("Login attempt with missing credentials")
          return null
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })
        if (!user) {
          logger.warn({ email: credentials.email }, "Login attempt for non-existent user")
          return null
        }
        const isPasswordValid = await compare(
          credentials.password,
          user.password
        )
        if (!isPasswordValid) {
          logger.warn({ email: user.email }, "Invalid password attempt")
          return null
        }
        logger.info({ user: { id: user.id, email: user.email, role: user.role } }, "User logged in successfully")
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          darkMode: user.darkMode,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }): Promise<ExtendedJWT> {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role
        token.darkMode = user.darkMode
        token.accessTokenExpires = Date.now() + 15 * 60 * 1000
        token.refreshToken = generateRefreshToken()
        token.refreshTokenExpires = Date.now() + 7 * 24 * 60 * 60 * 1000

        await prisma.session.create({
          data: {
            sessionToken: token.refreshToken,
            userId: user.id,
            expires: new Date(token.refreshTokenExpires),
          },
        })
        logger.info({ userId: user.id }, "New session created")
      }

      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token as ExtendedJWT
      }

      if (token.refreshTokenExpires && Date.now() < token.refreshTokenExpires) {
        logger.info({ userId: token.id }, "Refreshing access token")
        return refreshAccessToken(token as ExtendedJWT)
      }

      logger.warn({ userId: token.id }, "Token expired and cannot be refreshed")
      return { ...token, error: "RefreshAccessTokenError" } as ExtendedJWT
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string | null
        session.user.role = token.role as string
        session.user.darkMode = token.darkMode as boolean
      }
      return session
    },
  },
  events: {
    async signIn({ user }) {
      logger.info({ user: { id: user.id, email: user.email, role: user.role } }, "User signed in")
    },
    async signOut({ session }) {
      if (session?.user?.email) {
        logger.info({ user: { id: session.user.id, email: session.user.email, role: session.user.role } }, "User signed out")
      }
    },
  },
}

async function refreshAccessToken(token: ExtendedJWT): Promise<ExtendedJWT> {
  try {
    const existingSession = await prisma.session.findUnique({
      where: { sessionToken: token.refreshToken },
      include: { user: true },
    })

    if (!existingSession) {
      logger.error({ userId: token.id }, "Refresh token not found")
      throw new Error("Refresh token not found")
    }

    const newAccessTokenExpires = Date.now() + 15 * 60 * 1000

    await prisma.session.update({
      where: { id: existingSession.id },
      data: {
        expires: new Date(newAccessTokenExpires),
      },
    })

    logger.info({ userId: token.id }, "Access token refreshed successfully")
    return {
      ...token,
      accessTokenExpires: newAccessTokenExpires,
      error: undefined,
    }
  } catch (error) {
    logger.error({ userId: token.id, error }, "Error refreshing access token")
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

function generateRefreshToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export async function getAuthSession() {
  return await getServerSession(authOptions)
}

export async function getServerAuthSession(context: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) {
  return await getServerSession(context.req, context.res, authOptions)
}

export function isAdmin(session: any) {
  return session?.user?.role === 'ADMIN'
}
