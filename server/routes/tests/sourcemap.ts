import { defineTestHandler } from "../../utils/test";

// https://github.com/nitrojs/nitro/issues/1721
export default defineTestHandler(
  "sourcemap",
  async (_event) => {
    return new Error("intentional error").stack;
  },
  async ({ assert, log }) => {
    const res = await fetch("").then((res) => res.text());
    log(`ℹ️ Stack trace: ${res}`);
    assert(res.includes("sourcemap.ts"), "Source map not found in stack trace");
  },
);
