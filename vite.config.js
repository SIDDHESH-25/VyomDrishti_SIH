import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Requests to /api/* are proxied to the backend so the browser never hits CORS.
// Change the target (or set VITE_API_BASE in .env) if the backend moves.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
