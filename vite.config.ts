import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    fresh(),
    tailwindcss(),
  ],
  // The MCP SDK is a large Node-oriented dependency graph. Let the runtime load
  // it natively instead of routing it through Vite's dev SSR transform, which
  // otherwise fails to evaluate it (the production build bundles it fine).
  ssr: {
    external: ["@modelcontextprotocol/server", "zod"],
  },
});
