# Synkron Frontend

This repository is the frontend for Synkron, a server side rendered web app that serves both the public marketing site and the authenticated dashboard where developers install the Synkron GitHub App and watch the documentation pipeline work across their repositories.

## What Is in Here

The frontend has two surfaces that share one codebase.

**The landing page** (`/`) explains what Synkron does, shows an animated mockup of the pipeline, and invites developers to sign in. It is public, with no authentication required.

**The dashboard** (`/app`) is the working interface. After signing in with GitHub, a developer can install the Synkron GitHub App on their repositories, watch pipeline runs come in, see which commits triggered a documentation update, and open the pull requests Synkron created. Everything is scoped to you, so you only see your own repositories.

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
| Authentication | Firebase Authentication (GitHub sign-in) |
| Data fetching | TanStack Query |
| Build and hosting | Vercel via Nitro |

## Prerequisites

* Node.js 20 or newer, and npm
* The Synkron backend running locally or deployed, since you need its URL for `VITE_API_URL`
* A Firebase project with GitHub enabled as a sign-in provider
* A GitHub OAuth App whose client ID and secret are wired into that Firebase provider, which is what brokers "Sign in with GitHub"

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

The app is available at the printed local URL, `http://localhost:3000` by default.

**5. Set up Firebase**

Open `src/lib/firebase.ts` and replace the `firebaseConfig` object with the values from your own Firebase project (Project settings, General, Your apps, SDK setup and configuration, Config).

In the Firebase console under Authentication, enable **GitHub** as a sign-in provider and paste in the client ID and secret from your GitHub OAuth App. Add `localhost` to the list of authorised domains so sign-in works during development.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Base URL of the Synkron backend, with no trailing slash. Example: `https://your-backend.run.app` |

The Firebase configuration lives directly in `src/lib/firebase.ts`. Firebase web API keys are public by design and safe to commit. If you restrict the key with HTTP referrer rules in the Google Cloud Console, remember to add every domain you deploy to, or sign-in will fail with a 403.

## Deploying to Vercel

The app builds through Nitro, which Vercel detects automatically, so there is no build command or output directory to configure.

**1. Import the repository into Vercel** and let it detect the framework.

**2. Set the environment variable.** Add `VITE_API_URL` in the Vercel project settings, pointing at your deployed backend. It is baked into the client bundle at build time, so set it before the first build.

**3. Authorise the Vercel domain in Firebase and Google Cloud.** Two allowlists matter, and sign-in fails without both.

* Firebase console, Authentication, Settings, Authorised domains. Add your `vercel.app` domain, otherwise you get `auth/unauthorized-domain`.
* If your Firebase API key has HTTP referrer restrictions in the Google Cloud Console, add the same domain there too, otherwise the sign-in call returns a 403 from `identitytoolkit`.

Every push to your main branch then ships a fresh deploy.

## Project Layout

```
src/
  routes/
    index.tsx              Landing page (/)
    app.tsx                Dashboard (/app), wrapped in AuthGate
    __root.tsx             Root layout and global providers
  components/
    synkron/               Application-specific components
      Hero.tsx             Landing page hero
      HowItWorks.tsx       Animated pipeline walkthrough
      DashboardPreview.tsx Dashboard preview on the landing page
      BentoFeatures.tsx    Feature grid
      AgentPipeline.tsx    Live agent pipeline visualisation
      ConnectRepository.tsx  "Install on GitHub" onboarding screen
      AuthGate.tsx         Wraps the dashboard, prompts unsigned users to sign in
      Navbar.tsx           Top navigation
      Footer.tsx           Footer
      FAQ.tsx              Frequently asked questions
      ...                  Additional landing page sections
    ui/                    Radix based component primitives (shadcn)
  lib/
    api.ts                 Typed API client, attaches the Firebase ID token to every request
    firebase.ts            Firebase initialisation (lazy, SSR safe) with the GitHub provider
    utils.ts               Shared utilities
  hooks/                   Responsive and interaction hooks
  styles.css               Global styles (Tailwind entry point)
vite.config.ts             Vite config (TanStack Start, Nitro, Tailwind)
```

## Authentication Flow

Sign-in uses Firebase Authentication with GitHub as the provider.

1. The user clicks Sign in on the landing page, or is redirected from `/app`.
2. `AuthGate` checks for a current Firebase user. If none exists, it shows the sign-in prompt.
3. After a successful GitHub sign-in, Firebase issues an ID token that carries the user's GitHub identity.
4. Every API call attaches this token as a `Bearer` header via `authHeaders()` in `api.ts`.
5. The backend verifies the token and scopes all data to that GitHub account, so a user only ever sees the repositories their installation covers.

## Related

* [synkron-backend](https://github.com/Maheesh09/synkron-backend), the FastAPI backend, the GitHub App, and the four agent documentation pipeline on Gemini
* [TanStack Start](https://tanstack.com/start/latest), the SSR framework
* [Nitro](https://nitro.build), the server toolkit that builds the app for Vercel

## License

MIT, see [LICENSE](LICENSE).
