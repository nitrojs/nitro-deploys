import { defineConfig } from "nitro";

export default defineConfig({
  serverDir: "./server",
  baseURL: "/base",
  publicAssets: [{ baseURL: "/_dist", dir: "./public/_dist", maxAge: 60 * 60 * 24 * 365 }],
  routeRules: {
    "/tests/headers": {
      headers: {
        "x-nitro-test": "hello",
        "x-nitro.test-2": "dotted",
        "x-nitro-spaced": "hello world from nitro",
        "x-nitro-long": "a".repeat(1024),
        "x-nitro-special": "a!#$%&'*+-.^_`|~b",
        "x-nitro-num": "42",
      },
    },
    "/redirect-source": {
      redirect: "/base/redirect-target",
    },
    "/basic-auth-protected": {
      basicAuth: { username: "admin", password: "nitrorunseverywhere" },
    },
  },
});
