# CodeDive

CodeDive is an AI-assisted code review platform for GitHub repositories. Connect a repository, let CodeDive index its source code, and request reviews for pull requests. Reviews combine the pull request diff with relevant repository context, then post the generated analysis back to GitHub and save it in the CodeDive dashboard.

## What It Does

- Sign in with GitHub and use the repository access granted through OAuth.
- Connect GitHub repositories and index their files for semantic retrieval.
- Review pull requests on demand or when configured GitHub webhook events occur.
- Generate structured reviews with a Groq-hosted language model, including a walkthrough, summary, strengths, issues, suggestions, and an optional Mermaid sequence diagram.
- Post completed reviews as pull request comments and retain them in PostgreSQL.
- View repository, commit, pull request, review, and contribution activity from the dashboard.
- Manage Free and Pro usage limits through Polar subscriptions.

## Stack

- [Next.js](https://nextjs.org/) 16 with the App Router and React 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4 and shared UI components
- [Better Auth](https://www.better-auth.com/) with GitHub OAuth
- [Prisma](https://www.prisma.io/) 7 and PostgreSQL
- [Inngest](https://www.inngest.com/) for repository indexing and asynchronous reviews
- [Pinecone](https://www.pinecone.io/) for vector search over repository context
- [Vercel AI SDK](https://sdk.vercel.ai/) and Groq for review generation
- [Octokit](https://github.com/octokit/octokit.js) for GitHub API access
- [Polar](https://polar.sh/) for checkout, customer portal, and subscription state

## Requirements

- [Bun](https://bun.sh/) 1.4 or newer (the repository declares `bun@1.4.2`)
- Node.js compatible with the installed Next.js and Bun toolchain
- A PostgreSQL database
- A GitHub OAuth app with repository access
- A Pinecone account and an index named `CodeDive`
- A Google AI API key for `gemini-embedding-001` embeddings
- A Groq API key for generated reviews
- An Inngest account for deployed background jobs, or the Inngest Dev Server locally
- A Polar sandbox account when testing subscriptions

## Local Setup

### 1. Install dependencies

```bash
bun install
```

### 2. Configure environment variables

Create a `.env` file in the project root. Do not commit it or paste real credentials into documentation.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"

BETTER_AUTH_SECRET="replace-with-a-long-random-secret"
BETTER_AUTH_URL="http://localhost:3000"

GITHUB_CLIENT_ID="your-github-oauth-client-id"
GITHUB_CLIENT_SECRET="your-github-oauth-client-secret"

GOOGLE_GENERATIVE_AI_API_KEY="your-google-ai-api-key"
GROQ_API_KEY="your-groq-api-key"
PINECONE_DB_API_KEY="your-pinecone-api-key"

POLAR_ACCESS_TOKEN="your-polar-access-token"
POLAR_SUCCESS_URL="http://localhost:3000/dashboard/subscription?success=true"
POLAR_WEBHOOK_SECRET="your-polar-webhook-secret"

# Public URL used when CodeDive creates GitHub webhooks.
NEXT_PUBLIC_APP_BASE_URL="https://your-public-host.example.com"

# Set this when using the local Inngest development server.
INNGEST_DEV="1"
```

The application currently uses the Pinecone index `CodeDive`. Create that index before connecting a repository. The embedding code requests 1024-dimensional vectors, so the index must use the matching dimension and a compatible metric.

### 3. Configure GitHub OAuth

Create an OAuth App in GitHub and set its callback URL to the Better Auth GitHub callback for the local app:

```text
http://localhost:3000/api/auth/callback/github
```

CodeDive requests the `repo` scope because it reads repository files, reads pull request diffs, creates repository webhooks, and posts review comments. Use a separate OAuth app and credentials for production.

### 4. Prepare the database

Generate the Prisma client and apply the existing migrations:

```bash
bunx prisma generate
bunx prisma migrate deploy
```

For local schema development, create a migration instead of editing a deployed database directly:

```bash
bunx prisma migrate dev --name describe-your-change
```

You can inspect the database with:

```bash
bunx prisma studio
```

### 5. Start the application

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000). Unauthenticated visitors are sent to the GitHub sign-in page; authenticated users are sent to `/dashboard`.

### 6. Run Inngest locally

The application exposes its Inngest functions at `/api/inngest`. In a second terminal, start the local Inngest Dev Server and point it at the running application:

```bash
bunx inngest-cli dev -u http://localhost:3000/api/inngest
```

Keep both the Next.js server and Inngest Dev Server running while testing repository indexing or pull request reviews. Without an active Inngest worker, review requests remain queued and will not complete.

## Application Flow

1. A user signs in with GitHub.
2. The user connects a repository from the dashboard.
3. CodeDive stores the repository and emits `repository.connected`.
4. The `index-repo` Inngest function fetches repository files and writes embeddings and metadata to Pinecone.
5. A review request emits `pr.review.requested`.
6. The `generate-review` function fetches the pull request diff, retrieves relevant repository context, generates the review with Groq, posts it to GitHub, and saves it in PostgreSQL.
7. GitHub `pull_request` webhooks can trigger reviews for opened, reopened, and synchronized pull requests.

Free accounts can connect up to five repositories and create up to five reviews per repository. Pro accounts are unlimited according to the subscription logic in `module/payment/lib/subscription.ts`.

## Important Routes

| Route | Purpose |
| --- | --- |
| `/login` | GitHub sign-in |
| `/dashboard` | Activity overview and contribution data |
| `/dashboard/repository` | Connected repository management |
| `/dashboard/reviews` | Saved AI reviews |
| `/dashboard/subscription` | Free and Pro plan status and billing actions |
| `/api/auth/[...all]` | Better Auth API handler |
| `/api/inngest` | Inngest function handler |
| `/api/webhooks/github` | GitHub repository webhook receiver |
| `/api/auth/polar/webhooks` | Polar subscription webhook receiver |

Route availability follows the current App Router directory structure. See `app/` for the authoritative list.

## Project Structure

```text
app/                  Next.js routes, pages, and API handlers
components/           Shared UI components and providers
hooks/                Shared React hooks
inngest/              Background job client and functions
lib/                  Database, auth, AI/vector, and shared utilities
module/auth/          GitHub authentication UI and helpers
module/ai/            Embeddings, retrieval, and review actions
module/github/        GitHub API helpers and repository operations
module/payment/       Polar billing and usage-limit logic
prisma/               PostgreSQL schema and migrations
public/               Static assets
```

## Scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Start the Next.js development server |
| `bun run lint` | Run ESLint |
| `bun run build` | Create a production build |
| `bun run start` | Serve the production build |
| `bunx prisma generate` | Generate the Prisma client |
| `bunx prisma migrate deploy` | Apply committed migrations |
| `bunx prisma migrate dev` | Create and apply a development migration |
| `bunx prisma studio` | Open Prisma Studio |

## Webhooks and Public URLs

GitHub must be able to reach `/api/webhooks/github` for automatic reviews. During local development, expose port 3000 with a tunnel and set `NEXT_PUBLIC_APP_BASE_URL` to the resulting HTTPS URL before connecting a repository. The configured public URL is stored in each GitHub repository webhook, so reconnect or recreate a webhook after changing it.

Polar must send subscription events to:

```text
https://your-public-host.example.com/api/auth/polar/webhooks
```

Configure the Polar webhook signing secret as `POLAR_WEBHOOK_SECRET`. Never expose any server-only token or signing secret through a `NEXT_PUBLIC_*` variable.

## Validation

Before opening a pull request, run:

```bash
bun run lint
bun run build
```

For an end-to-end check, sign in with a test GitHub account, connect a test repository, confirm an `index-repo` run completes in Inngest, and request a pull request review. Verify the generated comment on GitHub and the saved review in the dashboard.

## Security Notes

- Treat `.env` as private. Rotate any credential that has been accidentally exposed.
- Use least-privilege GitHub credentials and isolated test repositories for development.
- Keep `DATABASE_URL`, OAuth secrets, AI keys, Pinecone keys, Polar tokens, and webhook secrets server-side.
- Validate webhook signatures before processing events. The Polar endpoint already validates its signed event payload; preserve that behavior when changing webhook code.

