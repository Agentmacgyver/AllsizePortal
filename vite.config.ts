import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  // Load .env variables
  const env = loadEnv(mode, process.cwd(), "VITE_");

  return {
    server: {
      host: env.VITE_HOST ?? "127.0.0.1",
      port: Number(env.VITE_PORT ?? 8080),
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(
      Boolean
    ),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
});
