import { createRequire } from "node:module";
import { defineNitroConfig } from "nitropack/config";

const nitroPkg = createRequire(import.meta.url)("nitropack/package.json");

export default defineNitroConfig({
  compatibilityDate: "latest",
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
    deployConfig: true,
    wrangler: {
      upload_source_maps: true,
    },
  },
  vercel: {
    functions: {
      shouldAddSourceMapSupport: true,
      // environment: {
      //   NODE_OPTIONS: "--enable-source-maps",
      // },
    },
  },
});
