import { defineConfig } from "nitro";

export default defineConfig({
  serverDir: "./server",
  baseURL: "/base",
  features: {
    websocket: true,
  },
  publicAssets: [{ baseURL: "/_dist", dir: "./public/_dist", maxAge: 60 * 60 * 24 * 365 }],
});
