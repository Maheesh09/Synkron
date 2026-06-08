# Synkron — Frontend

> Push code. Merge docs.

This repository is the frontend for Synkron: a server-side rendered web application that serves both the public marketing site and the authenticated dashboard where developers connect their GitLab repositories and watch the documentation pipeline in action.

Built for the [Google Cloud Rapid Agent Hackathon](https://rapid-agent.devpost.com) — GitLab track.

The backend service lives at [Maheesh09/synkron-backend](https://github.com/Maheesh09/synkron-backend).

---

## What Is in Here

The frontend has two distinct surfaces that share the same codebase:

**The landing page** (`/`) explains what Synkron does, shows an animated live mockup of the pipeline, and invites developers to sign in. It is publicly accessible with no authentication required.

**The dashboard** (`/app`) is the working interface. After signing in with Google, a developer can connect a GitLab repository, see incoming pipeline runs in real time, inspect which commits triggered a documentation update, and review the merge requests Synkron opened. Access is scoped per user: you only see the repositories you connected.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | TanStack Start (SSR) |
| Language | TypeScript |
| UI library | React 19 |
| Styling | Tailwind CSS v4 |
| Component primitives | Radix UI |
| Animations | Framer Motion |
| 3D scene | Three.js via React Three Fiber |
| Authentication | Firebase Authentication (Google sign-in) |
| Data fetching | TanStack Query |
| Hosting | Google Cloud Run (Node.js SSR) |

---

## Prerequisites

* Node.js 20 or newer
* npm
* The Synkron backend running locally or deployed — you will need its URL for `VITE_API_URL`
* A Firebase project with Google sign-in enabled

---

## Local Development

**1. Clone the repository**

```bash
git clone https://github.com/Maheesh09/Synkron.git
cd Synkron
```

**2. Install dependencies**

```bash
npm install
```

**3. Create your environment file**

```bash
cp .env.example .env.local
```

Set `VITE_API_URL` to the base URL of your running backend (see Environment Variables below).

**4. Start the development server**

```bash
npm run dev
```

The app is available at `http://localhost:3000` by default.

**5. Set up Firebase**

Open `src/lib/firebase.ts` and replace the `firebaseConfig` object with the values from your own Firebase project:

```
Project settings → General → Your apps → SDK setup and configuration → Config
```

In the Firebase console, enable Google as a sign-in provider under Authentication, then add `localhost` to the list of authorised domains.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Base URL of the Synkron backend, without a trailing slash. Example: `https://your-backend.run.app` |

The Firebase configuration lives directly in `src/lib/firebase.ts`. Firebase web API keys are public by design and safe to commit. If you want to restrict which domains can use your key, add HTTP referrer restrictions in the Google Cloud Console under APIs and Services.

---

## Deploying to Cloud Run

The app builds to a standard Node.js SSR bundle served by `server-node.mjs`. No Cloudflare or edge runtime required.

**1. Set the backend URL for production**

Create a `.env.production` file at the project root:

```
VITE_API_URL=https://your-backend-url.run.app
```

This value is baked into the client bundle at build time.

**2. Add your production domain to Firebase**

In the Firebase console, go to Authentication → Settings → Authorised domains and add your Cloud Run service URL. Without this step, Google sign-in will fail with an `auth/unauthorized-domain` error.

**3. Deploy**

```bash
gcloud run deploy synkron-frontend \
  --source . \
  --region YOUR_REGION \
  --allow-unauthenticated
```

Cloud Build runs the Docker build in the cloud. The Dockerfile installs dependencies, runs `npm run build` to produce the SSR bundle, and starts the Node.js server. The service scales to zero between requests.

---

## Project Layout

```
src/
  routes/
    index.tsx              Landing page (/)
    app.tsx                Dashboard (/app) — wrapped in AuthGate
    __root.tsx             Root layout and global providers
  components/
    synkron/               Application-specific components
      Hero.tsx             Landing page hero section
      HowItWorks.tsx       Animated pipeline walkthrough
      DashboardPreview.tsx  Preview of the dashboard on the landing page
      BentoFeatures.tsx    Feature grid
      AgentPipeline.tsx    Live agent pipeline visualisation
      ConnectRepository.tsx  Repository connection form (dashboard)
      AuthGate.tsx         Wraps the dashboard; redirects unsigned users to sign in
      Navbar.tsx           Top navigation
      Footer.tsx           Footer
      FAQ.tsx              Frequently asked questions
      ...                  Additional landing page sections
    ui/                    Radix UI based component primitives (shadcn)
  lib/
    api.ts                 Typed API client — attaches Firebase ID token to every request
    firebase.ts            Firebase initialisation (lazy, SSR-safe)
    utils.ts               Shared utilities
  hooks/
    use-mobile.tsx         Responsive breakpoint hook
    useMouseTilt.ts        Mouse tilt effect for cards
  styles.css               Global styles (Tailwind entry point)
server-node.mjs            Node.js SSR request handler and static file server
vite.config.ts             Vite configuration (TanStack Start, Tailwind, stable CSS naming)
Dockerfile                 Multistage Docker build for Cloud Run
```

---

## Authentication Flow

Sign-in uses Firebase Authentication with Google as the provider.

1. The user clicks Sign in on the landing page or is redirected from `/app`.
2. `AuthGate` checks for a current Firebase user. If none exists, it renders the sign-in prompt.
3. After a successful Google sign-in, Firebase issues an ID token.
4. Every API call to the backend attaches this token as a `Bearer` header via `authHeaders()` in `api.ts`.
5. The backend verifies the token against Firebase and scopes all data to the authenticated user.

---

## Cache Strategy

The server sets response headers to ensure browsers and proxies never serve stale content:

* HTML responses: `no-cache, no-store, must-revalidate` — always re-fetched.
* CSS (`/assets/styles.css`): `no-cache, must-revalidate` — always revalidated. The filename is stable across builds to prevent server and client bundle mismatches.
* Hashed JS assets (`/assets/*.js`): `public, max-age=31536000, immutable` — cached permanently, since the hash changes whenever the content changes.

---

## Related

* [synkron-backend](https://github.com/Maheesh09/synkron-backend) — FastAPI backend, ADK agent, and GitLab MCP integration
* [Google ADK](https://github.com/google/adk-python) — Agent Development Kit used to build the documentation agent
* [@zereight/mcp-gitlab](https://www.npmjs.com/package/@zereight/mcp-gitlab) — GitLab MCP server that gives the agent its GitLab superpowers
* [TanStack Start](https://tanstack.com/start/latest) — SSR framework

---

## License

MIT — see [LICENSE](LICENSE).
