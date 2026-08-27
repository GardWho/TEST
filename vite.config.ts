import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // ✅ Générer un fichier de configuration qui sera inclus dans le build
  const configContent = `
// Ce fichier est généré automatiquement par Vite
export const config = {
  supabaseUrl: "${env.VITE_SUPABASE_URL || ''}",
  supabaseAnonKey: "${env.VITE_SUPABASE_ANON_KEY || ''}",
  stripePublishableKey: "${env.VITE_STRIPE_PUBLISHABLE_KEY || ''}",
};
`;

  // Écrire le fichier dans src/config.ts (ou .js)
  const configPath = path.resolve(process.cwd(), "src/config.ts");
  fs.writeFileSync(configPath, configContent);
  console.log(`✅ Fichier config.ts généré avec succès !`);

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
  };
});