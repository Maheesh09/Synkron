import { defineConfig, loadEnv } from "vite";
import viteReact from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig(async ({ command, mode }) => {
  const plugins = [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      server: { entry: "server" },
      importProtection: {
        behavior: "error",
        client: {
          files: ["**/server/**"],
          specifiers: ["server-only"],
        },
      },
    }),
    viteReact(),
  ];

  // Cloudflare plugin removed builds a Node SSR server output

  // Load environment variables starting with VITE_
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const envDefine: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    envDefine[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  return {
    define: envDefine,
    build: {
      rollupOptions: {
        output: {
          // Give CSS a STABLE name (no content hash). The SSR server bundle and
          // the emitted file then always agree on "/assets/styles.css", so a
          // stale-vs-fresh build mismatch can never 404 the stylesheet again.
          assetFileNames: (info: any) => {
            const name = (info.names && info.names[0]) || info.name || "";
            if (name.endsWith(".css")) return "assets/styles.css";
            return "assets/[name]-[hash][extname]";
          },
        },
      },
    },
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