import { defineConfig, loadEnv } from "vite";
import viteReact from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import path from "path";
import { nitro } from "nitro/vite";
import { securityHeaders } from "./security-headers";

export default defineConfig(async ({ command, mode }) => {
  // Load environment variables starting with VITE_
  const env = loadEnv(mode, process.cwd(), "VITE_");

  const plugins = [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      importProtection: {
        behavior: "error",
        client: {
          files: ["**/server/**"],
          specifiers: ["server-only"],
        },
      },
    }),
    nitro({
      vercel: {
        config: {
          version: 3,
          // Security headers for every response Vercel serves, including static
          // files from the CDN. `continue: true` is essential: without it, Vercel
          // stops routing at this rule and SSR pages would never reach the server.
          // (Nitro's own routeRules -> Vercel output omits `continue`, so we
          // don't use routeRules for this.)
          routes: [{ src: "/(.*)", headers: securityHeaders(env.VITE_API_URL), continue: true }],
        },
      },
    }),
    viteReact(),
  ];

  // Cloudflare plugin removed builds a Node SSR server output

  const envDefine: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    envDefine[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  return {
    define: envDefine,
    resolve: {
      alias: {
        "@": path.resolve(process.cwd(), "./src"),
      },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    plugins,
    server: {
      host: "::",
      port: 3000,
    },
  };
});