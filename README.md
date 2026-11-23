# Relay

AI-powered customer support platform for SaaS teams: an embeddable chat widget, voice calling, and a knowledge base with retrieval-augmented generation (RAG), all operated from a real-time dashboard.

## Overview

Relay gives every product a support surface in minutes — drop a single script tag on any site, and visitors get an AI support agent that answers from your own documentation, hands off to a human inbox, or escalates to a voice call. A multi-tenant dashboard handles organizations, knowledge, customization, integrations, and billing.

## Key features

- **Embeddable chat widget** — floating launcher rendered in an isolated iframe, configured per organization (position, branding, greeting).
- **AI support agent** — conversational agent built on Convex Agent + Cohere, grounded in your knowledge base via RAG.
- **Knowledge base** — upload documents (PDF, text, and more), extract and chunk content, and index it for semantic retrieval.
- **Voice calling** — browser-based voice conversations through Vapi, with per-organization credentials.
- **Real-time inbox** — live conversation list, threaded messages, contact metadata, and unread state backed by Convex subscriptions.
- **Widget customization** — live-preview editor for appearance and behavior, persisted per organization.
- **Organizations & auth** — Clerk-powered authentication with organization selection, plus webhook-driven sync into the backend.
- **Integrations & plugins** — platform integrations and a Vapi plugin, with secrets stored in AWS Secrets Manager.
- **Billing** — plan and subscription management for organizations.
- **Observability** — Sentry error tracking and source-map uploads across apps.

## Screenshots

Every screen from the current Relay interface, captured with Playwright from the running monorepo. The dashboard, customer chat widget, and embed loader are all covered here.

### Web dashboard

| Sign in | Workspace home |
| :---: | :---: |
| ![Sign in](screenshots/gallery/01-sign-in.png) | ![Workspace home](screenshots/gallery/02-home-light.png) |

| Conversations | Conversation thread |
| :---: | :---: |
| ![Operator inbox](screenshots/gallery/03-conversations.png) | ![Conversation thread with an operator reply](screenshots/gallery/04-conversation-detail.png) |

| Knowledge base | Widget customization |
| :---: | :---: |
| ![Knowledge base](screenshots/gallery/05-files.png) | ![Widget customization](screenshots/gallery/06-customization.png) |

| Integrations | Embed snippet dialog |
| :---: | :---: |
| ![Integrations](screenshots/gallery/07-integrations.png) | ![Embed snippet dialog](screenshots/gallery/08-embed-dialog.png) |

| Voice assistant | Plans and billing |
| :---: | :---: |
| ![Voice assistant](screenshots/gallery/09-voice-assistant.png) | ![Plans and billing](screenshots/gallery/10-billing.png) |

| Workspace home in dark theme | |
| :---: | :---: |
| ![Workspace home in dark theme](screenshots/gallery/11-home-dark.png) | |

### Chat widget

| Visitor details | Contact options |
| :---: | :---: |
| ![Visitor details](screenshots/gallery/12-widget-auth.png) | ![Contact options](screenshots/gallery/13-widget-selection.png) |

| Visitor chat with AI replies | Visitor inbox |
| :---: | :---: |
| ![Visitor chat with two AI replies](screenshots/gallery/14-widget-chat.png) | ![Visitor inbox](screenshots/gallery/15-widget-inbox.png) |

| Invalid organization error | |
| :---: | :---: |
| ![Error state](screenshots/gallery/16-widget-error.png) | |

### Embed loader

| Demo page | Widget open in launcher |
| :---: | :---: |
| ![Embed demo page](screenshots/gallery/17-embed-demo.png) | ![Widget open in the launcher](screenshots/gallery/18-embed-open.png) |

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
| AI | Cohere via AI SDK, `@convex-dev/agent`, `@convex-dev/rag` |
| Auth | Clerk (organizations, webhooks via Svix) |
| Voice | Vapi |
| Secrets | AWS Secrets Manager |
| Tooling | Turborepo, pnpm, Prettier, Docker, Sentry |

## Getting started

### Prerequisites

- Node.js >= 20
- pnpm 10 (`corepack enable`)
- A Convex deployment (cloud, or the bundled Docker setup)
- Clerk application, Cohere trial key (no card needed)
- Optional: Vapi API key, AWS credentials (Secrets Manager), Sentry auth token

### Install

```bash
git clone https://github.com/abdtriedcoding/relay.git
cd relay
pnpm install
```

### Free demo setup

Cohere's trial key is the only AI key this project needs. Create an account at dashboard.cohere.com/api-keys and create a trial key. It needs no card and allows 1,000 API calls a month.

Put the key in `packages/backend/.env.local`, then run `pnpm check:ai`. The script calls chat and embeddings and prints the embedding dimension. It exits with an error until the key is filled in.

Convex and Clerk both have free tiers. Leave Vapi and AWS Secrets Manager unset for a chat and knowledge base demo.

Trial keys are for evaluation, not commercial use. The chat model is `command-a-03-2025`. The embedding model is `embed-v4.0`, which returns 1536 dimensions.

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
COHERE_API_KEY=your_cohere_api_key
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

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
