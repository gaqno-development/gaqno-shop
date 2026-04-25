# gaqno-shop

Storefront multi-tenant (Next.js 16 App Router) para a plataforma gaqno. Consome
`gaqno-shop-service` como backend.

Um **mesmo deploy** deste projeto pode atender **vários domínios** (ex.: `fifiadoces.com.br`, outra loja em `outrodominio.com.br`). O tenant vem do **host da requisição** (`Host` / `window.location.host`): o front chama `GET /tenants/resolve` com `X-Tenant-Domain` igual a esse host. Cada domínio precisa estar cadastrado no backend como domínio da loja correspondente. No servidor, o `layout` resolve o mesmo tenant para **metadata** (título da aba, descrição, favicon, Open Graph) e hidrata o `TenantProvider`, alinhado ao nome, logo e cores da loja no header e rodapé.

### CORS no `gaqno-shop-service`

O navegador chama `https://api…/shop/v1` a partir do **origin** da loja (ex.: `https://fifiadoces.com.br`). Subdomínios `*.gaqno.com(.br)` já são aceitos pelo CORS compartilhado (`@gaqno-development/backcore`). Para apex em domínio próprio:

- Inclua cada origin em `CORS_ORIGIN` ou `ALLOWED_ORIGINS` (lista separada por vírgula), **ou**
- Defina `SHOP_CORS_ALLOW_PUBLIC_STOREFRONTS=true` no **deploy do shop-service** para permitir origins `https://` com hostname multi-segmento.
- Para produção mais restrita, combine com `SHOP_CORS_PUBLIC_STOREFRONT_ORIGINS` (lista separada por vírgula de origins explícitos e/ou padrões `*.dominio.com.br`), limitando os storefronts aceitos.

## Setup

```bash
npm install
npm run dev
```

Crie `.env.local` com as variáveis abaixo. Em desenvolvimento abra [http://localhost:3000](http://localhost:3000).

## Variáveis de ambiente

| Nome | Obrigatória | Descrição |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | sim | URL do `gaqno-shop-service` (ex: `https://api.gaqno.com.br/shop/v1`) |
| `NEXT_PUBLIC_TENANT_SLUG` | não (prod multi-domínio) | Slug fixo só quando útil (ex.: dev sem domínio customizado). Em produção com um deploy e vários apex, **omitir** e deixar só a resolução por domínio. |
| `NEXT_PUBLIC_R2_PUBLIC_URL` | não | CDN pública para imagens de produto |
| `NEXTAUTH_URL` | sim (prod) | URL canônica usada pelo NextAuth (cookies/CSRF). Com **um deploy e vários domínios de loja**, defina uma base estável (ex.: hostname principal do proxy ou primeira loja) e use `trustHost` + lista de redirects; se o callback pós-login for para outro origin, use `SHOP_OAUTH_REDIRECT_ALLOWLIST`. |
| `NEXTAUTH_SECRET` | sim | Segredo usado para assinar cookies do NextAuth. Gere com `openssl rand -base64 32` |
| `SHOP_OAUTH_REDIRECT_ALLOWLIST` | recomendado (multi-apex) | Origins permitidos para redirect após OAuth, separados por vírgula (ex.: `https://fifiadoces.com.br,https://outrodominio.com.br`). |
| `GOOGLE_CLIENT_ID` | sim (p/ login Google) | Client ID do OAuth 2.0 (Google Cloud Console) |
| `GOOGLE_CLIENT_SECRET` | sim (p/ login Google) | Client Secret do OAuth 2.0 |

### Configurando Google OAuth

1. Acesse [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials).
2. Crie um OAuth 2.0 Client ID (Web application).
3. **Authorized redirect URIs**: inclua **cada** domínio de loja que aponta para este mesmo app, no formato  
   `https://<apex-da-loja>/api/auth/callback/google`  
   além de `http://localhost:3000/api/auth/callback/google` para dev.
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
