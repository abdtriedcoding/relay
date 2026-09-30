# Relay

AI-powered customer support platform for SaaS teams: an embeddable chat widget, voice calling, and a knowledge base with retrieval-augmented generation (RAG), all operated from a real-time dashboard.

## Overview

Relay gives every product a support surface in minutes — drop a single script tag on any site, and visitors get an AI support agent that answers from your own documentation, hands off to a human inbox, or escalates to a voice call. A multi-tenant dashboard handles organizations, knowledge, customization, integrations, and billing.

## Key features

- **Embeddable chat widget** — floating launcher rendered in an isolated iframe, configured per organization (position, branding, greeting).
- **AI support agent** — conversational agent built on Convex Agent + OpenAI, grounded in your knowledge base via RAG.
- **Knowledge base** — upload documents (PDF, text, and more), extract and chunk content, and index it for semantic retrieval.
- **Voice calling** — browser-based voice conversations through Vapi, with per-organization credentials.
- **Real-time inbox** — live conversation list, threaded messages, contact metadata, and unread state backed by Convex subscriptions.
- **Widget customization** — live-preview editor for appearance and behavior, persisted per organization.
- **Organizations & auth** — Clerk-powered authentication with organization selection, plus webhook-driven sync into the backend.
- **Integrations & plugins** — platform integrations and a Vapi plugin, with secrets stored in AWS Secrets Manager.
- **Billing** — plan and subscription management for organizations.
- **Observability** — Sentry error tracking and source-map uploads across apps.

## Architecture

A Turborepo monorepo managed with pnpm workspaces:

```
apps/
  web/       Next.js dashboard (CMS): conversations, knowledge, customization, integrations, billing
  widget/    Next.js chat widget UI, embedded as an iframe
  embed/     Vite + TypeScript loader that mounts the floating widget button
packages/
  backend/   Convex backend: schema, queries/mutations, AI agent, RAG, Vapi, Clerk webhooks
  ui/        Shared React component library (shadcn/ui, Tailwind CSS)
  eslint-config/     Shared lint configuration
  typescript-config/ Shared TypeScript configuration
docker/      Local Postgres and Convex containers
```

Dashboard routes: `/conversations`, `/conversations/[conversationId]`, `/files`, `/customization`, `/integrations`, `/plugins/vapi`, `/billing`, plus Clerk auth routes (`/sign-in`, `/sign-up`, `/org-select`).

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui, Zustand, React Hook Form, Zod |
| Backend | Convex (real-time database, queries, mutations, HTTP actions) |
| AI | OpenAI via AI SDK, `@convex-dev/agent`, `@convex-dev/rag` |
| Auth | Clerk (organizations, webhooks via Svix) |
| Voice | Vapi |
| Secrets | AWS Secrets Manager |
| Tooling | Turborepo, pnpm, Prettier, Docker, Sentry |

## Getting started

### Prerequisites

- Node.js >= 20
- pnpm 10 (`corepack enable`)
- A Convex deployment (cloud, or the bundled Docker setup)
- Clerk application, OpenAI API key
- Optional: Vapi API key, AWS credentials (Secrets Manager), Sentry auth token

### Install

```bash
git clone https://github.com/abdtriedcoding/relay.git
cd relay
pnpm install
```

### Environment variables

Copy the provided samples and fill in your own values:

```bash
cp packages/backend/.env.sample packages/backend/.env.local
cp apps/web/.env.sample       apps/web/.env.local
cp apps/widget/.env.sample    apps/widget/.env.local
```

**`packages/backend/.env.local`**

```env
CONVEX_DEPLOYMENT=your_convex_deployment
CONVEX_URL=your_convex_url
CLERK_JWT_ISSUER_DOMAIN=your_clerk_domain
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
OPENAI_API_KEY=your_openai_api_key
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=your_aws_region
```

**`apps/web/.env.local`**

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CONVEX_URL=your_convex_url
SENTRY_AUTH_TOKEN=your_sentry_auth_token
```

**`apps/widget/.env.local`**

```env
NEXT_PUBLIC_CONVEX_URL=your_convex_url
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_api_key
```

### Run locally

```bash
pnpm dev
```

| Service | URL |
| --- | --- |
| Dashboard | http://localhost:3000 |
| Widget | http://localhost:3001 |
| Embed demo | http://localhost:3002 |
| Convex backend | http://localhost:3210 |

### Embedding the widget

```html
<script
  src="https://your-cdn.com/relay-widget.js"
  data-org-id="your_organization_id"
  data-position="bottom-right"
  defer
></script>
```

The loader exposes `window.RelayWidget` with `init`, `show`, `hide`, and `destroy`.

Build the loader bundle with:

```bash
cd apps/embed
pnpm build   # emits dist/relay-widget.iife.js
```

## Scripts

```bash
pnpm dev      # run all apps in watch mode (turbo)
pnpm build    # production build for every workspace
pnpm lint     # lint all packages
pnpm format   # prettier across the repo
```

## Docker (local infrastructure)

```bash
cd docker/postgres && docker-compose up -d   # Postgres
cd docker/convex   && docker-compose up -d   # self-hosted Convex
```

## License

No license has been declared for this repository.
