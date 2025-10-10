import { defineEventHandler } from "nitro/h3";

export default defineEventHandler(() => ({
  api: "works",
  generatedAt: new Date().toUTCString(),
}));
