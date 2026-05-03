import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// User-site (antonio-tresol.github.io) deploys at the root of the domain,
// so the base path is "/".
export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    port: 4003,
  },
});
