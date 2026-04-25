import type { NextAuthOptions } from 'next-auth';

type ShopAuthOptions = NextAuthOptions & { readonly trustHost?: boolean };
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { headers } from 'next/headers';
import { API_URL } from './api';

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
  process.env.NEXTAUTH_URL = 'http://localhost:3000';
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

function parseOAuthRedirectAllowlist(): readonly string[] {
  const raw = process.env.SHOP_OAUTH_REDIRECT_ALLOWLIST?.trim();
  if (!raw) return [];
  return raw
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function safeUrlOrigin(value: string): string | undefined {
  try {
    return new URL(value).origin;
  } catch {
    return undefined;
  }
}

function buildShopAuthHeaders(tenantHost?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const slug = process.env.NEXT_PUBLIC_TENANT_SLUG?.trim();
  if (slug) {
    headers['X-Tenant-Slug'] = slug;
  }
  if (tenantHost) {
    headers['X-Tenant-Domain'] = tenantHost;
  }
  return headers;
}

async function getTenantHostFromRequestContext(): Promise<string | undefined> {
  try {
    const requestHeaders = await headers();
    const fromForwarded = requestHeaders.get('x-forwarded-host')?.split(',')[0]?.trim();
    const fromHost = requestHeaders.get('host')?.trim();
    return fromForwarded || fromHost || undefined;
  } catch {
    return undefined;
  }
}

function getHostFromAuthRequest(req: unknown): string | undefined {
  if (!req || typeof req !== 'object' || !('headers' in req)) return undefined;
  const h = (req as { headers: unknown }).headers;
  if (h && typeof h === 'object' && 'get' in h && typeof (h as Headers).get === 'function') {
    const headers = h as Headers;
    const fromForwarded = headers.get('x-forwarded-host')?.split(',')[0]?.trim();
    const fromHost = headers.get('host')?.trim();
    return fromForwarded || fromHost || undefined;
  }
  const nodeHeaders = h as Record<string, string | string[] | undefined>;
  const forwarded = nodeHeaders['x-forwarded-host'];
  const host = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  if (typeof host === 'string' && host.trim()) {
    return host.split(',')[0]!.trim();
  }
  const raw = nodeHeaders.host;
  if (typeof raw === 'string' && raw.trim()) {
    return raw.split(',')[0]!.trim();
  }
  return undefined;
}

async function exchangeGoogleTokenForSession(
  googleAccessToken: string,
  tenantHost?: string,
): Promise<BackendAuthResult | null> {
  const response = await fetch(`${API_URL}/auth/oauth/google`, {
    method: 'POST',
    headers: buildShopAuthHeaders(tenantHost),
    body: JSON.stringify({ accessToken: googleAccessToken }),
  });
  if (!response.ok) return null;
  return response.json();
}

async function loginWithCredentials(
  email: string,
  password: string,
  tenantHost?: string,
): Promise<BackendAuthResult | null> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: buildShopAuthHeaders(tenantHost),
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) return null;
  return response.json();
}

export const authOptions: ShopAuthOptions = {
  secret: authSecret,
  trustHost: true,
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
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;
        const tenantHost = getHostFromAuthRequest(req);
        try {
          const data = await loginWithCredentials(credentials.email, credentials.password, tenantHost);
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
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) {
        const origin = safeUrlOrigin(baseUrl);
        return origin ? `${origin}${url}` : baseUrl;
      }
      const targetOrigin = safeUrlOrigin(url);
      const baseOrigin = safeUrlOrigin(baseUrl);
      if (targetOrigin && baseOrigin && targetOrigin === baseOrigin) {
        return url;
      }
      const allowlist = parseOAuthRedirectAllowlist();
      if (targetOrigin && allowlist.includes(targetOrigin)) {
        return url;
      }
      return baseUrl;
    },
    async signIn({ account, user }) {
      if (account?.provider !== 'google' || !account.access_token) return true;
      const tenantHost = await getTenantHostFromRequestContext();
      const backendAuth = await exchangeGoogleTokenForSession(account.access_token, tenantHost);
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
