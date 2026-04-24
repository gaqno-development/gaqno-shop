import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

const GOOGLE_SCOPES = ['openid', 'email', 'profile'].join(' ');

const isNextProductionBuild = process.env.NEXT_PHASE === 'phase-production-build';

const authSecret =
  process.env.NEXTAUTH_SECRET ??
  process.env.AUTH_SECRET ??
  (isNextProductionBuild ? '__next_build_placeholder__' : undefined);

if (process.env.NODE_ENV === 'production' && !authSecret) {
  throw new Error(
    'Set NEXTAUTH_SECRET or AUTH_SECRET when NODE_ENV is production (e.g. openssl rand -base64 32).',
  );
}

function ensureNextAuthUrl(): void {
  if (process.env.NEXTAUTH_URL) return;
  if (process.env.VERCEL_URL) {
    process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
    return;
  }
  if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT ?? '3000';
    process.env.NEXTAUTH_URL = `http://localhost:${port}`;
    return;
  }
  if (isNextProductionBuild) {
    process.env.NEXTAUTH_URL = 'http://localhost:3000';
    return;
  }
  throw new Error(
    'Set NEXTAUTH_URL to the public origin in production (e.g. https://shop.example.com).',
  );
}

ensureNextAuthUrl();

interface BackendCustomer {
  readonly id: string;
  readonly email: string;
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly avatarUrl?: string | null;
}

interface BackendAuthResult {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly customer: BackendCustomer;
}

function buildFullName(customer: BackendCustomer): string {
  return [customer.firstName, customer.lastName].filter(Boolean).join(' ').trim() || customer.email;
}

async function exchangeGoogleTokenForSession(
  googleAccessToken: string,
): Promise<BackendAuthResult | null> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/oauth/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Tenant-Slug': process.env.NEXT_PUBLIC_TENANT_SLUG || 'default',
    },
    body: JSON.stringify({ accessToken: googleAccessToken }),
  });
  if (!response.ok) return null;
  return response.json();
}

async function loginWithCredentials(
  email: string,
  password: string,
): Promise<BackendAuthResult | null> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Tenant-Slug': process.env.NEXT_PUBLIC_TENANT_SLUG || 'default',
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) return null;
  return response.json();
}

export const authOptions: NextAuthOptions = {
  secret: authSecret,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: { params: { scope: GOOGLE_SCOPES } },
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const data = await loginWithCredentials(credentials.email, credentials.password);
          if (!data) return null;
          return {
            id: data.customer.id,
            email: data.customer.email,
            name: buildFullName(data.customer),
            image: data.customer.avatarUrl ?? null,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, user }) {
      if (account?.provider !== 'google' || !account.access_token) return true;
      const backendAuth = await exchangeGoogleTokenForSession(account.access_token);
      if (!backendAuth) return false;
      (user as { accessToken?: string }).accessToken = backendAuth.accessToken;
      (user as { refreshToken?: string }).refreshToken = backendAuth.refreshToken;
      user.id = backendAuth.customer.id;
      user.email = backendAuth.customer.email;
      user.name = buildFullName(backendAuth.customer);
      if (backendAuth.customer.avatarUrl) {
        user.image = backendAuth.customer.avatarUrl;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.user.id = token.id as string;
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,
  },
};
