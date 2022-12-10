import NextAuth, { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import TwitterProvider from 'next-auth/providers/twitter'
import prisma from 'utils/prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_ID || '',
      clientSecret: process.env.TWITTER_SECRET || '',
      version: "2.0"
    })
  ],
  session: {
    strategy: 'database',
    maxAge: 60 * 60 * 24,
    updateAge: 60 * 60
  },
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id
      return session
    }
  },
}

export default NextAuth(authOptions)