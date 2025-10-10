import { createRequire } from "node:module";
import { defineNitroConfig } from "nitro/config";

const nitroPkg = createRequire(import.meta.url)("nitro/package.json");

export default defineNitroConfig({
  compatibilityDate: "latest",
  srcDir: "./server",
  imports: {},
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
  // Experiment: runtime sourcemap support
  unenv: {
    polyfill: ["unenv/polyfill/source-maps"],
  },
  // esbuild: {
  //   options: {
  //     sourcesContent: true,
  //   },
  // },
  // rollupConfig: {
  //   output: {
  //     sourcemapExcludeSources: false,
  //   },
  // },
});
