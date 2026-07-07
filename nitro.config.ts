import { defineConfig } from "nitro";

export default defineConfig({
  serverDir: "./server",
  baseURL: "/base",
  features: {
    websocket: true,
  },
  handlers: [
    // RFC 10008 (HTTP QUERY method): https://datatracker.ietf.org/doc/rfc10008/
    // File-based routing has no `.query` method suffix, so the handler is
    // registered manually here with an explicit method. GET serves the test
    // page; QUERY runs the actual RFC 10008 request.
    { route: "/tests/query", method: "GET", handler: "./server/handlers/query.ts" },
    { route: "/tests/query", method: "QUERY" as any, handler: "./server/handlers/query.ts" },
  ],
  publicAssets: [{ baseURL: "/_dist", dir: "./public/_dist", maxAge: 60 * 60 * 24 * 365 }],
});
