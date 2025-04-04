import { createRequire } from "node:module";
import { defineNitroConfig } from "nitropack/config";

const nitroPkg = createRequire(import.meta.url)("nitropack/package.json");

console.log(`🫣 ${process.env.CLOUDFLARE_API_TOKEN?.length}`);

export default defineNitroConfig({
  compatibilityDate: "2025-03-01",
  srcDir: "./server",
  baseURL: "/base/",
  runtimeConfig: {
    nitroVersion: nitroPkg.version,
  },
  publicAssets: [
    {
      baseURL: "/_dist",
      dir: "./public/_dist",
      maxAge: 60 * 60 * 24 * 365,
    },
  ],
  cloudflare: {
    nodeCompat: true,
    deployConfig: true,
    wrangler: {
      vars: {
        TEST: "works",
      },
    },
  },
});
