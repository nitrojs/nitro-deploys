import { defineNitroConfig } from "nitro/config";

export default defineNitroConfig({
  compatibilityDate: "latest",
  serverDir: "./server",
  imports: {},
  baseURL: "/base",
  publicAssets: [
    {
      baseURL: "/_dist",
      dir: "./public/_dist",
      maxAge: 60 * 60 * 24 * 365,
    },
  ],
  // Experiment: runtime sourcemap support
  unenv: {
    polyfill: ["unenv/polyfill/source-maps"],
  },
});
