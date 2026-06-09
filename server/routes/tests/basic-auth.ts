import { defineTestHandler } from "../../utils/test";

// Route rule in nitro.config.ts protects /base/basic-auth-protected with basic auth.
// The handler echoes `event.context.basicAuth.username`, which is only populated
// when the basicAuth route rule runs successfully. We avoid triggering a 401
// response here because browsers show a native auth popup on 401 + WWW-Authenticate.
export default defineTestHandler(
  "basic-auth",
  () => "test-page",
  async ({ assert }) => {
    const res = await fetch("/base/basic-auth-protected", {
      headers: { Authorization: "Basic " + btoa("admin:nitrorunseverywhere") },
    });
    assert(res.status === 200, `Expected 200 with valid credentials, got: ${res.status}`);
    const text = await res.text();
    assert(text === "admin", `Expected body "admin" (echoed from basicAuth context), got: ${text}`);
  },
);
