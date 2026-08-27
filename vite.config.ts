import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // ✅ DIAGNOSTIC : affiche ce que Vite a chargé
  console.log("🔍 Mode:", mode);
  console.log("🔍 VITE_SUPABASE_URL:", env.VITE_SUPABASE_URL);
  console.log("🔍 VITE_SUPABASE_ANON_KEY:", env.VITE_SUPABASE_ANON_KEY);
  console.log("🔍 process.cwd():", process.cwd());

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:3000",
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: "dist",
    },
    define: {
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(env.VITE_SUPABASE_URL),
      "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
      "import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY": JSON.stringify(env.VITE_STRIPE_PUBLISHABLE_KEY),
    },
  };
});