import { defineTestHandler } from "../../utils/test";

// Route rule in nitro.config.ts redirects /base/redirect-source to /base/redirect-target.
export default defineTestHandler(
  "redirect",
  () => "test-page",
  async ({ assert }) => {
    const res = await fetch("/base/redirect-source");
    const text = await res.text();
    assert(res.redirected === true, `Expected redirected=true, got: ${res.redirected}`);
    assert(text === "REDIRECTED", `Expected body "REDIRECTED", got: ${text}`);
  },
);
