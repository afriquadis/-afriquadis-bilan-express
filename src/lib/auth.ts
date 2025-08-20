import type { AuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

function hashPassword(pw: string) {
  return crypto.createHash('sha256').update(pw).digest('hex');
}

export const authOptions: AuthOptions = {
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim();
        const password = credentials?.password || '';
        if (!email) return null;

        let user = await prisma.user.findUnique({ where: { email } });
        if (user?.passwordHash) {
          const ok = user.passwordHash === hashPassword(password);
          if (!ok) return null;
        } else if (!user) {
          user = await prisma.user.create({ data: { email, name: email.split('@')[0] || 'Patient' } });
        }
        user = await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });

        return {
          id: user.id,
          email: user.email,
          name: user.name || undefined,
          phone: (user as any).phone || undefined,
          createdAt: (user as any).createdAt,
          lastLogin: (user as any).lastLogin,
          preferences: {
            notifications: (user as any).prefNotif,
            emailUpdates: (user as any).prefEmail,
            language: ((user as any).prefLang as 'fr' | 'en') || 'fr',
            theme: 'light'
          }
        } as any;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.phone = user.phone;
        token.createdAt = user.createdAt;
        token.lastLogin = user.lastLogin;
        token.preferences = user.preferences;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token?.id) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          phone: token.phone as (string | undefined),
          createdAt: token.createdAt as any,
          lastLogin: token.lastLogin as any,
          preferences: token.preferences as any
        } as any;
      }
      return session;
    }
  },
  pages: { signIn: '/login' },
  secret: process.env.NEXTAUTH_SECRET || 'dev-secret'
};


