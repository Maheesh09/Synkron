import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Synkron | Keep Documentation in Sync With Every Code Commit" },
      { name: "description", content: "Synkron automatically updates your documentation whenever you push code. Stay synchronized, save development time, and let your team focus on building features instead of writing docs." },
      { name: "author", content: "Synkron Team" },
      { name: "keywords", content: "documentation automation, GitHub integration, code documentation, developer tools, pull request automation, technical documentation" },
      { property: "og:title", content: "Synkron | Automated Documentation for Every Code Change" },
      { property: "og:description", content: "Keep your documentation perfectly in sync with every code commit. Synkron intelligently analyzes your changes and updates docs automatically." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://synkron.dev" },
      { property: "og:site_name", content: "Synkron" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Synkron | Automated Documentation Sync" },
      { name: "twitter:description", content: "Stop writing documentation manually. Synkron keeps your docs in sync with your code automatically." },
      { name: "theme-color", content: "#14B8A6" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=JetBrains+Mono:wght@400;500&display=swap" },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/synkron.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Synkron",
            "url": "https://synkron.dev",
            "logo": "https://synkron.dev/synkron.png",
            "description": "Automatically update your documentation whenever you push code",
            "sameAs": ["https://github.com/Maheesh09/Synkron"],
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "Customer Support"
            }
          })
        }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Synkron",
            "description": "Keep your documentation in sync with every code commit. Synkron automatically updates docs when you push code.",
            "url": "https://synkron.dev",
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "author": {
              "@type": "Organization",
              "name": "Synkron Team"
            }
          })
        }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Will Synkron change my main branch?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No. Synkron always opens pull requests against a staging or documentation branch. You maintain complete control and review every update before it gets merged, just like any normal pull request."
                }
              },
              {
                "@type": "Question",
                "name": "What happens if I don't want a pull request?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Simple: just close it. Pull requests from Synkron are suggestions, not mandatory updates. You can also leave review comments and Synkron learns from your feedback to make better suggestions next time."
                }
              },
              {
                "@type": "Question",
                "name": "Is my code private and secure?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Synkron uses GitHub's API with scoped access tokens you create yourself. We only request the minimum permissions needed to read code changes and open pull requests. Your code stays in your repository."
                }
              },
              {
                "@type": "Question",
                "name": "What documentation formats work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Markdown, MDX, and plain text files in your repository are supported out of the box. Support for Confluence and Notion integration is coming soon. You can vote for additional formats in our GitHub discussions."
                }
              },
              {
                "@type": "Question",
                "name": "Will this slow down my build process?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No. Synkron works asynchronously in the background via webhooks. Your builds finish before Synkron even starts analyzing changes. Pull requests typically appear within 45 to 90 seconds of you pushing code."
                }
              }
            ]
          })
        }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
