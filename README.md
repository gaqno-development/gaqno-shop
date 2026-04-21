# gaqno-shop

Storefront multi-tenant (Next.js 16 App Router) para a plataforma gaqno. Consome
`gaqno-shop-service` como backend.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Variáveis de ambiente

| Nome | Obrigatória | Descrição |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | sim | URL do `gaqno-shop-service` (ex: `https://api.gaqno.com.br/shop/v1`) |
| `NEXT_PUBLIC_TENANT_SLUG` | sim | Slug do tenant padrão para ambiente local |
| `NEXT_PUBLIC_R2_PUBLIC_URL` | não | CDN pública para imagens de produto |
| `NEXTAUTH_URL` | sim | URL pública do app (NextAuth). Ex: `http://localhost:3000` ou `https://shop.gaqno.com.br` |
| `NEXTAUTH_SECRET` | sim | Segredo usado para assinar cookies do NextAuth. Gere com `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | sim (p/ login Google) | Client ID do OAuth 2.0 (Google Cloud Console) |
| `GOOGLE_CLIENT_SECRET` | sim (p/ login Google) | Client Secret do OAuth 2.0 |

### Configurando Google OAuth

1. Acesse [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials).
2. Crie um OAuth 2.0 Client ID (Web application).
3. **Authorized redirect URIs**: adicione
   `https://shop.gaqno.com.br/api/auth/callback/google`
   (e `http://localhost:3000/api/auth/callback/google` para dev).
4. Copie Client ID e Secret para as envs.

O fluxo:

1. Usuário clica "Continuar com Google" → NextAuth inicia OAuth.
2. Após callback, o `signIn` callback pega o `access_token` do Google e envia
   para `POST /auth/oauth/google` do `gaqno-shop-service`.
3. Backend valida o token via Google UserInfo, faz upsert do `customer` (link
   se email já existir), registra em `customer_oauth_accounts` e emite JWT
   próprio.
4. Tokens do backend ficam na sessão do NextAuth para chamadas autenticadas.

## Scripts

- `npm run dev` — dev server
- `npm run build` — produção
- `npm test` — Vitest
- `npm run lint` — ESLint
