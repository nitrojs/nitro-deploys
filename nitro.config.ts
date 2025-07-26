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
  },
  // Experiment: runtime sourcemap support
  unenv: {
    polyfill: ["unenv/polyfill/source-maps"],
  },
  esbuild: {
    options: {
      sourcesContent: true,
    },
  },
  rollupConfig: {
    output: {
      sourcemapExcludeSources: false,
    },
  },
});
