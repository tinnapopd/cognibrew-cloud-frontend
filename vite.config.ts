import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // Edge Gateway API
      "/api/v1": {
        target: process.env.VITE_API_URL || "http://localhost:8000",
        changeOrigin: true,
      },
      // Embedding / Inference Service
      "/api/embed": {
        target: process.env.VITE_EMBED_URL || "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
})
