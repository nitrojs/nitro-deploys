import { defineEventHandler } from "h3";

export default defineEventHandler(() => ({
  api: "works",
  generatedAt: new Date().toUTCString(),
}));
