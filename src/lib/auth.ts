import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import bcrypt from 'bcryptjs';
import connectDB from './db';
import User from '@/models/User';
import type { Role } from '@/types';

export const authOptions: NextAuthOptions = {
  session: { 
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            const error = 'Email and password are required';
            console.error('[AUTH] Credentials missing:', error);
            throw new Error(error);
          }

          await connectDB();

          const user = await User.findOne({
            email: credentials.email.toLowerCase(),
          }).select('+password');

          if (!user) {
            console.error('[AUTH] Login failed: user not found');
            throw new Error('No account found with this email');
          }

          if (!user.password) {
            console.error('[AUTH] Login failed: no password set');
            throw new Error('Your account does not have a password set. Please contact an administrator.');
          }

          if (!user.isActive) {
            console.error('[AUTH] Login failed: account deactivated');
            throw new Error('Your account has been deactivated');
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            console.error('[AUTH] Login failed: password mismatch');
            throw new Error('Invalid email or password');
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
            isActive: user.isActive,
          };
        } catch (err: any) {
          console.error('[AUTH] Authorize error:', err.message);
          throw err;
        }
      },
    }),
  ],
  callbacks: {
    async signIn() {
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isActive = user.isActive;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.isActive = token.isActive as boolean;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
